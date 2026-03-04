const fetch = require('node-fetch');

async function testAPI() {
  try {
    // Test the courses API endpoint
    const response = await fetch('http://localhost:5000/api/courses?limit=5');
    const data = await response.json();
    
    console.log('📡 API Response from /api/courses:');
    console.log('Total courses in response:', data.courses?.length || 0);
    console.log('\nFirst course structure:');
    console.log(JSON.stringify(data.courses[0], null, 2));
    
    // Check if college_id exists
    if (data.courses && data.courses.length > 0) {
      const firstCourse = data.courses[0];
      console.log('\n🔍 Field check for first course:');
      console.log('  collegeId:', firstCourse.collegeId);
      console.log('  college_id:', firstCourse.college_id);
    }
    
    // Now check courses for College of International Studies specifically
    const cisResponse = await fetch('http://localhost:5000/api/courses?limit=999999');
    const cisData = await cisResponse.json();
    const cisCourses = cisData.courses.filter(c => c.collegeId === 5 || c.college_id === 5);
    
    console.log(`\n📚 Courses with collegeId=5 or college_id=5: ${cisCourses.length}`);
    if (cisCourses.length > 0) {
      console.log('Sample:', cisCourses[0].code, '-', cisCourses[0].title);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();
