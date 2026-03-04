const { sequelize } = require('./config/database');

async function fixCollegeSequence() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected\n');
    
    // Get max college ID
    const result = await sequelize.query(
      "SELECT MAX(id) as max_id FROM colleges",
      { type: sequelize.QueryTypes.SELECT }
    );
    
    const maxId = result[0].max_id || 0;
    console.log(`Current max college ID: ${maxId}`);
    
    // Reset sequence
    const newSeq = maxId + 1;
    await sequelize.query(
      `SELECT setval('colleges_id_seq', ${newSeq}, false)`
    );
    
    console.log(`✅ Sequence reset to ${newSeq}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixCollegeSequence();
