import React, { useState } from 'react';
import { UserCircle2, ChevronDown, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RoleSwitcherProps {
  currentRole: string;
  currentUser: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

const roleProfiles = [
  {
    role: 'ADMIN',
    name: 'Admin User',
    email: 'admin@school.com',
    path: '/dashboard',
    color: 'text-red-600 bg-red-50 border-red-200',
  },
  {
    role: 'TEACHER',
    name: 'Teacher User',
    email: 'teacher@school.com',
    path: '/dashboard',
    color: 'text-purple-600 bg-purple-50 border-purple-200',
  },
  {
    role: 'STUDENT',
    name: 'John Doe',
    email: 'john.doe@student.com',
    path: '/student/dashboard',
    color: 'text-blue-600 bg-blue-50 border-blue-200',
  },
  {
    role: 'PARENT',
    name: 'Parent User',
    email: 'parent@school.com',
    path: '/dashboard',
    color: 'text-green-600 bg-green-50 border-green-200',
  },
];

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const currentProfile = roleProfiles.find(p => p.role === currentRole) || roleProfiles[0];

  const handleRoleSwitch = (profile: typeof roleProfiles[0]) => {
    // In a real app, this would properly authenticate and switch context
    // For demo purposes, just navigate to appropriate dashboard
    navigate(profile.path);
    setIsOpen(false);
    
    // Reload to refresh the UI with new role
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 ${currentProfile.color} rounded-lg border-2 hover:shadow-md transition-all`}
      >
        <UserCircle2 className="w-5 h-5" />
        <div className="text-left">
          <p className="text-xs font-medium opacity-75">Demo Mode</p>
          <p className="text-sm font-bold">{currentProfile.role}</p>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
            <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
              <p className="text-xs font-semibold text-gray-600 uppercase">Switch User Role</p>
              <p className="text-xs text-gray-500 mt-1">Test different user permissions</p>
            </div>
            
            <div className="p-2">
              {roleProfiles.map((profile) => (
                <button
                  key={profile.role}
                  onClick={() => handleRoleSwitch(profile)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                    profile.role === currentRole
                      ? `${profile.color} border-2`
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UserCircle2 className={`w-5 h-5 ${
                      profile.role === currentRole ? '' : 'text-gray-400'
                    }`} />
                    <div className="text-left">
                      <p className="font-semibold text-sm text-gray-900">{profile.role}</p>
                      <p className="text-xs text-gray-500">{profile.name}</p>
                    </div>
                  </div>
                  {profile.role === currentRole && (
                    <Check className="w-5 h-5" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                <span className="font-semibold">Note:</span> This is a demo feature. Click any role to see how the system behaves for different users.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RoleSwitcher;
