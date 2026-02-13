import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { useLanguage } from '../../context/LanguageContext';
import { Building2 } from 'lucide-react';

export const SchoolBranding: React.FC = () => {
  const { school } = useSchool();
  const { language } = useLanguage();

  if (!school) return null;

  // Get school name in current language
  const schoolName = language === 'ar' && school.nameAr ? school.nameAr : school.name;

  return (
    <div className="school-branding flex items-center gap-3">
      {school.logo ? (
        <img
          src={school.logo}
          alt={schoolName}
          className="h-10 w-auto object-contain"
        />
      ) : (
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
          <Building2 className="w-6 h-6 text-blue-600" />
        </div>
      )}
      <h1 className="text-xl font-bold text-gray-900">
        {schoolName}
      </h1>
    </div>
  );
};

export default SchoolBranding;
