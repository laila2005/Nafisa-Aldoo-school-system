# Tables Reference

This document serves as a reference for the various tables in the Nafisa Aldoo School Management System database. Each table is described below, including its purpose and key attributes.

## Users Table

- **Purpose**: Stores information about all users in the system, including students, teachers, and administrative staff.
- **Key Attributes**:
  - `id`: Unique identifier for each user.
  - `first_name`: User's first name.
  - `last_name`: User's last name.
  - `email`: User's email address.
  - `password`: Hashed password for authentication.
  - `role`: Role of the user (e.g., STUDENT, TEACHER, ADMIN).
  - `status`: Current status of the user (e.g., ACTIVE, INACTIVE).
  - `date_of_birth`: User's date of birth (for students).
  - `created_at`: Timestamp of when the user was created.
  - `updated_at`: Timestamp of the last update to the user record.

## Subjects Table

- **Purpose**: Contains information about the subjects offered in the school.
- **Key Attributes**:
  - `id`: Unique identifier for each subject.
  - `name`: Name of the subject.
  - `code`: Subject code.
  - `description`: Description of the subject.
  - `is_active`: Indicates if the subject is currently active.
  - `created_at`: Timestamp of when the subject was created.
  - `updated_at`: Timestamp of the last update to the subject record.

## Academic Years Table

- **Purpose**: Stores information about the academic years.
- **Key Attributes**:
  - `id`: Unique identifier for each academic year.
  - `name`: Name of the academic year (e.g., 2025-2026).
  - `start_date`: Start date of the academic year.
  - `end_date`: End date of the academic year.
  - `is_current`: Indicates if this academic year is the current one.
  - `created_at`: Timestamp of when the academic year was created.
  - `updated_at`: Timestamp of the last update to the academic year record.

## Class Sections Table

- **Purpose**: Contains information about the class sections available in the school.
- **Key Attributes**:
  - `id`: Unique identifier for each class section.
  - `name`: Name of the class section (e.g., الصف الأول).
  - `grade_level`: Grade level associated with the class section.
  - `max_students`: Maximum number of students allowed in the class section.
  - `academic_year_id`: Foreign key referencing the academic year.
  - `is_active`: Indicates if the class section is currently active.
  - `created_at`: Timestamp of when the class section was created.
  - `updated_at`: Timestamp of the last update to the class section record.

## Class Enrollments Table

- **Purpose**: Tracks the enrollment of students in class sections for a specific academic year.
- **Key Attributes**:
  - `id`: Unique identifier for each enrollment record.
  - `student_id`: Foreign key referencing the student.
  - `class_section_id`: Foreign key referencing the class section.
  - `academic_year_id`: Foreign key referencing the academic year.
  - `enrollment_date`: Date of enrollment.
  - `status`: Current status of the enrollment (e.g., ACTIVE, INACTIVE).
  - `created_at`: Timestamp of when the enrollment was created.
  - `updated_at`: Timestamp of the last update to the enrollment record.

## Grades Table

- **Purpose**: Stores the grades assigned to students for various subjects.
- **Key Attributes**:
  - `id`: Unique identifier for each grade record.
  - `student_id`: Foreign key referencing the student.
  - `subject_id`: Foreign key referencing the subject.
  - `grade`: The grade received by the student.
  - `academic_year_id`: Foreign key referencing the academic year.
  - `created_at`: Timestamp of when the grade was recorded.
  - `updated_at`: Timestamp of the last update to the grade record.

## Relationships

- **Users to Class Enrollments**: One-to-many relationship (one user can have multiple enrollments).
- **Class Sections to Class Enrollments**: One-to-many relationship (one class section can have multiple enrollments).
- **Academic Years to Class Sections**: One-to-many relationship (one academic year can have multiple class sections).
- **Subjects to Grades**: One-to-many relationship (one subject can have multiple grades).
- **Students to Grades**: One-to-many relationship (one student can have multiple grades).

This reference provides a comprehensive overview of the tables within the Nafisa Aldoo School Management System database, facilitating understanding and navigation of the data structure.