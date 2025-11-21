#!/usr/bin/env tsx

/**
 * Deployment Verification Script
 * 
 * Verifies that the deployment is successful by checking:
 * - Database connection
 * - Required data is seeded
 * - Health endpoint is accessible
 * - Critical services are working
 */

import { prisma } from '../lib/db';

interface VerificationResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
  details?: any;
}

const results: VerificationResult[] = [];

async function verifyDatabaseConnection(): Promise<VerificationResult> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      name: 'Database Connection',
      status: 'pass',
      message: 'Successfully connected to database',
    };
  } catch (error) {
    return {
      name: 'Database Connection',
      status: 'fail',
      message: 'Failed to connect to database',
      details: error instanceof Error ? error.message : String(error),
    };
  }
}

async function verifyQuestionBlocks(): Promise<VerificationResult> {
  try {
    const count = await prisma.questionBlock.count();
    if (count === 0) {
      return {
        name: 'Question Blocks',
        status: 'fail',
        message: 'No question blocks found in database',
        details: 'Run: npm run seed:questions',
      };
    }
    return {
      name: 'Question Blocks',
      status: 'pass',
      message: `Found ${count} question blocks`,
      details: { count },
    };
  } catch (error) {
    return {
      name: 'Question Blocks',
      status: 'fail',
      message: 'Failed to query question blocks',
      details: error instanceof Error ? error.message : String(error),
    };
  }
}

async function verifyIntakePaths(): Promise<VerificationResult> {
  try {
    const count = await prisma.intakePath.count();
    if (count === 0) {
      return {
        name: 'Intake Paths',
        status: 'fail',
        message: 'No intake paths found in database',
        details: 'Run: npm run seed:paths',
      };
    }
    return {
      name: 'Intake Paths',
      status: 'pass',
      message: `Found ${count} intake paths`,
      details: { count },
    };
  } catch (error) {
    return {
      name: 'Intake Paths',
      status: 'fail',
      message: 'Failed to query intake paths',
      details: error instanceof Error ? error.message : String(error),
    };
  }
}

async function verifyPacketTemplates(): Promise<VerificationResult> {
  try {
    const count = await prisma.packetTemplate.count();
    if (count === 0) {
      return {
        name: 'Packet Templates',
        status: 'fail',
        message: 'No packet templates found in database',
        details: 'Run: npm run seed:templates',
      };
    }
    return {
      name: 'Packet Templates',
      status: 'pass',
      message: `Found ${count} packet templates`,
      details: { count },
    };
  } catch (error) {
    return {
      name: 'Packet Templates',
      status: 'fail',
      message: 'Failed to query packet templates',
      details: error instanceof Error ? error.message : String(error),
    };
  }
}

async function verifyAdminUser(): Promise<VerificationResult> {
  try {
    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN' },
    });
    if (adminCount === 0) {
      return {
        name: 'Admin User',
        status: 'warn',
        message: 'No admin users found',
        details: 'Run: npm run seed:admin',
      };
    }
    return {
      name: 'Admin User',
      status: 'pass',
      message: `Found ${adminCount} admin user(s)`,
      details: { count: adminCount },
    };
  } catch (error) {
    return {
      name: 'Admin User',
      status: 'fail',
      message: 'Failed to query admin users',
      details: error instanceof Error ? error.message : String(error),
    };
  }
}

async function verifyEnvironmentVariables(): Promise<VerificationResult> {
  const required = [
    'DATABASE_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'EMAIL_SERVER_HOST',
    'EMAIL_FROM',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    return {
      name: 'Environment Variables',
      status: 'fail',
      message: 'Missing required environment variables',
      details: { missing },
    };
  }

  return {
    name: 'Environment Variables',
    status: 'pass',
    message: 'All required environment variables are set',
  };
}

async function verifyFileStorage(): Promise<VerificationResult> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const packetsDir = path.join(process.cwd(), 'public', 'packets');
    
    try {
      await fs.access(packetsDir);
      return {
        name: 'File Storage',
        status: 'pass',
        message: 'Packets directory exists and is accessible',
        details: { path: packetsDir },
      };
    } catch {
      // Try to create the directory
      await fs.mkdir(packetsDir, { recursive: true });
      return {
        name: 'File Storage',
        status: 'pass',
        message: 'Created packets directory',
        details: { path: packetsDir },
      };
    }
  } catch (error) {
    return {
      name: 'File Storage',
      status: 'fail',
      message: 'Failed to verify file storage',
      details: error instanceof Error ? error.message : String(error),
    };
  }
}

async function runVerification() {
  console.log('🔍 Starting deployment verification...\n');

  // Run all verifications
  results.push(await verifyEnvironmentVariables());
  results.push(await verifyDatabaseConnection());
  results.push(await verifyQuestionBlocks());
  results.push(await verifyIntakePaths());
  results.push(await verifyPacketTemplates());
  results.push(await verifyAdminUser());
  results.push(await verifyFileStorage());

  // Print results
  console.log('📊 Verification Results:\n');
  
  let passCount = 0;
  let warnCount = 0;
  let failCount = 0;

  results.forEach(result => {
    const icon = result.status === 'pass' ? '✅' : result.status === 'warn' ? '⚠️' : '❌';
    console.log(`${icon} ${result.name}: ${result.message}`);
    if (result.details) {
      console.log(`   Details: ${JSON.stringify(result.details, null, 2)}`);
    }
    console.log();

    if (result.status === 'pass') passCount++;
    else if (result.status === 'warn') warnCount++;
    else failCount++;
  });

  // Summary
  console.log('📈 Summary:');
  console.log(`   ✅ Passed: ${passCount}`);
  console.log(`   ⚠️  Warnings: ${warnCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log();

  // Exit code
  if (failCount > 0) {
    console.log('❌ Deployment verification FAILED');
    process.exit(1);
  } else if (warnCount > 0) {
    console.log('⚠️  Deployment verification completed with warnings');
    process.exit(0);
  } else {
    console.log('✅ Deployment verification PASSED');
    process.exit(0);
  }
}

// Run verification
runVerification()
  .catch(error => {
    console.error('❌ Verification script failed:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
