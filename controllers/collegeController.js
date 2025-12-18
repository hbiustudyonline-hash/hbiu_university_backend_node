const { College, User, Course } = require('../models');
const { successResponse, errorResponse, asyncHandler, paginate, getPaginationMeta } = require('../utils/response');
const { Op } = require('sequelize');

// @desc    Get all colleges
// @route   GET /api/colleges
// @access  Public
const getColleges = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, status } = req.query;
  const { offset, limit: limitNum } = paginate(page, limit);

  // Build where clause
  const where = {};
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { code: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } }
    ];
  }
  if (status) where.status = status;

  // Only show active colleges for non-admin users
  if (!req.user || req.user.role !== 'admin') {
    where.status = 'active';
  }

  const { count, rows: colleges } = await College.findAndCountAll({
    where,
    order: [['name', 'ASC']],
    offset,
    limit: limitNum,
  });

  const pagination = getPaginationMeta(count, page, limitNum);

  successResponse(res, {
    colleges,
    pagination
  }, 'Colleges retrieved successfully');
});

// @desc    Get single college
// @route   GET /api/colleges/:id
// @access  Public
const getCollege = asyncHandler(async (req, res) => {
  const college = await College.findByPk(req.params.id);

  if (!college) {
    return errorResponse(res, 'College not found', 404);
  }

  // Check if college is active (unless admin)
  if (college.status !== 'active' && (!req.user || req.user.role !== 'admin')) {
    return errorResponse(res, 'College not available', 403);
  }

  // Get college statistics
  const totalCourses = await Course.count({
    where: { collegeId: req.params.id }
  });

  const totalStudents = await User.count({
    where: { collegeId: req.params.id, role: 'student' }
  });

  const totalLecturers = await User.count({
    where: { collegeId: req.params.id, role: 'lecturer' }
  });

  successResponse(res, {
    ...college.toJSON(),
    stats: {
      totalCourses,
      totalStudents,
      totalLecturers
    }
  }, 'College retrieved successfully');
});

// @desc    Create college
// @route   POST /api/colleges
// @access  Private/Admin
const createCollege = asyncHandler(async (req, res) => {
  // Check if college code already exists
  const existingCollege = await College.findOne({ where: { code: req.body.code } });
  if (existingCollege) {
    return errorResponse(res, 'College code already exists', 400);
  }

  const college = await College.create(req.body);

  successResponse(res, college, 'College created successfully', 201);
});

// @desc    Update college
// @route   PUT /api/colleges/:id
// @access  Private/Admin
const updateCollege = asyncHandler(async (req, res) => {
  const college = await College.findByPk(req.params.id);

  if (!college) {
    return errorResponse(res, 'College not found', 404);
  }

  // Check if code is being changed and if it already exists
  if (req.body.code && req.body.code !== college.code) {
    const existingCollege = await College.findOne({ where: { code: req.body.code } });
    if (existingCollege) {
      return errorResponse(res, 'College code already exists', 400);
    }
  }

  await college.update(req.body);

  successResponse(res, college, 'College updated successfully');
});

// @desc    Delete college
// @route   DELETE /api/colleges/:id
// @access  Private/Admin
const deleteCollege = asyncHandler(async (req, res) => {
  const college = await College.findByPk(req.params.id);

  if (!college) {
    return errorResponse(res, 'College not found', 404);
  }

  // Check if college has users or courses
  const hasUsers = await User.count({ where: { collegeId: req.params.id } });
  const hasCourses = await Course.count({ where: { collegeId: req.params.id } });

  if (hasUsers > 0 || hasCourses > 0) {
    return errorResponse(res, 'Cannot delete college with existing users or courses. Set status to inactive instead.', 400);
  }

  await college.destroy();

  successResponse(res, null, 'College deleted successfully');
});

