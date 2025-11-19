/**
 * Seed script for question blocks
 * 
 * This script populates the database with all predefined question blocks
 * for the dynamic intake system.
 * 
 * Run with: npx tsx prisma/seed-question-blocks.ts
 */

import { PrismaClient } from '@prisma/client';
import { allQuestionBlocks } from '../lib/intake/question-blocks';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting question blocks seed...');
  
  // Clear existing question blocks
  console.log('Clearing existing question blocks...');
  await prisma.questionBlock.deleteMany({});
  
  // Insert all question blocks
  console.log(`Inserting ${allQuestionBlocks.length} question blocks...`);
  
  for (const block of allQuestionBlocks) {
    await prisma.questionBlock.create({
      data: {
        id: block.id,
        name: block.name,
        category: block.category,
        questions: block.questions as any, // Prisma Json type
        order: block.order,
        isActive: block.isActive
      }
    });
    console.log(`  ✓ Created: ${block.name}`);
  }
  
  console.log('\n✅ Question blocks seed completed successfully!');
  console.log(`Total blocks created: ${allQuestionBlocks.length}`);
  
  // Display summary by category
  const categories = [...new Set(allQuestionBlocks.map(b => b.category))];
  console.log('\nBlocks by category:');
  for (const category of categories) {
    const count = allQuestionBlocks.filter(b => b.category === category).length;
    console.log(`  ${category}: ${count} blocks`);
  }
}

main()
  .catch((e) => {
    console.error('Error seeding question blocks:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
