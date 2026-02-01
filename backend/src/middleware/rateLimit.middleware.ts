import type { Request, Response, NextFunction } from 'express';
import { cache } from '../config/redis.js';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string;
}

/**
 * Rate limiting middleware
 * Limits requests per school to prevent abuse
 */
export const rateLimitMiddleware = (config: RateLimitConfig) => {
  const { windowMs, maxRequests, message = 'Too many requests, please try again later' } = config;

  return async (req: Request, res: Response, next: NextFunction) => {
    // Get identifier (school ID or IP address)
    const schoolId = (req as any).schoolId || 'global';
    const identifier = schoolId !== 'global' ? schoolId : req.ip || 'unknown';
    const key = `ratelimit:${identifier}:${Math.floor(Date.now() / windowMs)}`;

    try {
      // Get current count
      const currentCount = (await cache.get<number>(key)) || 0;

      if (currentCount >= maxRequests) {
        res.setHeader('X-RateLimit-Limit', maxRequests.toString());
        res.setHeader('X-RateLimit-Remaining', '0');
        res.setHeader('Retry-After', Math.ceil(windowMs / 1000).toString());

        return res.status(429).json({
          error: 'Too Many Requests',
          message,
          retryAfter: Math.ceil(windowMs / 1000),
        });
      }

      // Increment count
      await cache.set(key, currentCount + 1, Math.ceil(windowMs / 1000));

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', maxRequests.toString());
      res.setHeader('X-RateLimit-Remaining', (maxRequests - currentCount - 1).toString());

      next();
    } catch (error) {
      // If Redis fails, allow the request (fail open)
      console.error('Rate limit error:', error);
      next();
    }
  };
};

/**
 * Predefined rate limit configs for different endpoints
 */
export const rateLimits = {
  // Strict limit for auth endpoints
  auth: rateLimitMiddleware({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Too many login attempts, please try again in 15 minutes',
  }),

  // Standard API limit
  api: rateLimitMiddleware({
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 100,
  }),

  // Generous limit for read operations
  read: rateLimitMiddleware({
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 200,
  }),

  // Strict limit for write operations
  write: rateLimitMiddleware({
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 50,
  }),
};
