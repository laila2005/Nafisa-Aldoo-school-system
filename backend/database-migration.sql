-- =====================================================
-- School Management System - Complete Database Schema
-- =====================================================
-- This script creates all tables for the school management system
-- Run this in Supabase SQL Editor or via Supabase CLI

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. ACADEMIC YEARS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS academic_years (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL UNIQUE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. UPDATE USERS TABLE (Add additional fields)
-- =====================================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS state VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS country VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture_url VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS employee_id VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS student_id VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS qualification VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS experience_years INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS emergency_contact_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS emergency_contact_phone VARCHAR(20);

-- =====================================================
-- 3. SUBJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(20) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. CLASS SECTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS class_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  grade_level VARCHAR(50) NOT NULL,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  class_teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
  max_students INTEGER DEFAULT 30,
  room_number VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(name, academic_year_id)
);

-- =====================================================
-- 5. CLASS ENROLLMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS class_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_section_id UUID NOT NULL REFERENCES class_sections(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'DROPPED', 'TRANSFERRED')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, class_section_id, academic_year_id)
);

-- =====================================================
-- 6. COURSE MATERIALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS course_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  material_type VARCHAR(50),
  file_url VARCHAR(500),
  file_size INTEGER,
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_number INTEGER,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 7. ASSIGNMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date TIMESTAMP NOT NULL,
  total_points DECIMAL(5,2) DEFAULT 100,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 8. ASSIGNMENT SUBMISSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS assignment_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  submission_file_url VARCHAR(500),
  submission_text TEXT,
  submitted_at TIMESTAMP,
  is_late BOOLEAN DEFAULT FALSE,
  points_earned DECIMAL(5,2),
  feedback TEXT,
  graded_at TIMESTAMP,
  graded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(assignment_id, student_id)
);

-- =====================================================
-- 9. ANNOUNCEMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  announcement_type VARCHAR(50),
  target_role VARCHAR(50),
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 10. EVENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_type VARCHAR(50),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  location VARCHAR(255),
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 11. PARENT-STUDENT RELATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS parent_student_relations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  relationship VARCHAR(50) CHECK (relationship IN ('FATHER', 'MOTHER', 'GUARDIAN', 'OTHER')),
  is_primary_contact BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(parent_id, student_id)
);

-- =====================================================
-- 12. NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  notification_type VARCHAR(50),
  related_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 13. AUDIT LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100) NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 14. SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  is_system BOOLEAN DEFAULT TRUE,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 15. REPORT CARDS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS report_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  semester VARCHAR(20) CHECK (semester IN ('FALL', 'SPRING', 'SUMMER')),
  gpa DECIMAL(3,2),
  total_attendance_percentage DECIMAL(5,2),
  generated_at TIMESTAMP,
  generated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, academic_year_id, semester)
);

-- =====================================================
-- 16. LEAVE REQUESTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS leave_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  leave_type VARCHAR(50),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approval_date TIMESTAMP,
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 17. FEE PAYMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS fee_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  fee_type VARCHAR(50),
  due_date DATE,
  payment_date DATE,
  payment_method VARCHAR(50),
  transaction_id VARCHAR(100),
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'OVERDUE')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_class_sections_academic_year_id ON class_sections(academic_year_id);
CREATE INDEX IF NOT EXISTS idx_class_enrollments_student_id ON class_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_class_enrollments_class_section_id ON class_enrollments(class_section_id);
CREATE INDEX IF NOT EXISTS idx_course_materials_course_id ON course_materials(course_id);
CREATE INDEX IF NOT EXISTS idx_assignments_course_id ON assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment_id ON assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_student_id ON assignment_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_announcements_created_by ON announcements(created_by);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_parent_student_relations_parent_id ON parent_student_relations(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_student_relations_student_id ON parent_student_relations(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_report_cards_student_id ON report_cards(student_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_user_id ON leave_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_student_id ON fee_payments(student_id);

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- Sample Academic Year
INSERT INTO academic_years (name, start_date, end_date, is_current)
VALUES ('2024-2025', '2024-09-01', '2025-06-30', TRUE)
ON CONFLICT (name) DO NOTHING;

-- Sample Subjects
INSERT INTO subjects (name, code, description) VALUES
('Mathematics', 'MATH', 'Core mathematics subject'),
('English Language', 'ENG', 'English language and literature'),
('Science', 'SCI', 'General science'),
('Arabic Language', 'AR', 'Arabic language and literature'),
('Islamic Studies', 'ISL', 'Islamic studies'),
('Physical Education', 'PE', 'Physical education and sports')
ON CONFLICT (code) DO NOTHING;

-- Sample Settings
INSERT INTO settings (key, value, description) VALUES
('school_name', 'Nafisa Aldoo School', 'Official school name'),
('school_email', 'info@nafisaaldoo.edu', 'School email address'),
('school_phone', '+1234567890', 'School phone number'),
('max_attendance_percentage', '75', 'Minimum attendance percentage'),
('grading_scale', 'A:90-100,B:80-89,C:70-79,D:60-69,F:0-59', 'Grading scale'),
('academic_year_start', '2024-09-01', 'Academic year start date')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- CREATE UPDATE TIMESTAMP TRIGGER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at column
CREATE TRIGGER update_academic_years_updated_at BEFORE UPDATE ON academic_years FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_class_sections_updated_at BEFORE UPDATE ON class_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_class_enrollments_updated_at BEFORE UPDATE ON class_enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_materials_updated_at BEFORE UPDATE ON course_materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignment_submissions_updated_at BEFORE UPDATE ON assignment_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_parent_student_relations_updated_at BEFORE UPDATE ON parent_student_relations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_report_cards_updated_at BEFORE UPDATE ON report_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leave_requests_updated_at BEFORE UPDATE ON leave_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fee_payments_updated_at BEFORE UPDATE ON fee_payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- All tables have been created successfully!
-- You can now use these tables in your application.
