import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Eye, Mail, Phone, Calendar, BookOpen, Users, CheckCircle } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { Table, Column } from '../../components/common/Table';
import { SearchBar } from '../../components/common/SearchBar';
import { Pagination } from '../../components/common/Pagination';
import { Modal, ModalActions } from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subjects: string[];
  hireDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  department: string;
  specialization: string;
}

const mockTeachers: Teacher[] = [
  {
    id: 1,
    firstName: 'Sarah',
    lastName: 'Ali',
    email: 'sarah.ali@school.com',
    phone: '+966 50 111 1111',
    subjects: ['Mathematics', 'Physics'],
    hireDate: '2020-09-01',
    status: 'active',
    department: 'Science',
    specialization: 'Mathematics',
  },
  {
    id: 2,
    firstName: 'Mohammed',
    lastName: 'Hassan',
    email: 'mohammed.hassan@school.com',
    phone: '+966 50 222 2222',
    subjects: ['English Literature', 'Writing'],
    hireDate: '2019-09-01',
    status: 'active',
    department: 'Languages',
    specialization: 'English',
  },
  {
    id: 3,
    firstName: 'Noor',
    lastName: 'Ahmed',
    email: 'noor.ahmed@school.com',
    phone: '+966 50 333 3333',
    subjects: ['Chemistry', 'Biology'],
    hireDate: '2021-09-01',
    status: 'active',
    department: 'Science',
    specialization: 'Chemistry',
  },
];

export const TeachersPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<string>('lastName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState<Partial<Teacher>>({});

  const filteredTeachers = useMemo(() => {
    let filtered = teachers.filter((teacher) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        teacher.firstName.toLowerCase().includes(searchLower) ||
        teacher.lastName.toLowerCase().includes(searchLower) ||
        teacher.email.toLowerCase().includes(searchLower) ||
        teacher.department.toLowerCase().includes(searchLower) ||
        teacher.subjects.some(s => s.toLowerCase().includes(searchLower))
      );
    });

    filtered.sort((a, b) => {
      const aValue = (a as any)[sortKey];
      const bValue = (b as any)[sortKey];
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [teachers, searchQuery, sortKey, sortDirection]);

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const handleAddTeacher = () => {
    const newTeacher: Teacher = {
      id: Math.max(...teachers.map(t => t.id)) + 1,
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      email: formData.email || '',
      phone: formData.phone || '',
      subjects: formData.subjects || [],
      hireDate: formData.hireDate || new Date().toISOString().split('T')[0],
      status: 'active',
      department: formData.department || '',
      specialization: formData.specialization || '',
    };
    setTeachers([...teachers, newTeacher]);
    setIsAddModalOpen(false);
    setFormData({});
  };

  const handleEditTeacher = () => {
    if (!selectedTeacher) return;
    setTeachers(teachers.map(t => 
      t.id === selectedTeacher.id ? { ...t, ...formData } : t
    ));
    setIsEditModalOpen(false);
    setSelectedTeacher(null);
    setFormData({});
  };

  const handleDeleteTeacher = (id: number) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      setTeachers(teachers.filter(t => t.id !== id));
    }
  };

  const openEditModal = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setFormData(teacher);
    setIsEditModalOpen(true);
  };

  const openViewModal = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsViewModalOpen(true);
  };

  const columns: Column<Teacher>[] = [
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
      key: 'department',
      header: 'Department',
      sortable: true,
    },
    {
      key: 'subjects',
      header: 'Subjects',
      render: (teacher) => (
        <div className="flex flex-wrap gap-1">
          {teacher.subjects.slice(0, 2).map((subject, idx) => (
            <span key={idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
              {subject}
            </span>
          ))}
          {teacher.subjects.length > 2 && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
              +{teacher.subjects.length - 2}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (teacher) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            teacher.status === 'active'
              ? 'bg-green-100 text-green-800'
              : teacher.status === 'inactive'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {teacher.status === 'on-leave' ? 'On Leave' : teacher.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (teacher) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => openViewModal(teacher)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => openEditModal(teacher)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteTeacher(teacher.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const TeacherForm: React.FC = () => (
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
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Department"
          value={formData.department || ''}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          required
        />
        <Input
          label="Specialization"
          value={formData.specialization || ''}
          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
          icon={<BookOpen className="w-5 h-5" />}
          required
        />
      </div>
      <Input
        label="Subjects (comma-separated)"
        value={formData.subjects?.join(', ') || ''}
        onChange={(e) => setFormData({ ...formData, subjects: e.target.value.split(',').map(s => s.trim()) })}
        hint="e.g., Mathematics, Physics, Computer Science"
      />
      <Input
        label="Hire Date"
        type="date"
        value={formData.hireDate || ''}
        onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
        icon={<Calendar className="w-5 h-5" />}
        required
      />
    </div>
  );

  return (
    <Layout user={{ firstName: 'Admin', lastName: 'User', email: 'admin@school.com', role: 'ADMIN' }}>
      <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-purple-50 min-h-screen">
      <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Teachers</h1>
          <p className="text-gray-600 mt-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Manage teaching staff and assignments
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-5 h-5" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Teacher
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-purple-100">Total Teachers</h3>
              <p className="text-3xl font-bold mt-2">{teachers.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <BookOpen className="w-8 h-8" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-100">Active</h3>
              <p className="text-3xl font-bold mt-2">
                {teachers.filter(t => t.status === 'active').length}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <CheckCircle className="w-8 h-8" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-yellow-100">On Leave</h3>
              <p className="text-3xl font-bold mt-2">
                {teachers.filter(t => t.status === 'on-leave').length}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Calendar className="w-8 h-8" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-100">Departments</h3>
              <p className="text-3xl font-bold mt-2">
                {new Set(teachers.map(t => t.department)).size}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Users className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search teachers by name, email, department, or subject..."
        />
      </div>

      <Table
        data={paginatedTeachers}
        columns={columns}
        onSort={handleSort}
        sortKey={sortKey}
        sortDirection={sortDirection}
        emptyMessage="No teachers found"
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredTeachers.length}
          itemsPerPage={itemsPerPage}
        />
      )}

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Teacher"
        footer={
          <ModalActions>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddTeacher}>
              Add Teacher
            </Button>
          </ModalActions>
        }
      >
        <TeacherForm />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Teacher"
        footer={
          <ModalActions>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEditTeacher}>
              Save Changes
            </Button>
          </ModalActions>
        }
      >
        <TeacherForm />
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Teacher Details"
        size="lg"
      >
        {selectedTeacher && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">First Name</label>
                <p className="text-gray-900 mt-1">{selectedTeacher.firstName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Last Name</label>
                <p className="text-gray-900 mt-1">{selectedTeacher.lastName}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-900 mt-1">{selectedTeacher.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="text-gray-900 mt-1">{selectedTeacher.phone}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Department</label>
                <p className="text-gray-900 mt-1">{selectedTeacher.department}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Specialization</label>
                <p className="text-gray-900 mt-1">{selectedTeacher.specialization}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Subjects</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTeacher.subjects.map((subject, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg">
                    {subject}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Hire Date</label>
                <p className="text-gray-900 mt-1">{selectedTeacher.hireDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <p className="text-gray-900 mt-1 capitalize">{selectedTeacher.status}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
      </div>
    </Layout>
  );
};

export default TeachersPage;
