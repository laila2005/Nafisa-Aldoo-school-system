import React from 'react';
import { BookOpen, Calendar, Award, TrendingUp, Clock, Bell } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';

interface StudentStats {
  totalCourses: number;
  averageGrade: number;
  attendanceRate: number;
  pendingAssignments: number;
}

export const StudentDashboard: React.FC = () => {
  // Mock student data - in real app, fetch from API based on logged-in student
  const stats: StudentStats = {
    totalCourses: 6,
    averageGrade: 87.5,
    attendanceRate: 94,
    pendingAssignments: 3,
  };

  const recentGrades = [
    { course: 'Mathematics', assessment: 'Midterm Exam', grade: 92, date: '2026-02-10' },
    { course: 'Physics', assessment: 'Lab Report', grade: 88, date: '2026-02-08' },
    { course: 'English', assessment: 'Essay', grade: 85, date: '2026-02-05' },
  ];

  const upcomingAssignments = [
    { course: 'Chemistry', title: 'Chapter 5 Quiz', dueDate: '2026-02-15', status: 'pending' },
    { course: 'History', title: 'Research Paper', dueDate: '2026-02-18', status: 'pending' },
    { course: 'Mathematics', title: 'Problem Set 8', dueDate: '2026-02-20', status: 'pending' },
  ];

  const todaySchedule = [
    { time: '08:00 AM', course: 'Mathematics', room: 'Room 101', teacher: 'Mr. Johnson' },
    { time: '09:30 AM', course: 'Physics', room: 'Lab 2', teacher: 'Dr. Smith' },
    { time: '11:00 AM', course: 'English', room: 'Room 205', teacher: 'Ms. Davis' },
    { time: '01:00 PM', course: 'Chemistry', room: 'Lab 1', teacher: 'Dr. Wilson' },
  ];

  return (
    <Layout user={{ firstName: 'John', lastName: 'Doe', email: 'john.doe@student.com', role: 'STUDENT' }}>
      <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Student Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Welcome back, John! Here's your overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/90 text-sm font-medium">My Courses</p>
              <div className="bg-white/20 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalCourses}</p>
            <p className="text-xs text-white/80 mt-2">Active this semester</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/90 text-sm font-medium">Average Grade</p>
              <div className="bg-white/20 p-3 rounded-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{stats.averageGrade}%</p>
            <p className="text-xs text-white/80 mt-2">Keep up the good work!</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/90 text-sm font-medium">Attendance</p>
              <div className="bg-white/20 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{stats.attendanceRate}%</p>
            <p className="text-xs text-white/80 mt-2">Excellent attendance</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/90 text-sm font-medium">Pending Tasks</p>
              <div className="bg-white/20 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{stats.pendingAssignments}</p>
            <p className="text-xs text-white/80 mt-2">Assignments due soon</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Grades */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Recent Grades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentGrades.map((grade, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="font-semibold text-gray-900">{grade.course}</p>
                      <p className="text-sm text-gray-600">{grade.assessment}</p>
                      <p className="text-xs text-gray-500">{grade.date}</p>
                    </div>
                    <div className={`text-2xl font-bold ${
                      grade.grade >= 90 ? 'text-green-600' : 
                      grade.grade >= 80 ? 'text-blue-600' : 
                      'text-yellow-600'
                    }`}>
                      {grade.grade}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Assignments */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-600" />
                Upcoming Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAssignments.map((assignment, index) => (
                  <div key={index} className="p-3 border-l-4 border-yellow-500 bg-yellow-50 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{assignment.title}</p>
                        <p className="text-sm text-gray-600">{assignment.course}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">Due: {assignment.dueDate}</p>
                        <span className="inline-block mt-1 px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full">
                          Pending
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule */}
        <Card className="hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {todaySchedule.map((session, index) => (
                <div key={index} className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200 hover:shadow-md transition-all hover:scale-105">
                  <p className="text-lg font-bold text-blue-600">{session.time}</p>
                  <p className="font-semibold text-gray-900 mt-2">{session.course}</p>
                  <p className="text-sm text-gray-600">{session.teacher}</p>
                  <p className="text-xs text-gray-500 mt-1">{session.room}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
