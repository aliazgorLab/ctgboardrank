import { Student } from '../models/Student.js';

export const COLLEGE_CUTOFFS = [
  {
    name: 'Chittagong College',
    lastMarks: 1170,
    gender: 'Male/Female',
  },
  {
    name: 'Govt. Hazi Muhammad Mohsin College, Chattogram',
    lastMarks: 1150,
    gender: 'Male/Female',
  },
  {
    name: 'Government City College',
    lastMarks: 1131,
    gender: 'Male/Female',
  },
  {
    name: "Chittagong Government Women's College",
    lastMarks: 1114,
    gender: 'Female',
  },
  {
    name: 'Bakalia Government College',
    lastMarks: 1107,
    gender: 'Male/Female',
  },
  {
    name: 'Chattogram Govt. Model School & College',
    lastMarks: 1100,
    gender: 'Male/Female',
  },
  {
    name: 'Chittagong Collegiate College',
    lastMarks: 1090,
    gender: 'Male',
  },
  {
    name: 'Govt. Ashekane Awlia Degree College',
    lastMarks: 1050,
    gender: 'Male/Female',
  },
];

export const detectGender = (student) => {
  if (student.gender) {
    const g = String(student.gender).toLowerCase();
    if (g.startsWith('f') || g === 'female') return 'Female';
    if (g.startsWith('m') || g === 'male') return 'Male';
  }

  const institution = (student.institution || '').toUpperCase();
  const name = (student.name || '').toUpperCase();

  if (
    institution.includes('GIRLS') ||
    institution.includes('WOMEN') ||
    institution.includes('MOHILA') ||
    institution.includes('MAHILA') ||
    institution.includes('BALIKA')
  ) {
    return 'Female';
  }

  if (
    institution.includes('BOYS') ||
    institution.includes('COLLEGIATE') ||
    institution.includes('BALOK')
  ) {
    return 'Male';
  }

  const femaleKeywords = [
    'AKTER', 'AKHTER', 'JANNAT', 'KHATUN', 'SULTANA', 'BEGUM', 'NUSRAT',
    'TASNEEM', 'TASNIM', 'NUR', 'FATEMA', 'FARZANA', 'SADIA', 'SAYMA',
    'MEHJABIN', 'AFIA', 'ANIKA', 'MAHMUDA', 'SAMIA', 'AISHA', 'SUMAIYA',
    'SUMAYA', 'SABRINA', 'NISHAT', 'MARIA', 'SANJIDA', 'ISRAT', 'ROZA',
    'NAURIN', 'RAISA', 'FABIHA', 'RUKAIYA', 'LAMIA', 'JAHAN', 'FARIHA',
    'HUMAIRA', 'TAHMINA', 'NAZIFA', 'NOWER', 'TOWHIDA', 'BUSHRA', 'FERDOUSI',
    'SYEDA', 'OINDREE', 'SHAMIMA', 'SALMA', 'TANISHA', 'NAYMA', 'TABASSUM',
    'MST', 'MST.', 'MISS', 'MS'
  ];

  const nameWords = name.split(/\s+/);
  for (const word of nameWords) {
    if (femaleKeywords.includes(word)) {
      return 'Female';
    }
  }

  return 'Male';
};

export const calculateChance = (studentMarks, cutoff) => {
  const diff = studentMarks - cutoff;
  if (diff >= 20) return 'Very High';
  if (diff >= 5) return 'High';
  if (diff >= -20) return 'Moderate';
  return 'Low';
};

export const getCollegePrediction = async (req, res) => {
  try {
    const roll = req.params.roll || req.query.roll;

    if (!roll || String(roll).trim() === '') {
      return res.status(400).json({ error: 'Student roll number is required.' });
    }

    const student = await Student.findOne({ roll: String(roll).trim() }).lean();

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    const totalMarks = student.totalMarks ?? 0;
    const gender = detectGender(student);
    const group = student.group || 'Science';

    // Rank lookup for reference
    const effectiveRankTotalMarks = Math.min(1250, student.rankTotalMarks ?? student.totalMarks);
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
    const rank = higherRankCount + 1;

    // Filter eligible colleges based on gender eligibility rules
    const eligibleColleges = COLLEGE_CUTOFFS.filter((col) => {
      if (gender === 'Female' && col.gender === 'Male') return false;
      if (gender === 'Male' && col.gender === 'Female') return false;
      return true;
    });

    let predictedCollegeObj = null;

    // Find highest cutoff college where student totalMarks >= lastMarks
    for (const col of eligibleColleges) {
      if (totalMarks >= col.lastMarks) {
        predictedCollegeObj = col;
        break;
      }
    }

    // If totalMarks is below all cutoffs, pick the highest college where student is within 20 marks
    if (!predictedCollegeObj) {
      for (const col of eligibleColleges) {
        if (totalMarks >= col.lastMarks - 20) {
          predictedCollegeObj = col;
          break;
        }
      }
    }

    // Fallback if below all thresholds
    if (!predictedCollegeObj && eligibleColleges.length > 0) {
      predictedCollegeObj = eligibleColleges[eligibleColleges.length - 1];
    }

    const predictedCollege = predictedCollegeObj ? predictedCollegeObj.name : 'Govt. Ashekane Awlia Degree College';
    const lastCutoff = predictedCollegeObj ? predictedCollegeObj.lastMarks : 1050;
    const chance = predictedCollegeObj ? calculateChance(totalMarks, lastCutoff) : 'Low';

    return res.status(200).json({
      name: student.name || '',
      roll: student.roll,
      group,
      gender,
      totalMarks,
      rank,
      predictedCollege,
      lastCutoff,
      chance,
    });
  } catch (error) {
    console.error('Error fetching college prediction:', error);
    return res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
  }
};
