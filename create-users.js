const { User, College } = require('./models');
const { hashPassword } = require('./utils/auth');

async function createUsers() {
  try {
    console.log('Creating demo users...');
    
    // Create college
    let college = await College.findOrCreate({
      where: { code: 'HBIU' },
      defaults: {
        name: 'HBIU Main College',
        code: 'HBIU',
        description: 'Main college',
        status: 'active'
      }
    });
    college = college[0];
    
    const hashedPassword = await hashPassword('password123');
    
    // Create users
    const users = [
      { firstName: 'Admin', lastName: 'User', email: 'admin@hbiu.edu', role: 'admin' },
      { firstName: 'John', lastName: 'Student', email: 'student@hbiu.edu', role: 'student', studentId: 'STU001' },
      { firstName: 'Jane', lastName: 'Lecturer', email: 'lecturer@hbiu.edu', role: 'lecturer' },
      { firstName: 'College', lastName: 'Admin', email: 'collegeadmin@hbiu.edu', role: 'college_admin' }
    ];
    
    for (const userData of users) {
      await User.findOrCreate({
        where: { email: userData.email },
        defaults: {
          ...userData,
          password: hashedPassword,
          status: 'active',
          collegeId: college.id,
          emailVerified: true
        }
      });
      console.log(`✅ Created/Updated: ${userData.email}`);
    }
    
    console.log('Demo users ready!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createUsers();