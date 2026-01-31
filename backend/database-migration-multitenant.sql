-- ============================================
-- MULTI-TENANT MIGRATION
-- Convert single-tenant system to multi-tenant SaaS platform
-- ============================================

-- Step 1: Create schools table
CREATE TABLE IF NOT EXISTS schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    code VARCHAR(50) NOT NULL UNIQUE,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    logo VARCHAR(255),
    subscription_status VARCHAR(20) NOT NULL DEFAULT 'TRIAL' CHECK (subscription_status IN ('ACTIVE', 'SUSPENDED', 'TRIAL', 'EXPIRED')),
    subscription_plan VARCHAR(20) NOT NULL DEFAULT 'FREE' CHECK (subscription_plan IN ('FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE')),
    subscription_start_date DATE,
    subscription_end_date DATE,
    max_students INTEGER NOT NULL DEFAULT 50,
    max_teachers INTEGER NOT NULL DEFAULT 10,
    max_storage INTEGER NOT NULL DEFAULT 1000, -- in MB
    settings JSONB,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_schools_code ON schools(code);
CREATE INDEX idx_schools_subscription_status ON schools(subscription_status);
CREATE INDEX idx_schools_is_active ON schools(is_active);

-- Step 2: Add school_id to all tenant-specific tables
ALTER TABLE users ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
ALTER TABLE academic_years ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
ALTER TABLE class_sections ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
ALTER TABLE class_enrollments ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
ALTER TABLE course_materials ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
ALTER TABLE assignment_submissions ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
ALTER TABLE parent_student_relations ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
ALTER TABLE report_cards ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
ALTER TABLE leave_requests ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
ALTER TABLE fee_payments ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
ALTER TABLE grades ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;

