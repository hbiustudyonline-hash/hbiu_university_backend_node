const { User, College, Course, Enrollment, Assignment } = require('../models');
const { successResponse, errorResponse, asyncHandler } = require('../utils/response');
const { Op } = require('sequelize');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
  // Get current date for filtering
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Total counts
  const totalUsers = await User.count();
  const totalStudents = await User.count({ where: { role: 'student' } });
  const totalLecturers = await User.count({ where: { role: 'lecturer' } });
  const totalColleges = await College.count();
  const totalCourses = await Course.count();
  const totalEnrollments = await Enrollment.count();

  // Recent registrations (last 30 days)
  const recentUsers = await User.count({
    where: {
      createdAt: {
        [Op.gte]: thirtyDaysAgo
      }
    }
  });

  // Active courses
  const activeCourses = await Course.count({
    where: { status: 'published' }
  });

  // Course enrollments by status
  const enrollmentsByStatus = await Enrollment.findAll({
    attributes: [
      'status',
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
    ],
    group: ['status'],
    raw: true
  });

  // Users by role
  const usersByRole = await User.findAll({
    attributes: [
      'role',
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
    ],
    group: ['role'],
    raw: true
  });

  // Monthly user growth (last 12 months)
  const monthlyGrowth = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const count = await User.count({
      where: {
        createdAt: {
          [Op.between]: [startOfMonth, endOfMonth]
        }
      }
    });

    monthlyGrowth.push({
      month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
      users: count
    });
  }

  successResponse(res, {
    overview: {
      totalUsers,
      totalStudents,
      totalLecturers,
      totalColleges,
      totalCourses,
      totalEnrollments,
      recentUsers,
      activeCourses
    },
    enrollmentsByStatus: enrollmentsByStatus.reduce((acc, item) => {
      acc[item.status] = parseInt(item.count);
      return acc;
    }, {}),
    usersByRole: usersByRole.reduce((acc, item) => {
      acc[item.role] = parseInt(item.count);
      return acc;
    }, {}),
    monthlyGrowth
  }, 'Admin statistics retrieved successfully');
});

// @desc    Get system analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = asyncHandler(async (req, res) => {
  const { timeframe = '30' } = req.query; // days
  const daysAgo = parseInt(timeframe);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysAgo);

  // User activity
  const activeUsers = await User.count({
    where: {
      lastLogin: {
        [Op.gte]: startDate
      }
    }
  });

  // Course performance
  const courseStats = await Course.findAll({
    attributes: [
      'id',
      'title',
      'code',
      [require('sequelize').fn('COUNT', require('sequelize').col('enrollments.id')), 'enrollmentCount']
    ],
    include: [
      {
        model: Enrollment,
        as: 'enrollments',
        attributes: [],
        required: false
      }
    ],
    group: ['Course.id'],
    order: [[require('sequelize').literal('enrollmentCount'), 'DESC']],
    limit: 10,
    subQuery: false
  });

  // Top colleges by enrollment
  const collegeStats = await College.findAll({
    attributes: [
      'id',
      'name',
      'code'
    ],
    include: [
      {
        model: Course,
        as: 'courses',
        attributes: [],
        include: [
          {
            model: Enrollment,
            as: 'enrollments',
            attributes: [],
            required: false
          }
        ],
        required: false
      }
    ],
    order: [['name', 'ASC']],
    limit: 10
  });

  successResponse(res, {
    activeUsers,
    topCourses: courseStats,
    collegeStats,
    timeframe: `${daysAgo} days`
  }, 'Analytics data retrieved successfully');
});

