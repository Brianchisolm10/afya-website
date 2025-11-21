/**
 * Verification script to check if all seed data is properly loaded
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Verifying seed data...\n');

  // Check Question Blocks
  const questionBlockCount = await prisma.questionBlock.count();
  const questionBlocks = await prisma.questionBlock.findMany({
    select: { id: true, name: true, category: true }
  });
  
  console.log('📋 Question Blocks:');
  console.log(`   Total: ${questionBlockCount}`);
  questionBlocks.forEach(block => {
    console.log(`   ✓ ${block.name} (${block.category})`);
  });

  // Check Intake Paths
  const intakePathCount = await prisma.intakePath.count();
  const intakePaths = await prisma.intakePath.findMany({
    select: { clientType: true, name: true, isActive: true }
  });
  
  console.log('\n🛤️  Intake Paths:');
  console.log(`   Total: ${intakePathCount}`);
  intakePaths.forEach(path => {
    console.log(`   ✓ ${path.name} (${path.clientType}) - ${path.isActive ? 'Active' : 'Inactive'}`);
  });

  // Check Packet Templates
  const templateCount = await prisma.packetTemplate.count();
  const templates = await prisma.packetTemplate.findMany({
    select: { name: true, packetType: true, isDefault: true }
  });
  
  console.log('\n📄 Packet Templates:');
  console.log(`   Total: ${templateCount}`);
  templates.forEach(template => {
    console.log(`   ✓ ${template.name} (${template.packetType}) - ${template.isDefault ? 'Default' : 'Custom'}`);
  });

  // Summary
  console.log('\n✅ Verification Summary:');
  console.log(`   Question Blocks: ${questionBlockCount} (Expected: 15)`);
  console.log(`   Intake Paths: ${intakePathCount} (Expected: 7)`);
  console.log(`   Packet Templates: ${templateCount} (Expected: 6)`);
  
  const allCorrect = questionBlockCount === 15 && intakePathCount === 7 && templateCount === 6;
  
  if (allCorrect) {
    console.log('\n🎉 All seed data verified successfully!');
  } else {
    console.log('\n⚠️  Some seed data may be missing or incorrect.');
  }
}

main()
  .catch((e) => {
    console.error('❌ Error verifying seed data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
