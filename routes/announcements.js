const express = require('express');
const router = express.Router();
const { Announcement, Course, User } = require('../models');
const { protect } = require('../middleware/auth');
const { successResponse, errorResponse, asyncHandler } = require('../utils/response');

// @route   GET /api/announcements
// @desc    Get all announcements
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const announcements = await Announcement.findAll({
    include: [
      { model: Course, as: 'course', attributes: ['id', 'name'] },
      { model: User, as: 'author', attributes: ['id', 'firstName', 'lastName'] }
    ],
    order: [['createdAt', 'DESC']]
  });
  
  successResponse(res, announcements, 'Announcements retrieved successfully');
}));

// @route   GET /api/announcements/:id
// @desc    Get announcement by ID
// @access  Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const announcement = await Announcement.findByPk(req.params.id, {
    include: [
      { model: Course, as: 'course' },
      { model: User, as: 'author' }
    ]
  });
  
  if (!announcement) {
    return errorResponse(res, 'Announcement not found', 404);
  }
  
  successResponse(res, announcement, 'Announcement retrieved successfully');
}));

// @route   POST /api/announcements
// @desc    Create new announcement
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { title, content, courseId } = req.body;
  
  const announcement = await Announcement.create({
    title,
    content,
    courseId,
    authorId: req.user.id
  });
  
  const announcementWithDetails = await Announcement.findByPk(announcement.id, {
    include: [
      { model: Course, as: 'course' },
      { model: User, as: 'author' }
    ]
  });
  
  successResponse(res, announcementWithDetails, 'Announcement created successfully', 201);
}));

// @route   PUT /api/announcements/:id
// @desc    Update announcement
// @access  Private
router.put('/:id', protect, asyncHandler(async (req, res) => {
  let announcement = await Announcement.findByPk(req.params.id);
  
  if (!announcement) {
    return errorResponse(res, 'Announcement not found', 404);
  }
  
  await announcement.update(req.body);
  
  const updatedAnnouncement = await Announcement.findByPk(announcement.id, {
    include: [
      { model: Course, as: 'course' },
      { model: User, as: 'author' }
    ]
  });
  
  successResponse(res, updatedAnnouncement, 'Announcement updated successfully');
}));

// @route   DELETE /api/announcements/:id
// @desc    Delete announcement
// @access  Private
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const announcement = await Announcement.findByPk(req.params.id);
  
  if (!announcement) {
    return errorResponse(res, 'Announcement not found', 404);
  }
  
  await announcement.destroy();
  
  successResponse(res, null, 'Announcement deleted successfully');
}));

module.exports = router;