// @desc    Get college courses
// @route   GET /api/colleges/:id/courses
// @access  Public
const getCollegeCourses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, search, level, status } = req.query;
  const { offset, limit: limitNum } = paginate(page, limit);

  // Check if college exists
  const college = await College.findByPk(req.params.id);
  if (!college) {
    return errorResponse(res, 'College not found', 404);
  }

  // Build where clause
  const where = { collegeId: req.params.id };
  if (search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { code: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } }
    ];
  }
  if (level) where.level = level;
  if (status) where.status = status;

  // Only show published courses for non-admin users
  if (!req.user || req.user.role !== 'admin') {
    where.status = 'published';
  }

  const { count, rows: courses } = await Course.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: 'lecturer',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }
    ],
    order: [['createdAt', 'DESC']],
    offset,
    limit: limitNum,
  });

  const pagination = getPaginationMeta(count, page, limitNum);

  successResponse(res, {
    courses,
    pagination,
    college: {
      id: college.id,
      name: college.name,
      code: college.code
    }
  }, 'College courses retrieved successfully');
});

// @desc    Get college staff
// @route   GET /api/colleges/:id/staff
// @access  Private/Admin/CollegeAdmin
const getCollegeStaff = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, status } = req.query;
  const { offset, limit: limitNum } = paginate(page, limit);

  // Check if college exists
  const college = await College.findByPk(req.params.id);
  if (!college) {
    return errorResponse(res, 'College not found', 404);
  }

  // Check authorization
  if (req.user.role !== 'admin' && 
      (req.user.role !== 'college_admin' || req.user.collegeId !== parseInt(req.params.id))) {
    return errorResponse(res, 'Not authorized to view college staff', 403);
  }

  // Build where clause
  const where = { 
    collegeId: req.params.id,
    role: { [Op.in]: ['lecturer', 'college_admin'] }
  };
  if (role && ['lecturer', 'college_admin'].includes(role)) {
    where.role = role;
  }
  if (status) where.status = status;

  const { count, rows: staff } = await User.findAndCountAll({
    where,
    attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpire'] },
    order: [['role', 'ASC'], ['firstName', 'ASC']],
    offset,
    limit: limitNum,
  });

  const pagination = getPaginationMeta(count, page, limitNum);

  successResponse(res, {
    staff,
    pagination,
    college: {
      id: college.id,
      name: college.name,
      code: college.code
    }
  }, 'College staff retrieved successfully');
});

// @desc    Get college students
// @route   GET /api/colleges/:id/students
// @access  Private/Admin/CollegeAdmin
const getCollegeStudents = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, status } = req.query;
  const { offset, limit: limitNum } = paginate(page, limit);

  // Check if college exists
  const college = await College.findByPk(req.params.id);
  if (!college) {
    return errorResponse(res, 'College not found', 404);
  }

  // Check authorization
  if (req.user.role !== 'admin' && 
      (req.user.role !== 'college_admin' || req.user.collegeId !== parseInt(req.params.id))) {
    return errorResponse(res, 'Not authorized to view college students', 403);
  }

  // Build where clause
  const where = { 
    collegeId: req.params.id,
    role: 'student'
  };
  if (search) {
    where[Op.or] = [
      { firstName: { [Op.like]: `%${search}%` } },
      { lastName: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { studentId: { [Op.like]: `%${search}%` } }
    ];
  }
  if (status) where.status = status;

  const { count, rows: students } = await User.findAndCountAll({
    where,
    attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpire'] },
    order: [['firstName', 'ASC']],
    offset,
    limit: limitNum,
  });

  const pagination = getPaginationMeta(count, page, limitNum);

  successResponse(res, {
    students,
    pagination,
    college: {
      id: college.id,
      name: college.name,
      code: college.code
    }
  }, 'College students retrieved successfully');
});

module.exports = {
  getColleges,
  getCollege,
  createCollege,
  updateCollege,
  deleteCollege,
  getCollegeCourses,
  getCollegeStaff,
  getCollegeStudents,
};