import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { useSchool } from '../../context/SchoolContext';
import SubscriptionBadge from '../../components/school/SubscriptionBadge';
import FeatureGate from '../../components/school/FeatureGate';
import Loading from '../../components/common/Loading';

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  activeCourses: number;
  averageAttendance: number;
  storageUsed: number;
}

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { school } = useSchool();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    // Simulate fetching stats
    const fetchStats = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const mockStats: DashboardStats = {
        totalStudents: 450,
        totalTeachers: 35,
        activeCourses: 25,
        averageAttendance: 92,
        storageUsed: 45,
      };

      setStats(mockStats);

      // Check for alerts
      const newAlerts: string[] = [];
      if (mockStats.totalStudents >= (school?.maxStudents || 0) * 0.9) {
        newAlerts.push('⚠️ You are approaching your student limit. Consider upgrading your plan.');
      }
      if (mockStats.storageUsed >= (school?.maxStorage || 0) * 0.9) {
        newAlerts.push('⚠️ Storage is almost full. Please upgrade or clean up old files.');
      }
      if (school?.subscriptionStatus === 'TRIAL') {
        newAlerts.push('📅 Your trial ends in 7 days. Upgrade now to continue using all features.');
      }
      setAlerts(newAlerts);
      setIsLoading(false);
    };

    if (school) {
      fetchStats();
    }
  }, [school]);

  if (isLoading) return <Layout><Loading /></Layout>;

  const statCards = [
    {
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      max: school?.maxStudents,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Teachers',
      value: stats?.totalTeachers || 0,
      max: school?.maxTeachers,
      icon: BookOpen,
      color: 'bg-green-500',
    },
    {
      title: 'Active Courses',
      value: stats?.activeCourses || 0,
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      title: 'Avg. Attendance',
      value: `${stats?.averageAttendance || 0}%`,
      icon: Calendar,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <Layout user={{ firstName: 'Admin', lastName: 'User', role: 'ADMIN', email: 'admin@school.com' }}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-cyan-50 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Welcome to {school?.name}
              </h1>
              <p className="text-gray-600 mt-2">Here's what's happening today</p>
            </div>
            <SubscriptionBadge />
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl shadow-sm flex items-start gap-3 transform hover:scale-[1.02] transition-all"
              >
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800 font-medium">{alert}</p>
              </div>
            ))}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            const percentage = card.max ? ((card.value as number) / card.max) * 100 : 0;
            
            const gradients = [
              'bg-gradient-to-br from-blue-500 to-blue-600',
              'bg-gradient-to-br from-green-500 to-green-600',
              'bg-gradient-to-br from-purple-500 to-purple-600',
              'bg-gradient-to-br from-yellow-500 to-yellow-600',
            ];

            return (
              <div key={index} className={`${gradients[index]} rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300`}>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-white/90 text-sm font-medium">{card.title}</p>
                  <div className="bg-white/20 p-3 rounded-lg">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">{card.value}</p>
                {card.max && (
                  <>
                    <p className="text-xs text-white/80 mt-2">
                      of {card.max} max
                    </p>
                    <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          percentage > 90 ? 'bg-red-400' : percentage > 75 ? 'bg-yellow-400' : 'bg-white'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Feature-gated sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FeatureGate feature="analytics">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                📊 Analytics Overview
              </h2>
              <p className="text-gray-600">Advanced analytics and insights will appear here.</p>
            </div>
          </FeatureGate>

          <FeatureGate feature="reports">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-lg font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-4">
                📈 Recent Reports
              </h2>
              <p className="text-gray-600">Your generated reports will appear here.</p>
            </div>
          </FeatureGate>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">⚡ Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => navigate('/students')}
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 transition-all transform hover:scale-105 hover:shadow-md group"
            >
              <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Add New Student</p>
              <p className="text-sm text-gray-600 mt-1">Register a new student</p>
            </button>
            <button 
              onClick={() => navigate('/courses')}
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100 transition-all transform hover:scale-105 hover:shadow-md group"
            >
              <p className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">Create Course</p>
              <p className="text-sm text-gray-600 mt-1">Set up a new course</p>
            </button>
            <button 
              onClick={() => navigate('/attendance')}
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-100 transition-all transform hover:scale-105 hover:shadow-md group"
            >
              <p className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Record Attendance</p>
              <p className="text-sm text-gray-600 mt-1">Mark today's attendance</p>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
