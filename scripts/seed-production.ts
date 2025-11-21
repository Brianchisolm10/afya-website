#!/usr/bin/env tsx

/**
 * Production Seeding Script
 * 
 * Seeds initial data for AFYA Website V2 production deployment:
 * - Products (shop items)
 * - Community Stats (initial counters)
 * - Placeholder content
 */

import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

interface SeedResult {
  name: string;
  success: boolean;
  error?: string;
}

const results: SeedResult[] = [];

async function runSeedScript(name: string, scriptPath: string): Promise<void> {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🌱 Seeding: ${name}`);
  console.log('='.repeat(60) + '\n');

  try {
    execSync(`npx tsx ${scriptPath}`, { stdio: 'inherit' });
    results.push({ name, success: true });
  } catch (error) {
    console.error(`\n❌ Failed to seed ${name}`);
    results.push({ 
      name, 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function seedPlaceholderContent(): Promise<void> {
  console.log('\n' + '='.repeat(60));
  console.log('🌱 Seeding: Placeholder Content');
  console.log('='.repeat(60) + '\n');

  try {
    // Check if we need to seed any placeholder content
    // This could include default blog posts, FAQs, etc.
    
    console.log('ℹ️  No placeholder content to seed at this time.');
    console.log('   Content can be added through the admin panel.');
    
    results.push({ name: 'Placeholder Content', success: true });
  } catch (error) {
    console.error('❌ Failed to seed placeholder content:', error);
    results.push({ 
      name: 'Placeholder Content', 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function verifySeeding(): Promise<void> {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 Verifying Seeded Data');
  console.log('='.repeat(60) + '\n');

  try {
    // Verify products
    const productCount = await prisma.product.count();
    console.log(`✅ Products: ${productCount} items`);
    
    if (productCount === 0) {
      console.log('⚠️  WARNING: No products found. Shop may not function correctly.');
    }

    // Verify community stats
    const communityStats = await prisma.communityStats.findFirst();
    if (communityStats) {
      console.log(`✅ Community Stats: Initialized`);
      console.log(`   - Minutes Moved: ${communityStats.totalMinutesMoved.toLocaleString()}`);
      console.log(`   - Clients Served: ${communityStats.totalClientsServed.toLocaleString()}`);
      console.log(`   - Donations Raised: $${communityStats.totalDonationsRaised.toLocaleString()}`);
      console.log(`   - Gear Donated: ${communityStats.totalGearDonated.toLocaleString()} items`);
    } else {
      console.log('⚠️  WARNING: Community stats not initialized.');
    }

    // Verify intake paths (should already exist from previous seeding)
    const intakePathCount = await prisma.intakePath.count();
    console.log(`✅ Intake Paths: ${intakePathCount} paths`);

    // Verify question blocks
    const questionBlockCount = await prisma.questionBlock.count();
    console.log(`✅ Question Blocks: ${questionBlockCount} blocks`);

    // Verify packet templates
    const templateCount = await prisma.packetTemplate.count();
    console.log(`✅ Packet Templates: ${templateCount} templates`);

  } catch (error) {
    console.error('❌ Error verifying seeded data:', error);
  }
}

async function printSummary(): Promise<void> {
  console.log('\n' + '='.repeat(60));
  console.log('📊 SEEDING SUMMARY');
  console.log('='.repeat(60) + '\n');

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  results.forEach(result => {
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} ${result.name}`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log(`Total: ${results.length} | Success: ${successful} | Failed: ${failed}`);
  console.log('='.repeat(60) + '\n');

  if (failed > 0) {
    console.log('⚠️  Some seeding operations failed. Please review the errors above.');
    console.log('   You may need to run individual seed scripts manually.\n');
  } else {
    console.log('🎉 All seeding operations completed successfully!\n');
    console.log('Next steps:');
    console.log('  1. Verify the application is working correctly');
    console.log('  2. Add additional products through the admin panel');
    console.log('  3. Configure content pages as needed');
    console.log('  4. Test the complete user flow\n');
  }
}

async function main() {
  console.log('\n' + '╔' + '═'.repeat(58) + '╗');
  console.log('║' + ' '.repeat(58) + '║');
  console.log('║' + '     AFYA Website V2 - Production Seeding Script'.padEnd(58) + '║');
  console.log('║' + ' '.repeat(58) + '║');
  console.log('╚' + '═'.repeat(58) + '╝\n');

  const nodeEnv = process.env.NODE_ENV || 'development';
  console.log(`📦 Environment: ${nodeEnv}\n`);

  if (nodeEnv === 'production') {
    console.log('⚠️  WARNING: Running in PRODUCTION mode!');
    console.log('   This will seed data in your production database.\n');
  }

  // Run all seeding operations
  await runSeedScript('Products', 'prisma/seed-products.ts');
  await runSeedScript('Community Stats', 'scripts/seed-community-stats.ts');
  await seedPlaceholderContent();

  // Verify all seeded data
  await verifySeeding();

  // Print summary
  await printSummary();
}

main()
  .catch((error) => {
    console.error('\n❌ Fatal error during seeding:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
