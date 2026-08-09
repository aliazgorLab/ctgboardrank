import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Student } from '../models/Student.js';

dotenv.config();

const mockStudents = [
  // Edge Case B: Identical GPA (5.00) & Identical Total Marks (1142) -> Core Subject Marks Tie-Breaker
  {
    name: 'Farhan Shahriar',
    roll: '104821',
    registration: '2110482913',
    gpa: 5.00,
    totalMarks: 1142,
    coreSubjectMarks: 296, // Higher core marks -> Rank #2
    group: 'Science',
    institution: 'Govt. Muslim High School',
  },
  {
    name: 'Abrar Hossain',
    roll: '102938',
    registration: '2110482910',
    gpa: 5.00,
    totalMarks: 1142,
    coreSubjectMarks: 294, // Lower core marks -> Rank #3
    group: 'Science',
    institution: 'Bakalia Govt. High School',
  },

  // Edge Case A: Identical GPA (5.00), different Total Marks
  {
    name: 'Tahsina Rahman',
    roll: '109842',
    registration: '2110482911',
    gpa: 5.00,
    totalMarks: 1158, // Rank #1 (Highest total marks among 5.00)
    coreSubjectMarks: 298,
    group: 'Science',
    institution: 'Chittagong Collegiate School',
  },
  {
    name: 'Mahir Chowdhury',
    roll: '106543',
    registration: '2110482918',
    gpa: 5.00,
    totalMarks: 1130,
    coreSubjectMarks: 292,
    group: 'Science',
    institution: 'Nasirabad Govt. High School',
  },
  {
    name: 'Nusrat Jahan',
    roll: '107123',
    registration: '2110482914',
    gpa: 5.00,
    totalMarks: 1125,
    coreSubjectMarks: 290,
    group: 'Science',
    institution: 'Dr. Khastagir Govt. Girls High School',
  },
  {
    name: 'Naimul Islam',
    roll: '108765',
    registration: '2110482916',
    gpa: 5.00,
    totalMarks: 1115,
    coreSubjectMarks: 288,
    group: 'Science',
    institution: 'Chittagong Govt. High School',
  },
  {
    name: 'Tanvir Ahmed',
    roll: '105432',
    registration: '2110482912',
    gpa: 5.00,
    totalMarks: 1098,
    coreSubjectMarks: 285,
    group: 'Business Studies',
    institution: 'Government Model High School',
  },

  // Additional Examinee Records
  {
    name: 'Zareen Tasnim',
    roll: '100123',
    registration: '2110482920',
    gpa: 5.00,
    totalMarks: 1090,
    coreSubjectMarks: 282,
    group: 'Science',
    institution: 'Chittagong Collegiate School',
  },
  {
    name: 'Siam Chowdhury',
    roll: '100124',
    registration: '2110482921',
    gpa: 5.00,
    totalMarks: 1085,
    coreSubjectMarks: 280,
    group: 'Science',
    institution: 'Bakalia Govt. High School',
  },
  {
    name: 'Rahat Hossen',
    roll: '102345',
    registration: '2110482919',
    gpa: 4.94,
    totalMarks: 1075,
    coreSubjectMarks: 278,
    group: 'Science',
    institution: 'Govt. Muslim High School',
  },
  {
    name: 'Mehnaz Parveen',
    roll: '100125',
    registration: '2110482922',
    gpa: 4.94,
    totalMarks: 1060,
    coreSubjectMarks: 274,
    group: 'Business Studies',
    institution: 'Chittagong Govt. High School',
  },
  {
    name: 'Sadia Islam',
    roll: '101234',
    registration: '2110482915',
    gpa: 4.89,
    totalMarks: 1050,
    coreSubjectMarks: 270,
    group: 'Humanities',
    institution: 'Kazem Ali High School',
  },
  {
    name: 'Adnan Sami',
    roll: '100126',
    registration: '2110482923',
    gpa: 4.83,
    totalMarks: 1020,
    coreSubjectMarks: 262,
    group: 'Science',
    institution: 'Nasirabad Govt. High School',
  },
  {
    name: 'Samiul Islam',
    roll: '103456',
    registration: '2110482917',
    gpa: 4.78,
    totalMarks: 990,
    coreSubjectMarks: 255,
    group: 'Science',
    institution: 'Agrabad Govt. Colony High School',
  },
  {
    name: 'Fardin Hasan',
    roll: '100127',
    registration: '2110482924',
    gpa: 4.67,
    totalMarks: 940,
    coreSubjectMarks: 240,
    group: 'Humanities',
    institution: 'Chittagong High School',
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ctgboardrank';
    await mongoose.connect(mongoUri);
    console.log('📡 Connected to MongoDB for seeding...');

    // Clear existing student collection
    await Student.deleteMany({});
    console.log('🧹 Existing student records cleared.');

    // Insert new mock data
    const insertedStudents = await Student.insertMany(mockStudents);
    console.log(`✅ Database Seeded Successfully! Inserted ${insertedStudents.length} student records.`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error Seeding Database:', error);
    process.exit(1);
  }
};

seedDatabase();
