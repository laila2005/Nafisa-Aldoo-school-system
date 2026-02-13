# Entity-Relationship Diagram (ERD) for Nafisa Aldoo School Management System

## Overview
The Entity-Relationship Diagram (ERD) illustrates the structure of the database used in the Nafisa Aldoo School Management System. It provides a visual representation of the entities involved, their attributes, and the relationships between them.

## Entities and Attributes

1. **Users**
   - **Attributes**: 
     - id (Primary Key)
     - first_name
     - last_name
     - email
     - password
     - role (e.g., STUDENT, TEACHER, ADMIN)
     - status
     - date_of_birth (for students)
     - created_at
     - updated_at

2. **Academic Years**
   - **Attributes**: 
     - id (Primary Key)
     - name
     - start_date
     - end_date
     - is_current
     - created_at
     - updated_at

3. **Class Sections**
   - **Attributes**: 
     - id (Primary Key)
     - name
     - grade_level
     - max_students
     - academic_year_id (Foreign Key)
     - is_active
     - created_at
     - updated_at

4. **Subjects**
   - **Attributes**: 
     - id (Primary Key)
     - name
     - code
     - description
     - is_active
     - created_at
     - updated_at

5. **Enrollments**
   - **Attributes**: 
     - id (Primary Key)
     - student_id (Foreign Key)
     - class_section_id (Foreign Key)
     - academic_year_id (Foreign Key)
     - enrollment_date
     - status
     - created_at
     - updated_at

6. **Class Enrollments**
   - **Attributes**: 
     - id (Primary Key)
     - student_id (Foreign Key)
     - class_section_id (Foreign Key)
     - academic_year_id (Foreign Key)
     - enrollment_date
     - status
     - created_at
     - updated_at

## Relationships

- **Users to Enrollments**: One-to-Many
  - A user (student) can have multiple enrollments in different academic years and class sections.

- **Academic Years to Class Sections**: One-to-Many
  - Each academic year can have multiple class sections associated with it.

- **Class Sections to Enrollments**: One-to-Many
  - Each class section can have multiple enrollments from different students.

- **Subjects to Class Sections**: Many-to-Many (via a junction table if implemented)
  - A class section can offer multiple subjects, and a subject can be taught in multiple class sections.

## Diagram
![ER Diagram](path/to/er-diagram.png)

*Note: The actual ER diagram image should be included in the documentation to provide a visual representation of the described entities and relationships.*