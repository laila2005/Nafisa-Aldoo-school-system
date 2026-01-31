-- ============================================
-- MULTI-TENANT SEED DATA
-- Nafisa Mohammed Al-Daw School
-- ============================================

-- Step 1: Create the school (tenant)
INSERT INTO schools (id, name, name_ar, code, address, phone, email, subscription_status, subscription_plan, subscription_start_date, subscription_end_date, max_students, max_teachers, is_active, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 
 'Nafisa Mohammed Al-Daw School', 
 'مدرسة نفيسة محمد الضوء', 
 'NAFISA-ALDOO',
 'Sudan', 
 '+249123456789',
 'contact@nafisa-school.edu.sd',
 'ACTIVE',
 'PREMIUM',
 '2025-09-01',
 '2026-06-30',
 50,
 10,
 true,
 NOW(),
 NOW()
);

-- Get school ID for reference
DO $$
DECLARE
    v_school_id UUID := '550e8400-e29b-41d4-a716-446655440001';
    v_academic_year_id UUID;
    v_arabic_subject_id UUID;
    v_math_subject_id UUID;
    v_islamic_subject_id UUID;
    v_english_subject_id UUID;
    v_geography_subject_id UUID;
    v_technology_subject_id UUID;
    v_history_subject_id UUID;
    v_science_subject_id UUID;
    
    -- Teachers
    v_teacher1_id UUID;
    v_teacher2_id UUID;
    v_teacher3_id UUID;
    v_teacher4_id UUID;
    v_teacher5_id UUID;
    v_teacher6_id UUID;
    v_teacher7_id UUID;
    
    -- Staff
    v_principal_id UUID;
    v_registrar_id UUID;
    
    -- Classes
    v_grade1_class_id UUID;
    v_grade2_class_id UUID;
