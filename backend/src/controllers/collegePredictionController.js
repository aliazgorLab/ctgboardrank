import { Student } from '../models/Student.js';

export const GOVT_COLLEGES = [
  {
    name: 'Chittagong College',
    cutoff: 1170,
    seats: 660,
    gender: ['Male', 'Female'],
  },
  {
    name: 'Govt. Hazi Muhammad Mohsin College, Chattogram',
    cutoff: 1150,
    seats: 650,
    gender: ['Male', 'Female'],
  },
  {
    name: 'Government City College',
    cutoff: 1131,
    seats: 700,
    gender: ['Male', 'Female'],
  },
  {
    name: "Chittagong Government Women's College",
    cutoff: 1114,
    seats: 600,
    gender: ['Female'],
  },
  {
    name: 'Bakalia Government College',
    cutoff: 1107,
    seats: 450,
    gender: ['Male', 'Female'],
  },
  {
    name: 'Chattogram Govt. Model School & College',
    cutoff: 1100,
    seats: 450,
    gender: ['Male', 'Female'],
  },
  {
    name: 'Chittagong Collegiate College',
    cutoff: 1090,
    seats: 200,
    gender: ['Male'],
  },
  {
    name: 'Govt. Ashekane Awlia Degree College',
    cutoff: 1050,
    seats: 100,
    gender: ['Male', 'Female'],
  },
];

export const COLLEGE_CUTOFFS = GOVT_COLLEGES;

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

  const nameWords = name.split(/\s+/);

  const maleKeywords = [
    'MD', 'MD.', 'MUHAMMAD', 'MOHAMMAD', 'MOHAMMED', 'AHMED', 'SYED', 'SIUM', 'SAYED'
  ];
  for (const word of nameWords) {
    if (maleKeywords.includes(word)) {
      return 'Male';
    }
  }

  const femaleKeywords = [
    'AKTER', 'AKHTER', 'JANNAT', 'KHATUN', 'SULTANA', 'BEGUM', 'NUSRAT',
    'TASNEEM', 'TASNIM', 'FATEMA', 'FARZANA', 'SADIA', 'SAYMA',
    'MEHJABIN', 'AFIA', 'ANIKA', 'MAHMUDA', 'SAMIA', 'AISHA', 'SUMAIYA',
    'SUMAYA', 'SABRINA', 'NISHAT', 'MARIA', 'SANJIDA', 'ISRAT', 'ROZA',
    'NAURIN', 'RAISA', 'FABIHA', 'RUKAIYA', 'LAMIA', 'JAHAN', 'FARIHA',
    'HUMAIRA', 'TAHMINA', 'NAZIFA', 'NOWER', 'TOWHIDA', 'BUSHRA', 'FERDOUSI',
    'SYEDA', 'OINDREE', 'SHAMIMA', 'SALMA', 'TANISHA', 'NAYMA', 'TABASSUM',
    'MST', 'MST.', 'MISS', 'MS'
  ];

  for (const word of nameWords) {
    if (femaleKeywords.includes(word)) {
      return 'Female';
    }
  }

  return 'Male';
};

export const calculateChance = (studentMarks, cutoff) => {
  const difference = studentMarks - cutoff;

  if (difference >= 30) return 'Very High';
  if (difference >= 10) return 'High';
  if (difference >= 0) return 'Good Chance';
  if (difference >= -10) return 'Competitive';
  return 'Low Chance';
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

    // Group Eligibility Check: Prediction currently available only for Science group students
    if (group !== 'Science') {
      return res.status(200).json({
        name: student.name || '',
        roll: student.roll,
        group,
        predictionAvailable: false,
        message: 'Government college prediction is currently available only for Science group students.',
      });
    }

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

    // Step 1: Filter Gender Eligibility
    const eligibleColleges = GOVT_COLLEGES.filter((col) => col.gender.includes(gender));

    // Step 2: Compare Marks
    let predictedCollegeObj = null;
    for (const col of eligibleColleges) {
      if (totalMarks >= col.cutoff) {
        predictedCollegeObj = col;
        break;
      }
    }

    if (!predictedCollegeObj && eligibleColleges.length > 0) {
      predictedCollegeObj = eligibleColleges[eligibleColleges.length - 1];
    }

    const predictedCollege = predictedCollegeObj ? predictedCollegeObj.name : 'Govt. Ashekane Awlia Degree College';
    const cutoff = predictedCollegeObj ? predictedCollegeObj.cutoff : 1050;
    const chance = calculateChance(totalMarks, cutoff);

    return res.status(200).json({
      name: student.name || '',
      roll: student.roll,
      group,
      gender,
      totalMarks,
      marks: totalMarks,
      rank,
      predictedCollege,
      cutoff,
      lastCutoff: cutoff,
      chance,
      predictionAvailable: true,
    });
  } catch (error) {
    console.error('Error fetching college prediction:', error);
    return res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
  }
};

