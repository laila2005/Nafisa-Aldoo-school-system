import dotenv from 'dotenv';

dotenv.config();

/**
 * Environment Variable Validation
 * Ensures all required environment variables are present and valid
 */

interface EnvConfig {
  // Server
  NODE_ENV: string;
  PORT: number;
  FRONTEND_URL: string;

  // Database
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;

  // JWT
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;

  // Redis
  REDIS_HOST?: string;
  REDIS_PORT?: number;
  REDIS_PASSWORD?: string;

  // Security
  BCRYPT_ROUNDS: number;
  MAX_LOGIN_ATTEMPTS: number;
  LOCKOUT_DURATION: number;

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
}

/**
 * Validate environment variables
 */
export function validateEnv(): EnvConfig {
  const errors: string[] = [];

  // Required variables
  const requiredVars = [
    'NODE_ENV',
    'PORT',
    'FRONTEND_URL',
    'DB_HOST',
    'DB_PORT',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
    'JWT_SECRET',
  ];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  }

  // Validate NODE_ENV
  const validEnvs = ['development', 'production', 'test'];
  if (process.env.NODE_ENV && !validEnvs.includes(process.env.NODE_ENV)) {
    errors.push(
      `Invalid NODE_ENV: ${process.env.NODE_ENV}. Must be one of: ${validEnvs.join(', ')}`
    );
  }

  // Validate PORT
  const port = parseInt(process.env.PORT || '0');
  if (isNaN(port) || port < 1 || port > 65535) {
    errors.push(`Invalid PORT: ${process.env.PORT}. Must be between 1 and 65535`);
  }

  // Validate DB_PORT
  const dbPort = parseInt(process.env.DB_PORT || '0');
  if (isNaN(dbPort) || dbPort < 1 || dbPort > 65535) {
    errors.push(`Invalid DB_PORT: ${process.env.DB_PORT}. Must be between 1 and 65535`);
  }

  // Validate JWT_SECRET strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET must be at least 32 characters long for security');
  }

  // Check for default/weak secrets in production
  if (process.env.NODE_ENV === 'production') {
    const weakSecrets = ['your-secret-key', 'secret', 'change-this', 'password', '123456'];

    if (
      process.env.JWT_SECRET &&
      weakSecrets.some((weak) => process.env.JWT_SECRET?.toLowerCase().includes(weak))
    ) {
      errors.push(
        'JWT_SECRET appears to be a default/weak value. Use a strong secret in production'
      );
    }

    if (
      process.env.DB_PASSWORD &&
      weakSecrets.some((weak) => process.env.DB_PASSWORD?.toLowerCase().includes(weak))
    ) {
      errors.push('DB_PASSWORD appears to be weak. Use a strong password in production');
    }

    // Ensure HTTPS in production
    if (process.env.FRONTEND_URL && !process.env.FRONTEND_URL.startsWith('https://')) {
      console.warn('⚠️  WARNING: FRONTEND_URL should use HTTPS in production for security');
    }
  }

  // Throw error if validation failed
  if (errors.length > 0) {
    console.error('❌ Environment validation failed:');
    errors.forEach((error) => console.error(`   - ${error}`));
    throw new Error('Environment validation failed. Please check your .env file.');
  }

  // Return validated config
  const config: EnvConfig = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '5000'),
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

    DB_HOST: process.env.DB_HOST!,
    DB_PORT: parseInt(process.env.DB_PORT || '5432'),
    DB_NAME: process.env.DB_NAME!,
    DB_USER: process.env.DB_USER!,
    DB_PASSWORD: process.env.DB_PASSWORD!,

    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,

    BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12'),
    MAX_LOGIN_ATTEMPTS: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5'),
    LOCKOUT_DURATION: parseInt(process.env.LOCKOUT_DURATION || '900000'), // 15 minutes

    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  };

  console.log('✅ Environment variables validated successfully');

  // Log configuration (excluding sensitive data)
  if (config.NODE_ENV === 'development') {
    console.log('📋 Configuration:');
    console.log(`   - Environment: ${config.NODE_ENV}`);
    console.log(`   - Port: ${config.PORT}`);
    console.log(`   - Database: ${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`);
    console.log(`   - Frontend URL: ${config.FRONTEND_URL}`);
    console.log(`   - JWT Expiry: ${config.JWT_EXPIRES_IN}`);
  }

  return config;
}

/**
 * Get environment config
 */
export function getEnvConfig(): EnvConfig {
  return validateEnv();
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Get database connection string (without password for logging)
 */
export function getDbConnectionString(includePassword: boolean = false): string {
  const config = getEnvConfig();
  const password = includePassword ? config.DB_PASSWORD : '****';
  return `postgresql://${config.DB_USER}:${password}@${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`;
}
