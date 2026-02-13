import React, { useState } from 'react';
import { Users, Settings, CreditCard, BarChart3, Palette } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { useSchool } from '../../context/SchoolContext';
import FeatureGate from '../../components/school/FeatureGate';

type AdminTab = 'users' | 'settings' | 'billing' | 'analytics' | 'branding';

export const AdminPanel: React.FC = () => {
  const { school } = useSchool();
  const [activeTab, setActiveTab] = useState<AdminTab>('users');

  const tabs = [
    { id: 'users' as AdminTab, label: 'Users', icon: Users },
    { id: 'settings' as AdminTab, label: 'Settings', icon: Settings },
    { id: 'billing' as AdminTab, label: 'Billing', icon: CreditCard },
    { id: 'branding' as AdminTab, label: 'Branding', icon: Palette },
    { id: 'analytics' as AdminTab, label: 'Analytics', icon: BarChart3 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UsersTab />;
      case 'settings':
        return <SettingsTab />;
      case 'billing':
        return (
          <FeatureGate feature="billing">
            <BillingTab />
          </FeatureGate>
        );
      case 'branding':
        return <BrandingTab />;
      case 'analytics':
        return (
          <FeatureGate feature="analytics">
            <AnalyticsTab />
          </FeatureGate>
        );
      default:
        return null;
    }
  };

  return (
    <Layout user={{ firstName: 'Admin', lastName: 'User', role: 'ADMIN', email: 'admin@school.com' }}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-2">
            Manage your school: {school?.name}
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="mt-6">{renderContent()}</div>
      </div>
    </Layout>
  );
};

// Tab Components
const UsersTab = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-bold mb-4">User Management</h2>
    <p className="text-gray-600">Manage your school's users, teachers, students, and staff.</p>
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">Total Users</p>
          <p className="text-2xl font-bold text-blue-900 mt-2">485</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-600 font-medium">Teachers</p>
          <p className="text-2xl font-bold text-green-900 mt-2">35</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-600 font-medium">Students</p>
          <p className="text-2xl font-bold text-purple-900 mt-2">450</p>
        </div>
      </div>
    </div>
  </div>
);

const SettingsTab = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-bold mb-4">School Settings</h2>
    <p className="text-gray-600">Configure your school's general settings and preferences.</p>
  </div>
);

const BillingTab = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-bold mb-4">Billing & Subscription</h2>
    <p className="text-gray-600">Manage your subscription, billing, and payment methods.</p>
    
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {['FREE', 'BASIC', 'PREMIUM'].map((plan) => (
        <div key={plan} className="border-2 border-gray-200 rounded-lg p-6">
          <h3 className="font-bold text-lg">{plan}</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            ${plan === 'FREE' ? 0 : plan === 'BASIC' ? 49 : 199}
          </p>
          <p className="text-sm text-gray-500 mt-1">per month</p>
          <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Select Plan
          </button>
        </div>
      ))}
    </div>
  </div>
);

const BrandingTab = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-bold mb-4">School Branding</h2>
    <p className="text-gray-600 mb-6">Customize your school's logo, colors, and appearance.</p>
    
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">School Logo</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-600">Click to upload logo or drag and drop</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
          <input type="color" className="w-full h-10 rounded" defaultValue="#1e40af" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
          <input type="color" className="w-full h-10 rounded" defaultValue="#64748b" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
          <input type="color" className="w-full h-10 rounded" defaultValue="#f59e0b" />
        </div>
      </div>
    </div>
  </div>
);

const AnalyticsTab = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-bold mb-4">Analytics & Reports</h2>
    <p className="text-gray-600">View detailed analytics about your school's performance.</p>
  </div>
);

export default AdminPanel;
