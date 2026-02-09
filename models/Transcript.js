const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transcript = sequelize.define('Transcript', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: false,
    field: 'student_id'
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'course_id'
  },
  grade: {
    type: DataTypes.STRING(5),
    allowNull: true,
    comment: 'Letter grade (A, B, C, etc.)'
  },
  gradePoints: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
    comment: 'GPA points (4.0 scale)',
    field: 'grade_points'
  },
  credits: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 3
  },
  semester: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('in_progress', 'completed', 'withdrawn', 'failed'),
    defaultValue: 'in_progress'
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'completed_at'
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
  tableName: 'transcripts',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['student_id', 'course_id']
    }
  ]
});

module.exports = Transcript;
