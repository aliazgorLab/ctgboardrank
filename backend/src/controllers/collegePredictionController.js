import { Student } from '../models/Student.js';

export const GOVT_SCIENCE_COLLEGES = [
  {
    name: 'Chittagong College',
    seats: 660,
    genderEligibility: 'Male & Female',
    startRank: 1,
    endRank: 660,
    chance: 'Very High',
    seatRange: '1-660',
    medal: '🥇',
  },
  {
    name: 'Govt. Hazi Muhammad Mohsin College, Chattogram',
    seats: 650,
    genderEligibility: 'Male & Female',
    startRank: 661,
    endRank: 1310,
    chance: 'Very High',
    seatRange: '661-1310',
    medal: '🥈',
  },
  {
    name: 'Government City College',
    seats: 700,
    genderEligibility: 'Male & Female',
    startRank: 1311,
    endRank: 2010,
    chance: 'High',
    seatRange: '1311-2010',
    medal: '🥉',
  },
  {
    name: "Chittagong Government Women's College",
    seats: 600,
    genderEligibility: 'Female Only',
    startRank: 2011,
    endRank: 2610,
    chance: 'High',
    seatRange: '2011-2610',
    medal: '🏫',
  },
  {
    name: 'Bakalia Government College',
    seats: 450,
    genderEligibility: 'Male & Female',
    startRank: 2611,
    endRank: 3060,
    chance: 'Moderate',
    seatRange: '2611-3060',
    medal: '🏫',
  },
  {
    name: 'Chattogram Govt. Model School & College',
    seats: 450,
    genderEligibility: 'Male & Female',
    startRank: 3061,
    endRank: 3510,
    chance: 'Moderate',
    seatRange: '3061-3510',
    medal: '🏫',
  },
  {
    name: 'Chittagong Collegiate College',
    seats: 200,
    genderEligibility: 'Male Only',
    startRank: 3511,
    endRank: 3710,
    chance: 'Moderate',
    seatRange: '3511-3710',
    medal: '🏫',
  },
  {
    name: 'Govt. Ashekane Awlia Degree College',
    seats: 100,
    genderEligibility: 'Male & Female',
    startRank: 3711,
    endRank: 3810,
    chance: 'Moderate',
    seatRange: '3711-3810',
    medal: '🏫',
  },
];

// Female Priority Order:
// 1. Chittagong Government Women's College (600) - Female Only
// 2. Chittagong College (660) - Male & Female
// 3. Govt. Hazi Muhammad Mohsin College, Chattogram (650) - Male & Female
// 4. Government City College (700) - Male & Female
// 5. Bakalia Government College (450) - Male & Female
// 6. Chattogram Govt. Model School & College (450) - Male & Female
// 7. Govt. Ashekane Awlia Degree College (100) - Male & Female
// (Excludes Chittagong Collegiate College - Male Only)
const FEMALE_COLLEGE_ORDER = [
  "Chittagong Government Women's College",
  'Chittagong College',
  'Govt. Hazi Muhammad Mohsin College, Chattogram',
  'Government City College',
  'Bakalia Government College',
  'Chattogram Govt. Model School & College',
  'Govt. Ashekane Awlia Degree College',
];

// Male Priority Order:
// 1. Chittagong College (660) - Male & Female
// 2. Govt. Hazi Muhammad Mohsin College, Chattogram (650) - Male & Female
// 3. Government City College (700) - Male & Female
// 4. Bakalia Government College (450) - Male & Female
// 5. Chattogram Govt. Model School & College (450) - Male & Female
// 6. Chittagong Collegiate College (200) - Male Only
// 7. Govt. Ashekane Awlia Degree College (100) - Male & Female
// (Excludes Chittagong Government Women's College - Female Only)
const MALE_COLLEGE_ORDER = [
  'Chittagong College',
  'Govt. Hazi Muhammad Mohsin College, Chattogram',
  'Government City College',
  'Bakalia Government College',
  'Chattogram Govt. Model School & College',
  'Chittagong Collegiate College',
  'Govt. Ashekane Awlia Degree College',
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

    const effectiveRankTotalMarks = Math.min(
      1300,
      student.rankTotalMarks || student.totalMarks + 150
    );

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
    const group = student.group || 'Science';
    const gender = detectGender(student);

    let predictedCollege = 'Private / Non-Govt. College';
    let chance = 'Low';
    let seatRange = '3811+';

    if (group === 'Science') {
      const targetOrder = gender === 'Female' ? FEMALE_COLLEGE_ORDER : MALE_COLLEGE_ORDER;
      const eligibleColleges = targetOrder
        .map((name) => GOVT_SCIENCE_COLLEGES.find((c) => c.name === name))
        .filter(Boolean);

      let cumulativeSeats = 0;
      let matched = null;

      for (const col of eligibleColleges) {
        const start = cumulativeSeats + 1;
        const end = cumulativeSeats + col.seats;
        cumulativeSeats = end;

        if (rank <= end) {
          matched = {
            ...col,
            startRank: start,
            endRank: end,
            seatRange: `${start}-${end}`,
          };
          break;
        }
      }

      if (matched) {
        predictedCollege = matched.name;
        chance = matched.chance;
        seatRange = matched.seatRange;
      }
    } else {
      predictedCollege = 'Science Group Only';
      chance = 'N/A';
      seatRange = 'N/A';
    }

    return res.status(200).json({
      name: student.name || '',
      roll: student.roll,
      group,
      gender,
      rank,
      predictedCollege,
      chance,
      seatRange,
    });
  } catch (error) {
    console.error('Error fetching college prediction:', error);
    return res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
  }
};