-- Step 3: Create indexes on school_id for performance
CREATE INDEX IF NOT EXISTS idx_users_school_id ON users(school_id);
CREATE INDEX IF NOT EXISTS idx_courses_school_id ON courses(school_id);
CREATE INDEX IF NOT EXISTS idx_academic_years_school_id ON academic_years(school_id);
CREATE INDEX IF NOT EXISTS idx_subjects_school_id ON subjects(school_id);
CREATE INDEX IF NOT EXISTS idx_class_sections_school_id ON class_sections(school_id);
CREATE INDEX IF NOT EXISTS idx_class_enrollments_school_id ON class_enrollments(school_id);
CREATE INDEX IF NOT EXISTS idx_course_materials_school_id ON course_materials(school_id);
CREATE INDEX IF NOT EXISTS idx_assignments_school_id ON assignments(school_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_school_id ON assignment_submissions(school_id);
CREATE INDEX IF NOT EXISTS idx_announcements_school_id ON announcements(school_id);
CREATE INDEX IF NOT EXISTS idx_events_school_id ON events(school_id);
CREATE INDEX IF NOT EXISTS idx_parent_student_relations_school_id ON parent_student_relations(school_id);
CREATE INDEX IF NOT EXISTS idx_notifications_school_id ON notifications(school_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_school_id ON audit_logs(school_id);
CREATE INDEX IF NOT EXISTS idx_settings_school_id ON settings(school_id);
CREATE INDEX IF NOT EXISTS idx_report_cards_school_id ON report_cards(school_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_school_id ON leave_requests(school_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_school_id ON fee_payments(school_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_school_id ON enrollments(school_id);
CREATE INDEX IF NOT EXISTS idx_attendance_school_id ON attendance(school_id);
CREATE INDEX IF NOT EXISTS idx_grades_school_id ON grades(school_id);
CREATE INDEX IF NOT EXISTS idx_messages_school_id ON messages(school_id);

-- Step 3.5: Update unique constraints for multi-tenancy
-- Remove global unique constraints and add composite unique constraints with school_id

-- Subjects: code should be unique per school, not globally
ALTER TABLE subjects DROP CONSTRAINT IF EXISTS subjects_code_key;
ALTER TABLE subjects DROP CONSTRAINT IF EXISTS subjects_name_key;
CREATE UNIQUE INDEX IF NOT EXISTS subjects_school_code_unique ON subjects(school_id, code);
CREATE UNIQUE INDEX IF NOT EXISTS subjects_school_name_unique ON subjects(school_id, name);

-- Academic Years: name should be unique per school
ALTER TABLE academic_years DROP CONSTRAINT IF EXISTS academic_years_name_key;
CREATE UNIQUE INDEX IF NOT EXISTS academic_years_school_name_unique ON academic_years(school_id, name);

-- Courses: code should be unique per school
ALTER TABLE courses DROP CONSTRAINT IF EXISTS courses_code_key;
CREATE UNIQUE INDEX IF NOT EXISTS courses_school_code_unique ON courses(school_id, code);

-- Settings: key should be unique per school
ALTER TABLE settings DROP CONSTRAINT IF EXISTS settings_key_key;
CREATE UNIQUE INDEX IF NOT EXISTS settings_school_key_unique ON settings(school_id, key);

-- Step 4: Enable Row Level Security (RLS) on all tenant tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_student_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS Policies
-- Note: These policies assume you'll set app.current_school_id in your application
-- For each authenticated request, set: SET LOCAL app.current_school_id = 'school-uuid';

-- Users
DROP POLICY IF EXISTS tenant_isolation_policy ON users;
CREATE POLICY tenant_isolation_policy ON users
    USING (school_id = current_setting('app.current_school_id', TRUE)::UUID);

-- Courses
DROP POLICY IF EXISTS tenant_isolation_policy ON courses;
CREATE POLICY tenant_isolation_policy ON courses
    USING (school_id = current_setting('app.current_school_id', TRUE)::UUID);

-- Academic Years
DROP POLICY IF EXISTS tenant_isolation_policy ON academic_years;
CREATE POLICY tenant_isolation_policy ON academic_years
    USING (school_id = current_setting('app.current_school_id', TRUE)::UUID);

-- Subjects
DROP POLICY IF EXISTS tenant_isolation_policy ON subjects;
CREATE POLICY tenant_isolation_policy ON subjects
    USING (school_id = current_setting('app.current_school_id', TRUE)::UUID);

-- Class Sections
DROP POLICY IF EXISTS tenant_isolation_policy ON class_sections;
CREATE POLICY tenant_isolation_policy ON class_sections
    USING (school_id = current_setting('app.current_school_id', TRUE)::UUID);

-- Class Enrollments
DROP POLICY IF EXISTS tenant_isolation_policy ON class_enrollments;
CREATE POLICY tenant_isolation_policy ON class_enrollments
    USING (school_id = current_setting('app.current_school_id', TRUE)::UUID);

-- Course Materials
DROP POLICY IF EXISTS tenant_isolation_policy ON course_materials;
CREATE POLICY tenant_isolation_policy ON course_materials
    USING (school_id = current_setting('app.current_school_id', TRUE)::UUID);

-- Assignments
DROP POLICY IF EXISTS tenant_isolation_policy ON assignments;
CREATE POLICY tenant_isolation_policy ON assignments
    USING (school_id = current_setting('app.current_school_id', TRUE)::UUID);

-- Assignment Submissions
DROP POLICY IF EXISTS tenant_isolation_policy ON assignment_submissions;
CREATE POLICY tenant_isolation_policy ON assignment_submissions
    USING (school_id = current_setting('app.current_school_id', TRUE)::UUID);

-- Announcements
DROP POLICY IF EXISTS tenant_isolation_policy ON announcements;
CREATE POLICY tenant_isolation_policy ON announcements
    USING (school_id = current_setting('app.current_school_id', TRUE)::UUID);

-- Events
DROP POLICY IF EXISTS tenant_isolation_policy ON events;
CREATE POLICY tenant_isolation_policy ON events
    USING (school_id = current_setting('app.current_school_id', TRUE)::UUID);

-- Parent Student Relations
DROP POLICY IF EXISTS tenant_isolation_policy ON parent_student_relations;
CREATE POLICY tenant_isolation_policy ON parent_student_relations
    USING (school_id = current_setting('app.current_school_id', TRUE)::UUID);

-- Notifications
DROP POLICY IF EXISTS tenant_isolation_policy ON notifications;
CREATE POLICY tenant_isolation_policy ON notifications
    USING (school_id = current_setting('app.current_school_id', TRUE)::UUID);

-- Audit Logs
DROP POLICY IF EXISTS tenant_isolation_policy ON audit_logs;
CREATE POLICY tenant_isolation_policy ON audit_logs
    USING (school_id = current_setting('app.current_school_id', TRUE)::UUID);

-- Settings
DROP POLICY IF EXISTS tenant_isolation_policy ON settings;
CREATE POLICY tenant_isolation_policy ON settings
    USING (school_id = current_setting('app.current_school_id', TRUE)::UUID);

-- Report Cards
DROP POLICY IF EXISTS tenant_isolation_policy ON report_cards;
CREATE POLICY tenant_isolation_policy ON report_cards
    USING (school_id = current_setting('app.current_school_id', TRUE)::UUID);

-- Leave Requests
DROP POLICY IF EXISTS tenant_isolation_policy ON leave_requests;
CREATE POLICY tenant_isolation_policy ON leave_requests
    USING (school_id = current_setting('app.current_school_id', TRUE)::UUID);

-- Fee Payments
DROP POLICY IF EXISTS tenant_isolation_policy ON fee_payments;
CREATE POLICY tenant_isolation_policy ON fee_payments
    USING (school_id = current_setting('app.current_school_id', TRUE)::UUID);

-- Enrollments
DROP POLICY IF EXISTS tenant_isolation_policy ON enrollments;
CREATE POLICY tenant_isolation_policy ON enrollments
    USING (school_id = current_setting('app.current_school_id', TRUE)::UUID);

-- Attendance
DROP POLICY IF EXISTS tenant_isolation_policy ON attendance;
CREATE POLICY tenant_isolation_policy ON attendance
    USING (school_id = current_setting('app.current_school_id', TRUE)::UUID);

-- Grades
DROP POLICY IF EXISTS tenant_isolation_policy ON grades;
CREATE POLICY tenant_isolation_policy ON grades
    USING (school_id = current_setting('app.current_school_id', TRUE)::UUID);

-- Messages
DROP POLICY IF EXISTS tenant_isolation_policy ON messages;
CREATE POLICY tenant_isolation_policy ON messages
    USING (school_id = current_setting('app.current_school_id', TRUE)::UUID);

-- Step 6: Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_schools_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER schools_updated_at_trigger
BEFORE UPDATE ON schools
FOR EACH ROW
EXECUTE FUNCTION update_schools_updated_at();

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Next steps:
-- 1. Insert school data (see multi-tenant-seed-data.sql)
-- 2. Update existing data with school_id
-- 3. Make school_id NOT NULL after data migration
-- 4. Deploy application with tenant middleware
