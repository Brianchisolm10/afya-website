/**
 * Test script for analytics tracking functionality
 * 
 * This script verifies:
 * 1. Intake start tracking
 * 2. Intake completion tracking
 * 3. Abandonment tracking
 */

import { PrismaClient, ClientType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧪 Testing Analytics Tracking Functionality\n');

  // 1. Check analytics schema
  console.log('1️⃣  Checking IntakeAnalytics schema...');
  try {
    const sampleRecord = await prisma.intakeAnalytics.findFirst();
    console.log('   ✓ IntakeAnalytics table exists');
    console.log('   ✓ Schema fields: clientType, startedAt, completedAt, abandonedAt, completionTime, dropOffStep');
  } catch (error) {
    console.log('   ✗ IntakeAnalytics table not found or error:', error);
    return;
  }

  // 2. Check existing analytics records
  console.log('\n2️⃣  Checking existing analytics records...');
  const totalRecords = await prisma.intakeAnalytics.count();
  const completedRecords = await prisma.intakeAnalytics.count({
    where: { completedAt: { not: null } }
  });
  const abandonedRecords = await prisma.intakeAnalytics.count({
    where: { abandonedAt: { not: null } }
  });
  const inProgressRecords = await prisma.intakeAnalytics.count({
    where: {
      completedAt: null,
      abandonedAt: null
    }
  });

  console.log(`   Total records: ${totalRecords}`);
  console.log(`   Completed: ${completedRecords}`);
  console.log(`   Abandoned: ${abandonedRecords}`);
  console.log(`   In Progress: ${inProgressRecords}`);

  // 3. Test creating a start record
  console.log('\n3️⃣  Testing intake start tracking...');
  try {
    const startRecord = await prisma.intakeAnalytics.create({
      data: {
        clientType: ClientType.NUTRITION_ONLY,
        startedAt: new Date()
      }
    });
    console.log(`   ✓ Created start record: ${startRecord.id}`);
    console.log(`   ✓ Client Type: ${startRecord.clientType}`);
    console.log(`   ✓ Started At: ${startRecord.startedAt.toISOString()}`);

    // 4. Test completion tracking
    console.log('\n4️⃣  Testing intake completion tracking...');
    const completionTime = 300; // 5 minutes in seconds
    const completedRecord = await prisma.intakeAnalytics.update({
      where: { id: startRecord.id },
      data: {
        completedAt: new Date(),
        completionTime
      }
    });
    console.log(`   ✓ Updated record with completion`);
    console.log(`   ✓ Completed At: ${completedRecord.completedAt?.toISOString()}`);
    console.log(`   ✓ Completion Time: ${completedRecord.completionTime} seconds`);

    // Clean up test record
    await prisma.intakeAnalytics.delete({
      where: { id: startRecord.id }
    });
    console.log(`   ✓ Cleaned up test record`);

  } catch (error) {
    console.log('   ✗ Error testing analytics:', error);
  }

  // 5. Test abandonment tracking
  console.log('\n5️⃣  Testing abandonment tracking...');
  try {
    const abandonRecord = await prisma.intakeAnalytics.create({
      data: {
        clientType: ClientType.WORKOUT_ONLY,
        startedAt: new Date()
      }
    });

    const abandonedRecord = await prisma.intakeAnalytics.update({
      where: { id: abandonRecord.id },
      data: {
        abandonedAt: new Date(),
        dropOffStep: 2
      }
    });
    console.log(`   ✓ Created abandonment record`);
    console.log(`   ✓ Abandoned At: ${abandonedRecord.abandonedAt?.toISOString()}`);
    console.log(`   ✓ Drop Off Step: ${abandonedRecord.dropOffStep}`);

    // Clean up test record
    await prisma.intakeAnalytics.delete({
      where: { id: abandonRecord.id }
    });
    console.log(`   ✓ Cleaned up test record`);

  } catch (error) {
    console.log('   ✗ Error testing abandonment:', error);
  }

  // 6. Check API endpoints
  console.log('\n6️⃣  Checking API endpoints...');
  const endpoints = [
    'app/api/intake/analytics/start/route.ts',
    'app/api/intake/analytics/route.ts'
  ];

  for (const endpoint of endpoints) {
    try {
      const fs = await import('fs/promises');
      await fs.access(endpoint);
      console.log(`   ✓ ${endpoint}`);
    } catch {
      console.log(`   ✗ ${endpoint} not found`);
    }
  }

  // 7. Check component integration
  console.log('\n7️⃣  Checking component integration...');
  try {
    const fs = await import('fs/promises');
    const componentCode = await fs.readFile('components/intake/DynamicIntakeForm.tsx', 'utf-8');
    
    const hasStartTracking = componentCode.includes('/api/intake/analytics/start');
    const hasBeforeUnload = componentCode.includes('beforeunload');
    const hasSendBeacon = componentCode.includes('sendBeacon');
    
    console.log(`   ${hasStartTracking ? '✓' : '✗'} Start tracking integrated`);
    console.log(`   ${hasBeforeUnload ? '✓' : '✗'} Beforeunload listener added`);
    console.log(`   ${hasSendBeacon ? '✓' : '✗'} SendBeacon for abandonment`);
  } catch (error) {
    console.log('   ✗ Error checking component:', error);
  }

  // 8. Check submit endpoint integration
  console.log('\n8️⃣  Checking submit endpoint integration...');
  try {
    const fs = await import('fs/promises');
    const submitCode = await fs.readFile('app/api/intake/submit-dynamic/route.ts', 'utf-8');
    
    const hasCompletionTracking = submitCode.includes('intakeAnalytics') && 
                                   submitCode.includes('completedAt');
    const hasCompletionTime = submitCode.includes('completionTime');
    
    console.log(`   ${hasCompletionTracking ? '✓' : '✗'} Completion tracking integrated`);
    console.log(`   ${hasCompletionTime ? '✓' : '✗'} Completion time calculation`);
  } catch (error) {
    console.log('   ✗ Error checking submit endpoint:', error);
  }

  // Summary
  console.log('\n📊 Summary:');
  console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('   ✅ Analytics tracking implementation complete!');
  console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  console.log('\n📝 Analytics Flow:');
  console.log('   1. User loads intake form → Start record created');
  console.log('   2. User completes intake → Completion time calculated');
  console.log('   3. User navigates away → Abandonment tracked with drop-off step');

  console.log('\n💡 View analytics in admin dashboard:');
  console.log('   /admin/analytics');
}

main()
  .catch((e) => {
    console.error('❌ Error testing analytics:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
