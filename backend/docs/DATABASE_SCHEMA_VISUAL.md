# 📊 Database Schema Visual Reference

## Entity Relationship Diagram (Text Format)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USERS (Central Table)                        │
│  - Students, Teachers, Parents, Admins                              │
└─────────────────────────────────────────────────────────────────────┘
          │
          │ (One user can have multiple roles in different contexts)
          │
    ┌─────┴─────────┬──────────────┬───────────────┬──────────────┐
    │               │              │               │              │
    ▼               ▼              ▼               ▼              ▼
┌────────┐    ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌─────────┐
│COURSES │    │CLASS     │   │ENROLL    │   │MESSAGES  │   │NOTIFIC  │
│        │    │SECTIONS  │   │MENTS     │   │          │   │ATIONS   │
│teacher │    │class     │   │student   │   │sender    │   │user_id  │
│  _id   │    │ teacher  │   │  _id     │   │receiver  │   │         │
└────┬───┘    │  _id     │   │course_id │   │  _id     │   └─────────┘
     │        └────┬─────┘   └──────────┘   └──────────┘
     │             │
     │             │         ┌──────────────────┐
     │             └────────▶│CLASS_ENROLLMENTS │
     │                       │student_id        │
     │                       │class_section_id  │
     │                       │academic_year_id  │
     │                       └──────────────────┘
     │
     │         ┌──────────────┬──────────────┬───────────────┐
     │         │              │              │               │
     ▼         ▼              ▼              ▼               ▼
┌──────┐  ┌────────┐    ┌──────────┐  ┌──────────┐   ┌──────────┐
│GRADES│  │ATTEND  │    │COURSE    │  │ASSIGN    │   │ENROLL    │
│      │  │ANCE    │    │MATERIALS │  │MENTS     │   │MENTS     │
└──────┘  └────────┘    │uploaded  │  │created   │   │student   │
                        │  _by     │  │  _by     │   │  _id     │
                        └──────────┘  └────┬─────┘   └──────────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │ASSIGNMENT    │
                                    │ SUBMISSIONS  │
                                    │student_id    │
                                    │assignment_id │
                                    │graded_by     │
                                    └──────────────┘
```

---

## Table Relationships by Category

### 👥 User Management

```
users
  ├─→ enrollments (student → courses)
  ├─→ class_enrollments (student → class_sections)
  ├─→ attendance (student records)
  ├─→ grades (student scores)
  ├─→ messages (sender/receiver)
  ├─→ notifications (user alerts)
  ├─→ report_cards (student reports)
  ├─→ leave_requests (user absences)
  ├─→ fee_payments (student fees)
  ├─→ parent_student_relations (family links)
  ├─→ courses (as teacher)
  ├─→ class_sections (as class_teacher)
  ├─→ assignments (as creator)
  ├─→ course_materials (as uploader)
  ├─→ announcements (as creator)
  └─→ events (as creator)
```

### 📚 Academic Structure

```
academic_years
  ├─→ class_sections
  ├─→ class_enrollments
  ├─→ report_cards
  └─→ fee_payments

class_sections
  ├─→ class_enrollments (students in section)
  ├─→ users (class_teacher)
  └─→ academic_years

subjects
  └─→ (reference table, no direct FK relations)
```

### 🎓 Course Management

```
courses
  ├─→ enrollments (students enrolled)
  ├─→ attendance (student attendance)
  ├─→ grades (student grades)
  ├─→ course_materials (learning resources)
  ├─→ assignments (course tasks)
  └─→ users (teacher)

assignments
  ├─→ assignment_submissions
  ├─→ courses
  └─→ users (creator)
```

### 💬 Communication

```
messages
  ├─→ users (sender)
  └─→ users (receiver)

announcements
  └─→ users (creator)

events
  └─→ users (creator)

notifications
  └─→ users (recipient)
```

### 📊 Reports & Admin

```
report_cards
  ├─→ users (student)
  ├─→ academic_years
  └─→ users (generated_by)

audit_logs
  └─→ users (actor)

settings
  └─→ users (updated_by)

