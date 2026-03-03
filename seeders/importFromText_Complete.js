const { User, sequelize } = require('../models');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

/**
 * HBIU Complete User Import Script 
 * Imports 3,245 users (121 lecturers + 3,124 students)
 * 
 * Usage: 
 * 1. Save your user data to 'users_data.txt' in this directory
 * 2. Run: node importFromText_Complete.js
 */

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

const genStudentId = (email) => {
  const ts = Date.now().toString().slice(-6);
  const prefix = email.split('@')[0].slice(0, 4).toUpperCase();
  return `STU${prefix}${ts}`;
};

async function importFromTextFile() {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║   HBIU COMPLETE USER IMPORT FROM TEXT        ║');
  console.log('╚══════════════════════════════════════════════╝\n');

  const textFilePath = path.join(__dirname, 'users_data.txt');
  
  // Check if file exists
  if (!fs.existsSync(textFilePath)) {
    console.log('❌ File not found: users_data.txt');
    console.log('\n📝 Please create users_data.txt with your user data.');
    console.log('   Format: Name,Email,Role,Status');
    console.log('   Example: John Doe,john@email.com,student,suspended\n');
    process.exit(1);
  }

  try {
    const fileContent = fs.readFileSync(textFilePath, 'utf8');
    const lines = fileContent.split('\n').filter(line => line.trim());
    
    console.log(`📄 Found ${lines.length} lines in file\n`);

    const password = await bcrypt.hash('password123', 10);
    let imported = 0, skipped = 0, errors = 0;

    // Get existing emails
    console.log('🔍 Checking existing users...');
    const existingEmails = new Set(
      (await User.findAll({ attributes: ['email'] })).map(u => u.email.toLowerCase())
    );
    console.log(`   Found ${existingEmails.size} existing users\n`);

    const usersToCreate = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      try {
        // Parse line - expecting format from the user's data
        // Can be: "Name,Email,Status" or "Name,Email,Degree,Status"
        const parts = line.split(',').map(p => p.trim());
        
        if (parts.length < 2) {
          errors++;
          continue;
        }

        const name = parts[0];
        const email = parts[1];
        
        // Detect role from section or email
        let role = 'student'; // default
        let status = 'suspended'; // default
        
        // If line contains "Lecturer" or "@hbiu" it's likely staff
        if (line.toLowerCase().includes('lecturer') || email.includes('@hbiu') || parts.length > 2 && parts[2].toLowerCase() === 'lecturer') {
          role = 'lecturer';
        }
        
        // Get status from last part
        if (parts[parts.length - 1].toLowerCase().includes('active')) {
          status = 'active';
        }

        // Skip if exists
        if (existingEmails.has(email.toLowerCase())) {
          skipped++;
          continue;
        }

        const { firstName, lastName } = parseName(name);

        usersToCreate.push({
          firstName,
          lastName,
          email,
          password,
          role,
          status,
          studentId: role === 'student' ? genStudentId(email) : null
        });

        // Bulk insert every 100 users
        if (usersToCreate.length >= 100) {
          await User.bulkCreate(usersToCreate);
          imported += usersToCreate.length;
          usersToCreate.length = 0; // Clear array
          
          const progress = Math.round((i / lines.length) * 100);
          console.log(`📈 Progress: ${progress}% (${imported} imported, ${skipped} skipped)`);
        }

      } catch (err) {
        console.error(`❌ Error on line ${i + 1}:`, err.message);
        errors++;
      }
    }

    // Insert remaining users
    if (usersToCreate.length > 0) {
      await User.bulkCreate(usersToCreate);
      imported += usersToCreate.length;
    }

    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║           IMPORT SUMMARY                     ║');
    console.log('╠══════════════════════════════════════════════╣');
    console.log(`║ ✅ Imported: ${imported}                              ║`);
    console.log(`║ ⏭️  Skipped:  ${skipped}                               ║`);
    console.log(`║ ❌ Errors:   ${errors}                                ║`);
    console.log('╚══════════════════════════════════════════════╝\n');

    // Final database count
    const total = await User.count();
    const lecturers =await User.count({ where: { role: 'lecturer' } });
    const students = await User.count({ where: { role: 'student' } });

    console.log('📊 Database Totals:');
    console.log(`   Total Users: ${total}`);
    console.log(`   Lecturers: ${lecturers}`);
    console.log(`   Students: ${students}\n`);

    console.log('✨ Import complete!');
    console.log('🔐 Default password for all users: password123\n');

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }

  process.exit(0);
}

if (require.main === module) {
  importFromTextFile();
}

module.exports = { importFromTextFile };
