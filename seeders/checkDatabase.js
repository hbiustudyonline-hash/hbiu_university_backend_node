const { User, sequelize } = require('../models');

async function checkDatabase() {
  try {
    console.log('\n🔍 Checking Real Database Counts...\n');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connected\n');
    
    // Count all users
    const totalUsers = await User.count();
    console.log(`📊 Total Users in Database: ${totalUsers}`);
    
    // Count by role
    const students = await User.count({ where: { role: 'student' } });
    const lecturers = await User.count({ where: { role: 'lecturer' } });
    const admins = await User.count({ where: { role: 'admin' } });
    const collegeAdmins = await User.count({ where: { role: 'college_admin' } });
    
    console.log(`\n👥 Breakdown by Role:`);
    console.log(`   Students: ${students}`);
    console.log(`   Lecturers: ${lecturers}`);
    console.log(`   Admins: ${admins}`);
    console.log(`   College Admins: ${collegeAdmins}`);
    
    // Count by status
    const active = await User.count({ where: { status: 'active' } });
    const suspended = await User.count({ where: { status: 'suspended' } });
    const inactive = await User.count({ where: { status: 'inactive' } });
    
    console.log(`\n📈 Breakdown by Status:`);
    console.log(`   Active: ${active}`);
    console.log(`   Suspended: ${suspended}`);
    console.log(`   Inactive: ${inactive}`);
    
    // Sample 5 users to see structure
    console.log(`\n📝 Sample Users (first 5):`);
    const sampleUsers = await User.findAll({ 
      limit: 5,
      attributes: ['firstName', 'lastName', 'email', 'role', 'status']
    });
    
    sampleUsers.forEach((user, i) => {
      console.log(`${i+1}. ${user.firstName} ${user.lastName} - ${user.email} [${user.role}] (${user.status})`);
    });
    
    console.log(`\n✅ Database check complete!\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
