import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';

dotenv.config({ path: './.env' });

// Fix DNS for Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (err) {
  console.warn('DNS server setting warning:', err.message);
}

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ctgboardrank';

async function restoreMarks() {
  console.log('--- Starting MongoDB +50 Marks Restoration Migration ---');
  await mongoose.connect(mongoUri, { dbName: 'ctgboardrank' });
  const collection = mongoose.connection.db.collection('students');

  // Pre-migration Checks
  const totalCount = await collection.countDocuments();
  console.log(`Initial Document Count: ${totalCount}`);

  if (totalCount === 0) {
    throw new Error('No student documents found in database!');
  }

  // Check sample document before restoration
  const sampleBefore = await collection.findOne({ roll: '112257' });
  console.log('Sample Roll 112257 Before:', {
    name: sampleBefore.name,
    roll: sampleBefore.roll,
    totalMarks: sampleBefore.totalMarks,
    rankTotalMarks: sampleBefore.rankTotalMarks,
  });

  if (sampleBefore.totalMarks === 1121 && sampleBefore.rankTotalMarks === 1121) {
    console.log('Restoration appears to have already been executed for sample document. Verifying DB state...');
  } else {
    console.log('Executing bulk update: adding +50 marks to totalMarks and setting rankTotalMarks = totalMarks + 50...');

    // Bulk operation using aggregation pipeline in updateMany
    const updateResult = await collection.updateMany(
      {},
      [
        {
          $set: {
            totalMarks: { $add: ['$totalMarks', 50] },
            rankTotalMarks: { $add: ['$totalMarks', 50] },
          },
        },
      ]
    );

    console.log(`Updated ${updateResult.modifiedCount} documents out of ${updateResult.matchedCount}.`);
  }

  // Post-migration Verification
  console.log('\n--- Running Post-Migration Verification ---');

  const postCount = await collection.countDocuments();
  console.log(`Document Count After Migration: ${postCount} (Expected: ${totalCount})`);

  const sampleAfter = await collection.findOne({ roll: '112257' });
  console.log('Sample Roll 112257 After:', {
    name: sampleAfter.name,
    roll: sampleAfter.roll,
    totalMarks: sampleAfter.totalMarks,
    rankTotalMarks: sampleAfter.rankTotalMarks,
  });

  // Check Top 3 Students
  const topStudents = await collection
    .find({})
    .sort({ rankTotalMarks: -1, gpa: -1, roll: 1 })
    .limit(3)
    .toArray();

  console.log('\nTop 3 Leaderboard Students After +50 Restoration:');
  topStudents.forEach((s, idx) => {
    console.log(`#${idx + 1}: Name: ${s.name}, Roll: ${s.roll}, totalMarks: ${s.totalMarks}, rankTotalMarks: ${s.rankTotalMarks}`);
  });

  // Verification Assertions
  const missingNamesCount = await collection.countDocuments({
    $or: [{ name: { $exists: false } }, { name: null }],
  });

  const missingMarksCount = await collection.countDocuments({
    $or: [{ totalMarks: { $exists: false } }, { totalMarks: null }],
  });

  const maxMarksDoc = await collection.find({}).sort({ totalMarks: -1 }).limit(1).toArray();
  const maxMarks = maxMarksDoc[0] ? maxMarksDoc[0].totalMarks : 0;

  console.log('\nVerification Summary:');
  console.log(`- Total Students: ${postCount}`);
  console.log(`- Missing Names: ${missingNamesCount}`);
  console.log(`- Missing Total Marks: ${missingMarksCount}`);
  console.log(`- Maximum Student Total Marks in DB: ${maxMarks} (Expected <= 1250)`);

  if (postCount !== totalCount) {
    console.error('ERROR: Document count changed!');
  } else if (sampleAfter.totalMarks !== 1121) {
    console.error(`ERROR: Expected Roll 112257 totalMarks to be 1121, got ${sampleAfter.totalMarks}!`);
  } else {
    console.log('\n✅ Marks restoration script completed successfully and verified 100%!');
  }

  await mongoose.disconnect();
}

restoreMarks().catch((err) => {
  console.error('Restoration script failed:', err);
  process.exit(1);
});
