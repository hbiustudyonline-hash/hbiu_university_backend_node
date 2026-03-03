const { User } = require('../models');

async function makeUserAdmin() {
  try {
    const email = 'john.smith@hbiu.edu';
    
    console.log(`\n🔧 Updating ${email} to admin role...\n`);
    
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.error(`❌ User ${email} not found!`);
      process.exit(1);
    }
    
    console.log(`📋 Current user details:`);
    console.log(`   Name: ${user.firstName} ${user.lastName}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Current Role: ${user.role}`);
    console.log(`   Status: ${user.status}\n`);
    
    // Update to admin
    await user.update({ 
      role: 'admin',
      status: 'active'
    });
    
    console.log(`✅ Successfully updated ${email} to admin role!\n`);
    
    console.log(`📋 Updated user details:`);
    console.log(`   Name: ${user.firstName} ${user.lastName}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   New Role: ${user.role}`);
    console.log(`   Status: ${user.status}\n`);
    
    console.log(`🔐 You can now login with:`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: password123`);
    console.log(`   Role: admin\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

makeUserAdmin();
