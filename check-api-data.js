const { sequelize } = require('./config/database');
const { Course, College, User } = require('./models');

async function checkAPIData() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected\n');
    
    // Check College of International Studies
    const college = await College.findOne({
      where: { name: 'College of International Studies' }
    });
    
    console.log('🏛️  COLLEGE OF INTERNATIONAL STUDIES:');
    console.log(`   ID: ${college.id}`);
    console.log(`   Name: ${college.name}\n`);
    
    // Get ALL courses with college_id = 5
    const courses = await Course.findAll({
      where: { collegeId: college.id },
      attributes: ['id', 'code', 'title', 'collegeId', 'lecturerId', 'status'],
      include: [
        {
          model: User,
          as: 'lecturer',
          attributes: ['id', 'email', 'firstName', 'lastName']
        },
        {
          model: College,
          as: 'college',
          attributes: ['id', 'name']
        }
      ]
    });
    
    console.log(`📚 TOTAL COURSES IN COLLEGE: ${courses.length}\n`);
    
    console.log('📋 COURSES BREAKDOWN:');
    console.log(`   Published: ${courses.filter(c => c.status === 'published').length}`);
    console.log(`   Draft: ${courses.filter(c => c.status === 'draft').length}`);
    console.log(`   Archived: ${courses.filter(c => c.status === 'archived').length}\n`);
    
    console.log('👤 LECTURER ASSIGNMENT:');
    const lecturerId = courses[0]?.lecturerId;
    if (lecturerId) {
      const lecturer = await User.findByPk(lecturerId);
      console.log(`   ID: ${lecturer.id}`);
      console.log(`   Name: ${lecturer.firstName} ${lecturer.lastName}`);
      console.log(`   Email: ${lecturer.email}\n`);
    }
    
    console.log('🔍 API RESPONSE FORMAT (First 5 courses):');
    courses.slice(0, 5).forEach((c, i) => {
      console.log(`${i+1}. ${c.code} - ${c.title}`);
      console.log(`   collegeId: ${c.collegeId}`);
      console.log(`   college_id: ${c.college_id || 'undefined'}`);
      console.log(`   college.id: ${c.college?.id || 'undefined'}`);
      console.log(`   college.name: ${c.college?.name || 'undefined'}`);
      console.log(`   status: ${c.status}\n`);
    });
    
    // Check if courses have proper snake_case fields
    const rawCourses = await sequelize.query(
      'SELECT id, code, title, college_id, lecturer_id, status FROM courses WHERE college_id = :collegeId LIMIT 3',
      {
        replacements: { collegeId: college.id },
        type: sequelize.QueryTypes.SELECT
      }
    );
    
    console.log('🗃️  RAW DATABASE FIELDS (First 3):');
    rawCourses.forEach((c, i) => {
      console.log(`${i+1}. ${c.code}`);
      console.log(`   college_id: ${c.college_id}`);
      console.log(`   lecturer_id: ${c.lecturer_id}\n`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

checkAPIData();
