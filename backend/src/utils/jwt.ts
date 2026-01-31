import jwt from 'jsonwebtoken';
import type { Secret, SignOptions } from 'jsonwebtoken';
import { UserRole } from '../types/index.js';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your-secret-key-change-this';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JwtPayload {
  id: number;
  email: string;
  role: UserRole;
}

export const generateToken = (payload: JwtPayload): string => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as any);
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
