const { sequelize } = require('./config/database');
const { Course, College, User } = require('./models');

// Parse the courses from the user's list
const coursesToAdd = [
  { code: 'ACC 210', title: 'Financial Accounting', credits: 3, degreeProgram: 'Bachelor of Science in Global Trade & Economics with a Minor in Interfaith Studies' },
  { code: 'ACC 210-2', title: 'Financial Accounting', credits: 3, degreeProgram: 'Bachelor of Arts in Global Tourism & International Hospitality with a Minor in Comparative Scripture Studies' },
  { code: 'ANT 201', title: 'Introduction to Cultural Anthropology', credits: 3, degreeProgram: 'Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions' },
  { code: 'ANT 210', title: 'Anthropological Theory', credits: 3, degreeProgram: 'Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions' },
  { code: 'ANT 220', title: 'Peoples & Cultures of the World', credits: 3, degreeProgram: 'Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions' },
  { code: 'ANT 230', title: 'Globalization & Culture', credits: 3, degreeProgram: 'Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions' },
  { code: 'ANT 240', title: 'Ethnographic Methods', credits: 3, degreeProgram: 'Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions' },
  { code: 'ANT 250', title: 'Language, Culture & Identity', credits: 3, degreeProgram: 'Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions' },
  { code: 'ANT 310', title: 'Political Anthropology', credits: 3, degreeProgram: 'Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions' },
  { code: 'ANT 320', title: 'Economic Anthropology', credits: 3, degreeProgram: 'Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions' },
  { code: 'ANT 330', title: 'Medical Anthropology', credits: 3, degreeProgram: 'Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions' },
  { code: 'ANT 340', title: 'Religion & Ritual', credits: 3, degreeProgram: 'Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions' },
  { code: 'ANT 351', title: 'Migration & Diaspora Studies', credits: 3, degreeProgram: 'Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions' },
  { code: 'ANT 352', title: 'Africa: Society & Change', credits: 3, degreeProgram: 'Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions' },
  { code: 'ANT 353', title: 'Indigenous Peoples & Rights', credits: 3, degreeProgram: 'Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions' },
  { code: 'ANT 354', title: 'Anthropology of Development', credits: 3, degreeProgram: 'Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions' },
  { code: 'ANT 355', title: 'Gender & Culture', credits: 3, degreeProgram: 'Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions' },
  { code: 'ANT 356', title: 'Race & Ethnicity', credits: 3, degreeProgram: 'Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions' },
  { code: 'ANT 357', title: 'Urban Anthropology', credits: 3, degreeProgram: 'Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions' },
  { code: 'ANT 358', title: 'Environmental Anthropology', credits: 3, degreeProgram: 'Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions' },
  { code: 'ANT 359', title: 'Culture & Conflict', credits: 3, degreeProgram: 'Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions' },
  { code: 'ANT 360', title: 'Visual Anthropology', credits: 3, degreeProgram: 'Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions' },
  { code: 'ANT 410', title: 'Advanced Research Methods (Anthropology)', credits: 3, degreeProgram: 'Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions' },
  { code: 'ANT 499', title: 'Capstone: Ethnography Project', credits: 3, degreeProgram: 'Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions' },
  { code: 'ART 200', title: 'Visual Design Fundamentals', credits: 3, degreeProgram: 'Bachelor of Arts in Global Communication & Media with a Minor in Interfaith Studies' },
  { code: 'ATR 101', title: 'African Spiritual Traditions', credits: 3, degreeProgram: 'Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions' },
  { code: 'ATR 210', title: 'Ritual, Symbol & Community', credits: 3, degreeProgram: 'Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions' },
  { code: 'ATR 220', title: 'Oral Traditions & Sacred Narratives', credits: 3, degreeProgram: 'Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions' },
  { code: 'ATR 310', title: 'African Ethics & Worldview', credits: 3, degreeProgram: 'Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions' },
  { code: 'ATR 410', title: 'Religion, Identity & Social Change in Africa', credits: 3, degreeProgram: 'Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions' },
  { code: 'BIB 101', title: 'Old Testament Survey', credits: 3, degreeProgram: 'Bachelor of Science in Human Rights, Peace & Conflict Studies with a Minor in Biblical Studies' },
  { code: 'BIB 102', title: 'New Testament Survey', credits: 3, degreeProgram: 'Bachelor of Science in Human Rights, Peace & Conflict Studies with a Minor in Biblical Studies' },
  { code: 'BIB 210', title: 'Biblical Ethics & Justice', credits: 3, degreeProgram: 'Bachelor of Science in Human Rights, Peace & Conflict Studies with a Minor in Biblical Studies' },
  { code: 'BIB 310', title: 'Prophets, Mercy & Social Responsibility', credits: 3, degreeProgram: 'Bachelor of Science in Human Rights, Peace & Conflict Studies with a Minor in Biblical Studies' },
  { code: 'BIB 410', title: 'Applied Biblical Theology for Peacebuilding', credits: 3, degreeProgram: 'Bachelor of Science in Human Rights, Peace & Conflict Studies with a Minor in Biblical Studies' },
  { code: 'BIO 210', title: 'Human Biology', credits: 3, degreeProgram: 'Bachelor of Science in Global Health & Humanitarian Studies with a Minor in World Religions' },
  { code: 'BIO 220', title: 'Ecology Lab Concepts', credits: 3, degreeProgram: 'Bachelor of Science in International Environmental Sustainability with a Minor in Indigenous Spiritual Traditions' },
  { code: 'BUS 210', title: 'Principles of Management', credits: 3, degreeProgram: 'Bachelor of Arts in Global Tourism & International Hospitality with a Minor in Comparative Scripture Studies' },
  { code: 'CHE 110', title: 'General Chemistry (for Health)', credits: 3, degreeProgram: 'Bachelor of Science in Global Health & Humanitarian Studies with a Minor in World Religions' },
  { code: 'CHE 120', title: 'Chemistry for Environmental Science', credits: 3, degreeProgram: 'Bachelor of Science in International Environmental Sustainability with a Minor in Indigenous Spiritual Traditions' },
  { code: 'CLE 220', title: 'Christian Law & Ethics', credits: 3, degreeProgram: 'Bachelor of Science in Global Trade & Economics with a Minor in Interfaith Studies' },
  { code: 'COM 230', title: 'Intercultural Communication', credits: 3, degreeProgram: 'Bachelor of Arts in International Development & Policy with a Minor in Interfaith Studies' },
  { code: 'COM 230-2', title: 'Intercultural Communication', credits: 3, degreeProgram: 'Bachelor of Arts in International Relations & Diplomacy with a Minor in Christian Theology' },
  { code: 'COM 260', title: 'Intercultural Communication', credits: 3, degreeProgram: 'Bachelor of Science in Human Rights, Peace & Conflict Studies with a Minor in Biblical Studies' },
  { code: 'COM 260-2', title: 'Intercultural Communication', credits: 3, degreeProgram: 'Bachelor of Arts in Global Communication & Media with a Minor in Interfaith Studies' },
  { code: 'COM 260-3', title: 'Intercultural Communication', credits: 3, degreeProgram: 'Bachelor of Science in Global Health & Humanitarian Studies with a Minor in World Religions' },
  { code: 'COM 260-4', title: 'Intercultural Communication', credits: 3, degreeProgram: 'Bachelor of Arts in Cultural Anthropology & Global Studies with a Minor in African Traditional Religions' },
  { code: 'COM 260-5', title: 'Intercultural Communication', credits: 3, degreeProgram: 'Bachelor of Arts in Global Tourism & International Hospitality with a Minor in Comparative Scripture Studies' },
  { code: 'CSS 101', title: 'Sacred Texts of the World', credits: 3, degreeProgram: 'Bachelor of Arts in Global Tourism & International Hospitality with a Minor in Comparative Scripture Studies' },
  { code: 'CSS 210', title: 'Comparative Scripture Interpretation', credits: 3, degreeProgram: 'Bachelor of Arts in Global Tourism & International Hospitality with a Minor in Comparative Scripture Studies' },
  { code: 'CSS 220', title: 'Scripture, Ethics & Society', credits: 3, degreeProgram: 'Bachelor of Arts in Global Tourism & International Hospitality with a Minor in Comparative Scripture Studies' },
  { code: 'CSS 310', title: 'Religion & Culture in Global Context', credits: 3, degreeProgram: 'Bachelor of Arts in Global Tourism & International Hospitality with a Minor in Comparative Scripture Studies' },
  { code: 'CSS 410', title: 'Advanced Comparative Scripture Studies', credits: 3, degreeProgram: 'Bachelor of Arts in Global Tourism & International Hospitality with a Minor in Comparative Scripture Studies' },
  { code: 'ECH 310', title: 'Early Civilization & History', credits: 3, degreeProgram: 'Bachelor of Science in Global Trade & Economics with a Minor in Interfaith Studies' },
  { code: 'ECO 201', title: 'Microeconomics', credits: 3, degreeProgram: 'Bachelor of Arts in International Relations & Diplomacy with a Minor in Christian Theology' },
  { code: 'ECO 201-2', title: 'Microeconomics', credits: 3, degreeProgram: 'Bachelor of Science in Human Rights, Peace & Conflict Studies with a Minor in Biblical Studies' },
  { code: 'ECO 201-3', title: 'Microeconomics', credits: 3, degreeProgram: 'Bachelor of Arts in International Development & Policy with a Minor in Interfaith Studies' },
  { code: 'ECO 202', title: 'Macroeconomics', credits: 3, degreeProgram: 'Bachelor of Arts in International Relations & Diplomacy with a Minor in Christian Theology' },
  { code: 'ECO 202-2', title: 'Macroeconomics', credits: 3, degreeProgram: 'Bachelor of Arts in International Development & Policy with a Minor in Interfaith Studies' },
  { code: 'ECO 230', title: 'Environmental Economics (Applied)', credits: 3, degreeProgram: 'Bachelor of Science in International Environmental Sustainability with a Minor in Indigenous Spiritual Traditions' }
];

