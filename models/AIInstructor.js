const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AIInstructor = sequelize.define('AIInstructor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'course_id'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  avatar_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'avatar_url'
  },
  personality: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'AI personality description'
  },
  expertise: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of expertise areas'
  },
  systemPrompt: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'system_prompt',
    comment: 'System prompt for AI model'
  },
  model: {
    type: DataTypes.STRING(100),
    defaultValue: 'gpt-4',
    comment: 'AI model to use (e.g., gpt-4, gpt-3.5-turbo)'
  },
  temperature: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.7,
    comment: 'AI temperature setting (0-1)'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  settings: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Additional AI settings'
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'created_by'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  tableName: 'ai_instructors',
  timestamps: true,
  underscored: true
});

module.exports = AIInstructor;
