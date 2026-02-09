/**
 * Base44 SDK Entity Routes
 * Provides RESTful API endpoints compatible with Base44 SDK
 */

const express = require('express');
const router = express.Router();

// Import existing models
const { 
  User, 
  Course, 
  Enrollment, 
  Assignment, 
  College,
  Module,
  Announcement,
  Quiz,
  Submission,
  SystemSetting
} = require('../models');

const { successResponse, errorResponse } = require('../utils/response');

// Entity registry - maps entity names to Sequelize models
const entityRegistry = {
  User,
  Course,
  Enrollment,
  Assignment,
  College,
  Module,
  Announcement,
  Quiz,
  Submission,
  SystemSetting,
};

/**
 * GET /api/entities/:entity - List all records
 */
router.get('/:entity', async (req, res) => {
  try {
    const { entity } = req.params;
    const Model = entityRegistry[entity];

    if (!Model) {
      return res.status(404).json(errorResponse(`Entity '${entity}' not found`));
    }

    const { sort = '-createdAt', limit = 100 } = req.query;

    // Parse sort direction (Base44 uses '-field' for DESC)
    const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
    const sortDir = sort.startsWith('-') ? 'DESC' : 'ASC';

    const records = await Model.findAll({
      order: [[sortField, sortDir]],
      limit: parseInt(limit),
    });

    return res.json(successResponse(records));
  } catch (error) {
    console.error(`Error listing entities:`, error);
    return res.status(500).json(errorResponse('Failed to list entities', error.message));
  }
});

/**
 * GET /api/entities/:entity/:id - Get single record
 */
router.get('/:entity/:id', async (req, res) => {
  try {
    const { entity, id } = req.params;
    const Model = entityRegistry[entity];

    if (!Model) {
      return res.status(404).json(errorResponse(`Entity '${entity}' not found`));
    }

    const record = await Model.findByPk(id);

    if (!record) {
      return res.status(404).json(errorResponse(`${entity} with id ${id} not found`));
    }

    return res.json(successResponse(record));
  } catch (error) {
    console.error(`Error getting entity:`, error);
    return res.status(500).json(errorResponse('Failed to get entity', error.message));
  }
});

/**
 * POST /api/entities/:entity/filter - Filter records
 */
router.post('/:entity/filter', async (req, res) => {
  try {
    const { entity } = req.params;
    const Model = entityRegistry[entity];

    if (!Model) {
      return res.status(404).json(errorResponse(`Entity '${entity}' not found`));
    }

    const filters = req.body;
    const { sort = '-createdAt', limit = 100 } = req.query;

    // Parse sort direction
    const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
    const sortDir = sort.startsWith('-') ? 'DESC' : 'ASC';

    const records = await Model.findAll({
      where: filters,
      order: [[sortField, sortDir]],
      limit: parseInt(limit),
    });

    return res.json(successResponse(records));
  } catch (error) {
    console.error(`Error filtering entities:`, error);
    return res.status(500).json(errorResponse('Failed to filter entities', error.message));
  }
});

/**
 * POST /api/entities/:entity - Create new record
 */
router.post('/:entity', async (req, res) => {
  try {
    const { entity } = req.params;
    const Model = entityRegistry[entity];

    if (!Model) {
      return res.status(404).json(errorResponse(`Entity '${entity}' not found`));
    }

    const data = req.body;
    const record = await Model.create(data);

    return res.status(201).json(successResponse(record, `${entity} created successfully`));
  } catch (error) {
    console.error(`Error creating entity:`, error);
    return res.status(400).json(errorResponse('Failed to create entity', error.message));
  }
});

/**
 * PUT /api/entities/:entity/:id - Update record
 */
router.put('/:entity/:id', async (req, res) => {
  try {
    const { entity, id } = req.params;
    const Model = entityRegistry[entity];

    if (!Model) {
      return res.status(404).json(errorResponse(`Entity '${entity}' not found`));
    }

    const data = req.body;
    const record = await Model.findByPk(id);

    if (!record) {
      return res.status(404).json(errorResponse(`${entity} with id ${id} not found`));
    }

    await record.update(data);

    return res.json(successResponse(record, `${entity} updated successfully`));
  } catch (error) {
    console.error(`Error updating entity:`, error);
    return res.status(400).json(errorResponse('Failed to update entity', error.message));
  }
});

/**
 * DELETE /api/entities/:entity/:id - Delete record
 */
router.delete('/:entity/:id', async (req, res) => {
  try {
    const { entity, id } = req.params;
    const Model = entityRegistry[entity];

    if (!Model) {
      return res.status(404).json(errorResponse(`Entity '${entity}' not found`));
    }

    const record = await Model.findByPk(id);

    if (!record) {
      return res.status(404).json(errorResponse(`${entity} with id ${id} not found`));
    }

    await record.destroy();

    return res.json(successResponse(null, `${entity} deleted successfully`));
  } catch (error) {
    console.error(`Error deleting entity:`, error);
    return res.status(500).json(errorResponse('Failed to delete entity', error.message));
  }
});

module.exports = router;
