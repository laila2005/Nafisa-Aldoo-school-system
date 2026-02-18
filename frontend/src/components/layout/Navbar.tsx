import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell, User } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import LanguageSwitcher from './LanguageSwitcher';
import SchoolSwitcher from './SchoolSwitcher';
import SubscriptionBadge from '../school/SubscriptionBadge';

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
    <nav className="fixed top-0 left-64 right-0 bg-white shadow-md z-30 transition-all duration-300 max-w-[calc(100%-16rem)] rtl:left-0 rtl:right-64 rtl:max-w-[calc(100%-16rem)]">
      <div className="px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Left: School Info */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-gray-900 truncate text-right rtl:text-left">{school?.name}</h2>
            <SubscriptionBadge />
          </div>
        </div>

        {/* Center: School Switcher - Hidden on mobile */}
        <div className="hidden md:block">
          <SchoolSwitcher />
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0 rtl:flex-row-reverse">
          <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <LanguageSwitcher />

          {user && (
            <div className="flex items-center gap-3 pl-3 sm:pl-6 border-l border-gray-200 rtl:border-r rtl:border-l-0 rtl:pl-0 rtl:pr-3 sm:rtl:pr-6">
              <div className="text-right rtl:text-left min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <div className="flex items-center gap-2 rtl:flex-row-reverse">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
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
