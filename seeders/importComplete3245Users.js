const bcrypt = require('bcryptjs');
const { User, sequelize } = require('../models');

// Helper function to parse names
function parseName(fullName) {
  if (!fullName || fullName.trim() === '') {
    return { firstName: 'Student', lastName: 'User' };
  }
  const nameParts = fullName.trim().split(' ').filter(part => part.length > 0);
  if (nameParts.length === 0) {
    return { firstName: 'Student', lastName: 'User' };
  } else if (nameParts.length === 1) {
    return { firstName: nameParts[0], lastName: nameParts[0] };
  } else {
    return { firstName: nameParts[0], lastName: nameParts.slice(1).join(' ') };
  }
}

// Generate student ID
function generateStudentId(email) {
  const timestamp = Date.now().toString().slice(-6);
  const emailPrefix = email.split('@')[0].slice(0, 4).toUpperCase();
  return `STU-${emailPrefix}-${timestamp}`;
}

// Complete lecturer data (121 lecturers)
const lecturers = [
  {name:"Emmy Abunyanga",email:"abunyangahbiuuganda@gmail.com",position:"Administrator",status:"Suspended"},
  {name:"Rita Inukan-Adebayo",email:"adebayoritat@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Adedayo Ruth",email:"adedayoruthiyabo@gmail.com",position:"Lecturer",status:"Active"},
  {name:"Linda Maruti",email:"adhiambomaruti@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Dr AAK King",email:"aking587@gmail.com",position:"Dean",status:"Suspended"},
  {name:"Amos Korir",email:"akorirkiplangat@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Pastor Rev Dr Alfonce Jumba",email:"alfoncejumba92@gmail.com",position:"Theology Lecturer",status:"Suspended"},
  {name:"ANANI ORGANIZATION",email:"ananikenya@gmail.com",position:"LECTURER",status:"Suspended"},
  {name:"annasturridge",email:"annasturridge@yahoo.com",position:"Lecturer",status:"Suspended"},
  {name:"Aron Bett Cheruiyot",email:"aronbettcheruiyot@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"ashleynjoki418",email:"ashleynjoki418@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"asijosey6",email:"asijosey6@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"azagisiya solomon",email:"azagisiya.solomon@yahoo.com",position:"Lecturer",status:"Suspended"},
  {name:"babatundeolalekanlawal5",email:"babatundeolalekanlawal5@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"bakkasimon",email:"bakkasimon@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Benard Mukiza Kanyabukye",email:"benardmukizakanyabukye@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"bishopmary Mbengei",email:"bishopmbengei@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Abisola FJ",email:"bisolafj@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"bjacksonhbiuaddiction",email:"bjacksonhbiuaddiction@gmail.com",position:"Assistant Dean",status:"Suspended"},
  {name:"blessedisrael6",email:"blessedisrael6@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"bonifacekiprono2001",email:"bonifacekiprono2001@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Craig Amore",email:"caamore08@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Caroline Russell",email:"carolinerussell2017@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"cathyngambihbius",email:"cathyngambihbius@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Karla Chambèrs",email:"chamberskarla2@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Patrick Toroitich",email:"cherutichofficial@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"chris al hutchie",email:"chris.al.hutchie@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"ckamaitha",email:"ckamaitha@icloud.com",position:"Lecturer",status:"Suspended"},
  {name:"Cleophas N Waliaula",email:"cwaliaula@kabarak.ac.ke",position:"Lecturer",status:"Suspended"},
  {name:"daniel mwendwa",email:"danielmwendwam22@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Danville Fourie",email:"danvillefourie@gmail.com",position:"Lecturer",status:"Active"},
  {name:"Dare Olatunji",email:"dareolatunji247@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"davidjoseph13",email:"davidjoseph13@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"deanwandapage",email:"deanwandapage@gmail.com",position:"Dean",status:"Suspended"},
  {name:"dr leonardm hbius",email:"dr.leonardm.hbius@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Peter Abraham",email:"drabrahamabc@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Dr Felix Kiplangat",email:"drfelixkiplangat@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Dr Anthony Mwanthi",email:"drmmanthony@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Dr Omotayo Paul Oniya",email:"dromotayooniyauni@gmail.com",position:"Senior Lecturer",status:"Suspended"},
  {name:"Dr Pauline Osbourne",email:"drpaulineosbourne@gmail.com",position:"Professor",status:"Suspended"},
  {name:"drspencercloftonsr",email:"drspencercloftonsr@gmail.com",position:"Dean",status:"Suspended"},
  {name:"dryvonnehbiu",email:"dryvonnehbiu@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"duronke",email:"duronke@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"emmiescotts",email:"emmiescotts@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Felix Banson",email:"felixbanson@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"franzes m",email:"franzes_m@yahoo.com",position:"Lecturer",status:"Suspended"},
  {name:"Olufunto Olayinka-Osho",email:"funty3@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"garrickindustries",email:"garrickindustries@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"hannah mkoji",email:"hannahmkoji@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"hbiustudy",email:"hbiustudy@gmail.com",position:"Lecturer",status:"Active"},
  {name:"hbiustudyonline",email:"hbiustudyonline@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"HBI University",email:"heartbibleinstitute@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"henrysoft511",email:"henrysoft511@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"hyacinthsbutterfliezllc",email:"hyacinthsbutterfliezllc@gmail.com",position:"Dean",status:"Suspended"},
  {name:"Ifeoma Nonyelum Eze",email:"ifeomanonyelumeze@gmail.com",position:"Senior Lecturer",status:"Active"},
  {name:"imuyahbiuaddiction",email:"imuyahbiuaddiction@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"info",email:"info@hbiu.org",position:"Lecturer",status:"Suspended"},
  {name:"isaiahsamuel077",email:"isaiahsamuel077@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"isoobasaul",email:"isoobasaul@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"james agadamark",email:"james.agadamark@outlook.com",position:"Lecturer",status:"Suspended"},
  {name:"Moses J Muwanguzi",email:"jedidiah035@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Yahaya Joel",email:"joelyahaya7@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"jolorunda",email:"jolorunda@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Joseph Mutisya",email:"josephmutisyahbiuniversity@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Joy Mutinda",email:"joyhbiucourses@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"joyomoseni",email:"joyomoseni@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Kemi Taylor",email:"kemtay83@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"kimalot058",email:"kimalot058@gmail.com",position:"TEACHING ASSISTANT",status:"Suspended"},
  {name:"Simeon Rono",email:"kimursoysr@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Emmanuel Kipkirui",email:"kipkiruiemmanuel127@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Karen Morais",email:"kmomm1974@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Rev Dr Kurt Young",email:"kurtyoung107j@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"lawal5",email:"lawal5@yahoo.com",position:"Lecturer",status:"Suspended"},
  {name:"lho noruwana",email:"lho.noruwana@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"liendungu000",email:"liendungu000@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Katewu Martin",email:"m.kateuinvestor@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"magoloawuor",email:"magoloawuor@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"marrlambert16",email:"marrlambert16@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Monicah Mugambi",email:"monicahmugambi5@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"MOFFAT MOSE",email:"mosemoffat93@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"mugambaian09",email:"mugambaian09@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"muindiboniface632",email:"muindiboniface632@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"munyolemuededgar",email:"munyolemuededgar@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"nabwire joan",email:"nabwirejoan2@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Olubunmi Olatunji",email:"nobleolu@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Nolwandle Made",email:"nolwandle.made@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Mpumelelo Ntetha",email:"ntethampumelelo@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"ojemima",email:"ojemima@yahoo.com",position:"Lecturer",status:"Suspended"},
  {name:"Olayinka Osho",email:"olayinkayodeosho@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Olanrewaju Omosehin",email:"omosehinolaniyi@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"osandele17",email:"osandele17@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Oscar Osiro",email:"oscarosiro7@gmail.com",position:"Instructor",status:"Suspended"},
  {name:"Pacifique UKOK",email:"pacifiqueube@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Prof M Fullwood PhD",email:"pastorfullwood@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Peggy Missoy",email:"peggymissoy@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Rev Dr Martin Nyagah",email:"praisegracemessenger@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"praxedes mutisya",email:"praxedes.mutisya@gmail.com",position:"Coordinator",status:"Suspended"},
  {name:"previousguvamombe2",email:"previousguvamombe2@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"professor jones hbius",email:"professor.jones.hbius@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"propheticarmyo",email:"propheticarmyo@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"quincysoita",email:"quincysoita@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"raelmarks3",email:"raelmarks3@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Dr Richard Reeves",email:"res103st@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Fatmata Riquiray Sheriff",email:"riquirays@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"rmwangihbiuaddiction",email:"rmwangihbiuaddiction@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"rolando",email:"rolando@rolandofrancis.com",position:"Lecturer",status:"Suspended"},
  {name:"samuel mawanda",email:"samuelmawanda92@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"sanmi4globalvisibility26",email:"sanmi4globalvisibility26@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"stephenkiprutoteigut",email:"stephenkiprutoteigut@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Serunjogi Stephen",email:"stephenserunjogi93@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Sylvester Nzomo",email:"sylvesternzomo25@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Tebogo Sefufula",email:"tebogosefufula@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Dr Terry Obijuru",email:"terryobijuru@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"temitope David",email:"topolad347@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Ukeme Sunday",email:"ukemevsn2020@gmail.com",position:"Adjunct Lecturer",status:"Suspended"},
  {name:"Umeadim Patricia Akanaziam",email:"umeadimpatricia1@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"unlimitedpower2003",email:"unlimitedpower2003@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Vice Chancellor",email:"vc@hbiu.org",position:"Lecturer",status:"Suspended"},
  {name:"victoriawanyana457",email:"victoriawanyana457@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"y achevih",email:"y.achevih@gmail.com",position:"Lecturer",status:"Suspended"},
  {name:"Max Y",email:"youngimacs@gmail.com",position:"Lecturer",status:"Suspended"}
];

console.log(`📊 Dataset: ${lecturers.length} lecturers provided`);
console.log('⚠️  Note: Student data needs to be added to this script in batches');
console.log('   Total target: 3,124 students\n');

async function importAllUsers() {
  const transaction = await sequelize.transaction();
  
  try {
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    let stats = {
      lecturersCreated: 0,
      lecturersSkipped: 0,
      studentsCreated: 0,
      studentsSkipped: 0,
      errors: []
    };

    // Import Lecturers
    console.log('\n📚 Importing Lecturers (121 total)...');
    for (const lecturer of lecturers) {
      try {
        const existing = await User.findOne({ 
          where: { email: lecturer.email },
          transaction 
        });
        
        if (existing) {
          stats.lecturersSkipped++;
          continue;
        }

        const { firstName, lastName } = parseName(lecturer.name);
        
        await User.create({
          firstName,
          lastName,
          email: lecturer.email,
          password: hashedPassword,
          role: 'lecturer',
          status: lecturer.status.toLowerCase(),
          emailVerified: false
        }, { transaction });
        
        stats.lecturersCreated++;
        
        if (stats.lecturersCreated % 20 === 0) {
          console.log(`  ✅ Progress: ${stats.lecturersCreated}/${lecturers.length} lecturers`);
        }
      } catch (error) {
        stats.errors.push({ type: 'lecturer', email: lecturer.email, error: error.message });
      }
    }

    await transaction.commit();
    
    // Print Summary
    console.log('\n' + '='.repeat(60));
    console.log('✨ IMPORT SUMMARY');
    console.log('='.repeat(60));
    console.log(`\n👨‍🏫 Lecturers:`);
    console.log(`   ✅ Created: ${stats.lecturersCreated}`);
    console.log(`   ⏭️  Skipped: ${stats.lecturersSkipped}`);
    console.log(`\n👨‍🎓 Students:`);
    console.log(`   ⚠️  Dataset needs to be added to script`);
    console.log(`   📝 Expected: 3,124 students`);
    
    if (stats.errors.length > 0) {
      console.log(`\n❌ Errors: ${stats.errors.length}`);
      stats.errors.forEach(err => {
        console.log(`   - ${err.type}: ${err.email} - ${err.error}`);
      });
    }
    
    // Show current database totals
    const totalUsers = await User.count();
    const totalLecturers = await User.count({ where: { role: 'lecturer' } });
    const totalStudents = await User.count({ where: { role: 'student' } });
    
    console.log('\n📊 Current Database Totals:');
    console.log(`   Total Users: ${totalUsers}`);
    console.log(`   Lecturers: ${totalLecturers}`);
    console.log(`   Students: ${totalStudents}`);
    console.log(`   Still needed: ${3245 - totalUsers} users to reach target`);
    console.log('='.repeat(60));
    
  } catch (error) {
    await transaction.rollback();
    console.error('\n💥 Import failed:', error);
    throw error;
  }
}

// Run the import
importAllUsers()
  .then(() => {
    console.log('\n✅ Lecturer import completed successfully!');
    console.log('📝 Next step: Add student data and re-run to import all 3,124 students');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Import process failed:', error);
    process.exit(1);
  });
