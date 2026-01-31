# Database Schema Implementation Guide

## Overview

This document provides instructions for implementing the complete database schema for the Nafisa Aldoo School Management System.

## ✅ What Has Been Completed

### 1. Sequelize Models Created

All 22 models have been created in `backend/src/models/`:

#### Core Models (Original - 6)

- ✅ `User.ts` - Updated with additional fields
- ✅ `Course.ts`
- ✅ `Enrollment.ts`
- ✅ `Attendance.ts`
- ✅ `Grade.ts`
- ✅ `Message.ts`

#### New Models (16)

- ✅ `AcademicYear.ts` - Academic years and semesters
- ✅ `Subject.ts` - Subject definitions
- ✅ `ClassSection.ts` - Class sections/groups
- ✅ `ClassEnrollment.ts` - Student class assignments
- ✅ `CourseMaterial.ts` - Course learning materials
- ✅ `Assignment.ts` - Course assignments
- ✅ `AssignmentSubmission.ts` - Student assignment submissions
- ✅ `Announcement.ts` - School announcements
- ✅ `Event.ts` - School events and calendar
- ✅ `ParentStudentRelation.ts` - Parent-child relationships
- ✅ `Notification.ts` - User notifications
- ✅ `AuditLog.ts` - System audit trail
- ✅ `Settings.ts` - System configuration
- ✅ `ReportCard.ts` - Student report cards
- ✅ `LeaveRequest.ts` - Leave/absence requests
- ✅ `FeePayment.ts` - Fee payment tracking

### 2. Model Exports

All models have been exported from `backend/src/models/index.ts` for easy importing.

### 3. Database Migration Script

A complete SQL migration script has been created at `backend/database-migration.sql` that includes:

- All table definitions with proper constraints
- Foreign key relationships
- Indexes for performance optimization
- Sample data for initial setup
- Automated timestamp triggers

## 📋 Next Steps

### Step 1: Run Database Migration in Supabase

#### Option A: Using Supabase Dashboard (Recommended)

1. Log in to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the contents of `backend/database-migration.sql`
6. Paste into the SQL editor
7. Click **Run** or press `Ctrl+Enter`
8. Wait for confirmation that all tables were created

#### Option B: Using Supabase CLI

```bash
# Navigate to your project root
cd c:\Users\lolo\Nafisa-Aldoo-school-system

# Create a new migration
supabase migration new add_complete_schema

# Copy the SQL content to the generated migration file
# The file will be in supabase/migrations/

# Apply the migration
supabase db push
```

### Step 2: Sync Sequelize Models with Database

After creating the tables in Supabase, you need to ensure Sequelize is configured correctly:

1. **Update Database Connection** (`backend/src/database/connection.ts`):

   ```typescript
   import { Sequelize } from 'sequelize';

   export const sequelize = new Sequelize(
     process.env.DB_NAME || 'postgres',
     process.env.DB_USER || 'postgres',
     process.env.DB_PASSWORD || '',
     {
       host: process.env.DB_HOST,
       port: Number(process.env.DB_PORT) || 5432,
       dialect: 'postgres',
       logging: false,
       define: {
         timestamps: true,
         underscored: true,
       },
     }
   );
   ```

2. **Add Environment Variables** (`.env` file):
   ```env
   DB_HOST=your-supabase-host.supabase.co
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=your-database-password
   DB_PORT=5432
   ```

### Step 3: Test Database Connection

Create a test script to verify everything works:

```typescript
// backend/src/test-db.ts
import { sequelize } from './database/connection';
import * as models from './models';

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful');

    // Test each model
    const modelNames = Object.keys(models);
    console.log(`📦 Loaded ${modelNames.length} models:`, modelNames);

    // Don't sync - tables already exist in Supabase
    // await sequelize.sync({ alter: true });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await sequelize.close();
  }
}

testConnection();
```

Run the test:

```bash
cd backend
npx ts-node src/test-db.ts
```

### Step 4: Create Controllers and Routes

Now you can create controllers for the new models. Example structure:

```
backend/src/
├── controllers/
│   ├── academicYearController.ts
│   ├── announcementController.ts
│   ├── assignmentController.ts
│   ├── classController.ts
│   ├── eventController.ts
│   ├── notificationController.ts
│   └── ...
├── routes/
│   ├── academicYear.routes.ts
│   ├── announcement.routes.ts
│   ├── assignment.routes.ts
│   ├── class.routes.ts
│   ├── event.routes.ts
│   └── ...
```

### Step 5: Update API Documentation

Update your API documentation to include endpoints for all new features.

## 🗂️ Database Schema Summary

### Total Tables: 22

