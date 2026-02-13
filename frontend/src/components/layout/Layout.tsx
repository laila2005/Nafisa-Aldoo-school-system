import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  user?: {
    firstName: string;
    lastName: string;
    role: string;
    email: string;
  };
}

export const Layout: React.FC<LayoutProps> = ({ children, user }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole={user?.role} />
      <Navbar user={user} />
      
      <main className="ml-64 mt-[73px] p-8 rtl:ml-0 rtl:mr-64">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
