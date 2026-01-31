# Model Relationships Reference

## Quick Import Guide

```typescript
// Import all models
import {
  // Core models
  User,
  Course,
  Enrollment,
  Attendance,
  Grade,
  Message,

  // Academic structure
  AcademicYear,
  Subject,
  ClassSection,
  ClassEnrollment,

  // Course content
  CourseMaterial,
  Assignment,
  AssignmentSubmission,

  // Communication
  Announcement,
  Event,
  Notification,

  // Relationships & Admin
  ParentStudentRelation,
  ReportCard,
  LeaveRequest,
  FeePayment,
  AuditLog,
  Settings,
} from './models';
```

## Model Relationships Setup

Add this to `backend/src/models/associations.ts`:

```typescript
import {
  User,
  Course,
  Enrollment,
  Attendance,
  Grade,
  Message,
  AcademicYear,
  Subject,
  ClassSection,
  ClassEnrollment,
  CourseMaterial,
  Assignment,
  AssignmentSubmission,
  Announcement,
  Event,
  ParentStudentRelation,
  Notification,
  AuditLog,
  Settings,
  ReportCard,
  LeaveRequest,
  FeePayment,
} from './index';

export function setupAssociations() {
  // ==========================================
  // USER RELATIONSHIPS
  // ==========================================

  // Users teach courses
  User.hasMany(Course, { foreignKey: 'teacherId', as: 'taughtCourses' });
  Course.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher' });

  // Users enroll in courses
  User.hasMany(Enrollment, { foreignKey: 'studentId', as: 'enrollments' });
  Enrollment.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

  // Users have attendance records
  User.hasMany(Attendance, { foreignKey: 'studentId', as: 'attendanceRecords' });
  Attendance.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

  // Users have grades
  User.hasMany(Grade, { foreignKey: 'studentId', as: 'grades' });
  Grade.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

  // Users send and receive messages
  User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
  User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
  Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
  Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

  // ==========================================
  // CLASS SECTION RELATIONSHIPS
  // ==========================================

  // Class sections belong to academic years
  AcademicYear.hasMany(ClassSection, { foreignKey: 'academicYearId', as: 'classSections' });
  ClassSection.belongsTo(AcademicYear, { foreignKey: 'academicYearId', as: 'academicYear' });

  // Class sections have a class teacher
  User.hasMany(ClassSection, { foreignKey: 'classTeacherId', as: 'managedClasses' });
  ClassSection.belongsTo(User, { foreignKey: 'classTeacherId', as: 'classTeacher' });

  // ==========================================
  // CLASS ENROLLMENT RELATIONSHIPS
  // ==========================================

  // Students enroll in class sections
  User.hasMany(ClassEnrollment, { foreignKey: 'studentId', as: 'classEnrollments' });
  ClassEnrollment.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

  ClassSection.hasMany(ClassEnrollment, { foreignKey: 'classSectionId', as: 'enrollments' });
  ClassEnrollment.belongsTo(ClassSection, { foreignKey: 'classSectionId', as: 'classSection' });

  AcademicYear.hasMany(ClassEnrollment, { foreignKey: 'academicYearId', as: 'classEnrollments' });
  ClassEnrollment.belongsTo(AcademicYear, { foreignKey: 'academicYearId', as: 'academicYear' });

  // ==========================================
  // COURSE MATERIAL RELATIONSHIPS
  // ==========================================

  Course.hasMany(CourseMaterial, { foreignKey: 'courseId', as: 'materials' });
  CourseMaterial.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

  User.hasMany(CourseMaterial, { foreignKey: 'uploadedBy', as: 'uploadedMaterials' });
  CourseMaterial.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploader' });

  // ==========================================
  // ASSIGNMENT RELATIONSHIPS
  // ==========================================

  Course.hasMany(Assignment, { foreignKey: 'courseId', as: 'assignments' });
  Assignment.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

  User.hasMany(Assignment, { foreignKey: 'createdBy', as: 'createdAssignments' });
  Assignment.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

  // ==========================================
  // ASSIGNMENT SUBMISSION RELATIONSHIPS
  // ==========================================

  Assignment.hasMany(AssignmentSubmission, { foreignKey: 'assignmentId', as: 'submissions' });
  AssignmentSubmission.belongsTo(Assignment, { foreignKey: 'assignmentId', as: 'assignment' });

  User.hasMany(AssignmentSubmission, { foreignKey: 'studentId', as: 'submissions' });
  AssignmentSubmission.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

  User.hasMany(AssignmentSubmission, { foreignKey: 'gradedBy', as: 'gradedSubmissions' });
  AssignmentSubmission.belongsTo(User, { foreignKey: 'gradedBy', as: 'grader' });

  // ==========================================
  // ANNOUNCEMENT RELATIONSHIPS
  // ==========================================

  User.hasMany(Announcement, { foreignKey: 'createdBy', as: 'announcements' });
  Announcement.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

  // ==========================================
  // EVENT RELATIONSHIPS
  // ==========================================

  User.hasMany(Event, { foreignKey: 'createdBy', as: 'events' });
  Event.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

  // ==========================================
  // PARENT-STUDENT RELATIONSHIPS
  // ==========================================

  User.hasMany(ParentStudentRelation, { foreignKey: 'parentId', as: 'children' });
  User.hasMany(ParentStudentRelation, { foreignKey: 'studentId', as: 'parents' });

  ParentStudentRelation.belongsTo(User, { foreignKey: 'parentId', as: 'parent' });
  ParentStudentRelation.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

  // ==========================================
  // NOTIFICATION RELATIONSHIPS
  // ==========================================

  User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
  Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // ==========================================
  // AUDIT LOG RELATIONSHIPS
  // ==========================================

  User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs' });
  AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // ==========================================
  // SETTINGS RELATIONSHIPS
  // ==========================================

  User.hasMany(Settings, { foreignKey: 'updatedBy', as: 'updatedSettings' });
  Settings.belongsTo(User, { foreignKey: 'updatedBy', as: 'updater' });

  // ==========================================
  // REPORT CARD RELATIONSHIPS
  // ==========================================

  User.hasMany(ReportCard, { foreignKey: 'studentId', as: 'reportCards' });
  ReportCard.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

  AcademicYear.hasMany(ReportCard, { foreignKey: 'academicYearId', as: 'reportCards' });
  ReportCard.belongsTo(AcademicYear, { foreignKey: 'academicYearId', as: 'academicYear' });

  User.hasMany(ReportCard, { foreignKey: 'generatedBy', as: 'generatedReportCards' });
  ReportCard.belongsTo(User, { foreignKey: 'generatedBy', as: 'generator' });

  // ==========================================
  // LEAVE REQUEST RELATIONSHIPS
  // ==========================================

  User.hasMany(LeaveRequest, { foreignKey: 'userId', as: 'leaveRequests' });
  LeaveRequest.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  User.hasMany(LeaveRequest, { foreignKey: 'approvedBy', as: 'approvedLeaveRequests' });
  LeaveRequest.belongsTo(User, { foreignKey: 'approvedBy', as: 'approver' });

  // ==========================================
  // FEE PAYMENT RELATIONSHIPS
  // ==========================================

  User.hasMany(FeePayment, { foreignKey: 'studentId', as: 'feePayments' });
  FeePayment.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

  AcademicYear.hasMany(FeePayment, { foreignKey: 'academicYearId', as: 'feePayments' });
  FeePayment.belongsTo(AcademicYear, { foreignKey: 'academicYearId', as: 'academicYear' });
}
```

