const { sequelize } = require('./config/database');
const { Course, College } = require('./models');

async function verifyCourses() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected\n');
    
    // Find College of International Studies
    const college = await College.findOne({
      where: { name: 'College of International Studies' }
    });
    
    if (!college) {
      console.log('❌ College of International Studies not found!');
      process.exit(1);
    }
    
    console.log(`✅ College of International Studies found (ID: ${college.id})\n`);
    
    // Get all courses for this college
    const courses = await Course.findAll({
      where: { collegeId: college.id },
      attributes: ['id', 'code', 'title', 'status', 'collegeId', 'lecturerId'],
      order: [['code', 'ASC']]
    });
    
    console.log(`📚 Total courses in College of International Studies: ${courses.length}`);
    
    if (courses.length > 0) {
      console.log(`\n📋 First 10 courses:\n`);
      courses.slice(0, 10).forEach((c, i) => {
        console.log(`${i+1}. [${c.code}] ${c.title}`);
        console.log(`   Status: ${c.status}, CollegeID: ${c.collegeId}, LecturerID: ${c.lecturerId}\n`);
      });
      
      if (courses.length > 10) {
        console.log(`... and ${courses.length - 10} more courses`);
      }
    }
    
    // Check if any courses exist without college_id
    const orphanCourses = await Course.count({
      where: { collegeId: null }
    });
    
    console.log(`\n⚠️  Courses without college: ${orphanCourses}`);
    
    // Get total course count
    const totalCourses = await Course.count();
    console.log(`📊 Total courses in database: ${totalCourses}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

verifyCourses();
