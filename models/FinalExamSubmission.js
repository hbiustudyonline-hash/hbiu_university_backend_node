const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FinalExamSubmission = sequelize.define('FinalExamSubmission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  examId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'exam_id'
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'student_id'
  },
  answers: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
    comment: 'Object mapping question IDs to answers'
  },
  score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('in_progress', 'submitted', 'graded'),
    defaultValue: 'in_progress'
  },
  startedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'started_at'
  },
  submittedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'submitted_at'
  },
  gradedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'graded_at'
  },
  gradedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'graded_by'
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
  tableName: 'final_exam_submissions',
  timestamps: true,
  underscored: true
});

module.exports = FinalExamSubmission;
