const { sequelize } = require('./config/database');
const { College } = require('./models');

async function checkColleges() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database\n');
    
    // Get all colleges without limit
    const colleges = await College.findAll({
      order: [['id', 'ASC']],
      limit: null
    });
    
    console.log(`📊 Found ${colleges.length} colleges:\n`);
    colleges.forEach(c => {
      console.log(`  ID: ${c.id} | Code: ${c.code} | Name: ${c.name}`);
    });
    
    // Specifically search for College of International Studies
    console.log('\n🔍 Searching specifically for "College of International Studies"...');
    const intlCollege = await College.findOne({
      where: { name: 'College of International Studies' }
    });
    
    if (intlCollege) {
      console.log(`✅ Found: ID ${intlCollege.id} - ${intlCollege.name}`);
    } else {
      console.log('❌ NOT FOUND');
    }
    
    // Also try searching with LIKE
    const { Op } = require('sequelize');
    const intlColleges = await College.findAll({
      where: {
        name: {
          [Op.iLike]: '%International%'
        }
      }
    });
    
    console.log(`\n🔍 Colleges with "International" in name: ${intlColleges.length}`);
    intlColleges.forEach(c => {
      console.log(`  ID: ${c.id} | Name: ${c.name}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

checkColleges();
