import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import { authRateLimiter } from '../middleware/security.middleware';
import {
  validateLogin,
  validateRegistration,
  sanitizeInput,
} from '../middleware/validation.middleware';

const router = Router();

// Apply strict rate limiting and validation to auth routes
router.post('/register', authRateLimiter, sanitizeInput, validateRegistration, register);
router.post('/login', authRateLimiter, sanitizeInput, validateLogin, login);

export default router;
