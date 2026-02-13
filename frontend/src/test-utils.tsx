// Testing utilities and custom render functions
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SchoolProvider } from './context/SchoolContext';
import { LanguageProvider } from './context/LanguageContext';

interface AllTheProvidersProps {
  children: React.ReactNode;
}

// Wrapper with all providers for testing
const AllTheProviders: React.FC<AllTheProvidersProps> = ({ children }) => {
  return (
    <MemoryRouter>
      <LanguageProvider>
        <SchoolProvider>
          {children}
        </SchoolProvider>
      </LanguageProvider>
    </MemoryRouter>
  );
};

// Custom render function that includes all providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Mock data generators
export const mockSchool = {
  id: '1',
  name: 'Test School',
  nameAr: 'مدرسة الاختبار',
  code: 'TEST001',
  email: 'test@school.com',
  phone: '+1234567890',
  logo: '',
  subscriptionPlan: 'PREMIUM' as const,
  subscriptionStatus: 'ACTIVE' as const,
  maxStudents: 1000,
  maxTeachers: 200,
  maxStorage: 100,
  settings: {
    primaryColor: '#1e40af',
    secondaryColor: '#64748b',
    accentColor: '#f59e0b',
  },
};

export const mockStudent = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@test.com',
  phone: '+1234567890',
  dateOfBirth: '2010-01-15',
  grade: 'Grade 10',
  enrollmentDate: '2024-09-01',
  status: 'active' as const,
  parentName: 'Jane Doe',
  parentEmail: 'jane.doe@test.com',
  parentPhone: '+0987654321',
};

export const mockTeacher = {
  id: 1,
  firstName: 'Sarah',
  lastName: 'Smith',
  email: 'sarah.smith@test.com',
  phone: '+1111111111',
  dateOfBirth: '1985-05-20',
  subjects: ['Mathematics', 'Physics'],
  department: 'Science',
  hireDate: '2020-08-15',
  status: 'active' as const,
};

export const mockCourse = {
  id: 1,
  name: 'Mathematics 101',
  code: 'MATH-101',
  description: 'Introduction to Algebra',
  teacher: 'Dr. Johnson',
  teacherId: 1,
  schedule: 'Mon, Wed, Fri 9:00 AM',
  room: 'Room 101',
  capacity: 30,
  enrolled: 25,
  credits: 3,
  status: 'active' as const,
};

export const mockGrade = {
  id: 1,
  studentName: 'John Doe',
  studentId: 1,
  course: 'Mathematics',
  courseId: 1,
  assessment: 'Midterm Exam',
  score: 92,
  maxScore: 100,
  percentage: 92,
  letterGrade: 'A',
  date: '2026-02-10',
  teacher: 'Dr. Johnson',
};

export const mockUser = {
  id: '1',
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@test.com',
  role: 'ADMIN' as const,
};

// Helper to wait for async operations
export const waitForLoadingToFinish = () => {
  return new Promise((resolve) => setTimeout(resolve, 0));
};
