const bcrypt = require('bcryptjs');
const { User, sequelize } = require('../models');

// Helper function to parse names
function parseName(fullName) {
  if (!fullName || fullName.trim() === '') {
    return { firstName: 'User', lastName: 'Unknown' };
  }
  const parts = fullName.trim().split(' ').filter(p => p.length > 0);
  if (parts.length === 0) {
    return { firstName: 'User', lastName: 'Unknown' };
  } else if (parts.length === 1) {
    return { firstName: parts[0], lastName: parts[0] };
  } else {
    return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
  }
}

// Embedded user data
const LECTURERS_DATA = [
  {
    "name": "Emmy Abunyanga",
    "role": "lecturer",
    "email": "abunyangahbiuuganda@gmail.com",
    "status": "suspended",
    "position": "Administrator - Uganda & Program Coordinator (Graduate)"
  },
  {
    "name": "Rita Inukan-Adebayo",
    "role": "lecturer",
    "email": "adebayoritat@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Adedayo Ruth",
    "role": "lecturer",
    "email": "adedayoruthiyabo@gmail.com",
    "status": "active"
  },
  {
    "name": "Linda Maruti",
    "role": "lecturer",
    "email": "adhiambomaruti@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Dr AAK King",
    "role": "lecturer",
    "email": "aking587@gmail.com",
    "status": "suspended",
    "position": "Dean/ College for Int. Study"
  },
  {
    "name": "Amos Korir",
    "role": "lecturer",
    "email": "akorirkiplangat@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Pastor Rev. Dr. Alfonce Jumba",
    "role": "lecturer",
    "email": "alfoncejumba92@gmail.com",
    "status": "suspended",
    "position": "Theology Lecturer"
  },
  {
    "name": "ANANI ORGANIZATION",
    "role": "lecturer",
    "email": "ananikenya@gmail.com",
    "status": "suspended",
    "position": "LECTURER"
  },
  {
    "name": "annasturridge",
    "role": "lecturer",
    "email": "annasturridge@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "Aron Bett Cheruiyot",
    "role": "lecturer",
    "email": "aronbettcheruiyot@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ashleynjoki418",
    "role": "lecturer",
    "email": "ashleynjoki418@gmail.com",
    "status": "suspended"
  },
  {
    "name": "asijosey6",
    "role": "lecturer",
    "email": "asijosey6@gmail.com",
    "status": "suspended"
  },
  {
    "name": "azagisiya.solomon",
    "role": "lecturer",
    "email": "azagisiya.solomon@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "babatundeolalekanlawal5",
    "role": "lecturer",
    "email": "babatundeolalekanlawal5@gmail.com",
    "status": "suspended"
  },
  {
    "name": "bakkasimon",
    "role": "lecturer",
    "email": "bakkasimon@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Benard Mukiza Kanyabukye",
    "role": "lecturer",
    "email": "benardmukizakanyabukye@gmail.com",
    "status": "suspended",
    "position": "Lecturer"
  },
  {
    "name": "bishopmary Mbengei",
    "role": "lecturer",
    "email": "bishopmbengei@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Abisola FJ",
    "role": "lecturer",
    "email": "bisolafj@gmail.com",
    "status": "suspended"
  },
  {
    "name": "bjacksonhbiuaddiction",
    "role": "lecturer",
    "email": "bjacksonhbiuaddiction@gmail.com",
    "status": "suspended",
    "position": "Assistant Dean"
  },
  {
    "name": "blessedisrael6",
    "role": "lecturer",
    "email": "blessedisrael6@gmail.com",
    "status": "suspended"
  },
  {
    "name": "bonifacekiprono2001",
    "role": "lecturer",
    "email": "bonifacekiprono2001@gmail.com",
    "status": "suspended",
    "position": "joy"
  },
  {
    "name": "Craig Amore",
    "role": "lecturer",
    "email": "caamore08@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Caroline Russell",
    "role": "lecturer",
    "email": "carolinerussell2017@gmail.com",
    "status": "suspended"
  },
  {
    "name": "cathyngambihbius",
    "role": "lecturer",
    "email": "cathyngambihbius@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Karla Ch&agrave;mb&egrave;rs",
    "role": "lecturer",
    "email": "chamberskarla2@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Patrick Toroitich",
    "role": "lecturer",
    "email": "cherutichofficial@gmail.com",
    "status": "suspended"
  },
  {
    "name": "chris.al.hutchie",
    "role": "lecturer",
    "email": "chris.al.hutchie@gmail.com",
    "status": "suspended",
    "position": "Lecturer"
  },
  {
    "name": "ckamaitha",
    "role": "lecturer",
    "email": "ckamaitha@icloud.com",
    "status": "suspended"
  },
  {
    "name": "Cleophas N. Waliaula",
    "role": "lecturer",
    "email": "cwaliaula@kabarak.ac.ke",
    "status": "suspended"
  },
  {
    "name": "daniel mwendwa",
    "role": "lecturer",
    "email": "danielmwendwam22@gmail.com",
    "status": "suspended",
    "position": "Lecturer"
  },
  {
    "name": "Danville Fourie",
    "role": "lecturer",
    "email": "danvillefourie@gmail.com",
    "status": "active",
    "position": "Lecturer"
  },
  {
    "name": "Dare Olatunji",
    "role": "lecturer",
    "email": "dareolatunji247@gmail.com",
    "status": "suspended"
  },
  {
    "name": "davidjoseph13",
    "role": "lecturer",
    "email": "davidjoseph13@gmail.com",
    "status": "suspended"
  },
  {
    "name": "deanwandapage",
    "role": "lecturer",
    "email": "deanwandapage@gmail.com",
    "status": "suspended",
    "position": "Dean"
  },
  {
    "name": "dr.leonardm.hbius",
    "role": "lecturer",
    "email": "dr.leonardm.hbius@gmail.com",
    "status": "suspended",
    "position": "Lecturer,HBIU school of Theology & Divinity"
  },
  {
    "name": "Peter Abraham",
    "role": "lecturer",
    "email": "drabrahamabc@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Dr. Felix Kiplangat",
    "role": "lecturer",
    "email": "drfelixkiplangat@gmail.com",
    "status": "suspended",
    "position": "Lecture, Public Health"
  },
  {
    "name": "Dr. Anthony Mwanthi",
    "role": "lecturer",
    "email": "drmmanthony@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Dr Omotayo Paul Oniya",
    "role": "lecturer",
    "email": "dromotayooniyauni@gmail.com",
    "status": "suspended",
    "position": "Senior Lecturer, Dean of the Faculty of Music and Art"
  },
  {
    "name": "Dr. Pauline Osbourne",
    "role": "lecturer",
    "email": "drpaulineosbourne@gmail.com",
    "status": "suspended",
    "position": "Professor"
  },
  {
    "name": "drspencercloftonsr",
    "role": "lecturer",
    "email": "drspencercloftonsr@gmail.com",
    "status": "suspended",
    "position": "College of Business & Economics Dean"
  },
  {
    "name": "dryvonnehbiu",
    "role": "lecturer",
    "email": "dryvonnehbiu@gmail.com",
    "status": "suspended"
  },
  {
    "name": "duronke",
    "role": "lecturer",
    "email": "duronke@gmail.com",
    "status": "suspended"
  },
  {
    "name": "emmiescotts",
    "role": "lecturer",
    "email": "emmiescotts@gmail.com",
    "status": "suspended",
    "position": "Lecturer"
  },
  {
    "name": "Felix Banson",
    "role": "lecturer",
    "email": "felixbanson@gmail.com",
    "status": "suspended"
  },
  {
    "name": "franzes_m",
    "role": "lecturer",
    "email": "franzes_m@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "Olufunto Olayinka-Osho",
    "role": "lecturer",
    "email": "funty3@gmail.com",
    "status": "suspended"
  },
  {
    "name": "garrickindustries",
    "role": "lecturer",
    "email": "garrickindustries@gmail.com",
    "status": "suspended"
  },
  {
    "name": "hannah mkoji",
    "role": "lecturer",
    "email": "hannahmkoji@gmail.com",
    "status": "suspended"
  },
  {
    "name": "hbiustudy",
    "role": "lecturer",
    "email": "hbiustudy@gmail.com",
    "status": "active",
    "position": "love"
  },
  {
    "name": "hbiustudyonline",
    "role": "lecturer",
    "email": "hbiustudyonline@gmail.com",
    "status": "suspended"
  },
  {
    "name": "HBI University",
    "role": "lecturer",
    "email": "heartbibleinstitute@gmail.com",
    "status": "suspended"
  },
  {
    "name": "henrysoft511",
    "role": "lecturer",
    "email": "henrysoft511@gmail.com",
    "status": "suspended"
  },
  {
    "name": "hyacinthsbutterfliezllc",
    "role": "lecturer",
    "email": "hyacinthsbutterfliezllc@gmail.com",
    "status": "suspended",
    "position": "Dean, Senior Lecturer"
  },
  {
    "name": "Ifeoma Nonyelum Eze",
    "role": "lecturer",
    "email": "ifeomanonyelumeze@gmail.com",
    "status": "active",
    "position": "Senior Lecturer"
  },
  {
    "name": "imuyahbiuaddiction",
    "role": "lecturer",
    "email": "imuyahbiuaddiction@gmail.com",
    "status": "suspended"
  },
  {
    "name": "info",
    "role": "lecturer",
    "email": "info@hbiu.org",
    "status": "suspended"
  },
  {
    "name": "isaiahsamuel077",
    "role": "lecturer",
    "email": "isaiahsamuel077@gmail.com",
    "status": "suspended"
  },
  {
    "name": "isoobasaul",
    "role": "lecturer",
    "email": "isoobasaul@gmail.com",
    "status": "suspended"
  },
  {
    "name": "james.agadamark",
    "role": "lecturer",
    "email": "james.agadamark@outlook.com",
    "status": "suspended"
  },
  {
    "name": "Moses J Muwanguzi",
    "role": "lecturer",
    "email": "jedidiah035@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Yahaya Joel",
    "role": "lecturer",
    "email": "joelyahaya7@gmail.com",
    "status": "suspended"
  },
  {
    "name": "jolorunda",
    "role": "lecturer",
    "email": "jolorunda@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Joseph Mutisya",
    "role": "lecturer",
    "email": "josephmutisyahbiuniversity@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Joy Mutinda",
    "role": "lecturer",
    "email": "joyhbiucourses@gmail.com",
    "status": "suspended"
  },
  {
    "name": "joyomoseni",
    "role": "lecturer",
    "email": "joyomoseni@gmail.com",
    "status": "suspended",
    "position": "Business Administration"
  },
  {
    "name": "Kemi Taylor",
    "role": "lecturer",
    "email": "kemtay83@gmail.com",
    "status": "suspended"
  },
  {
    "name": "kimalot058",
    "role": "lecturer",
    "email": "kimalot058@gmail.com",
    "status": "suspended",
    "position": "TEACHING ASSISTANT"
  },
  {
    "name": "Simeon Rono",
    "role": "lecturer",
    "email": "kimursoysr@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Emmanuel Kipkirui",
    "role": "lecturer",
    "email": "kipkiruiemmanuel127@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Karen Morais",
    "role": "lecturer",
    "email": "kmomm1974@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Rev. Dr. Kurt Young",
    "role": "lecturer",
    "email": "kurtyoung107j@gmail.com",
    "status": "suspended"
  },
  {
    "name": "lawal5",
    "role": "lecturer",
    "email": "lawal5@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "lho.noruwana",
    "role": "lecturer",
    "email": "lho.noruwana@gmail.com",
    "status": "suspended"
  },
  {
    "name": "liendungu000",
    "role": "lecturer",
    "email": "liendungu000@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Katewu Martin",
    "role": "lecturer",
    "email": "m.kateuinvestor@gmail.com",
    "status": "suspended",
    "position": "Lecturer"
  },
  {
    "name": "magoloawuor",
    "role": "lecturer",
    "email": "magoloawuor@gmail.com",
    "status": "suspended"
  },
  {
    "name": "marrlambert16",
    "role": "lecturer",
    "email": "marrlambert16@gmail.com",
    "status": "suspended",
    "position": "HBIU Seminary Department of Divinity & Theology"
  },
  {
    "name": "Monicah Mugambi",
    "role": "lecturer",
    "email": "monicahmugambi5@gmail.com",
    "status": "suspended"
  },
  {
    "name": "MOFFAT MOSE",
    "role": "lecturer",
    "email": "mosemoffat93@gmail.com",
    "status": "suspended"
  },
  {
    "name": "mugambaian09",
    "role": "lecturer",
    "email": "mugambaian09@gmail.com",
    "status": "suspended"
  },
  {
    "name": "muindiboniface632",
    "role": "lecturer",
    "email": "muindiboniface632@gmail.com",
    "status": "suspended"
  },
  {
    "name": "munyolemuededgar",
    "role": "lecturer",
    "email": "munyolemuededgar@gmail.com",
    "status": "suspended"
  },
  {
    "name": "nabwire joan",
    "role": "lecturer",
    "email": "nabwirejoan2@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Olubunmi Olatunji",
    "role": "lecturer",
    "email": "nobleolu@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Nolwandle Made",
    "role": "lecturer",
    "email": "nolwandle.made@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Mpumelelo Ntetha",
    "role": "lecturer",
    "email": "ntethampumelelo@gmail.com",
    "status": "suspended",
    "position": "Lecture"
  },
  {
    "name": "ojemima",
    "role": "lecturer",
    "email": "ojemima@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "Olayinka Osho",
    "role": "lecturer",
    "email": "olayinkayodeosho@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Olanrewaju Omosehin",
    "role": "lecturer",
    "email": "omosehinolaniyi@gmail.com",
    "status": "suspended"
  },
  {
    "name": "osandele17",
    "role": "lecturer",
    "email": "osandele17@gmail.com",
    "status": "suspended",
    "position": "Lecturer"
  },
  {
    "name": "Oscar Osiro",
    "role": "lecturer",
    "email": "oscarosiro7@gmail.com",
    "status": "suspended",
    "position": "Instructor"
  },
  {
    "name": "Pacifique UKOK",
    "role": "lecturer",
    "email": "pacifiqueube@gmail.com",
    "status": "suspended",
    "position": "Lecturer"
  },
  {
    "name": "Prof. M. Fullwood Ph.D",
    "role": "lecturer",
    "email": "pastorfullwood@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Peggy Missoy",
    "role": "lecturer",
    "email": "peggymissoy@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Rev. Dr Martin Nyagah",
    "role": "lecturer",
    "email": "praisegracemessenger@gmail.com",
    "status": "suspended"
  },
  {
    "name": "praxedes.mutisya",
    "role": "lecturer",
    "email": "praxedes.mutisya@gmail.com",
    "status": "suspended",
    "position": "Coordinator West Africa and UK"
  },
  {
    "name": "previousguvamombe2",
    "role": "lecturer",
    "email": "previousguvamombe2@gmail.com",
    "status": "suspended"
  },
  {
    "name": "professor.jones.hbius",
    "role": "lecturer",
    "email": "professor.jones.hbius@gmail.com",
    "status": "suspended",
    "position": "HBIU Seminary Dept. of Divinity and Theology"
  },
  {
    "name": "propheticarmyo",
    "role": "lecturer",
    "email": "propheticarmyo@gmail.com",
    "status": "suspended"
  },
  {
    "name": "quincysoita",
    "role": "lecturer",
    "email": "quincysoita@gmail.com",
    "status": "suspended"
  },
  {
    "name": "raelmarks3",
    "role": "lecturer",
    "email": "raelmarks3@gmail.com",
    "status": "suspended",
    "position": "Lecturer"
  },
  {
    "name": "Dr. Richard Reeves",
    "role": "lecturer",
    "email": "res103st@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Fatmata Riquiray Sheriff",
    "role": "lecturer",
    "email": "riquirays@gmail.com",
    "status": "suspended"
  },
  {
    "name": "rmwangihbiuaddiction",
    "role": "lecturer",
    "email": "rmwangihbiuaddiction@gmail.com",
    "status": "suspended"
  },
  {
    "name": "rolando",
    "role": "lecturer",
    "email": "rolando@rolandofrancis.com",
    "status": "suspended"
  },
  {
    "name": "samuel mawanda",
    "role": "lecturer",
    "email": "samuelmawanda92@gmail.com",
    "status": "suspended"
  },
  {
    "name": "sanmi4globalvisibility26",
    "role": "lecturer",
    "email": "sanmi4globalvisibility26@gmail.com",
    "status": "suspended"
  },
  {
    "name": "stephenkiprutoteigut",
    "role": "lecturer",
    "email": "stephenkiprutoteigut@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Serunjogi Stephen",
    "role": "lecturer",
    "email": "stephenserunjogi93@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Sylvester Nzomo",
    "role": "lecturer",
    "email": "sylvesternzomo25@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Tebogo Sefufula",
    "role": "lecturer",
    "email": "tebogosefufula@gmail.com",
    "status": "suspended",
    "position": "Lecturer"
  },
  {
    "name": "Dr Terry Obijuru",
    "role": "lecturer",
    "email": "terryobijuru@gmail.com",
    "status": "suspended",
    "position": "Lecturer Chaplaincy/MBA"
  },
  {
    "name": "temitope David",
    "role": "lecturer",
    "email": "topolad347@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ukeme Sunday",
    "role": "lecturer",
    "email": "ukemevsn2020@gmail.com",
    "status": "suspended",
    "position": "Adjunct Lecturer"
  },
  {
    "name": "Umeadim Patricia Akanaziam",
    "role": "lecturer",
    "email": "umeadimpatricia1@gmail.com",
    "status": "suspended"
  },
  {
    "name": "unlimitedpower2003",
    "role": "lecturer",
    "email": "unlimitedpower2003@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Vice Chancellor",
    "role": "lecturer",
    "email": "vc@hbiu.org",
    "status": "suspended"
  },
  {
    "name": "victoriawanyana457",
    "role": "lecturer",
    "email": "victoriawanyana457@gmail.com",
    "status": "suspended"
  },
  {
    "name": "y.achevih",
    "role": "lecturer",
    "email": "y.achevih@gmail.com",
    "status": "suspended",
    "position": "Lecturer"
  },
  {
    "name": "Max Y",
    "role": "lecturer",
    "email": "youngimacs@gmail.com",
    "status": "suspended"
  }
];

const STUDENTS_DATA = [
  {
    "name": "03olamidevictor",
    "role": "student",
    "email": "03olamidevictor@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ahmed",
    "role": "student",
    "email": "076247964sons@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Samson Saba",
    "role": "student",
    "email": "1derfulglosam4christ@gmail.com",
    "status": "suspended"
  },
  {
    "name": "1trusaint",
    "role": "student",
    "email": "1trusaint@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Ademola Oluwafemi",
    "role": "student",
    "email": "4godfemi@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Akan Ekong",
    "role": "student",
    "email": "a.b.ekong@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "aaibor.m",
    "role": "student",
    "email": "aaibor.m@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Aaliya Adair",
    "role": "student",
    "email": "aaliyaadair@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Aaron",
    "role": "student",
    "email": "aaronmuduawulira@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "aayodeji01",
    "role": "student",
    "email": "aayodeji01@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "abahstephend",
    "role": "student",
    "email": "abahstephend@gmail.com",
    "status": "suspended"
  },
  {
    "name": "abahthankgod",
    "role": "student",
    "email": "abahthankgod@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ABANA ALI",
    "role": "student",
    "email": "abanaali@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Abasiekeme Bassey",
    "role": "student",
    "email": "abasiekemebassey016@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Bitrus Abba",
    "role": "student",
    "email": "abbabitrus566@gmail.com",
    "status": "suspended"
  },
  {
    "name": "abbeydchosen",
    "role": "student",
    "email": "abbeydchosen@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Guyo Abdi",
    "role": "student",
    "email": "abdiguyo09@gmail.com",
    "status": "suspended",
    "program": "BACHELOR OF ARTS IN THEOLOGY"
  },
  {
    "name": "abdulaievictory1",
    "role": "student",
    "email": "abdulaievictory1@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Abdullah Adebayo Salaty",
    "role": "student",
    "email": "abdullahadebayosalaty@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "abdulwasiuabdulguadir730",
    "role": "student",
    "email": "abdulwasiuabdulguadir730@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ABDULWASIU ABDULQUADIR",
    "role": "student",
    "email": "abdulwasiuabdulquadir730@gmail.com",
    "status": "suspended"
  },
  {
    "name": "abelmwinuka79",
    "role": "student",
    "email": "abelmwinuka79@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "abelsuleiman44",
    "role": "student",
    "email": "abelsuleiman44@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "abigael.maloba.10981",
    "role": "student",
    "email": "abigael.maloba.10981@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "abimbolake",
    "role": "student",
    "email": "abimbolake@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "abimbolaosagie3",
    "role": "student",
    "email": "abimbolaosagie3@gmail.com",
    "status": "suspended",
    "program": "Master of Public Administration (MPA) Minor Nonprofit & Faith-Based Leadership."
  },
  {
    "name": "abiodunaremu81",
    "role": "student",
    "email": "abiodunaremu81@gmail.com",
    "status": "suspended"
  },
  {
    "name": "abiodun ladani",
    "role": "student",
    "email": "abiodunladani93@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "abiodunoluwashakins",
    "role": "student",
    "email": "abiodunoluwashakins@outlook.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Ayomide Abiola",
    "role": "student",
    "email": "abiolaa315@gmail.com",
    "status": "suspended"
  },
  {
    "name": "abiolababalola19",
    "role": "student",
    "email": "abiolababalola19@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "abodunrininioluwa",
    "role": "student",
    "email": "abodunrininioluwa@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Aboki Ali",
    "role": "student",
    "email": "abokikanadi@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Alfred Abonge Tombe",
    "role": "student",
    "email": "abongetombe@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Abosi Chukwuka",
    "role": "student",
    "email": "abosichuks6@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "abrahamdebby7",
    "role": "student",
    "email": "abrahamdebby7@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "abrahamoladapo6",
    "role": "student",
    "email": "abrahamoladapo6@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Abraham Togbie",
    "role": "student",
    "email": "abrahamtogbiem@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Abubakri Aruna",
    "role": "student",
    "email": "abubakriaruna193@gmail.com",
    "status": "suspended"
  },
  {
    "name": "abuemmanuelinas",
    "role": "student",
    "email": "abuemmanuelinas@gmail.com",
    "status": "suspended",
    "program": "MASTERS"
  },
  {
    "name": "abugideon24",
    "role": "student",
    "email": "abugideon24@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "abujames1954",
    "role": "student",
    "email": "abujames1954@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Abu Kunle",
    "role": "student",
    "email": "abukunlesteve@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "Abunyanga Emmy",
    "role": "student",
    "email": "abunyangae@gmail.com",
    "status": "suspended",
    "program": "Bsc Of Science of Counseling Psychology"
  },
  {
    "name": "Emmy Abunyanga",
    "role": "student",
    "email": "abunyangaemma20@gmail.com",
    "status": "suspended",
    "program": "Master In Counseling Psychology And A Minor In Clinical Mental Health"
  },
  {
    "name": "Emmy A",
    "role": "student",
    "email": "abunyangaemy@gmail.com",
    "status": "suspended",
    "program": "BA. LAW"
  },
  {
    "name": "abuzaki393",
    "role": "student",
    "email": "abuzaki393@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Derrick Acheampong",
    "role": "student",
    "email": "acheampongderrick825@gmail.com",
    "status": "suspended"
  },
  {
    "name": "achimugu2002",
    "role": "student",
    "email": "achimugu2002@gmail.com",
    "status": "suspended",
    "program": "MSc. Organizational Leadership and Non Profit Administration"
  },
  {
    "name": "Oyeyemi Adetayo Damilare",
    "role": "student",
    "email": "ad.oyeyemi@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Princess Ceane",
    "role": "student",
    "email": "adaezeceane@gmail.com",
    "status": "suspended"
  },
  {
    "name": "adamaemmanuel1960",
    "role": "student",
    "email": "adamaemmanuel1960@gmail.com",
    "status": "suspended",
    "program": "Masters of Public Administration (MPA)"
  },
  {
    "name": "adamatejan486",
    "role": "student",
    "email": "adamatejan486@gmail.com",
    "status": "suspended"
  },
  {
    "name": "adamsdolapobamidele",
    "role": "student",
    "email": "adamsdolapobamidele@gmail.com",
    "status": "suspended",
    "program": "MASTER OF PUBLIC ADMINISTRATION (MPA), MINOR IN NON-PROFIT AND FAITH-BASED LEADERSHIP"
  },
  {
    "name": "adamshumphrey69",
    "role": "student",
    "email": "adamshumphrey69@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "adaobi.akabikejc05",
    "role": "student",
    "email": "adaobi.akabikejc05@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "adaolowo kenry",
    "role": "student",
    "email": "adaolowokenry123@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Darasimi Ademola",
    "role": "student",
    "email": "adarasimi03@gmail.com",
    "status": "suspended",
    "program": "Bachelor In Healthcare Administration-minor in health ministry"
  },
  {
    "name": "Ade Ayo",
    "role": "student",
    "email": "adeayomi895@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "adebabskay01",
    "role": "student",
    "email": "adebabskay01@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "adebajomayowa",
    "role": "student",
    "email": "adebajomayowa@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ADEBAYO Abel",
    "role": "student",
    "email": "adebayoabel073@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Abel Adebayo",
    "role": "student",
    "email": "adebayoabel76@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Abel Ifeoluwa ADEBAYO",
    "role": "student",
    "email": "adebayoabelifeoluwa@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ADEBAYO ADEYINKA OLUWASEYI",
    "role": "student",
    "email": "adebayoadeyinkaoluwaseyi@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Rita Adebayo",
    "role": "student",
    "email": "adebayorita76@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Adebayo Timilehin",
    "role": "student",
    "email": "adebayotimilehin222@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Adebayo timilehin",
    "role": "student",
    "email": "adebayotimilehin333@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Adebayo timilehin",
    "role": "student",
    "email": "adebayotimilehin777@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Adebola OSUNSAN",
    "role": "student",
    "email": "adebolaosunsan@gmail.com",
    "status": "suspended",
    "program": "MA - Organizational Leadership"
  },
  {
    "name": "Victor Adebola",
    "role": "student",
    "email": "adebolavictor533@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Adeboye Francis",
    "role": "student",
    "email": "adeboyefrancisi@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "adebusola.ojo-omoniyi",
    "role": "student",
    "email": "adebusola.ojo-omoniyi@fuoye.edu.ng",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "adedayo_olaniyi",
    "role": "student",
    "email": "adedayo_olaniyi@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "adedayoadeolumayowa1234",
    "role": "student",
    "email": "adedayoadeolumayowa1234@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Adedayo Yetunde",
    "role": "student",
    "email": "adedayoyetunde56@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Hammed Adedoyin",
    "role": "student",
    "email": "adedoyinhammed06@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "adeelara",
    "role": "student",
    "email": "adeelara@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Adefala Adeshola",
    "role": "student",
    "email": "adefalaadeshola2@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Adeforiti Temitope",
    "role": "student",
    "email": "adeforititemitope243@gmail.com",
    "status": "suspended"
  },
  {
    "name": "adefunkeolowo",
    "role": "student",
    "email": "adefunkeolowo@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ADEIFE RUTH",
    "role": "student",
    "email": "adeiferuth@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Adekanye Dare",
    "role": "student",
    "email": "adekanyedare85@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "adekanyeronke55",
    "role": "student",
    "email": "adekanyeronke55@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Sharon Adeka",
    "role": "student",
    "email": "adekasharon7@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Oluwaseun Adekeye",
    "role": "student",
    "email": "adekeyeo@run.edu.ng",
    "status": "suspended"
  },
  {
    "name": "adeksayoola91",
    "role": "student",
    "email": "adeksayoola91@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "adekunye9960",
    "role": "student",
    "email": "adekunye9960@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Abiodun Adelaja",
    "role": "student",
    "email": "adelajaabiodun24@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Adeleye. Olamilekan.",
    "role": "student",
    "email": "adeleyeolamilekan56@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Adelusi Kehinde",
    "role": "student",
    "email": "adelusik79@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ademideajala",
    "role": "student",
    "email": "ademideajala@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Adedoyin Ademo",
    "role": "student",
    "email": "ademoadedoyin96@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Adebowale Paul",
    "role": "student",
    "email": "ademolaadebowale405@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ademola Adebowale",
    "role": "student",
    "email": "ademolaadebowale5567@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Adeniyi Ademola",
    "role": "student",
    "email": "ademolaadeniyi90@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Ademola Emmanuel",
    "role": "student",
    "email": "ademolaemmanuel89@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Priscilla Ademola",
    "role": "student",
    "email": "ademolapriscillafemi@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Rebecca Ademola",
    "role": "student",
    "email": "ademolarebecca470@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "adenike.adeyefa",
    "role": "student",
    "email": "adenike.adeyefa@fuoye.edu.ng",
    "status": "suspended"
  },
  {
    "name": "adeniyimejabi037",
    "role": "student",
    "email": "adeniyimejabi037@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "adeola4mojisola",
    "role": "student",
    "email": "adeola4mojisola@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Oluwagbemisola Adeola",
    "role": "student",
    "email": "adeolaoluwagbemisola105@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Titus Isarinde",
    "role": "student",
    "email": "adeolutitus@gmail.com",
    "status": "suspended",
    "program": "MA strategic Leadership, minor in Christian leadership and Ethics"
  },
  {
    "name": "aderinoyeadetutu",
    "role": "student",
    "email": "aderinoyeadetutu@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Aderonke Bamidele",
    "role": "student",
    "email": "aderonkebamidele9@gmail.com",
    "status": "suspended",
    "program": "BA IN HEALTH ADMINISTRATION"
  },
  {
    "name": "adesanyaola",
    "role": "student",
    "email": "adesanyaola@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Adeshina adebayo",
    "role": "student",
    "email": "adeshinaadebayo2006@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Adesoro David",
    "role": "student",
    "email": "adesoroidowu@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "adesoyebukolamicheal95",
    "role": "student",
    "email": "adesoyebukolamicheal95@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "adetuneo",
    "role": "student",
    "email": "adetuneo@gmail.com",
    "status": "suspended",
    "program": "Master of Life Coaching, Minor in Faith-Based Counseling and Mentoring"
  },
  {
    "name": "adewunmiesther8698",
    "role": "student",
    "email": "adewunmiesther8698@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "adex2203",
    "role": "student",
    "email": "adex2203@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ADEYANJU SAMUEL",
    "role": "student",
    "email": "adeyanjusamuel435@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "adeyebola87",
    "role": "student",
    "email": "adeyebola87@gmail.com",
    "status": "suspended",
    "program": "Master's of Arts in Community Leadership,minor in Ministry Christian studies"
  },
  {
    "name": "adeyefadeborah92",
    "role": "student",
    "email": "adeyefadeborah92@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "adeyefae",
    "role": "student",
    "email": "adeyefae@gmail.com",
    "status": "suspended"
  },
  {
    "name": "adeyemibenjamin930",
    "role": "student",
    "email": "adeyemibenjamin930@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Adeyemi Esther",
    "role": "student",
    "email": "adeyemiesther488@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Emmanuel Oladapo Adeoye",
    "role": "student",
    "email": "adeyemimarcaus@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Adeyemi Muideen",
    "role": "student",
    "email": "adeyemimuideen576@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Adeyemi Oluwatoyin",
    "role": "student",
    "email": "adeyemioluwatoyin93@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ADEYEMI princess",
    "role": "student",
    "email": "adeyemiprincess46@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "adeyemiprincessinioluwa",
    "role": "student",
    "email": "adeyemiprincessinioluwa@gmail.com",
    "status": "suspended"
  },
  {
    "name": "adeyeyetimothy07",
    "role": "student",
    "email": "adeyeyetimothy07@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ade Yinka",
    "role": "student",
    "email": "adeyinka7182@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Adinga iliya Saleh",
    "role": "student",
    "email": "adingais2020@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Avril Dixon",
    "role": "student",
    "email": "adixon11077@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Dollian Atieno",
    "role": "student",
    "email": "adoerong@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Adokwu Joy",
    "role": "student",
    "email": "adokwujoy2020@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Angela Burke",
    "role": "student",
    "email": "adorablebyburke@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Oladeji Adubi",
    "role": "student",
    "email": "adubioladeji39@gmail.com",
    "status": "suspended"
  },
  {
    "name": "adzirajohnlamba12",
    "role": "student",
    "email": "adzirajohnlamba12@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Salamatu Afegbua",
    "role": "student",
    "email": "afegbuasalamatu@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "affiongdare70",
    "role": "student",
    "email": "affiongdare70@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Afolabi Adeusi",
    "role": "student",
    "email": "afolabiadeusi@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "DAMILOLA AFOLABI",
    "role": "student",
    "email": "afolabidamilolafaith@gmail.com",
    "status": "suspended"
  },
  {
    "name": "afolakemi Deborah Salako",
    "role": "student",
    "email": "afolakemideborahsalako@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Christianah Afolayan",
    "role": "student",
    "email": "afolayanchristianah3@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "JAMES MARK",
    "role": "student",
    "email": "agadamark53@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "agal Francis Amamma",
    "role": "student",
    "email": "agalipen@gmail.com",
    "status": "suspended"
  },
  {
    "name": "agbesusiolawumilolade",
    "role": "student",
    "email": "agbesusiolawumilolade@gmail.com",
    "status": "suspended"
  },
  {
    "name": "enuice agbo",
    "role": "student",
    "email": "agboenuice@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "OGBOGUN GRACE",
    "role": "student",
    "email": "agbogungrace8@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Agboola Rachel",
    "role": "student",
    "email": "agboolarachel77@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ageraldine506hbp",
    "role": "student",
    "email": "ageraldine506hbp@gmail.com",
    "status": "suspended",
    "program": "BA IN COUNSELLING AND PSYCHOLGY"
  },
  {
    "name": "agida.sunday",
    "role": "student",
    "email": "agida.sunday@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "agidasimon",
    "role": "student",
    "email": "agidasimon@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "agmcs2023",
    "role": "student",
    "email": "agmcs2023@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Agnes Colley",
    "role": "student",
    "email": "agnescolley5@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "agnesohiaba66",
    "role": "student",
    "email": "agnesohiaba66@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "NICODEMUS AGUMBA",
    "role": "student",
    "email": "agumbanick10@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "agunbiadebeloved7",
    "role": "student",
    "email": "agunbiadebeloved7@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ISAAC AGUNSOYE",
    "role": "student",
    "email": "agunsoyeisaac2021@gmail.com",
    "status": "suspended",
    "program": "MA in Organizational leadership Minor Christian Ethics"
  },
  {
    "name": "aguomba67",
    "role": "student",
    "email": "aguomba67@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Giggs Omondi",
    "role": "student",
    "email": "agwash001@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "aideyann",
    "role": "student",
    "email": "aideyann@yahoo.com",
    "status": "suspended",
    "program": "Doctorate"
  },
  {
    "name": "Dahrosa Aina",
    "role": "student",
    "email": "ainadaregodwin@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Aisha Ali",
    "role": "student",
    "email": "aishuaally06@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "aitchesonalicia",
    "role": "student",
    "email": "aitchesonalicia@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Monisola Aiyekusehin",
    "role": "student",
    "email": "aiyekusehinmonisola@gmail.com",
    "status": "suspended",
    "program": "BEHAVIOURAL HEALTH"
  },
  {
    "name": "Ansumana Jabbie",
    "role": "student",
    "email": "ajabbie520@gmail.com",
    "status": "suspended",
    "program": "BSc in Business Administration"
  },
  {
    "name": "aja bisong",
    "role": "student",
    "email": "ajabisong68@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Damilola AJAKAIYE",
    "role": "student",
    "email": "ajakaiyedammy@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ajalaracheal86",
    "role": "student",
    "email": "ajalaracheal86@gmail.com",
    "status": "suspended",
    "program": "Bachelor Of IT Support"
  },
  {
    "name": "ajalaruthsade",
    "role": "student",
    "email": "ajalaruthsade@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ajaoolanrewaju29",
    "role": "student",
    "email": "ajaoolanrewaju29@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ajao Olanrewaju Olasunkanmi",
    "role": "student",
    "email": "ajaoolanrewajuolasunkanmi@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ajayi Adeolu",
    "role": "student",
    "email": "ajas1080@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ajayi_oladele2000",
    "role": "student",
    "email": "ajayi_oladele2000@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Olajumoke Ajayi",
    "role": "student",
    "email": "ajayiolajumoke150@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ajay Reddy",
    "role": "student",
    "email": "ajayreddy5859@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ajesuorobo",
    "role": "student",
    "email": "ajesuorobo@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Dolapo AJIBADE",
    "role": "student",
    "email": "ajibadedolapo7@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ajibaderapheal3",
    "role": "student",
    "email": "ajibaderapheal3@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ajibaderaphealadelekan",
    "role": "student",
    "email": "ajibaderaphealadelekan@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Miracle Ajise",
    "role": "student",
    "email": "ajisemiracle1901@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ajit.ndabala",
    "role": "student",
    "email": "ajit.ndabala@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ajitndabala19",
    "role": "student",
    "email": "ajitndabala19@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ajitndabala",
    "role": "student",
    "email": "ajitndabala@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ajokeshaks",
    "role": "student",
    "email": "ajokeshaks@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "akachioma69",
    "role": "student",
    "email": "akachioma69@gmail.com",
    "status": "suspended"
  },
  {
    "name": "akanbiemmanuel859",
    "role": "student",
    "email": "akanbiemmanuel859@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "akanbitemitope923",
    "role": "student",
    "email": "akanbitemitope923@gmail.com",
    "status": "suspended"
  },
  {
    "name": "akapaluko",
    "role": "student",
    "email": "akapaluko@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "akenarobert567",
    "role": "student",
    "email": "akenarobert567@gmail.com",
    "status": "suspended"
  },
  {
    "name": "akenarobert993",
    "role": "student",
    "email": "akenarobert993@gmail.cm",
    "status": "suspended"
  },
  {
    "name": "akiikiapollomonday",
    "role": "student",
    "email": "akiikiapollomonday@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "akiikiapollomondaya",
    "role": "student",
    "email": "akiikiapollomondaya@gmail.com",
    "status": "suspended"
  },
  {
    "name": "akin5433",
    "role": "student",
    "email": "akin5433@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "AKINBILEJE ADESHINA",
    "role": "student",
    "email": "akinbileje.s@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Adeshina Akinbileje",
    "role": "student",
    "email": "akinbilejeadeshina@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Olawale Akindehinde",
    "role": "student",
    "email": "akindehindeolawale@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Akinlosotu Kehinde",
    "role": "student",
    "email": "akinlosotukehinde34@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Akinnola Hellen",
    "role": "student",
    "email": "akinnolahellen204@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Serifat Akinola",
    "role": "student",
    "email": "akinolaserifat0@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ABBEYPOSH 'SHAKIN",
    "role": "student",
    "email": "akinoluwashakin@gmail.com",
    "status": "suspended",
    "program": "Master's program"
  },
  {
    "name": "akintayooluwatobi01",
    "role": "student",
    "email": "akintayooluwatobi01@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "akintomideadekunle",
    "role": "student",
    "email": "akintomideadekunle@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Cynthia Akomba",
    "role": "student",
    "email": "akombacynthia97@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Akorede Fagbola",
    "role": "student",
    "email": "akoredefagbola4@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Ezekiel Akpan",
    "role": "student",
    "email": "akpanezekiel3@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "akpomchinyereamaka",
    "role": "student",
    "email": "akpomchinyereamaka@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Divine Akpudi",
    "role": "student",
    "email": "akpudidivine@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "akpudimiraclefegor",
    "role": "student",
    "email": "akpudimiraclefegor@gmail.com",
    "status": "suspended"
  },
  {
    "name": "akrofitheo",
    "role": "student",
    "email": "akrofitheo@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "akubasimon89",
    "role": "student",
    "email": "akubasimon89@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "akunnaifenyinwa86",
    "role": "student",
    "email": "akunnaifenyinwa86@gmail.com",
    "status": "suspended",
    "program": "Master's of Art in community leadership, minor in christian ministry studies"
  },
  {
    "name": "akunnaifeyinwa86",
    "role": "student",
    "email": "akunnaifeyinwa86@gmail.com",
    "status": "suspended"
  },
  {
    "name": "alajechinwe",
    "role": "student",
    "email": "alajechinwe@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Oluwadamilola Alalade",
    "role": "student",
    "email": "alaladedamilola1@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "alamufunmilayo31",
    "role": "student",
    "email": "alamufunmilayo31@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Alamu Ajibola",
    "role": "student",
    "email": "alamumuyiwa104@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ALANI KING",
    "role": "student",
    "email": "alankingfarmsenterprises@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Albert Fogbawa",
    "role": "student",
    "email": "albertfogbawa83@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "albertfogbawa9",
    "role": "student",
    "email": "albertfogbawa9@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "albertfogbawa",
    "role": "student",
    "email": "albertfogbawa@gmail.com",
    "status": "suspended"
  },
  {
    "name": "alegemary06",
    "role": "student",
    "email": "alegemary06@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "aleolanike28",
    "role": "student",
    "email": "aleolanike28@gmail.com",
    "status": "suspended"
  },
  {
    "name": "aleolanike57",
    "role": "student",
    "email": "aleolanike57@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Alexander Etibong Joseph",
    "role": "student",
    "email": "alexanderetibongjoseph@gmail.com",
    "status": "suspended",
    "program": "MASTERS OF PUBLIC ADMINISTRATION (MPA)"
  },
  {
    "name": "aleximoli",
    "role": "student",
    "email": "aleximoli@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "alexopeyemi51",
    "role": "student",
    "email": "alexopeyemi51@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Alex Egbele",
    "role": "student",
    "email": "alextujay2@gmail.com",
    "status": "suspended"
  },
  {
    "name": "alfredchemae",
    "role": "student",
    "email": "alfredchemae@gmail.com",
    "status": "suspended"
  },
  {
    "name": "alfredchemai",
    "role": "student",
    "email": "alfredchemai@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "Alfred E Koroma",
    "role": "student",
    "email": "alfredekoroma7@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Alfred Kebbie",
    "role": "student",
    "email": "alfredkebbie1@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "HASSAN TAIWO YUSSUF",
    "role": "student",
    "email": "alhasshan@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "aliadamu7",
    "role": "student",
    "email": "aliadamu7@gmail.com",
    "status": "suspended",
    "program": "Master Of Science In Organizational Leadership, Minor in Nonprofit Administration."
  },
  {
    "name": "alicezigwai",
    "role": "student",
    "email": "alicezigwai@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "aliciasandy20",
    "role": "student",
    "email": "aliciasandy20@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Osamudiamen Alile",
    "role": "student",
    "email": "alileosamudiamen@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Alimi michelle Aye",
    "role": "student",
    "email": "alimimichelleaye@gmail.com",
    "status": "suspended"
  },
  {
    "name": "alinyo5",
    "role": "student",
    "email": "alinyo5@gmail.com",
    "status": "suspended"
  },
  {
    "name": "alinyomoses98",
    "role": "student",
    "email": "alinyomoses98@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "TATU ALIVIzA",
    "role": "student",
    "email": "alivizatatu@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "aliyuidris03",
    "role": "student",
    "email": "aliyuidris03@gmail.com",
    "status": "suspended"
  },
  {
    "name": "alizwa lufezelo vedala",
    "role": "student",
    "email": "alizwavedala07@gmail.com",
    "status": "suspended"
  },
  {
    "name": "allieberrypitter1",
    "role": "student",
    "email": "allieberrypitter1@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "allieberrypitter2",
    "role": "student",
    "email": "allieberrypitter2@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "allisonshanisedekock",
    "role": "student",
    "email": "allisonshanisedekock@gmail.com",
    "status": "suspended"
  },
  {
    "name": "almannodongo045",
    "role": "student",
    "email": "almannodongo045@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Koffi Gakpe",
    "role": "student",
    "email": "almigthy2013@gmail.com",
    "status": "suspended",
    "program": "Doctorate"
  },
  {
    "name": "alobohenry",
    "role": "student",
    "email": "alobohenry@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "aloyidika",
    "role": "student",
    "email": "aloyidika@gmail.com",
    "status": "suspended",
    "program": "MSc Organizational Leadership Nonprofit Administration"
  },
  {
    "name": "aloysken987",
    "role": "student",
    "email": "aloysken987@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Alexsndra Olusola",
    "role": "student",
    "email": "alrxandraolusola@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "aluphelisomhaya20",
    "role": "student",
    "email": "aluphelisomhaya20@gmail.com",
    "status": "suspended"
  },
  {
    "name": "alusineconteh044",
    "role": "student",
    "email": "alusineconteh044@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "alvanstyles",
    "role": "student",
    "email": "alvanstyles@gmail.com",
    "status": "suspended",
    "program": "Master Degree"
  },
  {
    "name": "amaechiaugustine65",
    "role": "student",
    "email": "amaechiaugustine65@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Oyigbo Amaka",
    "role": "student",
    "email": "amakamailme@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "amammajames",
    "role": "student",
    "email": "amammajames@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "amandla mayambela",
    "role": "student",
    "email": "amandlamayambela9@gmail.com",
    "status": "suspended"
  },
  {
    "name": "amankiki09",
    "role": "student",
    "email": "amankiki09@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Amarachi orji eke",
    "role": "student",
    "email": "amarachiorjiekeudu@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Amara Ifeanyi",
    "role": "student",
    "email": "amarapenielpraise@gmail.com",
    "status": "suspended"
  },
  {
    "name": "amatosh13",
    "role": "student",
    "email": "amatosh13@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "FOLASHADE ALAMU",
    "role": "student",
    "email": "amazoncoop24@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "amblessed006",
    "role": "student",
    "email": "amblessed006@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ambrose4all",
    "role": "student",
    "email": "ambrose4all@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ameh3423",
    "role": "student",
    "email": "ameh3423@gmail.com",
    "status": "suspended"
  },
  {
    "name": "amehcornel",
    "role": "student",
    "email": "amehcornel@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ameh ignatius",
    "role": "student",
    "email": "amehignatius1@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Ooja Lovina Ameh",
    "role": "student",
    "email": "amehoojalovina@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Aminata Conteh",
    "role": "student",
    "email": "aminatahajaconteh01@gmail.com",
    "status": "suspended"
  },
  {
    "name": "aminatayabai2",
    "role": "student",
    "email": "aminatayabai2@gmail.com",
    "status": "suspended"
  },
  {
    "name": "aminatayabai4",
    "role": "student",
    "email": "aminatayabai4@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ammykwin82",
    "role": "student",
    "email": "ammykwin82@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "amoohema",
    "role": "student",
    "email": "amoohema@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "amosakande293",
    "role": "student",
    "email": "amosakande293@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Jane",
    "role": "student",
    "email": "amosjane2025@gmail.com",
    "status": "suspended"
  },
  {
    "name": "amos jane",
    "role": "student",
    "email": "amosjane25@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "amosreal_4u",
    "role": "student",
    "email": "amosreal_4u@yahoo.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ENIOLA ODEWUNMI",
    "role": "student",
    "email": "ampastoreni@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "John Amukoa",
    "role": "student",
    "email": "amukoajohn9@gmail.com",
    "status": "suspended",
    "program": "Bachelor in Marketing and Advertising"
  },
  {
    "name": "amy dan",
    "role": "student",
    "email": "amydansparky@gmail.com",
    "status": "suspended",
    "program": "Bachelor of science in Christian psychology"
  },
  {
    "name": "Anakebe Njideka",
    "role": "student",
    "email": "anakebenjideka@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "anawetapeter1",
    "role": "student",
    "email": "anawetapeter1@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "anciluv30",
    "role": "student",
    "email": "anciluv30@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "andenu danjuma",
    "role": "student",
    "email": "andenudanjuma@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "andenuhu69",
    "role": "student",
    "email": "andenuhu69@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Andereh Dacosta",
    "role": "student",
    "email": "anderehdacosta@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Augustine Dominion Anderson",
    "role": "student",
    "email": "andersonaugustine78@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ANDRONICUS ANDERSON BANGURA",
    "role": "student",
    "email": "andersonbangura3@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "andileshongwe",
    "role": "student",
    "email": "andileshongwe@yahoo.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Isaac Andrew Nagazi",
    "role": "student",
    "email": "andrewisaacpromise@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Andrew Livingstone",
    "role": "student",
    "email": "andrewlivingstone88@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "BANGURA ANDRONICUS ANDERSON",
    "role": "student",
    "email": "andronicusandersonbangura@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ijeoma Aneme",
    "role": "student",
    "email": "anemeijeoma98@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Anena Sharon",
    "role": "student",
    "email": "anenasharon03@gmail.com",
    "status": "suspended",
    "program": "Bachelor in public health (substance use),minor. Community service"
  },
  {
    "name": "anesiphomagidigidi92",
    "role": "student",
    "email": "anesiphomagidigidi92@gmail.com",
    "status": "suspended"
  },
  {
    "name": "anezwamafundityala72",
    "role": "student",
    "email": "anezwamafundityala72@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "angelivankanu",
    "role": "student",
    "email": "angelivankanu@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "aniefiokmacauley2",
    "role": "student",
    "email": "aniefiokmacauley2@gmail.com",
    "status": "suspended",
    "program": "MA in Human Resources"
  },
  {
    "name": "PROMISE CHINYERE",
    "role": "student",
    "email": "aniekwepromise@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ankaraataffordable",
    "role": "student",
    "email": "ankaraataffordable@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "annaoludokun",
    "role": "student",
    "email": "annaoludokun@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Annete Okumu",
    "role": "student",
    "email": "anneteokumu@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "annewabs7",
    "role": "student",
    "email": "annewabs7@gmail.com",
    "status": "suspended",
    "program": "Phamacy Technician CPhT"
  },
  {
    "name": "Anne Marie Jack",
    "role": "student",
    "email": "anneyj214@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ann Kiarie",
    "role": "student",
    "email": "annkay30@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Nisha Grant",
    "role": "student",
    "email": "anthonisag@gmail.com",
    "status": "suspended"
  },
  {
    "name": "anthonycorrea127",
    "role": "student",
    "email": "anthonycorrea127@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "anthonycorrea168",
    "role": "student",
    "email": "anthonycorrea168@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "anthonyjogili82",
    "role": "student",
    "email": "anthonyjogili82@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Anthony Junior",
    "role": "student",
    "email": "anthonyjun439@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "anuoluwapopelumi51",
    "role": "student",
    "email": "anuoluwapopelumi51@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "anyachi2001",
    "role": "student",
    "email": "anyachi2001@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Jonesvic",
    "role": "student",
    "email": "anyangvictor@gmail.com",
    "status": "suspended"
  },
  {
    "name": "anyebemark5",
    "role": "student",
    "email": "anyebemark5@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Rev Alfred Ong'era Ogamba",
    "role": "student",
    "email": "aongera38@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "aotreasure777",
    "role": "student",
    "email": "aotreasure777@gmail.com",
    "status": "suspended"
  },
  {
    "name": "APEH JOHN",
    "role": "student",
    "email": "apehjohnfrank7@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "apolomichael02",
    "role": "student",
    "email": "apolomichael02@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "apostephbiu",
    "role": "student",
    "email": "apostephbiu@gmail.com",
    "status": "suspended"
  },
  {
    "name": "apostephbiubarch",
    "role": "student",
    "email": "apostephbiubarch@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Appiah Edna",
    "role": "student",
    "email": "appiahedna20@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "appoloniaekeo3",
    "role": "student",
    "email": "appoloniaekeo3@gmail.com",
    "status": "suspended"
  },
  {
    "name": "araleeajao",
    "role": "student",
    "email": "araleeajao@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "arcbolconstruct",
    "role": "student",
    "email": "arcbolconstruct@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "arikawematthew",
    "role": "student",
    "email": "arikawematthew@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Aristos Sony Muyulenu",
    "role": "student",
    "email": "aristos.sm@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ariyonike731",
    "role": "student",
    "email": "ariyonike731@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Arminter McLaughlin",
    "role": "student",
    "email": "arminter1@gmail.com",
    "status": "suspended"
  },
  {
    "name": "armstrongolowosile351",
    "role": "student",
    "email": "armstrongolowosile351@gmail.com",
    "status": "suspended"
  },
  {
    "name": "arogbonlo precious",
    "role": "student",
    "email": "arogbonloprecious7@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Aron Mathias Kwandikwa",
    "role": "student",
    "email": "aronmkwandikwa@gmail.com",
    "status": "suspended"
  },
  {
    "name": "arowolo496",
    "role": "student",
    "email": "arowolo496@gmail.com",
    "status": "suspended"
  },
  {
    "name": "arowoloj496",
    "role": "student",
    "email": "arowoloj496@gmail.com",
    "status": "suspended",
    "program": "Bachelor in law and digital tech"
  },
  {
    "name": "Arphaxad Makau",
    "role": "student",
    "email": "arphaxadnduta@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Art {BA} in Chaplaincy"
  },
  {
    "name": "Junior Aryee",
    "role": "student",
    "email": "aryeejunior6@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "asabadoreen11",
    "role": "student",
    "email": "asabadoreen11@gmail.com",
    "status": "suspended",
    "program": "Certificate in Chaplaincy"
  },
  {
    "name": "asabeichaba",
    "role": "student",
    "email": "asabeichaba@gmail.com",
    "status": "suspended",
    "program": "BA Health Administration"
  },
  {
    "name": "asachayaabel",
    "role": "student",
    "email": "asachayaabel@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "asamameshack24",
    "role": "student",
    "email": "asamameshack24@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Doris Asamoah",
    "role": "student",
    "email": "asamoahdoris921@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Asaolu Adebola",
    "role": "student",
    "email": "asaoluadebola81@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Asemahle Boqwana",
    "role": "student",
    "email": "asemahleboqwana058@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Veronica Asenje",
    "role": "student",
    "email": "asenjeveronica@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "king David",
    "role": "student",
    "email": "ashaoludavid0311@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "christian ashiekaa",
    "role": "student",
    "email": "ashchristian01@gmail.com",
    "status": "suspended"
  },
  {
    "name": "asiago555",
    "role": "student",
    "email": "asiago555@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "asika onyinye",
    "role": "student",
    "email": "asika.onyinye@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Stephen Teigut",
    "role": "student",
    "email": "asisrono61@gmail.com",
    "status": "suspended"
  },
  {
    "name": "asisrono",
    "role": "student",
    "email": "asisrono@gmail.com",
    "status": "suspended"
  },
  {
    "name": "assay.nzera",
    "role": "student",
    "email": "assay.nzera@gmail.com",
    "status": "suspended"
  },
  {
    "name": "assumpta.nabisaso",
    "role": "student",
    "email": "assumpta.nabisaso@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "asuquowen",
    "role": "student",
    "email": "asuquowen@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "atebijemary2017",
    "role": "student",
    "email": "atebijemary2017@gmail.com",
    "status": "suspended"
  },
  {
    "name": "atembajudah",
    "role": "student",
    "email": "atembajudah@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "athulemajwede",
    "role": "student",
    "email": "athulemajwede@gmail.com",
    "status": "suspended"
  },
  {
    "name": "jenifer atieno",
    "role": "student",
    "email": "atienojenifer811@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Atieno Ochieng",
    "role": "student",
    "email": "atienoo671@gmail.com",
    "status": "suspended"
  },
  {
    "name": "atiloladorcas2002",
    "role": "student",
    "email": "atiloladorcas2002@gmail.com",
    "status": "suspended"
  },
  {
    "name": "atiloladorcas2019",
    "role": "student",
    "email": "atiloladorcas2019@gmail.com",
    "status": "suspended"
  },
  {
    "name": "atlanticpeolimited",
    "role": "student",
    "email": "atlanticpeolimited@gmail.com",
    "status": "suspended"
  },
  {
    "name": "atomo4winners",
    "role": "student",
    "email": "atomo4winners@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "atoned120",
    "role": "student",
    "email": "atoned120@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "attahevidence22",
    "role": "student",
    "email": "attahevidence22@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "atufeg",
    "role": "student",
    "email": "atufeg@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Atugonza Claire",
    "role": "student",
    "email": "atugonzaclaire47@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Goodness Atunde",
    "role": "student",
    "email": "atundeg@gmail.com",
    "status": "suspended",
    "program": "MA, Strategic Leadership"
  },
  {
    "name": "audubitrus28",
    "role": "student",
    "email": "audubitrus28@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Bitrus Audu",
    "role": "student",
    "email": "audubitrus28@unimaid.edu.ng",
    "status": "suspended"
  },
  {
    "name": "augustinaanigbogu",
    "role": "student",
    "email": "augustinaanigbogu@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "augustineekle4",
    "role": "student",
    "email": "augustineekle4@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "augustinevictorbassey",
    "role": "student",
    "email": "augustinevictorbassey@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "augustusmutisya60",
    "role": "student",
    "email": "augustusmutisya60@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "austineajeh",
    "role": "student",
    "email": "austineajeh@gmail.com",
    "status": "suspended"
  },
  {
    "name": "austinero2009",
    "role": "student",
    "email": "austinero2009@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "aviamutinda07",
    "role": "student",
    "email": "aviamutinda07@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "avindia4ever",
    "role": "student",
    "email": "avindia4ever@gmail.com",
    "status": "suspended"
  },
  {
    "name": "avongsj",
    "role": "student",
    "email": "avongsj@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "awabwile5",
    "role": "student",
    "email": "awabwile5@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "awecharity50",
    "role": "student",
    "email": "awecharity50@gmail.com",
    "status": "suspended"
  },
  {
    "name": "awecharity60",
    "role": "student",
    "email": "awecharity60@gmail.com",
    "status": "suspended",
    "program": "MASTER"
  },
  {
    "name": "awecharity",
    "role": "student",
    "email": "awecharity@gmail.com",
    "status": "suspended"
  },
  {
    "name": "awesolaronke",
    "role": "student",
    "email": "awesolaronke@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "awoleyekola",
    "role": "student",
    "email": "awoleyekola@gmail.com",
    "status": "suspended",
    "program": "Master of Art in Strategic Leadership"
  },
  {
    "name": "awosijipetero",
    "role": "student",
    "email": "awosijipetero@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Bukola Grace",
    "role": "student",
    "email": "ayandiranbukolagrace@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ayange88",
    "role": "student",
    "email": "ayange88@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Ayebameru Elizabeth",
    "role": "student",
    "email": "ayebameruelizabeth@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "aymaster001",
    "role": "student",
    "email": "aymaster001@gmail.com",
    "status": "suspended"
  },
  {
    "name": "aymaster80",
    "role": "student",
    "email": "aymaster80@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ayoaceolu",
    "role": "student",
    "email": "ayoaceolu@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Israel Aydeji",
    "role": "student",
    "email": "ayoademirael@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Ayobami Omole-Iyagin",
    "role": "student",
    "email": "ayobamiomoleiyagin@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ayobamiyemisi504",
    "role": "student",
    "email": "ayobamiyemisi504@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ayodeleakinkugbe",
    "role": "student",
    "email": "ayodeleakinkugbe@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ayodelebukola25",
    "role": "student",
    "email": "ayodelebukola25@gmail.com",
    "status": "suspended",
    "program": "MASTER"
  },
  {
    "name": "ayodeleogunlade24",
    "role": "student",
    "email": "ayodeleogunlade24@gmail.com",
    "status": "suspended",
    "program": "Master in Strategic Leadership , Minor in christian leadership and Ethics"
  },
  {
    "name": "Ayodele Okebule",
    "role": "student",
    "email": "ayodeleokebule@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Ayodele Odufoye",
    "role": "student",
    "email": "ayofolu1@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ayojames746",
    "role": "student",
    "email": "ayojames746@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Osho Ayokunle",
    "role": "student",
    "email": "ayokunleosho81@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Ayomide Opeyemi",
    "role": "student",
    "email": "ayomide375048@gmail.com",
    "status": "suspended",
    "program": "Certificate"
  },
  {
    "name": "Lawal ayomide",
    "role": "student",
    "email": "ayomidesystematic@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Ayo Olujobs",
    "role": "student",
    "email": "ayoolujobs@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ayplux99",
    "role": "student",
    "email": "ayplux99@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "AyubaEmmanuel Goje",
    "role": "student",
    "email": "ayubaemmanuelgoje@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Okonu Ayuba",
    "role": "student",
    "email": "ayubaokonu@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Perpetual Mmesomachi Azorji",
    "role": "student",
    "email": "azorjiperpetual021@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Bamiyo Akagwu",
    "role": "student",
    "email": "b.akagwu@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Joe Ihitegbulem",
    "role": "student",
    "email": "bababishopihitegbulem@gmail.com",
    "status": "suspended",
    "program": "Addiction Counseling"
  },
  {
    "name": "baba jatta",
    "role": "student",
    "email": "babajatta6@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "babalolafunmilayo08",
    "role": "student",
    "email": "babalolafunmilayo08@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Babalola Gbeminiyi",
    "role": "student",
    "email": "babalolagbeminiyi3@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Babalola Tolulope",
    "role": "student",
    "email": "babalolainioluwa549@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Robert Babalola",
    "role": "student",
    "email": "babalolar436@gmail.com",
    "status": "suspended"
  },
  {
    "name": "babalolatosin92",
    "role": "student",
    "email": "babalolatosin92@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "babalolatosin92",
    "role": "student",
    "email": "babalolatosin92@gmain.com",
    "status": "suspended"
  },
  {
    "name": "babalolatosin92",
    "role": "student",
    "email": "babalolatosin92@gmali.com",
    "status": "suspended"
  },
  {
    "name": "babatee0170",
    "role": "student",
    "email": "babatee0170@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "babatundeadewumi8",
    "role": "student",
    "email": "babatundeadewumi8@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "babatundekazeem112",
    "role": "student",
    "email": "babatundekazeem112@gmail.com",
    "status": "suspended"
  },
  {
    "name": "babatundekazeemabiodun01",
    "role": "student",
    "email": "babatundekazeemabiodun01@gmail.com",
    "status": "suspended"
  },
  {
    "name": "babatundekazeemabiodun02",
    "role": "student",
    "email": "babatundekazeemabiodun02@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "babatundeoluwatimilehin70",
    "role": "student",
    "email": "babatundeoluwatimilehin70@gmail.com",
    "status": "suspended"
  },
  {
    "name": "babawaleesther5",
    "role": "student",
    "email": "babawaleesther5@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Babirye Dorothy",
    "role": "student",
    "email": "babiryedorothyblessings@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "babsjudah01",
    "role": "student",
    "email": "babsjudah01@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "badottimoses21",
    "role": "student",
    "email": "badottimoses21@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Boluwatife Bae",
    "role": "student",
    "email": "baeboluwatife@gmail.com",
    "status": "suspended"
  },
  {
    "name": "bakkasimon22",
    "role": "student",
    "email": "bakkasimon22@gmail.com",
    "status": "suspended"
  },
  {
    "name": "prosper balat",
    "role": "student",
    "email": "balatprosper@gmail.com",
    "status": "suspended"
  },
  {
    "name": "baliya24",
    "role": "student",
    "email": "baliya24@yahoo.co.uk",
    "status": "suspended"
  },
  {
    "name": "balogunitunuibirogbayimika",
    "role": "student",
    "email": "balogunitunuibirogbayimika@gmail.com",
    "status": "suspended"
  },
  {
    "name": "baloguntee1",
    "role": "student",
    "email": "baloguntee1@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "bameh182",
    "role": "student",
    "email": "bameh182@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "bamidelegabrielo",
    "role": "student",
    "email": "bamidelegabrielo@gmail.com",
    "status": "suspended"
  },
  {
    "name": "bamideleiwajomo",
    "role": "student",
    "email": "bamideleiwajomo@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Bamiduro Funmilola",
    "role": "student",
    "email": "bamidurofunmilola122@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Bamigboye Olatunji Victor",
    "role": "student",
    "email": "bamigboyeolatunjivictor@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "banangfrancisca6",
    "role": "student",
    "email": "banangfrancisca6@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "bandaseilaneng",
    "role": "student",
    "email": "bandaseilaneng@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "banelemaseko",
    "role": "student",
    "email": "banelemaseko@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Bangura Anabella",
    "role": "student",
    "email": "banguraanabella76@gmail.com",
    "status": "suspended"
  },
  {
    "name": "OLADELE OYEBANJI AJAYI",
    "role": "student",
    "email": "banji5555@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Banji Lawal",
    "role": "student",
    "email": "banjilaw@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "Banoda Nzwaligwa",
    "role": "student",
    "email": "banodanzwa2019@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Barasa",
    "role": "student",
    "email": "barasa9016@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Reaghan Barasa",
    "role": "student",
    "email": "barasareaghan@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Barbie Marggie",
    "role": "student",
    "email": "barbiemarggie871@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Barth",
    "role": "student",
    "email": "barth.ohene24@gmail.com",
    "status": "suspended",
    "program": "Masters of Science in Leadership Development,Minor in Interfaith Studies"
  },
  {
    "name": "www.basilfm.com Basilfm",
    "role": "student",
    "email": "basilfm2006@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Basil - FM EKENOBI (Basilfm)",
    "role": "student",
    "email": "basilfm2016@gmail.com",
    "status": "suspended"
  },
  {
    "name": "bassey598",
    "role": "student",
    "email": "bassey598@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "bathy6xers",
    "role": "student",
    "email": "bathy6xers@gmail.com",
    "status": "suspended"
  },
  {
    "name": "baturesarki",
    "role": "student",
    "email": "baturesarki@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Wisdom l Beahboi",
    "role": "student",
    "email": "beahboiwisdoml@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "beatrice.wawuda",
    "role": "student",
    "email": "beatrice.wawuda@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Imaobong Etefia",
    "role": "student",
    "email": "beautifulhandsinitiative2023@gmail.com",
    "status": "suspended"
  },
  {
    "name": "beauty-4-ashes",
    "role": "student",
    "email": "beauty-4-ashes@live.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Rebecca Markson",
    "role": "student",
    "email": "beckymarkson42018@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Becky Markson",
    "role": "student",
    "email": "beckymarkson65@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "beckymosesann",
    "role": "student",
    "email": "beckymosesann@gmail.com",
    "status": "suspended",
    "program": "Master of Public Administration minor non profit and faith based leadership"
  },
  {
    "name": "beckyolive991",
    "role": "student",
    "email": "beckyolive991@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Princess Becky",
    "role": "student",
    "email": "beckyprincess05@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Omowunmi Rebecca",
    "role": "student",
    "email": "beckywoomie@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Bee Investment",
    "role": "student",
    "email": "beeinvestt@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Be Encouraged With Dania Official",
    "role": "student",
    "email": "beencouragedwithdaniaofficial@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Beloved Adebimpe",
    "role": "student",
    "email": "belovedadebimpe@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ben4real1776",
    "role": "student",
    "email": "ben4real1776@gmail.com",
    "status": "suspended",
    "program": "MSC. ORGANIZATIONAL LEADERSHIP, MINOR IN NONPROFIT ADMINISTRATION"
  },
  {
    "name": "Benard Gawona",
    "role": "student",
    "email": "benardgawona712@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "benchrisadaa",
    "role": "student",
    "email": "benchrisadaa@gmail.com",
    "status": "suspended"
  },
  {
    "name": "bendhuawa",
    "role": "student",
    "email": "bendhuawa@gmail.com",
    "status": "suspended"
  },
  {
    "name": "benduhawa",
    "role": "student",
    "email": "benduhawa@gmail.com",
    "status": "suspended"
  },
  {
    "name": "benedictamehj",
    "role": "student",
    "email": "benedictamehj@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "BENEDIN JEPCHIRCHIR YATOR",
    "role": "student",
    "email": "benedinjepchirchiryator@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Isaac Ben",
    "role": "student",
    "email": "beni19221@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Benita Mcfyne",
    "role": "student",
    "email": "benitaoby@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "BENJAMIN VONJO",
    "role": "student",
    "email": "benjamintepnvonjo@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "BENJAMIN JAMES SAMUEL",
    "role": "student",
    "email": "bensmart4ril@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ilabeshi Omotoye",
    "role": "student",
    "email": "beshitoye1@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Cafe",
    "role": "student",
    "email": "bestplancafe@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Elizabeth Osinaike",
    "role": "student",
    "email": "bettiemakay@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "beulah.highflyer",
    "role": "student",
    "email": "beulah.highflyer@gmail.com",
    "status": "suspended"
  },
  {
    "name": "BEYBEY LIVE",
    "role": "student",
    "email": "beybeylive@gmail.com",
    "status": "suspended"
  },
  {
    "name": "bhembemachawe61",
    "role": "student",
    "email": "bhembemachawe61@gmail.com",
    "status": "suspended",
    "program": "Bachelor in Supply Chain Management"
  },
  {
    "name": "Bheki Hlatshwayo",
    "role": "student",
    "email": "bhlatshwayo1109@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "bifesinachukwu",
    "role": "student",
    "email": "bifesinachukwu@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Science Organizational Leadership and Cultural Management"
  },
  {
    "name": "biggyvicky123",
    "role": "student",
    "email": "biggyvicky123@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "steve biko",
    "role": "student",
    "email": "bikosteve040@gmail.com",
    "status": "suspended"
  },
  {
    "name": "billykimono",
    "role": "student",
    "email": "billykimono@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Abimbola Olatunde",
    "role": "student",
    "email": "bimbbyade@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Abiola Adesola",
    "role": "student",
    "email": "biolar6@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Bisola Akinshulere",
    "role": "student",
    "email": "biosola97@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Bishop Apostle ihite",
    "role": "student",
    "email": "bishopapostleihite@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Florence Mbengei",
    "role": "student",
    "email": "bishopflorencembengei@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Bishop Samai",
    "role": "student",
    "email": "bishopsamai6@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Rashan Blackwood",
    "role": "student",
    "email": "blackwoodrashan1@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Blessing David",
    "role": "student",
    "email": "blesdav24@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Blessing Onome Onowieorowho",
    "role": "student",
    "email": "bless2ome@gmail.com",
    "status": "suspended"
  },
  {
    "name": "bless4abbey",
    "role": "student",
    "email": "bless4abbey@gmail.com",
    "status": "suspended"
  },
  {
    "name": "blessdav24",
    "role": "student",
    "email": "blessdav24@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Blessed Israel",
    "role": "student",
    "email": "blessedisrael806@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Blessing Ajibade",
    "role": "student",
    "email": "blessingajibade061@gmail.com",
    "status": "suspended"
  },
  {
    "name": "blessingamadianya",
    "role": "student",
    "email": "blessingamadianya@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Bidemi Blessing",
    "role": "student",
    "email": "blessingbidemi175@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Blessing Emayohan",
    "role": "student",
    "email": "blessingemayohan@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "blessingidetok",
    "role": "student",
    "email": "blessingidetok@gmail.com",
    "status": "suspended"
  },
  {
    "name": "blessingiribhogbe846",
    "role": "student",
    "email": "blessingiribhogbe846@gmail.com",
    "status": "suspended"
  },
  {
    "name": "blessing becks",
    "role": "student",
    "email": "blessingjbecks@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "blessingnwibebn09",
    "role": "student",
    "email": "blessingnwibebn09@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "blessingoaomosebi157",
    "role": "student",
    "email": "blessingoaomosebi157@gmail.com",
    "status": "suspended"
  },
  {
    "name": "blessingoaomosebi201",
    "role": "student",
    "email": "blessingoaomosebi201@gmail.com",
    "status": "suspended"
  },
  {
    "name": "blessingoaomosebi701",
    "role": "student",
    "email": "blessingoaomosebi701@gmail.com",
    "status": "suspended"
  },
  {
    "name": "blessingoaomosebi704",
    "role": "student",
    "email": "blessingoaomosebi704@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "blessingoaomosebi715",
    "role": "student",
    "email": "blessingoaomosebi715@gmail.com",
    "status": "suspended"
  },
  {
    "name": "blessjames69",
    "role": "student",
    "email": "blessjames69@gmail.com",
    "status": "suspended"
  },
  {
    "name": "blexyndimgba",
    "role": "student",
    "email": "blexyndimgba@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Blessed Daniel",
    "role": "student",
    "email": "blezzee4god@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Briana &ldquo;Gracefully Bree&rdquo;",
    "role": "student",
    "email": "blindodixon@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "blissfuldestiny10",
    "role": "student",
    "email": "blissfuldestiny10@gmail.com",
    "status": "suspended"
  },
  {
    "name": "boboceebobocee",
    "role": "student",
    "email": "boboceebobocee@yahoo.co.uk",
    "status": "suspended"
  },
  {
    "name": "Daniel Olabode Ajao",
    "role": "student",
    "email": "bodylornajao@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "BOLAJI-ADETORO FUNSHO",
    "role": "student",
    "email": "bolajiadetorofunsho@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "bolanlefolashayo2024",
    "role": "student",
    "email": "bolanlefolashayo2024@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "bolanlehelen03",
    "role": "student",
    "email": "bolanlehelen03@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "bolasuccessakpofure",
    "role": "student",
    "email": "bolasuccessakpofure@gmail.com",
    "status": "suspended"
  },
  {
    "name": "bolutopeolatunde",
    "role": "student",
    "email": "bolutopeolatunde@outlook.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Boluwatife Abiodun",
    "role": "student",
    "email": "boluwatifeabiodun719@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Bonginkosi Khanzi",
    "role": "student",
    "email": "bongskhanzi9@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "bonifacej094",
    "role": "student",
    "email": "bonifacej094@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "bonifacejb094",
    "role": "student",
    "email": "bonifacejb094@gmail.com",
    "status": "suspended",
    "program": "Bachelor IT"
  },
  {
    "name": "Ton bon",
    "role": "student",
    "email": "bonnykips.351@gmail.com",
    "status": "suspended"
  },
  {
    "name": "bonolobinomodise",
    "role": "student",
    "email": "bonolobinomodise@gmail.co",
    "status": "suspended"
  },
  {
    "name": "bonolobinomodise",
    "role": "student",
    "email": "bonolobinomodise@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "bontlej38",
    "role": "student",
    "email": "bontlej38@gmail.com",
    "status": "suspended",
    "program": "PhD in Marriage & Family Therapy"
  },
  {
    "name": "bontlej49",
    "role": "student",
    "email": "bontlej49@gmail.com",
    "status": "suspended",
    "program": "PhD in Public Leadership & Administration, minor in Christian Ethics"
  },
  {
    "name": "born2rule4tommy",
    "role": "student",
    "email": "born2rule4tommy@gmail.com",
    "status": "suspended"
  },
  {
    "name": "CINDY MAUREEN",
    "role": "student",
    "email": "borntosinggiants@gmail.com",
    "status": "suspended"
  },
  {
    "name": "boscoabana",
    "role": "student",
    "email": "boscoabana@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "bosedeadekunlee",
    "role": "student",
    "email": "bosedeadekunlee@gmail.com",
    "status": "suspended"
  },
  {
    "name": "boujeebarbiee",
    "role": "student",
    "email": "boujeebarbiee@icloud.com",
    "status": "suspended"
  },
  {
    "name": "Kwekwe Boy",
    "role": "student",
    "email": "boykwekwe612@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Divine Braide",
    "role": "student",
    "email": "braidedivine15@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "bravesailor6g",
    "role": "student",
    "email": "bravesailor6g@gmail.com",
    "status": "suspended",
    "program": "Bachelor IT SUPPORT"
  },
  {
    "name": "Brenda Koroma",
    "role": "student",
    "email": "brendakoromay@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Briana Lindo-Dixon",
    "role": "student",
    "email": "brianalindo24@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "brightchimezie2000",
    "role": "student",
    "email": "brightchimezie2000@gmail.com",
    "status": "suspended",
    "program": "MASTER"
  },
  {
    "name": "brima077koroma",
    "role": "student",
    "email": "brima077koroma@gmail.com",
    "status": "suspended"
  },
  {
    "name": "brima77koroma",
    "role": "student",
    "email": "brima77koroma@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Brima Koroma",
    "role": "student",
    "email": "brimakoroma067@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "BRIMA Koroma",
    "role": "student",
    "email": "brimakoroma47@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Britni Henderson",
    "role": "student",
    "email": "britnihenderson38@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "britus2010",
    "role": "student",
    "email": "britus2010@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Brooks Tommie",
    "role": "student",
    "email": "brookstommie061@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Sunday Abah",
    "role": "student",
    "email": "brooktriumph@gmail.com",
    "status": "suspended"
  },
  {
    "name": "broswillie",
    "role": "student",
    "email": "broswillie@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Jada Brown",
    "role": "student",
    "email": "brownjada804@gmail.com",
    "status": "suspended"
  },
  {
    "name": "BruceLizwi Dinwayo",
    "role": "student",
    "email": "brucelizwi1@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Bruce Dinwayo",
    "role": "student",
    "email": "brucelizwi2@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Boniface Tuggen",
    "role": "student",
    "email": "btuggen@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "bukola.ibinaiye",
    "role": "student",
    "email": "bukola.ibinaiye@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "bukola fatola",
    "role": "student",
    "email": "bukolafatola10@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "bukolaolowosile2026",
    "role": "student",
    "email": "bukolaolowosile2026@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Bulelwa Mahashi",
    "role": "student",
    "email": "bulelwamahashi24@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Buoye Racheal",
    "role": "student",
    "email": "buoyeracheal2002@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Busisiwe Buhle",
    "role": "student",
    "email": "busisiwebuhle903@gmail.com",
    "status": "suspended",
    "program": "Bachelor of business administration"
  },
  {
    "name": "Buzy Brain",
    "role": "student",
    "email": "buzybrain190@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "mwanje caleb",
    "role": "student",
    "email": "calebmwanje@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Caleb Ngetich",
    "role": "student",
    "email": "calebngetich82@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Caleb Odusolu",
    "role": "student",
    "email": "calebodusolu@gmail.com",
    "status": "suspended"
  },
  {
    "name": "caleboyegoke",
    "role": "student",
    "email": "caleboyegoke@gmail.com",
    "status": "suspended"
  },
  {
    "name": "caleboyegokeomoloye",
    "role": "student",
    "email": "caleboyegokeomoloye@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "calvinnamanga46",
    "role": "student",
    "email": "calvinnamanga46@gmail.com",
    "status": "suspended",
    "program": "BSC in Public Health"
  },
  {
    "name": "Austine Chapfika",
    "role": "student",
    "email": "capebyfaith@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Carol Faro",
    "role": "student",
    "email": "carolfaro4@gmail.com",
    "status": "suspended"
  },
  {
    "name": "casmirosita986",
    "role": "student",
    "email": "casmirosita986@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Cassidy Abrahams",
    "role": "student",
    "email": "cassidyabrahams9@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "cassth3ghost69",
    "role": "student",
    "email": "cassth3ghost69@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "catengambi",
    "role": "student",
    "email": "catengambi@gmail.com",
    "status": "suspended"
  },
  {
    "name": "catherinemusa000",
    "role": "student",
    "email": "catherinemusa000@gmail.com",
    "status": "suspended"
  },
  {
    "name": "catoloye",
    "role": "student",
    "email": "catoloye@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ccem",
    "role": "student",
    "email": "ccem@manzinicity.co.sz",
    "status": "suspended"
  },
  {
    "name": "Christian Chinasa",
    "role": "student",
    "email": "cchinasa803@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Asteroid Ccole",
    "role": "student",
    "email": "ccoleasteroid@gmail.com",
    "status": "suspended"
  },
  {
    "name": "cecilia.kamuri",
    "role": "student",
    "email": "cecilia.kamuri@gmail.com",
    "status": "suspended",
    "program": "Master in Christian Counselling and Psychology"
  },
  {
    "name": "Ogunlusi Cecilia",
    "role": "student",
    "email": "ceciliacecidy@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Cecilia Diana Demby",
    "role": "student",
    "email": "ceciliadianademby123@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ceciliasquire0",
    "role": "student",
    "email": "ceciliasquire0@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ceciliasquire",
    "role": "student",
    "email": "ceciliasquire@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Cedrick Shisia",
    "role": "student",
    "email": "cedricshisia@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ceejaydigitals",
    "role": "student",
    "email": "ceejaydigitals@gmail.com",
    "status": "suspended"
  },
  {
    "name": "chabadaniel",
    "role": "student",
    "email": "chabadaniel@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "chabahelen26",
    "role": "student",
    "email": "chabahelen26@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Shamar Channer",
    "role": "student",
    "email": "channershamar9@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "charityameh",
    "role": "student",
    "email": "charityameh@ymail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "charitydele",
    "role": "student",
    "email": "charitydele@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Charity Mwende",
    "role": "student",
    "email": "charitymwende1972@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "charityoluchi9",
    "role": "student",
    "email": "charityoluchi9@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "charleslemayiankoikai",
    "role": "student",
    "email": "charleslemayiankoikai@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Ofikwu Charles",
    "role": "student",
    "email": "charlesofikwu@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Charles Osakwe",
    "role": "student",
    "email": "charlesosakwe02@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "CHARLES OSAKWE",
    "role": "student",
    "email": "charlesosakwe2000@gmail.com",
    "status": "suspended"
  },
  {
    "name": "charles osakwe",
    "role": "student",
    "email": "charlesosakwe@gmail.com",
    "status": "suspended",
    "program": "Certificate"
  },
  {
    "name": "CHARLES SABI",
    "role": "student",
    "email": "charlessabi13@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Charles Totyen Kwaprep",
    "role": "student",
    "email": "charlestotyen@gmail.com",
    "status": "suspended",
    "program": "MASTER OF ARTS IN COMMUNITY LEADERSHIP"
  },
  {
    "name": "charletteschool55",
    "role": "student",
    "email": "charletteschool55@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Cheddah tha Plug",
    "role": "student",
    "email": "cheddahmsutfu23@gmail.com",
    "status": "suspended"
  },
  {
    "name": "cheffoundation2012",
    "role": "student",
    "email": "cheffoundation2012@gmail.com",
    "status": "suspended"
  },
  {
    "name": "chegopk100",
    "role": "student",
    "email": "chegopk100@gmail.com",
    "status": "suspended",
    "program": "Christian leadership and cultural management"
  },
  {
    "name": "Nahashon Mutai",
    "role": "student",
    "email": "chelilisnahashon@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Dolvin Chepkemoi",
    "role": "student",
    "email": "chepkemoidolvin@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "chepkorirbrenda003",
    "role": "student",
    "email": "chepkorirbrenda003@gmail.com",
    "status": "suspended"
  },
  {
    "name": "MICHELLE CHEPKWONY",
    "role": "student",
    "email": "chepkwony.cheruto@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "Cherish Oma",
    "role": "student",
    "email": "cherishoma69@gmail.com",
    "status": "suspended"
  },
  {
    "name": "cherutichpatrick46",
    "role": "student",
    "email": "cherutichpatrick46@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Mzukisi Tyolweni",
    "role": "student",
    "email": "chesstix@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "chesstix",
    "role": "student",
    "email": "chesstix@live.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "chinelo igboanusi",
    "role": "student",
    "email": "chi4igoanusi@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Chibuzo Nwachukwu",
    "role": "student",
    "email": "chibuzonwachukwu378@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Chibuzor Marcus",
    "role": "student",
    "email": "chibuzormarcus8@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "chiderayerowho",
    "role": "student",
    "email": "chiderayerowho@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Chidera Yerowho Ekpudi",
    "role": "student",
    "email": "chiderayerowhoekpudi@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Chidi izuazu (Major)",
    "role": "student",
    "email": "chidiizuazu4@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Chidimma Joy Agbogu",
    "role": "student",
    "email": "chidimmaj18@gmail.com",
    "status": "suspended",
    "program": "Bachelor of science Christian counseling & psychology,minor in clinical mental health counseling"
  },
  {
    "name": "Chidinma Joy Madumere",
    "role": "student",
    "email": "chidinmajoymadumere@gmail.com",
    "status": "suspended"
  },
  {
    "name": "chidinmamadumere24",
    "role": "student",
    "email": "chidinmamadumere24@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Chief Joseph cell Kamara",
    "role": "student",
    "email": "chiefjosephcellkamara@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Science in Christian Counseling & Psychology, Minor in Clinical Mental Health Counseling"
  },
  {
    "name": "Chiemezuo Temple",
    "role": "student",
    "email": "chiemezuotemple3@gmail.com",
    "status": "suspended"
  },
  {
    "name": "RUTH Braide",
    "role": "student",
    "email": "chilobb22@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "chimaesthert",
    "role": "student",
    "email": "chimaesthert@gmail.com",
    "status": "suspended"
  },
  {
    "name": "chimerem1",
    "role": "student",
    "email": "chimerem1@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Chimere Chigbo",
    "role": "student",
    "email": "chimerem74@gmail.com",
    "status": "suspended"
  },
  {
    "name": "chinecheremonyive",
    "role": "student",
    "email": "chinecheremonyive@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Chinelo Igboanusi",
    "role": "student",
    "email": "chineloigboanusi17@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "chinemeremhopeproject",
    "role": "student",
    "email": "chinemeremhopeproject@gmail.com",
    "status": "suspended",
    "program": "Clinical mental health and counselling"
  },
  {
    "name": "Daniel Chinemeze",
    "role": "student",
    "email": "chinemezedaniel78@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "chinnyprecious2205",
    "role": "student",
    "email": "chinnyprecious2205@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Chinonso Nwabueze",
    "role": "student",
    "email": "chinonsogis@gmail.com",
    "status": "suspended"
  },
  {
    "name": "chinweobi udechukwu",
    "role": "student",
    "email": "chinweobiudechukwu@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Chinyere Mary",
    "role": "student",
    "email": "chinyeremary087@gmail.com",
    "status": "suspended",
    "program": "Bachelor in Healthcare Administration"
  },
  {
    "name": "Chinyere Obiakor",
    "role": "student",
    "email": "chinyereobiakor@gmail.com",
    "status": "suspended"
  },
  {
    "name": "chiomajenniferu",
    "role": "student",
    "email": "chiomajenniferu@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "chirellajm",
    "role": "student",
    "email": "chirellajm@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "chirellajm",
    "role": "student",
    "email": "chirellajm@gmail.xom",
    "status": "suspended"
  },
  {
    "name": "chisolum71",
    "role": "student",
    "email": "chisolum71@gmail.com",
    "status": "suspended"
  },
  {
    "name": "chisolum85",
    "role": "student",
    "email": "chisolum85@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Chris K",
    "role": "student",
    "email": "chrisktivity@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Christabel Markson",
    "role": "student",
    "email": "christabelmarkson74@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Christanne Mayaka",
    "role": "student",
    "email": "christannemayaka@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Ashiekaa Christian",
    "role": "student",
    "email": "christash651@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Christiana Kadiatu Josiah",
    "role": "student",
    "email": "christianajosiah005@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Christine Akot",
    "role": "student",
    "email": "christineakot92@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Christopher Omondi",
    "role": "student",
    "email": "christopheromondi429@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Christopher Paul dollah",
    "role": "student",
    "email": "christopherpauldollah@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Christopher Ali",
    "role": "student",
    "email": "christophersimon06@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "christyaudu071",
    "role": "student",
    "email": "christyaudu071@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "christyene60",
    "role": "student",
    "email": "christyene60@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "chukwuchinelo90",
    "role": "student",
    "email": "chukwuchinelo90@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Excel Chukwunwem",
    "role": "student",
    "email": "chukwunwemexcel@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "cintawest",
    "role": "student",
    "email": "cintawest@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Uzoma Ezeji",
    "role": "student",
    "email": "cjnoblecj74@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "CHARLES KATABI",
    "role": "student",
    "email": "ckatabi@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ckatabulawo",
    "role": "student",
    "email": "ckatabulawo@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "clarence okere",
    "role": "student",
    "email": "clarenceokere7@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "Cledia Kakwat",
    "role": "student",
    "email": "clekakwat@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Gbenga Afolayan",
    "role": "student",
    "email": "clemency82@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Clement Akonor",
    "role": "student",
    "email": "clementakonor75@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Ayibapreye Cleopas",
    "role": "student",
    "email": "cleopasayibapreye@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "clintonnicklaus",
    "role": "student",
    "email": "clintonnicklaus@gmail.com",
    "status": "suspended",
    "program": "Bachelor of science christian counselling & psychology ,minor in clinical mental health counselling"
  },
  {
    "name": "MAGEZI CHRIS",
    "role": "student",
    "email": "cmagezi50@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "cmukewa2000",
    "role": "student",
    "email": "cmukewa2000@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "coachuwah74",
    "role": "student",
    "email": "coachuwah74@gmail.com",
    "status": "suspended"
  },
  {
    "name": "coachuwahcy",
    "role": "student",
    "email": "coachuwahcy@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Gift _collins",
    "role": "student",
    "email": "collinsgift009@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Comfort Buckey",
    "role": "student",
    "email": "comfortbuckey@gmail.com",
    "status": "suspended"
  },
  {
    "name": "comfortdavidc",
    "role": "student",
    "email": "comfortdavidc@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "comforteradeola",
    "role": "student",
    "email": "comforteradeola@gmail.com",
    "status": "suspended",
    "program": "Master of Science in Organizational Leadership , Minor in Christian ethics"
  },
  {
    "name": "Comfort Jeje",
    "role": "student",
    "email": "comfortjejeolu@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Comfort Jesutofunmi",
    "role": "student",
    "email": "comfortjesutofunmi59@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "owosangba omoyemi",
    "role": "student",
    "email": "comfreal01@gmail.com",
    "status": "suspended"
  },
  {
    "name": "COMFORT ESSIEN",
    "role": "student",
    "email": "commy4reallife@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "compete4real",
    "role": "student",
    "email": "compete4real@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "competeventures",
    "role": "student",
    "email": "competeventures@gmail.com",
    "status": "suspended"
  },
  {
    "name": "conceptng",
    "role": "student",
    "email": "conceptng@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "conciergeearth",
    "role": "student",
    "email": "conciergeearth@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "contehpatricia0",
    "role": "student",
    "email": "contehpatricia0@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Patricia Conteh",
    "role": "student",
    "email": "contehpatricia978@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "coopdev.erapu",
    "role": "student",
    "email": "coopdev.erapu@gmail.com",
    "status": "suspended"
  },
  {
    "name": "creativeyemi09",
    "role": "student",
    "email": "creativeyemi09@gmail.com",
    "status": "suspended"
  },
  {
    "name": "cutekaay247",
    "role": "student",
    "email": "cutekaay247@gmail.com",
    "status": "suspended",
    "program": "MA in Clinical Mental Health Counseling (Addiction Track) Minor: Faith-Based Trauma-Informed Care"
  },
  {
    "name": "CYNTHIA ORENG",
    "role": "student",
    "email": "cynthiaoreng@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Kokoh Cynthia",
    "role": "student",
    "email": "cynthiapkokoh77f@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "cyprian nyamori",
    "role": "student",
    "email": "cypriannyamori282@gmail.com",
    "status": "suspended"
  },
  {
    "name": "cypriansimon42",
    "role": "student",
    "email": "cypriansimon42@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "seth dacha",
    "role": "student",
    "email": "dachaseth@gmail.com",
    "status": "suspended"
  },
  {
    "name": "daisylove1044",
    "role": "student",
    "email": "daisylove1044@gmail.com",
    "status": "suspended"
  },
  {
    "name": "daktariojwang",
    "role": "student",
    "email": "daktariojwang@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "damianemmanuel427",
    "role": "student",
    "email": "damianemmanuel427@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Damilola Abolaji",
    "role": "student",
    "email": "damichris200@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "damilarealewi1",
    "role": "student",
    "email": "damilarealewi1@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Damilola Adenuga",
    "role": "student",
    "email": "damilola.adenuga@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Arts in Theology"
  },
  {
    "name": "damiloladairo1990",
    "role": "student",
    "email": "damiloladairo1990@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Damilola Omolara",
    "role": "student",
    "email": "damilolaomolara37@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "damilolawumi",
    "role": "student",
    "email": "damilolawumi@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "Damaris Philip",
    "role": "student",
    "email": "dammiphils@gmail.com",
    "status": "suspended"
  },
  {
    "name": "dammyjoy22",
    "role": "student",
    "email": "dammyjoy22@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "damuelconvenant",
    "role": "student",
    "email": "damuelconvenant@gmail.com",
    "status": "suspended"
  },
  {
    "name": "danabah23",
    "role": "student",
    "email": "danabah23@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "danefeworld",
    "role": "student",
    "email": "danefeworld@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Danieka Williams",
    "role": "student",
    "email": "daneikaratty32@gmail.com",
    "status": "suspended",
    "program": "Bachelor in Education"
  },
  {
    "name": "Dania Williams",
    "role": "student",
    "email": "dania.kwilliams@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Dania Williams",
    "role": "student",
    "email": "daniabrwwilliams56@gmail.com",
    "status": "suspended"
  },
  {
    "name": "dania williams",
    "role": "student",
    "email": "daniakemishawilliams@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "daniel.abah",
    "role": "student",
    "email": "daniel.abah@uam.edu.ng",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "daniel.wangili.edu",
    "role": "student",
    "email": "daniel.wangili.edu@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "danielboima78",
    "role": "student",
    "email": "danielboima78@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Daniel Eyakenobong",
    "role": "student",
    "email": "danieleyakenobong@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Daniel momoh Songa",
    "role": "student",
    "email": "danielmomohsonga112@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Daniel Mwendwa",
    "role": "student",
    "email": "danielmwendwarev@gmail.com",
    "status": "suspended",
    "program": "Doctorate"
  },
  {
    "name": "danieloliverboima",
    "role": "student",
    "email": "danieloliverboima@3gmail.com",
    "status": "suspended"
  },
  {
    "name": "Daniel Segun",
    "role": "student",
    "email": "danielsegun818@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Daniel Tamba",
    "role": "student",
    "email": "danieltamba2022@gmail.com",
    "status": "suspended",
    "program": "MPA in Public Administration"
  },
  {
    "name": "ayuba danladi",
    "role": "student",
    "email": "danladiayuba74@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "danmajor25",
    "role": "student",
    "email": "danmajor25@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Daniel Musilu",
    "role": "student",
    "email": "danmmusilu@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Dan Mputhia",
    "role": "student",
    "email": "danmu3000@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "dansalomministry",
    "role": "student",
    "email": "dansalomministry@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Dan Theman",
    "role": "student",
    "email": "danthemanonemillion@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "danudo1010",
    "role": "student",
    "email": "danudo1010@yahoo.com",
    "status": "suspended",
    "program": "Masters in Arts Organizational Leadership and Christian Ethics"
  },
  {
    "name": "dareolatunji123",
    "role": "student",
    "email": "dareolatunji123@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "darrel boye",
    "role": "student",
    "email": "darrelboye@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Dauda Mohammed",
    "role": "student",
    "email": "daudabalamohammed1@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "daudabalamohammed",
    "role": "student",
    "email": "daudabalamohammed@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "John Dauda",
    "role": "student",
    "email": "daudajey@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Dave Ifeason",
    "role": "student",
    "email": "david.ifeagbason@gmail.com",
    "status": "suspended"
  },
  {
    "name": "davidabisola2",
    "role": "student",
    "email": "davidabisola2@gmail.com",
    "status": "suspended"
  },
  {
    "name": "DAVID AKOGWU",
    "role": "student",
    "email": "davidakogwu7000@gmail.com",
    "status": "suspended"
  },
  {
    "name": "David Amusavi",
    "role": "student",
    "email": "davidamsavi086@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Aptot David",
    "role": "student",
    "email": "davidaptot@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "David Ayomide Oluwadayisi",
    "role": "student",
    "email": "davidayomideoluwadayisi@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "davidelijah900",
    "role": "student",
    "email": "davidelijah900@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "David Gborie",
    "role": "student",
    "email": "davidgborie2000@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "DAVID MURUKA",
    "role": "student",
    "email": "davidmuruka@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "davidmwasa0",
    "role": "student",
    "email": "davidmwasa0@gmail.com",
    "status": "suspended",
    "program": "ASc/BA in Business Administration/Management (BA in AGRIBUSINESS)"
  },
  {
    "name": "davidndichumburu96",
    "role": "student",
    "email": "davidndichumburu96@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "davidnnabue",
    "role": "student",
    "email": "davidnnabue@gmail.com",
    "status": "suspended"
  },
  {
    "name": "David Nzuka",
    "role": "student",
    "email": "davidnzuka2023@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "David Omoti",
    "role": "student",
    "email": "davidomoti26@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "David Patience",
    "role": "student",
    "email": "davidpatience931@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Davidson Chris Caulker",
    "role": "student",
    "email": "davidsonchriscaulker94@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Agribusiness"
  },
  {
    "name": "Davidson C. Caulker",
    "role": "student",
    "email": "davidsonchriscaulker@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Prince David Adetona",
    "role": "student",
    "email": "davisadetona@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Davis Oche Abba",
    "role": "student",
    "email": "davisdavayne@gmail.com",
    "status": "suspended"
  },
  {
    "name": "DB-FINANCE",
    "role": "student",
    "email": "dbfinance200@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "dcoco3263",
    "role": "student",
    "email": "dcoco3263@gmail.com",
    "status": "suspended"
  },
  {
    "name": "David Cocobassey",
    "role": "student",
    "email": "dcocobassey@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "David conteh",
    "role": "student",
    "email": "dconteh98@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ddarreytobby4milan",
    "role": "student",
    "email": "ddarreytobby4milan@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "lahai delight daniella",
    "role": "student",
    "email": "ddlahai2002@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ogundana Deborah",
    "role": "student",
    "email": "debby4jesus14@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "DEBBY AFOLABI",
    "role": "student",
    "email": "debbyafolabi28@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Deborah Fadeyi",
    "role": "student",
    "email": "debbyfad4@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "deborahadeyemi310",
    "role": "student",
    "email": "deborahadeyemi310@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "deboraholuwapelumi283",
    "role": "student",
    "email": "deboraholuwapelumi283@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Deborah Onyekwelu",
    "role": "student",
    "email": "deborahonyekwelu179@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Deborah Samaila",
    "role": "student",
    "email": "deborasamaila20@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Dominic Orefuwa",
    "role": "student",
    "email": "decryptus080@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "dee.najjuma",
    "role": "student",
    "email": "dee.najjuma@gmail.com",
    "status": "suspended"
  },
  {
    "name": "degirl4sure",
    "role": "student",
    "email": "degirl4sure@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Deimo Edwards",
    "role": "student",
    "email": "deimo.edwards@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "delightokonkwo24",
    "role": "student",
    "email": "delightokonkwo24@gmail.com",
    "status": "suspended"
  },
  {
    "name": "delightratesh1",
    "role": "student",
    "email": "delightratesh1@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "delroymason61",
    "role": "student",
    "email": "delroymason61@gmail.com",
    "status": "suspended"
  },
  {
    "name": "demiladedavid1",
    "role": "student",
    "email": "demiladedavid1@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "demiladpro",
    "role": "student",
    "email": "demiladpro@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Denique",
    "role": "student",
    "email": "deniquebutler@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "denisha cox",
    "role": "student",
    "email": "denishacox14@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "denisjobs3",
    "role": "student",
    "email": "denisjobs3@gmail.com",
    "status": "suspended"
  },
  {
    "name": "denisokelloakena",
    "role": "student",
    "email": "denisokelloakena@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Uhunoma Oghogho",
    "role": "student",
    "email": "denyes02@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Ekpungu Deo",
    "role": "student",
    "email": "deoekpungu@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "derockpeters2003",
    "role": "student",
    "email": "derockpeters2003@gmail.com",
    "status": "suspended"
  },
  {
    "name": "destinygoldenseptember",
    "role": "student",
    "email": "destinygoldenseptember@gmail.com",
    "status": "suspended"
  },
  {
    "name": "destinyogbomode",
    "role": "student",
    "email": "destinyogbomode@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Relaxing_TV",
    "role": "student",
    "email": "devonbusinessact@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "David Eze",
    "role": "student",
    "email": "deze9176@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "FERANMI DANIELS",
    "role": "student",
    "email": "df.faith2009@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Dorcas Gazelle",
    "role": "student",
    "email": "dgazelle825@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Grace Uzoechina",
    "role": "student",
    "email": "dgracedladuzoechina@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Diana Rotich",
    "role": "student",
    "email": "dianarotich50@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Zaida Diaz-Rivera",
    "role": "student",
    "email": "diazriverazaida@gmail.com",
    "status": "suspended"
  },
  {
    "name": "dickjoy2018",
    "role": "student",
    "email": "dickjoy2018@gmail.com",
    "status": "suspended",
    "program": "Masters Program"
  },
  {
    "name": "Dieudonne Ozowuba",
    "role": "student",
    "email": "dieucharis@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "dieudonneozowuba",
    "role": "student",
    "email": "dieudonneozowuba@gmail.com",
    "status": "suspended"
  },
  {
    "name": "digitalwealth4real",
    "role": "student",
    "email": "digitalwealth4real@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "digiterapnet.ai",
    "role": "student",
    "email": "digiterapnet.ai@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "dikejoeldavids24",
    "role": "student",
    "email": "dikejoeldavids24@gmail.com",
    "status": "suspended"
  },
  {
    "name": "dikezoedavids",
    "role": "student",
    "email": "dikezoedavids@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Oladimeji Emmanuel Babalola",
    "role": "student",
    "email": "dimejibabalola48@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Diminga Manga",
    "role": "student",
    "email": "dimingamanga701@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ADEKUNLE DAMILOLA",
    "role": "student",
    "email": "dimmyforlife@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Dinaice Maryanne",
    "role": "student",
    "email": "dinaicemlati38@gmail.com",
    "status": "suspended",
    "program": "BA Marketing & Advertising"
  },
  {
    "name": "distinctivepraise",
    "role": "student",
    "email": "distinctivepraise@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "divine akachukwu",
    "role": "student",
    "email": "divineakachukwu2006@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Divine Akpudi",
    "role": "student",
    "email": "divineakpudi4@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Divine Ideas",
    "role": "student",
    "email": "divineideas2019@gmail.com",
    "status": "suspended"
  },
  {
    "name": "divinelove11111",
    "role": "student",
    "email": "divinelove11111@gmail.com",
    "status": "suspended",
    "program": "Master of Public Administration (MPA), Minor in Nonprofit & Faith-Based Leadership"
  },
  {
    "name": "divinityclass2023",
    "role": "student",
    "email": "divinityclass2023@gmail.com",
    "status": "suspended"
  },
  {
    "name": "DAVID KYASIMA",
    "role": "student",
    "email": "dkyasima@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Nompumelelo Dlamini",
    "role": "student",
    "email": "dlaminic135@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "dlaminiphilanistooky",
    "role": "student",
    "email": "dlaminiphilanistooky@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "dlboyequaye",
    "role": "student",
    "email": "dlboyequaye@outlook.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "dmola4life2",
    "role": "student",
    "email": "dmola4life2@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "Adaobi Akabike",
    "role": "student",
    "email": "dobsynatty@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Dominion Chinomso Eze",
    "role": "student",
    "email": "dominionchinomsoeze@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Dominic Martins",
    "role": "student",
    "email": "domvictravels@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Donasha Green",
    "role": "student",
    "email": "donashagreen33@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "WILHEMINA ABA TAKYIWAA DONKOH",
    "role": "student",
    "email": "donkohwilheminaabatakyiwaa@gmail.com",
    "status": "suspended"
  },
  {
    "name": "doofred88",
    "role": "student",
    "email": "doofred88@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "doradaisy178",
    "role": "student",
    "email": "doradaisy178@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Dorcas Egbus",
    "role": "student",
    "email": "dorcasegbus@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Dorcas Adegoke",
    "role": "student",
    "email": "dorcasfunmilayoadegoke2017@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "dorcaskor23",
    "role": "student",
    "email": "dorcaskor23@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Doreen Asaba",
    "role": "student",
    "email": "doreenasaba22@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Science Counseling and Psychology"
  },
  {
    "name": "doreencherotich79",
    "role": "student",
    "email": "doreencherotich79@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "doricahmokoka27",
    "role": "student",
    "email": "doricahmokoka27@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Doris I Ginikanwa",
    "role": "student",
    "email": "dorisginikanwa12@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "dornellylusaka",
    "role": "student",
    "email": "dornellylusaka@gmail.com",
    "status": "suspended"
  },
  {
    "name": "dorothyblessingsbabirye",
    "role": "student",
    "email": "dorothyblessingsbabirye@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Truly Tupee Dossen",
    "role": "student",
    "email": "dossentupeet@gmail.com",
    "status": "suspended"
  },
  {
    "name": "dr.bishopmbengei",
    "role": "student",
    "email": "dr.bishopmbengei@gmail.com",
    "status": "suspended"
  },
  {
    "name": "dr.chuks1970",
    "role": "student",
    "email": "dr.chuks1970@gmail.com",
    "status": "suspended"
  },
  {
    "name": "dr.leonkip.hbiu",
    "role": "student",
    "email": "dr.leonkip.hbiu@gmail.com",
    "status": "suspended",
    "program": "PhD in Psychotherapy, Major in Clinical Mental Health"
  },
  {
    "name": "dr.leonkip",
    "role": "student",
    "email": "dr.leonkip@gmail.com",
    "status": "suspended"
  },
  {
    "name": "dr.leonkiphbius",
    "role": "student",
    "email": "dr.leonkiphbius@gmail.cim",
    "status": "suspended"
  },
  {
    "name": "Dornett McIntosh",
    "role": "student",
    "email": "dr.mcintosh@hbi.university",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "dr.mkojihannah",
    "role": "student",
    "email": "dr.mkojihannah@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "dr.sundayhbiu",
    "role": "student",
    "email": "dr.sundayhbiu@gmail.com",
    "status": "suspended"
  },
  {
    "name": "drawoala",
    "role": "student",
    "email": "drawoala@gmail.com",
    "status": "suspended"
  },
  {
    "name": "drayilenozi96",
    "role": "student",
    "email": "drayilenozi96@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "drbjackson26",
    "role": "student",
    "email": "drbjackson26@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "drchepngenoh",
    "role": "student",
    "email": "drchepngenoh@gmail.com",
    "status": "suspended"
  },
  {
    "name": "dremac19xx",
    "role": "student",
    "email": "dremac19xx@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Dr. Ephraim Ama",
    "role": "student",
    "email": "drephraima@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Drezi Collinz",
    "role": "student",
    "email": "drezitm@gmail.com",
    "status": "suspended"
  },
  {
    "name": "drgeorge1983",
    "role": "student",
    "email": "drgeorge1983@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Boluwatife Babajimi-Joseph",
    "role": "student",
    "email": "drjoebolu@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Dr joseph Mutisya",
    "role": "student",
    "email": "drjosephmutisya@gmail.com",
    "status": "suspended"
  },
  {
    "name": "drleonardhbius",
    "role": "student",
    "email": "drleonardhbius@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Temilolu Winner Olatemiju",
    "role": "student",
    "email": "drloluolatemiju@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "emmanuel nduwa",
    "role": "student",
    "email": "drnduwa@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "drosiroosiro",
    "role": "student",
    "email": "drosiroosiro@gmail.com",
    "status": "suspended",
    "program": "Theology in divinity and biblical studies"
  },
  {
    "name": "drprince37",
    "role": "student",
    "email": "drprince37@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Dr Prince",
    "role": "student",
    "email": "drprince564@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Dr Queen Made IAS online busi",
    "role": "student",
    "email": "drqueenmadeiasonlinebusi@gmail.com",
    "status": "suspended",
    "program": "Ph.D"
  },
  {
    "name": "Deborah Seroney",
    "role": "student",
    "email": "dseroney860@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Dudli Dlamini",
    "role": "student",
    "email": "dudlisto@gmail.com",
    "status": "suspended"
  },
  {
    "name": "duke_adada",
    "role": "student",
    "email": "duke_adada@yahoo.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Esther Adegboyega",
    "role": "student",
    "email": "dupesther4king@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Duvan Faro",
    "role": "student",
    "email": "duvanfaro2002@gmail.com",
    "status": "suspended"
  },
  {
    "name": "dvc",
    "role": "student",
    "email": "dvc@evangeluniversity.edu.ng",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Xololwethu Dwesini",
    "role": "student",
    "email": "dwesinixololwethu7@gmail.com",
    "status": "suspended"
  },
  {
    "name": "dynamic24337",
    "role": "student",
    "email": "dynamic24337@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Sir Chris",
    "role": "student",
    "email": "e028273.emeng@dlc.ui.edu.ng",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "John Joseph",
    "role": "student",
    "email": "eaglebest007@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Edikan Akwaowo",
    "role": "student",
    "email": "eakwaowo11@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Eazi Banks",
    "role": "student",
    "email": "eazibanks92@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Adepeko Ebenezer",
    "role": "student",
    "email": "ebenezeradepeko@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ebentunde2006",
    "role": "student",
    "email": "ebentunde2006@yahoo.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ebenugwop",
    "role": "student",
    "email": "ebenugwop@gmail.com",
    "status": "suspended",
    "program": "Public administration (MPA), minor in nonprofit & faith- base leadership"
  },
  {
    "name": "ebenugwopaul",
    "role": "student",
    "email": "ebenugwopaul@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Eberechukwu Sunday",
    "role": "student",
    "email": "eberechusmith7@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ebexelex",
    "role": "student",
    "email": "ebexelex@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Ebubechukwu Valentine",
    "role": "student",
    "email": "ebom.ng19@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Chigozirim Echereozo",
    "role": "student",
    "email": "echereozochigozirim@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ecnwogu",
    "role": "student",
    "email": "ecnwogu@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Oluwasanmi Akomolafe",
    "role": "student",
    "email": "ecotabit@gmail.com",
    "status": "suspended",
    "program": "MSc in Christian Counseling&Psychology"
  },
  {
    "name": "edemekongani",
    "role": "student",
    "email": "edemekongani@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "edemsonsam",
    "role": "student",
    "email": "edemsonsam@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "edenjem0022",
    "role": "student",
    "email": "edenjem0022@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "edetaniekan26",
    "role": "student",
    "email": "edetaniekan26@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "edet aniekan",
    "role": "student",
    "email": "edetaniekanezekiel@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "edetima05",
    "role": "student",
    "email": "edetima05@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "edheburev",
    "role": "student",
    "email": "edheburev@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Edidiong",
    "role": "student",
    "email": "edidiongduff1995@gmail.com",
    "status": "suspended"
  },
  {
    "name": "edisonthatodiako",
    "role": "student",
    "email": "edisonthatodiako@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Emem Edo",
    "role": "student",
    "email": "edoemem1@gmail.com",
    "status": "suspended"
  },
  {
    "name": "edokigracer",
    "role": "student",
    "email": "edokigracer@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "JOHN KINYERA",
    "role": "student",
    "email": "educajonist@gmail.com",
    "status": "suspended"
  },
  {
    "name": "edwin.omole2",
    "role": "student",
    "email": "edwin.omole2@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Edwin Omole",
    "role": "student",
    "email": "edwin.omole@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Eneobong Ene",
    "role": "student",
    "email": "eeene26@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "eeuganda",
    "role": "student",
    "email": "eeuganda@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ef_williams",
    "role": "student",
    "email": "ef_williams@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "Azigbo Efe",
    "role": "student",
    "email": "efe.azigbo1@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Azigbo Efe",
    "role": "student",
    "email": "efeazigbo31@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Efe Henry-Alobo",
    "role": "student",
    "email": "efehenryalobo@gmail.com",
    "status": "suspended",
    "program": "Master of Art in Organizational Leadership, Minor in Christian Ethics"
  },
  {
    "name": "Efihealth Hospital",
    "role": "student",
    "email": "efihospital56@gmail.com",
    "status": "suspended"
  },
  {
    "name": "egjesuorobo",
    "role": "student",
    "email": "egjesuorobo@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "GEORGE OHEPO EKO",
    "role": "student",
    "email": "egoheps@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Favour Eguzoroaku",
    "role": "student",
    "email": "eguzoroakufavy@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ehimhen Faithfulness",
    "role": "student",
    "email": "ehimhenfaithfulness896@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ejariaj+1",
    "role": "student",
    "email": "ejariaj+1@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ejariaj",
    "role": "student",
    "email": "ejariaj@gmail.com",
    "status": "suspended",
    "program": "Master of Public Administration (MPA) Minor in Faith-Based Leadership"
  },
  {
    "name": "ejykextan",
    "role": "student",
    "email": "ejykextan@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "SandraTega Ekatu",
    "role": "student",
    "email": "ekatusandra@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ekene Akamigbo",
    "role": "student",
    "email": "ekenben31@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Christian Ekeneme",
    "role": "student",
    "email": "ekenemechristian@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Ekene Mmadu",
    "role": "student",
    "email": "ekenemmadu0@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "eko.omini",
    "role": "student",
    "email": "eko.omini@ymail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Ekerette Ukpeh",
    "role": "student",
    "email": "ekytex@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "elijahabel4",
    "role": "student",
    "email": "elijahabel4@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Elijah Essien",
    "role": "student",
    "email": "elijahcraft97@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "prof Elijah",
    "role": "student",
    "email": "elijahmoses550@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "elijaho.odebunmi",
    "role": "student",
    "email": "elijaho.odebunmi@gmail.com",
    "status": "suspended"
  },
  {
    "name": "elijahsmandate700",
    "role": "student",
    "email": "elijahsmandate700@gmail.com",
    "status": "suspended",
    "program": "Bsc Christain Counseling And Psychology"
  },
  {
    "name": "Elisa Colbert",
    "role": "student",
    "email": "elisacolbertn@gmail.com",
    "status": "suspended",
    "program": "Certificate"
  },
  {
    "name": "Elijah Essien",
    "role": "student",
    "email": "eliscoenterprise001@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Elisha Alfred Kabba",
    "role": "student",
    "email": "elishaalfredkabba@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "elishayohanna2",
    "role": "student",
    "email": "elishayohanna2@gmail.com",
    "status": "suspended"
  },
  {
    "name": "elizabeth",
    "role": "student",
    "email": "elizabeth@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "elizabethbadewumi",
    "role": "student",
    "email": "elizabethbadewumi@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Elizabeth Crown Jewel",
    "role": "student",
    "email": "elizabethcrownjewel@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Elizabeth Damilola",
    "role": "student",
    "email": "elizabethdamilola716@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ELIZABETH ENOCH",
    "role": "student",
    "email": "elizabethenoch37@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "elizabethokware3",
    "role": "student",
    "email": "elizabethokware3@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "elizabethzybatuconteh831",
    "role": "student",
    "email": "elizabethzybatuconteh831@gmail.com",
    "status": "suspended"
  },
  {
    "name": "elizabethzybatuconteh",
    "role": "student",
    "email": "elizabethzybatuconteh@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ellababy0605",
    "role": "student",
    "email": "ellababy0605@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "elmemnoor",
    "role": "student",
    "email": "elmemnoor@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Elor Goldcelestine",
    "role": "student",
    "email": "elorgoldcelestine@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Success Emayohan",
    "role": "student",
    "email": "emayohansuccess@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Emayohan taiwo",
    "role": "student",
    "email": "emayohantaiwo@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Oni Embola",
    "role": "student",
    "email": "embolaoni@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Emem Edo",
    "role": "student",
    "email": "ememedo82@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ememtomudoudo",
    "role": "student",
    "email": "ememtomudoudo@gmail.com",
    "status": "suspended",
    "program": "Master's of Arts in Community Leadership, Minor in Christian Ministry studies"
  },
  {
    "name": "emersapphire.c",
    "role": "student",
    "email": "emersapphire.c@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Emmanuel Segotso",
    "role": "student",
    "email": "emexsegotso@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Emihle Swartbooi",
    "role": "student",
    "email": "emihleangela16@gmail.com",
    "status": "suspended",
    "program": "Architecture"
  },
  {
    "name": "emillyogutu1",
    "role": "student",
    "email": "emillyogutu1@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "emmaayomide350",
    "role": "student",
    "email": "emmaayomide350@gmail.com",
    "status": "suspended"
  },
  {
    "name": "emmaemeka",
    "role": "student",
    "email": "emmaemeka@hbiu.com",
    "status": "suspended"
  },
  {
    "name": "emmaemekahbiu",
    "role": "student",
    "email": "emmaemekahbiu@gmail.com",
    "status": "suspended"
  },
  {
    "name": "emmahkingoo1",
    "role": "student",
    "email": "emmahkingoo1@gmail.com",
    "status": "suspended",
    "program": "Doctorate"
  },
  {
    "name": "Emmanuel Isimah",
    "role": "student",
    "email": "emmaisy@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "emmakawuaku",
    "role": "student",
    "email": "emmakawuaku@gmail.com",
    "status": "suspended"
  },
  {
    "name": "emmalule256",
    "role": "student",
    "email": "emmalule256@gmail.co",
    "status": "suspended"
  },
  {
    "name": "Emma Lule",
    "role": "student",
    "email": "emmalule256@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "emmanuel4emmanuel2023",
    "role": "student",
    "email": "emmanuel4emmanuel2023@gmail.com",
    "status": "suspended"
  },
  {
    "name": "emmanuelakanbi536",
    "role": "student",
    "email": "emmanuelakanbi536@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "emmanuel Bass",
    "role": "student",
    "email": "emmanuelbass.bass@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "emmanueldo225",
    "role": "student",
    "email": "emmanueldo225@gmail.com",
    "status": "suspended",
    "program": "Masters"
  },
  {
    "name": "FALOYIN EMMANUEL OLADIMEJI",
    "role": "student",
    "email": "emmanuelfaloyin@gmail.com",
    "status": "suspended"
  },
  {
    "name": "emmanuelgodday72",
    "role": "student",
    "email": "emmanuelgodday72@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Emmanuel Josiah",
    "role": "student",
    "email": "emmanueljosiah2367@gmail.com",
    "status": "suspended"
  },
  {
    "name": "emmanuelo.obasuyi",
    "role": "student",
    "email": "emmanuelo.obasuyi@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "emmanuelomorinoye",
    "role": "student",
    "email": "emmanuelomorinoye@gmail.com",
    "status": "suspended"
  },
  {
    "name": "emmanuelonyinyechiakawuaku",
    "role": "student",
    "email": "emmanuelonyinyechiakawuaku@gmail.com",
    "status": "suspended"
  },
  {
    "name": "emmanuelosejie",
    "role": "student",
    "email": "emmanuelosejie@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "emmashakins",
    "role": "student",
    "email": "emmashakins@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "EMMIE JULIE",
    "role": "student",
    "email": "emmiejulie28@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Emmy Crown",
    "role": "student",
    "email": "emmyaladenusi@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ezekiel Emmanuel",
    "role": "student",
    "email": "emmyezzy@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "emmykams002",
    "role": "student",
    "email": "emmykams002@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Ene Agnes Onuh",
    "role": "student",
    "email": "eneagnesonuh1@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Amaka Eneje",
    "role": "student",
    "email": "enejeamaka8@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Gloria Enekeme",
    "role": "student",
    "email": "enekemegloria@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "enemaridavido",
    "role": "student",
    "email": "enemaridavido@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "enesomis",
    "role": "student",
    "email": "enesomis@gmail.com",
    "status": "suspended"
  },
  {
    "name": "engineeradams",
    "role": "student",
    "email": "engineeradams@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Mathew Odama",
    "role": "student",
    "email": "engrmatodama@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Eniklove",
    "role": "student",
    "email": "eniklove71@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "enitanbukola0210",
    "role": "student",
    "email": "enitanbukola0210@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Eno Essien",
    "role": "student",
    "email": "enochrist2007@gmail.com",
    "status": "suspended"
  },
  {
    "name": "enochthydon",
    "role": "student",
    "email": "enochthydon@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "enockopeyemi",
    "role": "student",
    "email": "enockopeyemi@yahoo.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "enouwem2016",
    "role": "student",
    "email": "enouwem2016@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "enyaruwa347",
    "role": "student",
    "email": "enyaruwa347@gmail.com",
    "status": "suspended",
    "program": "PhD in Marriage and Family Therapy with Specialization in addiction Counseling"
  },
  {
    "name": "Elizabeth Nyaruwa",
    "role": "student",
    "email": "enyaruwahbiuaddiction@gmail.com",
    "status": "suspended"
  },
  {
    "name": "enyaruwahbiuaddiction",
    "role": "student",
    "email": "enyaruwahbiuaddiction@gmail.comh",
    "status": "suspended"
  },
  {
    "name": "Nyeboho Etuk",
    "role": "student",
    "email": "enyeboho@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Enyinna Celine Chidinma",
    "role": "student",
    "email": "enyinnacelinechidinma@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "enyiomaprogress",
    "role": "student",
    "email": "enyiomaprogress@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "eolamide061",
    "role": "student",
    "email": "eolamide061@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "taiwo ojo",
    "role": "student",
    "email": "erekesewa@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Johnson Ejenavi",
    "role": "student",
    "email": "erhiga12@gmail.com",
    "status": "suspended"
  },
  {
    "name": "kimutai erick",
    "role": "student",
    "email": "erickkimutai46@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ericthuranirakiome",
    "role": "student",
    "email": "ericthuranirakiome@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ERUMUSE ERUMUSE",
    "role": "student",
    "email": "erumuse@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Esan Sunday",
    "role": "student",
    "email": "esansunday2016@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "eseireneeze",
    "role": "student",
    "email": "eseireneeze@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "eseosorun",
    "role": "student",
    "email": "eseosorun@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "esther njenga",
    "role": "student",
    "email": "eshernjenga@gmail.com",
    "status": "suspended"
  },
  {
    "name": "esosaisola",
    "role": "student",
    "email": "esosaisola@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Josephine Essang",
    "role": "student",
    "email": "essangjosephine@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Esther Sani",
    "role": "student",
    "email": "esther01sani@gmail.com",
    "status": "suspended"
  },
  {
    "name": "estheradio143",
    "role": "student",
    "email": "estheradio143@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "estheragutuoduor",
    "role": "student",
    "email": "estheragutuoduor@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "estheralagba88",
    "role": "student",
    "email": "estheralagba88@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "estherd989",
    "role": "student",
    "email": "estherd989@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "esthereniola2001",
    "role": "student",
    "email": "esthereniola2001@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "estherisgud",
    "role": "student",
    "email": "estherisgud@outlook.com",
    "status": "suspended"
  },
  {
    "name": "estherleke00",
    "role": "student",
    "email": "estherleke00@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Esther Manneh",
    "role": "student",
    "email": "esthermanneh091@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "esthermatende77",
    "role": "student",
    "email": "esthermatende77@gmail.com",
    "status": "suspended",
    "program": "BA IN CHRISTIAN LIFE COACHING"
  },
  {
    "name": "Rev. Esther Muthengi",
    "role": "student",
    "email": "esthermuthengikim@gmail.com",
    "status": "suspended",
    "program": "BA CHRISTIAN EDUCATION"
  },
  {
    "name": "estheronaiwu2015",
    "role": "student",
    "email": "estheronaiwu2015@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Esther Temini Jesu",
    "role": "student",
    "email": "esthertj70@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Esther Clement",
    "role": "student",
    "email": "estherxyz890@gmail.com",
    "status": "suspended"
  },
  {
    "name": "BASSEY BASSEY",
    "role": "student",
    "email": "eteba2010@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "euniceodusolu",
    "role": "student",
    "email": "euniceodusolu@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Evalecia Sutherland",
    "role": "student",
    "email": "evalecia12@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Amony Evaline",
    "role": "student",
    "email": "evalineamony256@gmail.com",
    "status": "suspended"
  },
  {
    "name": "evansmose65",
    "role": "student",
    "email": "evansmose65@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "NAKASI EVELYN",
    "role": "student",
    "email": "evelynnacs@gmail.com",
    "status": "suspended",
    "program": "BACHELOR IN CHRISTIAN LEADERSHIP AND CULTURAL LEADERSHIP"
  },
  {
    "name": "evett isatu sesay",
    "role": "student",
    "email": "evettisatus@gmail.com",
    "status": "suspended",
    "program": "Bachelor of science in healthcare administration minor in health ministry"
  },
  {
    "name": "evidenceemmanuel904",
    "role": "student",
    "email": "evidenceemmanuel904@gmail.com",
    "status": "suspended"
  },
  {
    "name": "evsamsonadam",
    "role": "student",
    "email": "evsamsonadam@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Esther Gitau",
    "role": "student",
    "email": "ewangechi69@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Jeremiah David",
    "role": "student",
    "email": "exaltedinall87@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "excellence.jerry",
    "role": "student",
    "email": "excellence.jerry@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Eyoanwan Kanu",
    "role": "student",
    "email": "eyoanwankanu@gmail.com",
    "status": "suspended",
    "program": "Bachelor, Healthcare Administration"
  },
  {
    "name": "Daniel Eze",
    "role": "student",
    "email": "eze56058@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ezealiesther",
    "role": "student",
    "email": "ezealiesther@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Ezekiel Ademola",
    "role": "student",
    "email": "ezekielademola2654@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ezekielayoola083",
    "role": "student",
    "email": "ezekielayoola083@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Ezekiel Bainit",
    "role": "student",
    "email": "ezekielbainit@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ezekielnggadasalmamza",
    "role": "student",
    "email": "ezekielnggadasalmamza@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ezewilliamsj",
    "role": "student",
    "email": "ezewilliamsj@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ezmanezra",
    "role": "student",
    "email": "ezmanezra@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ezraezman",
    "role": "student",
    "email": "ezraezman@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ezragimba3000",
    "role": "student",
    "email": "ezragimba3000@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "FUNMILAYO ADEBOWALE",
    "role": "student",
    "email": "fadebowale739@gmail.com",
    "status": "suspended",
    "program": "Certificate"
  },
  {
    "name": "fadeyititilope79",
    "role": "student",
    "email": "fadeyititilope79@gmail.com",
    "status": "suspended"
  },
  {
    "name": "fagbola Darasimi",
    "role": "student",
    "email": "fagboladarasimi21@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Fagbola Kayode",
    "role": "student",
    "email": "fagbolakayode@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "fagbolatoyin",
    "role": "student",
    "email": "fagbolatoyin@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Faith Baindu Coker",
    "role": "student",
    "email": "faithbainducoker@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Faith korir",
    "role": "student",
    "email": "faithkorir829@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Faith Kwagala",
    "role": "student",
    "email": "faithkwagala492@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Faith Kwagala",
    "role": "student",
    "email": "faithkwagalalove@gmail.com",
    "status": "suspended",
    "program": "Music and Media Production"
  },
  {
    "name": "faithlansana94",
    "role": "student",
    "email": "faithlansana94@gmail.com",
    "status": "suspended",
    "program": "Bachelor of science in healthcare leadership and management, minor in health ministry"
  },
  {
    "name": "Faith Mbam",
    "role": "student",
    "email": "faithmbam97@gmail.com",
    "status": "suspended"
  },
  {
    "name": "faitholuchiakawuaku",
    "role": "student",
    "email": "faitholuchiakawuaku@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Faith Kaluse",
    "role": "student",
    "email": "faithwakaluse@gmail.com",
    "status": "suspended",
    "program": "Bachelor in Christian Counseling & Psychology Minor in Clinical Mental Health"
  },
  {
    "name": "Faith Yusuf",
    "role": "student",
    "email": "faityusuf@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "fakpudi",
    "role": "student",
    "email": "fakpudi@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Falana Sunday",
    "role": "student",
    "email": "falanasunday84@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "farouq.kyagera",
    "role": "student",
    "email": "farouq.kyagera@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Fashipe abiola",
    "role": "student",
    "email": "fashipeabiola@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Chinedu Sunday",
    "role": "student",
    "email": "fasunonigeriaenterprises@gmail.com",
    "status": "suspended"
  },
  {
    "name": "fatima mohammed",
    "role": "student",
    "email": "fateemaxahra.fm@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Jonathan Olajide JP",
    "role": "student",
    "email": "father76.jo@gmail.com",
    "status": "suspended",
    "program": "MBA Project Management"
  },
  {
    "name": "Fatmata Boima",
    "role": "student",
    "email": "fatmataboima535@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ahmed Fofana",
    "role": "student",
    "email": "favdiv90@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "favoriteola208",
    "role": "student",
    "email": "favoriteola208@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Favoured Ugochi",
    "role": "student",
    "email": "favouredug1997@gmail.com",
    "status": "suspended"
  },
  {
    "name": "favour emayohan",
    "role": "student",
    "email": "favouremayohan2019@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Favour",
    "role": "student",
    "email": "favourmide8765@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "favourola2022",
    "role": "student",
    "email": "favourola2022@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "fayiamariesia",
    "role": "student",
    "email": "fayiamariesia@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Science in Healthcare Administration, in minor health Ministry"
  },
  {
    "name": "fehintola arike stella",
    "role": "student",
    "email": "fehintolaarikestella@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Faith Cherotich",
    "role": "student",
    "email": "feichero99@gmail.com",
    "status": "suspended"
  },
  {
    "name": "felicia.ameh2014",
    "role": "student",
    "email": "felicia.ameh2014@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "feliciaarigo001",
    "role": "student",
    "email": "feliciaarigo001@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "feliciaeberechipatrick73",
    "role": "student",
    "email": "feliciaeberechipatrick73@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Felicia Eberechi Patrick",
    "role": "student",
    "email": "feliciaeberechipatrick@gmail.com",
    "status": "suspended"
  },
  {
    "name": "FELIX ALEXANDER",
    "role": "student",
    "email": "felin4real@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "felind100",
    "role": "student",
    "email": "felind100@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "felixighakpor",
    "role": "student",
    "email": "felixighakpor@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Pheelix Banson",
    "role": "student",
    "email": "felixjrbanson@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "felix kiplangat",
    "role": "student",
    "email": "felixkiplangat8@gmail.com",
    "status": "suspended",
    "program": "Master Of Science In Public Health"
  },
  {
    "name": "felix queen",
    "role": "student",
    "email": "felixtemilade123@gmail.com",
    "status": "suspended",
    "program": "Bachelor in Agribusiness"
  },
  {
    "name": "femmyandrew83",
    "role": "student",
    "email": "femmyandrew83@yahoo.com",
    "status": "suspended",
    "program": "Bsc in Human Services (Addictions Concentration)"
  },
  {
    "name": "Oluwafemi Olowoyo",
    "role": "student",
    "email": "femolowo56@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "fenji54",
    "role": "student",
    "email": "fenji54@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Fizzy Ayomi",
    "role": "student",
    "email": "fizzyayomi@gmail.com",
    "status": "suspended"
  },
  {
    "name": "flashkeba",
    "role": "student",
    "email": "flashkeba@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "flonwanju",
    "role": "student",
    "email": "flonwanju@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Moses Fofanah",
    "role": "student",
    "email": "fofanahmoses302@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Mojo Fofanah",
    "role": "student",
    "email": "fofanamo982927@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Afolabi Salau",
    "role": "student",
    "email": "folabi.owoseni@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "folabi.salau",
    "role": "student",
    "email": "folabi.salau@gmail.com",
    "status": "suspended",
    "program": "MASTER OF SCIENCE IN ORGANIZATIONAL LEADERSHIP MINOR NON-PROFIT ADMINISTRATION"
  },
  {
    "name": "Idris Folarin",
    "role": "student",
    "email": "folariadeyemi@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Pretty Lizzy",
    "role": "student",
    "email": "folashade8911@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Malibongwe Fololo",
    "role": "student",
    "email": "folcomdev@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "fortunereality3",
    "role": "student",
    "email": "fortunereality3@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Francis Gomez",
    "role": "student",
    "email": "fraboy1122@gmail.com",
    "status": "suspended"
  },
  {
    "name": "fram.michael4",
    "role": "student",
    "email": "fram.michael4@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Frances M Simbo",
    "role": "student",
    "email": "francesmsimbo19@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Daniel Francis",
    "role": "student",
    "email": "francis8273860@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "franciscaabayol6",
    "role": "student",
    "email": "franciscaabayol6@yahoo.com",
    "status": "suspended",
    "program": "MA in clinical mental health counseling (Addictions Track) -minor Faith -Based Trauma informed care"
  },
  {
    "name": "Francis Shamie",
    "role": "student",
    "email": "francisshamie@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "francisukoabasi77",
    "role": "student",
    "email": "francisukoabasi77@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "frankchidom",
    "role": "student",
    "email": "frankchidom@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "franklin.com007",
    "role": "student",
    "email": "franklin.com007@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "franklindebby54",
    "role": "student",
    "email": "franklindebby54@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Franklin Doris",
    "role": "student",
    "email": "franklindoris483@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "frankmaronga100",
    "role": "student",
    "email": "frankmaronga100@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "frankrejoice05",
    "role": "student",
    "email": "frankrejoice05@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "franzes0606",
    "role": "student",
    "email": "franzes0606@gmail.com",
    "status": "suspended"
  },
  {
    "name": "frasofina1122",
    "role": "student",
    "email": "frasofina1122@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Philly Egesa",
    "role": "student",
    "email": "fredrickegesa73@gmail.com",
    "status": "suspended"
  },
  {
    "name": "freemanchino333",
    "role": "student",
    "email": "freemanchino333@gmail.com",
    "status": "suspended"
  },
  {
    "name": "freemanchino555",
    "role": "student",
    "email": "freemanchino555@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "fremlinekesa",
    "role": "student",
    "email": "fremlinekesa@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Fridah Langat",
    "role": "student",
    "email": "fridahlangat247@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "fridayhosea17",
    "role": "student",
    "email": "fridayhosea17@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "fridayimegu1",
    "role": "student",
    "email": "fridayimegu1@gmail.com",
    "status": "suspended"
  },
  {
    "name": "fridayimegu",
    "role": "student",
    "email": "fridayimegu@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "fridayimeguu",
    "role": "student",
    "email": "fridayimeguu@gmail.com",
    "status": "suspended"
  },
  {
    "name": "fridayimoekor",
    "role": "student",
    "email": "fridayimoekor@gmail.com",
    "status": "suspended"
  },
  {
    "name": "FIREBRAND SOLUTION TEAM",
    "role": "student",
    "email": "fstmissions@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Aime Fulgence",
    "role": "student",
    "email": "fulgencelania1@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "Aime Fulgence Barawigirira",
    "role": "student",
    "email": "fulgencelania@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Adeoti Funke",
    "role": "student",
    "email": "funkeadeoti3@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "funkejeremiah9",
    "role": "student",
    "email": "funkejeremiah9@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "funmiannacademy",
    "role": "student",
    "email": "funmiannacademy@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Funmi Asaolu",
    "role": "student",
    "email": "funmiasaolu@gmail.com",
    "status": "suspended",
    "program": "Master of Science in Organizational Leadership, Minor in Nonprofit Administration"
  },
  {
    "name": "funmidodear",
    "role": "student",
    "email": "funmidodear@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "Funmilayo Adebowale",
    "role": "student",
    "email": "funmilayoadebowale877@gmail.com",
    "status": "suspended",
    "program": "Certificate"
  },
  {
    "name": "FAGBOLA FUNMILAYO",
    "role": "student",
    "email": "funmilayofagbola@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "funmisodear",
    "role": "student",
    "email": "funmisodear@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Fustina Edeh",
    "role": "student",
    "email": "fustinamary1@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Vanessa Bonareri",
    "role": "student",
    "email": "fvanessabonareri@gmail.com",
    "status": "suspended",
    "program": "Masters of Science in Public Health Faith-Based Initiative"
  },
  {
    "name": "ANYANWU EMEKA EMMANUEL",
    "role": "student",
    "email": "g.a.h.mekinzdot2011@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Gregory Grant",
    "role": "student",
    "email": "g.grant.lscounseling@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "gabakagwu",
    "role": "student",
    "email": "gabakagwu@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "gabrielojofaith",
    "role": "student",
    "email": "gabrielojofaith@gmail.com",
    "status": "suspended",
    "program": "Masters of science in psychology, Minor in clinical Chaplaincy Psychotherapy"
  },
  {
    "name": "Omotoyosi victor Oguntolu",
    "role": "student",
    "email": "gabson608@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Gadzama David",
    "role": "student",
    "email": "gaddestiny@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "gagim639",
    "role": "student",
    "email": "gagim639@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Tashana Galimore",
    "role": "student",
    "email": "galimoretashana@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "gambulek7",
    "role": "student",
    "email": "gambulek7@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Rita Ganda",
    "role": "student",
    "email": "gandarita11@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "gardenertalbotrn",
    "role": "student",
    "email": "gardenertalbotrn@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Olawepo Gbemisola",
    "role": "student",
    "email": "gbemisolaolawepo67@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "gbenga099",
    "role": "student",
    "email": "gbenga099@outlook.com",
    "status": "suspended"
  },
  {
    "name": "gbenga_igba",
    "role": "student",
    "email": "gbenga_igba@yahoo.co.uk",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Gbenga Adeboye",
    "role": "student",
    "email": "gbengaworld@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Grace Benneh",
    "role": "student",
    "email": "gbenneh73@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Gbolahan Fagbola",
    "role": "student",
    "email": "gbolahanfagbola06@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Gbotemi Olu",
    "role": "student",
    "email": "gbotemiolu@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Gabriel Ezeamii",
    "role": "student",
    "email": "gcezeamii@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "gceziuzo",
    "role": "student",
    "email": "gceziuzo@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Gedion Langat",
    "role": "student",
    "email": "gedionlangat172@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Mayor Gentlegend",
    "role": "student",
    "email": "gentlegend@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ojara Geoffrey",
    "role": "student",
    "email": "geoffreyojara@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Arts in Theology"
  },
  {
    "name": "VR GAMING",
    "role": "student",
    "email": "george2taiwo@gmail.com",
    "status": "suspended"
  },
  {
    "name": "george imeh",
    "role": "student",
    "email": "georgeimeh6@gmail.com",
    "status": "suspended",
    "program": "Master of Leadership Studies,Minor in understanding Leadership in world Religion"
  },
  {
    "name": "georgeojw",
    "role": "student",
    "email": "georgeojw@gmail.com",
    "status": "suspended",
    "program": "BSc in Public Health & Healthcare Admin"
  },
  {
    "name": "GEORGE OLUFUNKE",
    "role": "student",
    "email": "georgeolufunke@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "georgesesay917",
    "role": "student",
    "email": "georgesesay917@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Agribusiness, minor in non profit sustainable and community development"
  },
  {
    "name": "georgeshaaban",
    "role": "student",
    "email": "georgeshaaban@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "gfactor33",
    "role": "student",
    "email": "gfactor33@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Garba Friday Joshua",
    "role": "student",
    "email": "gfridayjoshua@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Geddes Vassell",
    "role": "student",
    "email": "ggavassell66@gmail.com",
    "status": "suspended"
  },
  {
    "name": "George Davies",
    "role": "student",
    "email": "ggdjr458@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Joseph Gicheha Macharia",
    "role": "student",
    "email": "gichehamacharia@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Prophet Gideon Adetoro",
    "role": "student",
    "email": "gideon.adetotoro2007@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Gideon ogunkunle",
    "role": "student",
    "email": "gideon.ogunkunle1@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Gideon Cheruiyot",
    "role": "student",
    "email": "gideoncheruiyot356@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ginikanwadorisi",
    "role": "student",
    "email": "ginikanwadorisi@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Peninah Gitau",
    "role": "student",
    "email": "gitaupeninah880@gmail.com",
    "status": "suspended",
    "program": "Bsc in Counselling Psychology"
  },
  {
    "name": "GLADYS BENNETH",
    "role": "student",
    "email": "gladdyben@gmail.com",
    "status": "suspended"
  },
  {
    "name": "GlobalT Concept",
    "role": "student",
    "email": "globaltconcept529@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Gloria Ibezim",
    "role": "student",
    "email": "globitaibezim@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "gloriaabutu2020",
    "role": "student",
    "email": "gloriaabutu2020@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "gloriaatoji",
    "role": "student",
    "email": "gloriaatoji@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "gloria kolawole",
    "role": "student",
    "email": "gloriababe2024@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Gloria Dennis",
    "role": "student",
    "email": "gloriadennis0927@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Gloria Okpe",
    "role": "student",
    "email": "gloriaofafrica@gmail.com",
    "status": "suspended",
    "program": "MA. Organizational Leadership Minor Christian Ethics"
  },
  {
    "name": "gloryayomide24",
    "role": "student",
    "email": "gloryayomide24@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Glory Mayomi",
    "role": "student",
    "email": "glorygbolu2005@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Patrick Gichuki",
    "role": "student",
    "email": "glorygracemercy247@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "glorylongretjohn1234",
    "role": "student",
    "email": "glorylongretjohn1234@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Glory Ojo",
    "role": "student",
    "email": "gloryojo2019@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Glory Osondu",
    "role": "student",
    "email": "gloryosondu11@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Agboola Gbenga",
    "role": "student",
    "email": "glorypraise2010@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Glory Samson",
    "role": "student",
    "email": "glorysamson4u@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "glow equity",
    "role": "student",
    "email": "glow1equity2021@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Godbless Ayo",
    "role": "student",
    "email": "godblessayo583@gmail.com",
    "status": "suspended"
  },
  {
    "name": "godreignvonkur",
    "role": "student",
    "email": "godreignvonkur@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "godsownkoko",
    "role": "student",
    "email": "godsownkoko@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "godsownwinner",
    "role": "student",
    "email": "godsownwinner@gmail.com",
    "status": "suspended"
  },
  {
    "name": "godstimeaigbomian07",
    "role": "student",
    "email": "godstimeaigbomian07@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Godswill Bassey",
    "role": "student",
    "email": "godswillbassey360@gmail.com",
    "status": "suspended"
  },
  {
    "name": "godswilljonah999",
    "role": "student",
    "email": "godswilljonah999@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "godswillvonkur2",
    "role": "student",
    "email": "godswillvonkur2@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "goldenopportunity122",
    "role": "student",
    "email": "goldenopportunity122@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "gomarotsi",
    "role": "student",
    "email": "gomarotsi@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Jedidiah Hezekiah Gomez",
    "role": "student",
    "email": "gomezjedidiahhezekiah@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Goodman Adebimpe",
    "role": "student",
    "email": "goodmanseun06@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "goratamoses89",
    "role": "student",
    "email": "goratamoses89@gmail.com",
    "status": "suspended"
  },
  {
    "name": "gordon ochieng",
    "role": "student",
    "email": "gordonochieng097@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "goslanaltd",
    "role": "student",
    "email": "goslanaltd@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Folorunsho Olushola philip",
    "role": "student",
    "email": "gprofxsolution2@gmail.com",
    "status": "suspended"
  },
  {
    "name": "gracebaraka17",
    "role": "student",
    "email": "gracebaraka17@gmail.com",
    "status": "suspended"
  },
  {
    "name": "gracediamond73",
    "role": "student",
    "email": "gracediamond73@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ollor grace",
    "role": "student",
    "email": "graceollor354@gmail.com",
    "status": "suspended"
  },
  {
    "name": "graceomoloye22",
    "role": "student",
    "email": "graceomoloye22@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Grace Odebunmi",
    "role": "student",
    "email": "gracepville2@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Graceworship Centre",
    "role": "student",
    "email": "graceworshipcentre2017@gmail.com",
    "status": "suspended"
  },
  {
    "name": "grant.kimone",
    "role": "student",
    "email": "grant.kimone@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Gregory Grant",
    "role": "student",
    "email": "grant88271@gmail.com",
    "status": "suspended"
  },
  {
    "name": "grantchin5",
    "role": "student",
    "email": "grantchin5@gmail.com",
    "status": "suspended"
  },
  {
    "name": "greatfortune111",
    "role": "student",
    "email": "greatfortune111@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "GREAT SPRINGS",
    "role": "student",
    "email": "greatsprings8@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Greenish Academy",
    "role": "student",
    "email": "greenishhelpline@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Busuyi Kayode",
    "role": "student",
    "email": "greenseasons95@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Gretha Niyon",
    "role": "student",
    "email": "grethaniyon07@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Daqwan Griffin",
    "role": "student",
    "email": "griffindaqwan23@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Gorata Tlapeng",
    "role": "student",
    "email": "gtlapeng@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Gyinantwiwaa Abena Owusu",
    "role": "student",
    "email": "gyinantwiwaa2003@gmail.com",
    "status": "suspended"
  },
  {
    "name": "hadassaholanike97",
    "role": "student",
    "email": "hadassaholanike97@gmail.com",
    "status": "suspended"
  },
  {
    "name": "hadizaumar4",
    "role": "student",
    "email": "hadizaumar4@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "hajaserayjalloh",
    "role": "student",
    "email": "hajaserayjalloh@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "halima ahmad usman",
    "role": "student",
    "email": "halimaahmadusman97@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "hammedadedoyin06",
    "role": "student",
    "email": "hammedadedoyin06@gmail.com",
    "status": "suspended"
  },
  {
    "name": "hamusokwet",
    "role": "student",
    "email": "hamusokwet@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "hanipher25",
    "role": "student",
    "email": "hanipher25@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "hannahjoy245",
    "role": "student",
    "email": "hannahjoy245@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "HANNA TSADO",
    "role": "student",
    "email": "hannatsado123@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ihuoma Happiness",
    "role": "student",
    "email": "happinessihuoma3@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "hardekola hazeezhat",
    "role": "student",
    "email": "hardekolahazeezhat@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "hargboholar",
    "role": "student",
    "email": "hargboholar@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "HARON MELLY",
    "role": "student",
    "email": "haronkip97@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "harrietkongai",
    "role": "student",
    "email": "harrietkongai@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Christian Business Administration"
  },
  {
    "name": "Haruna Joshua",
    "role": "student",
    "email": "harunajoshua062@gmail.com",
    "status": "suspended"
  },
  {
    "name": "harunascholership",
    "role": "student",
    "email": "harunascholership@gmaik.com",
    "status": "suspended"
  },
  {
    "name": "hassan usman",
    "role": "student",
    "email": "hassanusman121212@gmail.com",
    "status": "suspended"
  },
  {
    "name": "hauwausulaimandir",
    "role": "student",
    "email": "hauwausulaimandir@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Hamisu B Dabai",
    "role": "student",
    "email": "hbdabai96@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "hbendu542",
    "role": "student",
    "email": "hbendu542@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "HBI International University",
    "role": "student",
    "email": "hbiinternationaluniversity@gmail.com",
    "status": "suspended",
    "program": "Bachelor in Theology"
  },
  {
    "name": "HBIU WORKFORCE AGENCY",
    "role": "student",
    "email": "hbiu.directoroffice@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Georgiann Morrison",
    "role": "student",
    "email": "hbiu.morrison@gmail.com",
    "status": "suspended"
  },
  {
    "name": "hbiuacademic",
    "role": "student",
    "email": "hbiuacademic@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "hbiucounseling26",
    "role": "student",
    "email": "hbiucounseling26@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "hbiudoreenasaba22",
    "role": "student",
    "email": "hbiudoreenasaba22@gmail.com",
    "status": "suspended"
  },
  {
    "name": "HBIUStudent",
    "role": "student",
    "email": "hbiustudentyoung@gmail.com",
    "status": "suspended"
  },
  {
    "name": "headmanphilip",
    "role": "student",
    "email": "headmanphilip@gmail.com",
    "status": "suspended",
    "program": "Master of Public Administration (MPA) Minor in Nonprofit & Faith-Based Leadership"
  },
  {
    "name": "helenchaba754",
    "role": "student",
    "email": "helenchaba754@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Helen David",
    "role": "student",
    "email": "helendavid1393@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Helen Nuwagaba",
    "role": "student",
    "email": "hellenc534@gmail.com",
    "status": "suspended"
  },
  {
    "name": "henrykojo2015",
    "role": "student",
    "email": "henrykojo2015@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "hephzibah9168",
    "role": "student",
    "email": "hephzibah9168@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Hephzibah Emayohan",
    "role": "student",
    "email": "hephzibahemayohan@gmail.com",
    "status": "suspended",
    "program": "Bachelor in education minor in diverse ministry education"
  },
  {
    "name": "Heritage Williams",
    "role": "student",
    "email": "heritagewilliams933@gmail.com",
    "status": "suspended"
  },
  {
    "name": "heritagewillliams933",
    "role": "student",
    "email": "heritagewillliams933@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Hermione Petioma",
    "role": "student",
    "email": "hermionepetioma@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Medrine Kariuki",
    "role": "student",
    "email": "hetochir2@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Hillary Ndimele",
    "role": "student",
    "email": "hillaryndimele@gmail.com",
    "status": "suspended"
  },
  {
    "name": "hillsmercy19",
    "role": "student",
    "email": "hillsmercy19@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "hivirdamantakil",
    "role": "student",
    "email": "hivirdamantakil@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Business Management, Minor in Faith- Based Policy"
  },
  {
    "name": "HANNAH K MASSAQUOI",
    "role": "student",
    "email": "hkmassaquoi@gmail.com",
    "status": "suspended",
    "program": "Bachelor of science in healthcare Administration minor in health ministry"
  },
  {
    "name": "Sandisa Hlomela",
    "role": "student",
    "email": "hlomelasandisa@gmail.com",
    "status": "suspended"
  },
  {
    "name": "hloniphile sibongumusa",
    "role": "student",
    "email": "hloniphilesibongumusa@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Helene Muyulenu",
    "role": "student",
    "email": "hmuyulenu@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Helen-Nellie Adigwe",
    "role": "student",
    "email": "hnadigwe@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Harriet Namiiro",
    "role": "student",
    "email": "hnarriet63@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "hoghcc",
    "role": "student",
    "email": "hoghcc@gmail.com",
    "status": "suspended",
    "program": "Associate"
  },
  {
    "name": "Olatayo Olatinwo",
    "role": "student",
    "email": "holla_tech@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "hon.jonajp",
    "role": "student",
    "email": "hon.jonajp@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "hongohrael",
    "role": "student",
    "email": "hongohrael@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "Hon.John Amah",
    "role": "student",
    "email": "honjohnamah@gmail.com",
    "status": "suspended"
  },
  {
    "name": "hope babi",
    "role": "student",
    "email": "hopebabi9@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Hosea Nyimjir",
    "role": "student",
    "email": "hoseanyimjir01@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Hombakazi Morrison",
    "role": "student",
    "email": "hoshmorr@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Science Christian Counseling &Psychology, Minor in Clinical Mental Health Counseling"
  },
  {
    "name": "hrm",
    "role": "student",
    "email": "hrm@manzinicity.co.sz",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "huzaifaayuba",
    "role": "student",
    "email": "huzaifaayuba@gmail.com",
    "status": "suspended"
  },
  {
    "name": "huzaifi5",
    "role": "student",
    "email": "huzaifi5@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Charity Yerima",
    "role": "student",
    "email": "hyelachardati91@gmail.com",
    "status": "suspended",
    "program": "Master of Science in Global Health Policy"
  },
  {
    "name": "i.muya.hbiu.health.addiction",
    "role": "student",
    "email": "i.muya.hbiu.health.addiction@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "iamchrisktivity",
    "role": "student",
    "email": "iamchrisktivity@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ibadinsonjennifer",
    "role": "student",
    "email": "ibadinsonjennifer@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ibiteyeisaac",
    "role": "student",
    "email": "ibiteyeisaac@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ibiteyeisaac",
    "role": "student",
    "email": "ibiteyeisaac@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ibiteyeolubunmi",
    "role": "student",
    "email": "ibiteyeolubunmi@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Oluwakemi Ibiteye",
    "role": "student",
    "email": "ibiteyeoluwakemi82@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ibrahim Musa Allie",
    "role": "student",
    "email": "ibmallie2017@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Daniel Ibok",
    "role": "student",
    "email": "ibokd820@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ibrahim077koroma",
    "role": "student",
    "email": "ibrahim077koroma@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Ibrahimah Zainab",
    "role": "student",
    "email": "ibrahimahzainab@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ibrahimhosea73",
    "role": "student",
    "email": "ibrahimhosea73@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ibrahimjgbondo2019",
    "role": "student",
    "email": "ibrahimjgbondo2019@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ibrahimjgbondo2019",
    "role": "student",
    "email": "ibrahimjgbondo2019@gmaol.com",
    "status": "suspended"
  },
  {
    "name": "ibrahimjgbondo2222",
    "role": "student",
    "email": "ibrahimjgbondo2222@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ibrahimjubril5547",
    "role": "student",
    "email": "ibrahimjubril5547@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Ibrahim Olatunbosun",
    "role": "student",
    "email": "ibrahimolatunbosun256@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Ibrahim Rogers",
    "role": "student",
    "email": "ibrahimrogers32634@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Ibrahim Turay",
    "role": "student",
    "email": "ibrahimturay559@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ibukun Babatunde",
    "role": "student",
    "email": "ibukunbabs0@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ibukunoluwa99698",
    "role": "student",
    "email": "ibukunoluwa99698@gmail.com",
    "status": "suspended"
  },
  {
    "name": "aaron ichado",
    "role": "student",
    "email": "ichadoaaron@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Alexander Idakwo",
    "role": "student",
    "email": "idakwoalex@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "idara11ebong",
    "role": "student",
    "email": "idara11ebong@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "I. A. Ebong",
    "role": "student",
    "email": "idebong@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "idogaloretta",
    "role": "student",
    "email": "idogaloretta@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Naomi Idoga",
    "role": "student",
    "email": "idoganaomi@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Emmanuel Idoko",
    "role": "student",
    "email": "idokoemmanuel012@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "idongesit obasi",
    "role": "student",
    "email": "idongesitobasi@gmail.com",
    "status": "suspended"
  },
  {
    "name": "idris iliyas",
    "role": "student",
    "email": "idrisiliyas100@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Idorenyin Abang",
    "role": "student",
    "email": "idyabang@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Ife Adewumi",
    "role": "student",
    "email": "ife.adewumi@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Ifedolapo Olawumi",
    "role": "student",
    "email": "ifedolawumi91@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ifemshelia",
    "role": "student",
    "email": "ifemshelia@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Ifeoluwa Alabi",
    "role": "student",
    "email": "ifeoluwaalabi2024@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ifeoluwagrace234",
    "role": "student",
    "email": "ifeoluwagrace234@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ifeoluwamshelia",
    "role": "student",
    "email": "ifeoluwamshelia@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Ifeoluwa Oluwaseun",
    "role": "student",
    "email": "ifeoluwaoluwaseun728@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ifeomaanumba2",
    "role": "student",
    "email": "ifeomaanumba2@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "IFEOMA MARCUS",
    "role": "student",
    "email": "ifeomamarcus09@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "IFEOMA NONYELUM EZE",
    "role": "student",
    "email": "ifeomanonyelumeze1@gmail.com",
    "status": "suspended",
    "program": "PhD in Business Administration"
  },
  {
    "name": "Ifeoma Orji",
    "role": "student",
    "email": "ifeomaorji606@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Ify Nonyeze",
    "role": "student",
    "email": "ifynonyeze@gmail.com",
    "status": "suspended"
  },
  {
    "name": "igbu blessing",
    "role": "student",
    "email": "igbublessing@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Oluwaseun IGE",
    "role": "student",
    "email": "igeoluwaseun@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Ignatius Henry Henlong",
    "role": "student",
    "email": "ighenlong@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Priscilla Igwe",
    "role": "student",
    "email": "igwepriscilla717@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ihejirikavictoria17",
    "role": "student",
    "email": "ihejirikavictoria17@gmail.com",
    "status": "suspended",
    "program": "BSC in Human services (Addiction and concentration)"
  },
  {
    "name": "ihialefrank",
    "role": "student",
    "email": "ihialefrank@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Apostle Ihitegbulem",
    "role": "student",
    "email": "ihitegbulemapostle@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ijanugadzama",
    "role": "student",
    "email": "ijanugadzama@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Isaac Ndanema",
    "role": "student",
    "email": "ijusu.ndanema@solidaridadnetwork.org",
    "status": "suspended",
    "program": "Bachelor in Theology and Ethics minor in Faith Based"
  },
  {
    "name": "Ikalone Udo",
    "role": "student",
    "email": "ikalone.udo@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ikeburuf",
    "role": "student",
    "email": "ikeburuf@gmail.com",
    "status": "suspended",
    "program": "Master of Public Administration MPA"
  },
  {
    "name": "Folorunsho Iledare",
    "role": "student",
    "email": "iledarefolorunsho@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ilesanmiadebola224",
    "role": "student",
    "email": "ilesanmiadebola224@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ilesanmitemidayo4",
    "role": "student",
    "email": "ilesanmitemidayo4@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ILISHA YAHAYA",
    "role": "student",
    "email": "ilishayahaya@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Alile Imade Rejoice, Phd Student",
    "role": "student",
    "email": "imaderejoicealile5@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Ima-owaji GS",
    "role": "student",
    "email": "imaowaji135@gmail.com",
    "status": "suspended",
    "program": "Law & Digital Tech."
  },
  {
    "name": "imegufriday",
    "role": "student",
    "email": "imegufriday@gmail.com",
    "status": "suspended"
  },
  {
    "name": "imoleoluwafemilemuel",
    "role": "student",
    "email": "imoleoluwafemilemuel@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Inakho",
    "role": "student",
    "email": "inakho170@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Inam Peter",
    "role": "student",
    "email": "inampeter34@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Inelo Ojoka",
    "role": "student",
    "email": "ineloojoka@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Patrick Inelo",
    "role": "student",
    "email": "inelopatrick22@gmail.com",
    "status": "suspended"
  },
  {
    "name": "infiniteeph320i",
    "role": "student",
    "email": "infiniteeph320i@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Oluwafemi Idowu",
    "role": "student",
    "email": "informfm@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ingyabeeior039",
    "role": "student",
    "email": "ingyabeeior039@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Itoro Iniodu",
    "role": "student",
    "email": "inioduitoro@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "innocentatsemudiara",
    "role": "student",
    "email": "innocentatsemudiara@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "inyangetekg",
    "role": "student",
    "email": "inyangetekg@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "iremideolla1",
    "role": "student",
    "email": "iremideolla1@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Irene Ogembo",
    "role": "student",
    "email": "irene.ogembo@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "irenemuya2010",
    "role": "student",
    "email": "irenemuya2010@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "irobotchris4u",
    "role": "student",
    "email": "irobotchris4u@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Adriel Irwin",
    "role": "student",
    "email": "irwinadriel746@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Issac Ezeagbor",
    "role": "student",
    "email": "isaac.charlesezeagbor@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "isaac.moses2002",
    "role": "student",
    "email": "isaac.moses2002@gmail.com",
    "status": "suspended"
  },
  {
    "name": "isaacchepsergon81",
    "role": "student",
    "email": "isaacchepsergon81@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "Francisca Isaac",
    "role": "student",
    "email": "isaacfrancisca@gmail.com",
    "status": "suspended"
  },
  {
    "name": "isaackandie951",
    "role": "student",
    "email": "isaackandie951@gmail.com",
    "status": "suspended"
  },
  {
    "name": "isaacmugabi444",
    "role": "student",
    "email": "isaacmugabi444@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "isaacnanzing30",
    "role": "student",
    "email": "isaacnanzing30@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ISAAC NEWTON",
    "role": "student",
    "email": "isaacnewtonodongo99@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Isaiah Donald",
    "role": "student",
    "email": "isaiahdonald244@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Science in Public Health"
  },
  {
    "name": "isatamatomambu01",
    "role": "student",
    "email": "isatamatomambu01@gmail.com",
    "status": "suspended"
  },
  {
    "name": "isatamatomambu26",
    "role": "student",
    "email": "isatamatomambu26@gmail.com",
    "status": "suspended"
  },
  {
    "name": "isatamatomambu",
    "role": "student",
    "email": "isatamatomambu@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Isatu Veronica Lucy Pyne",
    "role": "student",
    "email": "isatuveronicalucypyne@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "isedeendurance",
    "role": "student",
    "email": "isedeendurance@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ishakainfiniti",
    "role": "student",
    "email": "ishakainfiniti@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ishakat44",
    "role": "student",
    "email": "ishakat44@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ishakatejiriakpoyomare",
    "role": "student",
    "email": "ishakatejiriakpoyomare@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Hauwa Ishaya",
    "role": "student",
    "email": "ishayahauwa37@gmail.com",
    "status": "suspended",
    "program": "Certificate in project. Management and faith base leadership"
  },
  {
    "name": "isinkaye Anna",
    "role": "student",
    "email": "isinkayeanna6@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Isooba Janet",
    "role": "student",
    "email": "isoobajanet42@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "isoobasaul47",
    "role": "student",
    "email": "isoobasaul47@gmail.com",
    "status": "suspended"
  },
  {
    "name": "isoobasaul946",
    "role": "student",
    "email": "isoobasaul946@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Israel Kamara",
    "role": "student",
    "email": "israelkamara56@gmail.com",
    "status": "suspended"
  },
  {
    "name": "israelyrogah130",
    "role": "student",
    "email": "israelyrogah130@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "itagodfrey2009",
    "role": "student",
    "email": "itagodfrey2009@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "itedjereblessed",
    "role": "student",
    "email": "itedjereblessed@gmail.com",
    "status": "suspended"
  },
  {
    "name": "nancy Itodo",
    "role": "student",
    "email": "itodonancy@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ivy Solomon",
    "role": "student",
    "email": "ivyachevih@gmail.com",
    "status": "suspended",
    "program": "Professional PHD Counselor"
  },
  {
    "name": "Ivy Kalekye",
    "role": "student",
    "email": "ivykalekyembatha@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ivylancsnez",
    "role": "student",
    "email": "ivylancsnez@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "iwarmatthew60",
    "role": "student",
    "email": "iwarmatthew60@gmail.com",
    "status": "suspended"
  },
  {
    "name": "nwachukwu divine",
    "role": "student",
    "email": "iwuala4son@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "iyaboakin06",
    "role": "student",
    "email": "iyaboakin06@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Iyanuoluwa Afolayan",
    "role": "student",
    "email": "iyanuoluwaafolayan3@gmail.com",
    "status": "suspended"
  },
  {
    "name": "j.odas1246",
    "role": "student",
    "email": "j.odas1246@gmail.com",
    "status": "suspended"
  },
  {
    "name": "j_gicheha",
    "role": "student",
    "email": "j_gicheha@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "jabulile dambuza",
    "role": "student",
    "email": "jabuliledambuza9@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Jackline",
    "role": "student",
    "email": "jacklineakeyo56@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "jacksonstella131",
    "role": "student",
    "email": "jacksonstella131@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "jacksontatao",
    "role": "student",
    "email": "jacksontatao@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "Jacob Doku",
    "role": "student",
    "email": "jacobdoku06@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Bishop Jacob Ongala Owiti",
    "role": "student",
    "email": "jacobelizabeh@gmail.com",
    "status": "suspended"
  },
  {
    "name": "AYOBAMI OMOLE-IYAGIN",
    "role": "student",
    "email": "jacomolmedia@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "jaiyeolaayomide10",
    "role": "student",
    "email": "jaiyeolaayomide10@gmail.com",
    "status": "suspended"
  },
  {
    "name": "jallohhajamariama0",
    "role": "student",
    "email": "jallohhajamariama0@gmail.com",
    "status": "suspended",
    "program": "Bachelor's in divinity, major in clinical mental health counseling"
  },
  {
    "name": "Jalloh idrissa a",
    "role": "student",
    "email": "jallohiaa10310@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "jallokadijatu463",
    "role": "student",
    "email": "jallokadijatu463@gmail.com",
    "status": "suspended"
  },
  {
    "name": "James Adaji",
    "role": "student",
    "email": "jamesadaji4@gmail.com",
    "status": "suspended"
  },
  {
    "name": "James Akingbade",
    "role": "student",
    "email": "jamesakingbade26@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "James Bockarie",
    "role": "student",
    "email": "jamesbockarie1234@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Damilola James",
    "role": "student",
    "email": "jamesdamilola111@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "James Peter Kamara",
    "role": "student",
    "email": "jamespeterkamara@gmail.com",
    "status": "suspended",
    "program": "BSc Counseling and Psychology"
  },
  {
    "name": "Jane Nyaboke",
    "role": "student",
    "email": "jane.nyaboke@mohiafrica.org",
    "status": "suspended"
  },
  {
    "name": "jane wangusi",
    "role": "student",
    "email": "janelilumbi@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "Janet Mariatu Walters",
    "role": "student",
    "email": "janetmariatuwalters@gmail.com",
    "status": "suspended"
  },
  {
    "name": "janet rakiya",
    "role": "student",
    "email": "janetrakiya2019@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "janipherpadgett",
    "role": "student",
    "email": "janipherpadgett@gmail.com",
    "status": "suspended",
    "program": "Certificate"
  },
  {
    "name": "jaydenfrancess31",
    "role": "student",
    "email": "jaydenfrancess31@gmail.com",
    "status": "suspended",
    "program": "Bachelor of biblical studies major in education and ministry"
  },
  {
    "name": "jaydenpthompson07",
    "role": "student",
    "email": "jaydenpthompson07@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "OLUSOLA JAYEOLA",
    "role": "student",
    "email": "jayeolaolusola992@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Computer Science"
  },
  {
    "name": "Juwon Peters",
    "role": "student",
    "email": "jaywonluv31@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "jbukirwa646",
    "role": "student",
    "email": "jbukirwa646@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Joshua Creary",
    "role": "student",
    "email": "jcreary7@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Theology, Minor in Education"
  },
  {
    "name": "jedidahchepkorir60",
    "role": "student",
    "email": "jedidahchepkorir60@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Jeffrey Ishaku",
    "role": "student",
    "email": "jeffrey4ishaku@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Comfort Oluwapamilerinayo Jeje",
    "role": "student",
    "email": "jejecomfortoluwapamilerinayo@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Jeleel Asimiyu",
    "role": "student",
    "email": "jeleelasimiyu@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Jemimah Alayande",
    "role": "student",
    "email": "jemimahalayande@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Ann Jemmy",
    "role": "student",
    "email": "jemmygoko@gmail.com",
    "status": "suspended",
    "program": "Ba in Chaplaincy"
  },
  {
    "name": "Jennifer Mbogba",
    "role": "student",
    "email": "jennifermbogba532@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "jennifersam5678",
    "role": "student",
    "email": "jennifersam5678@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "jennybrown188",
    "role": "student",
    "email": "jennybrown188@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "jephthahwalters00",
    "role": "student",
    "email": "jephthahwalters00@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Jephthah Walters",
    "role": "student",
    "email": "jephthahwalters075@gmail.com",
    "status": "suspended",
    "program": "Bachelor's in Theology and Ethics, Minor in Faith-Based Leadership"
  },
  {
    "name": "jephthahwalters1",
    "role": "student",
    "email": "jephthahwalters1@gmail.com",
    "status": "suspended",
    "program": "Bachelor's in Theology and Ethics, Minor in Faith-Based Leadership"
  },
  {
    "name": "jeromeluka54",
    "role": "student",
    "email": "jeromeluka54@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Jerry Atoh",
    "role": "student",
    "email": "jerryatoh@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Excellence Jesuorobo",
    "role": "student",
    "email": "jesuoroboexcellence@gmail.com",
    "status": "suspended"
  },
  {
    "name": "jetsonnig",
    "role": "student",
    "email": "jetsonnig@gmail.com",
    "status": "suspended"
  },
  {
    "name": "jhaja3553",
    "role": "student",
    "email": "jhaja3553@gmail.com",
    "status": "suspended",
    "program": "Bachelor's in divinity, major in clinical mental health counseling"
  },
  {
    "name": "jharunajoshua4",
    "role": "student",
    "email": "jharunajoshua4@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Juliette Henry Kersaint",
    "role": "student",
    "email": "jhenry0216@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Jide Oyetade",
    "role": "student",
    "email": "jidecourtois01@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Jimba Nicodemus",
    "role": "student",
    "email": "jimbanicodemus6@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "jimohadebayo109",
    "role": "student",
    "email": "jimohadebayo109@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "jimohpeter092",
    "role": "student",
    "email": "jimohpeter092@gmail.com",
    "status": "suspended"
  },
  {
    "name": "RIDWAN JIMOH",
    "role": "student",
    "email": "jimohridoh1@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "jirnuya4jc",
    "role": "student",
    "email": "jirnuya4jc@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "jjmaitaleacademics",
    "role": "student",
    "email": "jjmaitaleacademics@gmail.com",
    "status": "suspended",
    "program": "Master of Science in Organizational Leadership, Minor in Faith-Based Nonprofit and Community Development"
  },
  {
    "name": "jkadijatu442",
    "role": "student",
    "email": "jkadijatu442@gmail.com",
    "status": "suspended",
    "program": "Bachelor's in Divinity, major in clinical mental health counseling"
  },
  {
    "name": "John Keifa Sheku",
    "role": "student",
    "email": "jks16022@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "John Mansaray",
    "role": "student",
    "email": "jmansaray035@gmail.com",
    "status": "suspended",
    "program": "Bachelor of biblical studies major in education and ministry"
  },
  {
    "name": "jmomodualbert",
    "role": "student",
    "email": "jmomodualbert@gmail.com",
    "status": "suspended"
  },
  {
    "name": "jmors80",
    "role": "student",
    "email": "jmors80@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Amadu Jmr Conteh",
    "role": "student",
    "email": "jmrconteha@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "joanachieng026",
    "role": "student",
    "email": "joanachieng026@gmail.com",
    "status": "suspended",
    "program": "Master&rsquo;s program in International Relations (Minor in Faith-Based Global Development and Diplomacy)"
  },
  {
    "name": "Bukirwa Joan",
    "role": "student",
    "email": "joanbukirwa36@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "joanbukirwa",
    "role": "student",
    "email": "joanbukirwa@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Anointed Joanna",
    "role": "student",
    "email": "joanecrawford44@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "joankerennduwa",
    "role": "student",
    "email": "joankerennduwa@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "joankoni15",
    "role": "student",
    "email": "joankoni15@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "jocyline karambu",
    "role": "student",
    "email": "jocylinekarambu@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "joe1ipenyi",
    "role": "student",
    "email": "joe1ipenyi@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "joeamsh",
    "role": "student",
    "email": "joeamsh@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "joeisacitysetonahillforever",
    "role": "student",
    "email": "joeisacitysetonahillforever@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Joel Oryem",
    "role": "student",
    "email": "joelcosoryem@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Science in Public Health"
  },
  {
    "name": "Joel Martins",
    "role": "student",
    "email": "joelm3200@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Joel Mbam",
    "role": "student",
    "email": "joelmbam2k@gmail.com",
    "status": "suspended"
  },
  {
    "name": "joeloryem23",
    "role": "student",
    "email": "joeloryem23@gmail.com",
    "status": "suspended",
    "program": "Bachelor Arts in Theology & Divinity"
  },
  {
    "name": "Joel Stewart",
    "role": "student",
    "email": "joelsmallstewart003@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "joesantus76",
    "role": "student",
    "email": "joesantus76@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Joff Mulenga",
    "role": "student",
    "email": "joffmulenga@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "johnandrea820",
    "role": "student",
    "email": "johnandrea820@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Emau john francis",
    "role": "student",
    "email": "johnfrancisemau@gmail.com",
    "status": "suspended"
  },
  {
    "name": "johnglamba59",
    "role": "student",
    "email": "johnglamba59@gmail.com",
    "status": "suspended"
  },
  {
    "name": "johnglamba",
    "role": "student",
    "email": "johnglamba@gmail.com",
    "status": "suspended"
  },
  {
    "name": "johnisreala1",
    "role": "student",
    "email": "johnisreala1@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "johnjuma744",
    "role": "student",
    "email": "johnjuma744@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "johnkuriakabachi",
    "role": "student",
    "email": "johnkuriakabachi@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Zion's City",
    "role": "student",
    "email": "johnlewis1221@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "johnlewis1222",
    "role": "student",
    "email": "johnlewis1222@gmail.com",
    "status": "suspended"
  },
  {
    "name": "John Enemona",
    "role": "student",
    "email": "johnmonument4@gmail.com",
    "status": "suspended"
  },
  {
    "name": "johnnyojwang73",
    "role": "student",
    "email": "johnnyojwang73@gmail.com",
    "status": "suspended",
    "program": "Education, Minor in Diverse Ministry Education"
  },
  {
    "name": "johnotieno599",
    "role": "student",
    "email": "johnotieno599@gmail.com",
    "status": "suspended",
    "program": "Bachelor in Addiction Counseling- Minor: Christian Counseling Foundation"
  },
  {
    "name": "Obialor Johnpaul",
    "role": "student",
    "email": "johnpaulobialor@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Consie",
    "role": "student",
    "email": "johnsoncostance2020@gmail.com",
    "status": "suspended"
  },
  {
    "name": "johnsondayo2026",
    "role": "student",
    "email": "johnsondayo2026@gmail.com",
    "status": "suspended",
    "program": "Master's of Arts in Community Leadership, Minor in Christian Ministry Studies"
  },
  {
    "name": "Serena Johnson-Myrie",
    "role": "student",
    "email": "johnsonserena195@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Tosin Praise",
    "role": "student",
    "email": "joluwatosin4@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "John Oji",
    "role": "student",
    "email": "jomkeeoji@gmail.com",
    "status": "suspended"
  },
  {
    "name": "jomoejeh",
    "role": "student",
    "email": "jomoejeh@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "jonafather.jp",
    "role": "student",
    "email": "jonafather.jp@gmail.com",
    "status": "suspended",
    "program": "MSc Rehabilitation Counseling"
  },
  {
    "name": "Jonah Inwang",
    "role": "student",
    "email": "jonahinwang@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "jonathanabu001",
    "role": "student",
    "email": "jonathanabu001@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "jonathanabu18",
    "role": "student",
    "email": "jonathanabu18@gmail.com",
    "status": "suspended"
  },
  {
    "name": "jonathanyohanna775",
    "role": "student",
    "email": "jonathanyohanna775@gmail.com",
    "status": "suspended"
  },
  {
    "name": "jonesdeni",
    "role": "student",
    "email": "jonesdeni@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "jonrut09",
    "role": "student",
    "email": "jonrut09@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "joramdesign95",
    "role": "student",
    "email": "joramdesign95@gmail.com",
    "status": "suspended"
  },
  {
    "name": "joramdesign95",
    "role": "student",
    "email": "joramdesign95@mail.com",
    "status": "suspended"
  },
  {
    "name": "Deborah Joseph",
    "role": "student",
    "email": "josebbyme@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Josenta Elliott",
    "role": "student",
    "email": "josentaelliott@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "joseph.hbiu",
    "role": "student",
    "email": "joseph.hbiu@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Joseph Adeniyi",
    "role": "student",
    "email": "joseph104adeniyi@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Joseph Ebeni",
    "role": "student",
    "email": "josephebeni@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Joseph Felix",
    "role": "student",
    "email": "josephfelix1850@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "josephhbiu",
    "role": "student",
    "email": "josephhbiu@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Namugenyi Josephine",
    "role": "student",
    "email": "josephinenamugenyi61@gmail.com",
    "status": "suspended",
    "program": "PhD in Psychology (Minor in Faith-Based Mental Health Advocacy)"
  },
  {
    "name": "josephineormye",
    "role": "student",
    "email": "josephineormye@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Joseph Stephen",
    "role": "student",
    "email": "josephstephen476@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Joseph Tarawalie",
    "role": "student",
    "email": "josephtarawalie772@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Josephus Emmanuel Foday Ansumana",
    "role": "student",
    "email": "josephusemmanuelfodayansumana@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "josephyawma8",
    "role": "student",
    "email": "josephyawma8@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Dike Joshua",
    "role": "student",
    "email": "joshdyke373@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "joshuaaderibigbe6",
    "role": "student",
    "email": "joshuaaderibigbe6@gmail.com",
    "status": "suspended"
  },
  {
    "name": "joshuaanointed50",
    "role": "student",
    "email": "joshuaanointed50@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Joshua Samaila",
    "role": "student",
    "email": "joshuasamaila922412@gmail.com",
    "status": "suspended"
  },
  {
    "name": "joshuv037",
    "role": "student",
    "email": "joshuv037@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Science in IT Support, Minor in Technology Management for Faith-Based Organizations"
  },
  {
    "name": "Ateng Josiah",
    "role": "student",
    "email": "josiahateng20@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "jotunrayo02",
    "role": "student",
    "email": "jotunrayo02@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Joyce Arum",
    "role": "student",
    "email": "joycearum76@gmail.com",
    "status": "suspended",
    "program": "Masters"
  },
  {
    "name": "joycegoriola",
    "role": "student",
    "email": "joycegoriola@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Joyce Poplar",
    "role": "student",
    "email": "joycelovelyb@gmail.com",
    "status": "suspended"
  },
  {
    "name": "joyemmanuelekama",
    "role": "student",
    "email": "joyemmanuelekama@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Joy HBI Courses",
    "role": "student",
    "email": "joyhbicourses@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Joy Mutinda",
    "role": "student",
    "email": "joyhbiu@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "joyjesuorobo04",
    "role": "student",
    "email": "joyjesuorobo04@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "joylahai123joy",
    "role": "student",
    "email": "joylahai123joy@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Joy Nkem",
    "role": "student",
    "email": "joynkem97@gmail.com",
    "status": "suspended"
  },
  {
    "name": "JOY OCHIM",
    "role": "student",
    "email": "joyochim0903@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "joyousid3003",
    "role": "student",
    "email": "joyousid3003@gmail.com",
    "status": "suspended"
  },
  {
    "name": "joysilverbirdgroup",
    "role": "student",
    "email": "joysilverbirdgroup@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Folashade Jroft",
    "role": "student",
    "email": "jroft1@gmail.com",
    "status": "suspended",
    "program": "Master of Science in Organizational Leadership, Minor in Nonprofit Administration"
  },
  {
    "name": "James Rogen",
    "role": "student",
    "email": "jrogen87@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Timilehin Johnson",
    "role": "student",
    "email": "jtimilehin844@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Juante",
    "role": "student",
    "email": "juantejuante30@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "JUBULSON",
    "role": "student",
    "email": "jubulson01@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Judith Williams",
    "role": "student",
    "email": "jud214114@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Jude Isienyi",
    "role": "student",
    "email": "judeisienyi1972@gmail.com",
    "status": "suspended"
  },
  {
    "name": "judeisienyi",
    "role": "student",
    "email": "judeisienyi@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Judith Juma",
    "role": "student",
    "email": "judithijuma@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Judith Oguche",
    "role": "student",
    "email": "judithoguche@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "jugu",
    "role": "student",
    "email": "jugu@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Julius Adegunna",
    "role": "student",
    "email": "juliusadegunna3@gmail.com",
    "status": "suspended",
    "program": "MA in Community Leadership"
  },
  {
    "name": "Juma Yvonne",
    "role": "student",
    "email": "juma49260@gmail.com",
    "status": "suspended"
  },
  {
    "name": "jumbolee.jb",
    "role": "student",
    "email": "jumbolee.jb@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "jummyp Jade",
    "role": "student",
    "email": "jummypjade@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "uju okeke",
    "role": "student",
    "email": "jumyfrank70@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "jushdoko",
    "role": "student",
    "email": "jushdoko@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "justforsegeluwe",
    "role": "student",
    "email": "justforsegeluwe@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "justinaokonkwo15",
    "role": "student",
    "email": "justinaokonkwo15@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "justinidara",
    "role": "student",
    "email": "justinidara@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "NAIRUBA SHELLY JUSTINE",
    "role": "student",
    "email": "justnairuba.shelly@gmail.com",
    "status": "suspended"
  },
  {
    "name": "justus.ondiek53",
    "role": "student",
    "email": "justus.ondiek53@gmail.com",
    "status": "suspended"
  },
  {
    "name": "JUSTINA MAYOWA",
    "role": "student",
    "email": "justymayowa@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Juwan Jane",
    "role": "student",
    "email": "juwanjane211@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "juwan jane",
    "role": "student",
    "email": "juwanjane80@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "jxc60000",
    "role": "student",
    "email": "jxc60000@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Anthony Kabia",
    "role": "student",
    "email": "kabiaanthony@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "kabiamonica3",
    "role": "student",
    "email": "kabiamonica3@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "kachallahassan",
    "role": "student",
    "email": "kachallahassan@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Kadiatu A Kamara",
    "role": "student",
    "email": "kadiatuakamara56@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Kadiatu Sesay",
    "role": "student",
    "email": "kadiatuibrahimsesay747@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Kadiatu Rogers",
    "role": "student",
    "email": "kadiaturogers866@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Kafayat Laoye",
    "role": "student",
    "email": "kafayatlaoye@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Josephine Kaindaneh",
    "role": "student",
    "email": "kaindanehjosephine72@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "kaindanehjosephineh",
    "role": "student",
    "email": "kaindanehjosephineh@72gmail.com",
    "status": "suspended"
  },
  {
    "name": "Janet sebatu Kaindeneh",
    "role": "student",
    "email": "kaindenehjanetsebatu@gmail.com",
    "status": "suspended"
  },
  {
    "name": "kamonaketsana",
    "role": "student",
    "email": "kamonaketsana@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ebere Anthonia",
    "role": "student",
    "email": "kamsipascal2016@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Foday Kanneh",
    "role": "student",
    "email": "kanneh206@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Kanu Anthony Chikodi",
    "role": "student",
    "email": "kanuanthonychikodi@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "kanuassif08",
    "role": "student",
    "email": "kanuassif08@gmail.com",
    "status": "suspended",
    "program": "Bachelor of mental health counseling"
  },
  {
    "name": "kaptaein",
    "role": "student",
    "email": "kaptaein@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "kareemwale72",
    "role": "student",
    "email": "kareemwale72@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Karel Musa Muyulenu",
    "role": "student",
    "email": "karel.musa.muyulenu@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Karen Morais",
    "role": "student",
    "email": "karen.queenfish@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "karenkutuh78",
    "role": "student",
    "email": "karenkutuh78@gmail.com",
    "status": "suspended",
    "program": "MASTER OF PUBLIC ADMINISTRATION MPA) MINOR: NONPROFIT & FAITH BASED LEADERSHIP"
  },
  {
    "name": "Irene J.kariuki",
    "role": "student",
    "email": "kariukiirene001@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Karla",
    "role": "student",
    "email": "karlamcchambers@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Francis Karobia",
    "role": "student",
    "email": "karobiafranco@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Science in Christian Psychology"
  },
  {
    "name": "kateejongunique",
    "role": "student",
    "email": "kateejongunique@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "katesmyles",
    "role": "student",
    "email": "katesmyles@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Kayamulum Patrick",
    "role": "student",
    "email": "kayamulumpatrick@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Anna-kay Broderick",
    "role": "student",
    "email": "kayannabroderick321@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Kayode Olajide",
    "role": "student",
    "email": "kayhamng@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Kari Kay",
    "role": "student",
    "email": "kaykari194@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Akanni Kayode",
    "role": "student",
    "email": "kayodeakanni2020@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Sunday Manya",
    "role": "student",
    "email": "kazachatmanya@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Kaze Trisha",
    "role": "student",
    "email": "kazemarietricia12@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Keith Kanabeesa",
    "role": "student",
    "email": "keithkanabeesa@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "kellyelaiho",
    "role": "student",
    "email": "kellyelaiho@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Emmanuel Kipkirui",
    "role": "student",
    "email": "kemboi64manu@gmail.com",
    "status": "suspended"
  },
  {
    "name": "kemiawolu2018",
    "role": "student",
    "email": "kemiawolu2018@gmail.com",
    "status": "suspended",
    "program": "Master of Public Administration (MPA), Minor in Nonprofit & Faith Based Leadership"
  },
  {
    "name": "kemidear05",
    "role": "student",
    "email": "kemidear05@gmail.com",
    "status": "suspended",
    "program": "COLLEGE OF LEADERSHIP"
  },
  {
    "name": "Oluwakemi ogunleye",
    "role": "student",
    "email": "kemidunni@gmail.com",
    "status": "suspended"
  },
  {
    "name": "oluwakemi Akawazi",
    "role": "student",
    "email": "kemmymary1731@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Prisca Kenga",
    "role": "student",
    "email": "kengaprisca01@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ken eris",
    "role": "student",
    "email": "kenikool@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "kennethddamulira",
    "role": "student",
    "email": "kennethddamulira@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "keturah yakubu",
    "role": "student",
    "email": "keturahyakubu@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "kevin lukonyi",
    "role": "student",
    "email": "kevinlukonyi@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "AJAYI KEHINDE",
    "role": "student",
    "email": "kexoajax@gmail.com",
    "status": "suspended"
  },
  {
    "name": "kgadzama",
    "role": "student",
    "email": "kgadzama@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Khadijah Salaudeen",
    "role": "student",
    "email": "khadijahsalaudeen@gmail.com",
    "status": "suspended"
  },
  {
    "name": "khumalothobo9",
    "role": "student",
    "email": "khumalothobo9@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "kiariemw58",
    "role": "student",
    "email": "kiariemw58@gmail.com",
    "status": "suspended",
    "program": "PhD in Theology and Ethics (Minor in Faith-Based Leadership)"
  },
  {
    "name": "kibwotafrancis137",
    "role": "student",
    "email": "kibwotafrancis137@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "kikelomobukkie200",
    "role": "student",
    "email": "kikelomobukkie200@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "kikelomoojobukola",
    "role": "student",
    "email": "kikelomoojobukola@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Kimberly Henlon",
    "role": "student",
    "email": "kimberlyt.henlon@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "william kimutai",
    "role": "student",
    "email": "kimutaiw47@gmail.com",
    "status": "suspended"
  },
  {
    "name": "william kimutai",
    "role": "student",
    "email": "kimutaiwilliam10@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Kinda Jackson Cyrus",
    "role": "student",
    "email": "kindajacksoncyrus@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Benjamin Gomez",
    "role": "student",
    "email": "kingbengomez2007@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "kingoluleye",
    "role": "student",
    "email": "kingoluleye@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Owen King'oro",
    "role": "student",
    "email": "kingoroowen29@gmail.com",
    "status": "suspended"
  },
  {
    "name": "kingsleyduniya",
    "role": "student",
    "email": "kingsleyduniya@gmail.com",
    "status": "suspended",
    "program": "MA Strategic Leadership Minor: Christian Leadership & Ethics"
  },
  {
    "name": "kingsylv1704",
    "role": "student",
    "email": "kingsylv1704@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Kingsley Kem",
    "role": "student",
    "email": "kingzomatik@gmail.com",
    "status": "suspended"
  },
  {
    "name": "kiomeericthuranira",
    "role": "student",
    "email": "kiomeericthuranira@gmail.co.com",
    "status": "suspended"
  },
  {
    "name": "Emmanuel Kipkirui",
    "role": "student",
    "email": "kipkiruie609@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "kiplangatezra668",
    "role": "student",
    "email": "kiplangatezra668@gmail.com",
    "status": "suspended"
  },
  {
    "name": "kiplangatkoechvic",
    "role": "student",
    "email": "kiplangatkoechvic@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Prof. Marx Korir",
    "role": "student",
    "email": "kiprotichkorir1998@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "kipsangkk581",
    "role": "student",
    "email": "kipsangkk581@gmail.com",
    "status": "suspended"
  },
  {
    "name": "GIBSON (Min royal)",
    "role": "student",
    "email": "kiptoogibson9@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Martha Perfect",
    "role": "student",
    "email": "kirungimartha6@gmail.com",
    "status": "suspended"
  },
  {
    "name": "KITUMBA ABUBAKER",
    "role": "student",
    "email": "kitumbaemmanuel@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "kjunior7092",
    "role": "student",
    "email": "kjunior7092@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "TEMIDAYO ENY",
    "role": "student",
    "email": "klioe.eny@gmail.com",
    "status": "suspended"
  },
  {
    "name": "kllekwa",
    "role": "student",
    "email": "kllekwa@gmail.com",
    "status": "suspended",
    "program": "MASTER OF PUBLIC ADMINISTRATION(MPA), MINOR NON PROFIT AND FAITH BASED LEADERSHIP"
  },
  {
    "name": "Kholisile maneli",
    "role": "student",
    "email": "kmaneli@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "kmilka351",
    "role": "student",
    "email": "kmilka351@gmail.com",
    "status": "suspended",
    "program": "Humanitarian and Conflict response"
  },
  {
    "name": "Muwanga Kenneth",
    "role": "student",
    "email": "kmuwanga@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Karen Nekesa",
    "role": "student",
    "email": "kneks.nick@gmail.com",
    "status": "suspended"
  },
  {
    "name": "knightobrien9",
    "role": "student",
    "email": "knightobrien9@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Ayanfeoluwa Kolade",
    "role": "student",
    "email": "koladeayanlove@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Korede Olafimihan",
    "role": "student",
    "email": "kolaf2003@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Kolawole Olalekan Emmanuel",
    "role": "student",
    "email": "kolawoleolalekan07@gmail.com",
    "status": "suspended",
    "program": "Master of Organizational Leadership, Minor in Christian Ethics"
  },
  {
    "name": "kolawoleoyedokun",
    "role": "student",
    "email": "kolawoleoyedokun@yahoo.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Rowhan Kordom",
    "role": "student",
    "email": "kordomrowhan@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "koresntetia",
    "role": "student",
    "email": "koresntetia@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Amos Korir",
    "role": "student",
    "email": "koriramos@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Praise Korir",
    "role": "student",
    "email": "korirpraise9@gmail.com",
    "status": "suspended"
  },
  {
    "name": "kp0097906",
    "role": "student",
    "email": "kp0097906@gamil.com",
    "status": "suspended"
  },
  {
    "name": "Isatu Kpandemba Patricia",
    "role": "student",
    "email": "kpandembapatriciaisatu@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "krabasiako",
    "role": "student",
    "email": "krabasiako@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Kopo Rasebokwana",
    "role": "student",
    "email": "krasebokwana@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "kylsy syga",
    "role": "student",
    "email": "krazman001@gmail.com",
    "status": "suspended",
    "program": "MSC Organisational leadership"
  },
  {
    "name": "krystyn jorams",
    "role": "student",
    "email": "krystynjorams18@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "kuchelithsajou",
    "role": "student",
    "email": "kuchelithsajou@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "kudostravelsltd",
    "role": "student",
    "email": "kudostravelsltd@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "kuhlemadlavu8",
    "role": "student",
    "email": "kuhlemadlavu8@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Kuukua Nyamekye",
    "role": "student",
    "email": "kuukiiieee@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Lateef Kuye",
    "role": "student",
    "email": "kuyelateef384@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "kwaprepcharles",
    "role": "student",
    "email": "kwaprepcharles@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Kola Wole",
    "role": "student",
    "email": "kwole04@gmail.com",
    "status": "suspended"
  },
  {
    "name": "kyasimad",
    "role": "student",
    "email": "kyasimad@gmail.com",
    "status": "suspended"
  },
  {
    "name": "kylcedeca",
    "role": "student",
    "email": "kylcedeca@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "kyle stone",
    "role": "student",
    "email": "kylestone17@hotmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "kylsysygakogbara",
    "role": "student",
    "email": "kylsysygakogbara@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "labatalk1256",
    "role": "student",
    "email": "labatalk1256@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ladi Nuhu",
    "role": "student",
    "email": "ladinuhu7@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Lahai Samuel Lamin",
    "role": "student",
    "email": "lahailamin73@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Sama Lahai",
    "role": "student",
    "email": "lahaisama111@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "lakangideon",
    "role": "student",
    "email": "lakangideon@gmail.com",
    "status": "suspended",
    "program": "MASTER OF PUBLIC ADMINISTRATION (MPA), MINOR IN NON PROFIT & FAITH BASED LEADERSHIP"
  },
  {
    "name": "lamboisaidu052",
    "role": "student",
    "email": "lamboisaidu052@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Saidu Lamboi",
    "role": "student",
    "email": "lamboisaidu1@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Laoye Lateefah",
    "role": "student",
    "email": "laoyelateefah21@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Oluwatobi Akintayo",
    "role": "student",
    "email": "larry4urluv@gmail.com",
    "status": "suspended"
  },
  {
    "name": "larryval83",
    "role": "student",
    "email": "larryval83@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "lattiroofe",
    "role": "student",
    "email": "lattiroofe@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Chepkirui Laureen",
    "role": "student",
    "email": "laureenchepkirui150@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Agribusiness, minor in Non-profit sustainable and community Development"
  },
  {
    "name": "Lawal Modupe",
    "role": "student",
    "email": "lawalbukolamodupe@gmail.com",
    "status": "suspended",
    "program": "Bachelor Of Business Administration in project management minor in biblical business principles"
  },
  {
    "name": "Lawal modupe Bukola",
    "role": "student",
    "email": "lawalmodupebukola@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "LAWRENCE PIUS BALLAT",
    "role": "student",
    "email": "lawrencepiusballat@gmail.com",
    "status": "suspended"
  },
  {
    "name": "lbhassan22",
    "role": "student",
    "email": "lbhassan22@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ldean5786",
    "role": "student",
    "email": "ldean5786@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "leksan2016",
    "role": "student",
    "email": "leksan2016@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "leokipsoasis2",
    "role": "student",
    "email": "leokipsoasis2@gmail.com",
    "status": "suspended"
  },
  {
    "name": "leoneexplora",
    "role": "student",
    "email": "leoneexplora@gmail.com",
    "status": "suspended"
  },
  {
    "name": "leshaunah",
    "role": "student",
    "email": "leshaunahyoung@gmail.com",
    "status": "suspended",
    "program": "Bachelor of divinity minor in counseling"
  },
  {
    "name": "Eliud Ndungu",
    "role": "student",
    "email": "liendungu222@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Light Iheanacho",
    "role": "student",
    "email": "lightiheanacho090@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Likhona Mcukulwa",
    "role": "student",
    "email": "likhonamcukulwa60@gmail.com",
    "status": "suspended"
  },
  {
    "name": "lilianmomah",
    "role": "student",
    "email": "lilianmomah@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Lilian Tyosar",
    "role": "student",
    "email": "liliantyosar@gmail.com",
    "status": "suspended"
  },
  {
    "name": "LINDA GODSON",
    "role": "student",
    "email": "lindagodson98@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "lindasaffiesawaneh",
    "role": "student",
    "email": "lindasaffiesawaneh@gmail.com",
    "status": "suspended"
  },
  {
    "name": "LINDA SAFFIE SAWANEH",
    "role": "student",
    "email": "lindasaffiesawneh@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Lindiwe Dlamini",
    "role": "student",
    "email": "lindiwedlamini557@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Dickson Gabriel",
    "role": "student",
    "email": "linkdickson4me@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Xoliswa Dube",
    "role": "student",
    "email": "liswadube@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "litestudios54",
    "role": "student",
    "email": "litestudios54@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "livingancestorpatrick",
    "role": "student",
    "email": "livingancestorpatrick@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "livingseedvent",
    "role": "student",
    "email": "livingseedvent@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Lloyd Lomayiana",
    "role": "student",
    "email": "lloydloma@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Lyle Philander",
    "role": "student",
    "email": "llp21adx@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Lukhona Somhaya",
    "role": "student",
    "email": "lmsomhaya@gmail.com",
    "status": "suspended"
  },
  {
    "name": "loischigbu.clc",
    "role": "student",
    "email": "loischigbu.clc@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Zururat Zubair",
    "role": "student",
    "email": "lolaromoke@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Laurel Tshabangu",
    "role": "student",
    "email": "lolo.laurel@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Lomayiana",
    "role": "student",
    "email": "lomayiana810@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "lordvjr",
    "role": "student",
    "email": "lordvjr@gmail.com",
    "status": "suspended"
  },
  {
    "name": "lotymufuta",
    "role": "student",
    "email": "lotymufuta@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "loveradge",
    "role": "student",
    "email": "loveradge@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Manja Lebbie",
    "role": "student",
    "email": "lovesave8250@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "lindah phepisi",
    "role": "student",
    "email": "lphepisi@gmail.com",
    "status": "suspended",
    "program": "Bachelor of science (Bsc) Christian counseling and psychology in faith-based mental health"
  },
  {
    "name": "ltanyala37",
    "role": "student",
    "email": "ltanyala37@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Science in Rehabilitation Services with addition focus and a minor Interfaith Chaplaincy Studies"
  },
  {
    "name": "Lucia Dakowa",
    "role": "student",
    "email": "luciadakowa56@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "luciaoanthony82",
    "role": "student",
    "email": "luciaoanthony82@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "lukantioks",
    "role": "student",
    "email": "lukantioks@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Lulama Sibeko",
    "role": "student",
    "email": "lulu.sibeko@gmail.com",
    "status": "suspended"
  },
  {
    "name": "luswestiinvestment",
    "role": "student",
    "email": "luswestiinvestment@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Lusweti Investment",
    "role": "student",
    "email": "luswetiinvestment@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Lutaaya Pius",
    "role": "student",
    "email": "lutaaya.pius1@gmail.com",
    "status": "suspended"
  },
  {
    "name": "luvlyshade",
    "role": "student",
    "email": "luvlyshade@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "luvlyshadehbi",
    "role": "student",
    "email": "luvlyshadehbi@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "lwaeba2016",
    "role": "student",
    "email": "lwaeba2016@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "lware049",
    "role": "student",
    "email": "lware049@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Chidiebere Lydia",
    "role": "student",
    "email": "lydiachidiebere9@gmail.com",
    "status": "suspended"
  },
  {
    "name": "lysekaddysenghore25",
    "role": "student",
    "email": "lysekaddysenghore25@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Lyse Kaddy Senghore",
    "role": "student",
    "email": "lysekaddysenghore3@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Martin Katewu Opio",
    "role": "student",
    "email": "m.opio2hal@gmail.com",
    "status": "suspended",
    "program": "PhD in Public Leadership and Administration minor in Faith Informed administration"
  },
  {
    "name": "Mabel Sylvalie",
    "role": "student",
    "email": "mabelsylvalie35@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Raymond Mabruck",
    "role": "student",
    "email": "mabruckr@gmail.com",
    "status": "suspended"
  },
  {
    "name": "madamireneauma",
    "role": "student",
    "email": "madamireneauma@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Madeline Gomez",
    "role": "student",
    "email": "madelinegomez672@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "madeline Gomez",
    "role": "student",
    "email": "madelinegomez955@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Micheal Adenibuyan",
    "role": "student",
    "email": "madenibuyan@gmail.com",
    "status": "suspended"
  },
  {
    "name": "madosinis",
    "role": "student",
    "email": "madosinis@gmail.com",
    "status": "suspended"
  },
  {
    "name": "maduakolamj",
    "role": "student",
    "email": "maduakolamj@991.com",
    "status": "suspended"
  },
  {
    "name": "maduakolamjoy96",
    "role": "student",
    "email": "maduakolamjoy96@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Mercy Maduakolam",
    "role": "student",
    "email": "maduakolammercy3@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "MAGAJI Ayok",
    "role": "student",
    "email": "magajiayok@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Maggie W",
    "role": "student",
    "email": "maggiewarutere@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "margaret kimani",
    "role": "student",
    "email": "maggikimani@gmail.com",
    "status": "suspended"
  },
  {
    "name": "NWAONU CHIDIEBERE FELIX",
    "role": "student",
    "email": "mail2ekee@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "maisharobert",
    "role": "student",
    "email": "maisharobert@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "majindadi360",
    "role": "student",
    "email": "majindadi360@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "majwedeathule90",
    "role": "student",
    "email": "majwedeathule90@gmail.com",
    "status": "suspended"
  },
  {
    "name": "makindeoluwakemi98",
    "role": "student",
    "email": "makindeoluwakemi98@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Daniel Simiyu (D.M.S)",
    "role": "student",
    "email": "makondidaniel@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "malachiphilipc",
    "role": "student",
    "email": "malachiphilipc@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "malakcablake444",
    "role": "student",
    "email": "malakcablake444@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Malcolm Baxter",
    "role": "student",
    "email": "malcolmbaxter128@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Mambo Oluwatoyin",
    "role": "student",
    "email": "mambtoy458@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Isata Mambu",
    "role": "student",
    "email": "mambuisata096@gmail.com",
    "status": "suspended"
  },
  {
    "name": "mambuisatamato26",
    "role": "student",
    "email": "mambuisatamato26@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Isata mato Mambu",
    "role": "student",
    "email": "mambuisatamato@gmail.com",
    "status": "suspended",
    "program": "Bachelor in divinity major in clinical mental health counseling"
  },
  {
    "name": "Faith Mamma",
    "role": "student",
    "email": "mammafaithful@gmail.com",
    "status": "suspended"
  },
  {
    "name": "MANJA LEBBIE",
    "role": "student",
    "email": "manjafaithlebbie@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "sylvanus mansaray",
    "role": "student",
    "email": "mansaraysylvanus35@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "mansur kalgo",
    "role": "student",
    "email": "mansurbellokalgo@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Peter Msoma",
    "role": "student",
    "email": "mapalala2010@gmail.com",
    "status": "suspended"
  },
  {
    "name": "marambomoses",
    "role": "student",
    "email": "marambomoses@yahoo.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Marcus chukwuebuka Marcus",
    "role": "student",
    "email": "marcuschukwuebukamarcus@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "marcusomokhuale",
    "role": "student",
    "email": "marcusomokhuale@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "marea.mokwena",
    "role": "student",
    "email": "marea.mokwena@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Samuel Margai",
    "role": "student",
    "email": "margaisamuel32@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Margaret Odama",
    "role": "student",
    "email": "margaretodama45@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Margaret Olla",
    "role": "student",
    "email": "margaretolla61@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Mariam Adebusayo Ibrahim",
    "role": "student",
    "email": "mariamadebusayoibrahim@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "mariamdairo",
    "role": "student",
    "email": "mariamdairo@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Mariatou Kamara",
    "role": "student",
    "email": "mariatoukamara5@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Marie Louise Gomez",
    "role": "student",
    "email": "marielouiseg265@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "mariiaisaac85",
    "role": "student",
    "email": "mariiaisaac85@gmail.com",
    "status": "suspended"
  },
  {
    "name": "mariita Isaac",
    "role": "student",
    "email": "mariitaisaac85@gmail.com",
    "status": "suspended",
    "program": "Bachelor of arts in Christian leadership and cultural management"
  },
  {
    "name": "marionsonitakamara123",
    "role": "student",
    "email": "marionsonitakamara123@gmail.com",
    "status": "suspended"
  },
  {
    "name": "marizu.ijeri",
    "role": "student",
    "email": "marizu.ijeri@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "Marjah Achiya",
    "role": "student",
    "email": "marjahachiya@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "markushabila92",
    "role": "student",
    "email": "markushabila92@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Martha Mutanu",
    "role": "student",
    "email": "marthamutanu397@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "marthaubo",
    "role": "student",
    "email": "marthaubo@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "martin.adams",
    "role": "student",
    "email": "martin.adams@manzinicity.co.sz",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "martinanih41",
    "role": "student",
    "email": "martinanih41@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Martinet Linus",
    "role": "student",
    "email": "martinetlinus@gmail.com",
    "status": "suspended"
  },
  {
    "name": "martinkingoro",
    "role": "student",
    "email": "martinkingoro@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "martoh77",
    "role": "student",
    "email": "martoh77@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Arts in Theology"
  },
  {
    "name": "martychioms74",
    "role": "student",
    "email": "martychioms74@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "martychioms",
    "role": "student",
    "email": "martychioms@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Marvins",
    "role": "student",
    "email": "marvedward2009@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Marv E",
    "role": "student",
    "email": "marvedward2@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Chinwe Marvellous",
    "role": "student",
    "email": "marvelgist@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "marvellous koffa",
    "role": "student",
    "email": "marvellouskoffa814@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Marvelous Emeka (Ayanfejesu)",
    "role": "student",
    "email": "marvelousemek234@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Olanrewaju Marvelous",
    "role": "student",
    "email": "marvelousolanrewaju80@gmail.com",
    "status": "suspended",
    "program": "Master of Life Coaching Minor: Faith-Based Counseling & Mentoring"
  },
  {
    "name": "Oluwadarasimi Marvelous",
    "role": "student",
    "email": "marvelousoluwadarasimi7@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Maryann",
    "role": "student",
    "email": "maryannojukwu@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "marygitau35",
    "role": "student",
    "email": "marygitau35@yahoo.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "maryn799",
    "role": "student",
    "email": "maryn799@gmail.com",
    "status": "suspended",
    "program": "Bachelor Bachelor of science in christian counseling and psychology course"
  },
  {
    "name": "Mary Kamau",
    "role": "student",
    "email": "marynyamburak303@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "marysarki5550",
    "role": "student",
    "email": "marysarki5550@gmail.com",
    "status": "suspended"
  },
  {
    "name": "marytaiwo963",
    "role": "student",
    "email": "marytaiwo963@gmail.com",
    "status": "suspended",
    "program": "MASTER"
  },
  {
    "name": "Baphelele Masilela",
    "role": "student",
    "email": "masilelabaphelele3@gmail.com",
    "status": "suspended"
  },
  {
    "name": "masonkobob77",
    "role": "student",
    "email": "masonkobob77@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Jeremiah Massaquoi",
    "role": "student",
    "email": "massaquoijy70@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "mathewsegun590",
    "role": "student",
    "email": "mathewsegun590@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Faith Mathias",
    "role": "student",
    "email": "mathiastasel@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Matilda Tucker",
    "role": "student",
    "email": "matildatucker2006@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Mathew Odama",
    "role": "student",
    "email": "matodama1@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Abobawaye Matthew",
    "role": "student",
    "email": "matthewabobawaye@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Adejumo Matthew",
    "role": "student",
    "email": "matthewadejumo871@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "matthewdanboyi",
    "role": "student",
    "email": "matthewdanboyi@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "matthewojo197",
    "role": "student",
    "email": "matthewojo197@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Kenneth Mattia",
    "role": "student",
    "email": "mattiakenneth@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "maureendom40",
    "role": "student",
    "email": "maureendom40@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Maureen Moore",
    "role": "student",
    "email": "maureenmoore819@gmail.com",
    "status": "suspended"
  },
  {
    "name": "maurixxy",
    "role": "student",
    "email": "maurixxy@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "mayahpee247",
    "role": "student",
    "email": "mayahpee247@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "mayaumasigati",
    "role": "student",
    "email": "mayaumasigati@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "Mayo John",
    "role": "student",
    "email": "mayojohn086@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "mayorthegreat2016",
    "role": "student",
    "email": "mayorthegreat2016@gmail.com",
    "status": "suspended"
  },
  {
    "name": "mayortheking2013",
    "role": "student",
    "email": "mayortheking2013@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Mayowa Balogun",
    "role": "student",
    "email": "mayorwayb@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "mayowaodofin586",
    "role": "student",
    "email": "mayowaodofin586@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "mayumoh77",
    "role": "student",
    "email": "mayumoh77@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Martin Uhuru",
    "role": "student",
    "email": "mbatiauhurumartin@gmail.com",
    "status": "suspended",
    "program": "B.A. Humanitarian & Conflict Response"
  },
  {
    "name": "mbisanakutlwano",
    "role": "student",
    "email": "mbisanakutlwano@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Felix Alpha Mbogba",
    "role": "student",
    "email": "mbogbafelixalpha@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "mbujoseph7",
    "role": "student",
    "email": "mbujoseph7@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Joy Mbu",
    "role": "student",
    "email": "mbujoy71@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Antoine",
    "role": "student",
    "email": "mcdonald.antoine72@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Suan-Lee Satchwell-McFarlane",
    "role": "student",
    "email": "mcfarlanesuan@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "CHARLES MCFYNE",
    "role": "student",
    "email": "mcfyne@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Mishca De wet",
    "role": "student",
    "email": "mdewetgr12@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Mee Youu",
    "role": "student",
    "email": "me.youindhouse@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Mohamed Emmanuel Koroma",
    "role": "student",
    "email": "medekoroma22@gmail.com",
    "status": "suspended"
  },
  {
    "name": "medmaf22",
    "role": "student",
    "email": "medmaf22@gmail.com",
    "status": "suspended"
  },
  {
    "name": "mednaf22",
    "role": "student",
    "email": "mednaf22@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "meememusa2014",
    "role": "student",
    "email": "meememusa2014@gmail.com",
    "status": "suspended",
    "program": "Bachelor of science in counselling and psychology, minor in clinical mental health"
  },
  {
    "name": "megxyrich",
    "role": "student",
    "email": "megxyrich@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Mercy Ekeneme",
    "role": "student",
    "email": "mekeneme1@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "mellisasite",
    "role": "student",
    "email": "mellisasite@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "mennimichael",
    "role": "student",
    "email": "mennimichael@gmail.com",
    "status": "suspended",
    "program": "Master of Science in Organizational Leadership, Minor in Nonprofit & Community Development"
  },
  {
    "name": "SIMON MEPAASHI",
    "role": "student",
    "email": "mepaashi2016@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Kehinde Adesemoye",
    "role": "student",
    "email": "mercifulgodunit004@gmail.com",
    "status": "suspended"
  },
  {
    "name": "MERCY CHEROP",
    "role": "student",
    "email": "mercy.cherop0001@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "mercy.umoren007",
    "role": "student",
    "email": "mercy.umoren007@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Mercy Anslem",
    "role": "student",
    "email": "mercyanslem7@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Mercy Arwa",
    "role": "student",
    "email": "mercyarwa2021@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "mercyatunde1",
    "role": "student",
    "email": "mercyatunde1@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "mercy bassi",
    "role": "student",
    "email": "mercybassi@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "mercy chath Anslem",
    "role": "student",
    "email": "mercychathanslem@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Mercy Macharia",
    "role": "student",
    "email": "mercymacharia155@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "MERCY MUANGE",
    "role": "student",
    "email": "mercymuange2019@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Mercy Omosebi",
    "role": "student",
    "email": "mercyomosebi72@gmail.com",
    "status": "suspended",
    "program": "Bachelor of science in health care administration minors in health ministry"
  },
  {
    "name": "Mercy Usanga",
    "role": "student",
    "email": "mercyusanga95@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Mercy Zoker",
    "role": "student",
    "email": "mercyzoker269@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Monicah Mugambi",
    "role": "student",
    "email": "merenyaa@gmail.com",
    "status": "suspended",
    "program": "PHD CHRISTIAN COUNSELLING AND PSYCHOLOGY MINOR CLINICAL MENTAL HEALTH"
  },
  {
    "name": "mersolo30",
    "role": "student",
    "email": "mersolo30@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "meshackasama18",
    "role": "student",
    "email": "meshackasama18@gmail.com",
    "status": "suspended"
  },
  {
    "name": "meshackoshoriemeasa",
    "role": "student",
    "email": "meshackoshoriemeasa@gmail.com",
    "status": "suspended"
  },
  {
    "name": "metroconnectfeyi",
    "role": "student",
    "email": "metroconnectfeyi@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "metroconnectfeyi",
    "role": "student",
    "email": "metroconnectfeyi@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "Moses Adejo",
    "role": "student",
    "email": "meyanga1992@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Mfonma Akpan",
    "role": "student",
    "email": "mfonakpan2010@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "mfonobongntuk22",
    "role": "student",
    "email": "mfonobongntuk22@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "mfonubong",
    "role": "student",
    "email": "mfonubong@yahoo.co.uk",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "PR. MAKLINE. C. Rep. Ug",
    "role": "student",
    "email": "mgrtfamily1@gmail.com",
    "status": "suspended",
    "program": "BA in Marketing and Advertising"
  },
  {
    "name": "Micheal Ogunwale",
    "role": "student",
    "email": "mich4christ2004@gmail.com",
    "status": "suspended"
  },
  {
    "name": "michaelanthon33",
    "role": "student",
    "email": "michaelanthon33@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Michael Bernard",
    "role": "student",
    "email": "michaelbernard900@gmail.com",
    "status": "suspended",
    "program": "Masters in Organisational Leadership"
  },
  {
    "name": "Michael Burahe",
    "role": "student",
    "email": "michaelburahe@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "michaellouisa64",
    "role": "student",
    "email": "michaellouisa64@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "michaelmutebi552",
    "role": "student",
    "email": "michaelmutebi552@gmail.com",
    "status": "suspended"
  },
  {
    "name": "michaelojo.1929.5050",
    "role": "student",
    "email": "michaelojo.1929.5050@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Michael Ojo",
    "role": "student",
    "email": "michaelojo1929.5050@gmail.com",
    "status": "suspended"
  },
  {
    "name": "michaeluwakwe01",
    "role": "student",
    "email": "michaeluwakwe01@gmail.com",
    "status": "suspended",
    "program": "Certificate"
  },
  {
    "name": "Godie Lina",
    "role": "student",
    "email": "michaeluwakwe995@gmail.com",
    "status": "suspended"
  },
  {
    "name": "michealtaye2407",
    "role": "student",
    "email": "michealtaye2407@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "michee498",
    "role": "student",
    "email": "michee498@gmail.com",
    "status": "suspended",
    "program": "MA STRATEGIC LEADERSHIP, MINOR IN CHRISTIAN LEADERSHIP AND ETHICS"
  },
  {
    "name": "Michelle Theodora",
    "role": "student",
    "email": "michelletheodora606@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Michelle Cheruto",
    "role": "student",
    "email": "michyandy2002@gmail.com",
    "status": "suspended"
  },
  {
    "name": "mightyfelly felix",
    "role": "student",
    "email": "mightyfelly@gmail.com",
    "status": "suspended"
  },
  {
    "name": "mike.kingsley85",
    "role": "student",
    "email": "mike.kingsley85@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "mikpigeorge01",
    "role": "student",
    "email": "mikpigeorge01@gmail.com",
    "status": "suspended"
  },
  {
    "name": "milagada67",
    "role": "student",
    "email": "milagada67@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "mimidoo akor",
    "role": "student",
    "email": "mimidooakor68@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "minageasina",
    "role": "student",
    "email": "minageasina@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "miracleomorinoye",
    "role": "student",
    "email": "miracleomorinoye@gmail.com",
    "status": "suspended"
  },
  {
    "name": "miriamlyn22",
    "role": "student",
    "email": "miriamlyn22@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Miroline Tshingwel Muyulenu",
    "role": "student",
    "email": "miroline.t.muyulenu@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Wasswa Misach",
    "role": "student",
    "email": "misachwasswa9@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Science (B.Sc.) in Christian Counseling & Psychology"
  },
  {
    "name": "mishaelakpasop",
    "role": "student",
    "email": "mishaelakpasop@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Mishqah Gous",
    "role": "student",
    "email": "mishqah@rlabs.org",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "misiwisa1967",
    "role": "student",
    "email": "misiwisa1967@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Mitchell's Adediwura",
    "role": "student",
    "email": "mitchellsadediwura@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "mitchysiam",
    "role": "student",
    "email": "mitchysiam@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Israel Ibuje",
    "role": "student",
    "email": "mitegatec@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "mitteisillas",
    "role": "student",
    "email": "mitteisillas@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ntobeko Mketshane",
    "role": "student",
    "email": "mketshanentobeko@gmail.com",
    "status": "suspended"
  },
  {
    "name": "mketti14",
    "role": "student",
    "email": "mketti14@icloud.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "mkpamkpa1",
    "role": "student",
    "email": "mkpamkpa1@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Mary Larry",
    "role": "student",
    "email": "mlarry.isang@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Panam Micheal",
    "role": "student",
    "email": "mlkepanamsy@gmail.com",
    "status": "suspended",
    "program": "Master in art MA Christian Leadership and cultural management"
  },
  {
    "name": "Afika Mlobeli",
    "role": "student",
    "email": "mlobeliafika@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Pastor isaiah ml wurie",
    "role": "student",
    "email": "mlwuriepastorisaiah@gmail.com",
    "status": "suspended"
  },
  {
    "name": "mmolalekan12",
    "role": "student",
    "email": "mmolalekan12@gmail.com",
    "status": "suspended"
  },
  {
    "name": "mike muzee",
    "role": "student",
    "email": "mmuzee9@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Mercy Mwangi",
    "role": "student",
    "email": "mmwangi87mercy@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "mnandhego",
    "role": "student",
    "email": "mnandhego@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Modesta Abunyanga",
    "role": "student",
    "email": "modestaabunyang@gmail.com",
    "status": "suspended",
    "program": "Bsc Of Counseling Psychology"
  },
  {
    "name": "modupeforchrist17",
    "role": "student",
    "email": "modupeforchrist17@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "moffamose",
    "role": "student",
    "email": "moffamose@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Moses Fofanah",
    "role": "student",
    "email": "mofofana882927@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Business Administration minor in non-profit business management"
  },
  {
    "name": "Thomas Mo-Hunter",
    "role": "student",
    "email": "mohunterthomas79@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "mokwaferdinand1985",
    "role": "student",
    "email": "mokwaferdinand1985@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "moltha daniel",
    "role": "student",
    "email": "moltha56@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "michael oluwatobi",
    "role": "student",
    "email": "moluwatobi6@gmail.com",
    "status": "suspended"
  },
  {
    "name": "momohangella3",
    "role": "student",
    "email": "momohangella3@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "monday audu",
    "role": "student",
    "email": "mondayaudu96@gmail.com",
    "status": "suspended",
    "program": "MSc Leadership Development Minor Faith Based and Non Profit Community Development"
  },
  {
    "name": "monday pius",
    "role": "student",
    "email": "mondaypius91@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Monicah Nyakeru M.",
    "role": "student",
    "email": "monibenja@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Arts in Theology (Ministry & Divinity). Minor in Theology Perspective on mental health"
  },
  {
    "name": "monica edward",
    "role": "student",
    "email": "monicahedward4@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Monre Piet",
    "role": "student",
    "email": "monrepiet5@gmail.com",
    "status": "suspended"
  },
  {
    "name": "moorewm03",
    "role": "student",
    "email": "moorewm03@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "moprecioushat12",
    "role": "student",
    "email": "moprecioushat12@gmail.com",
    "status": "suspended"
  },
  {
    "name": "morayo1974",
    "role": "student",
    "email": "morayo1974@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "morayojoe0",
    "role": "student",
    "email": "morayojoe0@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Funke Ajayi",
    "role": "student",
    "email": "morenikeisgud@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "mosemoffat30",
    "role": "student",
    "email": "mosemoffat30@gmail.com",
    "status": "suspended"
  },
  {
    "name": "mosesalinyo5",
    "role": "student",
    "email": "mosesalinyo5@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Moses Kor",
    "role": "student",
    "email": "moseskor@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "oluwasanya Joseph",
    "role": "student",
    "email": "mosesoluwasanya08109@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Moses Oluwatimilehin",
    "role": "student",
    "email": "mosesoluwatimilehin33@gmail.com",
    "status": "suspended"
  },
  {
    "name": "mostvictor1",
    "role": "student",
    "email": "mostvictor1@gmail.com",
    "status": "suspended",
    "program": "Masters: of *Public Administration Minor Nonprofit and Faith Base Leadership*"
  },
  {
    "name": "movingforward36512",
    "role": "student",
    "email": "movingforward36512@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "mpendulovilakati18",
    "role": "student",
    "email": "mpendulovilakati18@outlook.com",
    "status": "suspended"
  },
  {
    "name": "Nkosingiphile Zwane",
    "role": "student",
    "email": "mphilezwane98@gmail.com",
    "status": "suspended"
  },
  {
    "name": "mrfelixu4",
    "role": "student",
    "email": "mrfelixu4@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Olurimisi Maxwell Boluwatife",
    "role": "student",
    "email": "mrmaxon00013@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Xolela Msweli",
    "role": "student",
    "email": "mswelixolela@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "mucheru868",
    "role": "student",
    "email": "mucheru868@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "mugambaian92",
    "role": "student",
    "email": "mugambaian92@gmail.com",
    "status": "suspended",
    "program": "MASTERS OF CHRISTIAN BUSINESS ADMINISTRATION"
  },
  {
    "name": "Mugendi Royford",
    "role": "student",
    "email": "mugendiroyford71@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "mugoj2002",
    "role": "student",
    "email": "mugoj2002@gmail.com",
    "status": "suspended"
  },
  {
    "name": "BONIFACE MUINDI",
    "role": "student",
    "email": "muindiboniface652@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "muindifaith13",
    "role": "student",
    "email": "muindifaith13@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Mukiza Benard Kanyabukye",
    "role": "student",
    "email": "mukizabenard@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "John Mukundi",
    "role": "student",
    "email": "mukundij5@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "David",
    "role": "student",
    "email": "mulamudavid875@gmail.com",
    "status": "suspended",
    "program": "Bachelor of science in IT support"
  },
  {
    "name": "mulumbasam15",
    "role": "student",
    "email": "mulumbasam15@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "muminatbolajikabiru",
    "role": "student",
    "email": "muminatbolajikabiru@gmail.com",
    "status": "suspended"
  },
  {
    "name": "mumofaith31",
    "role": "student",
    "email": "mumofaith31@gmail.com",
    "status": "suspended",
    "program": "Master of Science in Public Health Faith Based Initiative"
  },
  {
    "name": "Esther Njenga",
    "role": "student",
    "email": "muniesy76@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Cecilia Fatmata Squire",
    "role": "student",
    "email": "munjaysquire@gmail.com",
    "status": "suspended"
  },
  {
    "name": "MUNYOLE EDGAR",
    "role": "student",
    "email": "munyole007@gmail.com",
    "status": "suspended"
  },
  {
    "name": "MUNYOLE EDGAR",
    "role": "student",
    "email": "munyoleedgar50@gmail.com",
    "status": "suspended"
  },
  {
    "name": "munyoleedgarreal",
    "role": "student",
    "email": "munyoleedgarreal@gmail.com",
    "status": "suspended"
  },
  {
    "name": "MUNYOLE EDGAR",
    "role": "student",
    "email": "munyolemued@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "MUSA BITRUS",
    "role": "student",
    "email": "musabitrus78@gmail.com",
    "status": "suspended",
    "program": "MSc in Strategic Leadership Minor in Religion and Society"
  },
  {
    "name": "Musa Kefas",
    "role": "student",
    "email": "musakefas19@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "musakerenyamma",
    "role": "student",
    "email": "musakerenyamma@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ahmed Musana",
    "role": "student",
    "email": "musanameddie@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Musa Salihu",
    "role": "student",
    "email": "musasalihu914@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "musawwar dada",
    "role": "student",
    "email": "musawwardada@gmail.com",
    "status": "suspended"
  },
  {
    "name": "musayayibolaji",
    "role": "student",
    "email": "musayayibolaji@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "Mary Muthoni",
    "role": "student",
    "email": "musokinyaz@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Mustafa Kadara (Kemmy)",
    "role": "student",
    "email": "mustafakadra020@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Hellen Mutanu",
    "role": "student",
    "email": "mutanuhellen0@gmail.com",
    "status": "suspended",
    "program": "BA Project Management & Leadership"
  },
  {
    "name": "mutisyandindi",
    "role": "student",
    "email": "mutisyandindi@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Muwanguzi David",
    "role": "student",
    "email": "muwadavi22@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Science in Cyber Security, Minor in Data Protection for Faith-Based Organizations"
  },
  {
    "name": "Muwanguzi Rest trisha",
    "role": "student",
    "email": "muwanguziresttrisha@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Martha Vandy",
    "role": "student",
    "email": "mvandy1204@gmail.com",
    "status": "suspended"
  },
  {
    "name": "mvuyibongi",
    "role": "student",
    "email": "mvuyibongi@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Mvuyisi Isaacs Siwisa",
    "role": "student",
    "email": "mvuyisiisaacssiwisa@gmail.com",
    "status": "suspended"
  },
  {
    "name": "mvuyisi siwisa",
    "role": "student",
    "email": "mvuyisisiwisa90@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Mwangi Ngorongo",
    "role": "student",
    "email": "mwangi.ngorongo@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Arts in Theology (Ministry & Divinity)"
  },
  {
    "name": "mwanje jonathan",
    "role": "student",
    "email": "mwanjejonathan88@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "mwasadavid123",
    "role": "student",
    "email": "mwasadavid123@gmail.com",
    "status": "suspended"
  },
  {
    "name": "mwasadavid2",
    "role": "student",
    "email": "mwasadavid2@gmail.com",
    "status": "suspended",
    "program": "ASc BA in Business Administration Management (BA AGRIBUSINESS)"
  },
  {
    "name": "mwotaleonard",
    "role": "student",
    "email": "mwotaleonard@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ENIOLA ODEWUNMI",
    "role": "student",
    "email": "myappearances2013@gmail.com",
    "status": "suspended"
  },
  {
    "name": "nabbyadus",
    "role": "student",
    "email": "nabbyadus@gmail.com",
    "status": "suspended",
    "program": "Master Program in Life Coaching Minor Faith Based Counselling and Mentoring"
  },
  {
    "name": "nabuumapatricia6",
    "role": "student",
    "email": "nabuumapatricia6@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Joan Susan",
    "role": "student",
    "email": "nabwirejoan222@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "nadayedi",
    "role": "student",
    "email": "nadayedi@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Nadglar Lecointe",
    "role": "student",
    "email": "nadglarl@gmail.com",
    "status": "suspended",
    "program": "Certificate"
  },
  {
    "name": "Nafisatu Adamu Suleiman",
    "role": "student",
    "email": "nafisa2adamu1@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Winnie Nailantei",
    "role": "student",
    "email": "nailanteiwinnie@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Nakachi Investment",
    "role": "student",
    "email": "nakachiinvestment@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Nakairu Grace",
    "role": "student",
    "email": "nakairugrace@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "nakakeeto.janet",
    "role": "student",
    "email": "nakakeeto.janet@gmail.com",
    "status": "suspended"
  },
  {
    "name": "nakakeetojanet34",
    "role": "student",
    "email": "nakakeetojanet34@gmail.com",
    "status": "suspended"
  },
  {
    "name": "nakakeetojanet7",
    "role": "student",
    "email": "nakakeetojanet7@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Proscovia Nakamya",
    "role": "student",
    "email": "nakamya100@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "nakasimariam41",
    "role": "student",
    "email": "nakasimariam41@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "nakatochristine441",
    "role": "student",
    "email": "nakatochristine441@441gmail.com",
    "status": "suspended"
  },
  {
    "name": "Nakato Christine",
    "role": "student",
    "email": "nakatochristine441@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Rebecca Nakato",
    "role": "student",
    "email": "nakatorebecca28@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Nakiweewa Diana",
    "role": "student",
    "email": "nakiweewadiana790@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Arts in Christian education"
  },
  {
    "name": "NALWOGA STELLA",
    "role": "student",
    "email": "nalwogastella30@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "namaswacleophas27",
    "role": "student",
    "email": "namaswacleophas27@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Harriet Namiiro",
    "role": "student",
    "email": "namiiro77@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "Namwaya Berine",
    "role": "student",
    "email": "namwayaberine@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Nandipha Vuyokazi Morrison",
    "role": "student",
    "email": "nandiemorr@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Nandi Haruna",
    "role": "student",
    "email": "nandiharuna0@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Easter Nantongo",
    "role": "student",
    "email": "nantongoeaster4@gmail.com",
    "status": "suspended",
    "program": "BA in christian leadership and cultural management"
  },
  {
    "name": "Naomi Patrick Osakwe",
    "role": "student",
    "email": "naomi.osakwe@gmail.com",
    "status": "suspended"
  },
  {
    "name": "nassaka Doreen",
    "role": "student",
    "email": "nassakadora@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Nataliah Gibson",
    "role": "student",
    "email": "nataliahgibson@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "nathanaellibby46",
    "role": "student",
    "email": "nathanaellibby46@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "nathaniellibby46",
    "role": "student",
    "email": "nathaniellibby46@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Mndzebele Nathi",
    "role": "student",
    "email": "nathimndzebele93@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Nathaniel Peter",
    "role": "student",
    "email": "nathpeemckungaga@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Nathaniel Etafo",
    "role": "student",
    "email": "nathy.eta4@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "nazzysonia",
    "role": "student",
    "email": "nazzysonia@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ncebakazisiko",
    "role": "student",
    "email": "ncebakazisiko@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Tonny Ndare",
    "role": "student",
    "email": "ndaretonny@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ndenyang",
    "role": "student",
    "email": "ndenyang@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ndirangupeter777",
    "role": "student",
    "email": "ndirangupeter777@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Inathi Ndlazi",
    "role": "student",
    "email": "ndlaziinathi48@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ndlovuthabile1981",
    "role": "student",
    "email": "ndlovuthabile1981@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Ndubuisi Ahia",
    "role": "student",
    "email": "ndu4eva2003@gmail.com",
    "status": "suspended"
  },
  {
    "name": "NDUEHE EDET",
    "role": "student",
    "email": "nduehe.sedet@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ndukwechukwu3",
    "role": "student",
    "email": "ndukwechukwu3@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ndukwejuliet41",
    "role": "student",
    "email": "ndukwejuliet41@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Eliud Ndungu",
    "role": "student",
    "email": "ndungueliud111@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "nekatricia",
    "role": "student",
    "email": "nekatricia@gmail.com",
    "status": "suspended"
  },
  {
    "name": "nelfordsongca",
    "role": "student",
    "email": "nelfordsongca@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Divinity, Major in Chaplaincy. Counseling and Psychology"
  },
  {
    "name": "nelinhle12",
    "role": "student",
    "email": "nelinhle12@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "nelsonsmg",
    "role": "student",
    "email": "nelsonsmg@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Chinenye Nwaonu",
    "role": "student",
    "email": "neniesworld@gmail.com",
    "status": "suspended",
    "program": "Master of Architecture, Minor in Religious Artifacts"
  },
  {
    "name": "UMEAKUANA BENEDETTE ONYINYECHI",
    "role": "student",
    "email": "newtongro@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Adeniyi Moniade",
    "role": "student",
    "email": "nexunade@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Tengetilei Nkambule",
    "role": "student",
    "email": "ngetinka@gmail.com",
    "status": "suspended",
    "program": "Master of Laws"
  },
  {
    "name": "Senanile Nhlabatsi",
    "role": "student",
    "email": "nhlabatsisenanile350@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "nhlabatsisenanile",
    "role": "student",
    "email": "nhlabatsisenanile@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "nhlanhlas71",
    "role": "student",
    "email": "nhlanhlas71@yahoo.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Zechariah Nicholas",
    "role": "student",
    "email": "nicholaszechariah@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Nicholaus Nnko",
    "role": "student",
    "email": "nicholausnnko@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "nichoy_",
    "role": "student",
    "email": "nichoy_@hotmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "nickbaraka",
    "role": "student",
    "email": "nickbaraka@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "nnaemeka nickson",
    "role": "student",
    "email": "nicksonnnaemeka@gmail.com",
    "status": "suspended",
    "program": "Master Leader"
  },
  {
    "name": "nicolealsina56",
    "role": "student",
    "email": "nicolealsina56@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "modupe enoch",
    "role": "student",
    "email": "nikkyenoch521@gmail.com",
    "status": "suspended"
  },
  {
    "name": "nikkygrace24",
    "role": "student",
    "email": "nikkygrace24@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Nina Mugerwa",
    "role": "student",
    "email": "ninamugerwa@gmail.com",
    "status": "suspended"
  },
  {
    "name": "nissolcakes",
    "role": "student",
    "email": "nissolcakes@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Lucy Njoku",
    "role": "student",
    "email": "njokulucy14@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "nkechiblessing96",
    "role": "student",
    "email": "nkechiblessing96@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "nkememeleogu",
    "role": "student",
    "email": "nkememeleogu@yahoo.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Nkechi Anslem",
    "role": "student",
    "email": "nkyvigy@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "nnabueprincess",
    "role": "student",
    "email": "nnabueprincess@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Nnadede Peter",
    "role": "student",
    "email": "nnadedepeter@gmail.com",
    "status": "suspended",
    "program": "Masters in Arts in Strategic Leadership Minor in Christian leadership and cultural management"
  },
  {
    "name": "Nnaemeka Virtus",
    "role": "student",
    "email": "nnaemekavirtus@gmail.com",
    "status": "suspended"
  },
  {
    "name": "nnekaangel81",
    "role": "student",
    "email": "nnekaangel81@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "nnenna75",
    "role": "student",
    "email": "nnenna75@gmail.com",
    "status": "suspended"
  },
  {
    "name": "nnennak75",
    "role": "student",
    "email": "nnennak75@gmail.com",
    "status": "suspended"
  },
  {
    "name": "nnlancaster",
    "role": "student",
    "email": "nnlancaster@yahoo.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "nnoromebenezer",
    "role": "student",
    "email": "nnoromebenezer@gmail.com",
    "status": "suspended",
    "program": "Undergraduate"
  },
  {
    "name": "noblefx",
    "role": "student",
    "email": "noblefx@gmail.com",
    "status": "suspended"
  },
  {
    "name": "nobleman1212",
    "role": "student",
    "email": "nobleman1212@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Noblemansaray",
    "role": "student",
    "email": "noblemansaray7@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Thomas Otobong",
    "role": "student",
    "email": "noblethurna419@gmail.com",
    "status": "suspended",
    "program": "M A Clinical Mental Health Counseling"
  },
  {
    "name": "Norah Ogutu",
    "role": "student",
    "email": "nogutu2011@gmail.com",
    "status": "suspended"
  },
  {
    "name": "nogutu2021",
    "role": "student",
    "email": "nogutu2021@gmail.com",
    "status": "suspended"
  },
  {
    "name": "nojayy1350",
    "role": "student",
    "email": "nojayy1350@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "nollyangel2000",
    "role": "student",
    "email": "nollyangel2000@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "nomathemba.khumalo",
    "role": "student",
    "email": "nomathemba.khumalo@manzinicity.co.sz",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "nombulelo joel",
    "role": "student",
    "email": "nombulelojoel@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Nomhle Raziya",
    "role": "student",
    "email": "nomhle.raziya@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "nonyelumlucy",
    "role": "student",
    "email": "nonyelumlucy@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "noorharoon535",
    "role": "student",
    "email": "noorharoon535@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Norah N Mugerwa",
    "role": "student",
    "email": "norahnina06@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "nortonadeyemi",
    "role": "student",
    "email": "nortonadeyemi@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Sashorna Noyan",
    "role": "student",
    "email": "noyansashorna@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "n patience",
    "role": "student",
    "email": "npatience92@gmail.com",
    "status": "suspended",
    "program": "BACHELORS IN HUMANITARIANISM AND CONFLICT RESPONSE"
  },
  {
    "name": "Nseobong Ugbomah",
    "role": "student",
    "email": "nseobongugbomah@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Ntete Valentine",
    "role": "student",
    "email": "ntetevalentine@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ntshangasethayanda1",
    "role": "student",
    "email": "ntshangasethayanda1@gmail.com",
    "status": "suspended"
  },
  {
    "name": "oluwaseun chris",
    "role": "student",
    "email": "nuppyjay@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Nurudeen Akindele",
    "role": "student",
    "email": "nurudeenakindele8@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Nwankuba Valentine Azubuike",
    "role": "student",
    "email": "nvazubuike@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "onyebuchi Nwachukwu Joseph",
    "role": "student",
    "email": "nwachukwujosephonyebuchi@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "nwachukwunelson96",
    "role": "student",
    "email": "nwachukwunelson96@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "nwankwog88",
    "role": "student",
    "email": "nwankwog88@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "nwankwopatricia56",
    "role": "student",
    "email": "nwankwopatricia56@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "nwankworejoicechinaza",
    "role": "student",
    "email": "nwankworejoicechinaza@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "nwokejimaurice",
    "role": "student",
    "email": "nwokejimaurice@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Abuchi Charles Nworah",
    "role": "student",
    "email": "nworahabuchicharles@gmail.com",
    "status": "suspended"
  },
  {
    "name": "nyagano",
    "role": "student",
    "email": "nyagano@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "nyam wash",
    "role": "student",
    "email": "nyamdung4u2012@gmail.com",
    "status": "suspended"
  },
  {
    "name": "nyangasiagusiomacynthia",
    "role": "student",
    "email": "nyangasiagusiomacynthia@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Nyeboho Etuk",
    "role": "student",
    "email": "nye.etuk@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "AUDREY NYOKABI",
    "role": "student",
    "email": "nyokabiaudrey14@gmail.com",
    "status": "suspended"
  },
  {
    "name": "O.A. Adeboye",
    "role": "student",
    "email": "oa.adeboye@acu.edu.ng",
    "status": "suspended"
  },
  {
    "name": "Apotierioluwa Olaluwoye",
    "role": "student",
    "email": "oapotierioluwa@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "obaloluwaprosper5",
    "role": "student",
    "email": "obaloluwaprosper5@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Kayode Obanijesu",
    "role": "student",
    "email": "obanijesukayode167@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Obanimi Joshua",
    "role": "student",
    "email": "obanimijoshua@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Obadiah Thomas",
    "role": "student",
    "email": "obedtom2306@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "obettatc",
    "role": "student",
    "email": "obettatc@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "GABRIEL OBIABO",
    "role": "student",
    "email": "obiabogabby@gmail.com",
    "status": "suspended"
  },
  {
    "name": "obichinekedivine2021",
    "role": "student",
    "email": "obichinekedivine2021@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "obidikelinda9",
    "role": "student",
    "email": "obidikelinda9@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Ifeyinwa Chime Obiekwe",
    "role": "student",
    "email": "obiekweifeyinwachime@gmail.com",
    "status": "suspended",
    "program": "Maters in Women Studies( minor in faith based Gender equality & empowerment)"
  },
  {
    "name": "obinnavivian94",
    "role": "student",
    "email": "obinnavivian94@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Odibeze",
    "role": "student",
    "email": "obinwajiofo@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "obiohachukwudi86",
    "role": "student",
    "email": "obiohachukwudi86@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "oblapeace31",
    "role": "student",
    "email": "oblapeace31@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Oheneba Godson Obrempon Clement",
    "role": "student",
    "email": "obremponclementohenebagodson@gmail.com",
    "status": "suspended"
  },
  {
    "name": "John Obudu",
    "role": "student",
    "email": "obudujohn@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "obu godwin",
    "role": "student",
    "email": "obugodwin8363@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Ocaya Geoffrey nyeko",
    "role": "student",
    "email": "ocayageoffreynyeko811@gmail.com",
    "status": "suspended"
  },
  {
    "name": "OCHAAT JOHN BOSCO",
    "role": "student",
    "email": "ochaatjohnbosco@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Ella Joy Ochanya",
    "role": "student",
    "email": "ochanyajoy548@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Abelian Ochenehi",
    "role": "student",
    "email": "ochenehiabelian@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Emmanuel Ochigbo",
    "role": "student",
    "email": "ochigbo004@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ochigbo04",
    "role": "student",
    "email": "ochigbo04@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Reuben Odaudu",
    "role": "student",
    "email": "odaudureuben67@gmail.com",
    "status": "suspended"
  },
  {
    "name": "odebunmiolubunmi",
    "role": "student",
    "email": "odebunmiolubunmi@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "JOHN ODETOLA",
    "role": "student",
    "email": "odetolajo@afued.edu.ng",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "CHUKWUDOZIE EMEKA",
    "role": "student",
    "email": "odeworld1@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "John Odhiambo",
    "role": "student",
    "email": "odhiambojohnouko@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Nobert Odhiambo",
    "role": "student",
    "email": "odhiambonobert0@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "odionronald60",
    "role": "student",
    "email": "odionronald60@gmail.com",
    "status": "suspended"
  },
  {
    "name": "odogwuiyke",
    "role": "student",
    "email": "odogwuiyke@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "odukoyasa",
    "role": "student",
    "email": "odukoyasa@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "odumegujudah",
    "role": "student",
    "email": "odumegujudah@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "oduoresther355",
    "role": "student",
    "email": "oduoresther355@gmail.com",
    "status": "suspended"
  },
  {
    "name": "oduscosunny",
    "role": "student",
    "email": "oduscosunny@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Odusolu Rebecca Morayo",
    "role": "student",
    "email": "odusolurebeccamorayo@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ofag2017",
    "role": "student",
    "email": "ofag2017@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Felyte",
    "role": "student",
    "email": "officialfelyte@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "officialovokeroye",
    "role": "student",
    "email": "officialovokeroye@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "officialpaulamayah",
    "role": "student",
    "email": "officialpaulamayah@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ofobuikejustina",
    "role": "student",
    "email": "ofobuikejustina@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ofojebegraceifesinachi",
    "role": "student",
    "email": "ofojebegraceifesinachi@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ofonmbukaniekan",
    "role": "student",
    "email": "ofonmbukaniekan@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Irene Ogbe",
    "role": "student",
    "email": "ogbeirene1@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ogbemudia Juliet",
    "role": "student",
    "email": "ogbemudiaj63@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ogbidianthony452",
    "role": "student",
    "email": "ogbidianthony452@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ogboruth2018",
    "role": "student",
    "email": "ogboruth2018@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "oghoyafendotracy",
    "role": "student",
    "email": "oghoyafendotracy@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ogidigodo",
    "role": "student",
    "email": "ogidigodo@gmail.com",
    "status": "suspended",
    "program": "MASTER IN PUBLIC ADMINISTRATION (MPA), MINOR IN NONPROFIT AND FAITH BASED LEADERSHIP"
  },
  {
    "name": "ogiriigah",
    "role": "student",
    "email": "ogiriigah@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ogochukwu ejehu",
    "role": "student",
    "email": "ogochukwuejehu@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ogogunlowo",
    "role": "student",
    "email": "ogogunlowo@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ogundiranolufemi1",
    "role": "student",
    "email": "ogundiranolufemi1@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ogundoju titilayo",
    "role": "student",
    "email": "ogundojutitilayo@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ogundoroanuoluwapo",
    "role": "student",
    "email": "ogundoroanuoluwapo@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "OGUNDORO MICHEAL",
    "role": "student",
    "email": "ogundoroayomide24@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ogundoromary4",
    "role": "student",
    "email": "ogundoromary4@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Tunde Ogunlade",
    "role": "student",
    "email": "ogunladetunde1@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ogunlusi florence",
    "role": "student",
    "email": "ogunlusiflorence39@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ogunmiladetemidayo20",
    "role": "student",
    "email": "ogunmiladetemidayo20@gmail.com",
    "status": "suspended",
    "program": "Project Management"
  },
  {
    "name": "ogunsamitoyin15",
    "role": "student",
    "email": "ogunsamitoyin15@gmail.com",
    "status": "suspended",
    "program": "Certificate"
  },
  {
    "name": "ogunwale tolani",
    "role": "student",
    "email": "ogunwaletolani777@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ogunwoledorcas263",
    "role": "student",
    "email": "ogunwoledorcas263@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ogunwoletoyin01",
    "role": "student",
    "email": "ogunwoletoyin01@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ogunwoletoyin1",
    "role": "student",
    "email": "ogunwoletoyin1@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ogwuchebenjamin97",
    "role": "student",
    "email": "ogwuchebenjamin97@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ohagenyi4real",
    "role": "student",
    "email": "ohagenyi4real@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Henry Amos",
    "role": "student",
    "email": "ohandu@gmail.com",
    "status": "suspended",
    "program": "PHD Business Administration Minor in Non Profit Business Management"
  },
  {
    "name": "Ohene Bamfo Nimako",
    "role": "student",
    "email": "ohenemako@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Herine Owuor",
    "role": "student",
    "email": "oherine18@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Moses Ohiaba",
    "role": "student",
    "email": "ohiabamoses31@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ohiosimuanesther",
    "role": "student",
    "email": "ohiosimuanesther@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ohiosmuanesther",
    "role": "student",
    "email": "ohiosmuanesther@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Truphosa Ojano Atieno",
    "role": "student",
    "email": "ojanotruphosa@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ojekajohn52",
    "role": "student",
    "email": "ojekajohn52@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Ojiefoh Collins",
    "role": "student",
    "email": "ojiefohcollins@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ojoawojk",
    "role": "student",
    "email": "ojoawojk@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ojobukolakikelomo",
    "role": "student",
    "email": "ojobukolakikelomo@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Faith Gabriel",
    "role": "student",
    "email": "ojonugwababy1607@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ojoolatunji383",
    "role": "student",
    "email": "ojoolatunji383@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Serah ojo",
    "role": "student",
    "email": "ojoserah409@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ojukwudaniel2025",
    "role": "student",
    "email": "ojukwudaniel2025@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Stephen Ojukwu",
    "role": "student",
    "email": "ojukwustephen07@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Stephen Ojukwu",
    "role": "student",
    "email": "ojukwustephen5@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Ranik Young",
    "role": "student",
    "email": "okaforarthur84@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "okaijonathan7",
    "role": "student",
    "email": "okaijonathan7@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "David Oke",
    "role": "student",
    "email": "oke6920l@gmail.com",
    "status": "suspended"
  },
  {
    "name": "okedavid741",
    "role": "student",
    "email": "okedavid741@gmail.com",
    "status": "suspended"
  },
  {
    "name": "okedavidolakitan",
    "role": "student",
    "email": "okedavidolakitan@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Tinuade Okedun",
    "role": "student",
    "email": "okeduntinuade@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "okellobenrobert",
    "role": "student",
    "email": "okellobenrobert@gmail.com",
    "status": "suspended"
  },
  {
    "name": "okellohnancy35",
    "role": "student",
    "email": "okellohnancy35@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Oliver Okeme",
    "role": "student",
    "email": "okemeoliver66@gmail.com",
    "status": "suspended"
  },
  {
    "name": "okemeoliver",
    "role": "student",
    "email": "okemeoliver@gmail.com",
    "status": "suspended"
  },
  {
    "name": "okenwa",
    "role": "student",
    "email": "okenwabet@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Oketola Ezekiel",
    "role": "student",
    "email": "oketola22018@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "okeyezeana63",
    "role": "student",
    "email": "okeyezeana63@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Dorothy Akinyi",
    "role": "student",
    "email": "okeyodorothy2021@gmail.com",
    "status": "suspended"
  },
  {
    "name": "okezueukamaka",
    "role": "student",
    "email": "okezueukamaka@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ukamaka Okezuo",
    "role": "student",
    "email": "okezuoukamaka@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "okonating",
    "role": "student",
    "email": "okonating@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "okonkwochisolum",
    "role": "student",
    "email": "okonkwochisolum@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Moore Okoro precious",
    "role": "student",
    "email": "okoropreciousmoore@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ophelia Okoruwa",
    "role": "student",
    "email": "okoruwaophelia74@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "okpanitps",
    "role": "student",
    "email": "okpanitps@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Emmanuel Okpukpan",
    "role": "student",
    "email": "okpukpanm@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "okumustanley577",
    "role": "student",
    "email": "okumustanley577@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "okumustanly0",
    "role": "student",
    "email": "okumustanly0@gmail.com",
    "status": "suspended"
  },
  {
    "name": "okweshekina10",
    "role": "student",
    "email": "okweshekina10@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "okworijohn210",
    "role": "student",
    "email": "okworijohn210@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Sandra Okwuosa",
    "role": "student",
    "email": "okwuosasandra@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ola8ola",
    "role": "student",
    "email": "ola8ola@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "olaadedrivingschool23",
    "role": "student",
    "email": "olaadedrivingschool23@gmail.com",
    "status": "suspended",
    "program": "MASTER OF LIFE COACHING MINOR: FAITH-BASED COUNSELLING AND MENTORING"
  },
  {
    "name": "Olaa Denish",
    "role": "student",
    "email": "olaadenish985@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Olabamiji Shola john",
    "role": "student",
    "email": "olabamijisholajohn@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Olabisi Adedayo",
    "role": "student",
    "email": "olabisi.adedayo27@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "olabisioladayo03",
    "role": "student",
    "email": "olabisioladayo03@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "olaitan afolaju",
    "role": "student",
    "email": "olacole79@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "oladamolajoshua",
    "role": "student",
    "email": "oladamolajoshua@gmail.com",
    "status": "suspended"
  },
  {
    "name": "oladejioluseyi211",
    "role": "student",
    "email": "oladejioluseyi211@gmail.com",
    "status": "suspended"
  },
  {
    "name": "oladejioluseyi22",
    "role": "student",
    "email": "oladejioluseyi22@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Oluwaseun Oladele",
    "role": "student",
    "email": "oladeleoluwaseun4692@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "oladepoolawaleayobami",
    "role": "student",
    "email": "oladepoolawaleayobami@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "oladijifunmi",
    "role": "student",
    "email": "oladijifunmi@gmail.com",
    "status": "suspended"
  },
  {
    "name": "oladipojannet",
    "role": "student",
    "email": "oladipojannet@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "oladipostephen14",
    "role": "student",
    "email": "oladipostephen14@gmail.com",
    "status": "suspended"
  },
  {
    "name": "oladoyinbobiola",
    "role": "student",
    "email": "oladoyinbobiola@yahoo.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Fadeyi Oladunni",
    "role": "student",
    "email": "oladunnifadeyi@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ola eze",
    "role": "student",
    "email": "olaeze051@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "olajideoluwagbemi09",
    "role": "student",
    "email": "olajideoluwagbemi09@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "olajidesarahngozi",
    "role": "student",
    "email": "olajidesarahngozi@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "olajideyemisi02",
    "role": "student",
    "email": "olajideyemisi02@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Olajubu Oluwatobiloba",
    "role": "student",
    "email": "olajubuoluwatobiloba5@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "olajumokeafolabi89",
    "role": "student",
    "email": "olajumokeafolabi89@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "olalekanbodunde223",
    "role": "student",
    "email": "olalekanbodunde223@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Favour Olalekan",
    "role": "student",
    "email": "olalekanfavour360@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Favour Olalekan",
    "role": "student",
    "email": "olalekanfavour392@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "olalekanrofiat35",
    "role": "student",
    "email": "olalekanrofiat35@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "olalerefagbola",
    "role": "student",
    "email": "olalerefagbola@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "olalerefagbola@yahoo.co.uk",
    "role": "student",
    "email": "olalerefagbola@yahoo.co.uk",
    "status": "suspended"
  },
  {
    "name": "Olaleye Aminat",
    "role": "student",
    "email": "olaleyeaminat12@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Lami Lami",
    "role": "student",
    "email": "olamidealabi1991@gmail.com",
    "status": "suspended",
    "program": "Masters"
  },
  {
    "name": "Olamide Christiana",
    "role": "student",
    "email": "olamidechristiana123456789@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "olanikeale13",
    "role": "student",
    "email": "olanikeale13@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Olanike Ayoni",
    "role": "student",
    "email": "olanikeayoni@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "olanikeopeyemi20",
    "role": "student",
    "email": "olanikeopeyemi20@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Aminat Olaniyi",
    "role": "student",
    "email": "olaniyiaminat@gmail.com",
    "status": "suspended"
  },
  {
    "name": "olanreawaju94",
    "role": "student",
    "email": "olanreawaju94@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "olanrewajunosifat",
    "role": "student",
    "email": "olanrewajunosifat@gmail.com",
    "status": "suspended"
  },
  {
    "name": "olanrewajupeace10",
    "role": "student",
    "email": "olanrewajupeace10@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Olaoluwa Olajubu",
    "role": "student",
    "email": "olaoluwaolajubu8@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Olaoluwa Omotosho",
    "role": "student",
    "email": "olaoluwaomotosho2@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Olamide Ogunboye",
    "role": "student",
    "email": "olaomega007@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Grace Olaoye",
    "role": "student",
    "email": "olaoyegrace20@gmail.com",
    "status": "suspended"
  },
  {
    "name": "olaoye mercy",
    "role": "student",
    "email": "olaoyemercy02@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Olaoye mercy",
    "role": "student",
    "email": "olaoyemercy847@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Olarinoye Victor Bolu",
    "role": "student",
    "email": "olarinoyevictorbolu@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "olasunkanmi55",
    "role": "student",
    "email": "olasunkanmi55@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Jacob Emmanuel",
    "role": "student",
    "email": "olasunkanmi7423@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Olasunkanmi Ezekiel",
    "role": "student",
    "email": "olasunkanmiezekiel8@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Olorunfemi Olasunkanmi",
    "role": "student",
    "email": "olasunkanmiolorunfemi6@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Elizabeth Olasupo",
    "role": "student",
    "email": "olasupoelizabeth687@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "olatoyeboluwatifeoluwapelumi",
    "role": "student",
    "email": "olatoyeboluwatifeoluwapelumi@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Olatunji Israel",
    "role": "student",
    "email": "olatunjiisrael501@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "olawale.adetunji",
    "role": "student",
    "email": "olawale.adetunji@gmail.com",
    "status": "suspended",
    "program": "Master of Project Management, Minor in Non-Profit Project Management"
  },
  {
    "name": "adebayo olawale",
    "role": "student",
    "email": "olawalemman84@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "olawoleboluwatife2",
    "role": "student",
    "email": "olawoleboluwatife2@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Oyinloye Mary Olawumi",
    "role": "student",
    "email": "olawumimaryoyinloye@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "olayinkaadegun",
    "role": "student",
    "email": "olayinkaadegun@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "olayiwolaolu",
    "role": "student",
    "email": "olayiwolaolu@gmail.com",
    "status": "suspended",
    "program": "MA in Organisational Leadership, Minor in Christian Ethics"
  },
  {
    "name": "Dr Abbi Paul Oniya",
    "role": "student",
    "email": "old4cmultilinksnigeria@gmail.com",
    "status": "suspended",
    "program": "Certificate in Faith-Based Organizational Leadership & Governance"
  },
  {
    "name": "Olive given",
    "role": "student",
    "email": "olivegiven2@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "oliver.ijeri",
    "role": "student",
    "email": "oliver.ijeri@yahoo.com",
    "status": "suspended",
    "program": "PHd Business Administration Minor in Non-Profit Business Management"
  },
  {
    "name": "Rhema Oliver",
    "role": "student",
    "email": "oliverrhema1@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "olofinleolanike",
    "role": "student",
    "email": "olofinleolanike@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "olokanabiodun",
    "role": "student",
    "email": "olokanabiodun@gmail.com",
    "status": "suspended",
    "program": "MASTER"
  },
  {
    "name": "Joel olok",
    "role": "student",
    "email": "olokjoel@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Dara Oloko",
    "role": "student",
    "email": "olokodara@gmail.com",
    "status": "suspended"
  },
  {
    "name": "oloomelvin8",
    "role": "student",
    "email": "oloomelvin8@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Tunde olori E",
    "role": "student",
    "email": "olorietunde@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Olorungbemi Oluwademilade",
    "role": "student",
    "email": "olorungbemioluwademilade@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Oluwaferanmi Olorungbemi",
    "role": "student",
    "email": "olorungbemioluwaferanmi@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Oloruntoba James",
    "role": "student",
    "email": "oloruntobajames04@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Bukola Olowosile",
    "role": "student",
    "email": "olowosilebukola2026@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "olubowaleeunice",
    "role": "student",
    "email": "olubowaleeunice@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Ihitegbulem Oluchi",
    "role": "student",
    "email": "oluchiihite011@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ariyo Olugbadebo",
    "role": "student",
    "email": "oludebo7@gmail.com",
    "status": "suspended"
  },
  {
    "name": "oludennis2001",
    "role": "student",
    "email": "oludennis2001@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "olufemiogunfuwa978",
    "role": "student",
    "email": "olufemiogunfuwa978@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Olufunke Mercy",
    "role": "student",
    "email": "olufunkem7@gmail.com",
    "status": "suspended"
  },
  {
    "name": "olufunmiladipo",
    "role": "student",
    "email": "olufunmiladipo@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "olufunmilayo2711",
    "role": "student",
    "email": "olufunmilayo2711@gmail.com",
    "status": "suspended",
    "program": "MASTER IN PUBLIC ADMINISTRATION (MPA)"
  },
  {
    "name": "Olufunto Toki",
    "role": "student",
    "email": "olufuntotoki@gmail.com",
    "status": "suspended",
    "program": "Master in Public Administration Minor in Non-profit & Faith-based Leadership"
  },
  {
    "name": "olukunle.alamu",
    "role": "student",
    "email": "olukunle.alamu@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Olukunle Okebule",
    "role": "student",
    "email": "olukunleokebule@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "OLULEYE ADEWUMI ODEBUNMI",
    "role": "student",
    "email": "oluleyeadeo@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "olumaiyeguntobi52",
    "role": "student",
    "email": "olumaiyeguntobi52@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Olumide Abiola",
    "role": "student",
    "email": "olumidechris123@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Olafimihan Matthew",
    "role": "student",
    "email": "oluolafimihan@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "olusegunakinyemi1",
    "role": "student",
    "email": "olusegunakinyemi1@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "olusegunakinyemi1",
    "role": "student",
    "email": "olusegunakinyemi1@gmil.com",
    "status": "suspended"
  },
  {
    "name": "Oluseyi Afolabi",
    "role": "student",
    "email": "oluseyiafolabi8@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "olusola4real002",
    "role": "student",
    "email": "olusola4real002@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "Michael Oluti",
    "role": "student",
    "email": "olutimichael77@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "olutimivictor",
    "role": "student",
    "email": "olutimivictor@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "oluwaanu816",
    "role": "student",
    "email": "oluwaanu816@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "oluwabusayomi olajubu",
    "role": "student",
    "email": "oluwabusayomiolajubu@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Oluwafemi Fagbola",
    "role": "student",
    "email": "oluwafemifagbola941@gmail.com",
    "status": "suspended"
  },
  {
    "name": "oluwafemimodupeatinuke",
    "role": "student",
    "email": "oluwafemimodupeatinuke@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "oluwafunminiyipeterafolabi",
    "role": "student",
    "email": "oluwafunminiyipeterafolabi@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Oluwagbemi",
    "role": "student",
    "email": "oluwagbemijolajide49@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Law & Digital Technology"
  },
  {
    "name": "oluwagbemiolajide2009",
    "role": "student",
    "email": "oluwagbemiolajide2009@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Oluwagbemiro Fiye",
    "role": "student",
    "email": "oluwagbemirofiye@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Love Mogbolade Oluwa James",
    "role": "student",
    "email": "oluwajameslovemogbolade@gmail.com",
    "status": "suspended"
  },
  {
    "name": "oluwanifemioladipo9",
    "role": "student",
    "email": "oluwanifemioladipo9@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "oluwapelumideb8",
    "role": "student",
    "email": "oluwapelumideb8@gmail.com",
    "status": "suspended"
  },
  {
    "name": "oluwasemiloresther2404",
    "role": "student",
    "email": "oluwasemiloresther2404@gmail.com",
    "status": "suspended"
  },
  {
    "name": "oluwaseun.erinfolami",
    "role": "student",
    "email": "oluwaseun.erinfolami@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Oluwaseyi Alex",
    "role": "student",
    "email": "oluwaseyialex695@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "oluwaseyitemitopevanderpuye",
    "role": "student",
    "email": "oluwaseyitemitopevanderpuye@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "oluwasolastephen97",
    "role": "student",
    "email": "oluwasolastephen97@gmail.com",
    "status": "suspended"
  },
  {
    "name": "oluwatimilehinblessing25",
    "role": "student",
    "email": "oluwatimilehinblessing25@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "oluwatobiafolabi300",
    "role": "student",
    "email": "oluwatobiafolabi300@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "oluwatobifunmi3",
    "role": "student",
    "email": "oluwatobifunmi3@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Oluwatobi Olusegun",
    "role": "student",
    "email": "oluwatobioolusegun@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "oluwatomikoya",
    "role": "student",
    "email": "oluwatomikoya@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "oluwatoyinodifa",
    "role": "student",
    "email": "oluwatoyinodifa@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Oluwatobiloba Israel",
    "role": "student",
    "email": "oluwatsax2000@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "oluwayemisiabimbola21",
    "role": "student",
    "email": "oluwayemisiabimbola21@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "olyvettechebe496",
    "role": "student",
    "email": "olyvettechebe496@gmail.com",
    "status": "suspended"
  },
  {
    "name": "olyvettechebet496",
    "role": "student",
    "email": "olyvettechebet496@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "omedecharles",
    "role": "student",
    "email": "omedecharles@gmail.com",
    "status": "suspended"
  },
  {
    "name": "omenep1",
    "role": "student",
    "email": "omenep1@yahoo.com",
    "status": "suspended",
    "program": "Bachelor Counseling & Psychology"
  },
  {
    "name": "Omobilejo Janet",
    "role": "student",
    "email": "omobilejojanet@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "OMOBILEJO VICTOR",
    "role": "student",
    "email": "omobilejovictormaye@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "omokhualegodswill",
    "role": "student",
    "email": "omokhualegodswill@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "omokhualeronald",
    "role": "student",
    "email": "omokhualeronald@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "omokhualeronald",
    "role": "student",
    "email": "omokhualeronald@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "omokhualevictory2",
    "role": "student",
    "email": "omokhualevictory2@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Omokhuale Victory",
    "role": "student",
    "email": "omokhualevictory@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Ekunnusi Omolara",
    "role": "student",
    "email": "omolaraekunnusi@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Omoleke Jonathan",
    "role": "student",
    "email": "omolekej@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Omoleye Olamide",
    "role": "student",
    "email": "omoleyeolamide9@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Leone Odhiambo",
    "role": "student",
    "email": "omondi.leonee@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "George",
    "role": "student",
    "email": "omondig773@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "alao omoniyi",
    "role": "student",
    "email": "omoniyialao02@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "omosedeosidele",
    "role": "student",
    "email": "omosedeosidele@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Omotosho Aduragbemi AD FUNK",
    "role": "student",
    "email": "omotoshoad.funk@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "omotoshooluwanishola821",
    "role": "student",
    "email": "omotoshooluwanishola821@gmail.com",
    "status": "suspended"
  },
  {
    "name": "omotoshoshola52",
    "role": "student",
    "email": "omotoshoshola52@gmail.com",
    "status": "suspended"
  },
  {
    "name": "VICTOR OMOVIC",
    "role": "student",
    "email": "omovicvictor@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Owosangba Omoyemi",
    "role": "student",
    "email": "omoyem4all@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Kehinde Abiodun",
    "role": "student",
    "email": "omoyemihelen2024@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Omura Willard",
    "role": "student",
    "email": "omurawillard@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ONGEI HARRIET ATIENO",
    "role": "student",
    "email": "ongeiharrietatieno@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Martin Otiso",
    "role": "student",
    "email": "ongerimku@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "onibabaoladamola",
    "role": "student",
    "email": "onibabaoladamola@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "onifconsult",
    "role": "student",
    "email": "onifconsult@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "oni folashade",
    "role": "student",
    "email": "onifolashadeebunoluwa@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Lydia Onimisi",
    "role": "student",
    "email": "onimisilydia@gmail.com",
    "status": "suspended"
  },
  {
    "name": "oniyun Abiodun",
    "role": "student",
    "email": "oniyunabiodun@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "onlyebenprince",
    "role": "student",
    "email": "onlyebenprince@gmail.com",
    "status": "suspended",
    "program": "Human Resources"
  },
  {
    "name": "onuchejames3",
    "role": "student",
    "email": "onuchejames3@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "OJ ONUH",
    "role": "student",
    "email": "onujack1@gmail.com",
    "status": "suspended",
    "program": "MSC LEADERSHIP DEVELOPMENT"
  },
  {
    "name": "JULIET ONUORA",
    "role": "student",
    "email": "onuorajuliet2001@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Onwuakpa Arinze Israel",
    "role": "student",
    "email": "onwuakpaarinzeisrael@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Dominic Onwujiogu",
    "role": "student",
    "email": "onwujiogud@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "onyebuchi nwachukwu",
    "role": "student",
    "email": "onyebunwa@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Onyechi Blessingnkemjika",
    "role": "student",
    "email": "onyechiblessingnkemjika@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Valentine David",
    "role": "student",
    "email": "onyedieke1@gmail.com",
    "status": "suspended"
  },
  {
    "name": "onyegladys",
    "role": "student",
    "email": "onyegladys@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "onyekwerejones22",
    "role": "student",
    "email": "onyekwerejones22@gmail.com",
    "status": "suspended"
  },
  {
    "name": "onyikenkechi237",
    "role": "student",
    "email": "onyikenkechi237@gmail.com",
    "status": "suspended"
  },
  {
    "name": "onyinwankpa6",
    "role": "student",
    "email": "onyinwankpa6@gmail.com",
    "status": "suspended"
  },
  {
    "name": "onyinyechiosunde",
    "role": "student",
    "email": "onyinyechiosunde@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "oogbonnafavour",
    "role": "student",
    "email": "oogbonnafavour@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "oolakitan6",
    "role": "student",
    "email": "oolakitan6@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ooolusegun94",
    "role": "student",
    "email": "ooolusegun94@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "oosita23",
    "role": "student",
    "email": "oosita23@yahoo.com",
    "status": "suspended",
    "program": "Master of public Admiistration (MPA)"
  },
  {
    "name": "Ogundere Opeyemo",
    "role": "student",
    "email": "opelolatj@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "opeyemiabigael7",
    "role": "student",
    "email": "opeyemiabigael7@gmail.com",
    "status": "suspended",
    "program": "Msc. Organizational leadership and cultural management"
  },
  {
    "name": "opeyemi alao",
    "role": "student",
    "email": "opeyemialao11@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Opeyemi Omotayo",
    "role": "student",
    "email": "opeyemiomotayo1@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Opoola Boluwatife",
    "role": "student",
    "email": "opoolaboluwatife13@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Orebajo Boluwatife fathia",
    "role": "student",
    "email": "orebajoboluwatifefathia@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "oreoluwa4praise",
    "role": "student",
    "email": "oreoluwa4praise@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Oreoluwa Adesanyan",
    "role": "student",
    "email": "oreoluwaadesanya08@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "orikemir",
    "role": "student",
    "email": "orikemir@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Orisabiyi Boluwatife",
    "role": "student",
    "email": "orisabiyiboluwatife090@gmail.com",
    "status": "suspended"
  },
  {
    "name": "orisajioluwatimileyin",
    "role": "student",
    "email": "orisajioluwatimileyin@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Nwamaka Grace Orji",
    "role": "student",
    "email": "orjinwamakagrace@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Queen Orji",
    "role": "student",
    "email": "orjiqueen1@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Orosanya Oyebola",
    "role": "student",
    "email": "orosanyaoyebola@gmail.com",
    "status": "suspended"
  },
  {
    "name": "osakwe p",
    "role": "student",
    "email": "osakwephyllis.n@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "osanyinrachel",
    "role": "student",
    "email": "osanyinrachel@gmail.com",
    "status": "suspended"
  },
  {
    "name": "oscarnnamso",
    "role": "student",
    "email": "oscarnnamso@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "oshikefriday123",
    "role": "student",
    "email": "oshikefriday123@gmail.com",
    "status": "suspended",
    "program": "BSc in Humanitarian And Conflict Responses"
  },
  {
    "name": "Mary Oshili",
    "role": "student",
    "email": "oshili.maryk@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Osifo Victoria",
    "role": "student",
    "email": "osifovictoria31@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Obiora Ibezim",
    "role": "student",
    "email": "osinelu@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ositaulokoo",
    "role": "student",
    "email": "ositaulokoo@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ositaulokoo",
    "role": "student",
    "email": "ositaulokoo@gmail.comqe",
    "status": "suspended"
  },
  {
    "name": "osundairosamson",
    "role": "student",
    "email": "osundairosamson@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Osunkolati Oluwafunmilayo",
    "role": "student",
    "email": "osunkolatioluwafunmilayo0@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "otcrestre",
    "role": "student",
    "email": "otcrestre@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "otienoraphael04",
    "role": "student",
    "email": "otienoraphael04@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "otilemuwaempowermentfoundation",
    "role": "student",
    "email": "otilemuwaempowermentfoundation@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "otitigbeoghenekevweblessed",
    "role": "student",
    "email": "otitigbeoghenekevweblessed@gmail.com",
    "status": "suspended"
  },
  {
    "name": "owe2sanda",
    "role": "student",
    "email": "owe2sanda@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "owinostephen186",
    "role": "student",
    "email": "owinostephen186@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Owoh Anthony",
    "role": "student",
    "email": "owohanthony2020@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Herine Owuor",
    "role": "student",
    "email": "owuorherine3@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Science in christian Counseling and Psychology"
  },
  {
    "name": "Beatrice Owusu Agyemang",
    "role": "student",
    "email": "owusuagyemangbeatrice@gmail.com",
    "status": "suspended"
  },
  {
    "name": "oyebefunpeace1",
    "role": "student",
    "email": "oyebefunpeace1@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "oyedelet266",
    "role": "student",
    "email": "oyedelet266@gmail.com",
    "status": "suspended"
  },
  {
    "name": "oyedepoadesoji",
    "role": "student",
    "email": "oyedepoadesoji@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "oyedotunremmy1983",
    "role": "student",
    "email": "oyedotunremmy1983@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "oyejesusegunfunmi",
    "role": "student",
    "email": "oyejesusegunfunmi@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Oyeniyi Damilola Christianah",
    "role": "student",
    "email": "oyeniyidamilolachristianah@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "oyeniyi isaac",
    "role": "student",
    "email": "oyeniyiisaac777@gmail.com",
    "status": "suspended",
    "program": "MSC Leadership Development"
  },
  {
    "name": "Oyeniyi Kehinde",
    "role": "student",
    "email": "oyeniyikehinde913@gmail.com",
    "status": "suspended"
  },
  {
    "name": "MARY OYETAKIN",
    "role": "student",
    "email": "oyetakinmary@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "oyewumitomiwa5",
    "role": "student",
    "email": "oyewumitomiwa5@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "oyin6432",
    "role": "student",
    "email": "oyin6432@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Oreoluwa Oyinkansola",
    "role": "student",
    "email": "oyinkansolao659@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Percy v",
    "role": "student",
    "email": "p76030389@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "pacifiqueuk1",
    "role": "student",
    "email": "pacifiqueuk1@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "pada0877",
    "role": "student",
    "email": "pada0877@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Joshua Nwataeze",
    "role": "student",
    "email": "paddyjosh12@gmail.com",
    "status": "suspended",
    "program": "Masters"
  },
  {
    "name": "padorcgloballtd",
    "role": "student",
    "email": "padorcgloballtd@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "pakande898",
    "role": "student",
    "email": "pakande898@gmail.com",
    "status": "suspended"
  },
  {
    "name": "pamelagwadi2",
    "role": "student",
    "email": "pamelagwadi2@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Law and Digital Technologies, minor in Faith-Based Org.Laws"
  },
  {
    "name": "oke pamilerin",
    "role": "student",
    "email": "pamilerinoke55@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Papitainer Ixix",
    "role": "student",
    "email": "papitainerixix@gmail.com",
    "status": "suspended"
  },
  {
    "name": "parissa.osawe",
    "role": "student",
    "email": "parissa.osawe@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Paschal Sanga",
    "role": "student",
    "email": "paschalsanga0@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Adebayo Abel Ifeoluwa",
    "role": "student",
    "email": "pastor2010abel@gmail.com",
    "status": "suspended",
    "program": "Certificate"
  },
  {
    "name": "Abah Sunday",
    "role": "student",
    "email": "pastorabah@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Pastor Charles E N Vonjo",
    "role": "student",
    "email": "pastorcharlesenv@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "pastordanieljob",
    "role": "student",
    "email": "pastordanieljob@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "CLEOPAS EBIKEAKPO",
    "role": "student",
    "email": "pastorebikeakpo@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Pastor Olemmo Ekubi",
    "role": "student",
    "email": "pastorekubiolemmo@gmail.com",
    "status": "suspended",
    "program": "Master of Public Administration (MPA) Minor: Nonprofit & Faith-Based Leadership"
  },
  {
    "name": "Pastor-Ifeoma Eze",
    "role": "student",
    "email": "pastorezeifeoma@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "Iyamu Moses",
    "role": "student",
    "email": "pastoriyamumoses503@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Kurt Young",
    "role": "student",
    "email": "pastorkurtyoung107j@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Dr. Wanda Page",
    "role": "student",
    "email": "pastorwandaministries@gmail.com",
    "status": "suspended"
  },
  {
    "name": "pataus1923",
    "role": "student",
    "email": "pataus1923@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Patience Enya",
    "role": "student",
    "email": "patgee2020@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Patrick Musa",
    "role": "student",
    "email": "patomusa4life@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "patriciaatugabiirwe",
    "role": "student",
    "email": "patriciaatugabiirwe@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Patricia Bennitah",
    "role": "student",
    "email": "patriciabennitah@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "patriciarobinson865",
    "role": "student",
    "email": "patriciarobinson865@icloud.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "patrick-987",
    "role": "student",
    "email": "patrick-987@gmail.com",
    "status": "suspended"
  },
  {
    "name": "patrick adonyo",
    "role": "student",
    "email": "patrickadonyo@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "patrickebcooper",
    "role": "student",
    "email": "patrickebcooper@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "JoyNoble Patrick",
    "role": "student",
    "email": "patrickjoynoble@gmail.com",
    "status": "suspended"
  },
  {
    "name": "patrickokiror5",
    "role": "student",
    "email": "patrickokiror5@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Eloghosa Paula",
    "role": "student",
    "email": "paulaeloghosa@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "paulagobara",
    "role": "student",
    "email": "paulagobara@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Paul azegbea",
    "role": "student",
    "email": "paulazegbea6@gmail.com",
    "status": "suspended",
    "program": "BA, Healthcare Administration"
  },
  {
    "name": "paulchuks1923",
    "role": "student",
    "email": "paulchuks1923@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Christopher Paul dollah",
    "role": "student",
    "email": "pauldollahchristopher@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Yabvo Paul",
    "role": "student",
    "email": "paulix247@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "John paul Mendy",
    "role": "student",
    "email": "pauljohnmendy123@gmail.com",
    "status": "suspended",
    "program": "Bachelor in Theology and Ethics (Minor in Faith-Based Faith-Based Leadership)"
  },
  {
    "name": "MERCY PAUL",
    "role": "student",
    "email": "paulmercy62@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Paul",
    "role": "student",
    "email": "paulmusauje00@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "pauloskyakaat",
    "role": "student",
    "email": "pauloskyakaat@yahoo.com",
    "status": "suspended",
    "program": "Master of Public Administration, Minor in Nonprofit and Faith-based Leadership"
  },
  {
    "name": "paulproficient247",
    "role": "student",
    "email": "paulproficient247@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Paul Kamidi",
    "role": "student",
    "email": "paulswiny@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Philemon Bamaiyi",
    "role": "student",
    "email": "pbamaiyi@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Peace Eziukwu",
    "role": "student",
    "email": "peaceeziukwu7@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "peaceeziukwu",
    "role": "student",
    "email": "peaceeziukwu@gmail.com",
    "status": "suspended"
  },
  {
    "name": "peacefatokun",
    "role": "student",
    "email": "peacefatokun@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Peace Lambert",
    "role": "student",
    "email": "peacelambert25@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Peace Uduma",
    "role": "student",
    "email": "peacelanda228@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "peaceochim131",
    "role": "student",
    "email": "peaceochim131@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "pearlmerly",
    "role": "student",
    "email": "pearlmerly@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Taiwo Joshua Desinyon",
    "role": "student",
    "email": "peculiar4taiwo14@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Peggy Malaki",
    "role": "student",
    "email": "peggy.malaki@gmail.com",
    "status": "suspended"
  },
  {
    "name": "pejubolaji258",
    "role": "student",
    "email": "pejubolaji258@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "pekeurcaithlynn7",
    "role": "student",
    "email": "pekeurcaithlynn7@gmail.com",
    "status": "suspended"
  },
  {
    "name": "penninah Gilbert",
    "role": "student",
    "email": "pennygilz409@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "percy mamba",
    "role": "student",
    "email": "percyvmamba@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "perfectankeli",
    "role": "student",
    "email": "perfectankeli@gmail.com",
    "status": "suspended",
    "program": "Certificate"
  },
  {
    "name": "peterhannah058",
    "role": "student",
    "email": "peterhannah058@gmail.com",
    "status": "suspended",
    "program": "Master of Public Administration (MPA)"
  },
  {
    "name": "Peter Kimemia",
    "role": "student",
    "email": "peterikimemia@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Peter Jatta",
    "role": "student",
    "email": "peterjatta171@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Peter Lwaeba",
    "role": "student",
    "email": "peterlwaeba69@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "petermaryudoh",
    "role": "student",
    "email": "petermaryudoh@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "peter olajide",
    "role": "student",
    "email": "peterolajide2014@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Peter Sahr H Jangah",
    "role": "student",
    "email": "petersahrhjangah@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Jeremane Petrus",
    "role": "student",
    "email": "petrusjeremane98@gmail.com",
    "status": "suspended"
  },
  {
    "name": "pgraphics60",
    "role": "student",
    "email": "pgraphics60@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Bala Habib",
    "role": "student",
    "email": "phabibthomcy2017@gmail.com",
    "status": "suspended",
    "program": "Certificate"
  },
  {
    "name": "Lawal Feyisayo",
    "role": "student",
    "email": "pheyisayo.lawal@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "phielmiel",
    "role": "student",
    "email": "phielmiel@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Philani Wakhile Dlamini",
    "role": "student",
    "email": "philaniwakhiledlamini@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "philip Moiwo",
    "role": "student",
    "email": "philipmoiwo288@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "philip moiwo",
    "role": "student",
    "email": "philipmoiwo@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Phina Kanu",
    "role": "student",
    "email": "phinakanu1@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Phiona Nalubanga",
    "role": "student",
    "email": "phionanalubanga28@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Phiwinhlanhla Shabangu",
    "role": "student",
    "email": "phiwinhlanhlashabangu0@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Business Administration, Minor in Non-Profit Business Management"
  },
  {
    "name": "Pheello Views",
    "role": "student",
    "email": "phllmaduna1@gmail.com",
    "status": "suspended"
  },
  {
    "name": "phyllisosakwe",
    "role": "student",
    "email": "phyllisosakwe@gmail.com",
    "status": "suspended",
    "program": "CERTIFICATE IN CHAPLAINCY"
  },
  {
    "name": "ADEJUMO PETER",
    "role": "student",
    "email": "piro4jesus@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Pius Vellah",
    "role": "student",
    "email": "piusvellah24@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Simphiwe Malaza",
    "role": "student",
    "email": "piyose1970@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "John Michael",
    "role": "student",
    "email": "pizwev2001@gmail.com",
    "status": "suspended"
  },
  {
    "name": "pkaboneka",
    "role": "student",
    "email": "pkaboneka@gmail.com",
    "status": "suspended",
    "program": "B/ARTS IN MARKETING AND ADVERTISING"
  },
  {
    "name": "Anuoluwapo Babatunde",
    "role": "student",
    "email": "pobiyanrin@gmail.com",
    "status": "suspended"
  },
  {
    "name": "pollysemeyian",
    "role": "student",
    "email": "pollysemeyian@gmail.com",
    "status": "suspended",
    "program": "Masters"
  },
  {
    "name": "Samuel Popoola",
    "role": "student",
    "email": "popoolaoyegunle@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Poroye Segun",
    "role": "student",
    "email": "poroyesegun37@gmail.com",
    "status": "suspended"
  },
  {
    "name": "postephbiumas",
    "role": "student",
    "email": "postephbiumas@gmail.com",
    "status": "suspended",
    "program": "Master of Public Administration (MPA), Minor in Nonprofit & Faith-Based Leadership"
  },
  {
    "name": "pqhenry2x",
    "role": "student",
    "email": "pqhenry2x@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "praisedorbor265",
    "role": "student",
    "email": "praisedorbor265@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Praise Margai",
    "role": "student",
    "email": "praisemargai@gmail.com",
    "status": "suspended"
  },
  {
    "name": "praisemorning",
    "role": "student",
    "email": "praisemorning@yahoo.co.uk",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "praxedesndindi",
    "role": "student",
    "email": "praxedesndindi@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "Prayer",
    "role": "student",
    "email": "prayergold69@gmail.com",
    "status": "suspended"
  },
  {
    "name": "preciousgold727",
    "role": "student",
    "email": "preciousgold727@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "preciousyerindideke",
    "role": "student",
    "email": "preciousyerindideke@gmali.com",
    "status": "suspended"
  },
  {
    "name": "presleyomene",
    "role": "student",
    "email": "presleyomene@gmail.com",
    "status": "suspended",
    "program": "Master of Public Administration (MPA), Minor in Nonprofit & Faith-Based Leadership"
  },
  {
    "name": "Prince Abighe",
    "role": "student",
    "email": "princeabighe6@gmail.com",
    "status": "suspended",
    "program": "Bachelor IT Support"
  },
  {
    "name": "princeadeparusi080",
    "role": "student",
    "email": "princeadeparusi080@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "princehosea",
    "role": "student",
    "email": "princehosea@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Prince Jake",
    "role": "student",
    "email": "princejake247@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "princeobor86",
    "role": "student",
    "email": "princeobor86@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "princeoscar",
    "role": "student",
    "email": "princeoscar@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Prince Osiro",
    "role": "student",
    "email": "princeosiro@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "princessariel8777",
    "role": "student",
    "email": "princessariel8777@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Idowu Banke",
    "role": "student",
    "email": "princessidowu1984@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "princessomon90",
    "role": "student",
    "email": "princessomon90@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "priscillanaandeti",
    "role": "student",
    "email": "priscillanaandeti@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "priscillaomene",
    "role": "student",
    "email": "priscillaomene@gmail.com",
    "status": "suspended",
    "program": "Master of Organizational Leadership, Minor in Christian Ethics"
  },
  {
    "name": "pro.drakengesa",
    "role": "student",
    "email": "pro.drakengesa@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "professor.fullwood.hbius",
    "role": "student",
    "email": "professor.fullwood.hbius@gmail.com",
    "status": "suspended"
  },
  {
    "name": "proficientpaul649",
    "role": "student",
    "email": "proficientpaul649@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Prophetess Dr Nkechinyerem",
    "role": "student",
    "email": "prophetessdrnkechinyerem@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Proxy Receptor",
    "role": "student",
    "email": "proxyreceptor@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Fagunwa Samson",
    "role": "student",
    "email": "psamfex101@gmail.com",
    "status": "suspended"
  },
  {
    "name": "PASTOR IFEANYI Sunday",
    "role": "student",
    "email": "pstifysun@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "pstrpeter",
    "role": "student",
    "email": "pstrpeter@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "REV. SOROBI",
    "role": "student",
    "email": "pstsorobi@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "psychologyandyou",
    "role": "student",
    "email": "psychologyandyou@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Judah Atemba",
    "role": "student",
    "email": "psychologyclass026@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Julius Adegunna",
    "role": "student",
    "email": "ptlnewsng@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ptshepisoneo",
    "role": "student",
    "email": "ptshepisoneo@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Pusin",
    "role": "student",
    "email": "pusin9311@gmail.com",
    "status": "suspended"
  },
  {
    "name": "qdeelara",
    "role": "student",
    "email": "qdeelara@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "qe66948",
    "role": "student",
    "email": "qe66948@gmail.com",
    "status": "suspended"
  },
  {
    "name": "qiqimanem",
    "role": "student",
    "email": "qiqimanem@gmail.com",
    "status": "suspended"
  },
  {
    "name": "qmailer",
    "role": "student",
    "email": "qmailer@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "qozeemibraheem",
    "role": "student",
    "email": "qozeemibraheem@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "quodara19",
    "role": "student",
    "email": "quodara19@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Rachael Abikure",
    "role": "student",
    "email": "rachael.sunnyideke6@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Racheal Adams",
    "role": "student",
    "email": "rachealadamz08@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "rahmatu2626",
    "role": "student",
    "email": "rahmatu2626@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "rammyruth",
    "role": "student",
    "email": "rammyruth@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Rahab N. Mwangi",
    "role": "student",
    "email": "ranjosmwa@gmail.com",
    "status": "suspended",
    "program": "PhD in Marriage and Family Therapy with Specialization in Addiction Counselling"
  },
  {
    "name": "Raphael Olabosoye",
    "role": "student",
    "email": "raphaelolabosoye@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "raphaelsdesk",
    "role": "student",
    "email": "raphaelsdesk@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "raphealisaac57",
    "role": "student",
    "email": "raphealisaac57@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Boingotlo Rapoo",
    "role": "student",
    "email": "rapooboingotlo@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Rasheeda Ojuolape",
    "role": "student",
    "email": "rasheedaojuolape@gmail.com",
    "status": "suspended"
  },
  {
    "name": "rastopsenior3",
    "role": "student",
    "email": "rastopsenior3@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "rastopsenior6",
    "role": "student",
    "email": "rastopsenior6@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ravoy",
    "role": "student",
    "email": "ravmckenzie15@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "rayland001",
    "role": "student",
    "email": "rayland001@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Raymond Ian Brima Sharkah",
    "role": "student",
    "email": "raymondianbrimas@gmail.com",
    "status": "suspended"
  },
  {
    "name": "rayndlela",
    "role": "student",
    "email": "rayndlela@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "rbcsltd16",
    "role": "student",
    "email": "rbcsltd16@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "reachisaacnow",
    "role": "student",
    "email": "reachisaacnow@gmail.com",
    "status": "suspended",
    "program": "Bachelor of science (B.S) in Cyber security Minor in Data Protection for Faith- Based Organization"
  },
  {
    "name": "Reaghan Omondi",
    "role": "student",
    "email": "reaghanomondi9016@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Rebecca Julius",
    "role": "student",
    "email": "rebeccamunaniejulius@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Rebecca Nkansah",
    "role": "student",
    "email": "rebeccankansah02@gmail.com",
    "status": "suspended"
  },
  {
    "name": "reedsinternational",
    "role": "student",
    "email": "reedsinternational@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Eric Nwogu",
    "role": "student",
    "email": "reeko3d@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Amongin Reginah",
    "role": "student",
    "email": "reginahamongin@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Kevon Reid",
    "role": "student",
    "email": "reid.dcseminary@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Kevon Reid",
    "role": "student",
    "email": "reidkevon471@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Rejoice Inyama",
    "role": "student",
    "email": "rejoiceinyama@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "rembiz48",
    "role": "student",
    "email": "rembiz48@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "remi.oyedotun",
    "role": "student",
    "email": "remi.oyedotun@pgc.uniosun.edu.ng",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "remidamilola",
    "role": "student",
    "email": "remidamilola@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "researchedck",
    "role": "student",
    "email": "researchedck@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Samuel Fening Nimako",
    "role": "student",
    "email": "revfening@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Rev Iyke E Orji",
    "role": "student",
    "email": "reviykeeorji@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Joel Kimuyu",
    "role": "student",
    "email": "revjoekim@gmail.com",
    "status": "suspended"
  },
  {
    "name": "jonathan-davids dike",
    "role": "student",
    "email": "revjonathandike@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Rev. Dr. Anthony Mwanthi",
    "role": "student",
    "email": "revmmanthony@gmail.com",
    "status": "suspended",
    "program": "PhD in Leadership And Cultural Management"
  },
  {
    "name": "Nwankpa Emmanuel Nnanna",
    "role": "student",
    "email": "revnwankpaemmanuelnnanna@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "solomon osejiele",
    "role": "student",
    "email": "revsolo4life@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Rhema Oliver",
    "role": "student",
    "email": "rhemaoliver5@gmail.com",
    "status": "suspended"
  },
  {
    "name": "rhodamacng1",
    "role": "student",
    "email": "rhodamacng1@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Rhoda Oguntola",
    "role": "student",
    "email": "rhodaoguntolanike@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Tasha-Ann S Richards",
    "role": "student",
    "email": "ricardstashaann@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "richardosuolale234",
    "role": "student",
    "email": "richardosuolale234@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Richard Pambu",
    "role": "student",
    "email": "richardpambu22@gmail.com",
    "status": "suspended",
    "program": "Bachelor of science in Healthcare administration minor in ministry"
  },
  {
    "name": "richieomobosinuola",
    "role": "student",
    "email": "richieomobosinuola@gmail.com",
    "status": "suspended"
  },
  {
    "name": "OSAWE SHARON",
    "role": "student",
    "email": "ricobrendalyn@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Nkem Glory",
    "role": "student",
    "email": "risennkem4eva@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "rispera.owino",
    "role": "student",
    "email": "rispera.owino@gmail.com",
    "status": "suspended"
  },
  {
    "name": "roberkip81",
    "role": "student",
    "email": "roberkip81@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "robertakena567",
    "role": "student",
    "email": "robertakena567@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "robertakena993",
    "role": "student",
    "email": "robertakena993@gmail.com",
    "status": "suspended"
  },
  {
    "name": "robertwele",
    "role": "student",
    "email": "robertwele@gmail.com",
    "status": "suspended",
    "program": "BACHELOR OF THEOLOGY"
  },
  {
    "name": "Mbayo Rogers",
    "role": "student",
    "email": "rogersmbayo8@gmail.com",
    "status": "suspended",
    "program": "Bachelors in Marketing and Advertising Media BFI"
  },
  {
    "name": "ronhichange",
    "role": "student",
    "email": "ronhichange@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Rosaline Amara",
    "role": "student",
    "email": "rosalineamara0@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Roselyn Afolabi",
    "role": "student",
    "email": "roseleenafolabi@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Rosemary Ella",
    "role": "student",
    "email": "rosemaryella902@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Rosemary Frank",
    "role": "student",
    "email": "rosemaryfrank02@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Rose Nzeagwu",
    "role": "student",
    "email": "rosenzeagwu@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "rosettenjuya1978",
    "role": "student",
    "email": "rosettenjuya1978@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Rose Uhuru",
    "role": "student",
    "email": "roseuhuru@gmail.com",
    "status": "suspended",
    "program": "Doctorate"
  },
  {
    "name": "rosey.donkor",
    "role": "student",
    "email": "rosey.donkor@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Roseline Ahmed",
    "role": "student",
    "email": "rossybeez73@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "rosytrends",
    "role": "student",
    "email": "rosytrends@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "rotifafeyisayo.4christ",
    "role": "student",
    "email": "rotifafeyisayo.4christ@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "rotifafeyisayo4christ",
    "role": "student",
    "email": "rotifafeyisayo4christ@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Opeyemi Alex",
    "role": "student",
    "email": "rotimialex115@gmail.com",
    "status": "suspended"
  },
  {
    "name": "rotimialex51",
    "role": "student",
    "email": "rotimialex51@gmail.com",
    "status": "suspended"
  },
  {
    "name": "rowgrady",
    "role": "student",
    "email": "rowgrady@yahoo.com",
    "status": "suspended",
    "program": "Certificate"
  },
  {
    "name": "adebayo rufus",
    "role": "student",
    "email": "rufusadebayo2@gmail.com",
    "status": "suspended"
  },
  {
    "name": "rukorir2016",
    "role": "student",
    "email": "rukorir2016@gmail.com",
    "status": "suspended"
  },
  {
    "name": "rukorir",
    "role": "student",
    "email": "rukorir@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ruraya Brian",
    "role": "student",
    "email": "rurayabrian@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Ruth Adedayo",
    "role": "student",
    "email": "ruthadedayo01@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ruthamaro2",
    "role": "student",
    "email": "ruthamaro2@gmail.com",
    "status": "suspended",
    "program": "Bachelor in Education Minor in Diverse Ministry Education"
  },
  {
    "name": "Ruth Ariyo",
    "role": "student",
    "email": "ruthariyo2009@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ruthariyo2009",
    "role": "student",
    "email": "ruthariyo2009@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "Ruth Ekeneme",
    "role": "student",
    "email": "ruthekeneme@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ruthiyaboadedayo2345",
    "role": "student",
    "email": "ruthiyaboadedayo539@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Ruth Massaquoi",
    "role": "student",
    "email": "ruthmassaquoi77@gmail.com",
    "status": "suspended"
  },
  {
    "name": "RUTH MUTHONI",
    "role": "student",
    "email": "ruthmuthoni578@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Oluwapelumi Ruth",
    "role": "student",
    "email": "rutholuwapelumi13@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ruthsitajalloh2",
    "role": "student",
    "email": "ruthsitajalloh2@gmail.com",
    "status": "suspended",
    "program": "Bachelor's in Education in Diverse Ministry Education"
  },
  {
    "name": "ruukorir2016",
    "role": "student",
    "email": "ruukorir2016@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Sibusiso Ngwendu",
    "role": "student",
    "email": "s.ngwenduss@gmail.com",
    "status": "suspended",
    "program": "Certificate"
  },
  {
    "name": "Siyanda Nxumalo",
    "role": "student",
    "email": "s61870108@gmail.com",
    "status": "suspended"
  },
  {
    "name": "saautaverisaac",
    "role": "student",
    "email": "saautaverisaac@gmail.com",
    "status": "suspended"
  },
  {
    "name": "sabaestherelasheva",
    "role": "student",
    "email": "sabaestherelasheva@gmail.com",
    "status": "suspended"
  },
  {
    "name": "sabetidy",
    "role": "student",
    "email": "sabetidy@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "saburatukamara1231",
    "role": "student",
    "email": "saburatukamara1231@gimal.com",
    "status": "suspended"
  },
  {
    "name": "sacrod88",
    "role": "student",
    "email": "sacrod88@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Sadeka Chisholm",
    "role": "student",
    "email": "sadeka.chisholm@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "SAFFIATU FARMA",
    "role": "student",
    "email": "saffiatufarma24@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "sagwepal",
    "role": "student",
    "email": "sagwepal@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Sahr Jangah",
    "role": "student",
    "email": "sahrjangah@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Saidu Mohd Adamu",
    "role": "student",
    "email": "saidumohdadamu99@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Sakhile Mzwandile Khumalo",
    "role": "student",
    "email": "sakhilemzwandilek@gmail.com",
    "status": "suspended"
  },
  {
    "name": "salakoanuoluwapo2017",
    "role": "student",
    "email": "salakoanuoluwapo2017@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Salem Favour",
    "role": "student",
    "email": "salemfavour001@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Salima Macharia",
    "role": "student",
    "email": "salimamacharia@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Sally Museo",
    "role": "student",
    "email": "sallymuseo8@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "samailayax",
    "role": "student",
    "email": "samailayax@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "samuel anyalechi",
    "role": "student",
    "email": "samanyalechi@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Samantha Oliver",
    "role": "student",
    "email": "samathaoliver409@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Sam Emmanuel",
    "role": "student",
    "email": "samemmanuel2016@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Sam gabriel Kanneh",
    "role": "student",
    "email": "samgabrielkanneh@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Hawa Sam",
    "role": "student",
    "email": "samhawa009@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Samiratu Kargbo",
    "role": "student",
    "email": "samiratukargbo734@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Sam-King Sovious John",
    "role": "student",
    "email": "samkingsoviousjohn84@gmail.com",
    "status": "suspended"
  },
  {
    "name": "samlaw",
    "role": "student",
    "email": "samlaw@example.com",
    "status": "suspended"
  },
  {
    "name": "Samlaw Lawrence",
    "role": "student",
    "email": "samlawlawrence2@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Science in IT support"
  },
  {
    "name": "Sammy oluwa Dunsin Abolurin",
    "role": "student",
    "email": "sammyoluwadunsinabolurin@gmail.com",
    "status": "suspended"
  },
  {
    "name": "sammy success",
    "role": "student",
    "email": "sammysuccess550@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Olawale Ajao",
    "role": "student",
    "email": "samolaforreal1@gmail.com",
    "status": "suspended",
    "program": "Master of Science in Project Management Minor in Faith-Based Management"
  },
  {
    "name": "Samuel Felix",
    "role": "student",
    "email": "samplexy13@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "samsonalonge",
    "role": "student",
    "email": "samsonalonge@outlook.com",
    "status": "suspended"
  },
  {
    "name": "Samson Fatokun",
    "role": "student",
    "email": "samsonfatokun1@gmail.com",
    "status": "suspended"
  },
  {
    "name": "SAMSON IDOWU OLORUNLEKE",
    "role": "student",
    "email": "samsonolorunleke@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Samuel Aramide",
    "role": "student",
    "email": "samuelaramide04@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "samuelayotoluwabunmi",
    "role": "student",
    "email": "samuelayotoluwabunmi@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "samuelconteh336",
    "role": "student",
    "email": "samuelconteh336@gmail.com",
    "status": "suspended",
    "program": "Bachelor of law and Digital Technology minor in faith Based organization"
  },
  {
    "name": "Convenant Samuel",
    "role": "student",
    "email": "samuelconvenant12@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Samuel Egbu chinaza",
    "role": "student",
    "email": "samuelegbu55@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "samuellabah27",
    "role": "student",
    "email": "samuellabah27@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Samuel Kandeh",
    "role": "student",
    "email": "samuellvstonian@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Science in IT Support, Minor in Technology Management For Faith-Based Organisations"
  },
  {
    "name": "Samuel Mawanda",
    "role": "student",
    "email": "samuelmawanda6491@gmail.com",
    "status": "suspended",
    "program": "Bachelor of science in Public Health"
  },
  {
    "name": "samueloduwale5",
    "role": "student",
    "email": "samueloduwale5@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "SAMUEL OLORUNSHOLA",
    "role": "student",
    "email": "samuelolorunshola@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Samuel Oloye",
    "role": "student",
    "email": "samueloloye@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "samuelsammy1012",
    "role": "student",
    "email": "samuelsammy1012@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "samuelshekukandeh",
    "role": "student",
    "email": "samuelshekukandeh@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Jesse Samuels",
    "role": "student",
    "email": "samuelsjesse127@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "samumcusi11",
    "role": "student",
    "email": "samumcusi11@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Samson Aruwa",
    "role": "student",
    "email": "samvicexcel@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "George Abraham Sandi",
    "role": "student",
    "email": "sandiabrahamgeorge@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Sandra Cossa",
    "role": "student",
    "email": "sandracossa91@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Sandy Presh",
    "role": "student",
    "email": "sandypresh117@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "sanemily777",
    "role": "student",
    "email": "sanemily777@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Ambilia sang",
    "role": "student",
    "email": "sangambilia@gmail.com",
    "status": "suspended",
    "program": "Bachelor of arts in chaplaincy"
  },
  {
    "name": "sannideck90",
    "role": "student",
    "email": "sannideck90@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Sao Williams",
    "role": "student",
    "email": "saowilliams02@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "sapphireheartmpcs1984",
    "role": "student",
    "email": "sapphireheartmpcs1984@gmail.com",
    "status": "suspended",
    "program": "Master of Strategic Leadership, Minor in Christian Leadership and Ethics"
  },
  {
    "name": "sarahbukola600",
    "role": "student",
    "email": "sarahbukola600@gmail.com",
    "status": "suspended"
  },
  {
    "name": "spe cial",
    "role": "student",
    "email": "saraphina166@gmail.com",
    "status": "suspended"
  },
  {
    "name": "sarnsarlvado88",
    "role": "student",
    "email": "sarnsarlvado88@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Sashell Cousin",
    "role": "student",
    "email": "sashisami.cousins@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "saulisooba4",
    "role": "student",
    "email": "saulisooba4@gmail.com",
    "status": "suspended"
  },
  {
    "name": "saulochieng8",
    "role": "student",
    "email": "saulochieng8@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Arts Christian Leadership And cultural management"
  },
  {
    "name": "saviouruko900",
    "role": "student",
    "email": "saviouruko900@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "sbakhulu",
    "role": "student",
    "email": "sbakhulu@icloud.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "sanusi samaila",
    "role": "student",
    "email": "sbalasanusi@gmail.com",
    "status": "suspended"
  },
  {
    "name": "sbongilestal",
    "role": "student",
    "email": "sbongilestal@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "scangels333",
    "role": "student",
    "email": "scangels333@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "sharon chebet",
    "role": "student",
    "email": "schebet655@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Scholar Ouzman TV",
    "role": "student",
    "email": "scholarval@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Abu Bakarr Conteh",
    "role": "student",
    "email": "scripturesrevealed225277@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "sebeneles93",
    "role": "student",
    "email": "sebeneles93@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Abdullahi Abubaka sediq",
    "role": "student",
    "email": "sediqasta@gmail.com",
    "status": "suspended"
  },
  {
    "name": "seguniroko49",
    "role": "student",
    "email": "seguniroko49@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "segunolowolekomo",
    "role": "student",
    "email": "segunolowolekomo@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Seguya Enock",
    "role": "student",
    "email": "seguyaem10@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Sylvester Ekpo",
    "role": "student",
    "email": "sekpo0408@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Sellah Owiti",
    "role": "student",
    "email": "sellahowiti6@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "senesiemassaquoi02",
    "role": "student",
    "email": "senesiemassaquoi02@gmail.com",
    "status": "suspended",
    "program": "BSc. Business Administration"
  },
  {
    "name": "Molfred Senesie",
    "role": "student",
    "email": "senesiemolfred@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "senghoremartin9",
    "role": "student",
    "email": "senghoremartin9@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Senator PNdubueze",
    "role": "student",
    "email": "senpcndubueze@gmail.com",
    "status": "suspended"
  },
  {
    "name": "senyo4722",
    "role": "student",
    "email": "senyo4722@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "sephone sospeter",
    "role": "student",
    "email": "sephonesospeter@gmail.com",
    "status": "suspended"
  },
  {
    "name": "sesay aminatas",
    "role": "student",
    "email": "sesayaminatas9858@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "sesayanthony216",
    "role": "student",
    "email": "sesayanthony216@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "sesayanthony538",
    "role": "student",
    "email": "sesayanthony538@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "sesayanthony761",
    "role": "student",
    "email": "sesayanthony761@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "sesayanthony793",
    "role": "student",
    "email": "sesayanthony793@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "sesayanthony840",
    "role": "student",
    "email": "sesayanthony840@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Anthony Sesay",
    "role": "student",
    "email": "sesayanthony903@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Sesethu Ngqulwana",
    "role": "student",
    "email": "sesethungqulwana292@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Seventh Concept Buildings",
    "role": "student",
    "email": "seventhconcept7@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Shamara Bull&agrave;h",
    "role": "student",
    "email": "sevvidiaz@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "seyakedung",
    "role": "student",
    "email": "seyakedung@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Sifiso E Shongwe",
    "role": "student",
    "email": "sfisoeshongwe@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Shabangu Nomcebo",
    "role": "student",
    "email": "shabangunomcebo49@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "shadedbyksf",
    "role": "student",
    "email": "shadedbyksf@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Tobiloba Shadrack",
    "role": "student",
    "email": "shadrackolaniran12@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ishaibu isah",
    "role": "student",
    "email": "shaibuisah58@gmail.com",
    "status": "suspended"
  },
  {
    "name": "shalomshalom025",
    "role": "student",
    "email": "shalomshalom025@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Shanice G",
    "role": "student",
    "email": "shanicegathogo05@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Shaniel Williams",
    "role": "student",
    "email": "shanielwilliams30@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Shanique Ferguson Neath",
    "role": "student",
    "email": "shaniquefergusonneath@gmail.com",
    "status": "suspended",
    "program": "Associate"
  },
  {
    "name": "shannistewart20",
    "role": "student",
    "email": "shannistewart20@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Shanique Ferguson Neath",
    "role": "student",
    "email": "shannyferguson123@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Kash Breezy",
    "role": "student",
    "email": "shaquillelewin3@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Sharifah Kuteesaakwe",
    "role": "student",
    "email": "sharifahkuteesaakwe@gmail.com",
    "status": "suspended",
    "program": "Bachelors"
  },
  {
    "name": "Adekeye Odunayo",
    "role": "student",
    "email": "sharonnod4christ@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "shawwalaliyu123",
    "role": "student",
    "email": "shawwalaliyu123@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Temiremi",
    "role": "student",
    "email": "shebagold8@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Shegzy Ola",
    "role": "student",
    "email": "shegzyoj08@gmail.com",
    "status": "suspended"
  },
  {
    "name": "sheinkezi",
    "role": "student",
    "email": "sheinkezi@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "shemayaabraham15",
    "role": "student",
    "email": "shemayaabraham15@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "shemayaabraham380",
    "role": "student",
    "email": "shemayaabraham380@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Sherika Williams",
    "role": "student",
    "email": "sherikanwilliams19@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Sherina Mirembe",
    "role": "student",
    "email": "sherinamirembe937@gmail.com",
    "status": "suspended",
    "program": "Bachelor of business administration/management"
  },
  {
    "name": "Shery Waziri",
    "role": "student",
    "email": "shery4sm@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Shevonese Facey",
    "role": "student",
    "email": "shevonesefacey094@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "shiego67",
    "role": "student",
    "email": "shiego67@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Adeshina Osho",
    "role": "student",
    "email": "shinaseyiosho@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "shirleyhillsglobal",
    "role": "student",
    "email": "shirleyhillsglobal@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Shola Bello",
    "role": "student",
    "email": "sholabello2204@gmail.com",
    "status": "suspended"
  },
  {
    "name": "sholaniji",
    "role": "student",
    "email": "sholaniji@yahoo.com.thanks",
    "status": "suspended"
  },
  {
    "name": "Adesola Omotayo",
    "role": "student",
    "email": "sholar.oz@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Shonnan Wallace",
    "role": "student",
    "email": "shonnanwallace@gmail.com",
    "status": "suspended",
    "program": "Associate"
  },
  {
    "name": "sibongisenidrayile28",
    "role": "student",
    "email": "sibongisenidrayile28@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "sibusiso.tsela",
    "role": "student",
    "email": "sibusiso.tsela@manzinicity.co.sz",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "sibusisotsela44",
    "role": "student",
    "email": "sibusisotsela44@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Thomas Sidede",
    "role": "student",
    "email": "sidedethomas@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "sigeigeffrey1999",
    "role": "student",
    "email": "sigeigeffrey1999@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Sihlwele Silinga",
    "role": "student",
    "email": "sihlwelesilinga@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Olusiji Vanderpuye",
    "role": "student",
    "email": "sijivanderpuye@gmail.com",
    "status": "suspended",
    "program": "Doctor of Divinity"
  },
  {
    "name": "sikwuagwu",
    "role": "student",
    "email": "sikwuagwu@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Silas Banni",
    "role": "student",
    "email": "silas2preach92@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Silas Azik Samuels",
    "role": "student",
    "email": "silasaziksamuels@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "silverose001",
    "role": "student",
    "email": "silverose001@gmail.com",
    "status": "suspended"
  },
  {
    "name": "simanga.motsa",
    "role": "student",
    "email": "simanga.motsa@manzinicity.co.sz",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Simanga Motsa",
    "role": "student",
    "email": "simangamotsa10111@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Nhlanhla Simelane",
    "role": "student",
    "email": "simelanenhlanhla965@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Simeon Nathaniel",
    "role": "student",
    "email": "simeonnathaniel9@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "John chika Simon",
    "role": "student",
    "email": "simjohn098@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "simmytex60",
    "role": "student",
    "email": "simmytex60@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "simonawol",
    "role": "student",
    "email": "simonawol@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "simphiwe.dlamini",
    "role": "student",
    "email": "simphiwe.dlamini@manzinicity.co.sz",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "simuka.ambience",
    "role": "student",
    "email": "simuka.ambience@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Sinalo Ntsinde",
    "role": "student",
    "email": "sinalontsinde00@gmail.com",
    "status": "suspended"
  },
  {
    "name": "sinovuyo tofile",
    "role": "student",
    "email": "sinovuyotofile19@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Sinovuyo",
    "role": "student",
    "email": "sinovuyotofile61@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Sinoxolo Yaphi",
    "role": "student",
    "email": "sinoxoloyaphi16@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Siphesihle Tofile",
    "role": "student",
    "email": "siphesihletofile@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Siphilangenkhosi Nxumalo",
    "role": "student",
    "email": "siphilangenkhosinxumalo@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "sirkelvindaniels",
    "role": "student",
    "email": "sirkelvindaniels@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Prince Ik. Samben Nwosu",
    "role": "student",
    "email": "sirsamben@gmail.com",
    "status": "suspended",
    "program": "Masters Degree in Public Leadership"
  },
  {
    "name": "Sive Thembinkosi Simelane",
    "role": "student",
    "email": "sive.simelane@gmail.com",
    "status": "suspended"
  },
  {
    "name": "sixberthkuzenza",
    "role": "student",
    "email": "sixberthkuzenza@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "siyandanxumalo",
    "role": "student",
    "email": "siyandanxumalo@gmail.com",
    "status": "suspended"
  },
  {
    "name": "sizzlingdeliteservices",
    "role": "student",
    "email": "sizzlingdeliteservices@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Susan Kaveza Tela",
    "role": "student",
    "email": "skaveza@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Carl Charles",
    "role": "student",
    "email": "sksikinya@gmail.com",
    "status": "suspended"
  },
  {
    "name": "skyruthmd",
    "role": "student",
    "email": "skyruthmd@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "slindasaffie",
    "role": "student",
    "email": "slindasaffie@gmail.com",
    "status": "suspended",
    "program": "Bs of Health science in Administration,minor in He college law"
  },
  {
    "name": "slytalk2mee",
    "role": "student",
    "email": "slytalk2mee@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "smart375048",
    "role": "student",
    "email": "smart375048@gmail.com",
    "status": "suspended"
  },
  {
    "name": "smart_b2007",
    "role": "student",
    "email": "smart_b2007@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "smatteam841",
    "role": "student",
    "email": "smatteam841@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Shirley Nyamori",
    "role": "student",
    "email": "sn.shirley.nyamori@gmail.com",
    "status": "suspended"
  },
  {
    "name": "snowhitelin4real",
    "role": "student",
    "email": "snowhitelin4real@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Oladeji Solomon",
    "role": "student",
    "email": "soladeji355@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Olusola Fatokun",
    "role": "student",
    "email": "solafat4@gmail.com",
    "status": "suspended"
  },
  {
    "name": "solidobaino",
    "role": "student",
    "email": "solidobaino@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "solomonjohnbwala90",
    "role": "student",
    "email": "solomonjohnbwala90@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Samuel Solomon",
    "role": "student",
    "email": "solomonsamuelobioma07@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Luyiga Solomy",
    "role": "student",
    "email": "solomyluyiga@gmail.com",
    "status": "suspended",
    "program": "Bachelor in public health"
  },
  {
    "name": "Solomon Oloyede",
    "role": "student",
    "email": "soloyede0001@gmail.com",
    "status": "suspended"
  },
  {
    "name": "somiaconcept",
    "role": "student",
    "email": "somiaconcept@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Daniel Songa",
    "role": "student",
    "email": "songa5572@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Sonia Egbe",
    "role": "student",
    "email": "soniegbe@gmail.com",
    "status": "suspended",
    "program": "Masters"
  },
  {
    "name": "sonnie.nkanu",
    "role": "student",
    "email": "sonnie.nkanu@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "sophieokinyi",
    "role": "student",
    "email": "sophieokinyi@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Joseph Sorie Kamara",
    "role": "student",
    "email": "soriekamarajoseph@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "sowino939",
    "role": "student",
    "email": "sowino939@gmail.com",
    "status": "suspended"
  },
  {
    "name": "soyebiafusat",
    "role": "student",
    "email": "soyebiafusat@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "John Alafiatayo",
    "role": "student",
    "email": "splashraycreations@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "splintdiva779",
    "role": "student",
    "email": "splintdiva779@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "squirececilia07",
    "role": "student",
    "email": "squirececilia07@gmail.com",
    "status": "suspended"
  },
  {
    "name": "squirececilia0",
    "role": "student",
    "email": "squirececilia0@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "squirececilia",
    "role": "student",
    "email": "squirececilia@gmail.com",
    "status": "suspended"
  },
  {
    "name": "SpazzoBinLaden",
    "role": "student",
    "email": "sreidtsutani@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ssande Willy",
    "role": "student",
    "email": "ssandewilly@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Ssekasamba Charles Stuart",
    "role": "student",
    "email": "ssekasamba44@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Ssengooba George",
    "role": "student",
    "email": "ssengooba.george@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "stanley oghagbon",
    "role": "student",
    "email": "stanleyoghagbon2@gmail.com",
    "status": "suspended"
  },
  {
    "name": "stellafunmilayou",
    "role": "student",
    "email": "stellafunmilayou@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "stephanyleen78",
    "role": "student",
    "email": "stephanyleen78@gmail.com",
    "status": "suspended"
  },
  {
    "name": "stephen .T AGBANYI",
    "role": "student",
    "email": "stephen.tagbanyi@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "stephenaudu18",
    "role": "student",
    "email": "stephenaudu18@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "stephenayobamimichael",
    "role": "student",
    "email": "stephenayobamimichael@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "stephen kums",
    "role": "student",
    "email": "stephenkums@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Stephen Oladipo",
    "role": "student",
    "email": "stephenoladipo1996@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "stephensamuelseun",
    "role": "student",
    "email": "stephensamuelseun@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "stephensark55",
    "role": "student",
    "email": "stephensark55@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Serunjogi Stephen",
    "role": "student",
    "email": "stephenserunjogi2020@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "stevemutai042",
    "role": "student",
    "email": "stevemutai042@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Sunday Adeoti",
    "role": "student",
    "email": "stevenadeoti7182@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "STEVE OTU",
    "role": "student",
    "email": "steveotu62@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "sthradebayo",
    "role": "student",
    "email": "sthradebayo@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "stofilesphelele",
    "role": "student",
    "email": "stofilesphelele@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Peter Okoh",
    "role": "student",
    "email": "stpeterdrockk@yahoo.com",
    "status": "suspended",
    "program": "MA. Strategic Leadership minor in Religion and Society"
  },
  {
    "name": "POL",
    "role": "student",
    "email": "streamquestinnovations@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Adeyemo success",
    "role": "student",
    "email": "successadeyemo240@gmail.com",
    "status": "suspended",
    "program": "Bachelors of Science in Cybersecurity"
  },
  {
    "name": "Donnah Joseph",
    "role": "student",
    "email": "successdonj8@gmail.com",
    "status": "active",
    "program": "Doctorate"
  },
  {
    "name": "Adeyemi Success olusola",
    "role": "student",
    "email": "successolusolaadeyemi@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "suleimanmahmood40",
    "role": "student",
    "email": "suleimanmahmood40@gmail.com",
    "status": "suspended"
  },
  {
    "name": "sultyibist",
    "role": "student",
    "email": "sultyibist@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "sundaydombo",
    "role": "student",
    "email": "sundaydombo@gmail.com",
    "status": "suspended",
    "program": "MASTERS. IN ORGANIZATIONAL LEADERSHIP. MINOR IN CHRISTIAN ETHICS"
  },
  {
    "name": "sundayyisa74",
    "role": "student",
    "email": "sundayyisa74@gmail.com",
    "status": "suspended"
  },
  {
    "name": "sunnybarms",
    "role": "student",
    "email": "sunnybarms@gmail.com",
    "status": "suspended",
    "program": "Project Management"
  },
  {
    "name": "Dr. Sunday Ubi",
    "role": "student",
    "email": "sunnyubi40@gmail.com",
    "status": "suspended"
  },
  {
    "name": "sunstoneschools",
    "role": "student",
    "email": "sunstoneschools@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "HBIU Admissions",
    "role": "student",
    "email": "support@hbiu.org",
    "status": "suspended"
  },
  {
    "name": "suremercies93",
    "role": "student",
    "email": "suremercies93@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "susanaoladipo",
    "role": "student",
    "email": "susanaoladipo@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Susan Michael",
    "role": "student",
    "email": "susymike11@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Students Volunteer Mission",
    "role": "student",
    "email": "svmnjalamokonde@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "sweetidy2003",
    "role": "student",
    "email": "sweetidy2003@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "sylvaephraim",
    "role": "student",
    "email": "sylvaephraim@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Sylvia Uko",
    "role": "student",
    "email": "sylviauko58@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Sylvia Uko",
    "role": "student",
    "email": "sylviauko73@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Science in Healthcare Administrationstration"
  },
  {
    "name": "tabithajoseph2",
    "role": "student",
    "email": "tabithajoseph2@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "taconglobalservices",
    "role": "student",
    "email": "taconglobalservices@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "taduramimo",
    "role": "student",
    "email": "taduramimo@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Tai Oyekan",
    "role": "student",
    "email": "taioyekan858@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Taiwo",
    "role": "student",
    "email": "taiwo.bhsproperties@gmail.com",
    "status": "suspended"
  },
  {
    "name": "taiwo abiodun",
    "role": "student",
    "email": "taiwoabiodun396@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "taiwoabiodunsolomon",
    "role": "student",
    "email": "taiwoabiodunsolomon@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Taiwo Ajao",
    "role": "student",
    "email": "taiwoajo218@gmail.com",
    "status": "suspended"
  },
  {
    "name": "taiwoakeju35",
    "role": "student",
    "email": "taiwoakeju35@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "talatumaiwada",
    "role": "student",
    "email": "talatumaiwada@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "talatumaiwada",
    "role": "student",
    "email": "talatumaiwada@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "Akinwale Oluwaseyi",
    "role": "student",
    "email": "talk2akinwale@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Cosmas Arunah",
    "role": "student",
    "email": "talk2cosmos@gmail.com",
    "status": "suspended"
  },
  {
    "name": "TAMBA AMOS MONDEH",
    "role": "student",
    "email": "tambaamosmondeh@gmail.com",
    "status": "suspended"
  },
  {
    "name": "tammybraide2",
    "role": "student",
    "email": "tammybraide2@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Deborah Tanimola",
    "role": "student",
    "email": "tanimoladeborah797@gmail.com",
    "status": "suspended"
  },
  {
    "name": "tankisokgosidintsi",
    "role": "student",
    "email": "tankisokgosidintsi@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "tansimba03",
    "role": "student",
    "email": "tansimba03@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Lone Penny Tanyala",
    "role": "student",
    "email": "tanyalalonepenny@gmail.com",
    "status": "suspended",
    "program": "BA in Psychology with (Addiction focus)Minor:Spiritual Care in Health"
  },
  {
    "name": "tapiwabigboy29",
    "role": "student",
    "email": "tapiwabigboy29@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Science in Rehabilitation Services (Addictions):Minor Interfaith Chaplaincy Studies"
  },
  {
    "name": "tarleysr",
    "role": "student",
    "email": "tarleysr@gmail.com",
    "status": "suspended",
    "program": "PhD in Divinity, Major in Clinical Mental health counseling"
  },
  {
    "name": "tataopash2026",
    "role": "student",
    "email": "tataopash2026@gmail.com",
    "status": "suspended"
  },
  {
    "name": "tatualiviza1",
    "role": "student",
    "email": "tatualiviza1@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "tayeezekiel",
    "role": "student",
    "email": "tayeezekiel@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Tapgol Ching-yin",
    "role": "student",
    "email": "tchingyin1@gmail.com",
    "status": "suspended"
  },
  {
    "name": "teamsynergy58",
    "role": "student",
    "email": "teamsynergy58@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ted5575",
    "role": "student",
    "email": "ted5575@gmail.com",
    "status": "suspended"
  },
  {
    "name": "teddica george",
    "role": "student",
    "email": "teddicageorge@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Teddicia Elizabeth George",
    "role": "student",
    "email": "teddiciaelizabethgeorge02@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "tejanadama19",
    "role": "student",
    "email": "tejanadama19@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "tembezukiso",
    "role": "student",
    "email": "tembezukiso@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Science in Human Rights, Peace and Conflict Studies with a Minor in Biblical Studies"
  },
  {
    "name": "temimacowell",
    "role": "student",
    "email": "temimacowell@yahoo.com",
    "status": "suspended",
    "program": "Master of Public Administration"
  },
  {
    "name": "Esther TeminiJesu Chima",
    "role": "student",
    "email": "teminijesuchimaesther@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "teminikan90",
    "role": "student",
    "email": "teminikan90@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Temiloluwa Michael",
    "role": "student",
    "email": "temmygift54@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Tengetile Nkambule",
    "role": "student",
    "email": "tengetilen43@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "David Terfa Ronald",
    "role": "student",
    "email": "terfaronalddavid@gmail.com",
    "status": "suspended",
    "program": "MSc organisational Leadership"
  },
  {
    "name": "Theresia M",
    "role": "student",
    "email": "terry.mweni@gmail.com",
    "status": "suspended",
    "program": "Bachelor of science in Counseling and Psychology"
  },
  {
    "name": "Terry onyedikachi",
    "role": "student",
    "email": "terryonyedikachi@gmail.com",
    "status": "suspended"
  },
  {
    "name": "tessejoshua2016",
    "role": "student",
    "email": "tessejoshua2016@gmail.com",
    "status": "suspended"
  },
  {
    "name": "OLUWALONIMI TESTIMONY",
    "role": "student",
    "email": "testioluwalonimi70@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Thankgod Abraham (Blessed)",
    "role": "student",
    "email": "tgodonline@gmail.com",
    "status": "suspended",
    "program": "MASTER"
  },
  {
    "name": "Khalifa Althani",
    "role": "student",
    "email": "thaanikhalifa@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "thabiteke",
    "role": "student",
    "email": "thabiteke@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "thatakebadire",
    "role": "student",
    "email": "thatakebadire@gmail.com",
    "status": "suspended"
  },
  {
    "name": "thedean.professorfullwood.hbius",
    "role": "student",
    "email": "thedean.professorfullwood.hbius@gmail.com",
    "status": "suspended"
  },
  {
    "name": "thelmaiyke33",
    "role": "student",
    "email": "thelmaiyke33@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Emmanuel David",
    "role": "student",
    "email": "themayorofbeehive@gmail.com",
    "status": "suspended"
  },
  {
    "name": "theodoraorukpe",
    "role": "student",
    "email": "theodoraorukpe@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Devon Williams",
    "role": "student",
    "email": "therealdevonwilliams94@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Nomcebo Bulunga",
    "role": "student",
    "email": "thikazi.cebo@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "thomasmongare30",
    "role": "student",
    "email": "thomasmongare30@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Ms Macwele",
    "role": "student",
    "email": "thulilemacwele2@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "Tiara Salmon",
    "role": "student",
    "email": "tiarafsalmon@gmail.com",
    "status": "suspended"
  },
  {
    "name": "tobi komolafe",
    "role": "student",
    "email": "tibex153@gmail.com",
    "status": "suspended"
  },
  {
    "name": "tijesunimiobaloluwa",
    "role": "student",
    "email": "tijesunimiobaloluwa@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Timileyin Blessing",
    "role": "student",
    "email": "timileyinblessing46@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "timkit0910",
    "role": "student",
    "email": "timkit0910@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "timolat0910",
    "role": "student",
    "email": "timolat0910@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "timothyblessingadama",
    "role": "student",
    "email": "timothyblessingadama@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "timzugwuofficial",
    "role": "student",
    "email": "timzugwuofficial@gmail.com",
    "status": "suspended"
  },
  {
    "name": "tinkaandrew",
    "role": "student",
    "email": "tinkaandrew@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "tinuola.tijani",
    "role": "student",
    "email": "tinuola.tijani@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "Tumi Tjabadi",
    "role": "student",
    "email": "tjabaditumi@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Tracyann Lewis-Martin",
    "role": "student",
    "email": "tlewismartin460@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Oluyinka Adefila",
    "role": "student",
    "email": "tlimsray@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Twinkle Kebapetse",
    "role": "student",
    "email": "tlkebapetse@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Timothy Mbue",
    "role": "student",
    "email": "tmbue1@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "tnui3000",
    "role": "student",
    "email": "tnui3000@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "adubi toba",
    "role": "student",
    "email": "tobafunbi@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Tofunmi Yoloye",
    "role": "student",
    "email": "tofyol3@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Tolani Ayomikun",
    "role": "student",
    "email": "tolaniayomikun@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Oyetola Ariyo",
    "role": "student",
    "email": "tolariyo2001@gmail.com",
    "status": "suspended",
    "program": "Master of Science in Organizational Leadership, Minor in Nonprofit Administration"
  },
  {
    "name": "Tolex Gabriel",
    "role": "student",
    "email": "tolexanvier@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Tolulope",
    "role": "student",
    "email": "tolulopeokebule@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "toluwaniobenbe",
    "role": "student",
    "email": "toluwaniobenbe@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "toluwashe julius",
    "role": "student",
    "email": "toluwashejulius@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Abigael Tome",
    "role": "student",
    "email": "tomeseleyian@gmail.com",
    "status": "active"
  },
  {
    "name": "Tony-Mario Joseph",
    "role": "student",
    "email": "tonymarioj@gmail.com",
    "status": "suspended",
    "program": "Masters"
  },
  {
    "name": "topssy282003",
    "role": "student",
    "email": "topssy282003@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "Tornam Anku",
    "role": "student",
    "email": "tornamanku@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Akanle Tosin",
    "role": "student",
    "email": "tosecog@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "tosin.ola10",
    "role": "student",
    "email": "tosin.ola10@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Tosin Adedayo",
    "role": "student",
    "email": "tosinadedayo27@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "tosin ayeni",
    "role": "student",
    "email": "tosinayeni4u@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "toun ajayi",
    "role": "student",
    "email": "tounajayi10@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "toun ajayi",
    "role": "student",
    "email": "tounajayi9@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "TOUN AKPAIDA",
    "role": "student",
    "email": "tounakpaida@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "toyinbamidele6",
    "role": "student",
    "email": "toyinbamidele6@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Nimat Labaika",
    "role": "student",
    "email": "toyinlabai@gmail.com",
    "status": "suspended"
  },
  {
    "name": "tracyadesuwapeter1",
    "role": "student",
    "email": "tracyadesuwapeter1@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Lady Apostle Imaobong Etefia",
    "role": "student",
    "email": "transformation5858@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "travornsubuga67",
    "role": "student",
    "email": "travornsubuga67@gmail.com",
    "status": "suspended"
  },
  {
    "name": "treasure4femy",
    "role": "student",
    "email": "treasure4femy@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Mirembe Treasure",
    "role": "student",
    "email": "treasuremirembe79@gmail.com",
    "status": "suspended",
    "program": "Bachelor's in marketing and advertising media BFI"
  },
  {
    "name": "Isaac Charles",
    "role": "student",
    "email": "trikings.tk@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "triplestarprojects",
    "role": "student",
    "email": "triplestarprojects@gmail.com",
    "status": "suspended",
    "program": "Master of Strategic Leadership, Minor in Christian Leadership and Ethics"
  },
  {
    "name": "John Tsado",
    "role": "student",
    "email": "tsadojohn8@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Tsaone Lobopo Mabego",
    "role": "student",
    "email": "tsaonelobopomabego@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Mavis Sefufula",
    "role": "student",
    "email": "tsefufula255@gmail.com",
    "status": "suspended",
    "program": "PhD"
  },
  {
    "name": "Tsido Khumalo",
    "role": "student",
    "email": "tsidokhumalo@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ttadeyemi",
    "role": "student",
    "email": "ttadeyemi@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ttventureso",
    "role": "student",
    "email": "ttventureso@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Emmanuel Tuayemie",
    "role": "student",
    "email": "tuayemieemmanuel1990@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Margret Tucker",
    "role": "student",
    "email": "tuckermargret9@gmail.com",
    "status": "suspended"
  },
  {
    "name": "tuhaise anita",
    "role": "student",
    "email": "tuhaise1991@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Stephen Tumusiime",
    "role": "student",
    "email": "tumusiimestephen1982@gmail.com",
    "status": "suspended",
    "program": "Master of science in Christian counseling and psychology"
  },
  {
    "name": "TWIMUKYE JONAHAN",
    "role": "student",
    "email": "twimukyehan22@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Tyav terryblack",
    "role": "student",
    "email": "tyavterryblack@gmail.com",
    "status": "suspended",
    "program": "Master of Agribusiness, minor in Non-Profit Sustainability and community Development"
  },
  {
    "name": "Thobile Christie",
    "role": "student",
    "email": "tzchristie14@gmail.com",
    "status": "suspended"
  },
  {
    "name": "lydia anyang",
    "role": "student",
    "email": "ubakumanyang@gmail.com",
    "status": "suspended"
  },
  {
    "name": "ubogunbeatrice",
    "role": "student",
    "email": "ubogunbeatrice@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Ubokikwan Obudu",
    "role": "student",
    "email": "ubokikwanobudu@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Ubong Sunday",
    "role": "student",
    "email": "ubong4033@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ubong Iton",
    "role": "student",
    "email": "ubongiton9@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ubongusoro7",
    "role": "student",
    "email": "ubongusoro7@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Uchenna Nwadinobi",
    "role": "student",
    "email": "uchennanwadinobi3@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Uche Tony",
    "role": "student",
    "email": "uchitony@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Udara Digital Computer",
    "role": "student",
    "email": "udaradigitalcomputer@gmail.com",
    "status": "suspended"
  },
  {
    "name": "udemeijeh",
    "role": "student",
    "email": "udemeijeh@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "udofotgrace2",
    "role": "student",
    "email": "udofotgrace2@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Glory Udoka",
    "role": "student",
    "email": "udokaglory21@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "uduakobonglivingancestor",
    "role": "student",
    "email": "uduakobonglivingancestor@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "udumastephen19",
    "role": "student",
    "email": "udumastephen19@gmail.com",
    "status": "suspended"
  },
  {
    "name": "HBIU UG",
    "role": "student",
    "email": "uganda.hbiu@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ugbe Awhobiwom",
    "role": "student",
    "email": "ugbeawhobiwom@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Arts in Marketing And Advertising"
  },
  {
    "name": "Ugbedeojo Akpa",
    "role": "student",
    "email": "ugbedeojoakpa05@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ugbemichaelakpanke",
    "role": "student",
    "email": "ugbemichaelakpanke@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ugoaimufua",
    "role": "student",
    "email": "ugoaimufua@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Anyanwu Ugochi",
    "role": "student",
    "email": "ugochia59@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "ugonnachukwu001",
    "role": "student",
    "email": "ugonnachukwu001@gmail.com",
    "status": "suspended",
    "program": "Bachelor In IT Support and Data Analytics"
  },
  {
    "name": "uharuna700",
    "role": "student",
    "email": "uharuna700@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Unathi Hoyana",
    "role": "student",
    "email": "uhoyana@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "uju okeke",
    "role": "student",
    "email": "ujufranky@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "ukemevsn2010",
    "role": "student",
    "email": "ukemevsn2010@yahoo.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Ukpong Bassey",
    "role": "student",
    "email": "ukpong40@gmail.com",
    "status": "suspended",
    "program": "Doctorate"
  },
  {
    "name": "Uloma Anndotan",
    "role": "student",
    "email": "uloanndo@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Uma Orji",
    "role": "student",
    "email": "umaorji4@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Sunnah Hausa TV",
    "role": "student",
    "email": "umarhadejia01@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Festus Umaru",
    "role": "student",
    "email": "umarufesto@gmail.com",
    "status": "suspended",
    "program": "Master of Science in Organizational Leadership, Minor in Nonprofit Administration"
  },
  {
    "name": "umeadiakanaziam",
    "role": "student",
    "email": "umeadiakanaziam@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "silverlyn chibuzo",
    "role": "student",
    "email": "umehsilver05@gmail.com",
    "status": "suspended"
  },
  {
    "name": "umorualiceidoko",
    "role": "student",
    "email": "umorualiceidoko@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "NarTarsha Robinson",
    "role": "student",
    "email": "uneaknasz1931@gmail.com",
    "status": "suspended",
    "program": "Certificate"
  },
  {
    "name": "unogwuanthonia",
    "role": "student",
    "email": "unogwuanthonia@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "unyimepeter16",
    "role": "student",
    "email": "unyimepeter16@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "upstairsoutlet",
    "role": "student",
    "email": "upstairsoutlet@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "usmanlaoye1999",
    "role": "student",
    "email": "usmanlaoye1999@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Ekpedeme Usoro",
    "role": "student",
    "email": "usoroekpedeme16@gmail.com",
    "status": "suspended"
  },
  {
    "name": "uswezy",
    "role": "student",
    "email": "uswezy@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Uthman Suboor",
    "role": "student",
    "email": "uthmansuboor@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "uwahcoach",
    "role": "student",
    "email": "uwahcoach@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Uwayo Honore",
    "role": "student",
    "email": "uwayohonore@gmail.com",
    "status": "suspended"
  },
  {
    "name": "uwemeffiom",
    "role": "student",
    "email": "uwemeffiom@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Uwem Nyong",
    "role": "student",
    "email": "uwemsylvanusnyong@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "uwodi91",
    "role": "student",
    "email": "uwodi91@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "uzifana2403",
    "role": "student",
    "email": "uzifana2403@gmail.com",
    "status": "suspended"
  },
  {
    "name": "uzy Bassey",
    "role": "student",
    "email": "uzybassey@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "valentined53",
    "role": "student",
    "email": "valentined53@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "valentineisiebue",
    "role": "student",
    "email": "valentineisiebue@gmail.com",
    "status": "suspended"
  },
  {
    "name": "vandisenesie43",
    "role": "student",
    "email": "vandisenesie43@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "veenylimited",
    "role": "student",
    "email": "veenylimited@gmail.com",
    "status": "suspended"
  },
  {
    "name": "susana velia",
    "role": "student",
    "email": "veliasusana@gmail.com",
    "status": "suspended",
    "program": "Associate/BA IN BUSINESS MANAGEMENT"
  },
  {
    "name": "veline26",
    "role": "student",
    "email": "veline26@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "Velly Charry",
    "role": "student",
    "email": "vellycharry28@gmail.com",
    "status": "suspended",
    "program": "Bachelor Of Psychology, Psychotherapy Minor in Chaplaincy"
  },
  {
    "name": "Venomski",
    "role": "student",
    "email": "velshikd@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Venchris Chidozie",
    "role": "student",
    "email": "ventuga2000@gmail.com",
    "status": "suspended"
  },
  {
    "name": "veyo2010",
    "role": "student",
    "email": "veyo2010@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Osagbami victor",
    "role": "student",
    "email": "vickiemontana1@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "victoria samson",
    "role": "student",
    "email": "vicksammark@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Vicky Kalungi",
    "role": "student",
    "email": "vickykalungi1@gmail.com",
    "status": "suspended"
  },
  {
    "name": "vicoop2009",
    "role": "student",
    "email": "vicoop2009@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "victob2020",
    "role": "student",
    "email": "victob2020@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "victorasama9",
    "role": "student",
    "email": "victorasama9@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "victoriaacerta24",
    "role": "student",
    "email": "victoriaacerta24@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Victoria Adekunle",
    "role": "student",
    "email": "victoriaobioma07@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Omotosho Victoria",
    "role": "student",
    "email": "victoriaomotosho493@gmail.com",
    "status": "suspended"
  },
  {
    "name": "victoriousemma20",
    "role": "student",
    "email": "victoriousemma20@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Victor olarinoye",
    "role": "student",
    "email": "victorolarinoye24@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "vikelove2010",
    "role": "student",
    "email": "vikelove2010@gmail.com",
    "status": "suspended"
  },
  {
    "name": "VINIRU LUKA",
    "role": "student",
    "email": "vininysc2016@gmail.com",
    "status": "suspended",
    "program": "Master of Science in Organizational Leadership, Minor in Nonprofit Administration"
  },
  {
    "name": "Ibukun Olalere",
    "role": "student",
    "email": "vinvero55@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "violettso08",
    "role": "student",
    "email": "violettso08@gmail.com",
    "status": "suspended",
    "program": "BACHELOR IN THEOLOGY AND ETHICS (MINOR IN FAITH-BASED-LEADERSHIP)"
  },
  {
    "name": "vision.willprosper",
    "role": "student",
    "email": "vision.willprosper@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "visitpiustoday",
    "role": "student",
    "email": "visitpiustoday@gmail.com",
    "status": "suspended"
  },
  {
    "name": "vkoech089",
    "role": "student",
    "email": "vkoech089@gmail.com",
    "status": "suspended"
  },
  {
    "name": "vnwaigwe",
    "role": "student",
    "email": "vnwaigwe@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Isaac Vonjo",
    "role": "student",
    "email": "vonjoisaac@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "vonkurjennifer",
    "role": "student",
    "email": "vonkurjennifer@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "vsucem",
    "role": "student",
    "email": "vsucem@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "vuctoriaedetini",
    "role": "student",
    "email": "vuctoriaedetini@gmail.com",
    "status": "suspended"
  },
  {
    "name": "vuyokazi njokwana",
    "role": "student",
    "email": "vuyo83.njokwana@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "vyksort",
    "role": "student",
    "email": "vyksort@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Vincent Wagama",
    "role": "student",
    "email": "wagama8118@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Wahab Fatimah",
    "role": "student",
    "email": "wahabfatimah5@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Favour Florence",
    "role": "student",
    "email": "wairimukamau.wk@gmail.com",
    "status": "suspended"
  },
  {
    "name": "wakabisamuel472",
    "role": "student",
    "email": "wakabisamuel472@gmail.com",
    "status": "suspended",
    "program": "Bachelor of science in public health"
  },
  {
    "name": "wakawaalijohn",
    "role": "student",
    "email": "wakawaalijohn@gmail.com",
    "status": "suspended"
  },
  {
    "name": "wakhiledlamini",
    "role": "student",
    "email": "wakhiledlamini@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Adewale Adesanya",
    "role": "student",
    "email": "walexiusdavid2017@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "walterela",
    "role": "student",
    "email": "walterela@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Walter Miheso",
    "role": "student",
    "email": "waltermiheso7@gmail.com",
    "status": "suspended",
    "program": "College of health science"
  },
  {
    "name": "waltermiheso8",
    "role": "student",
    "email": "waltermiheso8@gmail.com",
    "status": "suspended"
  },
  {
    "name": "waltersjanet58",
    "role": "student",
    "email": "waltersjanet58@gmail.com",
    "status": "suspended"
  },
  {
    "name": "waltersjephthah35",
    "role": "student",
    "email": "waltersjephthah35@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Jephthah Walters",
    "role": "student",
    "email": "waltersjephthah60@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "wamala joseph",
    "role": "student",
    "email": "wamala.josejunior2@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Arts in Theology"
  },
  {
    "name": "abigail wambua",
    "role": "student",
    "email": "wambuaabigail@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Benjamin Wambua",
    "role": "student",
    "email": "wambuaben2019@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "kenedy wambua",
    "role": "student",
    "email": "wambuakenedy45@gmail.com",
    "status": "suspended"
  },
  {
    "name": "wanjirurita819",
    "role": "student",
    "email": "wanjirurita819@gmail.com",
    "status": "suspended"
  },
  {
    "name": "wanyana457",
    "role": "student",
    "email": "wanyana457@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "wasongere",
    "role": "student",
    "email": "wasongere@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "waxbell",
    "role": "student",
    "email": "waxbell@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "wbtsrita",
    "role": "student",
    "email": "wbtsrita@gmail.com",
    "status": "suspended"
  },
  {
    "name": "David Odunayo Williams",
    "role": "student",
    "email": "wdavidodunayo@gmail.com",
    "status": "suspended"
  },
  {
    "name": "WEKOYELA BENON",
    "role": "student",
    "email": "wekoyerab4@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Business management"
  },
  {
    "name": "Wesley Byegon",
    "role": "student",
    "email": "wesoye@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "WINNIE AMUSUGUT",
    "role": "student",
    "email": "wiinnieamusugut96@gmail.com",
    "status": "suspended"
  },
  {
    "name": "wilkoech",
    "role": "student",
    "email": "wilkoech@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Rebecca William",
    "role": "student",
    "email": "williambecca23@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "William Francis Sawyer",
    "role": "student",
    "email": "williamfrancissawyer014@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "williams_sojumi",
    "role": "student",
    "email": "williams_sojumi@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "Williams Heritage",
    "role": "student",
    "email": "williamsheritage71@gmail.com",
    "status": "suspended",
    "program": "Bachelor of Law and Digital Technologies ,minor in faith based org.law"
  },
  {
    "name": "williamsjosephb785",
    "role": "student",
    "email": "williamsjosephb785@gmail.com",
    "status": "suspended",
    "program": "Bachelor of science in IT support"
  },
  {
    "name": "willisandassociates10",
    "role": "student",
    "email": "willisandassociates10@gmail.com",
    "status": "suspended"
  },
  {
    "name": "willisandrew",
    "role": "student",
    "email": "willisandrew@yahoo.com",
    "status": "suspended"
  },
  {
    "name": "Winifred Ameh",
    "role": "student",
    "email": "winifredamina@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "winnievincent42",
    "role": "student",
    "email": "winnievincent42@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Winnie Wamboi",
    "role": "student",
    "email": "winniewamboi565@gmail.com",
    "status": "suspended"
  },
  {
    "name": "winstoncupido",
    "role": "student",
    "email": "winstoncupido@hotmail.com",
    "status": "suspended"
  },
  {
    "name": "Wisdom Ohis",
    "role": "student",
    "email": "wisdomohis25@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "WISEMAN MBUYISELWA DLAMINI",
    "role": "student",
    "email": "wisemanmdlamini@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Wokorach Peter Paul",
    "role": "student",
    "email": "wokorachpeterpaul6@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Wolija Joanne Katabulawo",
    "role": "student",
    "email": "wolijajo@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "wonderboy9091",
    "role": "student",
    "email": "wonderboy9091@gmail.com",
    "status": "suspended"
  },
  {
    "name": "William Serem",
    "role": "student",
    "email": "wserem72@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "MABE WUNKUMI GEORGINA",
    "role": "student",
    "email": "wunkumigeorgina@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "wuyahmakei111",
    "role": "student",
    "email": "wuyahmakei111@gmail.com",
    "status": "suspended",
    "program": "Bachelor of science in healthcare administration minor in health ministry"
  },
  {
    "name": "Magdalene Mary",
    "role": "student",
    "email": "www.magdalenemary720@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "wwwjamesadavizegodwin",
    "role": "student",
    "email": "wwwjamesadavizegodwin@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Wycliff Angaticha Adino",
    "role": "student",
    "email": "wycliffangati@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Chuma ifeamah",
    "role": "student",
    "email": "xmg.trade25@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Kopano Mosiane",
    "role": "student",
    "email": "xmosiane@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Xolani Msimango",
    "role": "student",
    "email": "xolanimsimang7@gmail.com",
    "status": "suspended"
  },
  {
    "name": "sekinat Yahya",
    "role": "student",
    "email": "yahyasekinat1@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "yakubugabriel47",
    "role": "student",
    "email": "yakubugabriel47@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Mariama Sambou",
    "role": "student",
    "email": "yamahsambou22@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Yanike Greenfield",
    "role": "student",
    "email": "yanike2greenfield1992@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "yapemungusamwel",
    "role": "student",
    "email": "yapemungusamwel@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "yaseen91550",
    "role": "student",
    "email": "yaseen91550@gmail.com",
    "status": "suspended"
  },
  {
    "name": "yemaronet",
    "role": "student",
    "email": "yemaronet@gmail.com",
    "status": "suspended"
  },
  {
    "name": "yemi akintokun",
    "role": "student",
    "email": "yemiakintokun@gmail.com",
    "status": "suspended",
    "program": "Master Strategic Leadership, minor in Christian Leadership and Ethics"
  },
  {
    "name": "yemiolowo2017",
    "role": "student",
    "email": "yemiolowo2017@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "yemisiayobami1966",
    "role": "student",
    "email": "yemisiayobami1966@gmail.com",
    "status": "suspended"
  },
  {
    "name": "yettysixteen",
    "role": "student",
    "email": "yettysixteen@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Yetunde Agboola",
    "role": "student",
    "email": "yetundeagboola05@gmail.com",
    "status": "suspended"
  },
  {
    "name": "yinmaime",
    "role": "student",
    "email": "yinmaime@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "yomimic2003",
    "role": "student",
    "email": "yomimic2003@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Yusuf Kavuma Musa",
    "role": "student",
    "email": "youmkav@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "youngjohn5198",
    "role": "student",
    "email": "youngjohn5198@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "youngtomshallgrow",
    "role": "student",
    "email": "youngtomshallgrow@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Eunice Ikape",
    "role": "student",
    "email": "yunice1616@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "Yunusa Jumai Karimatu",
    "role": "student",
    "email": "yunusajumaikarimatu@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "yunusa karimat",
    "role": "student",
    "email": "yunusakarimat@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "YINUSA ISHOLA",
    "role": "student",
    "email": "yunusng2016@gmail.com",
    "status": "suspended"
  },
  {
    "name": "yusbash2008",
    "role": "student",
    "email": "yusbash2008@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Justus Sila Mutava",
    "role": "student",
    "email": "yustosila@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Yusuf Oludayo Suliat",
    "role": "student",
    "email": "yusufoludayo@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "zainabgrahamemanovwe",
    "role": "student",
    "email": "zainabgrahamemanovwe@gmail.com",
    "status": "suspended",
    "program": "MA in Clinical Mental Health Counseling (Addictions Track) Minor: Faith-Based Trauma-Informed Care"
  },
  {
    "name": "Zamazulu Mqikela",
    "role": "student",
    "email": "zamazulumqikela29@gmail.com",
    "status": "suspended"
  },
  {
    "name": "kyle reviews",
    "role": "student",
    "email": "zapperev@gmail.com",
    "status": "suspended"
  },
  {
    "name": "zenande peterr",
    "role": "student",
    "email": "zenandepeter05@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Abdul Zhikpe",
    "role": "student",
    "email": "zhikpe.com@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Abdulkadir suleiman",
    "role": "student",
    "email": "zhikpeboy@gmail.com",
    "status": "suspended",
    "program": "Master"
  },
  {
    "name": "Anyim Kelly James",
    "role": "student",
    "email": "zionitekc@gmail.com",
    "status": "suspended"
  },
  {
    "name": "Zainab Mansaray",
    "role": "student",
    "email": "zmansaray990@gmail.com",
    "status": "suspended",
    "program": "Bachelor"
  },
  {
    "name": "zoedike18",
    "role": "student",
    "email": "zoedike18@gmail.com",
    "status": "suspended"
  },
  {
    "name": "zwelinzimambhele",
    "role": "student",
    "email": "zwelinzimambhele@gmail.com",
    "status": "active",
    "program": "Bachelor - Suspended - Back "
  }
];

async function importAllUsers() {
  try {
    console.log('Starting import of all 3,245 users...');
    console.log('='.repeat(60));
    
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    // Sync model
    await User.sync();
    
    // Hash password once
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    let imported = 0;
    let skipped = 0;
    let errors = 0;
    
    // Start transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Import lecturers
      console.log(`\nImporting ${LECTURERS_DATA.length} lecturers...`);
      
      for (const lecturer of LECTURERS_DATA) {
        try {
          // Check if user exists
          const existing = await User.findOne({ 
            where: { email: lecturer.email },
            transaction 
          });
          
          if (existing) {
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
            status: lecturer.status === 'suspended' ? 'suspended' : 'active',
            emailVerified: false
          }, { transaction });
          
          imported++;
          
          if (imported % 50 === 0) {
            console.log(`  ✓ Imported ${imported} users so far...`);
          }
        } catch (error) {
          errors++;
          console.error(`  ✗ Error importing ${lecturer.email}: ${error.message}`);
        }
      }
      
      console.log(`\nImporting ${STUDENTS_DATA.length} students...`);
      
      for (const student of STUDENTS_DATA) {
        try {
          // Check if user exists
          const existing = await User.findOne({ 
            where: { email: student.email },
            transaction 
          });
          
          if (existing) {
            skipped++;
            continue;
          }
          
          // Generate student ID
          const emailPrefix = student.email.split('@')[0].substring(0, 8).toUpperCase();
          const timestamp = Date.now().toString().slice(-6);
          const studentId = `STU-${emailPrefix}-${timestamp}`;
          
          const { firstName, lastName } = parseName(student.name);
          
          await User.create({
            firstName,
            lastName,
            email: student.email,
            password: hashedPassword,
            role: 'student',
            studentId: studentId,
            status: student.status === 'suspended' ? 'suspended' : 'active',
            emailVerified: false
          }, { transaction });
          
          imported++;
          
          if (imported % 50 === 0) {
            console.log(`  ✓ Imported ${imported} users so far...`);
          }
        } catch (error) {
          errors++;
          console.error(`  ✗ Error importing ${student.email}: ${error.message}`);
        }
      }
      
      // Commit transaction
      await transaction.commit();
      
      console.log('\n' + '='.repeat(60));
      console.log('IMPORT COMPLETE');
      console.log('='.repeat(60));
      console.log(`Successfully imported: ${imported} users`);
      console.log(`Skipped (duplicates): ${skipped} users`);
      console.log(`Errors: ${errors} users`);
      console.log(`Total processed: ${imported + skipped + errors} users`);
      console.log('\nAll users have password: password123');
      console.log('='.repeat(60));
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
    
  } catch (error) {
    console.error('Fatal error during import:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run import
importAllUsers();
