const { User, College, Course, Enrollment } = require('../models');
const { successResponse, errorResponse, asyncHandler, paginate, getPaginationMeta } = require('../utils/response');
const { Op } = require('sequelize');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, role, status, collegeId } = req.query;
  const { offset, limit: limitNum } = paginate(page, limit);

  // Build where clause
  const where = {};
  if (search) {
    where[Op.or] = [
      { firstName: { [Op.like]: `%${search}%` } },
      { lastName: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { studentId: { [Op.like]: `%${search}%` } }
    ];
  }
  if (role) where.role = role;
  if (status) where.status = status;
  if (collegeId) where.collegeId = collegeId;

  const { count, rows: users } = await User.findAndCountAll({
    where,
    attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpire'] },
    include: [{
      model: College,
      as: 'college',
      attributes: ['id', 'name', 'code']
    }],
    order: [['createdAt', 'DESC']],
    offset,
    limit: limitNum,
  });

  const pagination = getPaginationMeta(count, page, limitNum);

  successResponse(res, {
    users,
    pagination
  }, 'Users retrieved successfully');
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpire'] },
    include: [
      {
        model: College,
        as: 'college',
        attributes: ['id', 'name', 'code']
      },
      {
        model: Course,
        as: 'taughtCourses',
        attributes: ['id', 'title', 'code', 'status'],
        required: false
      }
    ]
  });

  if (!user) {
    return errorResponse(res, 'User not found', 404);
  }

  // Check if user can view this profile
  if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.id)) {
    return errorResponse(res, 'Not authorized to view this profile', 403);
  }

  successResponse(res, user, 'User retrieved successfully');
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin or Owner
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return errorResponse(res, 'User not found', 404);
  }

  // Check authorization
  const isOwner = req.user.id === parseInt(req.params.id);
  const isAdmin = req.user.role === 'admin';
  
  if (!isOwner && !isAdmin) {
    return errorResponse(res, 'Not authorized to update this user', 403);
  }

  // Define allowed updates based on role
  let allowedUpdates;
  if (isAdmin) {
    allowedUpdates = ['firstName', 'lastName', 'email', 'role', 'status', 'phoneNumber', 'dateOfBirth', 'address', 'collegeId'];
  } else {
    allowedUpdates = ['firstName', 'lastName', 'phoneNumber', 'dateOfBirth', 'address'];
  }

  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  // Check if email is being changed and if it already exists
  if (updates.email && updates.email !== user.email) {
    const existingUser = await User.findOne({ where: { email: updates.email } });
    if (existingUser) {
      return errorResponse(res, 'Email already exists', 400);
    }
  }

  await user.update(updates);

  // Get updated user
  const updatedUser = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpire'] },
    include: [{
      model: College,
      as: 'college',
      attributes: ['id', 'name', 'code']
    }]
  });

  successResponse(res, updatedUser, 'User updated successfully');
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return errorResponse(res, 'User not found', 404);
  }

  // Prevent admin from deleting themselves
  if (req.user.id === parseInt(req.params.id)) {
    return errorResponse(res, 'Cannot delete your own account', 400);
  }

  await user.destroy();

  successResponse(res, null, 'User deleted successfully');
});

// @desc    Get user's enrolled courses
// @route   GET /api/users/:id/courses
// @access  Private
const getUserCourses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const { offset, limit: limitNum } = paginate(page, limit);

  // Check authorization
  if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.id)) {
    return errorResponse(res, 'Not authorized to view these courses', 403);
  }

  const where = { userId: req.params.id };
  if (status) where.status = status;

  const { count, rows: enrollments } = await Enrollment.findAndCountAll({
    where,
    include: [
      {
        model: Course,
        as: 'course',
        attributes: ['id', 'title', 'code', 'description', 'credits', 'startDate', 'endDate'],
        include: [
          {
            model: User,
            as: 'lecturer',
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: College,
            as: 'college',
            attributes: ['id', 'name', 'code']
          }
        ]
      }
    ],
    order: [['enrollmentDate', 'DESC']],
    offset,
    limit: limitNum,
  });

  const pagination = getPaginationMeta(count, page, limitNum);

  successResponse(res, {
    enrollments,
    pagination
  }, 'User courses retrieved successfully');
});

// @desc    Get dashboard stats for user
// @route   GET /api/users/:id/stats
// @access  Private
const getUserStats = asyncHandler(async (req, res) => {
  // Check authorization
  if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.id)) {
    return errorResponse(res, 'Not authorized to view these stats', 403);
  }

  const userId = req.params.id;

  // Get enrollment statistics
  const totalEnrolled = await Enrollment.count({
    where: { userId }
  });

  const completedCourses = await Enrollment.count({
    where: { userId, status: 'completed' }
  });

  const activeCourses = await Enrollment.count({
    where: { userId, status: 'enrolled' }
  });

  // If user is a lecturer, get teaching stats
  let teachingStats = null;
  const user = await User.findByPk(userId);
  if (user.role === 'lecturer') {
    const totalCourses = await Course.count({
      where: { lecturerId: userId }
    });

    const totalStudents = await Enrollment.count({
      include: [{
        model: Course,
        as: 'course',
        where: { lecturerId: userId }
      }]
    });

    teachingStats = {
      totalCourses,
      totalStudents
    };
  }

  successResponse(res, {
    learning: {
      totalEnrolled,
      completedCourses,
      activeCourses
    },
    teaching: teachingStats
  }, 'User stats retrieved successfully');
});

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserCourses,
  getUserStats,
};