import { Student } from '../models/Student.js';

const SUBJECT_MAP = {
  '101': 'BANGLA',
  '107': 'ENGLISH',
  '109': 'MATHEMATICS',
  '110': 'GEOGRAPHY AND ENVIRONMENT',
  '111': 'ISLAM AND MORAL EDUCATION',
  '112': 'HINDU RELIGION AND MORAL EDUCATION',
  '113': 'BUDDHIST RELIGION AND MORAL EDUCATION',
  '114': 'CHRISTIAN RELIGION AND MORAL EDUCATION',
  '126': 'HIGHER MATHEMATICS',
  '127': 'GENERAL SCIENCE',
  '134': 'AGRICULTURE STUDIES',
  '136': 'PHYSICS',
  '137': 'CHEMISTRY',
  '138': 'BIOLOGY',
  '140': 'CIVICS AND CITIZENSHIP',
  '141': 'ARTS AND CRAFTS',
  '143': 'BUSINESS ENTREPRENEURSHIP',
  '146': 'ACCOUNTING',
  '150': 'BANGLADESH AND GLOBAL STUDIES',
  '151': 'HOME SCIENCE',
  '152': 'FINANCE AND BANKING',
  '153': 'ECONOMICS',
  '154': 'INFORMATION AND COMMUNICATION TECHNOLOGY',
};

const calculateSubjectGrade = (code, mark) => {
  if (mark === undefined || mark === null) return '—';
  const m = Number(mark);
  if (isNaN(m)) return '—';

  if (code === '101' || code === '107') {
    if (m >= 160) return 'A+';
    if (m >= 140) return 'A';
    if (m >= 120) return 'A-';
    if (m >= 100) return 'B';
    if (m >= 80) return 'C';
    if (m >= 66) return 'D';
    return 'F';
  }

  if (code === '154') {
    if (m >= 40) return 'A+';
    if (m >= 35) return 'A';
    if (m >= 30) return 'A-';
    if (m >= 25) return 'B';
    if (m >= 20) return 'C';
    if (m >= 17) return 'D';
    return 'F';
  }

  if (m >= 80) return 'A+';
  if (m >= 70) return 'A';
  if (m >= 60) return 'A-';
  if (m >= 50) return 'B';
  if (m >= 40) return 'C';
  if (m >= 33) return 'D';
  return 'F';
};

export const getStudentRank = async (req, res) => {
  try {
    const { roll } = req.params;

    // 1. Indexed lookup for target student in MongoDB
    const student = await Student.findOne({ roll: String(roll) }).lean();

    if (student) {
      const effectiveRankTotalMarks = Math.min(1250, student.rankTotalMarks ?? student.totalMarks);

      // 2. Efficient O(log N) rank calculation using countDocuments formula
      const higherRankCount = await Student.countDocuments({
        $or: [
          { rankTotalMarks: { $gt: effectiveRankTotalMarks } },
          {
            rankTotalMarks: effectiveRankTotalMarks,
            gpa: { $gt: student.gpa },
          },
          {
            rankTotalMarks: effectiveRankTotalMarks,
            gpa: student.gpa,
            roll: { $lt: student.roll },
          },
        ],
      });

      const rawSubjects = student.subjects || {};
      const subjects = Object.keys(rawSubjects)
        .sort((a, b) => Number(a) - Number(b))
        .map((code) => ({
          code,
          subject: SUBJECT_MAP[code] || `SUBJECT (${code})`,
          marks: rawSubjects[code],
          grade: calculateSubjectGrade(code, rawSubjects[code]),
        }));

      const cleanInstitution = (student.institution || 'Chittagong Education Board').replace(/\s*\(\d+\)\s*$/, '');

      return res.status(200).json({
        name: student.name || '',
        roll: student.roll,
        registration: student.registration || '',
        gpa: Number(student.gpa),
        achievement: student.achievement || (Number(student.gpa) === 5 ? 'Golden GPA 5' : `GPA ${Number(student.gpa).toFixed(2)}`),
        totalMarks: student.totalMarks,
        rankTotalMarks: effectiveRankTotalMarks,
        maxMarks: 1250,
        coreSubjectMarks: student.coreSubjectMarks,
        group: student.group || 'Science',
        institution: cleanInstitution,
        rank: higherRankCount + 1,
        boardRank: higherRankCount + 1,
        totalStudents: '126,914',
        subjects,
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
    const limit = Math.min(1000, Math.max(1, parseInt(req.query.limit, 10) || 1000));
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const skip = (page - 1) * limit;
    const { group: reqGroup } = req.query;

    const queryFilter = {};
    if (reqGroup && ALLOWED_GROUPS.includes(reqGroup)) {
      queryFilter.group = reqGroup;
    }

    // Query sorted top students using compound index { rankTotalMarks: -1, gpa: -1, roll: 1 }
    const students = await Student.find(queryFilter)
      .select('name roll gpa group totalMarks rankTotalMarks institution coreSubjectMarks achievement')
      .sort({ rankTotalMarks: -1, gpa: -1, roll: 1 })
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
      rankTotalMarks: Math.min(1250, student.rankTotalMarks ?? student.totalMarks),
      maxMarks: 1250,
      institution: student.institution || 'Chittagong Education Board',
    }));

    return res.status(200).json(leaderboard);

    return res.status(200).json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
  }
};
