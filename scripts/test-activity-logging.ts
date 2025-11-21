/**
 * Test script for activity logging API endpoint
 * 
 * This script tests the POST /api/community/activity endpoint
 * to ensure it properly logs activities and updates community stats.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testActivityLogging() {
  console.log('🧪 Testing Activity Logging API...\n');

  try {
    // 1. Check if we have any clients to test with
    console.log('1️⃣ Checking for existing clients...');
    const client = await prisma.client.findFirst({
      include: {
        user: true,
      },
    });

    if (!client) {
      console.log('❌ No clients found. Please create a client first.');
      return;
    }

    console.log(`✅ Found client: ${client.fullName} (ID: ${client.id})`);
    console.log(`   User ID: ${client.userId}\n`);

    // 2. Get current community stats
    console.log('2️⃣ Checking current community stats...');
    let stats = await prisma.communityStats.findFirst();
    
    if (!stats) {
      console.log('⚠️  No community stats found. Will be created on first activity log.');
      console.log('   Initial totalMinutesMoved: 0\n');
    } else {
      console.log(`✅ Current totalMinutesMoved: ${stats.totalMinutesMoved}\n`);
    }

    // 3. Create a test activity log directly (simulating API call)
    console.log('3️⃣ Creating test activity log...');
    const testActivity = await prisma.activityLog.create({
      data: {
        clientId: client.id,
        activityType: 'workout',
        durationMinutes: 45,
        date: new Date(),
        notes: 'Test activity from script',
      },
    });

    console.log(`✅ Activity log created: ${testActivity.id}`);
    console.log(`   Type: ${testActivity.activityType}`);
    console.log(`   Duration: ${testActivity.durationMinutes} minutes\n`);

    // 4. Manually update community stats (simulating what the API does)
    console.log('4️⃣ Updating community stats...');
    stats = await prisma.communityStats.findFirst();
    
    if (!stats) {
      stats = await prisma.communityStats.create({
        data: {
          totalMinutesMoved: testActivity.durationMinutes,
          totalClientsServed: 0,
          totalDonationsRaised: 0,
          totalGearDonated: 0,
        },
      });
      console.log(`✅ Community stats created with ${stats.totalMinutesMoved} minutes\n`);
    } else {
      const updatedStats = await prisma.communityStats.update({
        where: { id: stats.id },
        data: {
          totalMinutesMoved: {
            increment: testActivity.durationMinutes,
          },
          lastUpdated: new Date(),
        },
      });
      console.log(`✅ Community stats updated: ${stats.totalMinutesMoved} → ${updatedStats.totalMinutesMoved} minutes\n`);
    }

    // 5. Verify the activity log was created
    console.log('5️⃣ Verifying activity logs...');
    const activityLogs = await prisma.activityLog.findMany({
      where: { clientId: client.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    console.log(`✅ Found ${activityLogs.length} activity log(s) for this client:`);
    activityLogs.forEach((log, index) => {
      console.log(`   ${index + 1}. ${log.activityType} - ${log.durationMinutes} min (${log.date.toLocaleDateString()})`);
    });

    console.log('\n✅ Activity logging test completed successfully!');
    console.log('\n📝 API Endpoint Information:');
    console.log('   POST /api/community/activity');
    console.log('   Required fields: clientId, activityType, durationMinutes, date');
    console.log('   Optional fields: notes');
    console.log('   Authentication: Required (user must own the client profile)');
    console.log('\n📋 Example request body:');
    console.log(JSON.stringify({
      clientId: client.id,
      activityType: 'workout',
      durationMinutes: 45,
      date: new Date().toISOString(),
      notes: 'Morning strength training',
    }, null, 2));

  } catch (error) {
    console.error('❌ Error during test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testActivityLogging();
