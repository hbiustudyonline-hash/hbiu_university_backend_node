const axios = require('axios');
const fs = require('fs');

const API_URL = 'http://localhost:5000/api';
const ADMIN_EMAIL = 'admin@hbiu.edu';
const ADMIN_PASSWORD = 'password123';

// Parse HTML to extract users
function parseHTMLUsers() {
  console.log('📄 Reading HTML file...');
  const htmlPath = 'c:/Users/hoghc/OneDrive/Desktop/hbiu-online-2/extracted_users/TotalUsers3118.html';
  const html = fs.readFileSync(htmlPath, 'utf8');
  
  const regex = /<p class="c1"><span class="c0">(.*?)<\/span><\/p>/g;
  const matches = [...html.matchAll(regex)].map(m => m[1].replace(/&amp;/g, '&'));
  
  console.log(`📊 Extracted ${matches.length} data elements`);
  
  let lecturers = [];
  let students = [];
  let i = 0;
  let inLecturersSection = false;
  let inStudentsSection = false;
  
  while (i < matches.length) {
    const text = matches[i];
    
    if (text === 'Lecturers (121)') {
      inLecturersSection = true;
      inStudentsSection = false;
      i++; // Manual increment to avoid skipping next entry
      continue;
    }
    
    if (text === 'Students (3124)') {
      inLecturersSection = false;
      inStudentsSection = true;
      console.log(`📌 Students section found at index ${i}`);
      i++; // Manual increment to avoid skipping next entry
      continue;
    }
    
    // Parse lecturer: [Initial], [Name], "Lecturer", [Email], [Position], [Status]
    if (inLecturersSection && i+3 < matches.length && matches[i+2] === 'Lecturer' && matches[i+3].includes('@')) {
      const name = matches[i+1];
      const email = matches[i+3];
      let status = 'suspended';
      
      for (let j = i+4; j < i+8 && j < matches.length; j++) {
        if (matches[j] === 'Suspended' || matches[j] === 'Active') {
          status = matches[j].toLowerCase();
          break;
        }
      }
      
      lecturers.push({ name, email, role: 'lecturer', status });
      i += 5; // Changed from 6 to 5 to avoid skipping section markers
      continue;
    }
    
    // Parse student: [Initial], [Name], "Student", [Email], [Program/Status]
    if (inStudentsSection && i+3 < matches.length && matches[i+2] === 'Student' && matches[i+3].includes('@')) {
      const name = matches[i+1];
      const email = matches[i+3];
      let status = 'suspended';
      
      if (i+4 < matches.length && (matches[i+4] === 'Suspended' || matches[i+4] === 'Active')) {
        status = matches[i+4].toLowerCase();
      } else if (i+5 < matches.length && (matches[i+5] === 'Suspended' || matches[i+5] === 'Active')) {
        status = matches[i+5].toLowerCase();
      }
      
      students.push({ name, email, role: 'student', status });
      
      if (students.length <= 5) {
        console.log(`  Found student #${students.length}: ${name} (${email})`);
      }
      
      i += 5;
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
    const name = parts[0];
    if (name.length < 4) {
      return { firstName: name, lastName: name };
    }
    const mid = Math.floor(name.length / 2);
    return { firstName: name.substring(0, mid), lastName: name.substring(mid) };
  } else {
    return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
  }
}

async function authenticateAdmin() {
  console.log('\n🔐 Logging in as admin...');
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    console.log('✅ Admin authenticated successfully');
    return response.data.token;
  } catch (error) {
    console.error('❌ Failed to authenticate:', error.response?.data || error.message);
    throw error;
  }
}

async function createUser(userData, token) {
  try {
    const response = await axios.post(
      `${API_URL}/auth/register`,
      userData
    );
    return { success: true, user: response.data };
  } catch (error) {
    if (error.response?.status === 409 || error.response?.data?.message?.includes('exists') || error.response?.data?.message?.includes('Email')) {
      return { success: false, reason: 'duplicate' };
    }
    // Return detailed error for debugging
    return { 
      success: false, 
      reason: error.response?.data?.message || error.message,
      details: error.response?.data || {}
    };
  }
}

async function importUsers() {
  try {
    console.log('\n🚀 Starting Backend API Import');
    console.log('='.repeat(60));
    
    // Parse users from HTML
    const { lecturers, students } = parseHTMLUsers();
    const allUsers = [...lecturers, ...students];
    
    console.log(`\n📝 Total users to import: ${allUsers.length}`);
    
    // Authenticate
    const token = await authenticateAdmin();
    
    let imported = 0;
    let skipped = 0;
    let errors = [];
    
    console.log('\n👥 Importing users via API...\n');
    
    for (let i = 0; i < allUsers.length; i++) {
      const user = allUsers[i];
      const { firstName, lastName } = parseName(user.name);
      
      const userData = {
        firstName,
        lastName,
        email: user.email,
        password: 'password123',
        role: user.role,
        status: user.status,
        emailVerified: false
      };
      
      if (user.role === 'student') {
        const emailPrefix = user.email.split('@')[0].substring(0, 8).toUpperCase();
        userData.studentId = `STU-${emailPrefix}-${Date.now().toString().slice(-6)}`;
      }
      
      const result = await createUser(userData, token);
      
      if (result.success) {
        imported++;
      } else if (result.reason === 'duplicate') {
        skipped++;
      } else {
        errors.push({ email: user.email, error: result.reason, userData, details: result.details });
        
        // Log first error in detail
        if (errors.length === 1) {
          console.log('\n⚠️  First error details:');
          console.log(`  Email: ${user.email}`);
          console.log(`  Name: ${user.name}`);
          console.log(`  First Name: ${firstName} (length: ${firstName.length})`);
          console.log(`  Last Name: ${lastName} (length: ${lastName.length})`);
          console.log(`  Role: ${user.role}`);
          console.log(`  Error: ${result.reason}`);
          console.log(`  Details: ${JSON.stringify(result.details, null, 2)}\n`);
        }
      }
      
      // Progress update every 50 users
      if ((i + 1) % 50 === 0) {
        console.log(`  ✓ Processed ${i + 1}/${allUsers.length} users... (Imported: ${imported}, Skipped: ${skipped}, Errors: ${errors.length})`);
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
      console.log('\n❌ Error details:');
      errors.forEach(e => console.log(`  - ${e.email}: ${e.error}`));
    } else if (errors.length > 10) {
      console.log(`\n❌ ${errors.length} errors occurred. First 10:`);
      errors.slice(0, 10).forEach(e => console.log(`  - ${e.email}: ${e.error}`));
    }
    
    console.log('\n📊 You can now view all users in the Admin Office -> Student Management');
    console.log('🌐 Visit: http://localhost:5173/virtualadminoffice');
    console.log('='.repeat(60));
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    process.exit(1);
  }
}

// Check if axios is available
try {
  require.resolve('axios');
} catch (e) {
  console.error('❌ axios package not found. Installing...');
  const { execSync } = require('child_process');
  execSync('npm install axios', { stdio: 'inherit' });
  console.log('✅ axios installed. Please run the script again.');
  process.exit(0);
}

// Run import
importUsers();
