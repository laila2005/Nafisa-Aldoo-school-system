# ✅ Database Models Updated

All models have been updated to match your specification with UUID primary keys and proper relationships.

## 📦 New Models Created

### 1. **User Model** (`User.ts`) ✅
- **ID**: UUID (primary key)
- **Fields**: email, password, firstName, lastName, role, phone, profilePicture, isActive, lastLogin
- **Roles**: ADMIN, TEACHER, STUDENT, PARENT

### 2. **Course Model** (`Course.ts`) ✅
- **ID**: UUID (primary key)
- **Fields**: name, code, description, gradeLevel, academicYear, semester, teacherId, maxStudents, isActive
- **Semesters**: FALL, SPRING, SUMMER
- **Foreign Key**: teacherId → users.id

### 3. **Enrollment Model** (`Enrollment.ts`) ✅
- **ID**: UUID (primary key)
- **Fields**: studentId, courseId, enrollmentDate, status
- **Status**: ACTIVE, DROPPED, COMPLETED
- **Foreign Keys**:
  - studentId → users.id
  - courseId → courses.id
- **Unique Constraint**: (studentId, courseId)

### 4. **Attendance Model** (`Attendance.ts`) ✅
- **ID**: UUID (primary key)
- **Fields**: studentId, courseId, date, status, notes
- **Status**: PRESENT, ABSENT, LATE, EXCUSED
- **Foreign Keys**:
  - studentId → users.id
  - courseId → courses.id
- **Unique Constraint**: (studentId, courseId, date)

### 5. **Grade Model** (`Grade.ts`) ✅
- **ID**: UUID (primary key)
- **Fields**: studentId, courseId, category, score (0-100), maxScore, weight, comments
- **Categories**: ASSIGNMENT, QUIZ, EXAM, PARTICIPATION
- **Foreign Keys**:
  - studentId → users.id
  - courseId → courses.id

### 6. **Message Model** (`Message.ts`) ✅
- **ID**: UUID (primary key)
- **Fields**: senderId, recipientId, subject, content, attachments[], isRead
- **Foreign Keys**:
  - senderId → users.id
  - recipientId → users.id

## 🗑️ Old Models (To Be Removed)

The following old models should be deleted as they're replaced by the new structure:
- ❌ `Student.ts` - Student info now in User model with role=STUDENT
- ❌ `Teacher.ts` - Teacher info now in User model with role=TEACHER
- ❌ `Class.ts` - Replaced by Course model

## 🔗 Relationships

```
User (1) ----< (N) Course [as teacher]
User (1) ----< (N) Enrollment [as student]
User (1) ----< (N) Attendance [as student]
User (1) ----< (N) Grade [as student]
User (1) ----< (N) Message [as sender]
User (1) ----< (N) Message [as recipient]

Course (1) ----< (N) Enrollment
Course (1) ----< (N) Attendance
Course (1) ----< (N) Grade
```

## 📝 Key Changes from Old Models

1. **UUID instead of INTEGER** - All IDs are now UUIDs
2. **Simplified User Model** - No separate Student/Teacher tables
3. **Course replaces Class** - More comprehensive course information
4. **New Models Added**:
   - Enrollment - Track student course enrollments
   - Grade - Track student grades with categories
   - Message - Internal messaging system

## 🚀 Next Steps

1. Delete old model files:
   ```bash
   rm src/models/Student.ts
   rm src/models/Teacher.ts
   rm src/models/Class.ts
   ```

2. Restart your server to create new tables:
   ```bash
   npm run dev
   ```

3. The database will automatically create all new tables with proper relationships!

## ⚠️ Important Notes

- All existing data will be lost when you restart (tables will be recreated)
- Make sure your `.env` file has the correct Supabase pooler credentials
- UUIDs are automatically generated for all new records
- All foreign key relationships are enforced by the database
