import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell, User } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import LanguageSwitcher from './LanguageSwitcher';
import SchoolSwitcher from './SchoolSwitcher';
import SubscriptionBadge from '../school/SubscriptionBadge';
import RoleSwitcher from '../common/RoleSwitcher';

interface NavbarProps {
  user?: {
    firstName: string;
    lastName: string;
    role: string;
    email: string;
  };
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { school } = useSchool();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    localStorage.removeItem('token');
    localStorage.removeItem('currentSchool');
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-64 right-0 bg-white shadow-md z-30 rtl:left-0 rtl:right-64">
      <div className="px-6 py-4 flex justify-between items-center">
        {/* Left: School Info */}
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{school?.name}</h2>
            <SubscriptionBadge />
          </div>
        </div>

        {/* Center: School Switcher */}
        <SchoolSwitcher />

        {/* Right: Controls */}
        <div className="flex items-center gap-6">
          {/* Role Switcher for Demo */}
          {user && <RoleSwitcher currentRole={user.role} currentUser={user} />}

          <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <LanguageSwitcher />

          {user && (
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <div className="text-right rtl:text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="p-2 text-red-600 hover:text-red-900 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
