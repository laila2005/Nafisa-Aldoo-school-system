import React, { useState } from 'react';
import { Calendar as CalendarIcon, CheckCircle, XCircle, Clock, Download, Users, TrendingUp } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

interface AttendanceRecord {
  studentId: number;
  studentName: string;
  grade: string;
  status: 'present' | 'absent' | 'late' | 'excused';
}

const mockStudentsForAttendance: AttendanceRecord[] = [
  { studentId: 1, studentName: 'Ahmed Hassan', grade: 'Grade 10', status: 'present' },
  { studentId: 2, studentName: 'Fatima Ali', grade: 'Grade 9', status: 'present' },
  { studentId: 3, studentName: 'Omar Ibrahim', grade: 'Grade 11', status: 'absent' },
];

export const AttendancePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockStudentsForAttendance);

  const updateAttendance = (studentId: number, status: AttendanceRecord['status']) => {
    setAttendance(attendance.map(record =>
      record.studentId === studentId ? { ...record, status } : record
    ));
  };

  const stats = {
    present: attendance.filter(r => r.status === 'present').length,
    absent: attendance.filter(r => r.status === 'absent').length,
    late: attendance.filter(r => r.status === 'late').length,
    excused: attendance.filter(r => r.status === 'excused').length,
    total: attendance.length,
  };

  return (
    <Layout user={{ firstName: 'Admin', lastName: 'User', email: 'admin@school.com', role: 'ADMIN' }}>
      <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-indigo-50 min-h-screen">
      <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Attendance</h1>
          <p className="text-gray-600 mt-2 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Track and manage student attendance
          </p>
        </div>
        <Button variant="outline" icon={<Download className="w-5 h-5" />}>
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-medium text-gray-100">Total Students</h3>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </div>
            <div className="bg-white/20 p-2 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-medium text-green-100">Present</h3>
              <p className="text-2xl font-bold mt-1">{stats.present}</p>
            </div>
            <div className="bg-white/20 p-2 rounded-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-medium text-red-100">Absent</h3>
              <p className="text-2xl font-bold mt-1">{stats.absent}</p>
            </div>
            <div className="bg-white/20 p-2 rounded-lg">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-medium text-yellow-100">Late</h3>
              <p className="text-2xl font-bold mt-1">{stats.late}</p>
            </div>
            <div className="bg-white/20 p-2 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-medium text-blue-100">Attendance Rate</h3>
              <p className="text-2xl font-bold mt-1">
                {Math.round((stats.present / stats.total) * 100)}%
              </p>
            </div>
            <div className="bg-white/20 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Take Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Input
              label="Date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              icon={<CalendarIcon className="w-5 h-5" />}
              fullWidth={false}
            />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course/Class
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Students</option>
                <option value="math">Mathematics - Grade 10</option>
                <option value="english">English - Grade 9</option>
                <option value="science">Science - Grade 11</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {attendance.map((record) => (
              <div
                key={record.studentId}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">{record.studentName}</p>
                  <p className="text-sm text-gray-600">{record.grade}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateAttendance(record.studentId, 'present')}
                    className={`p-2 rounded-lg transition-colors ${
                      record.status === 'present'
                        ? 'bg-green-100 text-green-700'
                        : 'hover:bg-green-50 text-gray-400'
                    }`}
                    title="Present"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => updateAttendance(record.studentId, 'absent')}
                    className={`p-2 rounded-lg transition-colors ${
                      record.status === 'absent'
                        ? 'bg-red-100 text-red-700'
                        : 'hover:bg-red-50 text-gray-400'
                    }`}
                    title="Absent"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => updateAttendance(record.studentId, 'late')}
                    className={`p-2 rounded-lg transition-colors ${
                      record.status === 'late'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'hover:bg-yellow-50 text-gray-400'
                    }`}
                    title="Late"
                  >
                    <Clock className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => updateAttendance(record.studentId, 'excused')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      record.status === 'excused'
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-blue-50 text-gray-600'
                    }`}
                  >
                    Excused
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline">
              Reset
            </Button>
            <Button variant="primary">
              Save Attendance
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </Layout>
  );
};

export default AttendancePage;
