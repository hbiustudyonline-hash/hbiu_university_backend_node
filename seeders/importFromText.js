const { User } = require('../models');
const bcrypt = require('bcryptjs');

// Helper function to parse names
const parseName = (fullName) => {
  if (!fullName || fullName.trim().length === 0) {
    return { firstName: 'User', lastName: 'Unknown' };
  }
  
  const parts = fullName.trim().split(' ');
  
  if (parts.length === 1) {
    const name = parts[0].length >= 2 ? parts[0] : 'User';
    return { firstName: name, lastName: name };
  }
  
  let firstName = parts[0];
  let lastName = parts.slice(1).join(' ');
  
  if (firstName.length < 2) firstName = 'User';
  if (lastName.length < 2) lastName = firstName;
  
  return { firstName, lastName };
};

// Hash password
const hashPasswordSync = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

/**
 * Import users from a simple text format:
 * NAME | EMAIL | PROGRAM | STATUS
 * 
 * Example:
 * John Doe | john@example.com | Bachelor | active
 * Jane Smith | jane@example.com | Master | suspended
 */
const importFromText = async (textData, role = 'student') => {
  try {
    console.log(`\n📝 Importing ${role}s from text data...`);
    
    const hashedPassword = hashPasswordSync('password123');
    const lines = textData.trim().split('\n');
    const users = [];
    let idStart = role === 'student' ? 3000 : 2000;
    let number = 1;
    
    for (const line of lines) {
      if (!line.trim()) continue;
      
      const parts = line.split('|').map(p => p.trim());
      if (parts.length < 2) continue; // Need at least name and email
      
      const [name, email, program = '', status = 'suspended'] = parts;
      const { firstName, lastName } = parseName(name);
      
      users.push({
        id: idStart++,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        status: status.toLowerCase(),
        studentId: role === 'student' ? `STU${String(number++).padStart(4, '0')}` : null,
        address: program,
        emailVerified: false,
        collegeId: 1
      });
    }
    
    console.log(`Found ${users.length} ${role}s to import`);
    
    // Insert in batches
    const batchSize = 50;
    let imported = 0;
    
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      try {
        await User.bulkCreate(batch, { validate: true, ignoreDuplicates: true });
        imported += batch.length;
        console.log(`  ✓ Imported ${i + 1} to ${Math.min(i + batchSize, users.length)}`);
      } catch (error) {
        console.error(`  ✗ Error in batch ${i}-${i+batchSize}:`, error.message);
      }
    }
    
    console.log(`\n✅ Successfully imported ${imported} ${role}s`);
    return imported;
    
  } catch (error) {
    console.error(`❌ Error importing users:`, error);
    throw error;
  }
};

// Example usage with your complete student list
const COMPLETE_STUDENT_LIST = `
Donnah Joseph | successdonj8@gmail.com | Doctorate | active
03olamidevictor | 03olamidevictor@gmail.com |  | suspended
05erickoloo | 05erickoloo@gmail.com |  | suspended
08165574663 | 08165574663@gmail.com |  | suspended
08186622088 | 08186622088@gmail.com |  | suspended
09069774004 | 09069774004@gmail.com |  | suspended
1011shafiq | 1011shafiq@gmail.com |  | suspended
1017puritymeshmain | 1017puritymeshmain@gmail.com |  | suspended
11ijaiyaajibola | 11ijaiyaajibola@gmail.com |  | suspended
1206mmidongo221 | 1206mmidongo221@gmail.com |  | suspended
`;
// Add all your 3124 students here in the format above

// Main execution
if (require.main === module) {
  const { sequelize } = require('../config/database');
  const fs = require('fs');
  const path = require('path');
  
  // Try to load from file first
  const dataFile = path.join(__dirname, 'students_data.txt');
  let studentData = COMPLETE_STUDENT_LIST;
  
  if (fs.existsSync(dataFile)) {
    console.log(`📁 Loading from ${dataFile}`);
    studentData = fs.readFileSync(dataFile, 'utf8');
  } else {
    console.log('📝 Using inline data (update COMPLETE_STUDENT_LIST or create students_data.txt)');
  }
  
  importFromText(studentData, 'student')
    .then((count) => {
      console.log(`\n✅ Import completed: ${count} students imported`);
      console.log(`\nℹ️  All users have default password: password123`);
      sequelize.close();
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Import failed:', error.message);
      sequelize.close();
      process.exit(1);
    });
}

module.exports = importFromText;
