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
    
    // Check for section markers
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
      console.log(`📌 Students section at index ${i}`);
      i++;
      continue;
    }
    
    // Parse lecturer: Initial, Name, "Lecturer", Email, ...
    if (inLecturersSection && i+3 < matches.length && matches[i+2] === 'Lecturer' && matches[i+3].includes('@')) {
      const name = matches[i+1];
      const email = matches[i+3];
      let status = 'suspended';
      
      // Scan next few items for status
      for (let j = i+4; j < Math.min(i+8, matches.length); j++) {
        if (matches[j] === 'Suspended' || matches[j] === 'Active') {
          status = matches[j].toLowerCase();
          break;
        }
        // Stop early if we hit next section or entry
        if (matches[j] === 'Students (3124)' || matches[j] === 'Lecturer') {
          break;
        }
      }
      
      lecturers.push({ name, email, role: 'lecturer', status });
      
      if (lecturers.length <= 3 || lecturers.length === 70 || lecturers.length === 71) {
        console.log(`  Lecturer #${lecturers.length} at index ${i}: ${name}`);
        if (lecturers.length === 70) {
          console.log(`    Next few items: [${i+1}]="${matches[i+1]}", [${i+2}]="${matches[i+2]}", [${i+3}]="${matches[i+3]}", [${i+4}]="${matches[i+4]}", [${i+5}]="${matches[i+5]}", [${i+6}]="${matches[i+6]}"`);
        }
      }
      
      // Jump ahead by typical lecturer entry size, but not too far
      i += 5; // will check next position on next iteration
      continue;
    }
    
    // Parse student: Initial, Name, "Student", Email, Status
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
        console.log(`  Student #${students.length}: ${name} (${email})`);
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

console.log('🧪 Final Parser Test...\n');
const result = parseHTMLUsers();
console.log('\n✅ Test complete!');
if (result.students.length < 1000) {
  console.log(`\n⚠️ WARNING: Only found ${result.students.length} students, expected ~3124`);
}
