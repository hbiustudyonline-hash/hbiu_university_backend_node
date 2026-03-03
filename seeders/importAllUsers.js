const { User, College } = require('../models');
const bcrypt = require('bcryptjs');

// Parse name into firstName and lastName (min 2 chars each)
const parseName = (fullName) => {
  if (!fullName || fullName.trim() === '') {
    return { firstName: 'User', lastName: 'Unknown' };
  }

  const nameParts = fullName.trim().split(/\s+/);
  
  if (nameParts.length === 1) {
    const name = nameParts[0];
    if (name.length >= 2) {
      return { firstName: name, lastName: name };
    }
    return { firstName: 'User', lastName: 'Unknown' };
  }

  let firstName = nameParts[0] || 'User';
  let lastName = nameParts.slice(1).join(' ') || 'Unknown';

  // Ensure minimum 2 characters
  if (firstName.length < 2) firstName = 'User';
  if (lastName.length < 2) lastName = 'Unknown';

  return { firstName, lastName };
};

// Extract student ID from email
const generateStudentId = (email) => {
  const timestamp = Date.now().toString().slice(-8);
  const emailPrefix = email.split('@')[0].slice(0, 4).toUpperCase();
  return `STU${emailPrefix}${timestamp}`;
};

// All lecturers data (121 total)
const lecturersData = [
  { name: 'Emmy Abunyanga', email: 'abunyangahbiuuganda@gmail.com', position: 'Administrator - Uganda & Program Coordinator (Graduate)', status: 'suspended' },
  { name: 'Rita Inukan-Adebayo', email: 'adebayoritat@gmail.com', status: 'suspended' },
  { name: 'Adedayo Ruth', email: 'adedayoruthiyabo@gmail.com', status: 'active' },
  { name: 'Linda Maruti', email: 'adhiambomaruti@gmail.com', status: 'suspended' },
  { name: 'Dr AAK King', email: 'aking587@gmail.com', position: 'Dean/ College for Int. Study', status: 'suspended' },
  { name: 'Amos Korir', email: 'akorirkiplangat@gmail.com', status: 'suspended' },
  { name: 'Pastor Rev. Dr. Alfonce Jumba', email: 'alfoncejumba92@gmail.com', position: 'Theology Lecturer', status: 'suspended' },
  { name: 'ANANI ORGANIZATION', email: 'ananikenya@gmail.com', position: 'LECTURER', status: 'suspended' },
  { name: 'annasturridge', email: 'annasturridge@yahoo.com', status: 'suspended' },
  { name: 'Aron Bett Cheruiyot', email: 'aronbettcheruiyot@gmail.com', status: 'suspended' },
  { name: 'ashleynjoki418', email: 'ashleynjoki418@gmail.com', status: 'suspended' },
  { name: 'asijosey6', email: 'asijosey6@gmail.com', status: 'suspended' },
  { name: 'azagisiya.solomon', email: 'azagisiya.solomon@yahoo.com', status: 'suspended' },
  { name: 'babatundeolalekanlawal5', email: 'babatundeolalekanlawal5@gmail.com', status: 'suspended' },
  { name: 'bakkasimon', email: 'bakkasimon@gmail.com', status: 'suspended' },
  { name: 'Benard Mukiza Kanyabukye', email: 'benardmukizakanyabukye@gmail.com', position: 'Lecturer', status: 'suspended' },
  { name: 'bishopmary Mbengei', email: 'bishopmbengei@gmail.com', status: 'suspended' },
  { name: 'Abisola FJ', email: 'bisolafj@gmail.com', status: 'suspended' },
  { name: 'bjacksonhbiuaddiction', email: 'bjacksonhbiuaddiction@gmail.com', position: 'Assistant Dean', status: 'suspended' },
  { name: 'blessedisrael6', email: 'blessedisrael6@gmail.com', status: 'suspended' },
  { name: 'bonifacekiprono2001', email: 'bonifacekiprono2001@gmail.com', position: 'joy', status: 'suspended' },
  { name: 'Craig Amore', email: 'caamore08@gmail.com', status: 'suspended' },
  { name: 'Caroline Russell', email: 'carolinerussell2017@gmail.com', status: 'suspended' },
  { name: 'cathyngambihbius', email: 'cathyngambihbius@gmail.com', status: 'suspended' },
  { name: 'Karla Chàmbèrs', email: 'chamberskarla2@gmail.com', status: 'suspended' },
  { name: 'Patrick Toroitich', email: 'cherutichofficial@gmail.com', status: 'suspended' },
  { name: 'chris.al.hutchie', email: 'chris.al.hutchie@gmail.com', position: 'Lecturer', status: 'suspended' },
  { name: 'ckamaitha', email: 'ckamaitha@icloud.com', status: 'suspended' },
  { name: 'Cleophas N. Waliaula', email: 'cwaliaula@kabarak.ac.ke', status: 'suspended' },
  { name: 'daniel mwendwa', email: 'danielmwendwam22@gmail.com', position: 'Lecturer', status: 'suspended' },
  { name: 'Danville Fourie', email: 'danvillefourie@gmail.com', position: 'Lecturer', status: 'active' },
  { name: 'Dare Olatunji', email: 'dareolatunji247@gmail.com', status: 'suspended' },
  { name: 'davidjoseph13', email: 'davidjoseph13@gmail.com', status: 'suspended' },
  { name: 'deanwandapage', email: 'deanwandapage@gmail.com', position: 'Dean', status: 'suspended' },
  { name: 'dr.leonardm.hbius', email: 'dr.leonardm.hbius@gmail.com', position: 'Lecturer,HBIU school of Theology & Divinity', status: 'suspended' },
  { name: 'Peter Abraham', email: 'drabrahamabc@gmail.com', status: 'suspended' },
  { name: 'Dr. Felix Kiplangat', email: 'drfelixkiplangat@gmail.com', position: 'Lecture, Public Health', status: 'suspended' },
  { name: 'Dr. Anthony Mwanthi', email: 'drmmanthony@gmail.com', status: 'suspended' },
  { name: 'Dr Omotayo Paul Oniya', email: 'dromotayooniyauni@gmail.com', position: 'Senior Lecturer, Dean of the Faculty of Music and Art', status: 'suspended' },
  { name: 'Dr. Pauline Osbourne', email: 'drpaulineosbourne@gmail.com', position: 'Professor', status: 'suspended' },
  { name: 'drspencercloftonsr', email: 'drspencercloftonsr@gmail.com', position: 'College of Business & Economics Dean', status: 'suspended' },
  { name: 'dryvonnehbiu', email: 'dryvonnehbiu@gmail.com', status: 'suspended' },
  { name: 'duronke', email: 'duronke@gmail.com', status: 'suspended' },
  { name: 'emmiescotts', email: 'emmiescotts@gmail.com', position: 'Lecturer', status: 'suspended' },
  { name: 'Felix Banson', email: 'felixbanson@gmail.com', status: 'suspended' },
  { name: 'franzes_m', email: 'franzes_m@yahoo.com', status: 'suspended' },
  { name: 'Olufunto Olayinka-Osho', email: 'funty3@gmail.com', status: 'suspended' },
  { name: 'garrickindustries', email: 'garrickindustries@gmail.com', status: 'suspended' },
  { name: 'hannah mkoji', email: 'hannahmkoji@gmail.com', status: 'suspended' },
  { name: 'hbiustudy', email: 'hbiustudy@gmail.com', position: 'love', status: 'active' },
  { name: 'hbiustudyonline', email: 'hbiustudyonline@gmail.com', status: 'suspended' },
  { name: 'HBI University', email: 'heartbibleinstitute@gmail.com', status: 'suspended' },
  { name: 'henrysoft511', email: 'henrysoft511@gmail.com', status: 'suspended' },
  { name: 'hyacinthsbutterfliezllc', email: 'hyacinthsbutterfliezllc@gmail.com', position: 'Dean, Senior Lecturer', status: 'suspended' },
  { name: 'Ifeoma Nonyelum Eze', email: 'ifeomanonyelumeze@gmail.com', position: 'Senior Lecturer', status: 'active' },
  { name: 'imuyahbiuaddiction', email: 'imuyahbiuaddiction@gmail.com', status: 'suspended' },
  { name: 'info', email: 'info@hbiu.org', status: 'suspended' },
  { name: 'isaiahsamuel077', email: 'isaiahsamuel077@gmail.com', status: 'suspended' },
  { name: 'isoobasaul', email: 'isoobasaul@gmail.com', status: 'suspended' },
  { name: 'james.agadamark', email: 'james.agadamark@outlook.com', status: 'suspended' },
  { name: 'Moses J Muwanguzi', email: 'jedidiah035@gmail.com', status: 'suspended' },
  { name: 'Yahaya Joel', email: 'joelyahaya7@gmail.com', status: 'suspended' },
  { name: 'jolorunda', email: 'jolorunda@gmail.com', status: 'suspended' },
  { name: 'Joseph Mutisya', email: 'josephmutisyahbiuniversity@gmail.com', status: 'suspended' },
  { name: 'Joy Mutinda', email: 'joyhbiucourses@gmail.com', status: 'suspended' },
  { name: 'joyomoseni', email: 'joyomoseni@gmail.com', position: 'Business Administration', status: 'suspended' },
  { name: 'Kemi Taylor', email: 'kemtay83@gmail.com', status: 'suspended' },
  { name: 'kimalot058', email: 'kimalot058@gmail.com', position: 'TEACHING ASSISTANT', status: 'suspended' },
  { name: 'Simeon Rono', email: 'kimursoysr@gmail.com', status: 'suspended' },
  { name: 'Emmanuel Kipkirui', email: 'kipkiruiemmanuel127@gmail.com', status: 'suspended' },
  { name: 'Karen Morais', email: 'kmomm1974@gmail.com', status: 'suspended' },
  { name: 'Rev. Dr. Kurt Young', email: 'kurtyoung107j@gmail.com', status: 'suspended' },
  { name: 'lawal5', email: 'lawal5@yahoo.com', status: 'suspended' },
  { name: 'lho.noruwana', email: 'lho.noruwana@gmail.com', status: 'suspended' },
  { name: 'liendungu000', email: 'liendungu000@gmail.com', status: 'suspended' },
  { name: 'Katewu Martin', email: 'm.kateuinvestor@gmail.com', position: 'Lecturer', status: 'suspended' },
  { name: 'magoloawuor', email: 'magoloawuor@gmail.com', status: 'suspended' },
  { name: 'marrlambert16', email: 'marrlambert16@gmail.com', position: 'HBIU Seminary Department of Divinity & Theology', status: 'suspended' },
  { name: 'Monicah Mugambi', email: 'monicahmugambi5@gmail.com', status: 'suspended' },
  { name: 'MOFFAT MOSE', email: 'mosemoffat93@gmail.com', status: 'suspended' },
  { name: 'mugambaian09', email: 'mugambaian09@gmail.com', status: 'suspended' },
  { name: 'muindiboniface632', email: 'muindiboniface632@gmail.com', status: 'suspended' },
  { name: 'munyolemuededgar', email: 'munyolemuededgar@gmail.com', status: 'suspended' },
  { name: 'nabwire joan', email: 'nabwirejoan2@gmail.com', status: 'suspended' },
  { name: 'Olubunmi Olatunji', email: 'nobleolu@gmail.com', status: 'suspended' },
  { name: 'Nolwandle Made', email: 'nolwandle.made@gmail.com', status: 'suspended' },
  { name: 'Mpumelelo Ntetha', email: 'ntethampumelelo@gmail.com', position: 'Lecture', status: 'suspended' },
  { name: 'ojemima', email: 'ojemima@yahoo.com', status: 'suspended' },
  { name: 'Olayinka Osho', email: 'olayinkayodeosho@gmail.com', status: 'suspended' },
  { name: 'Olanrewaju Omosehin', email: 'omosehinolaniyi@gmail.com', status: 'suspended' },
  { name: 'osandele17', email: 'osandele17@gmail.com', position: 'Lecturer', status: 'suspended' },
  { name: 'Oscar Osiro', email: 'oscarosiro7@gmail.com', position: 'Instructor', status: 'suspended' },
  { name: 'Pacifique UKOK', email: 'pacifiqueube@gmail.com', position: 'Lecturer', status: 'suspended' },
  { name: 'Prof. M. Fullwood Ph.D', email: 'pastorfullwood@gmail.com', status: 'suspended' },
  { name: 'Peggy Missoy', email: 'peggymissoy@gmail.com', status: 'suspended' },
  { name: 'Rev. Dr Martin Nyagah', email: 'praisegracemessenger@gmail.com', status: 'suspended' },
  { name: 'praxedes.mutisya', email: 'praxedes.mutisya@gmail.com', position: 'Coordinator West Africa and UK', status: 'suspended' },
  { name: 'previousguvamombe2', email: 'previousguvamombe2@gmail.com', status: 'suspended' },
  { name: 'professor.jones.hbius', email: 'professor.jones.hbius@gmail.com', position: 'HBIU Seminary Dept. of Divinity and Theology', status: 'suspended' },
  { name: 'propheticarmyo', email: 'propheticarmyo@gmail.com', status: 'suspended' },
  { name: 'quincysoita', email: 'quincysoita@gmail.com', status: 'suspended' },
  { name: 'raelmarks3', email: 'raelmarks3@gmail.com', position: 'Lecturer', status: 'suspended' },
  { name: 'Dr. Richard Reeves', email: 'res103st@gmail.com', status: 'suspended' },
  { name: 'Fatmata Riquiray Sheriff', email: 'riquirays@gmail.com', status: 'suspended' },
  { name: 'rmwangihbiuaddiction', email: 'rmwangihbiuaddiction@gmail.com', status: 'suspended' },
  { name: 'rolando', email: 'rolando@rolandofrancis.com', status: 'suspended' },
  { name: 'samuel mawanda', email: 'samuelmawanda92@gmail.com', status: 'suspended' },
  { name: 'sanmi4globalvisibility26', email: 'sanmi4globalvisibility26@gmail.com', status: 'suspended' },
  { name: 'stephenkiprutoteigut', email: 'stephenkiprutoteigut@gmail.com', status: 'suspended' },
  { name: 'Serunjogi Stephen', email: 'stephenserunjogi93@gmail.com', status: 'suspended' },
  { name: 'Sylvester Nzomo', email: 'sylvesternzomo25@gmail.com', status: 'suspended' },
  { name: 'Tebogo Sefufula', email: 'tebogosefufula@gmail.com', position: 'Lecturer', status: 'suspended' },
  { name: 'Dr Terry Obijuru', email: 'terryobijuru@gmail.com', position: 'Lecturer Chaplaincy/MBA', status: 'suspended' },
  { name: 'temitope David', email: 'topolad347@gmail.com', status: 'suspended' },
  { name: 'Ukeme Sunday', email: 'ukemevsn2020@gmail.com', position: 'Adjunct Lecturer', status: 'suspended' },
  { name: 'Umeadim Patricia Akanaziam', email: 'umeadimpatricia1@gmail.com', status: 'suspended' },
  { name: 'unlimitedpower2003', email: 'unlimitedpower2003@gmail.com', status: 'suspended' },
  { name: 'Vice Chancellor', email: 'vc@hbiu.org', status: 'suspended' },
  { name: 'victoriawanyana457', email: 'victoriawanyana457@gmail.com', status: 'suspended' },
  { name: 'y.achevih', email: 'y.achevih@gmail.com', position: 'Lecturer', status: 'suspended' },
  { name: 'Max Y', email: 'youngimacs@gmail.com', status: 'suspended' }
];

