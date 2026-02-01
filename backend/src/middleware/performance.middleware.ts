import type { Request, Response, NextFunction } from 'express';

/**
 * Performance monitoring middleware
 * Logs slow requests and tracks response times
 */
export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  // Store original end function
  const originalEnd = res.end;

  // Override end function to log performance
  res.end = function (this: Response, ...args: any[]): Response {
    const duration = Date.now() - startTime;
    const schoolId = (req as any).schoolId || 'global';

    // Set performance header
    res.setHeader('X-Response-Time', `${duration}ms`);

    // Log slow requests (> 1 second)
    if (duration > 1000) {
      console.warn(`⚠️  Slow request [${duration}ms]:`, {
        method: req.method,
        url: req.originalUrl,
        schoolId,
        statusCode: res.statusCode,
      });
    }

    // Log all requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} [${duration}ms]`);
    }

    // Call original end
    return originalEnd.apply(this, args as [any, BufferEncoding, (() => void)?]);
  };

  next();
};

/**
 * Request size limiter middleware
 * Prevents large payloads that could slow down the system
 */
export const requestSizeLimiter = (maxSizeMB: number = 10) => {
  const maxBytes = maxSizeMB * 1024 * 1024;

  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.headers['content-length'] || '0');

    if (contentLength > maxBytes) {
      return res.status(413).json({
        error: 'Payload Too Large',
        message: `Request body size must not exceed ${maxSizeMB}MB`,
        maxSize: `${maxSizeMB}MB`,
      });
    }

    next();
  };
};

/**
 * Query complexity limiter
 * Prevents complex queries with too many filters or includes
 */
export const queryComplexityLimiter = (req: Request, res: Response, next: NextFunction) => {
  const queryParams = Object.keys(req.query);
  const maxQueryParams = 20;

  if (queryParams.length > maxQueryParams) {
    return res.status(400).json({
      error: 'Query Too Complex',
      message: `Too many query parameters. Maximum ${maxQueryParams} allowed.`,
      provided: queryParams.length,
    });
  }

  next();
};
