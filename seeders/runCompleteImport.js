const { User, sequelize } = require('../models');
const bcrypt = require('bcryptjs');
const { lecturersData } = require('./fullUsersData');
const studentsData = require('./allStudentsData.json');

/**
 * COMPLETE USER IMPORT - Uses existing data files
 * Imports all lecturers and students from fullUsersData.js and allStudentsData.json
 * 
 * Run: node seeders/runCompleteImport.js
 */

const parseName = (fullName) => {
  if (!fullName || !fullName.trim()) {
    return { firstName: 'User', lastName: 'Unknown' };
  }
  
  const parts = fullName.trim().split(/\s+/);
  
  if (parts.length === 1) {
    const name = parts[0].length >= 2 ? parts[0] : 'User';
    return { firstName: name, lastName: name };
  }
  
  const firstName = parts[0].length >= 2 ? parts[0] : 'User';
  const lastName = parts.slice(1).join(' ');
  
  return {
    firstName,
    lastName: lastName.length >= 2 ? lastName : firstName
  };
};

const genStudentId = (email) => {
  const timestamp = Date.now().toString().slice(-6);
  const emailPrefix = email.split('@')[0].slice(0, 4).toUpperCase();
  return `STU${emailPrefix}${timestamp}`;
};

async function runCompleteImport() {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║   HBIU COMPLETE USER IMPORT                    ║');
  console.log('║   Using existing data files                    ║');
  console.log('╚════════════════════════════════════════════════╝\n');

  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully\n');

    // Hash password once for all users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Get existing emails to avoid duplicates
    console.log('🔍 Checking for existing users...');
    const existingEmails = new Set(
      (await User.findAll({ attributes: ['email'] })).map(u => u.email.toLowerCase())
    );
    console.log(`   Found ${existingEmails.size} existing users\n`);

    let totalImported = 0;
    let totalSkipped = 0;
    let totalErrors = 0;

    // ======================================
    // PART 1: Import Lecturers
    // ======================================
    console.log('📚 STEP 1: Importing Lecturers');
    console.log('─'.repeat(50));

    const lecturersToImport = [];

    for (const lecturer of lecturersData) {
      if (!lecturer.email || existingEmails.has(lecturer.email.toLowerCase())) {
        totalSkipped++;
        continue;
      }

      try {
        const { firstName, lastName } = parseName(lecturer.name);

        lecturersToImport.push({
          firstName,
          lastName,
          email: lecturer.email,
          password: hashedPassword,
          role: 'lecturer',
          status: lecturer.status?.trim() || 'suspended',
          emailVerified: false,
          collegeId: 1
        });
      } catch (err) {
        console.error(`❌ Error processing lecturer ${lecturer.email}:`, err.message);
        totalErrors++;
      }
    }

    // Bulk insert lecturers in batches
    const lecturerBatchSize = 50;
    for (let i = 0; i < lecturersToImport.length; i += lecturerBatchSize) {
      const batch = lecturersToImport.slice(i, i + lecturerBatchSize);
      await User.bulkCreate(batch, { ignoreDuplicates: true });
      totalImported += batch.length;
      console.log(`  ✓ Imported lecturers ${i + 1} to ${Math.min(i + lecturerBatchSize, lecturersToImport.length)} of ${lecturersToImport.length}`);
    }

    console.log(`✅ Lecturers imported: ${lecturersToImport.length}\n`);

    // ======================================
    // PART 2: Import Students
    // ======================================
    console.log('🎓 STEP 2: Importing Students');
    console.log('─'.repeat(50));

    const studentsToImport = [];

    for (const student of studentsData) {
      if (!student.email || existingEmails.has(student.email.toLowerCase())) {
        totalSkipped++;
        continue;
      }

      try {
        const { firstName, lastName } = parseName(student.name);

        studentsToImport.push({
          firstName,
          lastName,
          email: student.email,
          password: hashedPassword,
          role: 'student',
          status: student.status?.trim() || 'suspended',
          studentId: genStudentId(student.email),
          emailVerified: false,
          collegeId: 1
        });
      } catch (err) {
        console.error(`❌ Error processing student ${student.email}:`, err.message);
        totalErrors++;
      }
    }

    // Bulk insert students in batches
    const studentBatchSize = 100;
    for (let i = 0; i < studentsToImport.length; i += studentBatchSize) {
      const batch = studentsToImport.slice(i, i + studentBatchSize);
      await User.bulkCreate(batch, { ignoreDuplicates: true });
      totalImported += batch.length;
      
      const progress = Math.round(((i + batch.length) / studentsToImport.length) * 100);
      console.log(`  ✓ Imported students ${i + 1} to ${Math.min(i + studentBatchSize, studentsToImport.length)} of ${studentsToImport.length} (${progress}%)`);
    }

    console.log(`✅ Students imported: ${studentsToImport.length}\n`);

    // ======================================
    // SUMMARY
    // ======================================
    console.log('\n╔════════════════════════════════════════════════╗');
    console.log('║              IMPORT SUMMARY                    ║');
    console.log('╠════════════════════════════════════════════════╣');
    console.log(`║ ✅ Total Imported:    ${String(totalImported).padStart(4)}                     ║`);
    console.log(`║ ⏭️  Skipped (exists):  ${String(totalSkipped).padStart(4)}                     ║`);
    console.log(`║ ❌ Errors:            ${String(totalErrors).padStart(4)}                     ║`);
    console.log('╚════════════════════════════════════════════════╝\n');

    // Final database counts
    console.log('📊 DATABASE TOTALS:');
    console.log('─'.repeat(50));
    const totalUsers = await User.count();
    const totalLecturers = await User.count({ where: { role: 'lecturer' } });
    const totalStudents = await User.count({ where: { role: 'student' } });
    const totalAdmins = await User.count({ where: { role: 'admin' } });
    const totalActive = await User.count({ where: { status: 'active' } });
    const totalSuspended = await User.count({ where: { status: 'suspended' } });

    console.log(`   Total Users:      ${totalUsers}`);
    console.log(`   ├─ Lecturers:     ${totalLecturers}`);
    console.log(`   ├─ Students:      ${totalStudents}`);
    console.log(`   └─ Admins:        ${totalAdmins}`);
    console.log(`   `);
    console.log(`   By Status:`);
    console.log(`   ├─ Active:        ${totalActive}`);
    console.log(`   └─ Suspended:     ${totalSuspended}`);
    console.log('');

    console.log('🔐 Default password for all users: password123');
    console.log('✨ Import complete!\n');

    await sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error);
    console.error(error.stack);
    await sequelize.close();
    process.exit(1);
  }
}

if (require.main === module) {
  runCompleteImport();
}

module.exports = runCompleteImport;
