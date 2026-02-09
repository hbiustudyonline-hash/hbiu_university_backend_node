const { Sequelize } = require('sequelize');
const path = require('path');

// Database configuration
const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgresql://postgres:uYQBmbMxABSBFFEXuKmagaqmxFhbGKzF@tramway.proxy.rlwy.net:16123/railway',
  {
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

// Test database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL database connected successfully');
    
    // Sync all models
    if (process.env.NODE_ENV === 'development') {
      // Check if we should force recreate tables
      if (process.env.DB_FORCE_SYNC === 'true') {
        await sequelize.sync({ force: true, alter: false });
        console.log('📊 Database models synchronized (forced recreation)');
      } else {
        try {
          // Try to sync with alter mode (safer, modifies existing schema)
          await sequelize.sync({ alter: true, force: false });
          console.log('📊 Database models synchronized (alter mode)');
        } catch (syncError) {
          console.log('⚠️ Alter sync failed, trying force sync...');
          await sequelize.sync({ force: true, alter: false });
          console.log('📊 Database models synchronized (force recreation after error)');
        }
      }
    } else {
      // Production: sync without altering or forcing
      await sequelize.sync({ alter: false, force: false });
    }
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Close database connection
const closeDB = async () => {
  try {
    await sequelize.close();
    console.log('🔌 Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
};

module.exports = {
  sequelize,
  connectDB,
  closeDB
};