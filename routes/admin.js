const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validateUserUpdate } = require('../middleware/validation');
const {
  getAdminStats,
  getAnalytics,
  getAdminUsers,
  updateUserRole,
  bulkOperations,
  getSystemHealth,
} = require('../controllers/adminController');

// @route   GET /api/admin/stats
// @desc    Get admin dashboard statistics
// @access  Private/Admin
router.get('/stats', protect, authorize('admin'), getAdminStats);

// @route   GET /api/admin/users
// @desc    Get all users with admin privileges
// @access  Private/Admin
router.get('/users', protect, authorize('admin'), getAdminUsers);

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private/Admin
router.put('/users/:id/role', protect, authorize('admin'), validateUserUpdate, updateUserRole);

// @route   GET /api/admin/analytics
// @desc    Get system analytics
// @access  Private/Admin
router.get('/analytics', protect, authorize('admin'), getAnalytics);

// @route   POST /api/admin/bulk-operations
// @desc    Perform bulk operations
// @access  Private/Admin
router.post('/bulk-operations', protect, authorize('admin'), bulkOperations);

// @route   GET /api/admin/system-health
// @desc    Get system health metrics
// @access  Private/Admin
router.get('/system-health', protect, authorize('admin'), getSystemHealth);

module.exports = router;