export interface School {
  id: string;
  name: string;
  nameAr?: string;
  code: string;
  email: string;
  phone?: string;
  logo?: string;
  website?: string;
  subscriptionPlan: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  subscriptionStatus: 'ACTIVE' | 'TRIAL' | 'SUSPENDED' | 'EXPIRED';
  maxStudents: number;
  maxTeachers: number;
  maxStorage: number;
  settings?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    timezone?: string;
    locale?: string;
    [key: string]: any;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface SchoolContextType {
  school: School | null;
  schoolId: string | null;
  setSchool: (school: School) => void;
  updateSchool: (updates: Partial<School>) => void;
  clearSchool: () => void;
  isLoading: boolean;
}
