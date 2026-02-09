const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Degree = sequelize.define('Degree', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  collegeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'college_id'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('certificate', 'associate', 'bachelor', 'master', 'doctorate'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  requiredCredits: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 120,
    field: 'required_credits'
  },
  requiredCourses: {
    type: DataTypes.JSON,
    defaultValue: [],
    field: 'required_courses',
    comment: 'Array of course IDs required for this degree'
  },
  electiveCourses: {
    type: DataTypes.JSON,
    defaultValue: [],
    field: 'elective_courses',
    comment: 'Array of elective course IDs'
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Duration in years'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  requirements: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Additional requirements as JSON'
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
  tableName: 'degrees',
  timestamps: true,
  underscored: true
});

module.exports = Degree;
