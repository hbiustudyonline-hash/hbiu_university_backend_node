const express = require('express');
const router = express.Router();
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validateCollege } = require('../middleware/validation');
const {
  getColleges,
  getCollege,
  createCollege,
  updateCollege,
  deleteCollege,
  getCollegeCourses,
  getCollegeStaff,
  getCollegeStudents,
} = require('../controllers/collegeController');

// @route   GET /api/colleges
// @desc    Get all colleges
// @access  Public
router.get('/', optionalAuth, getColleges);

// @route   POST /api/colleges
// @desc    Create a new college
// @access  Private/Admin
router.post('/', protect, authorize('admin'), validateCollege, createCollege);

// @route   GET /api/colleges/:id
// @desc    Get college by ID
// @access  Public
router.get('/:id', optionalAuth, getCollege);

// @route   PUT /api/colleges/:id
// @desc    Update college
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), validateCollege, updateCollege);

// @route   DELETE /api/colleges/:id
// @desc    Delete college
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), deleteCollege);

// @route   GET /api/colleges/:id/courses
// @desc    Get college courses
// @access  Public
router.get('/:id/courses', optionalAuth, getCollegeCourses);

// @route   GET /api/colleges/:id/staff
// @desc    Get college staff
// @access  Private/Admin
router.get('/:id/staff', protect, authorize('admin', 'college_admin'), getCollegeStaff);

// @route   GET /api/colleges/:id/students
// @desc    Get college students
// @access  Private/Admin
router.get('/:id/students', protect, authorize('admin', 'college_admin'), getCollegeStudents);

module.exports = router;