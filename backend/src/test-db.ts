import { sequelize } from './database/connection';
import { setupAssociations } from './models/associations';
import * as models from './models';

// Setup model relationships
setupAssociations();

async function testDatabase() {
  try {
    // Test connection
    console.log('🔌 Testing database connection...\n');
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');

    // List models
    const modelNames = Object.keys(models);
    console.log(`\n📦 Loaded ${modelNames.length} models:`);
    modelNames.forEach((name, i) => {
      console.log(`   ${i + 1}. ${name}`);
    });

    // Test simple queries
    console.log('\n📊 Testing sample data...\n');

    const { AcademicYear, Subject, Settings } = models;

    const academicYears = await AcademicYear.findAll();
    console.log(`📅 Academic Years: ${academicYears.length}`);
    if (academicYears.length > 0) {
      academicYears.forEach((ay) => {
        console.log(`   - ${ay.name} (${ay.isCurrent ? 'Current' : 'Inactive'})`);
      });
    }

    const subjects = await Subject.findAll();
    console.log(`\n📚 Subjects: ${subjects.length}`);
    if (subjects.length > 0) {
      subjects.forEach((subj) => {
        console.log(`   - ${subj.code}: ${subj.name}`);
      });
    }

    const settings = await Settings.findAll();
    console.log(`\n⚙️  Settings: ${settings.length}`);
    if (settings.length > 0) {
      settings.forEach((setting) => {
        console.log(`   - ${setting.key}: ${setting.value}`);
      });
    }

    console.log('\n✅ All tests passed!');
    console.log('\n🎉 Your database is ready to use!');
  } catch (error) {
    console.error('\n❌ Database test failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('\n🔌 Connection closed\n');
  }
}

// Run the test
testDatabase();
