/**
 * Script to verify the new Prisma schema models and types are available
 */

import { PrismaClient, ClientType, PacketType, PacketStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function verifySchema() {
  console.log('✓ Verifying Prisma schema updates...\n');

  // Verify new enums
  console.log('✓ ClientType enum values:');
  console.log('  -', ClientType.NUTRITION_ONLY);
  console.log('  -', ClientType.WORKOUT_ONLY);
  console.log('  -', ClientType.FULL_PROGRAM);
  console.log('  -', ClientType.ATHLETE_PERFORMANCE);
  console.log('  -', ClientType.YOUTH);
  console.log('  -', ClientType.GENERAL_WELLNESS);
  console.log('  -', ClientType.SPECIAL_SITUATION);

  console.log('\n✓ PacketType enum values:');
  console.log('  -', PacketType.INTRO);
  console.log('  -', PacketType.NUTRITION);
  console.log('  -', PacketType.WORKOUT);
  console.log('  -', PacketType.PERFORMANCE);
  console.log('  -', PacketType.YOUTH);
  console.log('  -', PacketType.RECOVERY);
  console.log('  -', PacketType.WELLNESS);

  console.log('\n✓ PacketStatus enum values:');
  console.log('  -', PacketStatus.PENDING);
  console.log('  -', PacketStatus.GENERATING);
  console.log('  -', PacketStatus.READY);
  console.log('  -', PacketStatus.FAILED);

  // Verify new models exist
  console.log('\n✓ Verifying new models exist:');
  
  // Check IntakeProgress model
  const intakeProgressCount = await prisma.intakeProgress.count();
  console.log('  - IntakeProgress model: ✓ (count:', intakeProgressCount, ')');

  // Check QuestionBlock model
  const questionBlockCount = await prisma.questionBlock.count();
  console.log('  - QuestionBlock model: ✓ (count:', questionBlockCount, ')');

  // Check IntakePath model
  const intakePathCount = await prisma.intakePath.count();
  console.log('  - IntakePath model: ✓ (count:', intakePathCount, ')');

  // Check PacketTemplate model
  const packetTemplateCount = await prisma.packetTemplate.count();
  console.log('  - PacketTemplate model: ✓ (count:', packetTemplateCount, ')');

  // Check IntakeAnalytics model
  const intakeAnalyticsCount = await prisma.intakeAnalytics.count();
  console.log('  - IntakeAnalytics model: ✓ (count:', intakeAnalyticsCount, ')');

  console.log('\n✓ All schema updates verified successfully!');
  console.log('\nNew Client fields available:');
  console.log('  - clientType, intakeCompletedAt, intakeResponses');
  console.log('  - sport, position, competitionLevel, seasonPhase, trainingAge');
  console.log('  - strengthBenchmarks, powerMetrics, speedMetrics, conditioningMetrics');
  console.log('  - injuryLocation, painPatterns, aggravatingPositions');
  console.log('  - medicalClearance, mobilityLimitations, recoveryGoals');

  console.log('\nNew Packet fields available:');
  console.log('  - content, pdfUrl, templateId, generatedBy, generationMethod');
  console.log('  - retryCount, version, previousVersionId');
}

verifySchema()
  .catch((error) => {
    console.error('❌ Error verifying schema:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
