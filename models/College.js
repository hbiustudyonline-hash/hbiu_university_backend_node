const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const College = sequelize.define('College', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
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
      len: [2, 10]
    }
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  establishedYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1800,
      max: new Date().getFullYear()
    }
  },
  status: {
    type: DataTypes.ENUM,
    values: ['active', 'inactive'],
    defaultValue: 'active'
  }
}, {
  tableName: 'colleges'
});

module.exports = College;