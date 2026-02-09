const express = require('express');
const router = express.Router();
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validateCourse } = require('../middleware/validation');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getCourseModules,
  getCourseAssignments,
  getCourseStudents,
} = require('../controllers/courseController');

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get('/', optionalAuth, getCourses);

// @route   POST /api/courses
// @desc    Create a new course
// @access  Private/Lecturer
router.post('/', protect, authorize('lecturer', 'admin'), validateCourse, createCourse);

// @route   GET /api/courses/:id
// @desc    Get course by ID
// @access  Public
router.get('/:id', optionalAuth, getCourse);

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Private/Lecturer
router.put('/:id', protect, authorize('lecturer', 'admin'), validateCourse, updateCourse);

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), deleteCourse);

// @route   POST /api/courses/:id/enroll
// @desc    Enroll in a course
// @access  Private/Student
router.post('/:id/enroll', protect, authorize('student'), enrollInCourse);

// @route   GET /api/courses/:id/modules
// @desc    Get course modules
// @access  Private
router.get('/:id/modules', protect, getCourseModules);

// @route   GET /api/courses/:id/assignments
// @desc    Get course assignments
// @access  Private
router.get('/:id/assignments', protect, getCourseAssignments);

// @route   GET /api/courses/:id/students
// @desc    Get course students
// @access  Private/Lecturer/Admin
router.get('/:id/students', protect, authorize('lecturer', 'admin'), getCourseStudents);

module.exports = router;