import type { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: UserRole;
  };
}

export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  EXCUSED = 'excused',
}

export enum GradeLevel {
  GRADE_1 = '1',
  GRADE_2 = '2',
  GRADE_3 = '3',
  GRADE_4 = '4',
  GRADE_5 = '5',
  GRADE_6 = '6',
  GRADE_7 = '7',
  GRADE_8 = '8',
  GRADE_9 = '9',
  GRADE_10 = '10',
  GRADE_11 = '11',
  GRADE_12 = '12',
}
