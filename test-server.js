// Direct Node.js server test - run with: node test-server.js

console.log('🔍 Testing Node.js and server setup...');
console.log('Node.js version:', process.version);
console.log('Platform:', process.platform);

// Test if we can load required modules
try {
    const express = require('express');
    console.log('✅ Express loaded successfully');
    
    const { sequelize } = require('./config/database');
    console.log('✅ Database config loaded successfully');
    
    // Test basic server creation
    const app = express();
    const port = process.env.PORT || 3001;
    
    app.get('/test', (req, res) => {
        res.json({ 
            status: 'OK', 
            message: 'HBIU LMS Backend Test Successful',
            nodeVersion: process.version,
            timestamp: new Date().toISOString()
        });
    });
    
    const server = app.listen(port, () => {
        console.log(`✅ Test server running on port ${port}`);
        console.log(`🌐 Visit: http://localhost:${port}/test`);
        console.log('🎉 Your backend setup is working correctly!');
        console.log('💡 Now you can run: npm run dev');
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            console.log('🔄 Closing test server...');
            server.close();
            process.exit(0);
        }, 5000);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`❌ Port ${port} is already in use`);
            console.log('💡 Try changing PORT in .env file to 3002, 3003, etc.');
        } else {
            console.log('❌ Server error:', err.message);
        }
        process.exit(1);
    });
    
} catch (error) {
    console.log('❌ Error loading modules:', error.message);
    console.log('💡 Run: npm install');
    process.exit(1);
}