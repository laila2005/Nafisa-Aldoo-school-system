import type { Request, Response } from 'express';
import * as authService from '../services/authService';
import { t } from '../utils/i18n';
import { AccountLockout } from '../utils/security';
import { AuditLogger, AuditAction } from '../utils/auditLogger';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role, phone } = req.body;

    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({
        error: t('errors.required', req.language),
      });
    }

    const user = await authService.registerUser({
      email,
      password,
      firstName,
      lastName,
      role,
      phone,
    });

    res.status(201).json({
      success: true,
      message: t('auth.registerSuccess', req.language),
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      error: error.message || t('errors.serverError', req.language),
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const identifier = req.body.email || req.ip || 'unknown';
  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: t('errors.required', req.language),
      });
    }

    // Check account lockout
    const isLocked = await AccountLockout.isAccountLocked(identifier);
    if (isLocked) {
      await AuditLogger.logAuth(AuditAction.ACCOUNT_LOCKED, req, undefined, false);
      return res.status(423).json({
        success: false,
        error: 'Account temporarily locked',
        message: 'Too many failed login attempts. Please try again in 15 minutes.',
      });
    }

    const result = await authService.loginUser(email, password, req);

    // Clear failed attempts on successful login
    await AccountLockout.clearFailedAttempts(identifier);
    
    // Log successful login
    await AuditLogger.logAuth(AuditAction.LOGIN_SUCCESS, req, result.user.id, true);

    res.status(200).json({
      success: true,
      message: t('auth.loginSuccess', req.language),
      data: result,
    });
  } catch (error: any) {
    // Record failed attempt
    const lockoutInfo = await AccountLockout.recordFailedAttempt(identifier);
    
    // Log failed login
    await AuditLogger.logAuth(AuditAction.LOGIN_FAILED, req, undefined, false);

    const message = lockoutInfo.isLocked
      ? 'Account locked due to too many failed attempts'
      : `Invalid credentials. ${lockoutInfo.attemptsLeft} attempts remaining`;

    res.status(401).json({
      success: false,
      error: error.message || t('errors.invalidCredentials', req.language),
      message,
      attemptsRemaining: lockoutInfo.attemptsLeft,
    });
  }
};
