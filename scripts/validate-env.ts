#!/usr/bin/env tsx

/**
 * Environment Variable Validation Script
 * 
 * Validates that all required environment variables are set correctly
 * for the current environment (development, staging, production)
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env') });

interface EnvCheck {
  name: string;
  required: boolean;
  validator?: (value: string) => boolean;
  errorMessage?: string;
}

const ENV_CHECKS: EnvCheck[] = [
  // Database
  {
    name: 'DATABASE_URL',
    required: true,
    validator: (value) => value.startsWith('postgresql://'),
    errorMessage: 'DATABASE_URL must be a valid PostgreSQL connection string'
  },
  
  // Authentication
  {
    name: 'NEXTAUTH_URL',
    required: true,
    validator: (value) => value.startsWith('http://') || value.startsWith('https://'),
    errorMessage: 'NEXTAUTH_URL must be a valid URL'
  },
  {
    name: 'NEXTAUTH_SECRET',
    required: true,
    validator: (value) => value.length >= 32,
    errorMessage: 'NEXTAUTH_SECRET must be at least 32 characters long'
  },
  
  // Email
  {
    name: 'EMAIL_SERVER_HOST',
    required: true
  },
  {
    name: 'EMAIL_SERVER_PORT',
    required: true,
    validator: (value) => !isNaN(Number(value)) && Number(value) > 0,
    errorMessage: 'EMAIL_SERVER_PORT must be a valid port number'
  },
  {
    name: 'EMAIL_SERVER_USER',
    required: true
  },
  {
    name: 'EMAIL_SERVER_PASSWORD',
    required: true
  },
  {
    name: 'EMAIL_FROM',
    required: true,
    validator: (value) => value.includes('@'),
    errorMessage: 'EMAIL_FROM must be a valid email address'
  },
  
  // Stripe
  {
    name: 'STRIPE_SECRET_KEY',
    required: true,
    validator: (value) => value.startsWith('sk_'),
    errorMessage: 'STRIPE_SECRET_KEY must start with sk_'
  },
  {
    name: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    required: true,
    validator: (value) => value.startsWith('pk_'),
    errorMessage: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must start with pk_'
  },
  {
    name: 'STRIPE_WEBHOOK_SECRET',
    required: true,
    validator: (value) => value.startsWith('whsec_'),
    errorMessage: 'STRIPE_WEBHOOK_SECRET must start with whsec_'
  },
  {
    name: 'NEXT_PUBLIC_APP_URL',
    required: true,
    validator: (value) => value.startsWith('http://') || value.startsWith('https://'),
    errorMessage: 'NEXT_PUBLIC_APP_URL must be a valid URL'
  },
  
  // Webhook Security
  {
    name: 'WEBHOOK_SECRET',
    required: true,
    validator: (value) => value.length >= 32,
    errorMessage: 'WEBHOOK_SECRET must be at least 32 characters long'
  },
  
  // Feature Flags (optional but should be set)
  {
    name: 'NEXT_PUBLIC_SHOP_ENABLED',
    required: false
  },
  {
    name: 'NEXT_PUBLIC_GEAR_DRIVE_ENABLED',
    required: false
  },
  {
    name: 'NEXT_PUBLIC_EQUIPMENT_DONATION_ENABLED',
    required: false
  },
  {
    name: 'NEXT_PUBLIC_COMMUNITY_STATS_ENABLED',
    required: false
  }
];

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function validateEnvironment(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  console.log('🔍 Validating environment variables...\n');
  
  // Check Node environment
  const nodeEnv = process.env.NODE_ENV || 'development';
  console.log(`📦 Environment: ${nodeEnv}\n`);
  
  // Validate each environment variable
  for (const check of ENV_CHECKS) {
    const value = process.env[check.name];
    
    if (!value) {
      if (check.required) {
        errors.push(`❌ ${check.name} is required but not set`);
      } else {
        warnings.push(`⚠️  ${check.name} is not set (optional)`);
      }
      continue;
    }
    
    // Run custom validator if provided
    if (check.validator && !check.validator(value)) {
      errors.push(
        `❌ ${check.name} is invalid: ${check.errorMessage || 'Validation failed'}`
      );
      continue;
    }
    
    console.log(`✅ ${check.name}`);
  }
  
  // Production-specific checks
  if (nodeEnv === 'production') {
    console.log('\n🔒 Running production-specific checks...\n');
    
    // Check for test keys in production
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (stripeSecret?.startsWith('sk_test_')) {
      errors.push('❌ Using Stripe TEST keys in production! Use live keys (sk_live_...)');
    }
    
    const stripePublic = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (stripePublic?.startsWith('pk_test_')) {
      errors.push('❌ Using Stripe TEST publishable key in production! Use live key (pk_live_...)');
    }
    
    // Check for localhost URLs
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (appUrl?.includes('localhost')) {
      errors.push('❌ NEXT_PUBLIC_APP_URL contains localhost in production!');
    }
    
    const nextAuthUrl = process.env.NEXTAUTH_URL;
    if (nextAuthUrl?.includes('localhost')) {
      errors.push('❌ NEXTAUTH_URL contains localhost in production!');
    }
    
    // Check for SSL in database URL
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl && !dbUrl.includes('sslmode=require')) {
      warnings.push('⚠️  DATABASE_URL should include sslmode=require in production');
    }
    
    // Check debug mode
    if (process.env.DEBUG_MODE === 'true') {
      errors.push('❌ DEBUG_MODE is enabled in production! This exposes sensitive information.');
    }
    
    // Check log level
    const logLevel = process.env.LOG_LEVEL;
    if (logLevel === 'debug') {
      warnings.push('⚠️  LOG_LEVEL is set to "debug" in production. Consider using "info" or "warn".');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

function printResults(result: ValidationResult): void {
  console.log('\n' + '='.repeat(60));
  console.log('VALIDATION RESULTS');
  console.log('='.repeat(60) + '\n');
  
  if (result.warnings.length > 0) {
    console.log('⚠️  WARNINGS:\n');
    result.warnings.forEach(warning => console.log(warning));
    console.log('');
  }
  
  if (result.errors.length > 0) {
    console.log('❌ ERRORS:\n');
    result.errors.forEach(error => console.log(error));
    console.log('');
  }
  
  if (result.valid) {
    console.log('✅ All required environment variables are valid!\n');
  } else {
    console.log('❌ Environment validation failed. Please fix the errors above.\n');
  }
}

// Run validation
const result = validateEnvironment();
printResults(result);

// Exit with appropriate code
process.exit(result.valid ? 0 : 1);
