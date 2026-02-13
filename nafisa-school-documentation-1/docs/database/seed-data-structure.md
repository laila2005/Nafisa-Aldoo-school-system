# Seed Data Structure for Nafisa Aldoo School Management System

## Overview
This document outlines the structure of the seed data used to populate the database for the Nafisa Aldoo School Management System. Seed data is essential for initializing the database with necessary information, allowing for testing and development without the need for manual data entry.

## Seed Data Structure

### Users Table
The `users` table contains information about different users in the system, including teachers, students, and administrative staff. The structure includes the following fields:

- **id**: Unique identifier for each user (integer).
- **first_name**: User's first name (string).
- **last_name**: User's last name (string).
- **email**: User's email address (string).
- **password**: Hashed password for user authentication (string).
- **role**: Role of the user (e.g., TEACHER, STUDENT, ADMIN) (string).
- **status**: Current status of the user (e.g., ACTIVE, INACTIVE) (string).
- **date_of_birth**: User's date of birth (date, optional for non-students).
- **created_at**: Timestamp of when the record was created (datetime).
- **updated_at**: Timestamp of when the record was last updated (datetime).

### Example Entries
```sql
INSERT INTO users (id, first_name, last_name, email, password, role, date_of_birth, status, created_at, updated_at) VALUES
(101, 'زينب مريود', 'المحبوب عبد الصادق', 'zainab.mahmoud@nafisa-school.edu.sd', 'hashed_password', 'TEACHER', NULL, 'ACTIVE', NOW(), NOW()),
(301, 'إسراء الصديق', 'الريح خلف الله', 'israa.alsadiq@student.nafisa-school.edu.sd', 'hashed_password', 'STUDENT', '2012-01-15', 'ACTIVE', NOW(), NOW());
```

### Subjects Table
The `subjects` table contains information about the subjects offered in the school. The structure includes:

- **id**: Unique identifier for each subject (UUID).
- **name**: Name of the subject (string).
- **code**: Subject code (string).
- **description**: Description of the subject (string).
- **is_active**: Indicates if the subject is currently active (boolean).
- **created_at**: Timestamp of when the record was created (datetime).
- **updated_at**: Timestamp of when the record was last updated (datetime).

### Example Entries
```sql
INSERT INTO subjects (id, name, code, description, is_active, created_at, updated_at) VALUES
('a1111111-1111-1111-1111-111111111111', 'Arabic Language - اللغة العربية', 'AR-101', 'تدريس اللغة العربية والآداب', TRUE, NOW(), NOW());
```

### Class Sections Table
The `class_sections` table contains information about the different class sections available in the school. The structure includes:

- **id**: Unique identifier for each class section (UUID).
- **name**: Name of the class section (string).
- **grade_level**: Grade level associated with the class section (string).
- **max_students**: Maximum number of students allowed in the class section (integer).
- **academic_year_id**: Identifier for the academic year (UUID).
- **is_active**: Indicates if the class section is currently active (boolean).
- **created_at**: Timestamp of when the record was created (datetime).
- **updated_at**: Timestamp of when the record was last updated (datetime).

### Example Entries
```sql
INSERT INTO class_sections (id, name, grade_level, max_students, academic_year_id, is_active, created_at, updated_at) VALUES
('c1111111-1111-1111-1111-111111111111', 'الصف الأول', 'GRADE_1', 30, 'b1111111-1111-1111-1111-111111111111', TRUE, NOW(), NOW());
```

### Enrollment Table
The `class_enrollments` table tracks student enrollments in class sections. The structure includes:

- **id**: Unique identifier for each enrollment (UUID).
- **student_id**: Identifier for the student (integer).
- **class_section_id**: Identifier for the class section (UUID).
- **academic_year_id**: Identifier for the academic year (UUID).
- **enrollment_date**: Date of enrollment (date).
- **status**: Current status of the enrollment (e.g., ACTIVE, INACTIVE) (string).
- **created_at**: Timestamp of when the record was created (datetime).
- **updated_at**: Timestamp of when the record was last updated (datetime).

### Example Entries
```sql
INSERT INTO class_enrollments (id, student_id, class_section_id, academic_year_id, enrollment_date, status, created_at, updated_at) VALUES
('e0000000-0000-0000-0000-000000000301', 301, 'c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', '2025-09-01', 'ACTIVE', NOW(), NOW());
```

## Conclusion
The seed data structure is designed to provide a comprehensive and organized way to initialize the Nafisa Aldoo School Management System's database. This structure ensures that all necessary data is available for testing and development purposes.