async function addInternationalCourses() {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Find or create College of International Studies
    let college = await College.findOne({
      where: { name: 'College of International Studies' }
    });

    if (!college) {
      console.log('⚠️  College of International Studies not found. Creating it...');
      college = await College.create({
        name: 'College of International Studies',
        code: 'CIS',
        description: 'The College of International Studies offers programs focused on global perspectives, cultural understanding, and international cooperation.',
        establishedYear: 2024
      });
      console.log(`✅ Created College of International Studies (ID: ${college.id})\n`);
    } else {
      console.log(`✅ Found College of International Studies (ID: ${college.id})\n`);
    }

    // Find a lecturer to assign courses to
    const lecturer = await User.findOne({
      where: { role: 'lecturer' }
    });

    if (!lecturer) {
      console.error('❌ No lecturer found in the system!');
      process.exit(1);
    }

    console.log(`✅ Using lecturer: ${lecturer.firstName} ${lecturer.lastName} (${lecturer.email})\n`);

    console.log(`📚 Adding ${coursesToAdd.length} courses...\n`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const courseData of coursesToAdd) {
      try {
        // Check if course already exists
        const existingCourse = await Course.findOne({
          where: { code: courseData.code }
        });

        if (existingCourse) {
          console.log(`⏭️  Skipping ${courseData.code} - already exists`);
          skipCount++;
          continue;
        }

        // Create the course
        const course = await Course.create({
          code: courseData.code,
          title: courseData.title,
          description: `${courseData.title} - Part of ${courseData.degreeProgram}`,
          credits: courseData.credits,
          duration: 16, // Default semester length in weeks
          level: 'beginner', // Default level
          status: 'published', // Make it visible in enrollments
          collegeId: college.id,
          lecturerId: lecturer.id,
          category: 'Bachelor',
          price: 0.00
        });

        console.log(`✅ Created: ${course.code} - ${course.title}`);
        successCount++;

      } catch (error) {
        console.error(`❌ Error creating ${courseData.code}: ${error.message}`);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Summary:');
    console.log(`   ✅ Successfully created: ${successCount} courses`);
    console.log(`   ⏭️  Skipped (already exist): ${skipCount} courses`);
    console.log(`   ❌ Errors: ${errorCount} courses`);
    console.log('='.repeat(60));

    // Verify the courses
    console.log('\n🔍 Verifying courses in College of International Studies...');
    const allCourses = await Course.findAll({
      where: { collegeId: college.id },
      attributes: ['id', 'code', 'title', 'status']
    });

    console.log(`\n📚 Total courses in College of International Studies: ${allCourses.length}`);
    console.log(`📖 Published courses: ${allCourses.filter(c => c.status === 'published').length}`);

    process.exit(0);

  } catch (error) {
    console.error('❌ Fatal error:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

addInternationalCourses();
