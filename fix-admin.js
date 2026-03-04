const { User } = require('./models');
const { hashPassword } = require('./utils/auth');
const { sequelize } = require('./models');

async function fixAdmin() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Check for admin user
    let admin = await User.findOne({ where: { email: 'admin@hbiu.edu' } });

    if (!admin) {
      console.log('❌ Admin user not found. Creating...');
      const hashedPassword = await hashPassword('admin123');
      admin = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@hbiu.edu',
        password: hashedPassword,
        role: 'admin',
        status: 'active',
        collegeId: 1
      });
      console.log('✅ Admin user created');
    } else {
      console.log('✅ Admin user found with ID:', admin.id);
      
      // Update to ensure correct settings
      const hashedPassword = await hashPassword('admin123');
      await admin.update({
        firstName: 'Admin',
        lastName: 'User',
        password: hashedPassword,
        role: 'admin',
        status: 'active'
      });
      console.log('✅ Admin user updated');
    }

    console.log('\n📋 Admin Account Details:');
    console.log('   Email:', admin.email);
    console.log('   Role:', admin.role);
    console.log('   Status:', admin.status);
    console.log('   Password: admin123');
    console.log('\n✅ You can now login with:');
    console.log('   Email: admin@hbiu.edu');
    console.log('   Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixAdmin();
