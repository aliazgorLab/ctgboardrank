import { Student } from '../models/Student.js';

export const getStudentRank = async (req, res) => {
  try {
    const { roll } = req.params;

    // 1. Indexed lookup for target student in MongoDB
    const student = await Student.findOne({ roll: String(roll) }).lean();

    if (student) {
      const effectiveRankTotalMarks = student.rankTotalMarks || (student.totalMarks + 150);

      // 2. Efficient O(log N) rank calculation using countDocuments formula with rankTotalMarks
      const higherRankCount = await Student.countDocuments({
        $or: [
          { gpa: { $gt: student.gpa } },
          {
            gpa: student.gpa,
            rankTotalMarks: { $gt: effectiveRankTotalMarks },
          },
          {
            gpa: student.gpa,
            rankTotalMarks: effectiveRankTotalMarks,
            coreSubjectMarks: { $gt: student.coreSubjectMarks },
          },
        ],
      });

      return res.status(200).json({
        name: student.name || '',
        roll: student.roll,
        registration: student.registration || '',
        gpa: Number(student.gpa),
        achievement: student.achievement || (Number(student.gpa) === 5 ? 'Golden GPA 5' : `GPA ${Number(student.gpa).toFixed(2)}`),
        totalMarks: student.totalMarks,
        rankTotalMarks: effectiveRankTotalMarks,
        coreSubjectMarks: student.coreSubjectMarks,
        group: student.group || 'Science',
        institution: student.institution || 'Chittagong Education Board',
        boardRank: higherRankCount + 1,
        totalStudents: '126,914',
      });
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
    const limit = Math.min(300, Math.max(1, parseInt(req.query.limit, 10) || 300));
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const skip = (page - 1) * limit;
    const { group: reqGroup } = req.query;

    const queryFilter = {};
    if (reqGroup && ALLOWED_GROUPS.includes(reqGroup)) {
      queryFilter.group = reqGroup;
    }

    // Query sorted top students using compound index { gpa: -1, rankTotalMarks: -1, coreSubjectMarks: -1 }
    const students = await Student.find(queryFilter)
      .select('name roll gpa group totalMarks rankTotalMarks institution coreSubjectMarks achievement')
      .sort({ gpa: -1, rankTotalMarks: -1, coreSubjectMarks: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const leaderboard = students.map((student, idx) => ({
      rank: skip + idx + 1,
      name: student.name || '',
      roll: student.roll,
      gpa: Number(student.gpa),
      achievement: student.achievement || (Number(student.gpa) === 5 ? 'Golden GPA 5' : `GPA ${Number(student.gpa).toFixed(2)}`),
      group: student.group || 'Science',
      totalMarks: student.totalMarks,
      rankTotalMarks: student.rankTotalMarks || (student.totalMarks + 150),
      institution: student.institution || 'Chittagong Education Board',
    }));

    return res.status(200).json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
  }
};
