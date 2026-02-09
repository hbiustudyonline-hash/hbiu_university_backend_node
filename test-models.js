// Simple validation script to check for model errors
try {
  console.log('Testing model imports...');
  
  // Test database config
  const { sequelize } = require('./config/database');
  console.log('✅ Database config loaded');
  
  // Test individual models
  const User = require('./models/User');
  console.log('✅ User model loaded');
  
  const College = require('./models/College');
  console.log('✅ College model loaded');
  
  const Course = require('./models/Course');
  console.log('✅ Course model loaded');
  
  const Enrollment = require('./models/Enrollment');
  console.log('✅ Enrollment model loaded');
  
  const Assignment = require('./models/Assignment');
  console.log('✅ Assignment model loaded');
  
  // Test model index (associations)
  require('./models');
  console.log('✅ Model associations loaded');
  
  console.log('🎉 All models loaded successfully!');
  
} catch (error) {
  console.error('❌ Error loading models:', error.message);
  console.error('Stack trace:', error.stack);
}