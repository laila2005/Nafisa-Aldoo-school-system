// API service for making HTTP requests
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

console.log('API: Using base URL:', API_BASE_URL);

// Configure axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

// Attach JWT token to every request
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Test function to check backend connectivity
export const testBackendConnection = async () => {
  try {
    console.log('API: Testing backend connection to:', API_BASE_URL);
    const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
    console.log('API: Backend connection successful:', response.data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('API: Backend connection failed:', error);
    if (error.code === 'ECONNREFUSED') {
      return { success: false, error: 'Backend server is not running or not accessible' };
    } else if (error.response?.status === 404) {
      return { success: false, error: 'Backend is running but health endpoint not found' };
    } else {
      return { success: false, error: error.message || 'Unknown connection error' };
    }
  }
};

// Students API
export const getStudents = async (params?: any) => {
  const response = await axios.get(`${API_BASE_URL}/students`, { params });
  return response.data;
};

export const getStudent = async (id: number) => {
  const response = await axios.get(`${API_BASE_URL}/students/${id}`);
  return response.data;
};

export const createStudent = async (data: any) => {
  console.log('API: Creating student with URL:', `${API_BASE_URL}/students`);
  console.log('API: Student data being sent:', data);

  try {
    const response = await axios.post(`${API_BASE_URL}/students`, data);
    console.log('API: Student created successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('API: Failed to create student:', error);
    if (error.response) {
      console.error('API: Error response status:', error.response.status);
      console.error('API: Error response data:', error.response.data);
    } else if (error.request) {
      console.error('API: No response received:', error.request);
    } else {
      console.error('API: Request setup error:', error.message);
    }
    throw error;
  }
};

export const updateStudent = async (id: number, data: any) => {
  const response = await axios.put(`${API_BASE_URL}/students/${id}`, data);
  return response.data;
};

export const deleteStudent = async (id: number) => {
  const response = await axios.delete(`${API_BASE_URL}/students/${id}`);
  return response.data;
};

export const searchStudents = async (query: string, params?: any) => {
  const response = await axios.get(`${API_BASE_URL}/students/search`, {
    params: { q: query, ...params },
  });
  return response.data;
};

// Teachers API
export const getTeachers = async (params?: any) => {
  const response = await axios.get(`${API_BASE_URL}/teachers`, { params });
  return response.data;
};

export const getTeacher = async (id: number) => {
  const response = await axios.get(`${API_BASE_URL}/teachers/${id}`);
  return response.data;
};

export const createTeacher = async (data: any) => {
  const response = await axios.post(`${API_BASE_URL}/teachers`, data);
  return response.data;
};

export const updateTeacher = async (id: number, data: any) => {
  const response = await axios.put(`${API_BASE_URL}/teachers/${id}`, data);
  return response.data;
};

export const deleteTeacher = async (id: number) => {
  const response = await axios.delete(`${API_BASE_URL}/teachers/${id}`);
  return response.data;
};

// Attendance API
export const getAttendance = async (params?: any) => {
  const response = await axios.get(`${API_BASE_URL}/attendance`, { params });
  return response.data;
};

export const getAttendanceByDate = async (date: string, courseId?: string) => {
  const params: any = { date };
  if (courseId && courseId !== 'all') {
    params.courseId = courseId;
  }
  const response = await axios.get(`${API_BASE_URL}/attendance/date`, { params });
  return response.data;
};

export const saveAttendance = async (data: any) => {
  const response = await axios.post(`${API_BASE_URL}/attendance`, data);
  return response.data;
};

export const updateAttendanceRecord = async (id: number, data: any) => {
  const response = await axios.put(`${API_BASE_URL}/attendance/${id}`, data);
  return response.data;
};

export const getAttendanceStats = async (params?: any) => {
  const response = await axios.get(`${API_BASE_URL}/attendance/stats`, { params });
  return response.data;
};

// Courses API
export const getCourses = async (params?: any) => {
  const response = await axios.get(`${API_BASE_URL}/courses`, { params });
  return response.data;
};

export const getCourse = async (id: number) => {
  const response = await axios.get(`${API_BASE_URL}/courses/${id}`);
  return response.data;
};

export const createCourse = async (data: any) => {
  const response = await axios.post(`${API_BASE_URL}/courses`, data);
  return response.data;
};

export const updateCourse = async (id: number, data: any) => {
  const response = await axios.put(`${API_BASE_URL}/courses/${id}`, data);
  return response.data;
};

export const deleteCourse = async (id: number) => {
  const response = await axios.delete(`${API_BASE_URL}/courses/${id}`);
  return response.data;
};

// Grades API
export const getGrades = async (params?: any) => {
  const response = await axios.get(`${API_BASE_URL}/grades`, { params });
  return response.data;
};

export const createGrade = async (data: any) => {
  const response = await axios.post(`${API_BASE_URL}/grades`, data);
  return response.data;
};

// Authentication API
export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
  return response.data;
};

export const logout = async () => {
  const response = await axios.post(`${API_BASE_URL}/auth/logout`);
  return response.data;
};
