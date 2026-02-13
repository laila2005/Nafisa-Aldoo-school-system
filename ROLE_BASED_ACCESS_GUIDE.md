# Role-Based Access Control (RBAC) System Guide

## Overview
The Nafisa Aldoo School Management System implements a comprehensive role-based access control system that provides different features and permissions based on user roles.

## User Roles

### 1. ADMIN Role
**Full System Access** - Administrators have complete control over the system.

#### What Admins Can Do:
- ✅ **Dashboard**: View school-wide statistics and analytics
- ✅ **Student Management**: Add, edit, view, and delete student records
- ✅ **Teacher Management**: Manage teacher accounts and assignments
- ✅ **Course Management**: Create, modify, and archive courses
- ✅ **Attendance**: Record and manage attendance for all students
- ✅ **Grades**: View and manage all grades across all courses
- ✅ **Reports**: Generate comprehensive reports
- ✅ **Settings**: Configure school-wide settings
- ✅ **Admin Panel**: Access super-admin features like:
  - School branding customization
  - Subscription management
  - Multi-tenant configuration
  - Systemwide settings

#### Admin Navigation Menu:
```
📊 Dashboard
👥 Students
🎓 Teachers
📚 Courses
📅 Attendance
📝 Grades
💬 Messages
📊 Reports
⚙️ Settings
👑 Admin Panel
```

---

### 2. TEACHER Role
**Course and Student Management** - Teachers can manage their assigned courses and students.

#### What Teachers Can Do:
- ✅ **Dashboard**: View personal teaching statistics
- ✅ **Students**: View and manage students in their courses
- ✅ **Courses**: Manage their assigned courses
- ✅ **Attendance**: Record attendance for their classes
- ✅ **Grades**: Input and manage grades for their students
- ✅ **Reports**: Generate reports for their classes
- ✅ **Messages**: Communicate with students and parents
- ✅ **Settings**: Manage personal preferences

#### What Teachers CANNOT Do:
- ❌ Cannot add/remove teachers
- ❌ Cannot access Admin Panel
- ❌ Cannot modify school-wide settings
- ❌ Cannot manage subscription or billing

#### Teacher Navigation Menu:
```
📊 Dashboard
👥 Students (their classes only)
📚 Courses (assigned courses)
📅 Attendance (their classes)
📝 Grades (their students)
📊 Reports (their data)
💬 Messages
⚙️ Settings
```

---

### 3. STUDENT Role
**Personal Academic Portal** - Students can view their own academic information.

#### What Students Can Do:
- ✅ **Student Dashboard**: Personalized overview with:
  - Current courses
  - Average grades
  - Attendance rate
  - Pending assignments
  - Today's class schedule
- ✅ **My Courses**: View enrolled courses and materials
- ✅ **My Grades**: View all grades with:
  - Course averages
  - Assessment breakdown
  - Teacher feedback
  - Letter grades
  - Performance trends
- ✅ **My Attendance**: Track personal attendance record
- ✅ **Assignments**: View and submit assignments
- ✅ **Messages**: Communicate with teachers
- ✅ **Settings**: Manage personal account

#### What Students CANNOT Do:
- ❌ Cannot view other students' data
- ❌ Cannot modify grades
- ❌ Cannot access teacher/admin features
- ❌ Cannot manage courses
- ❌ Cannot record attendance

#### Student Navigation Menu:
```
📊 My Dashboard
📚 My Courses
🏆 My Grades
⏰ My Attendance
📋 Assignments
💬 Messages
⚙️ Settings
```

#### Student Dashboard Features:
**Stats Cards:**
1. **My Courses**: Number of active courses (6)
2. **Average Grade**: Overall performance (87.5%)
3. **Attendance**: Attendance rate (94%)
4. **Pending Tasks**: Assignments due (3)

**Recent Grades Section:**
- Shows latest assessment results
- Color-coded performance (Green: A, Blue: B, Yellow: C)
- Includes grade date and course name

**Upcoming Assignments:**
- Lists pending tasks
- Due dates clearly displayed
- Status indicators (Pending, In Progress, Late)

**Today's Schedule:**
- Time-based class schedule
- Teacher names
- Room assignments
- Course information

---

### 4. PARENT Role (Coming Soon)
**Child Progress Monitoring** - Parents can view their children's academic progress.

#### Planned Parent Features:
- 👀 View children's grades and attendance
- 📧 Communicate with teachers
- 📊 Access progress reports
- 📅 View children's schedules
- 🔔 Receive notifications about important events

---

## How to Test Different Roles

### Using the Role Switcher
The system includes a **Demo Role Switcher** in the top navbar for testing purposes:

