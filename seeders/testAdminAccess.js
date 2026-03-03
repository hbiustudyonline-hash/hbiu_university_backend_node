const { User } = require('../models');
const jwt = require('jsonwebtoken');

async function testAdminAccess() {
  try {
    console.log('\n🔍 Testing Admin User Access...\n');
    
    // Count all users
    const totalUsers = await User.count();
    console.log(`✅ Total users in database: ${totalUsers}\n`);
    
    // Get breakdown
    const lecturers = await User.count({ where: { role: 'lecturer' } });
    const students = await User.count({ where: { role: 'student' } });
    const admins = await User.count({ where: { role: 'admin' } });
    
    console.log(`📊 Breakdown:`);
    console.log(`   Lecturers: ${lecturers}`);
    console.log(`   Students: ${students}`);
    console.log(`   Admins: ${admins}\n`);
    
    // Find admin user
    const adminUser = await User.findOne({ 
      where: { email: 'admin@hbiu.edu' } 
    });
    
    if (adminUser) {
      console.log(`✅ Admin user exists:`);
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Role: ${adminUser.role}`);
      console.log(`   Status: ${adminUser.status}\n`);
      
      // Generate a test token
      const token = jwt.sign(
        { 
          id: adminUser.id, 
          email: adminUser.email, 
          role: adminUser.role 
        },
        process.env.JWT_SECRET || 'your-secret-key-here-change-in-production',
        { expiresIn: '24h' }
      );
      
      console.log(`🔐 Test JWT Token for admin@hbiu.edu:`);
      console.log(`${token}\n`);
      console.log(`You can use this token to test API calls.\n`);
    }
    
    // Get first 5 users
    const sampleUsers = await User.findAll({ 
      limit: 5,
      attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'status']
    });
    
    console.log(`📋 Sample users (first 5):`);
    sampleUsers.forEach(u => {
      console.log(`   ${u.id} | ${u.firstName} ${u.lastName} | ${u.email} | ${u.role}`);
    });
    
    console.log(`\n✨ All checks passed! Users are in the database.\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testAdminAccess();
