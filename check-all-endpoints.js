const axios = require('axios');

async function checkAllEndpoints() {
  try {
    // Check courses
    console.log('🔍 Checking /api/courses...');
    const coursesResp = await axios.get('http://localhost:5000/api/courses');
    const courses = coursesResp.data?.data?.courses || coursesResp.data?.courses || [];
    console.log(`✅ Courses: ${courses.length} found`);
    if (courses.length > 0) {
      const fields = Object.keys(courses[0]);
      console.log('   Fields:', fields.slice(0, 10).join(', '));
    }

    // Check assignments (may need auth)
    console.log('\n🔍 Checking /api/assignments...');
    try {
      const assignmentsResp = await axios.get('http://localhost:5000/api/assignments');
      const assignments = assignmentsResp.data?.data?.assignments || assignmentsResp.data?.assignments || assignmentsResp.data || [];
      console.log(`✅ Assignments: ${assignments.length} found`);
      if (assignments.length > 0) {
        const fields = Object.keys(assignments[0]);
        console.log('   Fields:', fields.slice(0, 10).join(', '));
        console.log('   Has course_id?', assignments[0].course_id !== undefined);
        console.log('   Has courseId?', assignments[0].courseId !== undefined);
      }
    } catch (err) {
      console.log(`⚠️ Assignments endpoint: ${err.message}`);
    }

    // Check submissions (may need auth)
    console.log('\n🔍 Checking /api/submissions...');
    try {
      const submissionsResp = await axios.get('http://localhost:5000/api/submissions');
      const submissions = submissionsResp.data?.data?.submissions || submissionsResp.data?.submissions || submissionsResp.data || [];
      console.log(`✅ Submissions: ${submissions.length} found`);
      if (submissions.length > 0) {
        const fields = Object.keys(submissions[0]);
        console.log('   Fields:', fields.slice(0, 10).join(', '));
        console.log('   Has assignment_id?', submissions[0].assignment_id !== undefined);
        console.log('   Has assignmentId?', submissions[0].assignmentId !== undefined);
      }
    } catch (err) {
      console.log(`⚠️ Submissions endpoint: ${err.message}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkAllEndpoints();
