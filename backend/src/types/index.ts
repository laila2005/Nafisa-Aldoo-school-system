import type { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    schoolId: string;
  };
  schoolId?: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
}

export enum Semester {
  FALL = 'FALL',
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
}

export enum EnrollmentStatus {
  ACTIVE = 'ACTIVE',
  DROPPED = 'DROPPED',
  COMPLETED = 'COMPLETED',
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED',
}

export enum GradeCategory {
  ASSIGNMENT = 'ASSIGNMENT',
  QUIZ = 'QUIZ',
  EXAM = 'EXAM',
  PARTICIPATION = 'PARTICIPATION',
}
