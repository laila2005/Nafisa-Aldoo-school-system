import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize, testConnection } from './database/connection';
import { localizationMiddleware } from './middleware/localization.middleware';
import { tenantMiddleware } from './middleware/tenant.middleware';
import routes from './routes';
import { setupAssociations } from './models/associations';
setupAssociations();

dotenv.config({ path: '.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));

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
