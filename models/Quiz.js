const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Quiz = sequelize.define('Quiz', {
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
  moduleId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'module_id'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  questions: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  timeLimit: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: true,
    field: 'time_limit'
  },
  passingScore: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 70.00,
    field: 'passing_score'
  },
  totalPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
    field: 'total_points'
  },
  attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 1 // number of allowed attempts
  },
  shuffleQuestions: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'shuffle_questions'
  },
  showAnswers: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'show_answers'
  },
  availableFrom: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'available_from'
  },
  availableUntil: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'available_until'
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft'
  }
}, {
  tableName: 'quizzes',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Quiz;
