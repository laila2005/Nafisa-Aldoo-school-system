import {
  User,
  Course,
  Enrollment,
  Attendance,
  Grade,
  Message,
  School,
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

/**
 * Setup all model associations/relationships
 * This should be called once when the application starts
 *
 * NOTE: Existing models (Course, Enrollment, Attendance, Grade, Message)
 * already have their associations defined in their respective files.
 * This file only sets up associations for NEW models.
 */
export function setupAssociations(): void {
  // ==========================================
  // MULTI-TENANT RELATIONSHIPS
  // ==========================================
  
  // School has many users
  School.hasMany(User, { foreignKey: 'schoolId', as: 'users' });
  User.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });

  // School has many courses
  School.hasMany(Course, { foreignKey: 'schoolId', as: 'courses' });
  Course.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });

  // School has many academic years
  School.hasMany(AcademicYear, { foreignKey: 'schoolId', as: 'academicYears' });
  AcademicYear.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });

  // School has many subjects
  School.hasMany(Subject, { foreignKey: 'schoolId', as: 'subjects' });
  Subject.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });

  // School has many class sections
  School.hasMany(ClassSection, { foreignKey: 'schoolId', as: 'classSections' });
  ClassSection.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });

  // ==========================================
  // USER RELATIONSHIPS (for new models only)
  // ==========================================
  // Note: Associations for Course, Enrollment, Attendance, Grade, Message
  // are already defined in their respective model files

  // Users teach courses
  User.hasMany(Course, { foreignKey: 'teacherId', as: 'taughtCourses' });

  // Users enroll in courses
  User.hasMany(Enrollment, { foreignKey: 'studentId', as: 'studentEnrollments' });

  // Users have attendance records
  User.hasMany(Attendance, { foreignKey: 'studentId', as: 'studentAttendance' });

  // Users have grades
  User.hasMany(Grade, { foreignKey: 'studentId', as: 'studentGrades' });

  // Users send messages
  User.hasMany(Message, { foreignKey: 'senderId', as: 'messagesSent' });

  // Course relationships (hasMany only, belongsTo already in model files)
  Course.hasMany(Enrollment, { foreignKey: 'courseId', as: 'courseEnrollments' });
  Course.hasMany(Attendance, { foreignKey: 'courseId', as: 'courseAttendance' });
  Course.hasMany(Grade, { foreignKey: 'courseId', as: 'courseGrades' });

  // ==========================================
  // ACADEMIC YEAR RELATIONSHIPS
  // ==========================================

  // Academic years have class sections
  AcademicYear.hasMany(ClassSection, { foreignKey: 'academicYearId', as: 'classSections' });
  ClassSection.belongsTo(AcademicYear, { foreignKey: 'academicYearId', as: 'academicYear' });

  // Academic years have class enrollments
  AcademicYear.hasMany(ClassEnrollment, { foreignKey: 'academicYearId', as: 'classEnrollments' });
  ClassEnrollment.belongsTo(AcademicYear, { foreignKey: 'academicYearId', as: 'academicYear' });

  // Academic years have report cards
  AcademicYear.hasMany(ReportCard, { foreignKey: 'academicYearId', as: 'reportCards' });
  ReportCard.belongsTo(AcademicYear, { foreignKey: 'academicYearId', as: 'academicYear' });

  // Academic years have fee payments
  AcademicYear.hasMany(FeePayment, { foreignKey: 'academicYearId', as: 'feePayments' });
  FeePayment.belongsTo(AcademicYear, { foreignKey: 'academicYearId', as: 'academicYear' });

  // ==========================================
  // CLASS SECTION RELATIONSHIPS
  // ==========================================

  // Class sections have a class teacher
  User.hasMany(ClassSection, { foreignKey: 'classTeacherId', as: 'managedClasses' });
  ClassSection.belongsTo(User, { foreignKey: 'classTeacherId', as: 'classTeacher' });

  // Class sections have enrollments
  ClassSection.hasMany(ClassEnrollment, { foreignKey: 'classSectionId', as: 'enrollments' });
  ClassEnrollment.belongsTo(ClassSection, { foreignKey: 'classSectionId', as: 'classSection' });

  // ==========================================
  // CLASS ENROLLMENT RELATIONSHIPS
  // ==========================================

  // Students have class enrollments
  User.hasMany(ClassEnrollment, { foreignKey: 'studentId', as: 'classEnrollments' });
  ClassEnrollment.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

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

  console.log('✅ Model associations setup complete');
}
