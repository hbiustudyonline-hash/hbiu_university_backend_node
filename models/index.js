const { sequelize } = require('../config/database');

// Import all models
const User = require('./User');
const College = require('./College');
const Course = require('./Course');
const Enrollment = require('./Enrollment');
const Assignment = require('./Assignment');
const Module = require('./Module');
const Announcement = require('./Announcement');
const Quiz = require('./Quiz');
const Submission = require('./Submission');
const SystemSetting = require('./SystemSetting');
const Discussion = require('./Discussion');
const Attendance = require('./Attendance');
const Page = require('./Page');
const FinalExam = require('./FinalExam');
const FinalExamSubmission = require('./FinalExamSubmission');
const Transcript = require('./Transcript');
const CollegeStaff = require('./CollegeStaff');
const Degree = require('./Degree');
const AIInstructor = require('./AIInstructor');

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

// Module - Course relationship (many-to-one)
Module.belongsTo(Course, {
  foreignKey: 'courseId',
  as: 'course'
});
Course.hasMany(Module, {
  foreignKey: 'courseId',
  as: 'modules'
});

// Announcement - Course relationship (many-to-one, optional)
Announcement.belongsTo(Course, {
  foreignKey: 'courseId',
  as: 'course'
});
Course.hasMany(Announcement, {
  foreignKey: 'courseId',
  as: 'announcements'
});

// Announcement - User (author) relationship
Announcement.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author'
});
User.hasMany(Announcement, {
  foreignKey: 'authorId',
  as: 'announcements'
});

// Quiz - Course relationship
Quiz.belongsTo(Course, {
  foreignKey: 'courseId',
  as: 'course'
});
Course.hasMany(Quiz, {
  foreignKey: 'courseId',
  as: 'quizzes'
});

// Quiz - Module relationship (optional)
Quiz.belongsTo(Module, {
  foreignKey: 'moduleId',
  as: 'module'
});
Module.hasMany(Quiz, {
  foreignKey: 'moduleId',
  as: 'quizzes'
});

// Submission - Assignment relationship
Submission.belongsTo(Assignment, {
  foreignKey: 'assignmentId',
  as: 'assignment'
});
Assignment.hasMany(Submission, {
  foreignKey: 'assignmentId',
  as: 'submissions'
});

// Submission - User (student) relationship
Submission.belongsTo(User, {
  foreignKey: 'studentId',
  as: 'student'
});
User.hasMany(Submission, {
  foreignKey: 'studentId',
  as: 'submissions'
});

// Submission - User (grader) relationship
Submission.belongsTo(User, {
  foreignKey: 'gradedBy',
  as: 'grader'
});
User.hasMany(Submission, {
  foreignKey: 'gradedBy',
  as: 'gradedSubmissions'
});

// Discussion - Course relationship
Discussion.belongsTo(Course, {
  foreignKey: 'courseId',
  as: 'course'
});
Course.hasMany(Discussion, {
  foreignKey: 'courseId',
  as: 'discussions'
});

// Discussion - Module relationship (optional)
Discussion.belongsTo(Module, {
  foreignKey: 'moduleId',
  as: 'module'
});
Module.hasMany(Discussion, {
  foreignKey: 'moduleId',
  as: 'discussions'
});

// Discussion - User (author) relationship
Discussion.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author'
});
User.hasMany(Discussion, {
  foreignKey: 'authorId',
  as: 'discussions'
});

// Attendance - Course relationship
Attendance.belongsTo(Course, {
  foreignKey: 'courseId',
  as: 'course'
});
Course.hasMany(Attendance, {
  foreignKey: 'courseId',
  as: 'attendances'
});

// Attendance - User (student) relationship
Attendance.belongsTo(User, {
  foreignKey: 'studentId',
  as: 'student'
});
User.hasMany(Attendance, {
  foreignKey: 'studentId',
  as: 'attendances'
});

