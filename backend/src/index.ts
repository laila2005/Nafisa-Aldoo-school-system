import express from 'express';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import { sequelize, testConnection } from './database/connection';
import { connectRedis } from './config/redis';
import { localizationMiddleware } from './middleware/localization.middleware';
import { tenantMiddleware } from './middleware/tenant.middleware';
import {
  performanceMiddleware,
  requestSizeLimiter,
  queryComplexityLimiter,
} from './middleware/performance.middleware';
import routes from './routes';
import { setupAssociations } from './models/associations';
setupAssociations();

dotenv.config({ path: '.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Performance & Security Middleware
app.use(compression()); // Compress responses
app.use(express.json({ limit: '10mb' })); // Limit JSON payload
app.use(requestSizeLimiter(10)); // Limit request size to 10MB
app.use(queryComplexityLimiter); // Prevent complex queries
app.use(performanceMiddleware); // Track response times
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Localization middleware - must be before routes
app.use(localizationMiddleware);

// Multi-tenant middleware - sets school context for each request
app.use(tenantMiddleware);

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Start server
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
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
