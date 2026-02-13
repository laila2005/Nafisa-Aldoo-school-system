import React, { createContext, useContext, useState, useEffect } from 'react';
import { School, SchoolContextType } from '../types/school';

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [school, setSchoolState] = useState<School | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load school from localStorage on mount
    const storedSchool = localStorage.getItem('currentSchool');
    if (storedSchool) {
      try {
        setSchoolState(JSON.parse(storedSchool));
      } catch (error) {
        console.error('Failed to parse stored school:', error);
        localStorage.removeItem('currentSchool');
      }
    }
    setIsLoading(false);
  }, []);

  const setSchool = (newSchool: School) => {
    setSchoolState(newSchool);
    localStorage.setItem('currentSchool', JSON.stringify(newSchool));
    
    // Apply school branding
    if (newSchool.settings) {
      document.documentElement.style.setProperty(
        '--school-primary',
        newSchool.settings.primaryColor || '#1e40af'
      );
      document.documentElement.style.setProperty(
        '--school-secondary',
        newSchool.settings.secondaryColor || '#64748b'
      );
      document.documentElement.style.setProperty(
        '--school-accent',
        newSchool.settings.accentColor || '#f59e0b'
      );
    }
  };

  const updateSchool = (updates: Partial<School>) => {
    if (school) {
      const updated = { ...school, ...updates };
      setSchool(updated);
    }
  };

  const clearSchool = () => {
    setSchoolState(null);
    localStorage.removeItem('currentSchool');
  };

  return (
    <SchoolContext.Provider
      value={{
        school,
        schoolId: school?.id || null,
        setSchool,
        updateSchool,
        clearSchool,
        isLoading,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within SchoolProvider');
  }
  return context;
};
