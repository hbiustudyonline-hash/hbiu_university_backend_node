const { User } = require('./models');
const { connectDB } = require('./config/database');

async function checkUsers() {
  try {
    await connectDB();
    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'status'],
      limit: 10
    });
    
    console.log('Users in database:');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.role}, ${user.status})`);
    });
    
    const adminUser = await User.findOne({ 
      where: { email: 'admin@hbiu.edu' },
      attributes: ['id', 'email', 'role', 'status', 'password']
    });
    
    console.log('\nAdmin user details:');
    if (adminUser) {
      console.log('Email:', adminUser.email);
      console.log('Role:', adminUser.role);
      console.log('Status:', adminUser.status);
      console.log('Has password:', !!adminUser.password);
      console.log('Password hash starts with:', adminUser.password?.substring(0, 20));
    } else {
      console.log('Admin user not found!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}
checkUsers();