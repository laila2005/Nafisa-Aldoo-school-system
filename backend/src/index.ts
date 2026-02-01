import express from 'express';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { sequelize, testConnection } from './database/connection';
import { connectRedis } from './config/redis';
import { validateEnv } from './config/env';
import { localizationMiddleware } from './middleware/localization.middleware';
import { tenantMiddleware } from './middleware/tenant.middleware';
import {
  performanceMiddleware,
  requestSizeLimiter,
  queryComplexityLimiter,
} from './middleware/performance.middleware';
import {
  securityHeaders,
  hppProtection,
  globalRateLimiter,
  sanitizeRequest,
  securityLogger,
  configureTrustedProxies,
} from './middleware/security.middleware';
import { auditMiddleware } from './utils/auditLogger';
import routes from './routes';
import { setupAssociations } from './models/associations';
setupAssociations();

dotenv.config({ path: '.env' });

// Validate environment variables before starting
validateEnv();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Trust proxy (required for rate limiting and IP detection behind load balancers)
configureTrustedProxies(app);

// ==================== SECURITY MIDDLEWARE (OWASP) ====================

// 1. Security Headers (Helmet.js)
app.use(securityHeaders);

// 2. HTTP Parameter Pollution Protection
app.use(hppProtection);

// 3. CORS Configuration - Strict policy
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Whitelist of allowed origins
      const allowedOrigins = [FRONTEND_URL, 'http://localhost:3000', 'http://localhost:3001'];

      if (process.env.NODE_ENV === 'production') {
        // In production, only allow configured frontend URL
        if (origin === FRONTEND_URL) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      } else {
        // In development, allow localhost variants
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    },
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
    maxAge: 86400, // Cache preflight for 24 hours
  })
);

// 4. Cookie Parser (for CSRF tokens)
app.use(cookieParser());

// 5. Body Parsers with Size Limits
app.use(express.json({ limit: '10mb' })); // Limit JSON payload
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 6. Request Size Limiter
app.use(requestSizeLimiter(10)); // Limit request size to 10MB

// 7. Query Complexity Limiter
app.use(queryComplexityLimiter); // Prevent complex queries

// 8. Compression
app.use(compression()); // Compress responses

// 9. Input Sanitization (Anti-XSS, NoSQL Injection)
app.use(sanitizeRequest);

// 10. Security Event Logger
app.use(securityLogger);

// 11. Global Rate Limiter
app.use(globalRateLimiter);

// 12. Audit Logging
app.use(auditMiddleware);

// ==================== APPLICATION MIDDLEWARE ====================

// Performance Middleware
app.use(performanceMiddleware); // Track response times

// Localization middleware - must be before routes
app.use(localizationMiddleware);

// Multi-tenant middleware - sets school context for each request
app.use(tenantMiddleware);

// ==================== ROUTES ====================

app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ==================== ERROR HANDLING ====================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: 'The requested resource was not found',
  });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Error:', err);

  // Don't expose error details in production
  const message =
    process.env.NODE_ENV === 'production' ? 'An internal error occurred' : err.message;

  res.status(err.status || 500).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ==================== SERVER STARTUP ====================

const startServer = async () => {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) throw new Error('Database connection failed');

    // Connect to Redis (optional - system works without it)
    await connectRedis().catch((err) => {
      console.warn('⚠️  Starting without Redis cache');
    });

    // Note: Using alter: false to prevent automatic schema changes
    // Run database-migration.sql manually in Supabase for schema updates
    await sequelize.sync({ alter: false });
    console.log('✓ Database connection verified');

    app.listen(PORT, () => {
      console.log('');
      console.log('='.repeat(60));
      console.log('🔒 SECURE School Management System');
      console.log('='.repeat(60));
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ API available at http://localhost:${PORT}/api`);
      console.log(`✓ Environment: ${process.env.NODE_ENV}`);
      console.log(`✓ Security: OWASP compliant`);
      console.log('='.repeat(60));
      console.log('');
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
