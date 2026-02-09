const { Course, User, College, Enrollment, Assignment } = require('../models');
const { successResponse, errorResponse, asyncHandler, paginate, getPaginationMeta } = require('../utils/response');
const { Op } = require('sequelize');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, search, category, level, status, collegeId } = req.query;
  const { offset, limit: limitNum } = paginate(page, limit);

  // Build where clause
  const where = {};
  if (search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { code: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } }
    ];
  }
  if (category) where.category = category;
  if (level) where.level = level;
  if (status) where.status = status;
  if (collegeId) where.collegeId = collegeId;

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
      },
      {
        model: College,
        as: 'college',
        attributes: ['id', 'name', 'code']
      }
    ],
    order: [['createdAt', 'DESC']],
    offset,
    limit: limitNum,
  });

  const pagination = getPaginationMeta(count, page, limitNum);

  successResponse(res, {
    courses,
    pagination
  }, 'Courses retrieved successfully');
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: 'lecturer',
        attributes: ['id', 'firstName', 'lastName', 'email', 'profilePicture']
      },
      {
        model: College,
        as: 'college',
        attributes: ['id', 'name', 'code', 'description']
      }
    ]
  });

  if (!course) {
    return errorResponse(res, 'Course not found', 404);
  }

  // Check if course is published (unless admin or lecturer)
  if (course.status !== 'published' && 
      (!req.user || (req.user.role !== 'admin' && req.user.id !== course.lecturerId))) {
    return errorResponse(res, 'Course not available', 403);
  }

  // Get enrollment count
  const enrollmentCount = await Enrollment.count({
    where: { courseId: req.params.id }
  });

  // Check if current user is enrolled (if authenticated)
  let isEnrolled = false;
  if (req.user) {
    const enrollment = await Enrollment.findOne({
      where: { userId: req.user.id, courseId: req.params.id }
    });
    isEnrolled = !!enrollment;
  }

  successResponse(res, {
    ...course.toJSON(),
    enrollmentCount,
    isEnrolled
  }, 'Course retrieved successfully');
});

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Lecturer
const createCourse = asyncHandler(async (req, res) => {
  const courseData = {
    ...req.body,
    lecturerId: req.user.id,
    collegeId: req.user.collegeId || req.body.collegeId
  };

  const course = await Course.create(courseData);

  // Get course with relations
  const newCourse = await Course.findByPk(course.id, {
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
  });

  successResponse(res, newCourse, 'Course created successfully', 201);
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Lecturer/Admin
const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);

  if (!course) {
    return errorResponse(res, 'Course not found', 404);
  }

  // Check authorization
  if (req.user.role !== 'admin' && req.user.id !== course.lecturerId) {
    return errorResponse(res, 'Not authorized to update this course', 403);
  }

  await course.update(req.body);

  // Get updated course with relations
  const updatedCourse = await Course.findByPk(req.params.id, {
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
  });

  successResponse(res, updatedCourse, 'Course updated successfully');
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);

  if (!course) {
    return errorResponse(res, 'Course not found', 404);
  }

  await course.destroy();

  successResponse(res, null, 'Course deleted successfully');
});

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private/Student
const enrollInCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);

  if (!course) {
    return errorResponse(res, 'Course not found', 404);
  }

  if (course.status !== 'published') {
    return errorResponse(res, 'Course is not available for enrollment', 400);
  }

  // Check if already enrolled
  const existingEnrollment = await Enrollment.findOne({
    where: { userId: req.user.id, courseId: req.params.id }
  });

  if (existingEnrollment) {
    return errorResponse(res, 'Already enrolled in this course', 400);
  }

  // Check enrollment limit
  if (course.enrollmentLimit) {
    const currentEnrollments = await Enrollment.count({
      where: { courseId: req.params.id }
    });

    if (currentEnrollments >= course.enrollmentLimit) {
      return errorResponse(res, 'Course enrollment limit reached', 400);
    }
  }

  // Create enrollment
  const enrollment = await Enrollment.create({
    userId: req.user.id,
    courseId: req.params.id
  });

  successResponse(res, enrollment, 'Successfully enrolled in course', 201);
});

// @desc    Get course modules/content
// @route   GET /api/courses/:id/modules
// @access  Private/Enrolled
const getCourseModules = asyncHandler(async (req, res) => {
  // Check if user is enrolled or is lecturer/admin
  if (req.user.role !== 'admin') {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return errorResponse(res, 'Course not found', 404);
    }

    if (req.user.id !== course.lecturerId) {
      const enrollment = await Enrollment.findOne({
        where: { userId: req.user.id, courseId: req.params.id }
      });

      if (!enrollment) {
        return errorResponse(res, 'Not enrolled in this course', 403);
      }
    }
  }

  // This is a placeholder - in a real app, you'd have a Module model
  successResponse(res, [], 'Course modules retrieved successfully');
});

// @desc    Get course assignments
// @route   GET /api/courses/:id/assignments
// @access  Private/Enrolled
const getCourseAssignments = asyncHandler(async (req, res) => {
  // Check if user is enrolled or is lecturer/admin
  if (req.user.role !== 'admin') {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return errorResponse(res, 'Course not found', 404);
    }

    if (req.user.id !== course.lecturerId) {
      const enrollment = await Enrollment.findOne({
        where: { userId: req.user.id, courseId: req.params.id }
      });

      if (!enrollment) {
        return errorResponse(res, 'Not enrolled in this course', 403);
      }
    }
  }

  const assignments = await Assignment.findAll({
    where: { courseId: req.params.id },
    include: [
      {
        model: User,
        as: 'creator',
        attributes: ['id', 'firstName', 'lastName']
      }
    ],
    order: [['dueDate', 'ASC']]
  });

  successResponse(res, assignments, 'Course assignments retrieved successfully');
});

// @desc    Get course students (for lecturer/admin)
// @route   GET /api/courses/:id/students
// @access  Private/Lecturer/Admin
const getCourseStudents = asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);

  if (!course) {
    return errorResponse(res, 'Course not found', 404);
  }

  // Check authorization
  if (req.user.role !== 'admin' && req.user.id !== course.lecturerId) {
    return errorResponse(res, 'Not authorized to view course students', 403);
  }

  const { page = 1, limit = 20 } = req.query;
  const { offset, limit: limitNum } = paginate(page, limit);

  const { count, rows: enrollments } = await Enrollment.findAndCountAll({
    where: { courseId: req.params.id },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email', 'studentId']
      }
    ],
    order: [['enrollmentDate', 'ASC']],
    offset,
    limit: limitNum,
  });

  const pagination = getPaginationMeta(count, page, limitNum);

  successResponse(res, {
    enrollments,
    pagination
  }, 'Course students retrieved successfully');
});

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getCourseModules,
  getCourseAssignments,
  getCourseStudents,
};