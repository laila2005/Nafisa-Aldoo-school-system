import helmet from 'helmet';
import type { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';

/**
 * Security Headers Middleware using Helmet.js
 * Implements OWASP security best practices
 */
export const securityHeaders = helmet({
  // Content Security Policy - Prevents XSS attacks
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  // HTTP Strict Transport Security - Enforces HTTPS
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  // Prevents MIME type sniffing
  noSniff: true,
  // Prevents clickjacking attacks
  frameguard: {
    action: 'deny',
  },
  // Removes X-Powered-By header
  hidePoweredBy: true,
  // DNS Prefetch Control
  dnsPrefetchControl: {
    allow: false,
  },
  // Referrer Policy
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
});

/**
 * HTTP Parameter Pollution (HPP) Protection
 * Prevents parameter pollution attacks
 */
export const hppProtection = hpp();

/**
 * Global Rate Limiter - Prevents brute force attacks
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: 'Too many requests',
      message: 'You have exceeded the rate limit. Please try again later.',
      retryAfter: Math.ceil(15 * 60), // seconds
    });
  },
});

/**
 * Auth Route Rate Limiter - Strict limit for authentication
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  skipSuccessfulRequests: true, // Don't count successful requests
  message: {
    error: 'Too many login attempts',
    retryAfter: '15 minutes',
  },
  handler: (req: Request, res: Response) => {
    // Log suspicious activity
    console.warn(`[SECURITY] Rate limit exceeded for IP: ${req.ip} on ${req.path}`);
    res.status(429).json({
      success: false,
      error: 'Too many login attempts',
      message: 'Account temporarily locked. Please try again in 15 minutes.',
    });
  },
});

/**
 * API Route Rate Limiter - Standard limit for API endpoints
 */
export const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per minute
  message: {
    error: 'Too many API requests',
    retryAfter: '1 minute',
  },
});

/**
 * Sensitive Operations Rate Limiter - Very strict for sensitive operations
 */
export const sensitiveRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit to 10 sensitive operations per hour
  message: {
    error: 'Too many sensitive operations',
    retryAfter: '1 hour',
  },
  handler: (req: Request, res: Response) => {
    console.warn(`[SECURITY] Sensitive operation rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Too many sensitive operations',
      message: 'This operation is temporarily restricted. Please try again later.',
    });
  },
});

/**
 * Request Sanitization - Prevents NoSQL injection and XSS
 */
export const sanitizeRequest = (req: Request, res: Response, next: NextFunction) => {
  // Remove any MongoDB operators from request body, query, and params
  const sanitize = (obj: any): any => {
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        // Remove MongoDB operators
        if (key.startsWith('$')) {
          delete obj[key];
        }
        // Recursively sanitize nested objects
        else if (typeof obj[key] === 'object') {
          obj[key] = sanitize(obj[key]);
        }
        // Sanitize strings for XSS
        else if (typeof obj[key] === 'string') {
          // Remove potential XSS patterns
          obj[key] = obj[key]
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '');
        }
      }
    }
    return obj;
  };

  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);

  next();
};

/**
 * Security Logger - Logs security-related events
 */
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  // Log suspicious patterns
  const suspiciousPatterns = [
    /(\.\.|\/\.\.)/i, // Path traversal
    /<script/i, // XSS attempts
    /union.*select/i, // SQL injection
    /\$where/i, // NoSQL injection
    /eval\(/i, // Code injection
  ];

  const requestData = JSON.stringify({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(requestData)) {
      console.warn(`[SECURITY ALERT] Suspicious request detected:`, {
        ip: req.ip,
        path: req.path,
        method: req.method,
        userAgent: req.get('user-agent'),
        timestamp: new Date().toISOString(),
      });
      break;
    }
  }

  next();
};

/**
 * Trusted Proxies Configuration
 * Required when behind load balancer or reverse proxy
 */
export const configureTrustedProxies = (app: any) => {
  // Trust first proxy (adjust based on your infrastructure)
  app.set('trust proxy', 1);
};
