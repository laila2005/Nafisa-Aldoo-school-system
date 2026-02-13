-- Seed data for Nafisa Aldoo School
-- بسم الله الرحمن الرحيم
-- مدرسة نفيسة محمد الضوء المتوسطة الخاصة بنات بأبي عشر

-- Clear existing data (be careful in production!)
DELETE FROM class_enrollments;
DELETE FROM enrollments;
DELETE FROM grades;
DELETE FROM subjects;
DELETE FROM class_sections;
DELETE FROM academic_years;
DELETE FROM users WHERE role IN ('STUDENT', 'TEACHER', 'ADMIN');

-- Insert Teachers (7 معلمات)
INSERT INTO users (id, first_name, last_name, email, password, role, status, created_at, updated_at) VALUES
(101, 'زينب مريود', 'المحبوب عبد الصادق', 'zainab.mahmoud@nafisa-school.edu.sd', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'TEACHER', 'ACTIVE', NOW(), NOW()),
(102, 'إنصاف إبراهيم', 'محمد أحمد', 'insaf.ibrahim@nafisa-school.edu.sd', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'TEACHER', 'ACTIVE', NOW(), NOW()),
(103, 'سعدية عبد الرحمن', 'جميل الله أحمد', 'saadia.abdulrahman@nafisa-school.edu.sd', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'TEACHER', 'ACTIVE', NOW(), NOW()),
(104, 'إلهام إبراهيم', 'البشير عمر', 'elham.ibrahim@nafisa-school.edu.sd', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'TEACHER', 'ACTIVE', NOW(), NOW()),
(105, 'صلحة علي', 'رملي محمد', 'salha.ali@nafisa-school.edu.sd', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'TEACHER', 'ACTIVE', NOW(), NOW()),
(106, 'هند المسلمي', 'يوسف إبراهيم', 'hind.almuslimi@nafisa-school.edu.sd', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'TEACHER', 'ACTIVE', NOW(), NOW()),
(107, 'إلهام مريود', 'المحبوب عبد الصادق', 'elham.mahmoud@nafisa-school.edu.sd', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'TEACHER', 'ACTIVE', NOW(), NOW());

-- Insert Staff Members (4 أفراد)
-- Note: Using ADMIN role for staff since STAFF role doesn't exist in the enum
INSERT INTO users (id, first_name, last_name, email, password, role, status, created_at, updated_at) VALUES
(201, 'زهراء عبد الرحمن', 'جميل الله أحمد', 'zahraa.abdulrahman@nafisa-school.edu.sd', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'ADMIN', 'ACTIVE', NOW(), NOW()), -- المديرة
(202, 'آمال الطيب', 'عبد الرحمن جميل الله', 'amal.altayeb@nafisa-school.edu.sd', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'ADMIN', 'ACTIVE', NOW(), NOW()), -- التسجيل والحسابات
(203, 'حسنات حسن', 'محمد الحسن', 'hasanat.hassan@nafisa-school.edu.sd', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'ADMIN', 'ACTIVE', NOW(), NOW()), -- عاملة النظافة
(204, 'عيسى آدم', 'محمد', 'issa.adam@nafisa-school.edu.sd', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'ADMIN', 'ACTIVE', NOW(), NOW()); -- الحارس

