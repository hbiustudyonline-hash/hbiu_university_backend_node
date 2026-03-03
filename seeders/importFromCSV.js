const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { User, College } = require('../models');
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

// Helper to hash password
const hashPasswordSync = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const importUsersFromCSV = async (csvFilePath, role = 'student') => {
  try {
    console.log(`📁 Importing ${role}s from CSV: ${csvFilePath}`);
    
    const hashedPassword = hashPasswordSync('password123');
    const users = [];
    let idStart = role === 'student' ? 3000 : 2000;
    let number = 1;
    
    // Read CSV file
    const stream = fs.createReadStream(csvFilePath)
      .pipe(csv());
    
    for await (const row of stream) {
      const { firstName, lastName } = parseName(row.name || row.Name || row.fullName || '');
      
      users.push({
        id: idStart++,
        firstName,
        lastName,
        email: row.email || row.Email,
        password: hashedPassword,
        role: role,
        status: (row.status || row.Status || 'suspended').toLowerCase(),
        studentId: role === 'student' ? `STU${String(number++).padStart(4, '0')}` : null,
        address: row.program || row.Program || '',
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
      await User.bulkCreate(batch, { validate: true, ignoreDuplicates: true });
      imported += batch.length;
      console.log(`  ✓ Imported ${i + 1} to ${Math.min(i + batchSize, users.length)}`);
    }
    
    console.log(`✅ Successfully imported ${imported} ${role}s`);
    return imported;
    
  } catch (error) {
    console.error(`❌ Error importing users from CSV:`, error);
    throw error;
  }
};

// Main execution
if (require.main === module) {
  const { sequelize } = require('../config/database');
  
  const csvFile = process.argv[2];
  const role = process.argv[3] || 'student';
  
  if (!csvFile) {
    console.log('Usage: node importFromCSV.js <csv-file-path> [role]');
    console.log('Example: node importFromCSV.js students.csv student');
    console.log('Example: node importFromCSV.js lecturers.csv lecturer');
    process.exit(1);
  }
  
  importUsersFromCSV(csvFile, role)
    .then((count) => {
      console.log(`\n✅ Import completed: ${count} users`);
      sequelize.close();
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Import failed:', error.message);
      sequelize.close();
      process.exit(1);
    });
}

module.exports = importUsersFromCSV;
