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
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/25 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  {school.logo ? (
                    <img
                      src={school.logo}
                      alt={school.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-white">{school.name}</p>
                    <p className="text-sm text-blue-200">{school.code}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            School Management System
          </h1>
          <p className="text-blue-200">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-sm font-medium text-blue-200">
              Email
              <span className="text-red-400 ml-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-white/15"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-blue-200">
              Password
              <span className="text-red-400 ml-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-white/15"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-blue-200">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-blue-400 hover:text-blue-300 font-medium underline underline-offset-2 transition-colors"
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