-- Insert First Grade Students (الصف الأول - 12 طالبة)
-- Note: All students use constant password: 'nafisa2026'
INSERT INTO users (id, first_name, last_name, email, password, role, date_of_birth, status, created_at, updated_at) VALUES
(301, 'إسراء الصديق', 'الريح خلف الله', 'israa.alsadiq@student.nafisa-school.edu.sd', '$2b$10$YourHashedPasswordForNafisa2026Students', 'STUDENT', '2012-01-15', 'ACTIVE', NOW(), NOW()),
(302, 'دان بهاء الدين', 'الهادي محمد', 'dan.bahaaldeen@student.nafisa-school.edu.sd', '$2b$10$YourHashedPasswordForNafisa2026Students', 'STUDENT', '2012-03-20', 'ACTIVE', NOW(), NOW()),
(303, 'وسام عبد الوهاب', 'بابكر عبد الرحمن', 'wisam.abdulwahab@student.nafisa-school.edu.sd', '$2b$10$YourHashedPasswordForNafisa2026Students', 'STUDENT', '2012-05-10', 'ACTIVE', NOW(), NOW()),
(304, 'جدية إبراهيم', 'أحمد محمد', 'jadiya.ibrahim@student.nafisa-school.edu.sd', '$2b$10$YourHashedPasswordForNafisa2026Students', 'STUDENT', '2012-02-25', 'ACTIVE', NOW(), NOW()),
(305, 'وئام المعز', 'عوض محمد إبراهيم', 'weaam.almouez@student.nafisa-school.edu.sd', '$2b$10$YourHashedPasswordForNafisa2026Students', 'STUDENT', '2012-07-18', 'ACTIVE', NOW(), NOW()),
(306, 'أميرة نصر الدين', 'الأمين محمدين', 'amira.nasraldeen@student.nafisa-school.edu.sd', '$2b$10$YourHashedPasswordForNafisa2026Students', 'STUDENT', '2012-04-12', 'ACTIVE', NOW(), NOW()),
(307, 'فوزية محمد', 'رحمة الله عبد القادر', 'fawzia.mohammed@student.nafisa-school.edu.sd', '$2b$10$YourHashedPasswordForNafisa2026Students', 'STUDENT', '2012-09-08', 'ACTIVE', NOW(), NOW()),
(308, 'مروة آدم', 'زكريا حسن', 'marwa.adam@student.nafisa-school.edu.sd', '$2b$10$YourHashedPasswordForNafisa2026Students', 'STUDENT', '2012-06-22', 'ACTIVE', NOW(), NOW()),
(309, 'هناء عادل', 'حسب الرسول', 'hanaa.adel@student.nafisa-school.edu.sd', '$2b$10$YourHashedPasswordForNafisa2026Students', 'STUDENT', '2012-11-30', 'ACTIVE', NOW(), NOW()),
(310, 'كوكب صالح', 'عبد الصادق عثمان', 'kawkab.saleh@student.nafisa-school.edu.sd', '$2b$10$YourHashedPasswordForNafisa2026Students', 'STUDENT', '2012-08-14', 'ACTIVE', NOW(), NOW()),
(311, 'ريان سيف الدين', 'قسم السيد يونس', 'rayan.saifaldeen@student.nafisa-school.edu.sd', '$2b$10$YourHashedPasswordForNafisa2026Students', 'STUDENT', '2012-10-05', 'ACTIVE', NOW(), NOW()),
(312, 'نورة عبد الله', 'محمد أحمد', 'noura.abdullah@student.nafisa-school.edu.sd', '$2b$10$YourHashedPasswordForNafisa2026Students', 'STUDENT', '2012-12-20', 'ACTIVE', NOW(), NOW()); -- الطالبة الـ 12

-- Insert Second Grade Students (الصف الثاني - 2 طالبة)
-- Note: All students use constant password: 'nafisa2026'
INSERT INTO users (id, first_name, last_name, email, password, role, date_of_birth, status, created_at, updated_at) VALUES
(401, 'رتاج أحمد', 'علي محمد أبوكليوة', 'retaj.ahmed@student.nafisa-school.edu.sd', '$2b$10$YourHashedPasswordForNafisa2026Students', 'STUDENT', '2011-03-15', 'ACTIVE', NOW(), NOW()),
(402, 'ولاء خالد', 'حسن هجانة بشارة', 'walaa.khaled@student.nafisa-school.edu.sd', '$2b$10$YourHashedPasswordForNafisa2026Students', 'STUDENT', '2011-05-22', 'ACTIVE', NOW(), NOW());

-- Insert Subjects (المواد الدراسية)
INSERT INTO subjects (id, name, code, description, is_active, created_at, updated_at) VALUES
('a1111111-1111-1111-1111-111111111111', 'Arabic Language - اللغة العربية', 'AR-101', 'تدريس اللغة العربية والآداب', TRUE, NOW(), NOW()),
('a2222222-2222-2222-2222-222222222222', 'Mathematics - الرياضيات', 'MATH-101', 'تدريس الرياضيات والحساب', TRUE, NOW(), NOW()),
('a3333333-3333-3333-3333-333333333333', 'Islamic Education - التربية الإسلامية', 'ISLAM-101', 'تدريس التربية الإسلامية والقرآن الكريم', TRUE, NOW(), NOW()),
('a4444444-4444-4444-4444-444444444444', 'English Language - اللغة الإنجليزية', 'ENG-101', 'تدريس اللغة الإنجليزية', TRUE, NOW(), NOW()),
('a5555555-5555-5555-5555-555555555555', 'Geography - الجغرافيا', 'GEO-101', 'تدريس الجغرافيا', TRUE, NOW(), NOW()),
('a6666666-6666-6666-6666-666666666666', 'Technology - التكنولوجيا', 'TECH-101', 'تدريس التكنولوجيا والحاسوب', TRUE, NOW(), NOW()),
('a7777777-7777-7777-7777-777777777777', 'History - التاريخ', 'HIST-101', 'تدريس التاريخ', TRUE, NOW(), NOW()),
('a8888888-8888-8888-8888-888888888888', 'Science - العلوم', 'SCI-101', 'تدريس العلوم الطبيعية', TRUE, NOW(), NOW());

