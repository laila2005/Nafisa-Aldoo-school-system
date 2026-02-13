import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Eye, BookOpen, Users, Calendar, CheckCircle, TrendingUp } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { Table, Column } from '../../components/common/Table';
import { SearchBar} from '../../components/common/SearchBar';
import { Pagination } from '../../components/common/Pagination';
import { Modal, ModalActions } from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

interface Course {
  id: number;
  name: string;
  code: string;
  description: string;
  credits: number;
  teacher: string;
  grade: string;
  schedule: string;
  capacity: number;
  enrolled: number;
  status: 'active' | 'inactive' | 'completed';
}

const mockCourses: Course[] = [
  {
    id: 1,
    name: 'Advanced Mathematics',
    code: 'MATH-301',
    description: 'Advanced algebra and calculus concepts',
    credits: 4,
    teacher: 'Sarah Ali',
    grade: 'Grade 10',
    schedule: 'Mon, Wed, Fri 9:00 AM',
    capacity: 30,
    enrolled: 28,
    status: 'active',
  },
  {
    id: 2,
    name: 'English Literature',
    code: 'ENG-201',
    description: 'Study of classic and contemporary literature',
    credits: 3,
    teacher: 'Mohammed Hassan',
    grade: 'Grade 9',
    schedule: 'Tue, Thu 10:00 AM',
    capacity: 25,
    enrolled: 22,
    status: 'active',
  },
  {
    id: 3,
    name: 'General Chemistry',
    code: 'CHEM-101',
    description: 'Introduction to chemical principles',
    credits: 4,
    teacher: 'Noor Ahmed',
    grade: 'Grade 11',
    schedule: 'Mon, Wed 1:00 PM',
    capacity: 20,
    enrolled: 20,
    status: 'active',
  },
];

