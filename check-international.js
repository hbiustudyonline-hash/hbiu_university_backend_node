const { sequelize } = require('./config/database');
const { Course, College } = require('./models');

async function checkInternationalStudies() {
  try {
    await sequelize.authenticate();
    
    // Find College of International Studies
    const college = await College.findOne({
      where: {
        name: 'College of International Studies'
      }
    });

    if (!college) {
      console.log('❌ College of International Studies NOT FOUND in database');
      console.log('\nAll colleges in database:');
      const allColleges = await College.findAll();
      allColleges.forEach((c, i) => {
        console.log(`${i + 1}. ${c.name} (ID: ${c.id})`);
      });
    } else {
      console.log(`✅ College of International Studies found (ID: ${college.id})\n`);
      
      const courses = await Course.findAll({
        where: { college_id: college.id }
      });
      
      console.log(`📊 Courses for this college: ${courses.length}`);
      
      if (courses.length > 0) {
        courses.forEach((course, i) => {
          console.log(`${i + 1}. ${course.name || 'No name'} (${course.code})`);
        });
      } else {
        console.log('No courses found for College of International Studies');
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkInternationalStudies();
