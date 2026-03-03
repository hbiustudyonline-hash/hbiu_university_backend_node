const { User } = require('../models');

async function fixAdminStatus() {
  try {
    console.log('\n🔧 Checking and fixing admin user status...\n');
    
    const adminUser = await User.findOne({ 
      where: { email: 'admin@hbiu.edu' } 
    });
    
    if (!adminUser) {
      console.error('❌ Admin user not found!');
      process.exit(1);
    }
    
    console.log('📋 Current admin user:');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   Status: ${adminUser.status}`);
    console.log(`   ID: ${adminUser.id}\n`);
    
    if (adminUser.status !== 'active') {
      await adminUser.update({ status: 'active' });
      console.log('✅ Updated admin status to active!\n');
    } else {
      console.log('✅ Admin status is already active\n');
    }
    
    // Also check john.smith@hbiu.edu
    const johnUser = await User.findOne({ 
      where: { email: 'john.smith@hbiu.edu' } 
    });
    
    if (johnUser) {
      console.log('📋 John Smith user:');
      console.log(`   Email: ${johnUser.email}`);
      console.log(`   Role: ${johnUser.role}`);
      console.log(`   Status: ${johnUser.status}`);
      console.log(`   ID: ${johnUser.id}\n`);
      
      if (johnUser.status !== 'active') {
        await johnUser.update({ status: 'active' });
        console.log('✅ Updated John Smith status to active!\n');
      } else {
        console.log('✅ John Smith status is already active\n');
      }
    }
    
    console.log('✨ All admin users are now active!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixAdminStatus();
