const fs = require('fs');
const path = require('path');

console.log('Starting HTML parsing...');

// Read the HTML file
const htmlPath = path.join(__dirname, '../../extracted_users/TotalUsers3118.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Extract all <p class="c1"><span class="c0">TEXT</span></p> content
const regex = /<p class="c1"><span class="c0">(.*?)<\/span><\/p>/g;
const matches = [];
let match;

while ((match = regex.exec(htmlContent)) !== null) {
  // Decode HTML entities
  let text = match[1]
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  matches.push(text);
}

console.log(`Extracted ${matches.length} paragraph elements`);

// Helper functions
function processLecturerEntry(fields) {
  if (fields.length < 4) return null;
  
  const entry = {
    name: fields[0],
    role: 'lecturer',
    email: fields[2],
    status: 'active'
  };
  
  // Status is always the last field
  const lastField = fields[fields.length - 1].toLowerCase();
  if (lastField === 'suspended' || lastField === 'active') {
    entry.status = lastField;
    // Position is everything between email and status (if exists)
    if (fields.length > 4) {
      entry.position = fields.slice(3, fields.length - 1).join(' - ');
    }
  } else {
    // No explicit status, treat last field as position
    if (fields.length > 3) {
      entry.position = fields.slice(3).join(' - ');
    }
  }
  
  return entry;
}

function processStudentEntry(fields) {
  if (fields.length < 4) return null;
  
  const entry = {
    name: fields[0],
    role: 'student',
    email: fields[2],
    status: 'active'
  };
  
  // Status is always the last field
  const lastField = fields[fields.length - 1].toLowerCase();
  if (lastField === 'suspended' || lastField === 'active' || lastField === 'graduated' || lastField === 'withdrawn') {
    entry.status = lastField;
    // Program is everything between email and status (if exists)
    if (fields.length > 4) {
      entry.program = fields.slice(3, fields.length - 1).join(' - ');
    }
  } else {
    // No explicit status, treat last field as program
    if (fields.length > 3) {
      entry.program = fields.slice(3).join(' - ');
    }
  }
  
  return entry;
}

// Parse the data structure
const lecturersData = [];
const studentsData = [];
let currentMode = null;
let i = 0;

// Skip header info
while (i < matches.length) {
  if (matches[i] === 'Lecturers (121)') {
    currentMode = 'lecturers';
    i++;
    break;
  }
  i++;
}

// Parse lecturers
let currentEntry = {};
let entryFields = [];

while (i < matches.length && currentMode === 'lecturers') {
  const text = matches[i];
  
  // Check if we hit the students section
  if (text === 'Students (3124)') {
    currentMode = 'students';
    i++;
    break;
  }
  
  // Single letter/digit indicates start of new entry
  if (text.length === 1 && /[A-Za-z0-9]/.test(text)) {
    // Process previous entry
    if (entryFields.length > 0) {
      const entry = processLecturerEntry(entryFields);
      if (entry) lecturersData.push(entry);
    }
    entryFields = [];
    i++;
    continue;
  }
  
  entryFields.push(text);
  i++;
}

// Add last lecturer if exists
if (entryFields.length > 0) {
  const entry = processLecturerEntry(entryFields);
  if (entry) lecturersData.push(entry);
}

// Parse students
entryFields = [];

while (i < matches.length) {
  const text = matches[i];
  
  // Single letter/digit indicates start of new entry
  if (text.length === 1 && /[A-Za-z0-9]/.test(text)) {
    // Process previous entry
    if (entryFields.length > 0) {
      const entry = processStudentEntry(entryFields);
      if (entry) studentsData.push(entry);
    }
    entryFields = [];
    i++;
    continue;
  }
  
  entryFields.push(text);
  i++;
}

// Add last student if exists
if (entryFields.length > 0) {
  const entry = processStudentEntry(entryFields);
  if (entry) studentsData.push(entry);
}

console.log(`Parsed ${lecturersData.length} lecturers`);
console.log(`Parsed ${studentsData.length} students`);

// Generate the import script with embedded data
const scriptContent = `const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const path = require('path');

// Database configuration
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database/hbiu.db'),
  logging: false
});

// User model definition
const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  role: {
    type: Sequelize.ENUM('student', 'lecturer', 'admin'),
    defaultValue: 'student'
  },
  studentId: {
    type: Sequelize.STRING,
    unique: true
  },
  status: {
    type: Sequelize.ENUM('active', 'suspended', 'graduated', 'withdrawn'),
    defaultValue: 'active'
  },
  program: {
    type: Sequelize.STRING
  },
  position: {
    type: Sequelize.STRING
  }
}, {
  tableName: 'Users',
  timestamps: true
});

// Embedded user data
const LECTURERS_DATA = ${JSON.stringify(lecturersData, null, 2)};

const STUDENTS_DATA = ${JSON.stringify(studentsData, null, 2)};

async function importAllUsers() {
  try {
    console.log('Starting import of all 3,245 users...');
    console.log('='.repeat(60));
    
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    // Sync model
    await User.sync();
    
    // Hash password once
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    let imported = 0;
    let skipped = 0;
    let errors = 0;
    
    // Start transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Import lecturers
      console.log(\`\\nImporting \${LECTURERS_DATA.length} lecturers...\`);
      
      for (const lecturer of LECTURERS_DATA) {
        try {
          // Check if user exists
          const existing = await User.findOne({ 
            where: { email: lecturer.email },
            transaction 
          });
          
          if (existing) {
            skipped++;
            continue;
          }
          
          await User.create({
            name: lecturer.name,
            email: lecturer.email,
            password: hashedPassword,
            role: 'lecturer',
            status: lecturer.status === 'suspended' ? 'suspended' : 'active',
            position: lecturer.position || 'Lecturer'
          }, { transaction });
          
          imported++;
          
          if (imported % 50 === 0) {
            console.log(\`  ✓ Imported \${imported} users so far...\`);
          }
        } catch (error) {
          errors++;
          console.error(\`  ✗ Error importing \${lecturer.email}: \${error.message}\`);
        }
      }
      
      console.log(\`\\nImporting \${STUDENTS_DATA.length} students...\`);
      
      for (const student of STUDENTS_DATA) {
        try {
          // Check if user exists
          const existing = await User.findOne({ 
            where: { email: student.email },
            transaction 
          });
          
          if (existing) {
            skipped++;
            continue;
          }
          
          // Generate student ID
          const emailPrefix = student.email.split('@')[0].substring(0, 8).toUpperCase();
          const timestamp = Date.now().toString().substring(-6);
          const studentId = \`STU-\${emailPrefix}-\${timestamp}\`;
          
          await User.create({
            name: student.name,
            email: student.email,
            password: hashedPassword,
            role: 'student',
            studentId: studentId,
            status: student.status === 'suspended' ? 'suspended' : 'active',
            program: student.program || 'General Studies'
          }, { transaction });
          
          imported++;
          
          if (imported % 50 === 0) {
            console.log(\`  ✓ Imported \${imported} users so far...\`);
          }
        } catch (error) {
          errors++;
          console.error(\`  ✗ Error importing \${student.email}: \${error.message}\`);
        }
      }
      
      // Commit transaction
      await transaction.commit();
      
      console.log('\\n' + '='.repeat(60));
      console.log('IMPORT COMPLETE');
      console.log('='.repeat(60));
      console.log(\`Successfully imported: \${imported} users\`);
      console.log(\`Skipped (duplicates): \${skipped} users\`);
      console.log(\`Errors: \${errors} users\`);
      console.log(\`Total processed: \${imported + skipped + errors} users\`);
      console.log('\\nAll users have password: password123');
      console.log('='.repeat(60));
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
    
  } catch (error) {
    console.error('Fatal error during import:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run import
importAllUsers();
`;

// Write the import script
const outputPath = path.join(__dirname, 'importAll3245Users.js');
fs.writeFileSync(outputPath, scriptContent, 'utf8');

console.log(`\nImport script created successfully!`);
console.log(`Location: ${outputPath}`);
console.log(`\nLecturers: ${lecturersData.length}`);
console.log(`Students: ${studentsData.length}`);
console.log(`Total: ${lecturersData.length + studentsData.length}`);
console.log(`\nRun with: node seeders/importAll3245Users.js`);
