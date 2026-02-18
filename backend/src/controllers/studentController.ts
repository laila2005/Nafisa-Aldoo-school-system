import type { Request, Response } from 'express';
import { User } from '../models/index.js';
import { Op } from 'sequelize';

export const getStudents = async (req: Request, res: Response) => {
  try {
    const { search, page = '1', pageSize = '50' } = req.query;

    const where: any = { role: 'STUDENT' };

    if (search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { studentId: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const limit = parseInt(pageSize as string, 10);
    const offset = (parseInt(page as string, 10) - 1) * limit;

    const { rows: students, count: total } = await User.findAndCountAll({
      where,
      attributes: [
        'id', 'firstName', 'lastName', 'email', 'phone',
        'studentId', 'dateOfBirth', 'gender', 'isActive',
        'createdAt', 'updatedAt',
      ],
      order: [['lastName', 'ASC'], ['firstName', 'ASC']],
      limit,
      offset,
    });

    res.json({
      success: true,
      data: students,
      total,
      page: parseInt(page as string, 10),
      pageSize: limit,
    });
  } catch (error: any) {
    console.error('Failed to fetch students:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch students',
    });
  }
};

export const getStudent = async (req: Request, res: Response) => {
  try {
    const student = await User.findOne({
      where: { id: req.params.id, role: 'STUDENT' },
      attributes: [
        'id', 'firstName', 'lastName', 'email', 'phone',
        'studentId', 'dateOfBirth', 'gender', 'address', 'city',
        'state', 'country', 'isActive', 'emergencyContactName',
        'emergencyContactPhone', 'createdAt', 'updatedAt',
      ],
    });

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    res.json({ success: true, data: student });
  } catch (error: any) {
    console.error('Failed to fetch student:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, password, studentId, dateOfBirth, gender } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ success: false, error: 'firstName, lastName, and email are required' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, error: 'A user with this email already exists' });
    }

    const student = await User.create({
      firstName,
      lastName,
      email,
      phone: phone || '',
      password: password || 'Temp1234!',
      role: 'STUDENT',
      studentId: studentId || '',
      dateOfBirth,
      gender,
      isActive: true,
      schoolId: (req as any).user?.schoolId || req.headers['x-school-id'] || null,
    });

    res.status(201).json({
      success: true,
      data: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phone: student.phone,
        studentId: student.studentId,
        isActive: student.isActive,
      },
    });
  } catch (error: any) {
    console.error('Failed to create student:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const student = await User.findOne({ where: { id: req.params.id, role: 'STUDENT' } });
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    const { firstName, lastName, email, phone, studentId, dateOfBirth, gender, isActive } = req.body;
    await student.update({ firstName, lastName, email, phone, studentId, dateOfBirth, gender, isActive });

    res.json({ success: true, data: student });
  } catch (error: any) {
    console.error('Failed to update student:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const student = await User.findOne({ where: { id: req.params.id, role: 'STUDENT' } });
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    await student.destroy();
    res.json({ success: true, message: 'Student deleted' });
  } catch (error: any) {
    console.error('Failed to delete student:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