## Usage Examples

### Example 1: Get Student with All Related Data

```typescript
const student = await User.findOne({
  where: { id: studentId, role: 'STUDENT' },
  include: [
    {
      model: Enrollment,
      as: 'enrollments',
      include: [{ model: Course, as: 'course' }],
    },
    {
      model: ClassEnrollment,
      as: 'classEnrollments',
      include: [
        { model: ClassSection, as: 'classSection' },
        { model: AcademicYear, as: 'academicYear' },
      ],
    },
    {
      model: Grade,
      as: 'grades',
    },
    {
      model: Attendance,
      as: 'attendanceRecords',
    },
    {
      model: ParentStudentRelation,
      as: 'parents',
      include: [{ model: User, as: 'parent' }],
    },
  ],
});
```

### Example 2: Get Course with Materials and Assignments

```typescript
const course = await Course.findOne({
  where: { id: courseId },
  include: [
    {
      model: User,
      as: 'teacher',
    },
    {
      model: CourseMaterial,
      as: 'materials',
      where: { isPublished: true },
      required: false,
    },
    {
      model: Assignment,
      as: 'assignments',
      include: [
        {
          model: AssignmentSubmission,
          as: 'submissions',
        },
      ],
    },
  ],
});
```

### Example 3: Get Unread Notifications

```typescript
const notifications = await Notification.findAll({
  where: {
    userId: userId,
    isRead: false,
  },
  include: [
    {
      model: User,
      as: 'user',
    },
  ],
  order: [['createdAt', 'DESC']],
  limit: 20,
});
```

### Example 4: Get Class Section with Students

```typescript
const classSection = await ClassSection.findOne({
  where: { id: classSectionId },
  include: [
    {
      model: User,
      as: 'classTeacher',
    },
    {
      model: AcademicYear,
      as: 'academicYear',
    },
    {
      model: ClassEnrollment,
      as: 'enrollments',
      where: { status: 'ACTIVE' },
      include: [
        {
          model: User,
          as: 'student',
        },
      ],
    },
  ],
});
```

### Example 5: Get Pending Leave Requests

```typescript
const pendingRequests = await LeaveRequest.findAll({
  where: { status: 'PENDING' },
  include: [
    {
      model: User,
      as: 'user',
      attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
    },
  ],
  order: [['createdAt', 'ASC']],
});
```

## Initialize Associations

Add this to your `backend/src/index.ts` or main entry file:

```typescript
import { sequelize } from './database/connection';
import { setupAssociations } from './models/associations';

// Setup model associations
setupAssociations();

// Then start your server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Don't sync in production - use migrations
    if (process.env.NODE_ENV !== 'production') {
      // await sequelize.sync({ alter: true });
    }

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to database:', error);
  }
}

startServer();
```

## TypeScript Type Definitions

For better TypeScript support, you can extend the model interfaces:

```typescript
// backend/src/types/models.ts

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
  // ... other fields

  // Virtual fields from associations
  taughtCourses?: ICourse[];
  enrollments?: IEnrollment[];
  classEnrollments?: IClassEnrollment[];
  grades?: IGrade[];
  attendanceRecords?: IAttendance[];
}

export interface ICourse {
  id: string;
  name: string;
  code: string;
  teacherId: string;
  // ... other fields

  // Virtual fields
  teacher?: IUser;
  materials?: ICourseMaterial[];
  assignments?: IAssignment[];
  enrollments?: IEnrollment[];
}

// ... define other interfaces
```

---

**Note:** Make sure to call `setupAssociations()` before making any queries that use `include`.
