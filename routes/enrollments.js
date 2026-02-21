const express = require('express');
const router = express.Router();
const { Enrollment, Course, User } = require('../models');
const { protect } = require('../middleware/auth');
const { successResponse, errorResponse, asyncHandler } = require('../utils/response');

// @route   GET /api/enrollments
// @desc    Get all enrollments
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.findAll({
    include: [
      { model: Course, as: 'course', attributes: ['id', 'name', 'code'] },
      { model: User, as: 'student', attributes: ['id', 'firstName', 'lastName', 'email'] }
    ],
    order: [['enrolledAt', 'DESC']]
  });
  
  successResponse(res, enrollments, 'Enrollments retrieved successfully');
}));

// @route   GET /api/enrollments/:id
// @desc    Get enrollment by ID
// @access  Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findByPk(req.params.id, {
    include: [
      { model: Course, as: 'course' },
      { model: User, as: 'student' }
    ]
  });
  
  if (!enrollment) {
    return errorResponse(res, 'Enrollment not found', 404);
  }
  
  successResponse(res, enrollment, 'Enrollment retrieved successfully');
}));

// @route   POST /api/enrollments
// @desc    Create new enrollment
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { courseId, studentId } = req.body;
  
  const enrollment = await Enrollment.create({
    courseId,
    studentId,
    status: 'active',
    enrolledAt: new Date()
  });
  
  const enrollmentWithDetails = await Enrollment.findByPk(enrollment.id, {
    include: [
      { model: Course, as: 'course' },
      { model: User, as: 'student' }
    ]
  });
  
  successResponse(res, enrollmentWithDetails, 'Enrollment created successfully', 201);
}));

// @route   POST /api/enrollments/filter
// @desc    Filter enrollments
// @access  Private
router.post('/filter', protect, asyncHandler(async (req, res) => {
  const { filters } = req.body;
  
  const enrollments = await Enrollment.findAll({
    where: filters || {},
    include: [
      { model: Course, as: 'course', attributes: ['id', 'name', 'code'] },
      { model: User, as: 'student', attributes: ['id', 'firstName', 'lastName', 'email'] }
    ]
  });
  
  successResponse(res, enrollments, 'Enrollments filtered successfully');
}));

// @route   PUT /api/enrollments/:id
// @desc    Update enrollment
// @access  Private
router.put('/:id', protect, asyncHandler(async (req, res) => {
  let enrollment = await Enrollment.findByPk(req.params.id);
  
  if (!enrollment) {
    return errorResponse(res, 'Enrollment not found', 404);
  }
  
  await enrollment.update(req.body);
  
  const updatedEnrollment = await Enrollment.findByPk(enrollment.id, {
    include: [
      { model: Course, as: 'course' },
      { model: User, as: 'student' }
    ]
  });
  
  successResponse(res, updatedEnrollment, 'Enrollment updated successfully');
}));

// @route   DELETE /api/enrollments/:id
// @desc    Delete enrollment
// @access  Private
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findByPk(req.params.id);
  
  if (!enrollment) {
    return errorResponse(res, 'Enrollment not found', 404);
  }
  
  await enrollment.destroy();
  
  successResponse(res, null, 'Enrollment deleted successfully');
}));

module.exports = router;
