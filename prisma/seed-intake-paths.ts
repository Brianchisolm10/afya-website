/**
 * Seed script for Intake Paths
 * 
 * This script populates the database with the predefined intake path configurations.
 * Run with: npx tsx prisma/seed-intake-paths.ts
 */

import { PrismaClient } from '@prisma/client';
import { allIntakePaths } from '../lib/intake/intake-paths';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding intake paths...');

  for (const path of allIntakePaths) {
    console.log(`  → Creating path: ${path.name} (${path.clientType})`);
    
    await prisma.intakePath.upsert({
      where: { clientType: path.clientType },
      update: {
        name: path.name,
        description: path.description,
        questionBlocks: path.questionBlockIds,
        branchingRules: path.branchingRules,
        isActive: path.isActive
      },
      create: {
        clientType: path.clientType,
        name: path.name,
        description: path.description,
        questionBlocks: path.questionBlockIds,
        branchingRules: path.branchingRules,
        isActive: path.isActive
      }
    });
  }

  console.log('✅ Intake paths seeded successfully!');
  console.log(`   Total paths: ${allIntakePaths.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding intake paths:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
