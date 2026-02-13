# Enrollment Process Documentation

## Overview

The enrollment process in the Nafisa Aldoo School Management System is designed to facilitate the registration of students into various class sections for the academic year. This document outlines the steps involved in the enrollment process, the roles responsible for managing enrollments, and the data structure associated with student enrollments.

## Enrollment Steps

1. **Student Registration**: 
   - Students are registered in the system by creating user accounts. Each student must provide personal information, including their name, date of birth, and contact details.

2. **Class Section Assignment**:
   - Once registered, students are assigned to specific class sections based on their grade level. The system supports multiple class sections for each grade to accommodate varying student capacities.

3. **Enrollment Confirmation**:
   - After assignment to a class section, the enrollment status is set to "ACTIVE." This confirms that the student is officially enrolled for the academic year.

4. **Data Management**:
   - The enrollment data is stored in the `class_enrollments` table, which links students to their respective class sections and academic years.

## Roles Involved

- **Administrators**: Responsible for managing student registrations and overseeing the enrollment process. They ensure that all data is accurately entered and maintained.
- **Teachers**: May assist in the enrollment process by providing recommendations for class assignments based on student performance and needs.

## Data Structure

The enrollment data is structured as follows:

- **Table**: `class_enrollments`
  - **Columns**:
    - `id`: Unique identifier for the enrollment record.
    - `student_id`: Foreign key linking to the `users` table, identifying the enrolled student.
    - `class_section_id`: Foreign key linking to the `class_sections` table, identifying the class section.
    - `academic_year_id`: Foreign key linking to the `academic_years` table, identifying the academic year.
    - `enrollment_date`: Date when the student was enrolled.
    - `status`: Current status of the enrollment (e.g., ACTIVE, INACTIVE).
    - `created_at`: Timestamp for when the record was created.
    - `updated_at`: Timestamp for when the record was last updated.

## Conclusion

The enrollment process is a critical component of the Nafisa Aldoo School Management System, ensuring that students are accurately registered and assigned to appropriate class sections. This documentation serves as a guide for understanding the enrollment workflow and the associated data management practices.