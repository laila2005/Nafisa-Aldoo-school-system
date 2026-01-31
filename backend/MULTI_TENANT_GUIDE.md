# Multi-Tenant SaaS Platform Guide

## Overview

Your school management system has been converted into a **multi-tenant SaaS platform** that allows multiple schools to use the same application while keeping their data completely isolated and secure.

### What Changed?

1. **New `schools` table** - Each school is a tenant
2. **`school_id` added to all tables** - Links data to specific schools
3. **Row-Level Security (RLS)** - PostgreSQL automatically filters data by school
4. **Tenant middleware** - Sets school context for each request
5. **Subscription management** - Track plans, limits, and billing

---

## Architecture: Shared Database with Row-Level Security

**Benefits:**

- ✅ Lower infrastructure costs
- ✅ Easy to manage and scale
- ✅ Automatic data isolation
- ✅ Single codebase for all schools
- ✅ Perfect for SaaS business model

**How it works:**

```
Single PostgreSQL Database
├── School 1 (Nafisa Aldoo)
│   ├── Users (teachers, students, admin)
│   ├── Courses, Classes, Grades
│   └── All isolated by school_id
├── School 2 (Another School)
│   ├── Users (completely separate)
│   ├── Courses, Classes, Grades
│   └── All isolated by school_id
└── School N...
```

---

## Database Schema

### New `schools` Table

```sql
CREATE TABLE schools (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    code VARCHAR(50) UNIQUE NOT NULL,

    -- Contact Info
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    logo VARCHAR(255),

    -- Subscription Management
    subscription_status VARCHAR(20) DEFAULT 'TRIAL',
        -- ACTIVE, SUSPENDED, TRIAL, EXPIRED
    subscription_plan VARCHAR(20) DEFAULT 'FREE',
        -- FREE, BASIC, PREMIUM, ENTERPRISE
    subscription_start_date DATE,
    subscription_end_date DATE,

    -- Resource Limits
    max_students INTEGER DEFAULT 50,
    max_teachers INTEGER DEFAULT 10,
    max_storage INTEGER DEFAULT 1000, -- in MB

    -- Configuration
    settings JSONB,
    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### All Tables Now Include `school_id`

Every tenant-specific table has:

```sql
school_id UUID REFERENCES schools(id) ON DELETE CASCADE
```

**Tables with school_id:**

- users
- courses
- academic_years
- subjects
- class_sections
- class_enrollments
- course_materials
- assignments
- assignment_submissions
- announcements
- events
- parent_student_relations
- notifications
- audit_logs
- settings
- report_cards
- leave_requests
- fee_payments
- enrollments
- attendance
- grades
- messages

---

## Row-Level Security (RLS)

PostgreSQL automatically filters all queries by school_id using RLS policies.

### How RLS Works

1. **Application sets school context:**

   ```sql
   SET LOCAL app.current_school_id = 'school-uuid';
   ```

2. **PostgreSQL enforces policy:**

   ```sql
   CREATE POLICY tenant_isolation_policy ON users
   USING (school_id = current_setting('app.current_school_id')::UUID);
   ```

3. **All queries auto-filtered:**

   ```sql
   -- When you query:
   SELECT * FROM users;

   -- PostgreSQL actually runs:
   SELECT * FROM users
   WHERE school_id = 'current-school-uuid';
   ```

**Security Benefits:**

- ✅ No manual WHERE clauses needed
- ✅ Impossible to access other schools' data
- ✅ Works with ORMs automatically
- ✅ Database-level enforcement

---

## Implementation

### 1. Migration Steps

**Run in Supabase SQL Editor:**

```bash
# Step 1: Create multi-tenant structure
backend/database-migration-multitenant.sql

# Step 2: Seed Nafisa Aldoo School
backend/seeds/real-school-data.sql
```

### 2. Application Setup

**Update `src/index.ts`:**

```typescript
import { tenantMiddleware } from './middleware/tenant.middleware';

// Apply after auth, before routes
app.use(authMiddleware);
app.use(tenantMiddleware); // ← Add this
app.use('/api', routes);
```

**The tenant middleware:**

- Reads `schoolId` from authenticated user
- Sets PostgreSQL session variable
- Automatically filters all queries

### 3. Authentication Changes

**Update login to include school:**

```typescript
// When user logs in
const user = await User.findOne({
  where: { email, schoolId }, // ← Include schoolId
});

// JWT token includes school
const token = jwt.sign(
  {
    userId: user.id,
    schoolId: user.schoolId, // ← Add this
    role: user.role,
  },
  JWT_SECRET
);
```

---

## Usage Examples

### Creating a New School

```typescript
import { School } from './models';

