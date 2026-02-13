# Database Schema Overview

The Nafisa Aldoo School Management System utilizes a structured database schema to efficiently manage and organize data related to students, teachers, staff, subjects, and academic years. This document provides an overview of the database schema, detailing the key tables, their attributes, and the relationships between them.

## Key Tables

1. **Users**
   - **Purpose**: Stores information about all users of the system, including students, teachers, and administrative staff.
   - **Key Attributes**:
     - `id`: Unique identifier for each user.
     - `first_name`: User's first name.
     - `last_name`: User's last name.
     - `email`: User's email address.
     - `password`: Hashed password for authentication.
     - `role`: Role of the user (e.g., STUDENT, TEACHER, ADMIN).
     - `status`: Current status of the user (e.g., ACTIVE, INACTIVE).
     - `date_of_birth`: Date of birth for students.

2. **Academic Years**
   - **Purpose**: Represents the academic years during which classes are conducted.
   - **Key Attributes**:
     - `id`: Unique identifier for each academic year.
     - `name`: Name of the academic year (e.g., "2025-2026").
     - `start_date`: Start date of the academic year.
     - `end_date`: End date of the academic year.
     - `is_current`: Indicates if the academic year is the current one.

3. **Class Sections**
   - **Purpose**: Defines the different class sections available for each grade level.
   - **Key Attributes**:
     - `id`: Unique identifier for each class section.
     - `name`: Name of the class section (e.g., "الصف الأول").
     - `grade_level`: Grade level associated with the class section.
     - `max_students`: Maximum number of students allowed in the section.
     - `academic_year_id`: Foreign key linking to the academic year.

4. **Subjects**
   - **Purpose**: Lists the subjects taught in the school.
   - **Key Attributes**:
     - `id`: Unique identifier for each subject.
     - `name`: Name of the subject.
     - `code`: Subject code.
     - `description`: Description of the subject.
     - `is_active`: Indicates if the subject is currently active.

5. **Class Enrollments**
   - **Purpose**: Tracks the enrollment of students in class sections for a specific academic year.
   - **Key Attributes**:
     - `id`: Unique identifier for each enrollment record.
     - `student_id`: Foreign key linking to the student.
     - `class_section_id`: Foreign key linking to the class section.
     - `academic_year_id`: Foreign key linking to the academic year.
     - `enrollment_date`: Date of enrollment.
     - `status`: Current status of the enrollment (e.g., ACTIVE, INACTIVE).

## Relationships

- **Users to Class Enrollments**: One-to-Many
  - A user with the role of STUDENT can have multiple class enrollments.

- **Academic Years to Class Sections**: One-to-Many
  - Each academic year can have multiple class sections associated with it.

- **Class Sections to Class Enrollments**: One-to-Many
  - Each class section can have multiple students enrolled in it.

- **Subjects to Class Sections**: Many-to-Many (not explicitly defined in the current schema but can be implemented)
  - A subject can be taught in multiple class sections, and a class section can cover multiple subjects.

This schema is designed to facilitate efficient data management and retrieval, ensuring that the Nafisa Aldoo School Management System operates smoothly and effectively.