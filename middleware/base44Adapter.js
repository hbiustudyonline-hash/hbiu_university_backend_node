/**
 * Base44 SDK Adapter Middleware
 * Transforms standard Express routes to Base44 SDK-compatible format
 * 
 * Base44 SDK expects:
 * - Entity operations via /api/entities/:entityName
 * - Standardized methods: list, get, filter, create, update, delete
 * - Auth operations via /api/auth
 */

const express = require('express');
const router = express.Router();

// Import existing models
const { 
  User, 
  Course, 
  Enrollment, 
  Assignment, 
  College 
} = require('../models');

const { verifyToken } = require('./auth');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Generic entity handler factory
 * Creates CRUD operations for any Sequelize model
 */
const createEntityHandler = (Model, modelName) => {
  const handler = {
    /**
     * LIST - Get all records with optional sorting and limit
     * GET /api/entities/:entity?sort=field&limit=10
     */
    async list(req, res) {
      try {
        const { sort = '-created_at', limit = 100 } = req.query;
        
        // Parse sort direction
        const order = sort.startsWith('-') 
          ? [[sort.substring(1), 'DESC']]
          : [[sort, 'ASC']];

        const records = await Model.findAll({
          order,
          limit: parseInt(limit),
        });

        return res.json(successResponse(records, `${modelName} list retrieved`));
      } catch (error) {
        console.error(`Error listing ${modelName}:`, error);
        return res.status(500).json(errorResponse(`Failed to list ${modelName}`));
      }
    },

    /**
     * GET - Get single record by ID
     * GET /api/entities/:entity/:id
     */
    async get(req, res) {
      try {
        const { id } = req.params;
        const record = await Model.findByPk(id);

        if (!record) {
          return res.status(404).json(errorResponse(`${modelName} not found`));
        }

        return res.json(successResponse(record, `${modelName} retrieved`));
      } catch (error) {
        console.error(`Error getting ${modelName}:`, error);
        return res.status(500).json(errorResponse(`Failed to get ${modelName}`));
      }
    },

    /**
     * FILTER - Get records matching criteria
     * POST /api/entities/:entity/filter
     * Body: { field: value, ... }
     */
    async filter(req, res) {
      try {
        const filters = req.body;
        const { sort = '-created_at', limit = 100 } = req.query;

        // Parse sort direction
        const order = sort.startsWith('-')
          ? [[sort.substring(1), 'DESC']]
          : [[sort, 'ASC']];

        const records = await Model.findAll({
          where: filters,
          order,
          limit: parseInt(limit),
        });

        return res.json(successResponse(records, `${modelName} filtered`));
      } catch (error) {
        console.error(`Error filtering ${modelName}:`, error);
        return res.status(500).json(errorResponse(`Failed to filter ${modelName}`));
      }
    },

    /**
     * CREATE - Create new record
     * POST /api/entities/:entity
     */
    async create(req, res) {
      try {
        const data = req.body;
        const record = await Model.create(data);

        return res.status(201).json(successResponse(record, `${modelName} created`));
      } catch (error) {
        console.error(`Error creating ${modelName}:`, error);
        return res.status(400).json(errorResponse(`Failed to create ${modelName}`, error.message));
      }
    },

    /**
     * UPDATE - Update existing record
     * PUT /api/entities/:entity/:id
     */
    async update(req, res) {
      try {
        const { id } = req.params;
        const data = req.body;

        const record = await Model.findByPk(id);
        if (!record) {
          return res.status(404).json(errorResponse(`${modelName} not found`));
        }

        await record.update(data);

        return res.json(successResponse(record, `${modelName} updated`));
      } catch (error) {
        console.error(`Error updating ${modelName}:`, error);
        return res.status(400).json(errorResponse(`Failed to update ${modelName}`, error.message));
      }
    },

    /**
     * DELETE - Delete record
     * DELETE /api/entities/:entity/:id
     */
    async delete(req, res) {
      try {
        const { id } = req.params;

        const record = await Model.findByPk(id);
        if (!record) {
          return res.status(404).json(errorResponse(`${modelName} not found`));
        }

        await record.destroy();

        return res.json(successResponse(null, `${modelName} deleted`));
      } catch (error) {
        console.error(`Error deleting ${modelName}:`, error);
        return res.status(500).json(errorResponse(`Failed to delete ${modelName}`));
      }
    },
  };

  return handler;
};

// Entity registry - maps entity names to Sequelize models
const entityRegistry = {
  User: { model: User, name: 'User' },
  Course: { model: Course, name: 'Course' },
  Enrollment: { model: Enrollment, name: 'Enrollment' },
  Assignment: { model: Assignment, name: 'Assignment' },
  College: { model: College, name: 'College' },
  // Add more entities as needed
};

/**
 * Dynamic entity router
 * Routes all /api/entities/:entityName requests to appropriate handlers
 */
router.use('/:entity', async (req, res, next) => {
  const { entity } = req.params;
  const entityConfig = entityRegistry[entity];

  if (!entityConfig) {
    return res.status(404).json(errorResponse(`Entity '${entity}' not found`));
  }

  const handler = createEntityHandler(entityConfig.model, entityConfig.name);

  // Route to appropriate method based on HTTP verb and path
  if (req.method === 'GET' && req.params[0]) {
    // GET /api/entities/:entity/:id
    req.params.id = req.params[0];
    return handler.get(req, res);
  } else if (req.method === 'GET') {
    // GET /api/entities/:entity
    return handler.list(req, res);
  } else if (req.method === 'POST' && req.path.includes('/filter')) {
    // POST /api/entities/:entity/filter
    return handler.filter(req, res);
  } else if (req.method === 'POST') {
    // POST /api/entities/:entity
    return handler.create(req, res);
  } else if (req.method === 'PUT' && req.params[0]) {
    // PUT /api/entities/:entity/:id
    req.params.id = req.params[0];
    return handler.update(req, res);
  } else if (req.method === 'DELETE' && req.params[0]) {
    // DELETE /api/entities/:entity/:id
    req.params.id = req.params[0];
    return handler.delete(req, res);
  }

  return res.status(405).json(errorResponse('Method not allowed'));
});

module.exports = router;