leave_requests
  ├─→ users (requester)
  └─→ users (approver)

fee_payments
  ├─→ users (student)
  └─→ academic_years
```

---

## Field Types Reference

### Common Field Types Across Tables

| Field Type     | PostgreSQL Type | Used In                                         | Purpose              |
| -------------- | --------------- | ----------------------------------------------- | -------------------- |
| `id`           | UUID            | All tables                                      | Primary key          |
| `created_at`   | TIMESTAMP       | Most tables                                     | Record creation time |
| `updated_at`   | TIMESTAMP       | Most tables                                     | Last update time     |
| `is_active`    | BOOLEAN         | users, subjects, class_sections                 | Soft delete flag     |
| `is_published` | BOOLEAN         | announcements, events, report_cards             | Publication status   |
| `status`       | VARCHAR/ENUM    | class_enrollments, leave_requests, fee_payments | Workflow state       |

### Specific Field Patterns

**User References:**

- `user_id` - General user reference
- `student_id` - Specifically a student
- `teacher_id` - Specifically a teacher
- `parent_id` - Specifically a parent
- `created_by` - User who created record
- `updated_by` - User who last updated
- `approved_by` - User who approved
- `graded_by` - User who graded

**Date/Time Fields:**

- `start_date`, `end_date` - Date ranges
- `due_date` - Deadlines
- `enrollment_date` - When enrolled
- `submitted_at` - Submission time
- `graded_at` - When graded
- `published_at` - Publication time
- `read_at` - When notification read

**File/URL Fields:**

- `file_url` - Storage URL
- `profile_picture_url` - User avatar
- `submission_file_url` - Uploaded file

---

## Constraints Summary

### Unique Constraints

```sql
users.email                                    -- No duplicate emails
users.employee_id                              -- Unique employee IDs
users.student_id                               -- Unique student IDs
subjects.name, subjects.code                   -- Unique subject codes
class_sections(name, academic_year_id)         -- Unique class per year
class_enrollments(student, section, year)      -- One enrollment per combo
assignment_submissions(assignment, student)    -- One submission per student
parent_student_relations(parent, student)      -- One relation per pair
report_cards(student, year, semester)          -- One report per period
settings.key                                   -- Unique setting keys
```

### Check Constraints

```sql
class_enrollments.status IN ('ACTIVE', 'DROPPED', 'TRANSFERRED')
parent_student_relations.relationship IN ('FATHER', 'MOTHER', 'GUARDIAN', 'OTHER')
report_cards.semester IN ('FALL', 'SPRING', 'SUMMER')
leave_requests.status IN ('PENDING', 'APPROVED', 'REJECTED')
fee_payments.status IN ('PENDING', 'PAID', 'OVERDUE')
```

### Foreign Key Actions

**ON DELETE CASCADE** (Child deleted when parent deleted):

- enrollments → users, courses
- class_enrollments → users, class_sections, academic_years
- assignments → courses
- assignment_submissions → assignments, users
- course_materials → courses, users
- announcements → users
- events → users
- notifications → users
- etc.

**ON DELETE SET NULL** (Reference cleared when parent deleted):

- class_sections.class_teacher_id → users
- assignment_submissions.graded_by → users
- settings.updated_by → users
- report_cards.generated_by → users
- etc.

---

## Index Strategy

### Primary Indexes (Automatic)

All `id` fields are indexed as primary keys

### Foreign Key Indexes (Created)

```sql
idx_class_sections_academic_year_id
idx_class_enrollments_student_id
idx_class_enrollments_class_section_id
idx_course_materials_course_id
idx_assignments_course_id
idx_assignment_submissions_assignment_id
idx_assignment_submissions_student_id
idx_announcements_created_by
idx_events_start_date
idx_parent_student_relations_parent_id
idx_parent_student_relations_student_id
idx_notifications_user_id
idx_notifications_is_read
idx_audit_logs_user_id
idx_audit_logs_table_name
idx_audit_logs_created_at
idx_report_cards_student_id
idx_leave_requests_user_id
idx_fee_payments_student_id
```

**Why these indexes?**

- Speed up JOIN operations
- Optimize WHERE clauses
- Improve ORDER BY performance
- Accelerate common queries

---

## Data Flow Examples

### 📝 Assignment Workflow

```
1. Teacher creates Assignment (assignments table)
   └─→ Links to Course
   └─→ Sets due_date, total_points

