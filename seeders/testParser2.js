const fs = require('fs');

function parseHTMLUsers() {
  console.log('📄 Reading HTML file...');
  const htmlPath = 'c:/Users/hoghc/OneDrive/Desktop/hbiu-online-2/extracted_users/TotalUsers3118.html';
  const html = fs.readFileSync(htmlPath, 'utf8');
  
  const regex = /<p class="c1"><span class="c0">(.*?)<\/span><\/p>/g;
  const matches = [...html.matchAll(regex)].map(m => m[1].replace(/&amp;/g, '&'));
  
  console.log(`📊 Extracted ${matches.length} data elements\n`);
  
  let lecturers = [];
  let students = [];
  let i = 0;
  let inLecturersSection = false;
  let inStudentsSection = false;
  
  while (i < matches.length) {
    const text = matches[i];
    
    // Debug: Show progress every 100 items
    if (i % 100 === 0 && i > 0) {
      console.log(`  Progress: index ${i}/${matches.length} - Lecturers: ${lecturers.length}, Students: ${students.length}`);
    }
    
    if (text === 'Lecturers (121)') {
      inLecturersSection = true;
      inStudentsSection = false;
      console.log(`📌 Lecturers section found at index ${i}`);
      i++;
      continue;
    }
    
    if (text === 'Students (3124)') {
      inLecturersSection = false;
      inStudentsSection = true;
      console.log(`📌 Students section found at index ${i}`);
      i++;
      continue;
    }
    
    // Parse lecturer: [Initial], [Name], "Lecturer", [Email], [Position], [Status]
    if (inLecturersSection && i+3 < matches.length && matches[i+2] === 'Lecturer' && matches[i+3].includes('@')) {
      const name = matches[i+1];
      const email = matches[i+3];
      let status = 'suspended';
      
      for (let j = i+4; j < i+8 && j < matches.length; j++) {
        if (matches[j] === 'Suspended' || matches[j] === 'Active') {
          status = matches[j].toLowerCase();
          break;
        }
      }
      
      lecturers.push({ name, email, role: 'lecturer', status });
      
      if (lecturers.length <= 3 || lecturers.length === 70 || lecturers.length === 71) {
        console.log(`  Lecturer #${lecturers.length} at index ${i}: ${name} (${email})`);
      }
      
      i += 6;
      continue;
    }
    
    // Parse student: [Initial], [Name], "Student", [Email], [Program/Status]
    if (inStudentsSection && i+3 < matches.length && matches[i+2] === 'Student' && matches[i+3].includes('@')) {
      const name = matches[i+1];
      const email = matches[i+3];
      let status = 'suspended';
      
      if (i+4 < matches.length && (matches[i+4] === 'Suspended' || matches[i+4] === 'Active')) {
        status = matches[i+4].toLowerCase();
      } else if (i+5 < matches.length && (matches[i+5] === 'Suspended' || matches[i+5] === 'Active')) {
        status = matches[i+5].toLowerCase();
      }
      
      students.push({ name, email, role: 'student', status });
      
      if (students.length <= 5) {
        console.log(`  Student #${students.length} at index ${i}: ${name} (${email}) - ${status}`);
      }
      
      i += 5;
      continue;
    }
    
    i++;
  }
  
  console.log(`\n✅ Parsed ${lecturers.length} lecturers`);
  console.log(`✅ Parsed ${students.length} students`);
  console.log(`📊 Total: ${lecturers.length + students.length} users`);
  
  return { lecturers, students };
}

console.log('🧪 Testing HTML Parser with Debug Info...\n');
parseHTMLUsers();
console.log('\n✅ Test complete!');
