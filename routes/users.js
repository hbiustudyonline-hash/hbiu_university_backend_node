const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validateUserUpdate } = require('../middleware/validation');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserCourses,
  getUserStats,
} = require('../controllers/userController');

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/', protect, authorize('admin'), getUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', protect, getUser);

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private
router.put('/:id', protect, validateUserUpdate, updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user (admin only)
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), deleteUser);

// @route   GET /api/users/:id/courses
// @desc    Get user's enrolled courses
// @access  Private
router.get('/:id/courses', protect, getUserCourses);

// @route   GET /api/users/:id/stats
// @desc    Get user dashboard stats
// @access  Private
router.get('/:id/stats', protect, getUserStats);

module.exports = router;