const { sequelize } = require('./config/database');
const { User } = require('./models');

async function checkLecturer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected\n');
    
    // Find user with ID 1000
    const lecturer = await User.findByPk(1000);
    
    if (!lecturer) {
      console.log('❌ User with ID 1000 not found!');
      
      // Find all lecturers
      const lecturers = await User.findAll({
        where: { role: 'lecturer' },
        attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
        limit: 10
      });
      
      console.log(`\n📋 Available lecturers (first 10):\n`);
      lecturers.forEach(l => {
        console.log(`  ID: ${l.id} | ${l.firstName} ${l.lastName} (${l.email})`);
      });
    } else {
      console.log(`✅ Lecturer found:`);
      console.log(`   ID: ${lecturer.id}`);
      console.log(`   Name: ${lecturer.firstName} ${lecturer.lastName}`);
      console.log(`   Email: ${lecturer.email}`);
      console.log(`   Role: ${lecturer.role}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkLecturer();
