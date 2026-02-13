import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';
import Loading from '../common/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requireSchool?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  requireSchool = true,
}) => {
  const { school, isLoading: schoolLoading } = useSchool();
  const location = useLocation();

  // Check if user is authenticated (has token)
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  // Check user role from localStorage or context
  const userDataStr = localStorage.getItem('user');
  const user = userDataStr ? JSON.parse(userDataStr) : null;

  // Show loading while checking school context
  if (schoolLoading) {
    return <Loading text="Loading..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location  }} replace />;
  }

  // Redirect to school selection if school is required but not set
  if (requireSchool && !school) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.includes(user.role);
    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
            <p className="text-xl text-gray-600 mb-8">Access Denied</p>
            <p className="text-gray-500 mb-8">
              You don't have permission to access this page.
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
