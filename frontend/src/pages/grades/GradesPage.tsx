import React, { useState, useMemo } from 'react';
import { Plus, Edit, TrendingUp, TrendingDown, Award, FileText, CheckCircle } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { Table, Column } from '../../components/common/Table';
import { SearchBar } from '../../components/common/SearchBar';
import { Modal, ModalActions } from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

interface Grade {
  id: number;
  studentName: string;
  course: string;
  assessment: string;
  score: number;
  maxScore: number;
  percentage: number;
  letterGrade: string;
  submittedDate: string;
}

const mockGrades: Grade[] = [
  {
    id: 1,
    studentName: 'Ahmed Hassan',
    course: 'Advanced Mathematics',
    assessment: 'Midterm Exam',
    score: 85,
    maxScore: 100,
    percentage: 85,
    letterGrade: 'B',
    submittedDate: '2024-10-15',
  },
  {
    id: 2,
    studentName: 'Fatima Ali',
    course: 'English Literature',
    assessment: 'Essay Assignment',
    score: 92,
    maxScore: 100,
    percentage: 92,
    letterGrade: 'A',
    submittedDate: '2024-10-14',
  },
  {
    id: 3,
    studentName: 'Omar Ibrahim',
    course: 'General Chemistry',
    assessment: 'Lab Report',
    score: 78,
    maxScore: 100,
    percentage: 78,
    letterGrade: 'C+',
    submittedDate: '2024-10-16',
  },
];

