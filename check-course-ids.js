const { sequelize } = require('./config/database');
const { Course, College } = require('./models');

async function checkCourseIDs() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected\n');
    
    // Get all courses with their college info
    const allCourses = await Course.findAll({
      attributes: ['id', 'code', 'title', 'collegeId'],
      include: [{
        model: College,
        as: 'college',
        attributes: ['id', 'name']
      }],
      order: [['collegeId', 'ASC'], ['code', 'ASC']]
    });
    
    console.log(`📚 Total courses in database: ${allCourses.length}\n`);
    
    // Group by college
    const byCollege = {};
    allCourses.forEach(c => {
      const cid = c.collegeId || 'null';
      if (!byCollege[cid]) {
        byCollege[cid] = [];
      }
      byCollege[cid].push(c);
    });
    
    console.log('📊 Courses by College:\n');
    Object.keys(byCollege).sort().forEach(cid => {
      const courses = byCollege[cid];
      const collegeName = courses[0]?.college?.name || 'Unknown';
      console.log(`College ID ${cid} (${collegeName}): ${courses.length} courses`);
      if (cid === '5') {
        console.log('  First 5:');
        courses.slice(0, 5).forEach(c => {
          console.log(`    - [${c.code}] ${c.title}`);
        });
      }
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkCourseIDs();
