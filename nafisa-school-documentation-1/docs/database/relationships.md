# Relationships in Nafisa Aldoo School Management System Database

This document outlines the relationships between different tables in the Nafisa Aldoo School Management System database. Understanding these relationships is crucial for comprehending how data is organized and accessed within the system.

## 1. Users Table

The `users` table serves as the central repository for all user-related information, including students, teachers, and administrative staff. 

### Relationships:
- **One-to-Many**: 
  - A user with the role of `TEACHER` can have multiple `class_enrollments` associated with them, representing the classes they teach.
  - A user with the role of `ADMIN` can manage multiple `students` and `teachers`.

## 2. Students Table

The `students` are represented in the `users` table with the role of `STUDENT`.

### Relationships:
- **Many-to-One**: 
  - Each student is enrolled in one `class_section`, but a `class_section` can have multiple students enrolled.

## 3. Class Sections Table

The `class_sections` table defines the various sections available for each grade level.

### Relationships:
- **One-to-Many**: 
  - Each `class_section` can have multiple `class_enrollments`, representing the students enrolled in that section.

## 4. Class Enrollments Table

The `class_enrollments` table links students to their respective class sections and academic years.

### Relationships:
- **Many-to-One**: 
  - Each `class_enrollment` is associated with one `student` and one `class_section`.
  - Each `class_enrollment` is also linked to one `academic_year`.

## 5. Academic Years Table

The `academic_years` table defines the academic periods during which classes are held.

### Relationships:
- **One-to-Many**: 
  - Each `academic_year` can have multiple `class_sections` and `class_enrollments` associated with it.

## 6. Subjects Table

The `subjects` table lists all subjects offered in the school.

### Relationships:
- **Many-to-Many**: 
  - Subjects can be associated with multiple `class_sections`, and each `class_section` can cover multiple subjects. This relationship is typically managed through a junction table (not explicitly defined in the current schema).

## Summary of Relationships

- **Users**: Central table with one-to-many relationships to `class_enrollments` and `students`.
- **Students**: Many-to-one relationship with `class_sections`.
- **Class Sections**: One-to-many relationship with `class_enrollments`.
- **Class Enrollments**: Many-to-one relationships with `students`, `class_sections`, and `academic_years`.
- **Academic Years**: One-to-many relationships with `class_sections` and `class_enrollments`.
- **Subjects**: Many-to-many relationships with `class_sections`.

Understanding these relationships is essential for effective database management and for ensuring data integrity within the Nafisa Aldoo School Management System.