2. Student submits work (assignment_submissions table)
   └─→ Links to Assignment
   └─→ Links to Student
   └─→ Stores submission_file_url or submission_text
   └─→ Marks is_late if past due_date

3. Teacher grades submission
   └─→ Updates points_earned
   └─→ Adds feedback
   └─→ Sets graded_at, graded_by

4. System creates Notification
   └─→ Alerts student of grade
```

### 📅 Class Enrollment Workflow

```
1. Admin creates Academic Year (academic_years table)
   └─→ Sets start_date, end_date
   └─→ Marks as is_current

2. Admin creates Class Sections (class_sections table)
   └─→ Links to Academic Year
   └─→ Assigns class_teacher
   └─→ Sets max_students, room_number

3. Student enrolls in Class Section (class_enrollments table)
   └─→ Links to Student, Class Section, Academic Year
   └─→ Status = 'ACTIVE'

4. Teacher creates Course for Class
   └─→ Links Course to Class Section
   └─→ Students auto-enrolled via class_enrollments
```

### 👨‍👩‍👧 Parent-Student Linkage

```
1. Create Parent user (users table)
   └─→ role = 'PARENT'

2. Create Student user (users table)
   └─→ role = 'STUDENT'

3. Link them (parent_student_relations table)
   └─→ parent_id = parent user
   └─→ student_id = student user
   └─→ relationship = 'FATHER'/'MOTHER'/'GUARDIAN'
   └─→ is_primary_contact = true/false

4. Parent can now:
   └─→ View student grades
   └─→ See attendance
   └─→ Get notifications
   └─→ View report cards
```

---

## Query Performance Tips

### ✅ Good Practices

```typescript
// Use indexed fields in WHERE clauses
const students = await User.findAll({
  where: { role: 'STUDENT' }, // role is indexed
});

// Use include for relations (1 query instead of N+1)
const course = await Course.findOne({
  include: [{ model: User, as: 'teacher' }],
});

// Limit results
const recent = await Notification.findAll({
  where: { userId },
  limit: 10,
  order: [['createdAt', 'DESC']],
});
```

### ❌ Avoid

```typescript
// N+1 query problem
const courses = await Course.findAll();
for (const course of courses) {
  const teacher = await User.findByPk(course.teacherId); // Don't do this!
}

// No limit on large tables
const all = await AuditLog.findAll(); // Could be millions of records!

// Unindexed WHERE clauses
const user = await User.findOne({
  where: { bio: { [Op.like]: '%something%' } }, // bio is not indexed
});
```

---

## Common Query Patterns

### Get student's full academic profile

```typescript
const profile = await User.findOne({
  where: { id: studentId },
  include: [
    { model: Enrollment, as: 'enrollments', include: [Course] },
    { model: ClassEnrollment, as: 'classEnrollments' },
    { model: Grade, as: 'grades' },
    { model: Attendance, as: 'attendanceRecords' },
    { model: ReportCard, as: 'reportCards' },
  ],
});
```

### Get teacher's courses with student count

```typescript
const courses = await Course.findAll({
  where: { teacherId },
  include: [
    {
      model: Enrollment,
      as: 'enrollments',
      attributes: [],
    },
  ],
  attributes: {
    include: [[sequelize.fn('COUNT', sequelize.col('enrollments.id')), 'studentCount']],
  },
  group: ['Course.id'],
});
```

### Get unsubmitted assignments for student

```typescript
const pending = await Assignment.findAll({
  include: [
    {
      model: AssignmentSubmission,
      as: 'submissions',
      where: { studentId },
      required: false,
    },
    { model: Course, as: 'course' },
  ],
  where: {
    '$submissions.id$': null,
    dueDate: { [Op.gt]: new Date() },
  },
});
```

---

**This schema supports all major school management features while maintaining data integrity and performance!**
