const axios = require('axios');

async function checkCoursesAPI() {
  try {
    console.log('🔍 Testing courses API endpoint...\n');
    
    const response = await axios.get('http://localhost:5000/api/courses', {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ API Response Status:', response.status);
    console.log('📊 Response Data Type:', typeof response.data);
    console.log('📊 Is Array?:', Array.isArray(response.data));
    
    if (response.data) {
      console.log('\n📦 Response Structure:');
      console.log('Keys:', Object.keys(response.data));
      
      if (response.data.success !== undefined) {
        console.log('Success:', response.data.success);
      }
      
      if (response.data.data) {
        console.log('Has data wrapper:', true);
        console.log('Data.courses exists:', !!response.data.data.courses);
        if (response.data.data.courses) {
          console.log('Courses count:', response.data.data.courses.length);
        }
      }
      
      if (response.data.courses) {
        console.log('Direct courses array:', true);
        console.log('Courses count:', response.data.courses.length);
      }
      
      if (Array.isArray(response.data)) {
        console.log('Direct array response');
        console.log('Courses count:', response.data.length);
      }
      
      // Show first course if available
      const courses = response.data.data?.courses || response.data.courses || response.data || [];
      if (courses.length > 0) {
        console.log('\n📚 First Course Sample:');
        const first = courses[0];
        console.log(`  ID: ${first.id}`);
        console.log(`  Code: ${first.code}`);
        console.log(`  Title: ${first.title || 'NO TITLE'}`);
        console.log(`  Status: ${first.status}`);
        console.log(`  College ID: ${first.college_id}`);
        console.log(`  Instructor: ${first.instructor || 'None'}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

checkCoursesAPI();
