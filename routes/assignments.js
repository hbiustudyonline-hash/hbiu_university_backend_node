const express = require('express');
const router = express.Router();
const { Assignment, Course, User } = require('../models');
const { protect } = require('../middleware/auth');
const { successResponse, errorResponse, asyncHandler } = require('../utils/response');

// @route   GET /api/assignments
// @desc    Get all assignments
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const assignments = await Assignment.findAll({
    include: [
      { model: Course, as: 'course', attributes: ['id', 'name'] },
      { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName'] }
    ],
    order: [['createdAt', 'DESC']]
  });
  
  successResponse(res, assignments, 'Assignments retrieved successfully');
}));

// @route   GET /api/assignments/:id
// @desc    Get assignment by ID
// @access  Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const assignment = await Assignment.findByPk(req.params.id, {
    include: [
      { model: Course, as: 'course' },
      { model: User, as: 'creator' }
    ]
  });
  
  if (!assignment) {
    return errorResponse(res, 'Assignment not found', 404);
  }
  
  successResponse(res, assignment, 'Assignment retrieved successfully');
}));

// @route   POST /api/assignments
// @desc    Create new assignment
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { title, description, courseId, dueDate, maxScore } = req.body;
  
  const assignment = await Assignment.create({
    title,
    description,
    courseId,
    dueDate,
    maxScore: maxScore || 100,
    createdBy: req.user.id
  });
  
  const assignmentWithDetails = await Assignment.findByPk(assignment.id, {
    include: [
      { model: Course, as: 'course' },
      { model: User, as: 'creator' }
    ]
  });
  
  successResponse(res, assignmentWithDetails, 'Assignment created successfully', 201);
}));

// @route   PUT /api/assignments/:id
// @desc    Update assignment
// @access  Private
router.put('/:id', protect, asyncHandler(async (req, res) => {
  let assignment = await Assignment.findByPk(req.params.id);
  
  if (!assignment) {
    return errorResponse(res, 'Assignment not found', 404);
  }
  
  await assignment.update(req.body);
  
  const updatedAssignment = await Assignment.findByPk(assignment.id, {
    include: [
      { model: Course, as: 'course' },
      { model: User, as: 'creator' }
    ]
  });
  
  successResponse(res, updatedAssignment, 'Assignment updated successfully');
}));

// @route   DELETE /api/assignments/:id
// @desc    Delete assignment
// @access  Private
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const assignment = await Assignment.findByPk(req.params.id);
  
  if (!assignment) {
    return errorResponse(res, 'Assignment not found', 404);
  }
  
  await assignment.destroy();
  
  successResponse(res, null, 'Assignment deleted successfully');
}));

module.exports = router;
