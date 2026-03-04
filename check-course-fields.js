const { sequelize } = require('./config/database');
const { Course } = require('./models');

async function checkCourseFields() {
  try {
    await sequelize.authenticate();
    
    const courses = await Course.findAll({
      raw: true,
      limit: 2
    });

    console.log('📊 Sample course data from database:\n');
    courses.forEach((course, i) => {
      console.log(`Course ${i + 1}:`);
      console.log(JSON.stringify(course, null, 2));
      console.log('\n---\n');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkCourseFields();
