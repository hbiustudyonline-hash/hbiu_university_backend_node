const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 20]
    }
  },
  credits: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 3,
    validate: {
      min: 1,
      max: 10
    }
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Duration in weeks'
  },
  level: {
    type: DataTypes.ENUM,
    values: ['beginner', 'intermediate', 'advanced'],
    defaultValue: 'beginner'
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  prerequisites: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  learningOutcomes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  syllabus: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM,
    values: ['draft', 'published', 'archived'],
    defaultValue: 'draft'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  enrollmentLimit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.00
  },
  language: {
    type: DataTypes.STRING,
    defaultValue: 'English'
  },
  collegeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'colleges',
      key: 'id'
    }
  },
  lecturerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'courses'
});

module.exports = Course;