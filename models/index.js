const { sequelize } = require('../config/database');

// Import all models
const User = require('./User');
const College = require('./College');
const Course = require('./Course');
const Enrollment = require('./Enrollment');
const Assignment = require('./Assignment');

// Define associations
// User - College relationship (many-to-one)
User.belongsTo(College, { 
  foreignKey: 'collegeId', 
  as: 'college' 
});
College.hasMany(User, { 
  foreignKey: 'collegeId', 
  as: 'users' 
});

// Course - College relationship (many-to-one)
Course.belongsTo(College, { 
  foreignKey: 'collegeId', 
  as: 'college' 
});
College.hasMany(Course, { 
  foreignKey: 'collegeId', 
  as: 'courses' 
});

// Course - User (lecturer) relationship (many-to-one)
Course.belongsTo(User, { 
  foreignKey: 'lecturerId', 
  as: 'lecturer' 
});
User.hasMany(Course, { 
  foreignKey: 'lecturerId', 
  as: 'taughtCourses' 
});

// User - Course enrollment relationship (many-to-many through Enrollment)
User.belongsToMany(Course, { 
  through: Enrollment, 
  foreignKey: 'userId', 
  otherKey: 'courseId',
  as: 'enrolledCourses' 
});
Course.belongsToMany(User, { 
  through: Enrollment, 
  foreignKey: 'courseId', 
  otherKey: 'userId',
  as: 'enrolledStudents' 
});

// Direct associations for Enrollment
Enrollment.belongsTo(User, { 
  foreignKey: 'userId', 
  as: 'user' 
});
Enrollment.belongsTo(Course, { 
  foreignKey: 'courseId', 
  as: 'course' 
});

User.hasMany(Enrollment, { 
  foreignKey: 'userId', 
  as: 'enrollments' 
});
Course.hasMany(Enrollment, { 
  foreignKey: 'courseId', 
  as: 'enrollments' 
});

// Assignment - Course relationship (many-to-one)
Assignment.belongsTo(Course, { 
  foreignKey: 'courseId', 
  as: 'course' 
});
Course.hasMany(Assignment, { 
  foreignKey: 'courseId', 
  as: 'assignments' 
});

// Assignment - User (creator) relationship (many-to-one)
Assignment.belongsTo(User, { 
  foreignKey: 'createdBy', 
  as: 'creator' 
});
User.hasMany(Assignment, { 
  foreignKey: 'createdBy', 
  as: 'createdAssignments' 
});

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  College,
  Course,
  Enrollment,
  Assignment
};