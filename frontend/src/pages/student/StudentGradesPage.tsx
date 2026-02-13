import React, { useState } from 'react';
import { Award, TrendingUp, TrendingDown, BookOpen, Download } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import Button from '../../components/common/Button';

interface StudentGrade {
  id: number;
  course: string;
  courseCode: string;
  assessment: string;
  score: number;
  maxScore: number;
  percentage: number;
  letterGrade: string;
  date: string;
  teacher: string;
  feedback?: string;
}

export const StudentGradesPage: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState('Fall 2026');

  // Mock data - in real app, fetch from API for logged-in student
  const grades: StudentGrade[] = [
    {
      id: 1,
      course: 'Mathematics',
      courseCode: 'MATH-101',
      assessment: 'Midterm Exam',
      score: 92,
      maxScore: 100,
      percentage: 92,
      letterGrade: 'A',
      date: '2026-02-10',
      teacher: 'Mr. Johnson',
      feedback: 'Excellent understanding of calculus concepts!',
    },
    {
      id: 2,
      course: 'Physics',
      courseCode: 'PHYS-201',
      assessment: 'Lab Report',
      score: 88,
      maxScore: 100,
      percentage: 88,
      letterGrade: 'B+',
      date: '2026-02-08',
      teacher: 'Dr. Smith',
      feedback: 'Good analysis, but could improve on conclusions.',
    },
    {
      id: 3,
      course: 'English',
      courseCode: 'ENG-101',
      assessment: 'Essay',
      score: 85,
      maxScore: 100,
      percentage: 85,
      letterGrade: 'B',
      date: '2026-02-05',
      teacher: 'Ms. Davis',
    },
    {
      id: 4,
      course: 'Chemistry',
      courseCode: 'CHEM-101',
      assessment: 'Quiz 1',
      score: 95,
      maxScore: 100,
      percentage: 95,
      letterGrade: 'A',
      date: '2026-02-03',
      teacher: 'Dr. Wilson',
      feedback: 'Perfect score! Keep it up!',
    },
    {
      id: 5,
      course: 'History',
      courseCode: 'HIST-101',
      assessment: 'Essay',
      score: 78,
      maxScore: 100,
      percentage: 78,
      letterGrade: 'C+',
      date: '2026-01-28',
      teacher: 'Mr. Brown',
      feedback: 'Needs more historical context and sources.',
    },
  ];

  const courseAverages = [
    { course: 'Mathematics', code: 'MATH-101', average: 90, trend: 'up' },
    { course: 'Physics', code: 'PHYS-201', average: 86, trend: 'up' },
    { course: 'English', code: 'ENG-101', average: 84, trend: 'down' },
    { course: 'Chemistry', code: 'CHEM-101', average: 92, trend: 'up' },
    { course: 'History', code: 'HIST-101', average: 75, trend: 'down' },
    { course: 'Computer Science', code: 'CS-101', average: 88, trend: 'up' },
  ];

  const overallAverage = courseAverages.reduce((sum, course) => sum + course.average, 0) / courseAverages.length;
  const highestGrade = Math.max(...courseAverages.map(c => c.average));
  const lowestGrade = Math.min(...courseAverages.map(c => c.average));

  const getLetterGrade = (percentage: number): string => {
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 67) return 'D+';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  return (
    <Layout user={{ firstName: 'John', lastName: 'Doe', email: 'john.doe@student.com', role: 'STUDENT' }}>
      <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-yellow-50 min-h-screen">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                My Grades
              </h1>
              <p className="text-gray-600 mt-2 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Track your academic performance
              </p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Fall 2026</option>
                <option>Spring 2026</option>
                <option>Fall 2025</option>
              </select>
              <Button variant="outline" icon={<Download className="w-4 h-4" />}>
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/90 text-sm font-medium">Overall Average</p>
              <div className="bg-white/20 p-3 rounded-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{overallAverage.toFixed(1)}%</p>
            <p className="text-sm text-white/80 mt-2">{getLetterGrade(overallAverage)}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/90 text-sm font-medium">Highest Grade</p>
              <div className="bg-white/20 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{highestGrade}%</p>
            <p className="text-sm text-white/80 mt-2">{getLetterGrade(highestGrade)}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/90 text-sm font-medium">Lowest Grade</p>
              <div className="bg-white/20 p-3 rounded-lg">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{lowestGrade}%</p>
            <p className="text-sm text-white/80 mt-2">{getLetterGrade(lowestGrade)}</p>
          </div>
        </div>

        {/* Course Averages */}
        <Card className="hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Course Averages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courseAverages.map((course) => (
                <div key={course.code} className="p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border border-gray-200 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{course.course}</p>
                      <p className="text-xs text-gray-500">{course.code}</p>
                    </div>
                    {course.trend === 'up' ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-blue-600">{course.average}%</p>
                    <p className="text-sm text-gray-600">{getLetterGrade(course.average)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Grades */}
        <Card className="hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle>Recent Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {grades.map((grade) => (
                <div key={grade.id} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold text-gray-900 text-lg">{grade.course}</p>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {grade.courseCode}
                        </span>
                      </div>
                      <p className="text-gray-700 font-medium">{grade.assessment}</p>
                      <p className="text-sm text-gray-500 mt-1">Teacher: {grade.teacher}</p>
                      <p className="text-xs text-gray-400 mt-1">{grade.date}</p>
                      {grade.feedback && (
                        <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Feedback:</span> {grade.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className={`text-3xl font-bold ${
                        grade.percentage >= 90 ? 'text-green-600' :
                        grade.percentage >= 80 ? 'text-blue-600' :
                        grade.percentage >= 70 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {grade.percentage}%
                      </div>
                      <p className="text-lg font-semibold text-gray-700 mt-1">{grade.letterGrade}</p>
                      <p className="text-sm text-gray-500 mt-1">{grade.score}/{grade.maxScore}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default StudentGradesPage;