| #   | Table Name               | Purpose                                             | Related To                          |
| --- | ------------------------ | --------------------------------------------------- | ----------------------------------- |
| 1   | users                    | User accounts (students, teachers, parents, admins) | All tables                          |
| 2   | courses                  | Course definitions                                  | enrollments, assignments, materials |
| 3   | enrollments              | Student course enrollments                          | users, courses                      |
| 4   | attendance               | Student attendance records                          | users, courses                      |
| 5   | grades                   | Student grades                                      | users, courses                      |
| 6   | messages                 | User messaging                                      | users                               |
| 7   | academic_years           | Academic year definitions                           | class_sections, report_cards        |
| 8   | subjects                 | Subject/discipline definitions                      | -                                   |
| 9   | class_sections           | Class groups/sections                               | academic_years, users               |
| 10  | class_enrollments        | Student class assignments                           | users, class_sections               |
| 11  | course_materials         | Course learning materials                           | courses, users                      |
| 12  | assignments              | Course assignments                                  | courses, users                      |
| 13  | assignment_submissions   | Student submissions                                 | assignments, users                  |
| 14  | announcements            | School announcements                                | users                               |
| 15  | events                   | School events                                       | users                               |
| 16  | parent_student_relations | Parent-student links                                | users                               |
| 17  | notifications            | User notifications                                  | users                               |
| 18  | audit_logs               | System audit trail                                  | users                               |
| 19  | settings                 | System configuration                                | users                               |
| 20  | report_cards             | Student report cards                                | users, academic_years               |
| 21  | leave_requests           | Leave requests                                      | users                               |
| 22  | fee_payments             | Fee payment tracking                                | users, academic_years               |

## 🔗 Key Relationships

### Student-Related

- Students → Enrollments → Courses
- Students → Class Enrollments → Class Sections
- Students → Assignment Submissions → Assignments
- Students → Attendance Records
- Students → Grades
- Students → Report Cards
- Parents → Parent-Student Relations → Students

### Teacher-Related

- Teachers → Courses (as instructor)
- Teachers → Class Sections (as class teacher)
- Teachers → Assignments (creator)
- Teachers → Course Materials (uploader)

### Academic Structure

- Academic Years → Class Sections
- Academic Years → Report Cards
- Class Sections → Class Enrollments → Students
- Courses → Enrollments → Students

## 📊 Sample Queries

### Get all students in a class section

```typescript
const students = await ClassEnrollment.findAll({
  where: { classSectionId: 'section-id', status: 'ACTIVE' },
  include: [{ model: User, as: 'student' }],
});
```

### Get course materials for a course

```typescript
const materials = await CourseMaterial.findAll({
  where: { courseId: 'course-id', isPublished: true },
  order: [['weekNumber', 'ASC']],
});
```

### Get pending assignments for a student

```typescript
const pendingAssignments = await Assignment.findAll({
  include: [
    {
      model: AssignmentSubmission,
      where: { studentId: 'student-id' },
      required: false,
    },
    { model: Course },
  ],
  where: {
    '$AssignmentSubmission.id$': null,
    dueDate: { [Op.gt]: new Date() },
  },
});
```

## ⚠️ Important Notes

1. **Don't use `sequelize.sync()`** - The tables are already created in Supabase
2. **Use migrations** - For any schema changes, create new migration files
3. **Respect foreign keys** - Always ensure referenced records exist
4. **Use transactions** - For operations affecting multiple tables
5. **Enable RLS** - Set up Row Level Security in Supabase for data protection

## 🔒 Security Recommendations

1. **Enable Row Level Security (RLS)** on all tables in Supabase
2. **Create policies** for different user roles
3. **Never expose database credentials** in frontend code
4. **Use environment variables** for all sensitive configuration
5. **Implement audit logging** using the audit_logs table
6. **Validate all inputs** before database operations

## 🎯 Features Enabled by New Schema

✅ Academic year management
✅ Class organization and student grouping
✅ Subject catalog
✅ Course materials and resources
✅ Assignment submission and grading
✅ School announcements
✅ Event calendar
✅ Parent-student relationships
✅ Notification system
✅ Audit trail
✅ System settings
✅ Report cards generation
✅ Leave request management
✅ Fee payment tracking

## 📞 Support

If you encounter any issues during migration:

1. Check Supabase logs in the dashboard
2. Verify all foreign key references exist
3. Ensure your Supabase plan supports required features
4. Check database user permissions

## 🚀 Ready to Deploy

Once the migration is complete, you can:

1. Create API endpoints for all new features
2. Build frontend components
3. Implement business logic
4. Set up automated reports
5. Configure notifications
6. Deploy to production

---

**Last Updated:** January 31, 2026
**Database Schema Version:** 1.0.0
