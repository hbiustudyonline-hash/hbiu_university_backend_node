const { User } = require('../models');
const { sequelize } = require('../config/database');

const checkUserCounts = async () => {
  try {
    console.log('\n📊 Checking current user counts...\n');
    
    // Total users
    const totalUsers = await User.count();
    console.log(`📈 Total Users: ${totalUsers}`);
    
    // By role
    const lecturers = await User.count({ where: { role: 'lecturer' } });
    const students = await User.count({ where: { role: 'student' } });
    const admins = await User.count({ where: { role: 'admin' } });
    const collegeAdmins = await User.count({ where: { role: 'college_admin' } });
    
    console.log(`\n👥 Users by Role:`);
    console.log(`   Lecturers: ${lecturers}`);
    console.log(`   Students: ${students}`);
    console.log(`   Admins: ${admins}`);
    console.log(`   College Admins: ${collegeAdmins}`);
    
    // By status
    const active = await User.count({ where: { status: 'active' } });
    const suspended = await User.count({ where: { status: 'suspended' } });
    const inactive = await User.count({ where: { status: 'inactive' } });
    
    console.log(`\n✅ Users by Status:`);
    console.log(`   Active: ${active}`);
    console.log(`   Suspended: ${suspended}`);
    console.log(`   Inactive: ${inactive}`);
    
    // Sample users
    const sampleUsers = await User.findAll({
      limit: 5,
      attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'status'],
      order: [['id', 'DESC']]
    });
    
    console.log(`\n📋 Sample Recent Users (last 5):`);
    sampleUsers.forEach(user => {
      console.log(`   ${user.id} | ${user.firstName} ${user.lastName} | ${user.email} | ${user.role} | ${user.status}`);
    });
    
    console.log(`\n✨ Status Summary:`);
    if (lecturers >= 121) {
      console.log(`   ✅ Lecturers: COMPLETE (${lecturers}/121)`);
    } else {
      console.log(`   ⚠️  Lecturers: INCOMPLETE (${lecturers}/121)`);
    }
    
    if (students >= 3124) {
      console.log(`   ✅ Students: COMPLETE (${students}/3124)`);
    } else if (students > 0) {
      console.log(`   ⚠️  Students: PARTIAL (${students}/3124) - ${3124 - students} remaining`);
    } else {
      console.log(`   ❌ Students: NOT IMPORTED (0/3124)`);
    }
    
    console.log(`\n📌 Expected Total: 3245 users (121 lecturers + 3124 students)`);
    console.log(`📌 Current Total: ${totalUsers} users`);
    console.log(`📌 Remaining: ${Math.max(0, 3245 - totalUsers)} users to import\n`);
    
  } catch (error) {
    console.error('❌ Error checking user counts:',  error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  checkUserCounts()
    .then(() => {
      sequelize.close();
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed:', error.message);
      sequelize.close();
      process.exit(1);
    });
}

module.exports = checkUserCounts;