1. **Click the Role Badge** in the top-right corner (shows current role)
2. **Select a Role** from the dropdown:
   - 🔴 ADMIN (Admin User) → Full access
   - 🟣 TEACHER (Teacher User) → Course management
   - 🔵 STUDENT (John Doe) → Personal view
   - 🟢 PARENT (Parent User) → Child monitoring

3. **System Updates**:
   - Sidebar menu changes
   - Navigation options adjust
   - Available features update
   - Dashboard content changes

### Testing Scenarios

#### Test as ADMIN:
```bash
1. Login → Go to /dashboard
2. Navigate to Students page
3. Add a new student
4. Edit student information
5. View all courses
6. Access Admin Panel
7. Customize school branding
```

#### Test as TEACHER:
```bash
1. Login → Go to /dashboard
2. Navigate to Students (see assigned students only)
3. Record attendance for a class
4. Input grades for students
5. View course materials
6. Generate class reports
```

#### Test as STUDENT:
```bash
1. Login → Go to /student/dashboard
2. View personal stats (courses, grades, attendance)
3. Check My Grades page
4. Review upcoming assignments
5. See today's schedule
6. Check course materials
```

---

## Permission Matrix

| Feature | ADMIN | TEACHER | STUDENT | PARENT |
|---------|-------|---------|---------|--------|
| View Dashboard | ✅ Full | ✅ Personal | ✅ Personal | 🔜 Children |
| Manage Students | ✅ All | ✅ Assigned | ❌ | ❌ |
| Manage Teachers | ✅ All | ❌ | ❌ | ❌ |
| Create Courses | ✅ | ✅ Assigned | ❌ | ❌ |
| Record Attendance | ✅ All | ✅ Own Classes | ❌ | ❌ |
| View Attendance | ✅ All | ✅ Own Classes | ✅ Own | 🔜 Children |
| Input Grades | ✅ All | ✅ Own Students | ❌ | ❌ |
| View Grades | ✅ All | ✅ Own Students | ✅ Own | 🔜 Children |
| Generate Reports | ✅ All | ✅ Own Data | ✅ Own | 🔜 Children |
| Admin Panel | ✅ | ❌ | ❌ | ❌ |
| School Settings | ✅ | ❌ | ❌ | ❌ |
| Subscription Mgmt | ✅ | ❌ | ❌ | ❌ |
| Messages | ✅ All | ✅ Students/Parents | ✅ Teachers | 🔜 Teachers |

---

## Security Features

### 1. Role Verification
- Every route checks user role before rendering
- Unauthorized access redirects to login
- Role-specific data filtering

### 2. Data Isolation
- Students see ONLY their own data
- Teachers see ONLY their assigned classes
- Parents see ONLY their children's data
- Admins see everything

### 3. Action Restrictions
- Create/Update/Delete based on role
- Read-only views for limited roles
- Audit logging for sensitive actions

---

##API Integration Points (For Development)

When connecting to backend API, implement:

```typescript
// Example: Role-based data fetching
const fetchStudentData = async (userId: string, userRole: string) => {
  if (userRole === 'STUDENT') {
    // Fetch only student's own data
    return api.get(`/students/${userId}/data`);
  } else if (userRole === 'TEACHER') {
    // Fetch assigned students
    return api.get(`/teachers/${userId}/students`);
  } else if (userRole === 'ADMIN') {
    // Fetch all students
    return api.get('/students');
  }
};
```

---

## Best Practices

### For Admins:
- Regularly review user permissions
- Monitor subscription usage
- Audit system logs
- Maintain school branding

### For Teachers:
- Keep grades up to date
- Record attendance daily
- Provide feedback on assessments
- Communicate with parents

### For Students:
- Check dashboard regularly
- Review feedback on assignments
- Track attendance
- Monitor grades

---

## Troubleshooting

### Issue: Can't see certain menu items
**Solution**: Check your role badge. Different roles have different menus.

### Issue: Can't edit data
**Solution**: You may have read-only access. Contact admin for permissions.

### Issue: Wrong dashboard showing
**Solution**: Use the Role Switcher to select correct role (demo mode only).

---

## Future Enhancements

1. **Granular Permissions**: Custom roles with specific permissions
2. **Parent Portal**: Full parent access to children's data
3. **Department Heads**: Teacher supervisors with additional rights
4. **Guest Access**: Limited view-only access for visitors
5. **API-based Access Control**: Backend permission verification

---

## Support

For questions or issues:
- **Admins**: Contact Super Admin
- **Teachers**: Contact School Administrator
- **Students**: Contact Teacher or Admin
- **Parents**: Contact School Office

---

**Last Updated**: February 12, 2026
**System Version**: 2.0
**Role System**: Active ✅
