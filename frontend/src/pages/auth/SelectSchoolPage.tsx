import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Check } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { School } from '../../types/school';

export const SelectSchoolPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSchool } = useSchool();
  const [userSchools, setUserSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading schools from localStorage or API
    const loadSchools = async () => {
      try {
        const storedSchools = localStorage.getItem('userSchools');
        if (storedSchools) {
          const schools = JSON.parse(storedSchools);
          setUserSchools(schools);
        } else {
          // Fallback mock data
          const mockSchools: School[] = [
            {
              id: '1',
              name: 'Nafisa Aldoo School',
              nameAr: 'مدرسة نفيسة الدو',
              code: 'NAS001',
              email: 'info@nafisa.edu',
              phone: '+1234567890',
              logo: '',
              subscriptionPlan: 'PREMIUM',
              subscriptionStatus: 'ACTIVE',
              maxStudents: 1000,
              maxTeachers: 200,
              maxStorage: 100,
              settings: {
                primaryColor: '#1e40af',
                secondaryColor: '#64748b',
                accentColor: '#f59e0b',
              },
            },
            {
              id: '2',
              name: 'International Academy',
              nameAr: 'الأكاديمية الدولية',
              code: 'IA002',
              email: 'info@international.edu',
              subscriptionPlan: 'BASIC',
              subscriptionStatus: 'TRIAL',
              maxStudents: 200,
              maxTeachers: 50,
              maxStorage: 20,
            },
          ];
          setUserSchools(mockSchools);
        }
      } catch (error) {
        console.error('Failed to load schools:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSchools();
  }, []);

  const handleSelectSchool = (school: School) => {
    setSelectedSchool(school.id);
    setSchool(school);
    localStorage.setItem('token', 'mock-jwt-token');
    
    // Navigate after a short delay to show the selection animation
    setTimeout(() => {
      navigate('/dashboard');
    }, 300);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Building2 className="w-10 h-10 text-white animate-pulse" />
            </div>
            <p className="text-white text-lg">Loading schools...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Select Your School
          </h1>
          <p className="text-blue-200">
            You belong to multiple schools. Please select one to continue.
          </p>
        </div>

        <div className="space-y-3">
          {userSchools.map((school) => (
            <button
              key={school.id}
              onClick={() => handleSelectSchool(school)}
              className={`w-full p-4 rounded-xl transition-all text-left group relative ${
                selectedSchool === school.id
                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-2 border-blue-400 shadow-lg shadow-blue-500/25'
                  : 'bg-white/10 border-2 border-white/20 hover:bg-white/20 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/25'
              }`}
            >
              {selectedSchool === school.id && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                {school.logo ? (
                  <img
                    src={school.logo}
                    alt={school.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center transition-transform ${
                    selectedSchool === school.id ? 'scale-110' : 'group-hover:scale-110'
                  }`}>
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <p className={`font-semibold ${
                    selectedSchool === school.id ? 'text-white' : 'text-white'
                  }`}>{school.name}</p>
                  <p className={`text-sm ${
                    selectedSchool === school.id ? 'text-blue-200' : 'text-blue-200'
                  }`}>{school.code}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {userSchools.length === 0 && (
          <div className="text-center py-8">
            <p className="text-blue-200">No schools found. Please contact your administrator.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectSchoolPage;