// Get college IDs (we'll need to assign students to colleges)
const getColleges = async () => {
  const colleges = await College.findAll({ attributes: ['id', 'name'] });
  return colleges;
};

// Hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Import lecturers
const importLecturers = async () => {
  console.log('\n=== Starting Lecturer Import ===\n');
  const hashedPassword = await hashPassword('password123');
  let imported = 0;
  let skipped = 0;

  for (const lecturer of lecturersData) {
    try {
      // Check if lecturer already exists
      const existing = await User.findOne({ where: { email: lecturer.email } });
      if (existing) {
        console.log(`⏭️  Skipped: ${lecturer.email} (already exists)`);
        skipped++;
        continue;
      }

      const { firstName, lastName } = parseName(lecturer.name);
      
      await User.create({
        firstName,
        lastName,
        email: lecturer.email,
        password: hashedPassword,
        role: 'lecturer',
        status: lecturer.status || 'suspended'
      });

      console.log(`✅ Imported lecturer: ${firstName} ${lastName}`);
      imported++;
    } catch (error) {
      console.error(`❌ Error importing ${lecturer.email}:`, error.message);
    }
  }

  console.log(`\n📊 Lecturers: ${imported} imported, ${skipped} skipped\n`);
  return { imported, skipped };
};

// Import students in batches (this will be much longer - I'll provide a template)
const importStudentsFromData = async (studentsArray, batchSize = 50) => {
  console.log('\n=== Starting Student Import ===\n');
  const hashedPassword = await hashPassword('password123');
  const colleges = await getColleges();
  const defaultCollege = colleges.length > 0 ? colleges[0].id : null;

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < studentsArray.length; i += batchSize) {
    const batch = studentsArray.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(studentsArray.length / batchSize);
    
    console.log(`📦 Processing batch ${batchNumber}/${totalBatches}...`);

    const usersToCreate = [];

    for (const student of batch) {
      try {
        // Check if student already exists
        const existing = await User.findOne({ where: { email: student.email } });
        if (existing) {
          skipped++;
          continue;
        }

        const { firstName, lastName } = parseName(student.name);
        const studentId = generateStudentId(student.email);

        usersToCreate.push({
          firstName,
          lastName,
          email: student.email,
          password: hashedPassword,
          role: 'student',
          status: student.status || 'suspended',
          studentId,
          collegeId: defaultCollege
        });

      } catch (error) {
        console.error(`❌ Error preparing ${student.email}:`, error.message);
        errors++;
      }
    }

    // Bulk create users
    if (usersToCreate.length > 0) {
      try {
        await User.bulkCreate(usersToCreate);
        imported += usersToCreate.length;
        console.log(`✅ Batch ${batchNumber}: ${usersToCreate.length} students imported`);
      } catch (error) {
        console.error(`❌ Error importing batch ${batchNumber}:`, error.message);
        errors += usersToCreate.length;
      }
    }

    // Progress update
    const progress = Math.min(100, Math.round(((i + batchSize) / studentsArray.length) * 100));
    console.log(`📈 Progress: ${progress}% (${Math.min(i + batchSize, studentsArray.length)}/${studentsArray.length})\n`);
  }

  console.log(`\n📊 Students: ${imported} imported, ${skipped} skipped, ${errors} errors\n`);
  return { imported, skipped, errors };
};