// @desc    Get all users for admin management
// @route   GET /api/admin/users
// @access  Private/Admin
const getAdminUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, status, search, collegeId } = req.query;
  const offset = (page - 1) * limit;

  // Build where clause
  const where = {};
  if (role) where.role = role;
  if (status) where.status = status;
  if (collegeId) where.collegeId = collegeId;
  if (search) {
    where[Op.or] = [
      { firstName: { [Op.like]: `%${search}%` } },
      { lastName: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { studentId: { [Op.like]: `%${search}%` } }
    ];
  }

  const { count, rows: users } = await User.findAndCountAll({
    where,
    attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpire'] },
    include: [
      {
        model: College,
        as: 'college',
        attributes: ['id', 'name', 'code']
      }
    ],
    order: [['createdAt', 'DESC']],
    offset: parseInt(offset),
    limit: parseInt(limit),
  });

  const pagination = {
    total: count,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(count / limit)
  };

  successResponse(res, {
    users,
    pagination
  }, 'Admin users retrieved successfully');
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  
  if (!['student', 'lecturer', 'admin', 'college_admin'].includes(role)) {
    return errorResponse(res, 'Invalid role', 400);
  }

  const user = await User.findByPk(req.params.id);
  if (!user) {
    return errorResponse(res, 'User not found', 404);
  }

  // Prevent admin from changing their own role
  if (req.user.id === parseInt(req.params.id)) {
    return errorResponse(res, 'Cannot change your own role', 400);
  }

  await user.update({ role });

  const updatedUser = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpire'] },
    include: [
      {
        model: College,
        as: 'college',
        attributes: ['id', 'name', 'code']
      }
    ]
  });

  successResponse(res, updatedUser, 'User role updated successfully');
});

// @desc    Perform bulk operations
// @route   POST /api/admin/bulk-operations
// @access  Private/Admin
const bulkOperations = asyncHandler(async (req, res) => {
  const { operation, userIds, data } = req.body;

  if (!operation || !userIds || !Array.isArray(userIds)) {
    return errorResponse(res, 'Invalid bulk operation request', 400);
  }

  let result;

  switch (operation) {
    case 'updateStatus':
      if (!['active', 'inactive', 'suspended'].includes(data.status)) {
        return errorResponse(res, 'Invalid status', 400);
      }
      
      result = await User.update(
        { status: data.status },
        { where: { id: { [Op.in]: userIds } } }
      );
      break;

    case 'assignCollege':
      if (!data.collegeId) {
        return errorResponse(res, 'College ID is required', 400);
      }
      
      // Verify college exists
      const college = await College.findByPk(data.collegeId);
      if (!college) {
        return errorResponse(res, 'College not found', 404);
      }
      
      result = await User.update(
        { collegeId: data.collegeId },
        { where: { id: { [Op.in]: userIds } } }
      );
      break;

    case 'delete':
      // Prevent deletion if current user is in the list
      if (userIds.includes(req.user.id)) {
        return errorResponse(res, 'Cannot delete your own account', 400);
      }
      
      result = await User.destroy({
        where: { id: { [Op.in]: userIds } }
      });
      break;

    default:
      return errorResponse(res, 'Invalid operation', 400);
  }

  successResponse(res, {
    operation,
    affectedRows: result[0] || result,
    userIds
  }, `Bulk ${operation} completed successfully`);
});

// @desc    Get system health and metrics
// @route   GET /api/admin/system-health
// @access  Private/Admin
const getSystemHealth = asyncHandler(async (req, res) => {
  // Database health check
  const dbHealth = await User.sequelize.authenticate()
    .then(() => true)
    .catch(() => false);

  // Get database size (SQLite specific)
  const dbStats = await User.sequelize.query(
    "SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size();",
    { type: require('sequelize').QueryTypes.SELECT }
  );

  const systemHealth = {
    database: {
      connected: dbHealth,
      size: dbStats[0]?.size || 0
    },
    server: {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version
    },
    timestamp: new Date().toISOString()
  };

  successResponse(res, systemHealth, 'System health retrieved successfully');
});

module.exports = {
  getAdminStats,
  getAnalytics,
  getAdminUsers,
  updateUserRole,
  bulkOperations,
  getSystemHealth,
};