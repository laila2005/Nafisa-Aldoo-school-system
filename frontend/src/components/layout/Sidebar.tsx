import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  GraduationCap,
  MessageSquare,
  FileText,
  BarChart3,
  Settings as SettingsIcon,
  UserCog,
  Award,
  Clock,
} from 'lucide-react';
import SchoolBranding from '../school/SchoolBranding';

interface SidebarProps {
  userRole?: string;
}

const adminMenuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'TEACHER'] },
  { path: '/students', label: 'Students', icon: Users, roles: ['ADMIN', 'TEACHER'] },
  { path: '/teachers', label: 'Teachers', icon: GraduationCap, roles: ['ADMIN'] },
  { path: '/courses', label: 'Courses', icon: BookOpen, roles: ['ADMIN', 'TEACHER'] },
  { path: '/attendance', label: 'Attendance', icon: Calendar, roles: ['ADMIN', 'TEACHER'] },
  { path: '/grades', label: 'Grades', icon: FileText, roles: ['ADMIN', 'TEACHER'] },
  { path: '/messages', label: 'Messages', icon: MessageSquare, roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
  { path: '/reports', label: 'Reports', icon: BarChart3, roles: ['ADMIN', 'TEACHER'] },
  { path: '/settings', label: 'Settings', icon: SettingsIcon, roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
  { path: '/admin', label: 'Admin Panel', icon: UserCog, roles: ['ADMIN'] },
];

const studentMenuItems = [
  { path: '/student/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
  { path: '/student/courses', label: 'My Courses', icon: BookOpen },
  { path: '/student/grades', label: 'My Grades', icon: Award },
  { path: '/student/attendance', label: 'My Attendance', icon: Clock },
  { path: '/student/assignments', label: 'Assignments', icon: FileText },
  { path: '/messages', label: 'Messages', icon: MessageSquare },
  { path: '/settings', label: 'Settings', icon: SettingsIcon },
];

export const Sidebar: React.FC<SidebarProps> = ({ userRole = 'ADMIN' }) => {
  const location = useLocation();

  // Determine which menu items to show based on role
  const menuItems = userRole === 'STUDENT' ? studentMenuItems : adminMenuItems.filter(
    item => !item.roles || item.roles.includes(userRole)
  );

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-40">
      <div className="p-6 border-b border-gray-200">
        <SchoolBranding />
      </div>

      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Role Badge */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <p className="text-xs text-gray-600 font-medium">Logged in as</p>
          <p className="text-sm font-bold text-blue-600">{userRole}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
