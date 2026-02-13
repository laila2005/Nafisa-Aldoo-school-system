import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { ChevronDown, Building2 } from 'lucide-react';

interface SchoolOption {
  id: string;
  name: string;
  logo?: string;
  code: string;
}

export const SchoolSwitcher: React.FC = () => {
  const { school } = useSchool();
  const [schools, setSchools] = useState<SchoolOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load user's schools from localStorage or API
    const userSchools = localStorage.getItem('userSchools');
    if (userSchools) {
      try {
        setSchools(JSON.parse(userSchools));
      } catch (error) {
        console.error('Failed to parse user schools:', error);
      }
    }
  }, []);

  if (schools.length <= 1) {
    return null; // Don't show switcher if user only has one school
  }

  const handleSelectSchool = async (selectedSchool: SchoolOption) => {
    // This would typically make an API call to switch schools
    console.log('Switching to school:', selectedSchool);
    setIsOpen(false);
    // You would implement actual school switching logic here
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        {school?.logo ? (
          <img src={school.logo} alt={school.name} className="w-6 h-6 rounded" />
        ) : (
          <Building2 className="w-5 h-5 text-gray-600" />
        )}
        <span className="text-sm font-medium text-gray-900">{school?.name}</span>
        <ChevronDown className="w-4 h-4 text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-2">
            {schools.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectSchool(s)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {s.logo ? (
                  <img src={s.logo} alt={s.name} className="w-8 h-8 rounded" />
                ) : (
                  <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-blue-600" />
                  </div>
                )}
                <div className="text-left">
                  <p className="font-medium text-gray-900 text-sm">{s.name}</p>
                  <p className="text-xs text-gray-500">{s.code}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolSwitcher;