export const GradesPage: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>(mockGrades);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [sortKey, setSortKey] = useState<string>('submittedDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [formData, setFormData] = useState<Partial<Grade>>({});

  const filteredGrades = useMemo(() => {
    let filtered = grades.filter((grade) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        grade.studentName.toLowerCase().includes(searchLower) ||
        grade.course.toLowerCase().includes(searchLower) ||
        grade.assessment.toLowerCase().includes(searchLower);
      
      const matchesCourse = selectedCourse === 'all' || grade.course === selectedCourse;
      
      return matchesSearch && matchesCourse;
    });

    filtered.sort((a, b) => {
      const aValue = (a as any)[sortKey];
      const bValue = (b as any)[sortKey];
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [grades, searchQuery, selectedCourse, sortKey, sortDirection]);

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const calculateLetterGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const handleAddGrade = () => {
    const percentage = ((formData.score || 0) / (formData.maxScore || 100)) * 100;
    const newGrade: Grade = {
      id: Math.max(...grades.map(g => g.id)) + 1,
      studentName: formData.studentName || '',
      course: formData.course || '',
      assessment: formData.assessment || '',
      score: formData.score || 0,
      maxScore: formData.maxScore || 100,
      percentage,
      letterGrade: calculateLetterGrade(percentage),
      submittedDate: formData.submittedDate || new Date().toISOString().split('T')[0],
    };
    setGrades([...grades, newGrade]);
    setIsAddModalOpen(false);
    setFormData({});
  };

  const handleEditGrade = () => {
    if (!selectedGrade) return;
    const percentage = ((formData.score || 0) / (formData.maxScore || 100)) * 100;
    setGrades(grades.map(g => 
      g.id === selectedGrade.id ? { 
        ...g, 
        ...formData,
        percentage,
        letterGrade: calculateLetterGrade(percentage),
      } : g
    ));
    setIsEditModalOpen(false);
    setSelectedGrade(null);
    setFormData({});
  };

  const openEditModal = (grade: Grade) => {
    setSelectedGrade(grade);
    setFormData(grade);
    setIsEditModalOpen(true);
  };

  const stats = {
    averageGrade: Math.round(
      grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length
    ),
    aStudents: grades.filter(g => g.letterGrade === 'A').length,
    passingRate: Math.round(
      (grades.filter(g => g.percentage >= 60).length / grades.length) * 100
    ),
  };

  const columns: Column<Grade>[] = [
    {
      key: 'studentName',
      header: 'Student',
      sortable: true,
    },
    {
      key: 'course',
      header: 'Course',
      sortable: true,
    },
    {
      key: 'assessment',
      header: 'Assessment',
      sortable: true,
    },
    {
      key: 'score',
      header: 'Score',
      sortable: true,
      render: (grade) => (
        <span className="font-medium">
          {grade.score}/{grade.maxScore}
        </span>
      ),
    },
    {
      key: 'percentage',
      header: 'Percentage',
      sortable: true,
      render: (grade) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{grade.percentage}%</span>
          {grade.percentage >= 90 ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : grade.percentage < 70 ? (
            <TrendingDown className="w-4 h-4 text-red-600" />
          ) : null}
        </div>
      ),
    },
    {
      key: 'letterGrade',
      header: 'Grade',
      sortable: true,
      render: (grade) => (
        <span
          className={`px-3 py-1 text-sm font-bold rounded-lg ${
            grade.letterGrade === 'A'
              ? 'bg-green-100 text-green-800'
              : grade.letterGrade === 'B'
              ? 'bg-blue-100 text-blue-800'
              : grade.letterGrade === 'C'
              ? 'bg-yellow-100 text-yellow-800'
              : grade.letterGrade === 'D'
              ? 'bg-orange-100 text-orange-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {grade.letterGrade}
        </span>
      ),
    },
    {
      key: 'submittedDate',
      header: 'Date',
      sortable: true,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (grade) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            openEditModal(grade);
          }}
          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
      ),
    },
  ];

  const GradeForm: React.FC = () => (
    <div className="space-y-4">
      <Input
        label="Student Name"
        value={formData.studentName || ''}
        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
        required
      />
      <Input
        label="Course"
        value={formData.course || ''}
        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
        required
      />
      <Input
        label="Assessment Name"
        value={formData.assessment || ''}
        onChange={(e) => setFormData({ ...formData, assessment: e.target.value })}
        hint="e.g., Midterm Exam, Quiz 1, Final Project"
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Score"
          type="number"
          value={formData.score || ''}
          onChange={(e) => setFormData({ ...formData, score: parseFloat(e.target.value) })}
          required
        />
        <Input
          label="Max Score"
          type="number"
          value={formData.maxScore || ''}
          onChange={(e) => setFormData({ ...formData, maxScore: parseFloat(e.target.value) })}
          required
        />
      </div>
      <Input
        label="Submitted Date"
        type="date"
        value={formData.submittedDate || ''}
        onChange={(e) => setFormData({ ...formData, submittedDate: e.target.value })}
        required
      />
    </div>
  );

  return (
    <Layout user={{ firstName: 'Admin', lastName: 'User', email: 'admin@school.com', role: 'ADMIN' }}>
      <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-yellow-50 min-h-screen">
      <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">Grades & Assessments</h1>
          <p className="text-gray-600 mt-2 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Track student performance and grades
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-5 h-5" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Grade
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-100">Average Grade</h3>
              <p className="text-3xl font-bold mt-2">{stats.averageGrade}%</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-yellow-100">A Students</h3>
              <p className="text-3xl font-bold mt-2">{stats.aStudents}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Award className="w-8 h-8" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-100">Passing Rate</h3>
              <p className="text-3xl font-bold mt-2">{stats.passingRate}%</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <CheckCircle className="w-8 h-8" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-purple-100">Total Assessments</h3>
              <p className="text-3xl font-bold mt-2">{grades.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FileText className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex items-center gap-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by student, course, or assessment..."
            className="flex-1"
          />
          <div className="w-64">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Courses</option>
              <option value="Advanced Mathematics">Advanced Mathematics</option>
              <option value="English Literature">English Literature</option>
              <option value="General Chemistry">General Chemistry</option>
            </select>
          </div>
        </div>
      </div>

      <Table
        data={filteredGrades}
        columns={columns}
        onSort={handleSort}
        sortKey={sortKey}
        sortDirection={sortDirection}
        emptyMessage="No grades found"
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Grade"
        footer={
          <ModalActions>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddGrade}>
              Add Grade
            </Button>
          </ModalActions>
        }
      >
        <GradeForm />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Grade"
        footer={
          <ModalActions>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEditGrade}>
              Save Changes
            </Button>
          </ModalActions>
        }
      >
        <GradeForm />
      </Modal>
      </div>
    </Layout>
  );
};

export default GradesPage;
