const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'hbiu_lms.sqlite');

try {
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('✅ Database file deleted successfully');
  } else {
    console.log('ℹ️ Database file does not exist');
  }
} catch (error) {
  console.error('❌ Error deleting database file:', error);
}

console.log('🔄 Ready to start server with fresh database');