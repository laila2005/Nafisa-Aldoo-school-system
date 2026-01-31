-- ============================================
-- FIX UNIQUE CONSTRAINTS FOR MULTI-TENANCY
-- Run this BEFORE inserting seed data
-- ============================================

-- This fixes the unique constraints to be per-school instead of global

-- Subjects: code and name should be unique per school, not globally
ALTER TABLE subjects DROP CONSTRAINT IF EXISTS subjects_code_key;
ALTER TABLE subjects DROP CONSTRAINT IF EXISTS subjects_name_key;
DROP INDEX IF EXISTS subjects_school_code_unique;
DROP INDEX IF EXISTS subjects_school_name_unique;
CREATE UNIQUE INDEX subjects_school_code_unique ON subjects(school_id, code);
CREATE UNIQUE INDEX subjects_school_name_unique ON subjects(school_id, name);

-- Academic Years: name should be unique per school
ALTER TABLE academic_years DROP CONSTRAINT IF EXISTS academic_years_name_key;
DROP INDEX IF EXISTS academic_years_school_name_unique;
CREATE UNIQUE INDEX academic_years_school_name_unique ON academic_years(school_id, name);

-- Courses: code should be unique per school
ALTER TABLE courses DROP CONSTRAINT IF EXISTS courses_code_key;
DROP INDEX IF EXISTS courses_school_code_unique;
CREATE UNIQUE INDEX courses_school_code_unique ON courses(school_id, code);

-- Settings: key should be unique per school
ALTER TABLE settings DROP CONSTRAINT IF EXISTS settings_key_key;
DROP INDEX IF EXISTS settings_school_key_unique;
CREATE UNIQUE INDEX settings_school_key_unique ON settings(school_id, key);

-- ============================================
-- READY FOR SEED DATA
-- ============================================
-- Now you can run: real-school-data.sql
