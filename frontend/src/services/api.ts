// API service for making HTTP requests
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

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
  const response = await axios.post(`${API_BASE_URL}/students`, data);
  return response.data;
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
