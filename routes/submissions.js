const express = require('express');
const router = express.Router();
const { Submission, Assignment, User } = require('../models');
const { protect } = require('../middleware/auth');
const { successResponse, errorResponse, asyncHandler } = require('../utils/response');

// @route   GET /api/submissions
// @desc    Get all submissions
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const submissions = await Submission.findAll({
    include: [
      { model: Assignment, as: 'assignment', attributes: ['id', 'title'] },
      { model: User, as: 'student', attributes: ['id', 'firstName', 'lastName', 'email'] }
    ],
    order: [['submittedAt', 'DESC']]
  });
  
  successResponse(res, submissions, 'Submissions retrieved successfully');
}));

// @route   GET /api/submissions/:id
// @desc    Get submission by ID
// @access  Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const submission = await Submission.findByPk(req.params.id, {
    include: [
      { model: Assignment, as: 'assignment' },
      { model: User, as: 'student' }
    ]
  });
  
  if (!submission) {
    return errorResponse(res, 'Submission not found', 404);
  }
  
  successResponse(res, submission, 'Submission retrieved successfully');
}));

// @route   POST /api/submissions
// @desc    Create new submission
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { assignmentId, content, fileUrl } = req.body;
  
  const submission = await Submission.create({
    assignmentId,
    studentId: req.user.id,
    content,
    fileUrl,
    status: 'submitted',
    submittedAt: new Date()
  });
  
  const submissionWithDetails = await Submission.findByPk(submission.id, {
    include: [
      { model: Assignment, as: 'assignment' },
      { model: User, as: 'student' }
    ]
  });
  
  successResponse(res, submissionWithDetails, 'Submission created successfully', 201);
}));

// @route   PUT /api/submissions/:id
// @desc    Update submission (grade/score)
// @access  Private
router.put('/:id', protect, asyncHandler(async (req, res) => {
  let submission = await Submission.findByPk(req.params.id);
  
  if (!submission) {
    return errorResponse(res, 'Submission not found', 404);
  }
  
  await submission.update(req.body);
  
  const updatedSubmission = await Submission.findByPk(submission.id, {
    include: [
      { model: Assignment, as: 'assignment' },
      { model: User, as: 'student' }
    ]
  });
  
  successResponse(res, updatedSubmission, 'Submission updated successfully');
}));

// @route   DELETE /api/submissions/:id
// @desc    Delete submission
// @access  Private
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const submission = await Submission.findByPk(req.params.id);
  
  if (!submission) {
    return errorResponse(res, 'Submission not found', 404);
  }
  
  await submission.destroy();
  
  successResponse(res, null, 'Submission deleted successfully');
}));

module.exports = router;
