const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { sequelize } = require('../config/database');
const fs = require('fs');

// Parse HTML to extract user data
async function parseHTMLUsers() {
  console.log('📄 Reading HTML file...');
  const htmlPath = 'c:/Users/hoghc/OneDrive/Desktop/hbiu-online-2/extracted_users/TotalUsers3118.html';
  const html = fs.readFileSync(htmlPath, 'utf8');
  
  // Extract all paragraph content
  const regex = /<p class="c1"><span class="c0">(.*?)<\/span><\/p>/g;
  const matches = [...html.matchAll(regex)].map(m => m[1].replace(/&amp;/g, '&'));
  
  console.log(`📊 Extracted ${matches.length} data elements`);
  
  let lecturers = [];
  let students = [];
  
  // State machine for parsing
  let i = 0;
  let inLecturersSection = false;
  let inStudentsSection = false;
  
  while (i < matches.length) {
    const text = matches[i];
    
    // Check for section markers
    if (text === 'Lecturers (121)') {
      inLecturersSection = true;
      inStudentsSection = false;
      // Don't increment i here, let the loop handle it
      continue;
    }
    
    if (text === 'Students (3124)') {
      inLecturersSection = false;
      inStudentsSection = true;
      console.log(`📌 Found Students section at index ${i}`);
      // Don't increment i here, let the loop handle it
      continue;
   }
    
    // Parse lecturer entry: [Initial], [Name], "Lecturer", [Email], [Position...], [Status]
    if (inLecturersSection && matches[i+1] && matches[i+2] === 'Lecturer' && matches[i+3] && matches[i+3].includes('@')) {
      const name = matches[i+1];
      const email = matches[i+3];
      let status = 'active';
      
      // Look ahead for status (within next 5 fields)
      for (let j = i+4; j < i+9 && j < matches.length; j++) {
        if (matches[j] === 'Suspended' || matches[j] === 'Active') {
          status = matches[j].toLowerCase();
          break;
        }
      }
      
      lecturers.push({ name, email, role: 'lecturer', status });
      i += 6; // Skip to next entry
      continue;
    }
    
    // Parse student entry: [Initial], [Name], "Student", [Email], [Program/Status]
    if (inStudentsSection && i+3 < matches.length && matches[i+2] === 'Student' && matches[i+3].includes('@')) {
      const name = matches[i+1];
      const email = matches[i+3];
      let status = 'suspended'; // Default to suspended
      
      // Check if next 1-2 fields contain status
      if (i+4 < matches.length && (matches[i+4] === 'Suspended' || matches[i+4] === 'Active')) {
        status = matches[i+4].toLowerCase();
      } else if (i+5 < matches.length && (matches[i+5] === 'Suspended' || matches[i+5] === 'Active')) {
        status = matches[i+5].toLowerCase();
      }
      
      students.push({ name, email, role: 'student', status });
      
      // Debug first 5 students
      if (students.length <= 5) {
        console.log(`  Found student #${students.length}: ${name} (${email})`);
      }
      
      i += 5; // Skip to next entry
      continue;
    }
    
    i++;
  }
  
  console.log(`✅ Parsed ${lecturers.length} lecturers`);
  console.log(`✅ Parsed ${students.length} students`);
  
  return { lecturers, students };
}

function parseName(fullName) {
  if (!fullName || fullName.trim() === '') {
    return { firstName: 'User', lastName: 'Unknown' };
  }
  const parts = fullName.trim().split(' ').filter(p => p.length > 0);
  if (parts.length === 0) {
    return { firstName: 'User', lastName: 'Unknown' };
  } else if (parts.length === 1) {
    // Single name - use first 2 chars as firstName, rest as lastName (min 2 chars each)
    const name = parts[0];
    if (name.length < 4) {
      return { firstName: name, lastName: name }; // Use same name for both if too short
    }
    const mid = Math.floor(name.length / 2);
    return { firstName: name.substring(0, mid), lastName: name.substring(mid) };
  } else {
    return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
  }
}

async function importUsers() {
  try {
    console.log('\n🚀 Starting User Import');
    console.log('='.repeat(60));
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL database');
    
    // Parse users from HTML
    const { lecturers, students } = await parseHTMLUsers();
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    let imported = 0;
    let skipped = 0;
    let errors = [];
    
    // Import lecturers
    console.log(`\n👨‍🏫 Importing ${lecturers.length} lecturers...`);
    for (const lecturer of lecturers) {
      try {
        const existing = await User.findOne({ where: { email: lecturer.email } });
        if (existing) {
          skipped++;
          continue;
        }
        
        const { firstName, lastName } = parseName(lecturer.name);
        
        await User.create({
          firstName,
          lastName,
          email: lecturer.email,
          password: hashedPassword,
          role: 'lecturer',
          status: lecturer.status || 'active',
          emailVerified: false
        });
        
        imported++;
        if (imported % 100 === 0) {
          console.log(`  ✓ Imported ${imported} total users...`);
        }
      } catch (error) {
        errors.push({ email: lecturer.email, error: error.message });
      }
    }
    
    // Import students
    console.log(`\n👨‍🎓 Importing ${students.length} students...`);
    for (const student of students) {
      try {
        const existing = await User.findOne({ where: { email: student.email } });
        if (existing) {
          skipped++;
          continue;
        }
        
        const { firstName, lastName } = parseName(student.name);
        const emailPrefix = student.email.split('@')[0].substring(0, 8).toUpperCase();
        const studentId = `STU-${emailPrefix}-${Date.now().toString().slice(-6)}`;
        
        await User.create({
          firstName,
          lastName,
          email: student.email,
          password: hashedPassword,
          role: 'student',
          studentId,
          status: student.status || 'active',
          emailVerified: false
        });
        
        imported++;
        if (imported % 100 === 0) {
          console.log(`  ✓ Imported ${imported} total users...`);
        }
      } catch (error) {
        errors.push({ email: student.email, error: error.message });
      }
    }
    
    // Final stats
   console.log('\n' + '='.repeat(60));
    console.log('✨ IMPORT COMPLETE');
    console.log('='.repeat(60));
    console.log(`✅ Successfully imported: ${imported} users`);
    console.log(`⏭️  Skipped (duplicates): ${skipped} users`);
    console.log(`❌ Errors: ${errors.length} users`);
    
    if (errors.length > 0 && errors.length <= 10) {
      console.log('\nError details:');
      errors.forEach(e => console.log(`  - ${e.email}: ${e.error}`));
    }
    
    // Database totals
    const total = await User.count();
    console.log(`\n📊 Total users in database: ${total}`);
    console.log('='.repeat(60));
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  }
}

// Run import
importUsers();
