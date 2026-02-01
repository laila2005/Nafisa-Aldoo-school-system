import type { Request, Response, NextFunction } from 'express';
import { cache } from '../config/redis.js';

/**
 * Cache middleware for GET requests
 * Usage: app.get('/api/schools', cacheMiddleware(300), handler)
 */
export const cacheMiddleware = (ttl: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Generate cache key based on URL, query params, and school context
    const schoolId = (req as any).schoolId || 'global';
    const cacheKey = `cache:${schoolId}:${req.originalUrl}`;

    try {
      // Try to get from cache
      const cachedData = await cache.get(cacheKey);

      if (cachedData) {
        res.setHeader('X-Cache', 'HIT');
        return res.json(cachedData);
      }

      // Not in cache, continue to handler
      res.setHeader('X-Cache', 'MISS');

      // Override res.json to cache the response
      const originalJson = res.json.bind(res);
      res.json = function (data: any) {
        // Cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          cache.set(cacheKey, data, ttl).catch(console.error);
        }
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

/**
 * Clear cache for a specific school
 */
export const clearSchoolCache = async (schoolId: string) => {
  await cache.delPattern(`cache:${schoolId}:*`);
};

/**
 * Clear cache for specific resource
 */
export const clearResourceCache = async (schoolId: string, resource: string) => {
  await cache.delPattern(`cache:${schoolId}:*/${resource}*`);
};