// Attendance - Module relationship (optional)
Attendance.belongsTo(Module, {
  foreignKey: 'moduleId',
  as: 'module'
});
Module.hasMany(Attendance, {
  foreignKey: 'moduleId',
  as: 'attendances'
});

// Page - Course relationship
Page.belongsTo(Course, {
  foreignKey: 'courseId',
  as: 'course'
});
Course.hasMany(Page, {
  foreignKey: 'courseId',
  as: 'pages'
});

// Page - Module relationship (optional)
Page.belongsTo(Module, {
  foreignKey: 'moduleId',
  as: 'module'
});
Module.hasMany(Page, {
  foreignKey: 'moduleId',
  as: 'pages'
});

// Page - User (creator) relationship
Page.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator'
});
User.hasMany(Page, {
  foreignKey: 'createdBy',
  as: 'createdPages'
});

// FinalExam - Course relationship
FinalExam.belongsTo(Course, {
  foreignKey: 'courseId',
  as: 'course'
});
Course.hasMany(FinalExam, {
  foreignKey: 'courseId',
  as: 'finalExams'
});

// FinalExam - User (creator) relationship
FinalExam.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator'
});
User.hasMany(FinalExam, {
  foreignKey: 'createdBy',
  as: 'createdFinalExams'
});

// FinalExamSubmission - FinalExam relationship
FinalExamSubmission.belongsTo(FinalExam, {
  foreignKey: 'examId',
  as: 'exam'
});
FinalExam.hasMany(FinalExamSubmission, {
  foreignKey: 'examId',
  as: 'submissions'
});

// FinalExamSubmission - User (student) relationship
FinalExamSubmission.belongsTo(User, {
  foreignKey: 'studentId',
  as: 'student'
});
User.hasMany(FinalExamSubmission, {
  foreignKey: 'studentId',
  as: 'finalExamSubmissions'
});

// FinalExamSubmission - User (grader) relationship
FinalExamSubmission.belongsTo(User, {
  foreignKey: 'gradedBy',
  as: 'grader'
});
User.hasMany(FinalExamSubmission, {
  foreignKey: 'gradedBy',
  as: 'gradedFinalExams'
});

// Transcript - User (student) relationship
Transcript.belongsTo(User, {
  foreignKey: 'studentId',
  as: 'student'
});
User.hasMany(Transcript, {
  foreignKey: 'studentId',
  as: 'transcripts'
});

// Transcript - Course relationship
Transcript.belongsTo(Course, {
  foreignKey: 'courseId',
  as: 'course'
});
Course.hasMany(Transcript, {
  foreignKey: 'courseId',
  as: 'transcripts'
});

// CollegeStaff - College relationship
CollegeStaff.belongsTo(College, {
  foreignKey: 'collegeId',
  as: 'college'
});
College.hasMany(CollegeStaff, {
  foreignKey: 'collegeId',
  as: 'staff'
});

// CollegeStaff - User relationship
CollegeStaff.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});
User.hasOne(CollegeStaff, {
  foreignKey: 'userId',
  as: 'staffProfile'
});

// Degree - College relationship
Degree.belongsTo(College, {
  foreignKey: 'collegeId',
  as: 'college'
});
College.hasMany(Degree, {
  foreignKey: 'collegeId',
  as: 'degrees'
});

// AIInstructor - Course relationship
AIInstructor.belongsTo(Course, {
  foreignKey: 'courseId',
  as: 'course'
});
Course.hasMany(AIInstructor, {
  foreignKey: 'courseId',
  as: 'aiInstructors'
});

// AIInstructor - User (creator) relationship
AIInstructor.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator'
});
User.hasMany(AIInstructor, {
  foreignKey: 'createdBy',
  as: 'createdAIInstructors'
});

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  College,
  Course,
  Enrollment,
  Assignment,
  Module,
  Announcement,
  Quiz,
  Submission,
  SystemSetting,
  Discussion,
  Attendance,
  Page,
  FinalExam,
  FinalExamSubmission,
  Transcript,
  CollegeStaff,
  Degree,
  AIInstructor
};