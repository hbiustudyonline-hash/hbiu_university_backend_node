const { User } = require('./models');
const { sequelize } = require('./config/database');

async function checkAdminRole() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Find admin user
    const adminUser = await User.findOne({
      where: { email: 'admin@hbiu.edu' }
    });

    if (adminUser) {
      console.log('\n👤 Admin User Found:');
      console.log('  - ID:', adminUser.id);
      console.log('  - Email:', adminUser.email);
      console.log('  - First Name:', adminUser.firstName);
      console.log('  - Last Name:', adminUser.lastName);
      console.log('  - Role:', adminUser.role);
      console.log('  - Status:', adminUser.status);
      console.log('\n📋 Full user object:', JSON.stringify(adminUser.toJSON(), null, 2));
    } else {
      console.log('❌ No admin user found with email admin@hbiu.edu');
      
      // Find all users
      const allUsers = await User.findAll({
        attributes: ['id', 'email', 'role', 'status']
      });
      console.log('\n📋 All users in database:');
      allUsers.forEach(user => {
        console.log(`  - ${user.email} (Role: ${user.role}, Status: ${user.status})`);
      });
    }

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkAdminRole();
