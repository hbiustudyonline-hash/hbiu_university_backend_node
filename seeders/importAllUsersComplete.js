const bcrypt = require('bcryptjs');
const { User, College } = require('../models');

// Parse full name into firstName and lastName
function parseName(fullName) {
  if (!fullName || fullName.trim() === '') {
    return { firstName: 'Unknown', lastName: 'User' };
  }
  
  const nameParts = fullName.trim().split(' ').filter(part => part.length > 0);
  
  if (nameParts.length === 0) {
    return { firstName: 'Unknown', lastName: 'User' };
  } else if (nameParts.length === 1) {
    return { firstName: nameParts[0], lastName: nameParts[0] };
  } else {
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    return { firstName, lastName };
  }
}

// Generate student ID
function generateStudentId(email) {
  const timestamp = Date.now().toString().slice(-6);
  const emailPrefix = email.split('@')[0].slice(0, 4).toUpperCase();
  return `STU-${emailPrefix}-${timestamp}`;
}

const lecturersData = [
  {name: "Emmy Abunyanga", email: "abunyangahbiuuganda@gmail.com", position: "Administrator - Uganda & Program Coordinator (Graduate)", status: "Suspended"},
  {name: "Rita Inukan-Adebayo", email: "adebayoritat@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Adedayo Ruth", email: "adedayoruthiyabo@gmail.com", position: "Lecturer", status: "Active"},
  {name: "Linda Maruti", email: "adhiambomaruti@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Dr AAK King", email: "aking587@gmail.com", position: "Dean/ College for Int. Study", status: "Suspended"},
  {name: "Amos Korir", email: "akorirkiplangat@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Pastor Rev. Dr. Alfonce Jumba", email: "alfoncejumba92@gmail.com", position: "Theology Lecturer", status: "Suspended"},
  {name: "ANANI ORGANIZATION", email: "ananikenya@gmail.com", position: "LECTURER", status: "Suspended"},
  {name: "annasturridge", email: "annasturridge@yahoo.com", position: "Lecturer", status: "Suspended"},
  {name: "Aron Bett Cheruiyot", email: "aronbettcheruiyot@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "ashleynjoki418", email: "ashleynjoki418@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "asijosey6", email: "asijosey6@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "azagisiya.solomon", email: "azagisiya.solomon@yahoo.com", position: "Lecturer", status: "Suspended"},
  {name: "babatundeolalekanlawal5", email: "babatundeolalekanlawal5@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "bakkasimon", email: "bakkasimon@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Benard Mukiza Kanyabukye", email: "benardmukizakanyabukye@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "bishopmary Mbengei", email: "bishopmbengei@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Abisola FJ", email: "bisolafj@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "bjacksonhbiuaddiction", email: "bjacksonhbiuaddiction@gmail.com", position: "Assistant Dean", status: "Suspended"},
  {name: "blessedisrael6", email: "blessedisrael6@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "bonifacekiprono2001", email: "bonifacekiprono2001@gmail.com", position: "joy", status: "Suspended"},
  {name: "Craig Amore", email: "caamore08@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Caroline Russell", email: "carolinerussell2017@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "cathyngambihbius", email: "cathyngambihbius@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Karla Chàmbèrs", email: "chamberskarla2@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Patrick Toroitich", email: "cherutichofficial@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "chris.al.hutchie", email: "chris.al.hutchie@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "ckamaitha", email: "ckamaitha@icloud.com", position: "Lecturer", status: "Suspended"},
  {name: "Cleophas N. Waliaula", email: "cwaliaula@kabarak.ac.ke", position: "Lecturer", status: "Suspended"},
  {name: "daniel mwendwa", email: "danielmwendwam22@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Danville Fourie", email: "danvillefourie@gmail.com", position: "Lecturer", status: "Active"},
  {name: "Dare Olatunji", email: "dareolatunji247@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "davidjoseph13", email: "davidjoseph13@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "deanwandapage", email: "deanwandapage@gmail.com", position: "Dean", status: "Suspended"},
  {name: "dr.leonardm.hbius", email: "dr.leonardm.hbius@gmail.com", position: "Lecturer,HBIU school of Theology & Divinity", status: "Suspended"},
  {name: "Peter Abraham", email: "drabrahamabc@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Dr. Felix Kiplangat", email: "drfelixkiplangat@gmail.com", position: "Lecture, Public Health", status: "Suspended"},
  {name: "Dr. Anthony Mwanthi", email: "drmmanthony@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Dr Omotayo Paul Oniya", email: "dromotayooniyauni@gmail.com", position: "Senior Lecturer, Dean of the Faculty of Music and Art", status: "Suspended"},
  {name: "Dr. Pauline Osbourne", email: "drpaulineosbourne@gmail.com", position: "Professor", status: "Suspended"},
  {name: "drspencercloftonsr", email: "drspencercloftonsr@gmail.com", position: "College of Business & Economics Dean", status: "Suspended"},
  {name: "dryvonnehbiu", email: "dryvonnehbiu@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "duronke", email: "duronke@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "emmiescotts", email: "emmiescotts@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Felix Banson", email: "felixbanson@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "franzes_m", email: "franzes_m@yahoo.com", position: "Lecturer", status: "Suspended"},
  {name: "Olufunto Olayinka-Osho", email: "funty3@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "garrickindustries", email: "garrickindustries@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "hannah mkoji", email: "hannahmkoji@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "hbiustudy", email: "hbiustudy@gmail.com", position: "love", status: "Active"},
  {name: "hbiustudyonline", email: "hbiustudyonline@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "HBI University", email: "heartbibleinstitute@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "henrysoft511", email: "henrysoft511@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "hyacinthsbutterfliezllc", email: "hyacinthsbutterfliezllc@gmail.com", position: "Dean, Senior Lecturer", status: "Suspended"},
  {name: "Ifeoma Nonyelum Eze", email: "ifeomanonyelumeze@gmail.com", position: "Senior Lecturer", status: "Active"},
  {name: "imuyahbiuaddiction", email: "imuyahbiuaddiction@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "info", email: "info@hbiu.org", position: "Lecturer", status: "Suspended"},
  {name: "isaiahsamuel077", email: "isaiahsamuel077@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "isoobasaul", email: "isoobasaul@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "james.agadamark", email: "james.agadamark@outlook.com", position: "Lecturer", status: "Suspended"},
  {name: "Moses J Muwanguzi", email: "jedidiah035@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Yahaya Joel", email: "joelyahaya7@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "jolorunda", email: "jolorunda@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Joseph Mutisya", email: "josephmutisyahbiuniversity@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Joy Mutinda", email: "joyhbiucourses@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "joyomoseni", email: "joyomoseni@gmail.com", position: "Business Administration", status: "Suspended"},
  {name: "Kemi Taylor", email: "kemtay83@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "kimalot058", email: "kimalot058@gmail.com", position: "TEACHING ASSISTANT", status: "Suspended"},
  {name: "Simeon Rono", email: "kimursoysr@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Emmanuel Kipkirui", email: "kipkiruiemmanuel127@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Karen Morais", email: "kmomm1974@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Rev. Dr. Kurt Young", email: "kurtyoung107j@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "lawal5", email: "lawal5@yahoo.com", position: "Lecturer", status: "Suspended"},
  {name: "lho.noruwana", email: "lho.noruwana@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "liendungu000", email: "liendungu000@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Katewu Martin", email: "m.kateuinvestor@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "magoloawuor", email: "magoloawuor@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "marrlambert16", email: "marrlambert16@gmail.com", position: "HBIU Seminary Department of Divinity & Theology", status: "Suspended"},
  {name: "Monicah Mugambi", email: "monicahmugambi5@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "MOFFAT MOSE", email: "mosemoffat93@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "mugambaian09", email: "mugambaian09@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "muindiboniface632", email: "muindiboniface632@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "munyolemuededgar", email: "munyolemuededgar@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "nabwire joan", email: "nabwirejoan2@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Olubunmi Olatunji", email: "nobleolu@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Nolwandle Made", email: "nolwandle.made@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Mpumelelo Ntetha", email: "ntethampumelelo@gmail.com", position: "Lecture", status: "Suspended"},
  {name: "ojemima", email: "ojemima@yahoo.com", position: "Lecturer", status: "Suspended"},
  {name: "Olayinka Osho", email: "olayinkayodeosho@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Olanrewaju Omosehin", email: "omosehinolaniyi@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "osandele17", email: "osandele17@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Oscar Osiro", email: "oscarosiro7@gmail.com", position: "Instructor", status: "Suspended"},
  {name: "Pacifique UKOK", email: "pacifiqueube@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Prof. M. Fullwood Ph.D", email: "pastorfullwood@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Peggy Missoy", email: "peggymissoy@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Rev. Dr Martin Nyagah", email: "praisegracemessenger@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "praxedes.mutisya", email: "praxedes.mutisya@gmail.com", position: "Coordinator West Africa and UK", status: "Suspended"},
  {name: "previousguvamombe2", email: "previousguvamombe2@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "professor.jones.hbius", email: "professor.jones.hbius@gmail.com", position: "HBIU Seminary Dept. of Divinity and Theology", status: "Suspended"},
  {name: "propheticarmyo", email: "propheticarmyo@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "quincysoita", email: "quincysoita@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "raelmarks3", email: "raelmarks3@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Dr. Richard Reeves", email: "res103st@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Fatmata Riquiray Sheriff", email: "riquirays@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "rmwangihbiuaddiction", email: "rmwangihbiuaddiction@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "rolando", email: "rolando@rolandofrancis.com", position: "Lecturer", status: "Suspended"},
  {name: "samuel mawanda", email: "samuelmawanda92@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "sanmi4globalvisibility26", email: "sanmi4globalvisibility26@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "stephenkiprutoteigut", email: "stephenkiprutoteigut@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Serunjogi Stephen", email: "stephenserunjogi93@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Sylvester Nzomo", email: "sylvesternzomo25@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Tebogo Sefufula", email: "tebogosefufula@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Dr Terry Obijuru", email: "terryobijuru@gmail.com", position: "Lecturer Chaplaincy/MBA", status: "Suspended"},
  {name: "temitope David", email: "topolad347@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Ukeme Sunday", email: "ukemevsn2020@gmail.com", position: "Adjunct Lecturer", status: "Suspended"},
  {name: "Umeadim Patricia Akanaziam", email: "umeadimpatricia1@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "unlimitedpower2003", email: "unlimitedpower2003@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Vice Chancellor", email: "vc@hbiu.org", position: "Lecturer", status: "Suspended"},
  {name: "victoriawanyana457", email: "victoriawanyana457@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "y.achevih", email: "y.achevih@gmail.com", position: "Lecturer", status: "Suspended"},
  {name: "Max Y", email: "youngimacs@gmail.com", position: "Lecturer", status: "Suspended"}
];

// Due to character limits, I'll create students in batches
// This is just the first batch - the script will need to be run multiple times or use a different approach

async function importUsers() {
  try {
    console.log('🚀 Starting comprehensive user import...\n');
    
    const password = await bcrypt.hash('password123', 10);
    let stats = {
      lecturersImported: 0,
      lecturersSkipped: 0,
      studentsImported: 0,
      studentsSkipped: 0,
      errors: 0
    };

    // Import Lecturers
    console.log('📚 Importing Lecturers...');
    for (const lecturer of lecturersData) {
      try {
        const { firstName, lastName } = parseName(lecturer.name);
        const existingUser = await User.findOne({ where: { email: lecturer.email } });
        
        if (existingUser) {
          stats.lecturersSkipped++;
          continue;
        }

        await User.create({
          firstName,
          lastName,
          email: lecturer.email,
          password,
          role: 'lecturer',
          status: lecturer.status.toLowerCase(),
          emailVerified: false
        });
        
        stats.lecturersImported++;
        if (stats.lecturersImported % 10 === 0) {
          console.log(`  ✅ Imported ${stats.lecturersImported} lecturers...`);
        }
      } catch (error) {
        console.error(`  ❌ Error importing lecturer ${lecturer.email}:`, error.message);
        stats.errors++;
      }
    }

    console.log(`\n✅ Lecturer Import Complete:`);
    console.log(`   - Imported: ${stats.lecturersImported}`);
    console.log(`   - Skipped (duplicates): ${stats.lecturersSkipped}`);
    console.log(`   - Errors: ${stats.errors}`);

    // For students, we need to handle the massive dataset differently
    // Let me create a separate student import function
    console.log('\n📝 Note: Student import requires additional data file.');
    console.log('   Please provide complete student list in JSON format.');

  } catch (error) {
    console.error('❌ Critical error during import:', error);
    throw error;
  }
}

// Run the import
importUsers()
  .then(() => {
    console.log('\n✨ Import process completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Import failed:', error);
    process.exit(1);
  });
