import { Student } from '../models/Student.js';
import { mockData } from '../models/mockData.js';

export const getStudentRank = async (req, res) => {
  try {
    const { roll } = req.params;

    // 1. Indexed lookup for target student in MongoDB
    const student = await Student.findOne({ roll: String(roll) }).lean();

    if (student) {
      // 2. Efficient O(log N) rank calculation using countDocuments formula
      const higherRankCount = await Student.countDocuments({
        $or: [
          { gpa: { $gt: student.gpa } },
          {
            gpa: student.gpa,
            totalMarks: { $gt: student.totalMarks },
          },
          {
            gpa: student.gpa,
            totalMarks: student.totalMarks,
            coreSubjectMarks: { $gt: student.coreSubjectMarks },
          },
        ],
      });

      return res.status(200).json({
        name: student.name,
        roll: student.roll,
        registration: student.registration,
        gpa: Number(student.gpa),
        achievement: student.achievement || (Number(student.gpa) === 5 ? 'Golden GPA 5' : `GPA ${Number(student.gpa).toFixed(2)}`),
        totalMarks: student.totalMarks,
        coreSubjectMarks: student.coreSubjectMarks,
        group: student.group || 'Science',
        institution: student.institution || 'Chittagong Govt. High School',
        boardRank: higherRankCount + 1,
        totalStudents: '142,000+',
      });
    }

    // 3. Fallback to mockData if DB is empty or unseeded
    const dbCount = await Student.countDocuments().catch(() => 0);
    if (dbCount === 0) {
      const mockStudent = mockData.find((s) => String(s.roll) === String(roll));
      if (mockStudent) {
        const higherCountMock = mockData.filter(
          (s) =>
            s.gpa > mockStudent.gpa ||
            (s.gpa === mockStudent.gpa && s.totalMarks > mockStudent.totalMarks) ||
            (s.gpa === mockStudent.gpa &&
              s.totalMarks === mockStudent.totalMarks &&
              s.coreSubjectMarks > mockStudent.coreSubjectMarks)
        ).length;

        return res.status(200).json({
          name: mockStudent.name,
          roll: mockStudent.roll,
          registration: mockStudent.registration,
          gpa: Number(mockStudent.gpa),
          achievement: mockStudent.achievement || (Number(mockStudent.gpa) === 5 ? 'Golden GPA 5' : `GPA ${Number(mockStudent.gpa).toFixed(2)}`),
          totalMarks: mockStudent.totalMarks,
          coreSubjectMarks: mockStudent.coreSubjectMarks,
          group: mockStudent.group || 'Science',
          institution: mockStudent.institution || 'Chittagong Govt. High School',
          boardRank: higherCountMock + 1,
          totalStudents: '142,000+',
        });
      }
    }

    return res.status(404).json({ error: 'Student not found.' });
  } catch (error) {
    console.error('Error fetching student rank:', error);
    return res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
  }
};

const ALLOWED_GROUPS = ['Science', 'Humanities', 'Business Studies'];

export const getLeaderboard = async (req, res) => {
  try {
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 100);
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const skip = (page - 1) * limit;
    const { group: reqGroup } = req.query;

    const queryFilter = {};
    if (reqGroup && ALLOWED_GROUPS.includes(reqGroup)) {
      queryFilter.group = reqGroup;
    }

    // Query sorted top students using compound index { group: 1, gpa: -1, totalMarks: -1, coreSubjectMarks: -1 }
    let students = await Student.find(queryFilter)
      .sort({ gpa: -1, totalMarks: -1, coreSubjectMarks: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Fallback to mockData if DB is empty / unseeded
    if (!students || students.length === 0) {
      let mockList = [...mockData];
      if (reqGroup && ALLOWED_GROUPS.includes(reqGroup)) {
        mockList = mockList.filter((s) => s.group === reqGroup);
      }

      const sortedMock = mockList.sort((a, b) => {
        if (b.gpa !== a.gpa) return b.gpa - a.gpa;
        if (b.totalMarks !== a.totalMarks) return b.totalMarks - a.totalMarks;
        return b.coreSubjectMarks - a.coreSubjectMarks;
      });

      students = sortedMock.slice(skip, skip + limit);
    }

    const leaderboard = students.map((student, idx) => ({
      rank: skip + idx + 1,
      name: student.name,
      roll: student.roll,
      gpa: Number(student.gpa),
      achievement: student.achievement || (Number(student.gpa) === 5 ? 'Golden GPA 5' : `GPA ${Number(student.gpa).toFixed(2)}`),
      group: student.group || 'Science',
      totalMarks: student.totalMarks,
      institution: student.institution || 'Chittagong Govt. High School',
    }));

    return res.status(200).json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
  }
};
