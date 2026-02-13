import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Building2 } from 'lucide-react';

interface SchoolLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({ size = 'md', className = '' }) => {
  const { school } = useSchool();

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  if (!school) return null;

  if (school.logo) {
    return (
      <img
        src={school.logo}
        alt={school.name}
        className={`${sizeClasses[size]} object-contain ${className}`}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-lg bg-blue-100 flex items-center justify-center ${className}`}>
      <Building2 className={`${iconSizes[size]} text-blue-600`} />
    </div>
  );
};

export default SchoolLogo;
