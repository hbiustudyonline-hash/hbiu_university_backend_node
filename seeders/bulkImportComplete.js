const { User, sequelize } = require('../models');
const bcrypt = require('bcrypt

');

// Helper: Parse name (minimum 2 chars)
const parseName = (name) => {
  if (!name || !name.trim()) return { firstName: 'User', lastName: 'Unknown' };
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    const n = parts[0].length >= 2 ? parts[0] : 'User';
    return { firstName: n, lastName: n };
  }
  const first = parts[0].length >= 2 ? parts[0] : 'User';
  const last = parts.slice(1).join(' ');
  return { 
    firstName: first, 
    lastName: last.length >= 2 ? last : 'Unknown' 
  };
};

// Helper: Generate student ID
const genStudentId = (email) => {
  const ts = Date.now().toString().slice(-6);
  const prefix = email.split('@')[0].slice(0, 4).toUpperCase();
  return `STU${prefix}${ts}`;
};

// Complete import with progress tracking
async function importAllUsers() {
  console.log('\n╔═══════════════════════════════════════════════════╗');
  console.log('║     HBIU BULK USER IMPORT - 3,245 USERS          ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  const password = await bcrypt.hash('password123', 10);
  let imported = 0, skipped = 0, errors = 0;

  try {
    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      console.log('📊 Checking existing users...');
      const existingEmails = new Set(
        (await User.findAll({ attributes: ['email'] })).map(u => u.email.toLowerCase())
      );
      console.log(`   Found ${existingEmails.size} existing users\n`);

      // Import function
      const importBatch = async (users, type) => {
        console.log(`\n=== Importing ${type} ===`);
        const toCreate = [];

        for (const user of users) {
          if (existingEmails.has(user.email.toLowerCase())) {
            skipped++;
            continue;
          }

          const { firstName, lastName } = parseName(user.name);
          toCreate.push({
            firstName,
            lastName,
            email: user.email,
            password,
            role: user.role,
            status: user.status || 'suspended',
            studentId: user.role === 'student' ? genStudentId(user.email) : null
          });
        }

        if (toCreate.length > 0) {
          // Insert in chunks of 100
          for (let i = 0; i < toCreate.length; i += 100) {
            const chunk = toCreate.slice(i, i + 100);
            await User.bulkCreate(chunk, { transaction });
            imported += chunk.length;
            
            const progress = Math.round((imported / 3245) * 100);
            console.log(`   ✅ Progress: ${progress}% (${imported}/3245)`);
          }
        }

        console.log(`   📊 ${type}: ${toCreate.length} new, ${users.length - toCreate.length} skipped`);
      };

      // LECTURERS (121)
      await importBatch([
        { name: 'Emmy Abunyanga', email: 'abunyangahbiuuganda@gmail.com', role: 'lecturer', status: 'suspended' },
        { name: 'Rita Inukan-Adebayo', email: 'adebayoritat@gmail.com', role: 'lecturer', status: 'suspended' },
        { name: 'Adedayo Ruth', email: 'adedayoruthiyabo@gmail.com', role: 'lecturer', status: 'active' },
        // ... (include all 121 lecturers - truncated for brevity)
        { name: 'Max Y', email: 'youngimacs@gmail.com', role: 'lecturer', status: 'suspended' }
      ], 'Lecturers');

      // STUDENTS (3124) - First batch
      console.log('\n=== Starting Student Import (3,124 total) ===\n');
      
      const studentsBatch1 = [
        { name: '03olamidevictor', email: '03olamidevictor@gmail.com', role: 'student' },
        { name: 'Ahmed', email: '076247964sons@gmail.com', role: 'student' },
        { name: 'Samson Saba', email: '1derfulglosam4christ@gmail.com', role: 'student' },
        // Add first 500 students here...
      ];

      await importBatch(studentsBatch1, 'Students (Batch 1/7)');

      // Commit transaction
      await transaction.commit();

      console.log('\n╔═══════════════════════════════════════════════════╗');
      console.log('║              IMPORT COMPLETE                      ║');
      console.log('╠═══════════════════════════════════════════════════╣');
      console.log(`║ ✅ Imported: ${imported}                                   ║`);
      console.log(`║ ⏭️  Skipped:  ${skipped}                                    ║`);
      console.log(`║ ❌ Errors:   ${errors}                                     ║`);
      console.log('╚═══════════════════════════════════════════════════╝\n');

    } catch (err) {
      await transaction.rollback();
      throw err;
    }

  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    process.exit(1);
  }

  // Final count
  const total = await User.count();
  const lecturers = await User.count({ where: { role: 'lecturer' } });
  const students = await User.count({ where: { role: 'student' } });

  console.log('📊 Final Database Count:');
  console.log(`   Total: ${total}`);
  console.log(`   Lecturers: ${lecturers}`);
  console.log(`   Students: ${students}\n`);

  process.exit(0);
}

if (require.main === module) {
  importAllUsers();
}

module.exports = { importAllUsers };
