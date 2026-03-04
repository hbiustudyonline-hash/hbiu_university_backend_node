const { sequelize } = require('./models');

async function fixCourseSequence() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Check current max ID
    const [results] = await sequelize.query('SELECT MAX(id) as max_id FROM courses');
    const maxId = results[0].max_id || 0;
    console.log(`📊 Current max course ID: ${maxId}`);

    // Fix the sequence
    await sequelize.query(`
      SELECT setval(
        pg_get_serial_sequence('courses', 'id'),
        COALESCE((SELECT MAX(id) FROM courses), 1),
        true
      );
    `);
    
    console.log('✅ Course sequence fixed!');
    console.log(`🎯 Next course will get ID: ${maxId + 1}`);

    // Verify the fix
    const [seqResult] = await sequelize.query(`
      SELECT last_value FROM courses_id_seq;
    `);
    console.log(`✅ Sequence current value: ${seqResult[0].last_value}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

fixCourseSequence();
