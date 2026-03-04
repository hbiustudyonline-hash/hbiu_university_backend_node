const axios = require('axios');

async function checkFullCourseData() {
  try {
    console.log('🔍 Fetching full course data from API...\n');
    
    const response = await axios.get('http://localhost:5000/api/courses');
    
    const courses = response.data.data?.courses || [];
    
    if (courses.length > 0) {
      console.log(`Found ${courses.length} courses\n`);
      const first = courses[0];
      
      console.log('📚 First Course Full Data:');
      console.log(JSON.stringify(first, null, 2));
      
      console.log('\n\n🔍 Key Field Check:');
      console.log('Has college_id?', first.college_id !== undefined);
      console.log('Has collegeId?', first.collegeId !== undefined);
      console.log('Has college object?', first.college !== undefined);
      console.log('Has instructor?', first.instructor !== undefined);
      console.log('Has lecturerId?', first.lecturerId !== undefined);
      console.log('Has lecturer object?', first.lecturer !== undefined);
      
      if (first.college) {
        console.log('\n🏛️ College Data:');
        console.log(JSON.stringify(first.college, null, 2));
      }
      
      if (first.lecturer) {
        console.log('\n👨‍🏫 Lecturer Data:');
        console.log(JSON.stringify(first.lecturer, null, 2));
      }
    } else {
      console.log('No courses found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkFullCourseData();
