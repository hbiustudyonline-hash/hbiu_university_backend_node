const { connectDB, closeDB } = require('../config/database');
const seedDatabase = require('./index');

const runSeeders = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Run seeders
    const results = await seedDatabase();
    
    console.log('\n🎉 Seeding completed successfully!');
    console.log('📈 Summary:', results);
    console.log('\n📋 Default Login Credentials:');
    console.log('Admin: admin@hbiu.edu / password123');
    console.log('Lecturer: john.smith@hbiu.edu / password123');
    console.log('Student: alice.wilson@student.hbiu.edu / password123');
    
    await closeDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    await closeDB();
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  runSeeders();
}

module.exports = runSeeders;