// Main import function
const main = async () => {
  try {
    console.log('╔════════════════════════════════════════════╗');
    console.log('║   HBIU Complete User Import Script        ║');
    console.log('║   Total: 3,245 Users (121 + 3,124)       ║');
    console.log('╚════════════════════════════════════════════╝\n');

    const startTime = Date.now();

    // Import lecturers
    const lectureStats = await importLecturers();

    console.log('\n⚠️  NOTE: Student data is too large to include in this script.');
    console.log('Please use the CSV import method for students.');
    console.log('Run: node importFromCSV.js students.csv\n');

    // Get current user counts
    const totalUsers = await User.count();
    const lecturerCount = await User.count({ where: { role: 'lecturer' } });
    const studentCount = await User.count({ where: { role: 'student' } });

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║          Import Summary                    ║');
    console.log('╠════════════════════════════════════════════╣');
    console.log(`║ Total users in database: ${totalUsers}              ║`);
    console.log(`║ - Lecturers: ${lecturerCount}                         ║`);
    console.log(`║ - Students: ${studentCount}                          ║`);
    console.log(`║                                            ║`);
    console.log(`║ Time taken: ${duration}s                      ║`);
    console.log('╚════════════════════════════════════════════╝\n');

    console.log('✨ Lecturer import complete!');
    console.log('📝 Next step: Import students using CSV file\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { parseName, generateStudentId, importLecturers, importStudentsFromData };
