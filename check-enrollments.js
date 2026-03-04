const axios = require('axios');

async function checkEnrollments() {
  try {
    const response = await axios.get('http://localhost:5000/api/enrollments');
    
    const enrollments = response?.data?.data?.enrollments || response?.data?.enrollments || response?.data || [];
    
    console.log(`Found ${enrollments.length} enrollments\n`);
    
    if (enrollments.length > 0) {
      const first = enrollments[0];
      console.log('First enrollment:');
      console.log(JSON.stringify(first, null, 2));
      
      console.log('\n🔍 Field names:');
      console.log('Has courseId?', first.courseId !== undefined);
      console.log('Has course_id?', first.course_id !== undefined);
      console.log('Has userId?', first.userId !== undefined);
      console.log('Has user_id?', first.user_id !== undefined);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkEnrollments();
