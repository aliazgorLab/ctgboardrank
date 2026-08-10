import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    roll: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    registration: {
      type: String,
      required: true,
      trim: true,
    },
    gpa: {
      type: Number,
      required: true,
    },
    achievement: {
      type: String,
      default: '',
      trim: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    rankTotalMarks: {
      type: Number,
      required: true,
    },
    coreSubjectMarks: {
      type: Number,
      required: true,
    },
    group: {
      type: String,
      enum: ['Science', 'Humanities', 'Business Studies'],
      default: 'Science',
      index: true,
      trim: true,
    },
    institution: {
      type: String,
      default: 'Chittagong Govt. High School',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Global ranking compound index for Top 1000
studentSchema.index({ rankTotalMarks: -1, gpa: -1, coreSubjectMarks: -1, roll: 1 });

// Group-filtered ranking compound index for Top 1000
studentSchema.index({ group: 1, rankTotalMarks: -1, gpa: -1, coreSubjectMarks: -1, roll: 1 });

export const Student = mongoose.model('Student', studentSchema);
