const fs = require('fs');
const path = require('path');

console.log('🔍 HBIU LMS Backend Diagnostic Tool\n');

// Check Node.js version
console.log('Node.js Version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);

// Check required files
const requiredFiles = [
  'package.json',
  'server.js',
  '.env',
  'config/database.js',
  'models/index.js',
  'routes/auth.js',
  'controllers/authController.js'
];

console.log('\n📁 Checking required files:');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

// Check required directories
const requiredDirs = ['database', 'logs', 'uploads', 'node_modules'];
console.log('\n📂 Checking directories:');
requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`✅ ${dir}/`);
  } else {
    console.log(`❌ ${dir}/ - MISSING`);
  }
});

// Check environment variables
console.log('\n⚙️ Environment variables:');
const envVars = ['NODE_ENV', 'PORT', 'JWT_SECRET', 'DB_PATH'];
envVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value}`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
  }
});

// Try to load main modules
console.log('\n📦 Testing module loading:');
try {
  require('express');
  console.log('✅ express');
} catch (e) {
  console.log('❌ express:', e.message);
}

try {
  require('sequelize');
  console.log('✅ sequelize');
} catch (e) {
  console.log('❌ sequelize:', e.message);
}

try {
  require('sqlite3');
  console.log('✅ sqlite3');
} catch (e) {
  console.log('❌ sqlite3:', e.message);
}

try {
  require('./config/database');
  console.log('✅ database config');
} catch (e) {
  console.log('❌ database config:', e.message);
}

console.log('\n🏁 Diagnostic complete!');
console.log('\nIf you see any ❌ items above, those need to be fixed before the server can run.');
console.log('Most common issues:');
console.log('1. Run "npm install" if node_modules is missing');
console.log('2. Copy .env.example to .env if .env is missing');
console.log('3. Make sure all required files are present');