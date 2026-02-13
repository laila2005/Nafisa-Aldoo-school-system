// @ts-nocheck
import { rest } from 'msw';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Mock data
const mockStudents = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    grade: '10',
    enrollmentDate: '2023-09-01',
    status: 'active',
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    grade: '11',
    enrollmentDate: '2023-09-01',
    status: 'active',
  },
];

const mockTeachers = [
  {
    id: 1,
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah.williams@school.com',
    subject: 'Mathematics',
    status: 'active',
  },
];

const mockCourses = [
  {
    id: 1,
    name: 'Mathematics 101',
    code: 'MATH101',
    teacherId: 1,
    grade: '10',
    credits: 4,
  },
];

const mockGrades = [
  {
    id: 1,
    studentId: 1,
    courseId: 1,
    grade: 'A',
    percentage: 92,
    term: 'Fall 2024',
  },
];

export const handlers = [
  // Students endpoints
  rest.get(`${API_BASE_URL}/students`, (req, res, ctx) => {
    const page = Number(req.url.searchParams.get('page')) || 1;
    const pageSize = Number(req.url.searchParams.get('pageSize')) || 10;
    const search = req.url.searchParams.get('search');
    
    let filteredStudents = [...mockStudents];
    
    if (search) {
      filteredStudents = filteredStudents.filter(student =>
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return res(
      ctx.status(200),
      ctx.json({
        data: filteredStudents.slice(start, end),
        total: filteredStudents.length,
        page,
        pageSize,
      })
    );
  }),

  rest.get(`${API_BASE_URL}/students/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const student = mockStudents.find(s => s.id === Number(id));
    
    if (!student) {
      return res(
        ctx.status(404),
        ctx.json({ error: 'Student not found' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json(student)
    );
  }),

  rest.post(`${API_BASE_URL}/students`, async (req, res, ctx) => {
    const newStudent = await req.json();
    
    return res(
      ctx.status(201),
      ctx.json({
        ...newStudent,
        id: mockStudents.length + 1,
      })
    );
  }),

  rest.put(`${API_BASE_URL}/students/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    const updates = await req.json();
    
    return res(
      ctx.status(200),
      ctx.json({
        id: Number(id),
        ...updates,
      })
    );
  }),

  rest.delete(`${API_BASE_URL}/students/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const index = mockStudents.findIndex(s => s.id === Number(id));
    
    if (index === -1) {
      return res(
        ctx.status(404),
        ctx.json({ error: 'Student not found' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json({ success: true })
    );
  }),

  // Teachers endpoints
  rest.get(`${API_BASE_URL}/teachers`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: mockTeachers,
        total: mockTeachers.length,
      })
    );
  }),

  rest.get(`${API_BASE_URL}/teachers/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const teacher = mockTeachers.find(t => t.id === Number(id));
    
    if (!teacher) {
      return res(
        ctx.status(404),
        ctx.json({ error: 'Teacher not found' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json(teacher)
    );
  }),

  rest.post(`${API_BASE_URL}/teachers`, async (req, res, ctx) => {
    const newTeacher = await req.json();
    
    return res(
      ctx.status(201),
      ctx.json({
        ...newTeacher,
        id: mockTeachers.length + 1,
      })
    );
  }),

  rest.put(`${API_BASE_URL}/teachers/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    const updates = await req.json();
    
    return res(
      ctx.status(200),
      ctx.json({
        id: Number(id),
        ...updates,
      })
    );
  }),

  rest.delete(`${API_BASE_URL}/teachers/:id`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ success: true })
    );
  }),

  // Courses endpoints
  rest.get(`${API_BASE_URL}/courses`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: mockCourses,
        total: mockCourses.length,
      })
    );
  }),

  rest.get(`${API_BASE_URL}/courses/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const course = mockCourses.find(c => c.id === Number(id));
    
    if (!course) {
      return res(
        ctx.status(404),
        ctx.json({ error: 'Course not found' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json(course)
    );
  }),

  rest.post(`${API_BASE_URL}/courses`, async (req, res, ctx) => {
    const newCourse = await req.json();
    
    return res(
      ctx.status(201),
      ctx.json({
        ...newCourse,
        id: mockCourses.length + 1,
      })
    );
  }),

  // Grades endpoints
  rest.get(`${API_BASE_URL}/grades`, (req, res, ctx) => {
    const studentId = req.url.searchParams.get('studentId');
    
    let filteredGrades = [...mockGrades];
    
    if (studentId) {
      filteredGrades = filteredGrades.filter(g => g.studentId === Number(studentId));
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        data: filteredGrades,
        total: filteredGrades.length,
      })
    );
  }),

  rest.post(`${API_BASE_URL}/grades`, async (req, res, ctx) => {
    const newGrade = await req.json();
    
    return res(
      ctx.status(201),
      ctx.json({
        ...newGrade,
        id: mockGrades.length + 1,
      })
    );
  }),

  // Authentication endpoints
  rest.post(`${API_BASE_URL}/auth/login`, async (req, res, ctx) => {
    const { email, password } = await req.json();
    
    if (email === 'admin@school.com' && password === 'password') {
      return res(
        ctx.status(200),
        ctx.json({
          token: 'mock-jwt-token',
          user: {
            id: 1,
            email: 'admin@school.com',
            role: 'ADMIN',
            firstName: 'Admin',
            lastName: 'User',
          },
        })
      );
    }
    
    return res(
      ctx.status(401),
      ctx.json({ error: 'Invalid credentials' })
    );
  }),

  rest.post(`${API_BASE_URL}/auth/logout`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ success: true })
    );
  }),
];
