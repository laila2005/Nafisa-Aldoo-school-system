# Academic Years Documentation

## Overview

The Nafisa Aldoo School Management System supports multiple academic years to facilitate the organization and management of student enrollments, class sections, and curriculum planning. This document outlines the academic years currently implemented in the system, including their start and end dates.

## Current Academic Year

- **Name:** 2025-2026
- **Start Date:** September 1, 2025
- **End Date:** June 30, 2026
- **Is Current:** Yes

## Future Academic Years

The system is designed to accommodate future academic years. As new academic years are introduced, they will be added to the database with corresponding start and end dates.

## Implementation Details

- The academic years are stored in the `academic_years` table within the database.
- Each academic year entry includes attributes such as `id`, `name`, `start_date`, `end_date`, `is_current`, `created_at`, and `updated_at`.
- The `is_current` attribute indicates which academic year is currently active for student enrollments and class assignments.

## Usage

The academic years are utilized in various functionalities of the system, including:

- **Student Enrollment:** Students are enrolled in classes based on the current academic year.
- **Class Sections:** Class sections are associated with specific academic years to manage student capacities and curriculum.
- **Reporting:** Academic performance and attendance reports can be generated based on the selected academic year.

## Conclusion

The academic years feature is a critical component of the Nafisa Aldoo School Management System, ensuring that the school can effectively manage its academic calendar and student enrollments. Future enhancements may include additional features for managing transitions between academic years and historical data tracking.