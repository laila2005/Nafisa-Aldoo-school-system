/**
 * Seed Test Users for Nafisa Aldoo School
 * =========================================
 * Creates 1 Admin, 1 Teacher, and 3 Students with properly hashed passwords.
 *
 * Password format for students: firstName + studentId + !
 *   Example: IsraaSTD001!
 *
 * Run: npx tsx seeds/seed-test-users.ts
 *
 * =========================================
 * TEST CREDENTIALS:
 * =========================================
 * ADMIN:
 *   Email: admin@nafisa-school.edu.sd
 *   Password: Admin2026!
 *
 * TEACHER:
 *   Email: teacher@nafisa-school.edu.sd
 *   Password: Teacher2026!
 *
 * STUDENTS:
 *   Email: israa@student.nafisa-school.edu.sd
 *   Password: IsraaSTD001!
 *
 *   Email: marwa@student.nafisa-school.edu.sd
 *   Password: MarwaSTD002!
 *
 *   Email: rayan@student.nafisa-school.edu.sd
 *   Password: RayanSTD003!
 * =========================================
 */

import bcrypt from 'bcryptjs';
import { sequelize } from '../src/database/connection.js';
import { User } from '../src/models/User.js';
import School from '../src/models/School.js';
import '../src/models/associations.js';

const BCRYPT_ROUNDS = 12;

// Fixed UUIDs for reproducibility
const SCHOOL_ID = '00000000-0000-0000-0000-000000000001';
const ADMIN_ID = '10000000-0000-0000-0000-000000000001';
const TEACHER_ID = '20000000-0000-0000-0000-000000000001';
const STUDENT_ID_1 = '30000000-0000-0000-0000-000000000001';
const STUDENT_ID_2 = '30000000-0000-0000-0000-000000000002';
const STUDENT_ID_3 = '30000000-0000-0000-0000-000000000003';

interface SeedUser {
  id: string;
  schoolId: string;
  email: string;
  password: string; // plain text, will be hashed
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  phone: string;
  studentId: string;
  employeeId: string;
  isActive: boolean;
}

const seedUsers: SeedUser[] = [
  // ── ADMIN ──
  {
    id: ADMIN_ID,
    schoolId: SCHOOL_ID,
    email: 'admin@nafisa-school.edu.sd',
    password: 'Admin2026!',
    firstName: 'Zahraa',
    lastName: 'Abdulrahman',
    role: 'ADMIN',
    phone: '+249123456789',
    studentId: '',
    employeeId: 'EMP001',
    isActive: true,
  },
  // ── TEACHER ──
  {
    id: TEACHER_ID,
    schoolId: SCHOOL_ID,
    email: 'teacher@nafisa-school.edu.sd',
    password: 'Teacher2026!',
    firstName: 'Zainab',
    lastName: 'Mahmoud',
    role: 'TEACHER',
    phone: '+249123456790',
    studentId: '',
    employeeId: 'EMP002',
    isActive: true,
  },
  // ── STUDENTS ──
  {
    id: STUDENT_ID_1,
    schoolId: SCHOOL_ID,
    email: 'israa@student.nafisa-school.edu.sd',
    password: 'IsraaSTD001!', // firstName + studentId + !
    firstName: 'Israa',
    lastName: 'Alsadiq',
    role: 'STUDENT',
    studentId: 'STD001',
    phone: '',
    employeeId: '',
    isActive: true,
  },
  {
    id: STUDENT_ID_2,
    schoolId: SCHOOL_ID,
    email: 'marwa@student.nafisa-school.edu.sd',
    password: 'MarwaSTD002!', // firstName + studentId + !
    firstName: 'Marwa',
    lastName: 'Adam',
    role: 'STUDENT',
    studentId: 'STD002',
    phone: '',
    employeeId: '',
    isActive: true,
  },
  {
    id: STUDENT_ID_3,
    schoolId: SCHOOL_ID,
    email: 'rayan@student.nafisa-school.edu.sd',
    password: 'RayanSTD003!', // firstName + studentId + !
    firstName: 'Rayan',
    lastName: 'Saifaldeen',
    role: 'STUDENT',
    studentId: 'STD003',
    phone: '',
    employeeId: '',
    isActive: true,
  },
];

async function seed() {
  try {
    // 1. Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // 2. Sync models (don't force — keep existing data)
    await sequelize.sync();
    console.log('✅ Models synced');

    // 3. Upsert school
    const [school] = await School.upsert({
      id: SCHOOL_ID,
      name: 'Nafisa Aldoo School',
      nameAr: 'مدرسة نفيسة محمد الضوء المتوسطة الخاصة بنات',
      code: 'NAFISA-ALDOO',
      email: 'info@nafisa-school.edu.sd',
      phone: '+249123456700',
      address: 'أبي عشر، السودان',
      subscriptionStatus: 'ACTIVE',
      subscriptionPlan: 'PREMIUM',
      maxStudents: 100,
      maxTeachers: 20,
      maxStorage: 5000,
      isActive: true,
    });
    console.log(`✅ School created/updated: ${school.name} (${school.id})`);

    // 4. Create users with hashed passwords
    console.log('\n📋 Seeding users...\n');

    for (const userData of seedUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, BCRYPT_ROUNDS);

      const [user, created] = await User.upsert({
        id: userData.id,
        schoolId: userData.schoolId,
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        phone: userData.phone,
        studentId: userData.studentId,
        employeeId: userData.employeeId,
        isActive: userData.isActive,
      });

      const icon = userData.role === 'ADMIN' ? '👑' : userData.role === 'TEACHER' ? '👩‍🏫' : '👩‍🎓';
      console.log(`${icon} [${userData.role}] ${userData.firstName} ${userData.lastName}`);
      console.log(`   Email:    ${userData.email}`);
      console.log(`   Password: ${userData.password}`);
      if (userData.studentId) {
        console.log(`   StudentID: ${userData.studentId}`);
      }
      console.log('');
    }

    // 5. Summary
    console.log('═══════════════════════════════════════════');
    console.log('  ✅ SEED COMPLETE — TEST CREDENTIALS');
    console.log('═══════════════════════════════════════════');
    console.log('');
    console.log('  ADMIN:');
    console.log('    Email:    admin@nafisa-school.edu.sd');
    console.log('    Password: Admin2026!');
    console.log('');
    console.log('  TEACHER:');
    console.log('    Email:    teacher@nafisa-school.edu.sd');
    console.log('    Password: Teacher2026!');
    console.log('');
    console.log('  STUDENTS:');
    console.log('    Email:    israa@student.nafisa-school.edu.sd');
    console.log('    Password: IsraaSTD001!');
    console.log('');
    console.log('    Email:    marwa@student.nafisa-school.edu.sd');
    console.log('    Password: MarwaSTD002!');
    console.log('');
    console.log('    Email:    rayan@student.nafisa-school.edu.sd');
    console.log('    Password: RayanSTD003!');
    console.log('═══════════════════════════════════════════');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('\n🔒 Database connection closed');
  }
}

seed();