BEGIN
    -- Get academic year
    SELECT id INTO v_academic_year_id FROM academic_years WHERE name = '2025-2026' LIMIT 1;
    
    -- ============================================
    -- SUBJECTS
    -- ============================================
    INSERT INTO subjects (id, school_id, name, code, description, is_active, created_at, updated_at) VALUES
    (gen_random_uuid(), v_school_id, 'اللغة العربية', 'AR', 'Arabic Language', true, NOW(), NOW()),
    (gen_random_uuid(), v_school_id, 'الرياضيات', 'MATH', 'Mathematics', true, NOW(), NOW()),
    (gen_random_uuid(), v_school_id, 'التربية الإسلامية', 'ISLAM', 'Islamic Education', true, NOW(), NOW()),
    (gen_random_uuid(), v_school_id, 'اللغة الإنجليزية', 'EN', 'English Language', true, NOW(), NOW()),
    (gen_random_uuid(), v_school_id, 'الجغرافيا', 'GEO', 'Geography', true, NOW(), NOW()),
    (gen_random_uuid(), v_school_id, 'التكنولوجيا', 'TECH', 'Technology', true, NOW(), NOW()),
    (gen_random_uuid(), v_school_id, 'التاريخ', 'HIST', 'History', true, NOW(), NOW()),
    (gen_random_uuid(), v_school_id, 'العلوم', 'SCI', 'Science', true, NOW(), NOW());
    
    -- Get subject IDs
    SELECT id INTO v_arabic_subject_id FROM subjects WHERE code = 'AR' LIMIT 1;
    SELECT id INTO v_math_subject_id FROM subjects WHERE code = 'MATH' LIMIT 1;
    SELECT id INTO v_islamic_subject_id FROM subjects WHERE code = 'ISLAM' LIMIT 1;
    SELECT id INTO v_english_subject_id FROM subjects WHERE code = 'EN' LIMIT 1;
    SELECT id INTO v_geography_subject_id FROM subjects WHERE code = 'GEO' LIMIT 1;
    SELECT id INTO v_technology_subject_id FROM subjects WHERE code = 'TECH' LIMIT 1;
    SELECT id INTO v_history_subject_id FROM subjects WHERE code = 'HIST' LIMIT 1;
    SELECT id INTO v_science_subject_id FROM subjects WHERE code = 'SCI' LIMIT 1;
    
    -- ============================================
    -- STAFF & ADMINISTRATION
    -- ============================================
    
    -- Principal: Dr. Zahra Abdul-Rahman Jamil Allah Ahmed
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, phone, gender, date_of_birth, created_at, updated_at) VALUES
    (gen_random_uuid(), 'principal@nafisa-school.edu.sd', '$2a$10$dummyhash', 'Zahra', 'Abdul-Rahman Jamil Allah Ahmed', 'ADMIN', true, '+249123456789', 'FEMALE', '1980-01-01', NOW(), NOW())
    RETURNING id INTO v_principal_id;
    
    -- Registration & Accounts: Amal Al-Tayeb Abdul-Rahman Jamil Allah
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, phone, gender, date_of_birth, created_at, updated_at) VALUES
    (gen_random_uuid(), 'registrar@nafisa-school.edu.sd', '$2a$10$dummyhash', 'Amal', 'Al-Tayeb Abdul-Rahman Jamil Allah', 'ADMIN', true, '+249123456790', 'FEMALE', '1985-01-01', NOW(), NOW())
    RETURNING id INTO v_registrar_id;
    
    -- ============================================
    -- TEACHERS (7 Teachers)
    -- ============================================
    
    -- 1. Zainab Maryoud Al-Mahboub Abdul-Sadiq - Arabic
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, phone, gender, specialization, date_of_birth, created_at, updated_at) VALUES
    (gen_random_uuid(), 'zainab.maryoud@nafisa-school.edu.sd', '$2a$10$dummyhash', 'Zainab', 'Maryoud Al-Mahboub Abdul-Sadiq', 'TEACHER', true, '+249123456791', 'FEMALE', 'اللغة العربية', '1985-01-01', NOW(), NOW())
    RETURNING id INTO v_teacher1_id;
    
    -- 2. Insaf Ibrahim Mohammed Ahmed - Mathematics
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, phone, gender, specialization, date_of_birth, created_at, updated_at) VALUES
    (gen_random_uuid(), 'insaf.ibrahim@nafisa-school.edu.sd', '$2a$10$dummyhash', 'Insaf', 'Ibrahim Mohammed Ahmed', 'TEACHER', true, '+249123456792', 'FEMALE', 'الرياضيات', '1986-01-01', NOW(), NOW())
    RETURNING id INTO v_teacher2_id;
    
    -- 3. Saadia Abdul-Rahman Jamil Allah Ahmed - Islamic Education
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, phone, gender, specialization, date_of_birth, created_at, updated_at) VALUES
    (gen_random_uuid(), 'saadia.abdulrahman@nafisa-school.edu.sd', '$2a$10$dummyhash', 'Saadia', 'Abdul-Rahman Jamil Allah Ahmed', 'TEACHER', true, '+249123456793', 'FEMALE', 'التربية الإسلامية', '1984-01-01', NOW(), NOW())
    RETURNING id INTO v_teacher3_id;
    
    -- 4. Ilham Ibrahim Al-Bashir Omar - English
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, phone, gender, specialization, date_of_birth, created_at, updated_at) VALUES
    (gen_random_uuid(), 'ilham.ibrahim@nafisa-school.edu.sd', '$2a$10$dummyhash', 'Ilham', 'Ibrahim Al-Bashir Omar', 'TEACHER', true, '+249123456794', 'FEMALE', 'اللغة الإنجليزية', '1987-01-01', NOW(), NOW())
    RETURNING id INTO v_teacher4_id;
    
    -- 5. Salha Ali Ramli Mohammed - English
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, phone, gender, specialization, date_of_birth, created_at, updated_at) VALUES
    (gen_random_uuid(), 'salha.ali@nafisa-school.edu.sd', '$2a$10$dummyhash', 'Salha', 'Ali Ramli Mohammed', 'TEACHER', true, '+249123456795', 'FEMALE', 'اللغة الإنجليزية', '1988-01-01', NOW(), NOW())
    RETURNING id INTO v_teacher5_id;
    
    -- 6. Hind Al-Muslimi Youssef Ibrahim - Geography & Technology
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, phone, gender, specialization, date_of_birth, created_at, updated_at) VALUES
    (gen_random_uuid(), 'hind.muslimi@nafisa-school.edu.sd', '$2a$10$dummyhash', 'Hind', 'Al-Muslimi Youssef Ibrahim', 'TEACHER', true, '+249123456796', 'FEMALE', 'الجغرافيا والتكنولوجيا', '1986-01-01', NOW(), NOW())
    RETURNING id INTO v_teacher6_id;
    
    -- 7. Ilham Maryoud Al-Mahboub Abdul-Sadiq - History & Science
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, phone, gender, specialization, date_of_birth, created_at, updated_at) VALUES
    (gen_random_uuid(), 'ilham.maryoud@nafisa-school.edu.sd', '$2a$10$dummyhash', 'Ilham', 'Maryoud Al-Mahboub Abdul-Sadiq', 'TEACHER', true, '+249123456797', 'FEMALE', 'التاريخ والعلوم', '1985-01-01', NOW(), NOW())
    RETURNING id INTO v_teacher7_id;
    
    -- ============================================
    -- CLASS SECTIONS
    -- ============================================
    
    -- Grade 1 Class
    INSERT INTO class_sections (id, name, grade_level, academic_year_id, teacher_id, room_number, max_students, created_at, updated_at) VALUES
    (gen_random_uuid(), 'الصف الأول', 1, v_academic_year_id, v_teacher1_id, 'الفصل 1', 30, NOW(), NOW())
    RETURNING id INTO v_grade1_class_id;
    
    -- Grade 2 Class
    INSERT INTO class_sections (id, name, grade_level, academic_year_id, teacher_id, room_number, max_students, created_at, updated_at) VALUES
    (gen_random_uuid(), 'الصف الثاني', 2, v_academic_year_id, v_teacher2_id, 'الفصل 2', 30, NOW(), NOW())
    RETURNING id INTO v_grade2_class_id;
    
    -- ============================================
    -- STUDENTS - GRADE 1 (12 Students)
    -- ============================================
    
    -- 1. Israa Al-Sadiq Al-Reeh Khalaf Allah
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, phone, gender, date_of_birth, created_at, updated_at) VALUES
    (gen_random_uuid(), 'israa.alsadiq@student.nafisa-school.edu.sd', '$2a$10$dummyhash', 'Israa', 'Al-Sadiq Al-Reeh Khalaf Allah', 'STUDENT', true, NULL, 'FEMALE', '2017-01-01', NOW(), NOW());
    
    INSERT INTO class_enrollments (id, student_id, class_id, academic_year_id, enrollment_date, status, created_at, updated_at) VALUES
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'israa.alsadiq@student.nafisa-school.edu.sd'), v_grade1_class_id, v_academic_year_id, '2025-09-01', 'ACTIVE', NOW(), NOW());
    
    -- 2. Dan Bahaa Al-Din Al-Hadi Mohammed
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, phone, gender, date_of_birth, created_at, updated_at) VALUES
    (gen_random_uuid(), 'dan.bahaa@student.nafisa-school.edu.sd', '$2a$10$dummyhash', 'Dan', 'Bahaa Al-Din Al-Hadi Mohammed', 'STUDENT', true, NULL, 'FEMALE', '2017-02-01', NOW(), NOW());
    
    INSERT INTO class_enrollments (id, student_id, class_id, academic_year_id, enrollment_date, status, created_at, updated_at) VALUES
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'dan.bahaa@student.nafisa-school.edu.sd'), v_grade1_class_id, v_academic_year_id, '2025-09-01', 'ACTIVE', NOW(), NOW());
    
    -- 3. Wisam Abdul-Wahab Babiker Abdul-Rahman
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, phone, gender, date_of_birth, created_at, updated_at) VALUES
    (gen_random_uuid(), 'wisam.abdulwahab@student.nafisa-school.edu.sd', '$2a$10$dummyhash', 'Wisam', 'Abdul-Wahab Babiker Abdul-Rahman', 'STUDENT', true, NULL, 'FEMALE', '2017-03-01', NOW(), NOW());
    
    INSERT INTO class_enrollments (id, student_id, class_id, academic_year_id, enrollment_date, status, created_at, updated_at) VALUES
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'wisam.abdulwahab@student.nafisa-school.edu.sd'), v_grade1_class_id, v_academic_year_id, '2025-09-01', 'ACTIVE', NOW(), NOW());
    
    -- 4. Jadiya Ibrahim Ahmed Mohammed
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, phone, gender, date_of_birth, created_at, updated_at) VALUES
    (gen_random_uuid(), 'jadiya.ibrahim@student.nafisa-school.edu.sd', '$2a$10$dummyhash', 'Jadiya', 'Ibrahim Ahmed Mohammed', 'STUDENT', true, NULL, 'FEMALE', '2017-04-01', NOW(), NOW());
    
    INSERT INTO class_enrollments (id, student_id, class_id, academic_year_id, enrollment_date, status, created_at, updated_at) VALUES
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'jadiya.ibrahim@student.nafisa-school.edu.sd'), v_grade1_class_id, v_academic_year_id, '2025-09-01', 'ACTIVE', NOW(), NOW());
    
    -- 5. Weam Al-Moez Awad Mohammed Ibrahim
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, phone, gender, date_of_birth, created_at, updated_at) VALUES
    (gen_random_uuid(), 'weam.almoez@student.nafisa-school.edu.sd', '$2a$10$dummyhash', 'Weam', 'Al-Moez Awad Mohammed Ibrahim', 'STUDENT', true, NULL, 'FEMALE', '2017-05-01', NOW(), NOW());
    
    INSERT INTO class_enrollments (id, student_id, class_id, academic_year_id, enrollment_date, status, created_at, updated_at) VALUES
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'weam.almoez@student.nafisa-school.edu.sd'), v_grade1_class_id, v_academic_year_id, '2025-09-01', 'ACTIVE', NOW(), NOW());
    
    -- 7. Amira Nasr Al-Din Al-Amin Mohammedein
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, phone, gender, date_of_birth, created_at, updated_at) VALUES
    (gen_random_uuid(), 'amira.nasr@student.nafisa-school.edu.sd', '$2a$10$dummyhash', 'Amira', 'Nasr Al-Din Al-Amin Mohammedein', 'STUDENT', true, NULL, 'FEMALE', '2017-06-01', NOW(), NOW());
    
    INSERT INTO class_enrollments (id, student_id, class_id, academic_year_id, enrollment_date, status, created_at, updated_at) VALUES
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'amira.nasr@student.nafisa-school.edu.sd'), v_grade1_class_id, v_academic_year_id, '2025-09-01', 'ACTIVE', NOW(), NOW());
    
    -- 8. Fawzia Mohammed Rahmat Allah Abdul-Qader
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, phone, gender, date_of_birth, created_at, updated_at) VALUES
    (gen_random_uuid(), 'fawzia.mohammed@student.nafisa-school.edu.sd', '$2a$10$dummyhash', 'Fawzia', 'Mohammed Rahmat Allah Abdul-Qader', 'STUDENT', true, NULL, 'FEMALE', '2017-07-01', NOW(), NOW());
    
    INSERT INTO class_enrollments (id, student_id, class_id, academic_year_id, enrollment_date, status, created_at, updated_at) VALUES
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'fawzia.mohammed@student.nafisa-school.edu.sd'), v_grade1_class_id, v_academic_year_id, '2025-09-01', 'ACTIVE', NOW(), NOW());
    
    -- 9. Marwa Adam Zakaria Hassan
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, phone, gender, date_of_birth, created_at, updated_at) VALUES
    (gen_random_uuid(), 'marwa.adam@student.nafisa-school.edu.sd', '$2a$10$dummyhash', 'Marwa', 'Adam Zakaria Hassan', 'STUDENT', true, NULL, 'FEMALE', '2017-08-01', NOW(), NOW());
    
    INSERT INTO class_enrollments (id, student_id, class_id, academic_year_id, enrollment_date, status, created_at, updated_at) VALUES
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'marwa.adam@student.nafisa-school.edu.sd'), v_grade1_class_id, v_academic_year_id, '2025-09-01', 'ACTIVE', NOW(), NOW());
    
    -- 10. Hanaa Adel Hasab Al-Rasoul
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, phone, gender, date_of_birth, created_at, updated_at) VALUES
    (gen_random_uuid(), 'hanaa.adel@student.nafisa-school.edu.sd', '$2a$10$dummyhash', 'Hanaa', 'Adel Hasab Al-Rasoul', 'STUDENT', true, NULL, 'FEMALE', '2017-09-01', NOW(), NOW());
    
    INSERT INTO class_enrollments (id, student_id, class_id, academic_year_id, enrollment_date, status, created_at, updated_at) VALUES
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'hanaa.adel@student.nafisa-school.edu.sd'), v_grade1_class_id, v_academic_year_id, '2025-09-01', 'ACTIVE', NOW(), NOW());
    
    -- 11. Kawkab Salah Abdul-Sadiq Othman
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, phone, gender, date_of_birth, created_at, updated_at) VALUES
    (gen_random_uuid(), 'kawkab.salah@student.nafisa-school.edu.sd', '$2a$10$dummyhash', 'Kawkab', 'Salah Abdul-Sadiq Othman', 'STUDENT', true, NULL, 'FEMALE', '2017-10-01', NOW(), NOW());
    
    INSERT INTO class_enrollments (id, student_id, class_id, academic_year_id, enrollment_date, status, created_at, updated_at) VALUES
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'kawkab.salah@student.nafisa-school.edu.sd'), v_grade1_class_id, v_academic_year_id, '2025-09-01', 'ACTIVE', NOW(), NOW());
    
    -- 12. Rayan Saif Al-Din Qasim Al-Sayed Younis
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, phone, gender, date_of_birth, created_at, updated_at) VALUES
    (gen_random_uuid(), 'rayan.saif@student.nafisa-school.edu.sd', '$2a$10$dummyhash', 'Rayan', 'Saif Al-Din Qasim Al-Sayed Younis', 'STUDENT', true, NULL, 'FEMALE', '2017-11-01', NOW(), NOW());
    
    INSERT INTO class_enrollments (id, student_id, class_id, academic_year_id, enrollment_date, status, created_at, updated_at) VALUES
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'rayan.saif@student.nafisa-school.edu.sd'), v_grade1_class_id, v_academic_year_id, '2025-09-01', 'ACTIVE', NOW(), NOW());
    
    -- ============================================
    -- STUDENTS - GRADE 2 (2 Students)
    -- ============================================
    
    -- 1. Ritaj Ahmed Ali Mohammed Abu Kalyoua
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, phone, gender, date_of_birth, created_at, updated_at) VALUES
    (gen_random_uuid(), 'ritaj.ahmed@student.nafisa-school.edu.sd', '$2a$10$dummyhash', 'Ritaj', 'Ahmed Ali Mohammed Abu Kalyoua', 'STUDENT', true, NULL, 'FEMALE', '2016-01-01', NOW(), NOW());
    
    INSERT INTO class_enrollments (id, student_id, class_id, academic_year_id, enrollment_date, status, created_at, updated_at) VALUES
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'ritaj.ahmed@student.nafisa-school.edu.sd'), v_grade2_class_id, v_academic_year_id, '2025-09-01', 'ACTIVE', NOW(), NOW());
    
    -- 2. Walaa Khaled Hassan Hajana Bashara
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, phone, gender, date_of_birth, created_at, updated_at) VALUES
    (gen_random_uuid(), 'walaa.khaled@student.nafisa-school.edu.sd', '$2a$10$dummyhash', 'Walaa', 'Khaled Hassan Hajana Bashara', 'STUDENT', true, NULL, 'FEMALE', '2016-02-01', NOW(), NOW());
    
    INSERT INTO class_enrollments (id, student_id, class_id, academic_year_id, enrollment_date, status, created_at, updated_at) VALUES
    (gen_random_uuid(), (SELECT id FROM users WHERE email = 'walaa.khaled@student.nafisa-school.edu.sd'), v_grade2_class_id, v_academic_year_id, '2025-09-01', 'ACTIVE', NOW(), NOW());
    
END $$;

-- ============================================
-- SUMMARY
-- ============================================
-- Total Users: 23 (2 Admin + 7 Teachers + 14 Students)
-- Grade 1: 12 Students
-- Grade 2: 2 Students
-- Grade 3: 0 Students
-- Academic Year: 2025-2026
