const { User, College } = require('../models');
const { hashPassword } = require('../utils/auth');
const bcrypt = require('bcryptjs');

// Helper function to parse names
const parseName = (fullName) => {
  if (!fullName || fullName.trim().length === 0) {
    return { firstName: 'User', lastName: 'Unknown' };
  }
  
  const parts = fullName.trim().split(' ');
  
  // If only one part, use it for both firstName and lastName
  if (parts.length === 1) {
    const name = parts[0].length >= 2 ? parts[0] : 'User';
    return { firstName: name, lastName: name };
  }
  
  // Get firstName and lastName
  let firstName = parts[0];
  let lastName = parts.slice(1).join(' ');
  
  // Ensure both are at least 2 characters
  if (firstName.length < 2) firstName = 'User';
  if (lastName.length < 2) lastName = firstName;
  
  return { firstName, lastName };
};

// Helper function to hash password
const hashPasswordSync = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const seedAllUsers = async () => {
  try {
    console.log('🌱 Starting comprehensive user seeding...');

    const hashedPassword = hashPasswordSync('password123');

    // Lecturers Data
    const lecturersData = [
      { name: 'Emmy Abunyanga', email: 'abunyangahbiuuganda@gmail.com', position: 'Administrator - Uganda & Program Coordinator (Graduate)', status: 'suspended' },
      { name: 'Rita Inukan-Adebayo', email: 'adebayoritat@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Adedayo Ruth', email: 'adedayoruthiyabo@gmail.com', position: 'Lecturer', status: 'active' },
      { name: 'Linda Maruti', email: 'adhiambomaruti@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Dr AAK King', email: 'aking587@gmail.com', position: 'Dean/ College for Int. Study', status: 'suspended' },
      { name: 'Amos Korir', email: 'akorirkiplangat@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Pastor Rev. Dr. Alfonce Jumba', email: 'alfoncejumba92@gmail.com', position: 'Theology Lecturer', status: 'suspended' },
      { name: 'ANANI ORGANIZATION', email: 'ananikenya@gmail.com', position: 'LECTURER', status: 'suspended' },
      { name: 'annasturridge', email: 'annasturridge@yahoo.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Aron Bett Cheruiyot', email: 'aronbettcheruiyot@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'ashleynjoki418', email: 'ashleynjoki418@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'asijosey6', email: 'asijosey6@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'azagisiya.solomon', email: 'azagisiya.solomon@yahoo.com', position: 'Lecturer', status: 'suspended' },
      { name: 'babatundeolalekanlawal5', email: 'babatundeolalekanlawal5@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'bakkasimon', email: 'bakkasimon@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Benard Mukiza Kanyabukye', email: 'benardmukizakanyabukye@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'bishopmary Mbengei', email: 'bishopmbengei@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Abisola FJ', email: 'bisolafj@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'bjacksonhbiuaddiction', email: 'bjacksonhbiuaddiction@gmail.com', position: 'Assistant Dean', status: 'suspended' },
      { name: 'blessedisrael6', email: 'blessedisrael6@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'bonifacekiprono2001', email: 'bonifacekiprono2001@gmail.com', position: 'joy', status: 'suspended' },
      { name: 'Craig Amore', email: 'caamore08@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Caroline Russell', email: 'carolinerussell2017@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'cathyngambihbius', email: 'cathyngambihbius@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Karla Chàmbèrs', email: 'chamberskarla2@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Patrick Toroitich', email: 'cherutichofficial@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'chris.al.hutchie', email: 'chris.al.hutchie@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'ckamaitha', email: 'ckamaitha@icloud.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Cleophas N. Waliaula', email: 'cwaliaula@kabarak.ac.ke', position: 'Lecturer', status: 'suspended' },
      { name: 'daniel mwendwa', email: 'danielmwendwam22@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Danville Fourie', email: 'danvillefourie@gmail.com', position: 'Lecturer', status: 'active' },
      { name: 'Dare Olatunji', email: 'dareolatunji247@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'davidjoseph13', email: 'davidjoseph13@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'deanwandapage', email: 'deanwandapage@gmail.com', position: 'Dean', status: 'suspended' },
      { name: 'dr.leonardm.hbius', email: 'dr.leonardm.hbius@gmail.com', position: 'Lecturer,HBIU school of Theology & Divinity', status: 'suspended' },
      { name: 'Peter Abraham', email: 'drabrahamabc@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Dr. Felix Kiplangat', email: 'drfelixkiplangat@gmail.com', position: 'Lecture, Public Health', status: 'suspended' },
      { name: 'Dr. Anthony Mwanthi', email: 'drmmanthony@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Dr Omotayo Paul Oniya', email: 'dromotayooniyauni@gmail.com', position: 'Senior Lecturer, Dean of the Faculty of Music and Art', status: 'suspended' },
      { name: 'Dr. Pauline Osbourne', email: 'drpaulineosbourne@gmail.com', position: 'Professor', status: 'suspended' },
      { name: 'drspencercloftonsr', email: 'drspencercloftonsr@gmail.com', position: 'College of Business & Economics Dean', status: 'suspended' },
      { name: 'dryvonnehbiu', email: 'dryvonnehbiu@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'duronke', email: 'duronke@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'emmiescotts', email: 'emmiescotts@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Felix Banson', email: 'felixbanson@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'franzes_m', email: 'franzes_m@yahoo.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Olufunto Olayinka-Osho', email: 'funty3@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'garrickindustries', email: 'garrickindustries@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'hannah mkoji', email: 'hannahmkoji@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'hbiustudy', email: 'hbiustudy@gmail.com', position: 'love', status: 'active' },
      { name: 'hbiustudyonline', email: 'hbiustudyonline@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'HBI University', email: 'heartbibleinstitute@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'henrysoft511', email: 'henrysoft511@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'hyacinthsbutterfliezllc', email: 'hyacinthsbutterfliezllc@gmail.com', position: 'Dean, Senior Lecturer', status: 'suspended' },
      { name: 'Ifeoma Nonyelum Eze', email: 'ifeomanonyelumeze@gmail.com', position: 'Senior Lecturer', status: 'active' },
      { name: 'imuyahbiuaddiction', email: 'imuyahbiuaddiction@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'info', email: 'info@hbiu.org', position: 'Lecturer', status: 'suspended' },
      { name: 'isaiahsamuel077', email: 'isaiahsamuel077@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'isoobasaul', email: 'isoobasaul@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'james.agadamark', email: 'james.agadamark@outlook.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Moses J Muwanguzi', email: 'jedidiah035@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Yahaya Joel', email: 'joelyahaya7@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'jolorunda', email: 'jolorunda@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Joseph Mutisya', email: 'josephmutisyahbiuniversity@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Joy Mutinda', email: 'joyhbiucourses@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'joyomoseni', email: 'joyomoseni@gmail.com', position: 'Business Administration', status: 'suspended' },
      { name: 'Kemi Taylor', email: 'kemtay83@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'kimalot058', email: 'kimalot058@gmail.com', position: 'TEACHING ASSISTANT', status: 'suspended' },
      { name: 'Simeon Rono', email: 'kimursoysr@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Emmanuel Kipkirui', email: 'kipkiruiemmanuel127@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Karen Morais', email: 'kmomm1974@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Rev. Dr. Kurt Young', email: 'kurtyoung107j@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'lawal5', email: 'lawal5@yahoo.com', position: 'Lecturer', status: 'suspended' },
      { name: 'lho.noruwana', email: 'lho.noruwana@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'liendungu000', email: 'liendungu000@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Katewu Martin', email: 'm.kateuinvestor@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'magoloawuor', email: 'magoloawuor@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'marrlambert16', email: 'marrlambert16@gmail.com', position: 'HBIU Seminary Department of Divinity & Theology', status: 'suspended' },
      { name: 'Monicah Mugambi', email: 'monicahmugambi5@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'MOFFAT MOSE', email: 'mosemoffat93@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'mugambaian09', email: 'mugambaian09@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'muindiboniface632', email: 'muindiboniface632@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'munyolemuededgar', email: 'munyolemuededgar@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'nabwire joan', email: 'nabwirejoan2@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Olubunmi Olatunji', email: 'nobleolu@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Nolwandle Made', email: 'nolwandle.made@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Mpumelelo Ntetha', email: 'ntethampumelelo@gmail.com', position: 'Lecture', status: 'suspended' },
      { name: 'ojemima', email: 'ojemima@yahoo.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Olayinka Osho', email: 'olayinkayodeosho@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Olanrewaju Omosehin', email: 'omosehinolaniyi@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'osandele17', email: 'osandele17@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Oscar Osiro', email: 'oscarosiro7@gmail.com', position: 'Instructor', status: 'suspended' },
      { name: 'Pacifique UKOK', email: 'pacifiqueube@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Prof. M. Fullwood Ph.D', email: 'pastorfullwood@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Peggy Missoy', email: 'peggymissoy@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Rev. Dr Martin Nyagah', email: 'praisegracemessenger@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'praxedes.mutisya', email: 'praxedes.mutisya@gmail.com', position: 'Coordinator West Africa and UK', status: 'suspended' },
      { name: 'previousguvamombe2', email: 'previousguvamombe2@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'professor.jones.hbius', email: 'professor.jones.hbius@gmail.com', position: 'HBIU Seminary Dept. of Divinity and Theology', status: 'suspended' },
      { name: 'propheticarmyo', email: 'propheticarmyo@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'quincysoita', email: 'quincysoita@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'raelmarks3', email: 'raelmarks3@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Dr. Richard Reeves', email: 'res103st@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Fatmata Riquiray Sheriff', email: 'riquirays@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'rmwangihbiuaddiction', email: 'rmwangihbiuaddiction@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'rolando', email: 'rolando@rolandofrancis.com', position: 'Lecturer', status: 'suspended' },
      { name: 'samuel mawanda', email: 'samuelmawanda92@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'sanmi4globalvisibility26', email: 'sanmi4globalvisibility26@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'stephenkiprutoteigut', email: 'stephenkiprutoteigut@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Serunjogi Stephen', email: 'stephenserunjogi93@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Sylvester Nzomo', email: 'sylvesternzomo25@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Tebogo Sefufula', email: 'tebogosefufula@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Dr Terry Obijuru', email: 'terryobijuru@gmail.com', position: 'Lecturer Chaplaincy/MBA', status: 'suspended' },
      { name: 'temitope David', email: 'topolad347@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Ukeme Sunday', email: 'ukemevsn2020@gmail.com', position: 'Adjunct Lecturer', status: 'suspended' },
      { name: 'Umeadim Patricia Akanaziam', email: 'umeadimpatricia1@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'unlimitedpower2003', email: 'unlimitedpower2003@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Vice Chancellor', email: 'vc@hbiu.org', position: 'Lecturer', status: 'suspended' },
      { name: 'victoriawanyana457', email: 'victoriawanyana457@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'y.achevih', email: 'y.achevih@gmail.com', position: 'Lecturer', status: 'suspended' },
      { name: 'Max Y', email: 'youngimacs@gmail.com', position: 'Lecturer', status: 'suspended' }
    ];

    console.log(`📚 Processing ${lecturersData.length} lecturers...`);

    const lecturers = [];
    let lecturerIdStart = 1000;

    for (const lecturer of lecturersData) {
      const { firstName, lastName } = parseName(lecturer.name);
      lecturers.push({
        id: lecturerIdStart++,
        firstName,
        lastName,
        email: lecturer.email,
        password: hashedPassword,
        role: 'lecturer',
        status: lecturer.status === 'active' ? 'active' : 'suspended',
        address: lecturer.position,
        emailVerified: true,
        collegeId: 1
      });
    }

    // Insert lecturers in batches
    const lecturerBatchSize = 50;
    for (let i = 0; i < lecturers.length; i += lecturerBatchSize) {
      const batch = lecturers.slice(i, i + lecturerBatchSize);
      await User.bulkCreate(batch, { validate: true, ignoreDuplicates: true });
      console.log(`  ✓ Inserted lecturers ${i + 1} to ${Math.min(i + lecturerBatchSize, lecturers.length)}`);
    }

    console.log(`✓ Successfully created ${lecturers.length} lecturers`);

    // Students Data - Load from external JSON file for better maintainability
    // For now, using inline data. To add all 3124 students, create allStudentsData.json
    const fs = require('fs');
    const path = require('path');
    
    let studentsData = [];
    
    // Try to load from JSON file first
    try {
      const dataPath = path.join(__dirname, 'allStudentsData.json');
      if (fs.existsSync(dataPath)) {
        studentsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        console.log(`📁 Loaded ${studentsData.length} students from allStudentsData.json`);
      } else {
        // Fall back to inline data (sample)
        console.log('📁 Using inline student data (sample)');
        studentsData = [
          { name: 'Donnah Joseph', email: 'successdonj8@gmail.com', program: 'Doctorate', status: 'active' },
          { name: '03olamidevictor', email: '03olamidevictor@gmail.com', program: '', status: 'suspended' },
          { name: '05erickoloo', email: '05erickoloo@gmail.com', program: '', status: 'suspended' },
          { name: '08165574663', email: '08165574663@gmail.com', program: '', status: 'suspended' },
          { name: '08186622088', email: '08186622088@gmail.com', program: '', status: 'suspended' },
          { name: '09069774004', email: '09069774004@gmail.com', program: '', status: 'suspended' },
          { name: '1011shafiq', email: '1011shafiq@gmail.com', program: '', status: 'suspended' },
          { name: '1017puritymeshmain', email: '1017puritymeshmain@gmail.com', program: '', status: 'suspended' },
          { name: '11ijaiyaajibola', email: '11ijaiyaajibola@gmail.com', program: '', status: 'suspended' },
          { name: '1206mmidongo221', email: '1206mmidongo221@gmail.com', program: '', status: 'suspended' }
        ];
      }
    } catch (error) {
      console.error('⚠️  Error loading student data file:', error.message);
      console.log('Using inline sample data instead');
       studentsData = [
        { name: 'Donnah Joseph', email: 'successdonj8@gmail.com', program: 'Doctorate', status: 'active' },
        { name: '03olamidevictor', email: '03olamidevictor@gmail.com', program: '', status: 'suspended' },
        { name: '05erickoloo', email: '05erickoloo@gmail.com', program: '', status: 'suspended' },
        { name: '08165574663', email: '08165574663@gmail.com', program: '', status: 'suspended' },
        { name: '08186622088', email: '08186622088@gmail.com', program: '', status: 'suspended' },
        { name: '09069774004', email: '09069774004@gmail.com', program: '', status: 'suspended' },
        { name: '1011shafiq', email: '1011shafiq@gmail.com', program: '', status: 'suspended' },
        { name: '1017puritymeshmain', email: '1017puritymeshmain@gmail.com', program: '', status: 'suspended' },
        { name: '11ijaiyaajibola', email: '11ijaiyaajibola@gmail.com', program: '', status: 'suspended' },
        { name: '1206mmidongo221', email: '1206mmidongo221@gmail.com', program: '', status: 'suspended' }
      ];
    }

    console.log(`🎓 Processing ${studentsData.length} students...`);

    const students = [];
    let studentIdStart = 2000;
    let studentNumber = 1;

    for (const student of studentsData) {
      const { firstName, lastName } = parseName(student.name);
      students.push({
        id: studentIdStart++,
        firstName,
        lastName,
        email: student.email,
        password: hashedPassword,
        role: 'student',
        status: student.status === 'active' ? 'active' : 'suspended',
        studentId: `STU${String(studentNumber++).padStart(4, '0')}`,
        address: student.program,
        emailVerified: false,
        collegeId: 1
      });
    }

    // Insert students in batches
    const studentBatchSize = 50;
    for (let i = 0; i < students.length; i += studentBatchSize) {
      const batch = students.slice(i, i + studentBatchSize);
      await User.bulkCreate(batch, { validate: true, ignoreDuplicates: true });
      console.log(`  ✓ Inserted students ${i + 1} to ${Math.min(i + studentBatchSize, students.length)}`);
    }

    console.log(`✓ Successfully created ${students.length} students`);
    console.log('');
    console.log('📊 Summary:');
    console.log(`   Lecturers: ${lecturers.length}`);
    console.log(`   Students: ${students.length}`);
    console.log(`   Total users created: ${lecturers.length + students.length}`);
    console.log('');
    console.log('✅ User seeding completed successfully!');
    console.log('');
    console.log('ℹ️  Default password for all users: password123');
    console.log('');

  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};

module.exports = seedAllUsers;

// Run if called directly
if (require.main === module) {
  const { sequelize } = require('../config/database');
  
  seedAllUsers()
    .then(() => {
      console.log('✓ Seeding script completed');
      sequelize.close();
      process.exit(0);
    })
    .catch((error) => {
      console.error('✗ Seeding script failed:', error);
      sequelize.close();
      process.exit(1);
    });
}
