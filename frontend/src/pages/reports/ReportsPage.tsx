import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, Calendar, TrendingUp, Users, BookOpen, BarChart3, PieChart, Filter } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Button from '../../components/common/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';

interface Report {
  id: number;
  title: string;
  description: string;
  type: 'attendance' | 'grades' | 'enrollment' | 'performance';
  icon: React.ElementType;
  color: string;
  lastGenerated?: string;
}

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');

  const reportTypes: Report[] = [
    {
      id: 1,
      title: 'Attendance Report',
      description: 'View and download attendance statistics for all students',
      type: 'attendance',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      lastGenerated: '2 days ago',
    },
    {
      id: 2,
      title: 'Grades Report',
      description: 'Comprehensive grades and performance analysis',
      type: 'grades',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      lastGenerated: '1 week ago',
    },
    {
      id: 3,
      title: 'Enrollment Report',
      description: 'Student enrollment trends and statistics',
      type: 'enrollment',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      lastGenerated: '3 days ago',
    },
    {
      id: 4,
      title: 'Course Performance',
      description: 'Analyze course completion and success rates',
      type: 'performance',
      icon: BookOpen,
      color: 'from-orange-500 to-orange-600',
      lastGenerated: '5 days ago',
    },
  ];

  const recentReports = [
    {
      name: 'Monthly Attendance - January 2026',
      date: '2 days ago',
      format: 'PDF',
      size: '2.4 MB',
    },
    {
      name: 'Grade Distribution - Fall Semester',
      date: '1 week ago',
      format: 'Excel',
      size: '1.8 MB',
    },
    {
      name: 'Enrollment Trends - 2025',
      date: '2 weeks ago',
      format: 'PDF',
      size: '3.1 MB',
    },
  ];

  const handleGenerateReport = (reportType: string) => {
    // TODO: Implement report generation logic
    alert(`Generating ${reportType} report for ${selectedPeriod}`);
  };

  return (
    <Layout user={{ firstName: 'Admin', lastName: 'User', role: 'ADMIN', email: 'admin@school.com' }}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Reports & Analytics
          </h1>
          <p className="text-gray-600">Generate and download comprehensive school reports</p>
        </div>

        {/* Period Selector */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-700">Report Period:</span>
              </div>
              <div className="flex gap-2">
                {[
                  { value: 'this-week', label: 'This Week' },
                  { value: 'this-month', label: 'This Month' },
                  { value: 'this-quarter', label: 'This Quarter' },
                  { value: 'this-year', label: 'This Year' },
                  { value: 'custom', label: 'Custom' },
                ].map((period) => (
                  <button
                    key={period.value}
                    onClick={() => setSelectedPeriod(period.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedPeriod === period.value
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-400'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <Card key={report.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${report.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{report.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                  {report.lastGenerated && (
                    <p className="text-xs text-gray-500 mb-4">
                      Last generated: {report.lastGenerated}
                    </p>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => handleGenerateReport(report.title)}
                    icon={<BarChart3 className="w-4 h-4" />}
                  >
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Reports */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Recent Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentReports.map((report, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg border border-gray-200 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{report.name}</h4>
                          <p className="text-xs text-gray-600">
                            {report.format} • {report.size} • Generated {report.date}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Download className="w-4 h-4" />}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-blue-600" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <p className="text-sm text-blue-700 font-medium mb-1">Total Reports</p>
                    <p className="text-2xl font-bold text-blue-900">24</p>
                    <p className="text-xs text-blue-600 mt-1">This month</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <p className="text-sm text-green-700 font-medium mb-1">Downloads</p>
                    <p className="text-2xl font-bold text-green-900">156</p>
                    <p className="text-xs text-green-600 mt-1">Last 30 days</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <p className="text-sm text-purple-700 font-medium mb-1">Avg. Time</p>
                    <p className="text-2xl font-bold text-purple-900">2.3s</p>
                    <p className="text-xs text-purple-600 mt-1">Generation time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportsPage;
