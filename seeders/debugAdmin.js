const { User } = require('../models');

async function debugAdmin() {
  try {
    console.log('\n🔍 DEBUGGING ADMIN USER\n');
    
    const admin = await User.findOne({ where: { email: 'admin@hbiu.edu' } });
    
    if (!admin) {
      console.error('❌ admin@hbiu.edu NOT FOUND in database!');
      return process.exit(1);
    }
    
    console.log('✅ Admin user found in database:\n');
    console.log('   ID:', admin.id);
    console.log('   Email:', admin.email);
    console.log('   First Name:', admin.firstName);
    console.log('   Last Name:', admin.lastName);
    console.log('   Role:', admin.role);
    console.log('   Status:', admin.status);
    console.log('   Email Verified:', admin.emailVerified);
    console.log('   Last Login:', admin.lastLogin);
    console.log('');
    
    if (admin.role !== 'admin') {
      console.error('❌ USER ROLE IS NOT ADMIN! It is:', admin.role);
      console.log('Fixing it now...');
      await admin.update({ role: 'admin', status: 'active' });
      console.log('✅ Fixed! Role is now admin');
    } else {
      console.log('✅ Role is correct: admin');
    }
    
    if (admin.status !== 'active') {
      console.error('❌ USER STATUS IS NOT ACTIVE! It is:', admin.status);
      console.log('Fixing it now...');
      await admin.update({ status: 'active' });
      console.log('✅ Fixed! Status is now active');
    } else {
      console.log('✅ Status is correct: active');
    }
    
    console.log('\n📊 Verifying token generation...');
    const jwt = require('jsonwebtoken');
    const testToken = jwt.sign(
      { id: admin.id },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
      { expiresIn: '7d' }
    );
    console.log('✅ Token generated successfully');
    console.log('Token (first 80 chars):', testToken.substring(0, 80) + '...');
    
    // Try to decode it
    const decoded = jwt.verify(testToken, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production');
    console.log('✅ Token verified successfully');
    console.log('Decoded payload:', decoded);
    
    // Try to fetch user with decoded id
    const fetchedUser = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });
    console.log('✅ User fetched from token:', fetchedUser.email, '-', fetchedUser.role);
    
    console.log('\n✨ Everything looks good! Admin user is properly configured.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

debugAdmin();