const school = await School.create({
  name: 'My New School',
  nameAr: 'مدرستي الجديدة',
  code: 'MY-SCHOOL-001',
  email: 'contact@myschool.edu',
  subscriptionStatus: 'TRIAL',
  subscriptionPlan: 'FREE',
  maxStudents: 50,
  maxTeachers: 10,
});
```

### Adding Users to a School

```typescript
const teacher = await User.create({
  schoolId: school.id, // ← Links to school
  email: 'teacher@school.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'TEACHER',
  password: hashedPassword,
});
```

### Querying Data (Automatic Filtering)

```typescript
// Tenant middleware already set school context
// This ONLY returns users from current school
const teachers = await User.findAll({
  where: { role: 'TEACHER' },
});
// No need for: where: { schoolId, role: 'TEACHER' }
```

---

## Subscription Plans

### Plan Limits

| Feature  | FREE  | BASIC | PREMIUM  | ENTERPRISE |
| -------- | ----- | ----- | -------- | ---------- |
| Students | 50    | 200   | 1000     | Unlimited  |
| Teachers | 10    | 50    | 200      | Unlimited  |
| Storage  | 1 GB  | 10 GB | 50 GB    | 500 GB     |
| Support  | Email | Email | Priority | Dedicated  |
| Price/mo | $0    | $49   | $199     | Custom     |

### Enforcing Limits

```typescript
// Check before adding student
const school = await School.findByPk(req.schoolId);
const studentCount = await User.count({
  where: { role: 'STUDENT' },
});

if (studentCount >= school.maxStudents) {
  throw new Error('Student limit reached. Upgrade plan.');
}
```

---

## Security Best Practices

### ✅ DO:

- Always use tenant middleware on protected routes
- Let RLS handle data filtering
- Include schoolId in JWT tokens
- Validate school subscription status
- Log cross-tenant access attempts

### ❌ DON'T:

- Skip tenant middleware on any protected route
- Manually add WHERE school_id clauses (RLS does this)
- Share credentials between schools
- Allow users to switch schools without re-auth
- Expose school_id to end users

---

## Testing Multi-Tenancy

### Test Data Isolation

```sql
-- Create two test schools
INSERT INTO schools (id, name, code, ...) VALUES
('school-1-uuid', 'School 1', 'SCH1', ...),
('school-2-uuid', 'School 2', 'SCH2', ...);

-- Add users to each
INSERT INTO users (school_id, email, ...) VALUES
('school-1-uuid', 'user1@school1.com', ...),
('school-2-uuid', 'user2@school2.com', ...);

-- Test queries
SET app.current_school_id = 'school-1-uuid';
SELECT * FROM users; -- Should only see School 1 users

SET app.current_school_id = 'school-2-uuid';
SELECT * FROM users; -- Should only see School 2 users
```

### Test API Endpoints

```bash
# Login as School 1 user
curl -X POST /api/auth/login \
  -d '{"email":"user@school1.com","password":"..."}'

# Use token in requests
curl -H "Authorization: Bearer TOKEN" /api/users
# Should only return School 1 users
```

---

## Monitoring & Analytics

### Track School Metrics

```typescript
// Dashboard for each school
const stats = {
  totalStudents: await User.count({ where: { role: 'STUDENT' } }),
  totalTeachers: await User.count({ where: { role: 'TEACHER' } }),
  activeCourses: await Course.count({ where: { isActive: true } }),
  storageUsed: await calculateStorageUsage(schoolId),
};
```

### Platform-Wide Analytics (Super Admin)

```sql
-- Disable RLS for super admin queries
SET LOCAL row_security = off;

SELECT
  s.name,
  COUNT(DISTINCT u.id) FILTER (WHERE u.role = 'STUDENT') as students,
  COUNT(DISTINCT u.id) FILTER (WHERE u.role = 'TEACHER') as teachers,
  s.subscription_plan
FROM schools s
LEFT JOIN users u ON u.school_id = s.id
GROUP BY s.id;
```

---

## Billing Integration

### Subscription Management

```typescript
// Update subscription
await school.update({
  subscriptionPlan: 'PREMIUM',
  subscriptionStatus: 'ACTIVE',
  subscriptionStartDate: new Date(),
  subscriptionEndDate: addMonths(new Date(), 12),
  maxStudents: 1000,
  maxTeachers: 200,
});

// Check subscription before access
if (school.subscriptionStatus !== 'ACTIVE') {
  throw new Error('Subscription expired. Please renew.');
}
```

---

## Migration Checklist

- [ ] Run `database-migration-multitenant.sql` in Supabase
- [ ] Update User model to include schoolId
- [ ] Update Course model to include schoolId
- [ ] Add tenant middleware to index.ts
- [ ] Update JWT to include schoolId
- [ ] Update login/register to handle schools
- [ ] Run `real-school-data.sql` to seed Nafisa Aldoo
- [ ] Test data isolation between schools
- [ ] Add subscription limit checks
- [ ] Update frontend to show school branding
- [ ] Setup billing integration
- [ ] Add super admin panel

---

## Next Steps

1. **Run migrations** - Execute SQL files in Supabase
2. **Test with Nafisa Aldoo** - Verify existing school works
3. **Add second school** - Test multi-tenancy
4. **Build admin panel** - School management interface
5. **Setup billing** - Stripe/payment integration
6. **Launch SaaS** - Start onboarding schools! 🚀

---

## Support

For questions or issues:

- Check logs: `app.use(morgan('dev'))`
- Verify RLS: `SELECT * FROM pg_policies;`
- Test isolation: Create two test schools
- Monitor queries: Enable PostgreSQL query logging

**Remember:** With RLS, you can't accidentally access wrong school's data - it's database-enforced! 🔒
