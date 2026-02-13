import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Eye, Mail, Phone, Calendar, Users, CheckCircle, XCircle, GraduationCap } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { Table, Column } from '../../components/common/Table';
import { SearchBar } from '../../components/common/SearchBar';
import { Pagination } from '../../components/common/Pagination';
import { Modal, ModalActions } from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  grade: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated';
  parentName: string;
  parentPhone: string;
}

// Mock data
const mockStudents: Student[] = [
  {
    id: 1,
    firstName: 'Ahmed',
    lastName: 'Hassan',
    email: 'ahmed.hassan@email.com',
    phone: '+966 50 123 4567',
    grade: 'Grade 10',
    enrollmentDate: '2024-09-01',
    status: 'active',
    parentName: 'Mohammed Hassan',
    parentPhone: '+966 50 111 2222',
  },
  {
    id: 2,
    firstName: 'Fatima',
    lastName: 'Ali',
    email: 'fatima.ali@email.com',
    phone: '+966 50 234 5678',
    grade: 'Grade 9',
    enrollmentDate: '2024-09-01',
    status: 'active',
    parentName: 'Ali Ahmed',
    parentPhone: '+966 50 222 3333',
  },
  {
    id: 3,
    firstName: 'Omar',
    lastName: 'Ibrahim',
    email: 'omar.ibrahim@email.com',
    phone: '+966 50 345 6789',
    grade: 'Grade 11',
    enrollmentDate: '2023-09-01',
    status: 'active',
    parentName: 'Ibrahim Mohammed',
    parentPhone: '+966 50 333 4444',
  },
];

export const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<string>('lastName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Partial<Student>>({});

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    let filtered = students.filter((student) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        student.firstName.toLowerCase().includes(searchLower) ||
        student.lastName.toLowerCase().includes(searchLower) ||
        student.email.toLowerCase().includes(searchLower) ||
        student.grade.toLowerCase().includes(searchLower)
      );
    });

    // Sort
    filtered.sort((a, b) => {
      const aValue = (a as any)[sortKey];
      const bValue = (b as any)[sortKey];
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [students, searchQuery, sortKey, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const handleAddStudent = () => {
    const newStudent: Student = {
      id: Math.max(...students.map(s => s.id)) + 1,
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      email: formData.email || '',
      phone: formData.phone || '',
      grade: formData.grade || '',
      enrollmentDate: formData.enrollmentDate || new Date().toISOString().split('T')[0],
      status: 'active',
      parentName: formData.parentName || '',
      parentPhone: formData.parentPhone || '',
    };
    setStudents([...students, newStudent]);
    setIsAddModalOpen(false);
    setFormData({});
  };

  const handleEditStudent = () => {
    if (!selectedStudent) return;
    setStudents(students.map(s => 
      s.id === selectedStudent.id ? { ...s, ...formData } : s
    ));
    setIsEditModalOpen(false);
    setSelectedStudent(null);
    setFormData({});
  };

  const handleDeleteStudent = (id: number) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const openEditModal = (student: Student) => {
    setSelectedStudent(student);
    setFormData(student);
    setIsEditModalOpen(true);
  };

  const openViewModal = (student: Student) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };

  const columns: Column<Student>[] = [
    {
      key: 'firstName',
      header: 'First Name',
      sortable: true,
    },
    {
      key: 'lastName',
      header: 'Last Name',
      sortable: true,
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
    },
    {
      key: 'grade',
      header: 'Grade',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (student) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            student.status === 'active'
              ? 'bg-green-100 text-green-800'
              : student.status === 'inactive'
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {student.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (student) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => openViewModal(student)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => openEditModal(student)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteStudent(student.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const StudentForm: React.FC = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={formData.firstName || ''}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          required
        />
        <Input
          label="Last Name"
          value={formData.lastName || ''}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          required
        />
      </div>
      <Input
        label="Email"
        type="email"
        value={formData.email || ''}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        icon={<Mail className="w-5 h-5" />}
        required
      />
      <Input
        label="Phone"
        type="tel"
        value={formData.phone || ''}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        icon={<Phone className="w-5 h-5" />}
      />
      <Input
        label="Grade"
        value={formData.grade || ''}
        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
        required
      />
      <Input
        label="Enrollment Date"
        type="date"
        value={formData.enrollmentDate || ''}
        onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
        icon={<Calendar className="w-5 h-5" />}
        required
      />
      <div className="border-t pt-4">
        <h4 className="font-semibold mb-4">Parent Information</h4>
        <Input
          label="Parent Name"
          value={formData.parentName || ''}
          onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
        />
        <Input
          label="Parent Phone"
          type="tel"
          value={formData.parentPhone || ''}
          onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
          icon={<Phone className="w-5 h-5" />}
        />
      </div>
    </div>
  );

  return (
    <Layout user={{ firstName: 'Admin', lastName: 'User', email: 'admin@school.com', role: 'ADMIN' }}>
      <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Students</h1>
          <p className="text-gray-600 mt-2 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Manage student records and information
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-5 h-5" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Student
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-100">Total Students</h3>
              <p className="text-3xl font-bold mt-2">{students.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Users className="w-8 h-8" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-100">Active</h3>
              <p className="text-3xl font-bold mt-2">
                {students.filter(s => s.status === 'active').length}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <CheckCircle className="w-8 h-8" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-100">Inactive</h3>
              <p className="text-3xl font-bold mt-2">
                {students.filter(s => s.status === 'inactive').length}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <XCircle className="w-8 h-8" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-purple-100">Graduated</h3>
              <p className="text-3xl font-bold mt-2">
                {students.filter(s => s.status === 'graduated').length}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <GraduationCap className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search students by name, email, or grade..."
          className="w-full"
        />
      </div>

      {/* Table */}
      <Table
        data={paginatedStudents}
        columns={columns}
        onSort={handleSort}
        sortKey={sortKey}
        sortDirection={sortDirection}
        emptyMessage="No students found"
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredStudents.length}
          itemsPerPage={itemsPerPage}
        />
      )}

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Student"
        description="Enter student information to create a new record"
        footer={
          <ModalActions>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddStudent}>
              Add Student
            </Button>
          </ModalActions>
        }
      >
        <StudentForm />
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Student"
        description="Update student information"
        footer={
          <ModalActions>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEditStudent}>
              Save Changes
            </Button>
          </ModalActions>
        }
      >
        <StudentForm />
      </Modal>

      {/* View Student Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Student Details"
        size="lg"
      >
        {selectedStudent && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">First Name</label>
                <p className="text-gray-900 mt-1">{selectedStudent.firstName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Last Name</label>
                <p className="text-gray-900 mt-1">{selectedStudent.lastName}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-900 mt-1">{selectedStudent.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="text-gray-900 mt-1">{selectedStudent.phone}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Grade</label>
                <p className="text-gray-900 mt-1">{selectedStudent.grade}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <p className="text-gray-900 mt-1 capitalize">{selectedStudent.status}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Enrollment Date</label>
              <p className="text-gray-900 mt-1">{selectedStudent.enrollmentDate}</p>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-4">Parent Information</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Parent Name</label>
                  <p className="text-gray-900 mt-1">{selectedStudent.parentName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Parent Phone</label>
                  <p className="text-gray-900 mt-1">{selectedStudent.parentPhone}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
      </div>
    </Layout>
  );
};

export default StudentsPage;
