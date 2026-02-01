import { Request, Response, NextFunction } from 'express';
import { AuditLog } from '../models';

/**
 * Audit Log Types
 */
export enum AuditAction {
  // Authentication
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PASSWORD_RESET = 'PASSWORD_RESET',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',

  // User Management
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  ROLE_CHANGED = 'ROLE_CHANGED',

  // Data Access
  DATA_ACCESSED = 'DATA_ACCESSED',
  DATA_CREATED = 'DATA_CREATED',
  DATA_UPDATED = 'DATA_UPDATED',
  DATA_DELETED = 'DATA_DELETED',

  // Security Events
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  SQL_INJECTION_ATTEMPT = 'SQL_INJECTION_ATTEMPT',
  XSS_ATTEMPT = 'XSS_ATTEMPT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',

  // School Management
  SCHOOL_CREATED = 'SCHOOL_CREATED',
  SCHOOL_UPDATED = 'SCHOOL_UPDATED',
  SUBSCRIPTION_CHANGED = 'SUBSCRIPTION_CHANGED',
}

/**
 * Audit Log Severity Levels
 */
export enum AuditSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

/**
 * Audit Logger Class
 */
export class AuditLogger {
  /**
   * Log an audit event
   */
  static async log({
    userId,
    schoolId,
    action,
    severity = AuditSeverity.INFO,
    details,
    ipAddress,
    userAgent,
    resource,
    resourceId,
  }: {
    userId?: string;
    schoolId?: string;
    action: AuditAction;
    severity?: AuditSeverity;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
    resource?: string;
    resourceId?: string;
  }): Promise<void> {
    try {
      await AuditLog.create({
        userId,
        schoolId,
        action,
        severity,
        details: details ? JSON.stringify(details) : null,
        ipAddress,
        userAgent,
        resource,
        resourceId,
        timestamp: new Date(),
      });

      // Log to console for critical events
      if (severity === AuditSeverity.CRITICAL || severity === AuditSeverity.ERROR) {
        console.error(`[AUDIT ${severity}] ${action}:`, {
          userId,
          schoolId,
          details,
          ipAddress,
        });
      }
    } catch (error) {
      console.error('Failed to write audit log:', error);
      // Don't throw - logging should never break the application
    }
  }

  /**
   * Log authentication events
   */
  static async logAuth(
    action: AuditAction,
    req: Request,
    userId?: string,
    success: boolean = true
  ): Promise<void> {
    await this.log({
      userId,
      action,
      severity: success ? AuditSeverity.INFO : AuditSeverity.WARNING,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: {
        email: req.body.email,
        success,
      },
    });
  }

  /**
   * Log security events
   */
  static async logSecurity(action: AuditAction, req: Request, details?: any): Promise<void> {
    await this.log({
      userId: (req as any).user?.id,
      schoolId: (req as any).schoolId,
      action,
      severity: AuditSeverity.CRITICAL,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: {
        path: req.path,
        method: req.method,
        body: req.body,
        query: req.query,
        ...details,
      },
    });
  }

  /**
   * Log data access events
   */
  static async logDataAccess(
    action: AuditAction,
    req: Request,
    resource: string,
    resourceId?: string,
    details?: any
  ): Promise<void> {
    await this.log({
      userId: (req as any).user?.id,
      schoolId: (req as any).schoolId,
      action,
      severity: AuditSeverity.INFO,
      resource,
      resourceId,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details,
    });
  }
}

/**
 * Middleware: Audit all requests
 */
export const auditMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Skip audit for health checks and static assets
  if (req.path === '/health' || req.path.startsWith('/static')) {
    return next();
  }

  // Record request start time
  const startTime = Date.now();

  // Override res.json to capture response
  const originalJson = res.json.bind(res);
  let responseBody: any;

  res.json = function (body: any) {
    responseBody = body;
    return originalJson(body);
  };

  // Log after response is sent
  res.on('finish', async () => {
    try {
      const duration = Date.now() - startTime;
      const user = (req as any).user;
      const schoolId = (req as any).schoolId;

      // Determine severity based on status code
      let severity = AuditSeverity.INFO;
      if (res.statusCode >= 500) {
        severity = AuditSeverity.ERROR;
      } else if (res.statusCode >= 400) {
        severity = AuditSeverity.WARNING;
      }

      // Determine action based on HTTP method
      let action = AuditAction.DATA_ACCESSED;
      if (req.method === 'POST') action = AuditAction.DATA_CREATED;
      else if (req.method === 'PUT' || req.method === 'PATCH') action = AuditAction.DATA_UPDATED;
      else if (req.method === 'DELETE') action = AuditAction.DATA_DELETED;

      // Skip logging for successful GET requests (too noisy)
      if (req.method === 'GET' && res.statusCode < 400) {
        return;
      }

      await AuditLogger.log({
        userId: user?.id,
        schoolId,
        action,
        severity,
        resource: req.path,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        details: {
          method: req.method,
          statusCode: res.statusCode,
          duration: `${duration}ms`,
          success: res.statusCode < 400,
        },
      });
    } catch (error) {
      console.error('Audit middleware error:', error);
    }
  });

  next();
};

/**
 * Security Event Monitor
 */
export class SecurityMonitor {
  private static suspiciousActivityThreshold = 5;
  private static monitoringWindow = 5 * 60 * 1000; // 5 minutes

  /**
   * Track suspicious activity per IP
   */
  private static suspiciousIPs = new Map<string, number[]>();

  /**
   * Report suspicious activity
   */
  static reportSuspiciousActivity(ip: string, req: Request): void {
    const now = Date.now();

    if (!this.suspiciousIPs.has(ip)) {
      this.suspiciousIPs.set(ip, []);
    }

    const timestamps = this.suspiciousIPs.get(ip)!;

    // Remove old timestamps
    const recentTimestamps = timestamps.filter((ts) => now - ts < this.monitoringWindow);

    recentTimestamps.push(now);
    this.suspiciousIPs.set(ip, recentTimestamps);

    // Check if threshold exceeded
    if (recentTimestamps.length >= this.suspiciousActivityThreshold) {
      console.error(`[SECURITY ALERT] Suspicious activity from IP: ${ip}`);

      // Log to audit
      AuditLogger.logSecurity(AuditAction.SUSPICIOUS_ACTIVITY, req, {
        reason: 'Multiple security events in short time',
        eventCount: recentTimestamps.length,
      });

      // TODO: Implement IP blocking or notification
    }
  }

  /**
   * Clear monitoring data (run periodically)
   */
  static cleanup(): void {
    const now = Date.now();
    for (const [ip, timestamps] of this.suspiciousIPs.entries()) {
      const recentTimestamps = timestamps.filter((ts) => now - ts < this.monitoringWindow);

      if (recentTimestamps.length === 0) {
        this.suspiciousIPs.delete(ip);
      } else {
        this.suspiciousIPs.set(ip, recentTimestamps);
      }
    }
  }
}

// Run cleanup every 5 minutes
setInterval(
  () => {
    SecurityMonitor.cleanup();
  },
  5 * 60 * 1000
);
