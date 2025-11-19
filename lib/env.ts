/**
 * Environment Variable Validation
 * 
 * This module validates that all required environment variables are present
 * and properly formatted. It should be imported early in the application
 * lifecycle to catch configuration errors before runtime.
 */

interface EnvironmentVariables {
  DATABASE_URL: string;
  NEXTAUTH_URL: string;
  NEXTAUTH_SECRET: string;
  EMAIL_SERVER_HOST: string;
  EMAIL_SERVER_PORT: string;
  EMAIL_SERVER_USER: string;
  EMAIL_SERVER_PASSWORD: string;
  EMAIL_FROM: string;
  WEBHOOK_SECRET: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

/**
 * Validates that a required environment variable is present
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}\n` +
      `Please check your .env file or environment configuration.`
    );
  }
  return value;
}

/**
 * Validates that an environment variable is a valid URL
 */
function validateUrl(name: string, value: string): void {
  try {
    new URL(value);
  } catch (error) {
    throw new Error(
      `Invalid URL for environment variable ${name}: ${value}\n` +
      `Please provide a valid URL (e.g., https://example.com)`
    );
  }
}

/**
 * Validates that an environment variable is a valid email address
 */
function validateEmail(name: string, value: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    throw new Error(
      `Invalid email address for environment variable ${name}: ${value}\n` +
      `Please provide a valid email address.`
    );
  }
}

/**
 * Validates that an environment variable is a valid port number
 */
function validatePort(name: string, value: string): void {
  const port = parseInt(value, 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error(
      `Invalid port number for environment variable ${name}: ${value}\n` +
      `Please provide a valid port number between 1 and 65535.`
    );
  }
}

/**
 * Validates all required environment variables
 * Throws an error if any required variables are missing or invalid
 */
export function validateEnv(): EnvironmentVariables {
  // Required variables
  const DATABASE_URL = requireEnv('DATABASE_URL');
  const NEXTAUTH_URL = requireEnv('NEXTAUTH_URL');
  const NEXTAUTH_SECRET = requireEnv('NEXTAUTH_SECRET');
  const EMAIL_SERVER_HOST = requireEnv('EMAIL_SERVER_HOST');
  const EMAIL_SERVER_PORT = requireEnv('EMAIL_SERVER_PORT');
  const EMAIL_SERVER_USER = requireEnv('EMAIL_SERVER_USER');
  const EMAIL_SERVER_PASSWORD = requireEnv('EMAIL_SERVER_PASSWORD');
  const EMAIL_FROM = requireEnv('EMAIL_FROM');
  const WEBHOOK_SECRET = requireEnv('WEBHOOK_SECRET');

  // Validate formats
  validateUrl('NEXTAUTH_URL', NEXTAUTH_URL);
  validateEmail('EMAIL_FROM', EMAIL_FROM);
  validatePort('EMAIL_SERVER_PORT', EMAIL_SERVER_PORT);

  // Validate secret lengths (minimum 32 characters for security)
  if (NEXTAUTH_SECRET.length < 32) {
    console.warn(
      'WARNING: NEXTAUTH_SECRET should be at least 32 characters long for security.\n' +
      'Generate a secure secret with: openssl rand -base64 32'
    );
  }

  if (WEBHOOK_SECRET.length < 32) {
    console.warn(
      'WARNING: WEBHOOK_SECRET should be at least 32 characters long for security.\n' +
      'Generate a secure secret with: openssl rand -base64 32'
    );
  }

  // Get NODE_ENV with fallback
  const NODE_ENV = (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test';

  // Production-specific validations
  if (NODE_ENV === 'production') {
    if (!NEXTAUTH_URL.startsWith('https://')) {
      throw new Error(
        'NEXTAUTH_URL must use HTTPS in production.\n' +
        `Current value: ${NEXTAUTH_URL}`
      );
    }

    if (NEXTAUTH_SECRET === 'your-secret-key-here') {
      throw new Error(
        'NEXTAUTH_SECRET must be changed from the default value in production.\n' +
        'Generate a secure secret with: openssl rand -base64 32'
      );
    }

    if (WEBHOOK_SECRET === 'your-webhook-secret-here') {
      throw new Error(
        'WEBHOOK_SECRET must be changed from the default value in production.\n' +
        'Generate a secure secret with: openssl rand -base64 32'
      );
    }
  }

  return {
    DATABASE_URL,
    NEXTAUTH_URL,
    NEXTAUTH_SECRET,
    EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT,
    EMAIL_SERVER_USER,
    EMAIL_SERVER_PASSWORD,
    EMAIL_FROM,
    WEBHOOK_SECRET,
    NODE_ENV,
  };
}

/**
 * Validated environment variables
 * Import this object to access type-safe environment variables
 */
export const env = validateEnv();