-- Insert Academic Year
INSERT INTO academic_years (id, name, start_date, end_date, is_current, created_at, updated_at) VALUES
('b1111111-1111-1111-1111-111111111111', '2025-2026', '2025-09-01', '2026-06-30', TRUE, NOW(), NOW());

-- Insert Class Sections
INSERT INTO class_sections (id, name, grade_level, max_students, academic_year_id, is_active, created_at, updated_at) VALUES
('c1111111-1111-1111-1111-111111111111', 'الصف الأول', 'GRADE_1', 30, 'b1111111-1111-1111-1111-111111111111', TRUE, NOW(), NOW()),
('c2222222-2222-2222-2222-222222222222', 'الصف الثاني', 'GRADE_2', 30, 'b1111111-1111-1111-1111-111111111111', TRUE, NOW(), NOW()),
('c3333333-3333-3333-3333-333333333333', 'الصف الثالث', 'GRADE_3', 30, 'b1111111-1111-1111-1111-111111111111', TRUE, NOW(), NOW());

-- Enroll First Grade Students in Class Sections (الصف الأول)
INSERT INTO class_enrollments (id, student_id, class_section_id, academic_year_id, enrollment_date, status, created_at, updated_at) VALUES
('e0000000-0000-0000-0000-000000000301', 301, 'c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', '2025-09-01', 'ACTIVE', NOW(), NOW()),
('e0000000-0000-0000-0000-000000000302', 302, 'c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', '2025-09-01', 'ACTIVE', NOW(), NOW()),
('e0000000-0000-0000-0000-000000000303', 303, 'c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', '2025-09-01', 'ACTIVE', NOW(), NOW()),
('e0000000-0000-0000-0000-000000000304', 304, 'c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', '2025-09-01', 'ACTIVE', NOW(), NOW()),
('e0000000-0000-0000-0000-000000000305', 305, 'c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', '2025-09-01', 'ACTIVE', NOW(), NOW()),
('e0000000-0000-0000-0000-000000000306', 306, 'c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', '2025-09-01', 'ACTIVE', NOW(), NOW()),
('e0000000-0000-0000-0000-000000000307', 307, 'c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', '2025-09-01', 'ACTIVE', NOW(), NOW()),
('e0000000-0000-0000-0000-000000000308', 308, 'c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', '2025-09-01', 'ACTIVE', NOW(), NOW()),
('e0000000-0000-0000-0000-000000000309', 309, 'c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', '2025-09-01', 'ACTIVE', NOW(), NOW()),
('e0000000-0000-0000-0000-000000000310', 310, 'c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', '2025-09-01', 'ACTIVE', NOW(), NOW()),
('e0000000-0000-0000-0000-000000000311', 311, 'c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', '2025-09-01', 'ACTIVE', NOW(), NOW()),
('e0000000-0000-0000-0000-000000000312', 312, 'c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', '2025-09-01', 'ACTIVE', NOW(), NOW()),
-- Second Grade Students
('e0000000-0000-0000-0000-000000000401', 401, 'c2222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', '2025-09-01', 'ACTIVE', NOW(), NOW()),
('e0000000-0000-0000-0000-000000000402', 402, 'c2222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', '2025-09-01', 'ACTIVE', NOW(), NOW());

-- =====================================================
-- Summary Statistics
-- =====================================================
-- Total Teachers: 7
-- Total Students: 14 (12 in Grade 1, 2 in Grade 2)
-- Total Staff: 4 ADMIN users (1 Principal, 1 Registration, 1 Cleaner, 1 Guard)
-- Note: All staff assigned ADMIN role since STAFF role doesn't exist in enum
-- Total Subjects: 8
-- Grade 3: Currently Empty (لا يوجد طالبات بالصف الثالث)
-- =====================================================
