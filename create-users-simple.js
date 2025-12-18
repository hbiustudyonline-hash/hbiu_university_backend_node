const { User, College } = require('./models');
const { hashPassword } = require('./utils/auth');
const { connectDB, closeDB } = require('./config/database');

async function createUsers() {
  try {
    console.log('Creating users...');
    await connectDB();
    
    // Create college
    let college = await College.findOne({ where: { code: 'HBIU' } });
    if (!college) {
      college = await College.create({
        name: 'HBIU Main College',
        code: 'HBIU',
        description: 'Main college',
        status: 'active'
      });
      console.log('✅ Created college:', college.name);
    }
    
    // Hash password
    const hashedPassword = await hashPassword('password123');
    console.log('✅ Password hashed');
    
    // Create users
    const users = [
      { firstName: 'Admin', lastName: 'User', email: 'admin@hbiu.edu', role: 'admin' },
      { firstName: 'John', lastName: 'Student', email: 'student@hbiu.edu', role: 'student', studentId: 'STU001' },
      { firstName: 'Jane', lastName: 'Lecturer', email: 'lecturer@hbiu.edu', role: 'lecturer' },
      { firstName: 'College', lastName: 'Admin', email: 'collegeadmin@hbiu.edu', role: 'college_admin' }
    ];
    
    for (const userData of users) {
      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (!existingUser) {
        await User.create({
          ...userData,
          password: hashedPassword,
          status: 'active',
          collegeId: college.id,
          emailVerified: true
        });
        console.log('✅ Created user:', userData.email);
      } else {
        console.log('⚠️ User already exists:', userData.email);
      }
    }
    
    console.log('\n🎉 Users created successfully!');
    console.log('📋 Login Credentials: email / password123');
    
    await closeDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await closeDB();
    process.exit(1);
  }
}

createUsers();