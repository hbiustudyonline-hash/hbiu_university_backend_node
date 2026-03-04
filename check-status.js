const { sequelize } = require('./config/database');
const { Course } = require('./models');

async function checkPublishedStatus() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected\n');
    
    // Check course statuses
    const allCourses = await Course.findAll({
      attributes: ['id', 'code', 'title', 'status', 'collegeId']
    });
    
    console.log(`📚 Total courses: ${allCourses.length}\n`);
    
    // Group by status
    const byStatus = {};
    allCourses.forEach(c => {
      const status = c.status || 'null';
      if (!byStatus[status]) byStatus[status] = [];
      byStatus[status].push(c);
    });
    
    console.log('📊 Courses by status:');
    Object.keys(byStatus).forEach(status => {
      console.log(`  ${status}: ${byStatus[status].length} courses`);
    });
    
    // Check College ID 5 specifically
    const cis = allCourses.filter(c => c.collegeId === 5);
    console.log(`\n🏛️  College of International Studies (ID 5): ${cis.length} courses`);
    
    const cisStatuses = {};
    cis.forEach(c => {
      const status = c.status || 'null';
      if (!cisStatuses[status]) cisStatuses[status] = 0;
      cisStatuses[status]++;
    });
    
    console.log('   Statuses:');
    Object.keys(cisStatuses).forEach(status => {
      console.log(`     ${status}: ${cisStatuses[status]}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkPublishedStatus();
