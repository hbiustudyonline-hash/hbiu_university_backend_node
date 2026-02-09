const { User, College, Course, Enrollment, Assignment } = require('../models');
const { hashPassword } = require('../utils/auth');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await Assignment.destroy({ where: {}, force: true });
    await Enrollment.destroy({ where: {}, force: true });
    await Course.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });
    await College.destroy({ where: {}, force: true });

    // Create Colleges
    console.log('📚 Creating colleges...');
    const colleges = await College.bulkCreate([
      {
        id: 1,
        name: 'College of Engineering',
        description: 'Leading institution for engineering education and research',
        code: 'CENG',
        address: '123 Engineering Way, Tech City, TC 12345',
        phoneNumber: '+1-555-0101',
        email: 'info@ceng.hbiu.edu',
        website: 'https://ceng.hbiu.edu',
        establishedYear: 1985,
        status: 'active'
      },
      {
        id: 2,
        name: 'College of Business Administration',
        description: 'Excellence in business education and leadership development',
        code: 'CBA',
        address: '456 Business Blvd, Commerce City, CC 23456',
        phoneNumber: '+1-555-0102',
        email: 'info@cba.hbiu.edu',
        website: 'https://cba.hbiu.edu',
        establishedYear: 1978,
        status: 'active'
      },
      {
        id: 3,
        name: 'College of Liberal Arts',
        description: 'Fostering critical thinking and creativity through liberal arts education',
        code: 'CLA',
        address: '789 Arts Avenue, Culture City, CC 34567',
        phoneNumber: '+1-555-0103',
        email: 'info@cla.hbiu.edu',
        website: 'https://cla.hbiu.edu',
        establishedYear: 1972,
        status: 'active'
      },
      {
        id: 4,
        name: 'College of Computer Science',
        description: 'Cutting-edge technology education and innovation',
        code: 'CCS',
        address: '321 Tech Park, Silicon Valley, SV 45678',
        phoneNumber: '+1-555-0104',
        email: 'info@ccs.hbiu.edu',
        website: 'https://ccs.hbiu.edu',
        establishedYear: 1990,
        status: 'active'
      }
    ]);

    // Create Users
    console.log('👥 Creating users...');
    const hashedPassword = await hashPassword('password123');

    const users = await User.bulkCreate([
      // Admin User - matches frontend mock
      {
        id: 1,
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@hbiu.edu',
        password: hashedPassword,
        role: 'admin',
        status: 'active',
        phoneNumber: '+1-555-0001',
        emailVerified: true,
        collegeId: 1
      },
      // Student User - matches frontend mock
      {
        id: 2,
        firstName: 'Student',
        lastName: 'User',
        email: 'student@hbiu.edu',
        password: hashedPassword,
        role: 'student',
        status: 'active',
        studentId: 'STU999',
        phoneNumber: '+1-555-0002',
        emailVerified: true,
        collegeId: 4,
        dateOfBirth: '2000-01-01'
      },
      // Lecturer User - matches frontend mock
      {
        id: 3,
        firstName: 'Lecturer',
        lastName: 'User',
        email: 'lecturer@hbiu.edu',
        password: hashedPassword,
        role: 'lecturer',
        status: 'active',
        phoneNumber: '+1-555-0003',
        emailVerified: true,
        collegeId: 4
      },
      // College Admin - matches frontend mock
      {
        id: 4,
        firstName: 'College',
        lastName: 'Admin',
        email: 'college@hbiu.edu',
        password: hashedPassword,
        role: 'college_admin',
        status: 'active',
        phoneNumber: '+1-555-0004',
        emailVerified: true,
        collegeId: 4
      },
      // Additional Lecturers
      {
        id: 5,
        firstName: 'Dr. John',
        lastName: 'Smith',
        email: 'john.smith@hbiu.edu',
        password: hashedPassword,
        role: 'lecturer',
        status: 'active',
        phoneNumber: '+1-555-0005',
        emailVerified: true,
        collegeId: 1
      },
      {
        id: 6,
        firstName: 'Prof. Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@hbiu.edu',
        password: hashedPassword,
        role: 'lecturer',
        status: 'active',
        phoneNumber: '+1-555-0006',
        emailVerified: true,
        collegeId: 4
      },
      {
        id: 7,
        firstName: 'Dr. Michael',
        lastName: 'Brown',
        email: 'michael.brown@hbiu.edu',
        password: hashedPassword,
        role: 'lecturer',
        status: 'active',
        phoneNumber: '+1-555-0007',
        emailVerified: true,
        collegeId: 2
      },
      {
        id: 8,
        firstName: 'Prof. Emily',
        lastName: 'Davis',
        email: 'emily.davis@hbiu.edu',
        password: hashedPassword,
        role: 'lecturer',
        status: 'active',
        phoneNumber: '+1-555-0008',
        emailVerified: true,
        collegeId: 3
      },
      // Additional Students
      {
        id: 9,
        firstName: 'Alice',
        lastName: 'Wilson',
        email: 'alice.wilson@student.hbiu.edu',
        password: hashedPassword,
        role: 'student',
        status: 'active',
        studentId: 'STU001',
        phoneNumber: '+1-555-1001',
        emailVerified: true,
        collegeId: 4,
        dateOfBirth: '2000-05-15'
      },
      {
        id: 10,
        firstName: 'Bob',
        lastName: 'Martinez',
        email: 'bob.martinez@student.hbiu.edu',
        password: hashedPassword,
        role: 'student',
        status: 'active',
        studentId: 'STU002',
        phoneNumber: '+1-555-1002',
        emailVerified: true,
        collegeId: 1,
        dateOfBirth: '1999-08-22'
      },
      {
        id: 11,
        firstName: 'Carol',
        lastName: 'Taylor',
        email: 'carol.taylor@student.hbiu.edu',
        password: hashedPassword,
        role: 'student',
        status: 'active',
        studentId: 'STU003',
        phoneNumber: '+1-555-1003',
        emailVerified: true,
        collegeId: 2,
        dateOfBirth: '2001-03-10'
      },
      {
        id: 12,
        firstName: 'David',
        lastName: 'Anderson',
        email: 'david.anderson@student.hbiu.edu',
        password: hashedPassword,
        role: 'student',
        status: 'active',
        studentId: 'STU004',
        phoneNumber: '+1-555-1004',
        emailVerified: true,
        collegeId: 4,
        dateOfBirth: '2000-11-28'
      },
      {
        id: 13,
        firstName: 'Eva',
        lastName: 'Thompson',
        email: 'eva.thompson@student.hbiu.edu',
        password: hashedPassword,
        role: 'student',
        status: 'active',
        studentId: 'STU005',
        phoneNumber: '+1-555-1005',
        emailVerified: true,
        collegeId: 3,
        dateOfBirth: '1999-12-05'
      }
    ]);

    // Create Courses
    console.log('📖 Creating courses...');
    const courses = await Course.bulkCreate([
      {
        id: 1,
        title: 'Introduction to Computer Science',
        description: 'Fundamental concepts of computer science including programming, algorithms, and data structures.',
        code: 'CS101',
        credits: 3,
        duration: 16,
        level: 'beginner',
        category: 'Computer Science',
        prerequisites: 'Basic mathematics knowledge',
        learningOutcomes: 'Students will learn programming fundamentals, basic algorithms, and problem-solving techniques.',
        syllabus: 'Week 1-4: Programming basics, Week 5-8: Data structures, Week 9-12: Algorithms, Week 13-16: Projects',
        status: 'published',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-05-15'),
        enrollmentLimit: 50,
        price: 0.00,
        collegeId: 4,
        lecturerId: 6
      },
      {
        id: 2,
        title: 'Mechanical Engineering Fundamentals',
        description: 'Core principles of mechanical engineering including thermodynamics, mechanics, and materials science.',
        code: 'ME101',
        credits: 4,
        duration: 16,
        level: 'beginner',
        category: 'Engineering',
        prerequisites: 'Calculus I and Physics I',
        learningOutcomes: 'Understanding of mechanical systems, material properties, and engineering design principles.',
        syllabus: 'Statics, Dynamics, Thermodynamics, Materials Science, Engineering Design',
        status: 'published',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-05-15'),
        enrollmentLimit: 40,
        price: 0.00,
        collegeId: 1,
        lecturerId: 5
      },
      {
        id: 3,
        title: 'Business Strategy and Management',
        description: 'Strategic thinking and management principles for modern business environments.',
        code: 'BUS301',
        credits: 3,
        duration: 12,
        level: 'intermediate',
        category: 'Business',
        prerequisites: 'Introduction to Business',
        learningOutcomes: 'Strategic planning skills, leadership capabilities, and business analysis techniques.',
        syllabus: 'Strategic Planning, Organizational Behavior, Leadership, Market Analysis, Case Studies',
        status: 'published',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-04-30'),
        enrollmentLimit: 30,
        price: 0.00,
        collegeId: 2,
        lecturerId: 7
      },
      {
        id: 4,
        title: 'World Literature',
        description: 'Survey of major works in world literature from ancient times to the present.',
        code: 'LIT201',
        credits: 3,
        duration: 16,
        level: 'intermediate',
        category: 'Literature',
        prerequisites: 'English Composition',
        learningOutcomes: 'Critical analysis skills, cultural awareness, and appreciation of literary traditions.',
        syllabus: 'Ancient Literature, Medieval Works, Renaissance, Modern Literature, Contemporary Voices',
        status: 'published',
        startDate: new Date('2024-01-20'),
        endDate: new Date('2024-05-20'),
        enrollmentLimit: 25,
        price: 0.00,
        collegeId: 3,
        lecturerId: 8
      },
      {
        id: 5,
        title: 'Advanced Web Development',
        description: 'Modern web development techniques using React, Node.js, and cloud technologies.',
        code: 'CS401',
        credits: 4,
        duration: 14,
        level: 'advanced',
        category: 'Computer Science',
        prerequisites: 'Web Development Basics, JavaScript Programming',
        learningOutcomes: 'Full-stack development skills, cloud deployment, and modern web frameworks.',
        syllabus: 'React Framework, Node.js Backend, Database Integration, Cloud Deployment, Security',
        status: 'published',
        startDate: new Date('2024-02-15'),
        endDate: new Date('2024-05-30'),
        enrollmentLimit: 20,
        price: 0.00,
        collegeId: 4,
        lecturerId: 6
      }
    ]);

    // Create Enrollments
    console.log('📋 Creating enrollments...');
    const enrollments = await Enrollment.bulkCreate([
      // Alice enrolls in multiple courses
      {
        userId: 9,
        courseId: 1,
        enrollmentDate: new Date('2024-01-10'),
        status: 'enrolled',
        progress: 75.5
      },
      {
        userId: 9,
        courseId: 5,
        enrollmentDate: new Date('2024-02-10'),
        status: 'enrolled',
        progress: 45.0
      },
      // Bob enrolls in engineering course
      {
        userId: 10,
        courseId: 2,
        enrollmentDate: new Date('2024-01-12'),
        status: 'enrolled',
        progress: 60.0
      },
      // Carol enrolls in business course
      {
        userId: 11,
        courseId: 3,
        enrollmentDate: new Date('2024-01-28'),
        status: 'enrolled',
        progress: 30.5
      },
      // David enrolls in CS courses
      {
        userId: 12,
        courseId: 1,
        enrollmentDate: new Date('2024-01-08'),
        status: 'completed',
        progress: 100.0,
        grade: 88.5,
        completionDate: new Date('2024-05-10')
      },
      {
        userId: 12,
        courseId: 5,
        enrollmentDate: new Date('2024-02-12'),
        status: 'enrolled',
        progress: 25.0
      },
      // Eva enrolls in literature course
      {
        userId: 13,
        courseId: 4,
        enrollmentDate: new Date('2024-01-18'),
        status: 'enrolled',
        progress: 55.0
      }
    ]);

    // Create Assignments
    console.log('📝 Creating assignments...');
    const assignments = await Assignment.bulkCreate([
      // CS101 Assignments
      {
        title: 'Programming Assignment 1',
        description: 'Basic programming exercises covering variables, loops, and functions.',
        instructions: 'Complete the programming exercises in the provided template. Submit your code and documentation.',
        type: 'assignment',
        maxScore: 100.00,
        dueDate: new Date('2024-02-15'),
        availableFrom: new Date('2024-02-01'),
        timeLimit: null,
        attempts: 3,
        status: 'published',
        weight: 15.00,
        courseId: 1,
        createdBy: 6
      },
      {
        title: 'Midterm Exam',
        description: 'Comprehensive exam covering first half of the course material.',
        instructions: 'Online exam covering programming fundamentals and basic algorithms.',
        type: 'exam',
        maxScore: 100.00,
        dueDate: new Date('2024-03-15'),
        availableFrom: new Date('2024-03-15'),
        timeLimit: 120, // 2 hours
        attempts: 1,
        status: 'published',
        weight: 25.00,
        courseId: 1,
        createdBy: 6
      },
      // ME101 Assignments
      {
        title: 'Statics Problem Set',
        description: 'Solve engineering problems related to static equilibrium.',
        instructions: 'Complete all problems showing detailed work and free body diagrams.',
        type: 'assignment',
        maxScore: 100.00,
        dueDate: new Date('2024-02-20'),
        availableFrom: new Date('2024-02-05'),
        timeLimit: null,
        attempts: 2,
        status: 'published',
        weight: 20.00,
        courseId: 2,
        createdBy: 5
      },
      // BUS301 Assignments
      {
        title: 'Case Study Analysis',
        description: 'Strategic analysis of a Fortune 500 company.',
        instructions: 'Conduct comprehensive analysis including SWOT, financial review, and strategic recommendations.',
        type: 'project',
        maxScore: 100.00,
        dueDate: new Date('2024-04-15'),
        availableFrom: new Date('2024-03-01'),
        timeLimit: null,
        attempts: 1,
        status: 'published',
        weight: 30.00,
        courseId: 3,
        createdBy: 7
      },
      // LIT201 Assignments
      {
        title: 'Literary Analysis Essay',
        description: 'Critical analysis of a selected world literature work.',
        instructions: 'Write a 2000-word analysis examining themes, literary techniques, and cultural context.',
        type: 'assignment',
        maxScore: 100.00,
        dueDate: new Date('2024-03-30'),
        availableFrom: new Date('2024-03-01'),
        timeLimit: null,
        attempts: 1,
        status: 'published',
        weight: 25.00,
        courseId: 4,
        createdBy: 8
      }
    ]);

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Created: ${colleges.length} colleges, ${users.length} users, ${courses.length} courses, ${enrollments.length} enrollments, ${assignments.length} assignments`);

    return {
      colleges: colleges.length,
      users: users.length,
      courses: courses.length,
      enrollments: enrollments.length,
      assignments: assignments.length
    };

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

module.exports = seedDatabase;