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

export const detectGender = (student, reqGender) => {
  // 1. Explicit request query/body parameter (manual fallback selection)
  if (reqGender) {
    const gReq = String(reqGender).trim().toLowerCase();
    if (gReq === 'female' || gReq === 'f') return 'Female';
    if (gReq === 'male' || gReq === 'm') return 'Male';
  }

  // 2. Reliable MongoDB student gender field
  if (student && student.gender) {
    const g = String(student.gender).trim().toLowerCase();
    if (g === 'female' || g === 'f') return 'Female';
    if (g === 'male' || g === 'm') return 'Male';
  }

  // 3. Reliable explicit single-sex institution markers
  const institution = (student?.institution || '').toUpperCase();
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
    institution.includes('BALOK')
  ) {
    return 'Male';
  }

  // NEVER guess gender from student name (student.name keywords removed completely)
  return null;
};

export const predictCollege = (marks, gender) => {
  if (marks >= 1170 && marks <= 1250) {
    return 'Chittagong College';
  } else if (marks >= 1150 && marks <= 1169) {
    return 'Govt. Hazi Muhammad Mohsin College, Chattogram';
  } else if (marks >= 1131 && marks <= 1149) {
    return 'Government City College';
  }
  // Female only
  else if (gender === 'Female' && marks >= 1114 && marks <= 1130) {
    return "Chittagong Government Women's College";
  }
  // Male and Female
  else if (marks >= 1107 && marks <= 1130) {
    return 'Bakalia Government College';
  } else if (marks >= 1100 && marks <= 1106) {
    return 'Chattogram Govt. Model School & College';
  }
  // Male only
  else if (gender === 'Male' && marks >= 1090 && marks <= 1099) {
    return 'Chittagong Collegiate College';
  }
  // Male only
  else if (gender === 'Male' && marks >= 1050 && marks <= 1089) {
    return 'Govt. Ashekane Awlia Degree College';
  }
  // Female
  else if (gender === 'Female' && marks >= 1050 && marks <= 1099) {
    return 'Govt. Ashekane Awlia Degree College';
  } else {
    return 'No Government College Prediction Available';
  }
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
    const reqGender = req.query.gender || req.body?.gender;

    if (!roll || String(roll).trim() === '') {
      return res.status(400).json({ error: 'Student roll number is required.' });
    }

    const student = await Student.findOne({ roll: String(roll).trim() }).lean();

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    const totalMarks = student.totalMarks ?? 0;
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

    const gender = detectGender(student, reqGender);

    if (!gender) {
      return res.status(200).json({
        name: student.name || '',
        roll: student.roll,
        group,
        gender: null,
        genderConfirmed: false,
        totalMarks,
        marks: totalMarks,
        predictionAvailable: false,
        message: 'Gender information unavailable. Please verify manually.',
      });
    }

    const predictedCollege = predictCollege(totalMarks, gender);

    const collegeCutoffMap = {
      'Chittagong College': 1170,
      'Govt. Hazi Muhammad Mohsin College, Chattogram': 1150,
      'Government City College': 1131,
      "Chittagong Government Women's College": 1114,
      'Bakalia Government College': 1107,
      'Chattogram Govt. Model School & College': 1100,
      'Chittagong Collegiate College': 1090,
      'Govt. Ashekane Awlia Degree College': 1050,
    };

    const cutoff = collegeCutoffMap[predictedCollege] || 1050;
    const chance = calculateChance(totalMarks, cutoff);

    return res.status(200).json({
      name: student.name || '',
      roll: student.roll,
      group,
      gender,
      genderConfirmed: true,
      totalMarks,
      marks: totalMarks,
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


