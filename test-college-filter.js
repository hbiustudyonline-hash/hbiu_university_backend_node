const { sequelize } = require('./config/database');
const { Course, College } = require('./models');

async function testCollegeFilter() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected\n');
    
    // Find College of International Studies
    const college = await College.findOne({
      where: { name: 'College of International Studies' }
    });
    
    if (!college) {
      console.log('❌ College of International Studies NOT FOUND');
      process.exit(1);
    }
    
    console.log('🏛️  College of International Studies:');
    console.log(`   ID: ${college.id}`);
    console.log(`   Name: ${college.name}\n`);
    
    // Get courses using collegeId
    const coursesById = await Course.findAll({
      where: { collegeId: college.id },
      attributes: ['id', 'code', 'title', 'collegeId'],
      raw: true
    });
    
    console.log(`📚 Courses found by collegeId=${college.id}: ${coursesById.length}\n`);
    
    if (coursesById.length > 0) {
      console.log('First 5 courses:');
      coursesById.slice(0, 5).forEach((c, i) => {
        console.log(`${i+1}. [${c.code}] ${c.title} (collegeId: ${c.collegeId})`);
      });
    }
    
    // Also check raw database
    const rawCheck = await sequelize.query(
      'SELECT id, code, title, college_id FROM courses WHERE college_id = $1 LIMIT 5',
      {
        bind: [college.id],
        type: sequelize.QueryTypes.SELECT
      }
    );
    
    console.log(`\n🗃️  Raw database check (college_id=${college.id}): ${rawCheck.length} courses`);
    rawCheck.forEach((c, i) => {
      console.log(`${i+1}. [${c.code}] ${c.title} (college_id: ${c.college_id})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testCollegeFilter();
