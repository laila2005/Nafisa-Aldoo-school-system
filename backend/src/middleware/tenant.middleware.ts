import type { Request, Response, NextFunction } from 'express';
import { sequelize } from '../database/connection.js';

// Extend Express Request type to include schoolId
declare global {
  namespace Express {
    interface Request {
      schoolId?: string;
      user?: {
        id: string;
        schoolId: string;
        role: string;
        [key: string]: any;
      };
    }
  }
}

/**
 * Multi-Tenant Middleware
 *
 * Automatically sets the school context for all database queries based on the authenticated user's school.
 * This ensures data isolation between different schools (tenants) using Row-Level Security.
 *
 * Usage:
 * 1. Apply after authentication middleware
 * 2. Sets PostgreSQL session variable: app.current_school_id
 * 3. Row-Level Security policies automatically filter queries by school_id
 *
 * @example
 * app.use(authMiddleware);
 * app.use(tenantMiddleware);
 * app.use('/api', routes);
 */
export const tenantMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Skip tenant middleware for public routes
    const publicRoutes = ['/health', '/api/auth/login', '/api/auth/register'];
    if (publicRoutes.some((route) => req.path.startsWith(route))) {
      return next();
    }

    // Get school ID from authenticated user
    const schoolId = req.user?.schoolId;

    if (!schoolId) {
      return res.status(403).json({
        success: false,
        message: 'School context not found. Please authenticate.',
      });
    }

    // SECURITY FIX: Use parameterized query to prevent SQL injection
    // Set PostgreSQL session variable for Row-Level Security
    // This makes all queries automatically filter by school_id
    await sequelize.query('SET LOCAL app.current_school_id = :schoolId', {
      replacements: { schoolId },
      type: 'SET',
    });

    // Also attach to request object for application use
    req.schoolId = schoolId;

    next();
  } catch (error) {
    console.error('Tenant middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to set school context',
    });
  }
};

/**
 * Super Admin Middleware
 *
 * Bypasses tenant isolation for super admin users who can access all schools.
 * Use sparingly and only for admin panels/support tools.
 *
 * @example
 * app.use('/api/admin', superAdminMiddleware);
 */
export const superAdminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if user is super admin
    if (req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. Super admin access required.',
      });
    }

    // Disable RLS for this session (use with extreme caution!)
    // await sequelize.query(`SET LOCAL row_security = off`);

    next();
  } catch (error) {
    console.error('Super admin middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to set super admin context',
    });
  }
};

/**
 * School Switcher Middleware (for demo/testing)
 *
 * Allows switching between schools using a header.
 * ONLY USE IN DEVELOPMENT! Remove in production.
 *
 * Usage: Add X-School-Id header to requests
 */
export const schoolSwitcherMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'production') {
    return next();
  }

  const headerSchoolId = req.headers['x-school-id'] as string;

  if (headerSchoolId && req.user) {
    req.user.schoolId = headerSchoolId;
    req.schoolId = headerSchoolId;
  }

  next();
};
