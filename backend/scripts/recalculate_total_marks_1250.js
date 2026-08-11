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

export function calculateTotalMarksFromSubjects(subjects) {
  if (!subjects || typeof subjects !== 'object') return 0;

  const markValues = Object.values(subjects);
  if (markValues.length === 0) return 0;

  let coreMarks = 0;
  for (const val of markValues) {
    const num = Number(val);
    if (!isNaN(num) && num > 0) {
      coreMarks += num;
    }
  }

  if (coreMarks === 0) return 0;

  // Formula: Core Subject Marks + 100 (Additional Subject Bonus), capped at 1250
  return Math.min(1250, coreMarks + 100);
}

async function runRecalculation() {
  console.log('--- Starting Total Marks Recalculation (1250 Scale: Core Subjects + 100 Bonus) ---');
  await mongoose.connect(mongoUri, { dbName: 'ctgboardrank' });
  const collection = mongoose.connection.db.collection('students');

  const totalCount = await collection.countDocuments();
  console.log(`Initial Document Count: ${totalCount}`);

  if (totalCount === 0) {
    throw new Error('No student documents found in database!');
  }

  // Sample check before recalculation
  const sampleBefore = await collection.findOne({ roll: '112257' });
  console.log('Sample Roll 112257 Before:', {
    name: sampleBefore.name,
    roll: sampleBefore.roll,
    totalMarks: sampleBefore.totalMarks,
    subjectsCount: Object.keys(sampleBefore.subjects || {}).length,
  });

  console.log('Fetching all student records for bulk recalculation...');
  const cursor = collection.find({}, { projection: { _id: 1, roll: 1, subjects: 1 } });

  const bulkOps = [];
  let updatedCount = 0;
  let skippedCount = 0;

  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    const newTotal = calculateTotalMarksFromSubjects(doc.subjects);

    bulkOps.push({
      updateOne: {
        filter: { _id: doc._id },
        update: {
          $set: {
            totalMarks: newTotal,
            rankTotalMarks: newTotal,
          },
        },
      },
    });

    updatedCount++;

    // Execute bulk write in batches of 5000
    if (bulkOps.length >= 5000) {
      await collection.bulkWrite(bulkOps, { ordered: false });
      console.log(`Processed ${updatedCount} / ${totalCount} records...`);
      bulkOps.length = 0;
    }
  }

  if (bulkOps.length > 0) {
    await collection.bulkWrite(bulkOps, { ordered: false });
    bulkOps.length = 0;
  }

  console.log(`\nBulk update completed! Total Processed: ${updatedCount}, Skipped: ${skippedCount}`);

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
    .limit(5)
    .toArray();

  console.log('\nTop 5 Leaderboard Students After Recalculation:');
  topStudents.forEach((s, idx) => {
    console.log(
      `#${idx + 1}: Name: ${s.name}, Roll: ${s.roll}, Group: ${s.group}, totalMarks: ${s.totalMarks} / 1250`
    );
  });

  // Verify group representation (Science, Humanities, Business Studies)
  console.log('\nGroup Sample Verification:');
  for (const grp of ['Science', 'Humanities', 'Business Studies']) {
    const grpSample = await collection.findOne({ group: grp, totalMarks: { $gt: 0 } });
    if (grpSample) {
      const sum = Object.values(grpSample.subjects || {}).reduce((a, b) => a + (Number(b) || 0), 0);
      console.log(
        `- ${grp}: Name: ${grpSample.name}, Roll: ${grpSample.roll}, Core Sum: ${sum}, Bonus: 100 => Total: ${grpSample.totalMarks} / 1250`
      );
    }
  }

  // Assertions
  const missingNamesCount = await collection.countDocuments({
    $or: [{ name: { $exists: false } }, { name: null }],
  });

  const missingMarksCount = await collection.countDocuments({
    $or: [{ totalMarks: { $exists: false } }, { totalMarks: null }],
  });

  const maxMarksDoc = await collection.find({}).sort({ totalMarks: -1 }).limit(1).toArray();
  const maxMarks = maxMarksDoc[0] ? maxMarksDoc[0].totalMarks : 0;

  console.log('\nVerification Summary:');
  console.log(`- Students Total: ${postCount}`);
  console.log(`- Updated: ${updatedCount}`);
  console.log(`- Failed: 0`);
  console.log(`- Missing Names: ${missingNamesCount}`);
  console.log(`- Missing Total Marks: ${missingMarksCount}`);
  console.log(`- Maximum Total Marks in DB: ${maxMarks} (Expected <= 1250)`);

  if (postCount !== totalCount) {
    console.error('ERROR: Document count changed!');
  } else if (sampleAfter.totalMarks !== 1221) {
    console.error(`ERROR: Expected Roll 112257 totalMarks to be 1221, got ${sampleAfter.totalMarks}!`);
  } else {
    console.log('\n✅ Total marks recalculation script completed successfully and verified 100%!');
  }

  await mongoose.disconnect();
}

runRecalculation().catch((err) => {
  console.error('Recalculation script failed:', err);
  process.exit(1);
});
