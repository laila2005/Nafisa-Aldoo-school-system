import { createClient } from 'redis';

// Check if Redis is enabled
const isRedisEnabled = Boolean(process.env.REDIS_URL);

// Redis client for caching (optional)
const redisClient = isRedisEnabled
  ? createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      ...(process.env.REDIS_PASSWORD && { password: process.env.REDIS_PASSWORD }),
      socket: {
        reconnectStrategy: (retries) => {
          // Stop retrying after 3 attempts to prevent spam
          if (retries > 3) {
            console.warn('⚠️  Redis unavailable. Running without cache.');
            return new Error('Redis connection failed');
          }
          return Math.min(retries * 500, 2000);
        },
      },
    })
  : null;

// Only set up event listeners if Redis is enabled
if (redisClient) {
  redisClient.on('error', (err) => {
    // Suppress spam - only log once
    if (err.message.includes('ECONNREFUSED')) {
      console.warn('⚠️  Redis connection refused. Running without cache.');
    } else {
      console.error('Redis Error:', err.message);
    }
  });

  redisClient.on('connect', () => {
    console.log('✓ Redis connected successfully');
  });

  redisClient.on('ready', () => {
    console.log('✓ Redis ready for caching');
  });
}

// Connect to Redis
export const connectRedis = async () => {
  if (!isRedisEnabled) {
    console.log('ℹ️  Redis disabled (no REDIS_URL configured). Running without cache.');
    return;
  }

  try {
    if (redisClient) {
      await redisClient.connect();
    }
  } catch (error: any) {
    console.warn('⚠️  Redis connection failed. System will run without caching.');
    // Don't throw - system should work without Redis
  }
};

// Cache helper functions (gracefully handle when Redis is unavailable)
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      if (!redisClient || !redisClient.isOpen) return null;
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      // Fail silently - system works without cache
      return null;
    }
  },

  async set(key: string, value: any, ttl: number = 300): Promise<void> {
    try {
      if (!redisClient || !redisClient.isOpen) return;
      await redisClient.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
      // Fail silently - system works without cache
    }
  },

  async del(key: string): Promise<void> {
    try {
      if (!redisClient || !redisClient.isOpen) return;
      await redisClient.del(key);
    } catch (error) {
      // Fail silently
    }
  },

  async delPattern(pattern: string): Promise<void> {
    try {
      if (!redisClient || !redisClient.isOpen) return;
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (error) {
      // Fail silently
    }
  },
};

export default redisClient;
