const http = require('http');

function testAPI(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function run() {
  try {
    console.log('🔍 Testing /api/courses endpoint...\n');
    
    const data = await testAPI('/api/courses?limit=999999');
    
    console.log('📦 Full API response:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.courses) {
      console.log(`\n✅ API returned ${data.courses.length} courses\n`);
      
      // Check for College ID 5
      const cis = data.courses.filter(c => c.collegeId === 5 || c.college_id === 5);
      console.log(`📚 Courses with collegeId=5 or college_id=5: ${cis.length}`);
      
      if (cis.length > 0) {
        console.log('\nFirst 3 courses:');
        cis.slice(0, 3).forEach(c => {
          console.log(`  - [${c.code}] ${c.title}`);
          console.log(`    collegeId: ${c.collegeId}, college_id: ${c.college_id}`);
        });
      } else {
        console.log('\n❌ No courses found for College ID 5!');
      }
    } else {
      console.log('\n❌ No courses array in response!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

run();
