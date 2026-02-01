import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';
import { cache } from '../config/redis.js';

/**
 * Password Security Configuration - OWASP Recommendations
 */
const PASSWORD_CONFIG = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  bcryptRounds: 12, // Increased from 10 for better security
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  passwordHistoryCount: 5, // Don't allow reusing last 5 passwords
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (
  password: string
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < PASSWORD_CONFIG.minLength) {
    errors.push(`Password must be at least ${PASSWORD_CONFIG.minLength} characters long`);
  }

  if (password.length > PASSWORD_CONFIG.maxLength) {
    errors.push(`Password must not exceed ${PASSWORD_CONFIG.maxLength} characters`);
  }

  if (PASSWORD_CONFIG.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (PASSWORD_CONFIG.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (PASSWORD_CONFIG.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (PASSWORD_CONFIG.requireSpecialChars && !/[@$!%*?&#]/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&#)');
  }

  // Check for common weak passwords
  const commonPasswords = ['password', '12345678', 'qwerty', 'admin', 'letmein'];
  if (commonPasswords.some((weak) => password.toLowerCase().includes(weak))) {
    errors.push('Password is too common. Please choose a stronger password');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Hash password securely
 */
export const hashPassword = async (password: string): Promise<string> => {
  const validation = validatePasswordStrength(password);
  if (!validation.valid) {
    throw new Error(validation.errors.join(', '));
  }
  return bcrypt.hash(password, PASSWORD_CONFIG.bcryptRounds);
};

/**
 * Compare password with hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Account Lockout Protection - Prevents brute force attacks
 */
export class AccountLockout {
  private static getKey(identifier: string): string {
    return `lockout:${identifier}`;
  }

  /**
   * Record a failed login attempt
   */
  static async recordFailedAttempt(identifier: string): Promise<{
    isLocked: boolean;
    attemptsLeft: number;
  }> {
    const key = this.getKey(identifier);
    const attempts = ((await cache.get<number>(key)) || 0) + 1;

    await cache.set(key, attempts, PASSWORD_CONFIG.lockoutDuration / 1000);

    const isLocked = attempts >= PASSWORD_CONFIG.maxLoginAttempts;
    const attemptsLeft = Math.max(0, PASSWORD_CONFIG.maxLoginAttempts - attempts);

    if (isLocked) {
      console.warn(
        `[SECURITY] Account locked for: ${identifier} after ${attempts} failed attempts`
      );
    }

    return { isLocked, attemptsLeft };
  }

  /**
   * Clear failed attempts on successful login
   */
  static async clearFailedAttempts(identifier: string): Promise<void> {
    const key = this.getKey(identifier);
    await cache.del(key);
  }

  /**
   * Check if account is locked
   */
  static async isAccountLocked(identifier: string): Promise<boolean> {
    const key = this.getKey(identifier);
    const attempts = (await cache.get<number>(key)) || 0;
    return attempts >= PASSWORD_CONFIG.maxLoginAttempts;
  }

  /**
   * Get remaining attempts
   */
  static async getRemainingAttempts(identifier: string): Promise<number> {
    const key = this.getKey(identifier);
    const attempts = (await cache.get<number>(key)) || 0;
    return Math.max(0, PASSWORD_CONFIG.maxLoginAttempts - attempts);
  }
}

/**
 * Session Security - Track active sessions
 */
export class SessionManager {
  private static getKey(userId: string): string {
    return `session:${userId}`;
  }

  /**
   * Create a new session
   */
  static async createSession(
    userId: string,
    token: string,
    metadata: {
      ip: string;
      userAgent: string;
    }
  ): Promise<void> {
    const key = this.getKey(userId);
    const sessionData = {
      token,
      ...metadata,
      createdAt: new Date().toISOString(),
    };

    // Store session for 7 days (same as JWT expiry)
    await cache.set(key, sessionData, 7 * 24 * 60 * 60);
  }

  /**
   * Validate session
   */
  static async validateSession(userId: string, token: string): Promise<boolean> {
    const key = this.getKey(userId);
    const session = await cache.get<any>(key);

    if (!session) {
      return false;
    }

    return session.token === token;
  }

  /**
   * Revoke session (logout)
   */
  static async revokeSession(userId: string): Promise<void> {
    const key = this.getKey(userId);
    await cache.del(key);
  }

  /**
   * Revoke all user sessions
   */
  static async revokeAllSessions(userId: string): Promise<void> {
    await this.revokeSession(userId);
    // In a production system, you'd also want to blacklist all tokens
    // or maintain a list of all active sessions per user
  }
}

/**
 * Middleware: Check account lockout before authentication
 */
export const checkAccountLockout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const identifier = req.body.email || req.ip || 'unknown';

    const isLocked = await AccountLockout.isAccountLocked(identifier);
    if (isLocked) {
      res.status(423).json({
        success: false,
        error: 'Account temporarily locked',
        message: `Too many failed login attempts. Please try again in ${
          PASSWORD_CONFIG.lockoutDuration / 60000
        } minutes.`,
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Account lockout check error:', error);
    next(); // Fail open on error
  }
};

/**
 * Password History - Prevent password reuse
 */
export class PasswordHistory {
  private static getKey(userId: string): string {
    return `pwd_history:${userId}`;
  }

  /**
   * Add password to history
   */
  static async addToHistory(userId: string, passwordHash: string): Promise<void> {
    const key = this.getKey(userId);
    const history = (await cache.get<string[]>(key)) || [];

    history.unshift(passwordHash);

    // Keep only the last N passwords
    const trimmedHistory = history.slice(0, PASSWORD_CONFIG.passwordHistoryCount);

    // Store for 1 year
    await cache.set(key, trimmedHistory, 365 * 24 * 60 * 60);
  }

  /**
   * Check if password was recently used
   */
  static async isPasswordReused(userId: string, newPassword: string): Promise<boolean> {
    const key = this.getKey(userId);
    const history = (await cache.get<string[]>(key)) || [];

    for (const oldHash of history) {
      const isMatch = await bcrypt.compare(newPassword, oldHash);
      if (isMatch) {
        return true;
      }
    }

    return false;
  }
}

/**
 * Two-Factor Authentication (2FA) - Optional enhancement
 */
export class TwoFactorAuth {
  private static getKey(userId: string): string {
    return `2fa:${userId}`;
  }

  /**
   * Generate 2FA code
   */
  static generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send 2FA code (implement email/SMS sending)
   */
  static async sendCode(userId: string, email: string): Promise<string> {
    const code = this.generateCode();
    const key = this.getKey(userId);

    // Store code for 5 minutes
    await cache.set(key, code, 5 * 60);

    // TODO: Implement email/SMS sending
    console.log(`[2FA] Code for ${email}: ${code}`);

    return code;
  }

  /**
   * Verify 2FA code
   */
  static async verifyCode(userId: string, code: string): Promise<boolean> {
    const key = this.getKey(userId);
    const storedCode = await cache.get<string>(key);

    if (!storedCode) {
      return false;
    }

    const isValid = storedCode === code;

    if (isValid) {
      await cache.del(key);
    }

    return isValid;
  }
}