export const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<Partial<Course>>({});

  const filteredCourses = useMemo(() => {
    let filtered = courses.filter((course) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        course.name.toLowerCase().includes(searchLower) ||
        course.code.toLowerCase().includes(searchLower) ||
        course.teacher.toLowerCase().includes(searchLower) ||
        course.grade.toLowerCase().includes(searchLower)
      );
    });

    filtered.sort((a, b) => {
      const aValue = (a as any)[sortKey];
      const bValue = (b as any)[sortKey];
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [courses, searchQuery, sortKey, sortDirection]);

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const handleAddCourse = () => {
    const newCourse: Course = {
      ...formData as Course,
      id: Math.max(...courses.map(c => c.id)) + 1,
      status: 'active',
      enrolled: 0,
    };
    setCourses([...courses, newCourse]);
    setIsAddModalOpen(false);
    setFormData({});
  };

  const handleEditCourse = () => {
    if (!selectedCourse) return;
    setCourses(courses.map(c => 
      c.id === selectedCourse.id ? { ...c, ...formData } : c
    ));
    setIsEditModalOpen(false);
    setSelectedCourse(null);
    setFormData({});
  };

  const handleDeleteCourse = (id: number) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const openEditModal = (course: Course) => {
    setSelectedCourse(course);
    setFormData(course);
    setIsEditModalOpen(true);
  };

  const openViewModal = (course: Course) => {
    setSelectedCourse(course);
    setIsViewModalOpen(true);
  };

  const columns: Column<Course>[] = [
    {
      key: 'code',
      header: 'Code',
      sortable: true,
    },
    {
      key: 'name',
      header: 'Course Name',
      sortable: true,
    },
    {
      key: 'teacher',
      header: 'Teacher',
      sortable: true,
    },
    {
      key: 'grade',
      header: 'Grade',
      sortable: true,
    },
    {
      key: 'enrollment',
      header: 'Enrollment',
      render: (course) => (
        <div className="flex items-center gap-2">
          <span>{course.enrolled}/{course.capacity}</span>
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                (course.enrolled / course.capacity) >= 0.9
                  ? 'bg-red-500'
                  : (course.enrolled / course.capacity) >= 0.7
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${(course.enrolled / course.capacity) * 100}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (course) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            course.status === 'active'
              ? 'bg-green-100 text-green-800'
              : course.status === 'inactive'
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {course.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (course) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => openViewModal(course)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => openEditModal(course)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteCourse(course.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const CourseForm: React.FC = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Course Code"
          value={formData.code || ''}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          required
        />
        <Input
          label="Credits"
          type="number"
          value={formData.credits || ''}
          onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
          required
        />
      </div>
      <Input
        label="Course Name"
        value={formData.name || ''}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        icon={<BookOpen className="w-5 h-5" />}
        required
      />
      <Input
        label="Description"
        value={formData.description || ''}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Teacher"
          value={formData.teacher || ''}
          onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
          required
        />
        <Input
          label="Grade"
          value={formData.grade || ''}
          onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
          required
        />
      </div>
      <Input
        label="Schedule"
        value={formData.schedule || ''}
        onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
        icon={<Calendar className="w-5 h-5" />}
        hint="e.g., Mon, Wed, Fri 9:00 AM"
      />
      <Input
        label="Capacity"
        type="number"
        value={formData.capacity || ''}
        onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
        icon={<Users className="w-5 h-5" />}
        required
      />
    </div>
  );

  return (
    <Layout user={{ firstName: 'Admin', lastName: 'User', email: 'admin@school.com', role: 'ADMIN' }}>
      <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-green-50 min-h-screen">
      <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">Courses</h1>
          <p className="text-gray-600 mt-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Manage courses and curriculum
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-5 h-5" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-100">Total Courses</h3>
              <p className="text-3xl font-bold mt-2">{courses.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <BookOpen className="w-8 h-8" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-teal-100">Active Courses</h3>
              <p className="text-3xl font-bold mt-2">
                {courses.filter(c => c.status === 'active').length}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <CheckCircle className="w-8 h-8" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-100">Total Students</h3>
              <p className="text-3xl font-bold mt-2">
                {courses.reduce((sum, c) => sum + c.enrolled, 0)}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Users className="w-8 h-8" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-purple-100">Avg. Enrollment</h3>
              <p className="text-3xl font-bold mt-2">
                {Math.round(courses.reduce((sum, c) => sum + (c.enrolled / c.capacity), 0) / courses.length * 100)}%
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search courses by name, code, teacher, or grade..."
        />
      </div>

      <Table
        data={paginatedCourses}
        columns={columns}
        onSort={handleSort}
        sortKey={sortKey}
        sortDirection={sortDirection}
        emptyMessage="No courses found"
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredCourses.length}
          itemsPerPage={itemsPerPage}
        />
      )}

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Course"
        footer={
          <ModalActions>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddCourse}>
              Add Course
            </Button>
          </ModalActions>
        }
      >
        <CourseForm />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Course"
        footer={
          <ModalActions>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEditCourse}>
              Save Changes
            </Button>
          </ModalActions>
        }
      >
        <CourseForm />
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Course Details"
        size="lg"
      >
        {selectedCourse && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Course Code</label>
                <p className="text-gray-900 mt-1">{selectedCourse.code}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Credits</label>
                <p className="text-gray-900 mt-1">{selectedCourse.credits}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Course Name</label>
              <p className="text-gray-900 mt-1">{selectedCourse.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Description</label>
              <p className="text-gray-900 mt-1">{selectedCourse.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Teacher</label>
                <p className="text-gray-900 mt-1">{selectedCourse.teacher}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Grade</label>
                <p className="text-gray-900 mt-1">{selectedCourse.grade}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Schedule</label>
              <p className="text-gray-900 mt-1">{selectedCourse.schedule}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Enrollment</label>
                <p className="text-gray-900 mt-1">{selectedCourse.enrolled} / {selectedCourse.capacity}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <p className="text-gray-900 mt-1 capitalize">{selectedCourse.status}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
      </div>
    </Layout>
  );
};

export default CoursesPage;
