import { body, param, query, validationResult } from 'express-validator';
import type { ValidationChain } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';

/**
 * Validation Error Handler
 */
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.type === 'field' ? err.path : undefined,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Common Validators
 */

// Email validation
export const validateEmail = () =>
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Email must be less than 255 characters');

// Password validation - OWASP recommendations
export const validatePassword = () =>
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/)
    .withMessage(
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    );

// UUID validation
export const validateUUID = (field: string = 'id') =>
  param(field).isUUID().withMessage(`${field} must be a valid UUID`);

// Name validation
export const validateName = (field: string) =>
  body(field)
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage(`${field} must be between 1 and 100 characters`)
    .matches(/^[a-zA-Z\s\u0600-\u06FF]+$/)
    .withMessage(`${field} can only contain letters and spaces`);

// Phone validation
export const validatePhone = () =>
  body('phone')
    .optional()
    .matches(/^[+]?[\d\s()-]{10,20}$/)
    .withMessage('Invalid phone number format');

// Role validation
export const validateRole = () =>
  body('role')
    .isIn(['STUDENT', 'TEACHER', 'PARENT', 'ADMIN', 'SUPER_ADMIN'])
    .withMessage('Invalid role');

// Pagination validation
export const validatePagination = () => [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer').toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
];

/**
 * Route-Specific Validators
 */

// Registration validation
export const validateRegistration = [
  validateEmail(),
  validatePassword(),
  validateName('firstName'),
  validateName('lastName'),
  validateRole(),
  validatePhone(),
  handleValidationErrors,
];

// Login validation
export const validateLogin = [
  validateEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

// Update user validation
export const validateUpdateUser = [
  validateUUID('id'),
  validateName('firstName').optional(),
  validateName('lastName').optional(),
  validatePhone(),
  body('dateOfBirth').optional().isISO8601().withMessage('Invalid date format').toDate(),
  handleValidationErrors,
];

// Course validation
export const validateCourse = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Course name must be between 1 and 255 characters'),
  body('code')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Course code must be between 1 and 50 characters')
    .matches(/^[A-Z0-9-]+$/)
    .withMessage('Course code can only contain uppercase letters, numbers, and hyphens'),
  body('credits')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Credits must be between 0 and 10'),
  handleValidationErrors,
];

// Assignment validation
export const validateAssignment = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description must be less than 5000 characters'),
  body('dueDate')
    .isISO8601()
    .withMessage('Invalid due date format')
    .toDate()
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Due date cannot be in the past');
      }
      return true;
    }),
  body('maxScore')
    .optional()
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Max score must be between 0 and 1000'),
  handleValidationErrors,
];

// Grade validation
export const validateGrade = [
  body('score').isFloat({ min: 0, max: 100 }).withMessage('Score must be between 0 and 100'),
  body('feedback')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Feedback must be less than 1000 characters'),
  handleValidationErrors,
];

// School validation
export const validateSchool = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('School name must be between 1 and 255 characters'),
  body('code')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('School code must be between 1 and 50 characters')
    .matches(/^[A-Z0-9-]+$/)
    .withMessage('School code can only contain uppercase letters, numbers, and hyphens'),
  body('email').optional().isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('phone')
    .optional()
    .matches(/^[+]?[\d\s()-]{10,20}$/)
    .withMessage('Invalid phone number format'),
  body('subscriptionPlan')
    .optional()
    .isIn(['FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE'])
    .withMessage('Invalid subscription plan'),
  handleValidationErrors,
];

/**
 * File Upload Validation
 */
export const validateFileUpload = (
  maxSize: number = 5 * 1024 * 1024, // 5MB default
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'application/pdf']
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const file = (req as any).file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    // Check file size
    if (file.size > maxSize) {
      return res.status(400).json({
        success: false,
        error: `File size exceeds maximum allowed size of ${maxSize / (1024 * 1024)}MB`,
      });
    }

    // Check file type
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        error: `File type ${file.mimetype} is not allowed`,
      });
    }

    next();
  };
};

/**
 * SQL Injection Prevention - Sanitize all inputs
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
    /(--|;|\/\*|\*\/|xp_|sp_)/gi,
    /(\bOR\b|\bAND\b).*?=.*?/gi,
  ];

  const checkForSQLInjection = (obj: any): boolean => {
    if (typeof obj === 'string') {
      for (const pattern of sqlPatterns) {
        if (pattern.test(obj)) {
          return true;
        }
      }
    } else if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (checkForSQLInjection(obj[key])) {
          return true;
        }
      }
    }
    return false;
  };

  if (
    checkForSQLInjection(req.body) ||
    checkForSQLInjection(req.query) ||
    checkForSQLInjection(req.params)
  ) {
    console.warn('[SECURITY] SQL injection attempt detected:', {
      ip: req.ip,
      path: req.path,
      body: req.body,
      query: req.query,
    });

    return res.status(400).json({
      success: false,
      error: 'Invalid input detected',
    });
  }

  next();
};
