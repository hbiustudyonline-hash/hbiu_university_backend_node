const { sequelize } = require('./config/database');

async function addCollegeFields() {
  try {  
    console.log('🔧 Adding collegeName, programLevel, and degreeProgram fields to courses table...');
    
    // Add collegeName field
    await sequelize.query(`
      ALTER TABLE courses 
      ADD COLUMN IF NOT EXISTS "collegeName" VARCHAR(200);
    `);
    console.log('✅ collegeName field added');
    
    // Add programLevel field
    await sequelize.query(`
      ALTER TABLE courses 
      ADD COLUMN IF NOT EXISTS "programLevel" VARCHAR(50);
    `);
    console.log('✅ programLevel field added');
    
    // Add degreeProgram field
    await sequelize.query(`
      ALTER TABLE courses 
      ADD COLUMN IF NOT EXISTS "degreeProgram" VARCHAR(500);
    `);
    console.log('✅ degreeProgram field added');
    
    console.log('🎉 All fields added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding fields:', error);
    process.exit(1);
  }
}

addCollegeFields();
