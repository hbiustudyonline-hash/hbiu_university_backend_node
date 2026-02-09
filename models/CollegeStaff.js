const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CollegeStaff = sequelize.define('CollegeStaff', {
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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    field: 'user_id'
  },
  position: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Staff position/title'
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  officeLocation: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'office_location'
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  officeHours: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'office_hours',
    comment: 'JSON object for office hours schedule'
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  permissions: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of permission strings'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  hireDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'hire_date'
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
  tableName: 'college_staff',
  timestamps: true,
  underscored: true
});

module.exports = CollegeStaff;
