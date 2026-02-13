import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Building2, Loader2 } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { School } from '../../types/school';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSchool } = useSchool();
  const [isLoading, setIsLoading] = useState(false);
  const [userSchools, setUserSchools] = useState<School[]>([]);
  const [showSchoolSelection, setShowSchoolSelection] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call - replace with actual API call
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

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (mockSchools.length > 1) {
        setUserSchools(mockSchools);
        setShowSchoolSelection(true);
        localStorage.setItem('userSchools', JSON.stringify(mockSchools));
      } else if (mockSchools.length === 1) {
        const school = mockSchools[0];
        setSchool(school);
        localStorage.setItem('token', 'mock-jwt-token');
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSchool = (school: School) => {
    setSchool(school);
    localStorage.setItem('token', 'mock-jwt-token');
    navigate('/dashboard');
  };

  if (showSchoolSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
            Select Your School
          </h1>
          <p className="text-center text-gray-600 mb-8">
            You belong to multiple schools. Please select one to continue.
          </p>

          <div className="space-y-3">
            {userSchools.map((school) => (
              <button
                key={school.id}
                onClick={() => handleSelectSchool(school)}
                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  {school.logo ? (
                    <img
                      src={school.logo}
                      alt={school.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{school.name}</p>
                    <p className="text-sm text-gray-500">{school.code}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            School Management System
          </h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <Input
            type="email"
            label="Email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            icon={<Mail className="w-5 h-5" />}
            required
          />

          <Input
            type="password"
            label="Password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            icon={<Lock className="w-5 h-5" />}
            required
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-blue-600 hover:underline font-medium"
              >
                Register here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
