const { sequelize } = require('./config/database');
const { Course, College } = require('./models');

async function checkCourses() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database\n');

    const courses = await Course.findAll({
      include: [{
        model: College,
        as: 'college',
        attributes: ['id', 'name']
      }],
      order: [['created_at', 'DESC']],
      limit: 50
    });

    console.log(`📊 Total courses in database: ${courses.length}\n`);

    if (courses.length > 0) {
      console.log('Recent courses:');
      courses.forEach((course, index) => {
        console.log(`${index + 1}. ${course.name} (${course.code}) - College: ${course.college?.name || 'N/A'}`);
      });
    } else {
      console.log('❌ No courses found in database!');
    }

    const colleges = await College.findAll();
    console.log(`\n🏛️ Total colleges in database: ${colleges.length}`);
    colleges.forEach((college, index) => {
      console.log(`${index + 1}. ${college.name}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkCourses();
