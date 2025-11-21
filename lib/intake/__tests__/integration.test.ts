/**
 * Integration Tests for Dynamic Intake and Packet System
 * 
 * Tests the complete flow from intake submission through packet generation
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { IntakeService } from '../intake-service';
import { PacketRoutingService } from '../packet-routing-service';
import { PacketGenerationService } from '../packet-generation-service';
import { IntakeResponses } from '@/types/intake';

const prisma = new PrismaClient();

// Test data
const testUserId = 'test-user-integration-' + Date.now();
const testEmail = `test-${Date.now()}@example.com`;

// Helper to create test user
async function createTestUser() {
  return await prisma.user.create({
    data: {
      id: testUserId,
      email: testEmail,
      name: 'Test User',
      role: 'CLIENT',
      status: 'ACTIVE',
      hashedPassword: 'test-hash',
    }
  });
}

// Helper to cleanup test data
async function cleanupTestData() {
  try {
    // Delete in correct order due to foreign key constraints
    await prisma.intakeProgress.deleteMany({
      where: { client: { userId: testUserId } }
    });
    
    await prisma.packet.deleteMany({
      where: { client: { userId: testUserId } }
    });
    
    await prisma.client.deleteMany({
      where: { userId: testUserId }
    });
    
    await prisma.user.deleteMany({
      where: { id: testUserId }
    });
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}

describe('Integration Tests: Intake Submission Flow', () => {
  beforeAll(async () => {
    await cleanupTestData();
    await createTestUser();
  });

  afterAll(async () => {
    await cleanupTestData();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up any existing client/packet data before each test
    await prisma.intakeProgress.deleteMany({
      where: { client: { userId: testUserId } }
    });
    await prisma.packet.deleteMany({
      where: { client: { userId: testUserId } }
    });
    await prisma.client.deleteMany({
      where: { userId: testUserId }
    });
  });

  test('complete NUTRITION_ONLY intake submission flow', async () => {
    const responses: IntakeResponses = {
      'full-name': 'John Doe',
      'email': testEmail,
      'primary-goal': 'lose weight',
      'activity-level': 'moderately-active',
      'diet-type': 'omnivore',
      'food-allergies': 'none',
      'meals-per-day': '3',
      'water-intake-oz': '80',
      'height-inches': '70',
      'weight-lbs': '180',
      'gender': 'male',
      'date-of-birth': '1990-01-01'
    };

    // Submit intake
    const { client, requiresPackets } = await IntakeService.submitIntake(
      testUserId,
      'NUTRITION_ONLY',
      responses
    );

    // Verify client was created
    expect(client).toBeDefined();
    expect(client.fullName).toBe('John Doe');
    expect(client.clientType).toBe('NUTRITION_ONLY');
    expect(client.intakeCompletedAt).toBeDefined();
    expect(requiresPackets).toBe(true);

    // Verify intake progress was marked complete
    const progress = await prisma.intakeProgress.findUnique({
      where: { clientId: client.id }
    });
    expect(progress).toBeDefined();
    expect(progress?.isComplete).toBe(true);

    // Route packets
    const { packetIds, packetTypes } = await PacketRoutingService.routePacketsForClient(
      client.id,
      'NUTRITION_ONLY',
      responses
    );

    // Verify correct packet was routed
    expect(packetIds).toHaveLength(1);
    expect(packetTypes).toContain('NUTRITION');

    // Verify packet was created in database
    const packets = await prisma.packet.findMany({
      where: { clientId: client.id }
    });
    expect(packets).toHaveLength(1);
    expect(packets[0].type).toBe('NUTRITION');
    expect(packets[0].status).toBe('PENDING');
  });

  test('complete WORKOUT_ONLY intake submission flow', async () => {
    const responses: IntakeResponses = {
      'full-name': 'Jane Smith',
      'email': testEmail,
      'primary-goal': 'build muscle',
      'training-experience': 'intermediate',
      'days-per-week': '4',
      'session-duration': '60',
      'available-equipment': ['dumbbells', 'barbell', 'bench'],
      'workout-location': 'gym',
      'injuries': 'none',
      'height-inches': '65',
      'weight-lbs': '140',
      'gender': 'female'
    };

    const { client } = await IntakeService.submitIntake(
      testUserId,
      'WORKOUT_ONLY',
      responses
    );

    expect(client.clientType).toBe('WORKOUT_ONLY');

    const { packetTypes } = await PacketRoutingService.routePacketsForClient(
      client.id,
      'WORKOUT_ONLY',
      responses
    );

    expect(packetTypes).toContain('WORKOUT');
    expect(packetTypes).not.toContain('NUTRITION');
  });

  test('complete FULL_PROGRAM intake submission flow', async () => {
    const responses: IntakeResponses = {
      'full-name': 'Bob Johnson',
      'email': testEmail,
      'primary-goal': 'overall fitness',
      'activity-level': 'active',
      'training-experience': 'beginner',
      'days-per-week': '3',
      'diet-type': 'vegetarian',
      'food-allergies': 'dairy',
      'meals-per-day': '4',
      'height-inches': '72',
      'weight-lbs': '200',
      'gender': 'male'
    };

    const { client } = await IntakeService.submitIntake(
      testUserId,
      'FULL_PROGRAM',
      responses
    );

    expect(client.clientType).toBe('FULL_PROGRAM');

    const { packetTypes } = await PacketRoutingService.routePacketsForClient(
      client.id,
      'FULL_PROGRAM',
      responses
    );

    expect(packetTypes).toHaveLength(2);
    expect(packetTypes).toContain('NUTRITION');
    expect(packetTypes).toContain('WORKOUT');
  });

  test('complete ATHLETE_PERFORMANCE intake submission flow', async () => {
    const responses: IntakeResponses = {
      'full-name': 'Mike Athlete',
      'email': testEmail,
      'sport': 'basketball',
      'position': 'guard',
      'competition-level': 'college',
      'season-phase': 'off-season',
      'training-age': '5',
      'include-nutrition': 'yes',
      'height-inches': '75',
      'weight-lbs': '190',
      'gender': 'male'
    };

    const { client } = await IntakeService.submitIntake(
      testUserId,
      'ATHLETE_PERFORMANCE',
      responses
    );

    expect(client.clientType).toBe('ATHLETE_PERFORMANCE');

    const { packetTypes } = await PacketRoutingService.routePacketsForClient(
      client.id,
      'ATHLETE_PERFORMANCE',
      responses
    );

    expect(packetTypes).toContain('PERFORMANCE');
    expect(packetTypes).toContain('NUTRITION');
  });

  test('handles intake validation errors', async () => {
    const invalidResponses: IntakeResponses = {
      // Missing required fields
      'email': testEmail
    };

    await expect(
      IntakeService.submitIntake(testUserId, 'NUTRITION_ONLY', invalidResponses)
    ).rejects.toThrow();
  });

  test('handles invalid client type', async () => {
    const responses: IntakeResponses = {
      'full-name': 'Test User',
      'email': testEmail
    };

    await expect(
      IntakeService.submitIntake(testUserId, 'INVALID_TYPE', responses)
    ).rejects.toThrow('Invalid client type');
  });
});

describe('Integration Tests: Packet Generation Pipeline', () => {
  let testClient: any;
  let testPacket: any;

  beforeAll(async () => {
    await cleanupTestData();
    await createTestUser();

    // Create test client with complete data
    testClient = await prisma.client.create({
      data: {
        userId: testUserId,
        fullName: 'Test Client',
        email: testEmail,
        clientType: 'NUTRITION_ONLY',
        intakeCompletedAt: new Date(),
        intakeResponses: {
          'primary-goal': 'lose weight',
          'activity-level': 'moderately-active',
          'diet-type': 'omnivore'
        },
        goal: 'lose weight',
        activityLevel: 'moderately-active',
        dietType: 'omnivore',
        heightInches: 70,
        weightLbs: 180,
        gender: 'male',
        daysPerWeek: 3,
        trainingExperience: 'beginner'
      }
    });

    // Create test packet
    testPacket = await prisma.packet.create({
      data: {
        clientId: testClient.id,
        type: 'NUTRITION',
        status: 'PENDING'
      }
    });
  });

  afterAll(async () => {
    await cleanupTestData();
    await prisma.$disconnect();
  });

  test('generates nutrition packet content', async () => {
    const content = await PacketGenerationService.generatePacket(
      testClient.id,
      'NUTRITION'
    );

    expect(content).toBeDefined();
    expect(content.sections).toBeDefined();
    expect(content.sections.length).toBeGreaterThan(0);
    
    // Verify sections contain expected content
    const sectionTitles = content.sections.map(s => s.title);
    expect(sectionTitles).toContain('Your Nutrition Overview');
  });

  test('generates workout packet content', async () => {
    // Update client for workout packet
    await prisma.client.update({
      where: { id: testClient.id },
      data: {
        clientType: 'WORKOUT_ONLY',
        availableEquipment: 'full gym',
        workoutLocation: 'gym'
      }
    });

    const content = await PacketGenerationService.generatePacket(
      testClient.id,
      'WORKOUT'
    );

    expect(content).toBeDefined();
    expect(content.sections).toBeDefined();
    
    const sectionTitles = content.sections.map(s => s.title);
    expect(sectionTitles).toContain('Your Training Program');
  });

  test('saves generated packet content to database', async () => {
    const content = await PacketGenerationService.generatePacket(
      testClient.id,
      'NUTRITION'
    );

    await PacketGenerationService.savePacketContent(testPacket.id, content);

    const updatedPacket = await prisma.packet.findUnique({
      where: { id: testPacket.id }
    });

    expect(updatedPacket?.status).toBe('READY');
    expect(updatedPacket?.content).toBeDefined();
  });

  test('handles packet generation errors gracefully', async () => {
    const invalidClientId = 'non-existent-client-id';

    await expect(
      PacketGenerationService.generatePacket(invalidClientId, 'NUTRITION')
    ).rejects.toThrow('Client not found');
  });

  test('generates packet with calculated values', async () => {
    const content = await PacketGenerationService.generatePacket(
      testClient.id,
      'NUTRITION'
    );

    // Check that calculated values are present in content
    const contentStr = JSON.stringify(content);
    expect(contentStr).toContain('calories');
    expect(contentStr.length).toBeGreaterThan(100);
  });
});

describe('Integration Tests: Progress Tracking', () => {
  let testClient: any;

  beforeAll(async () => {
    await cleanupTestData();
    await createTestUser();

    testClient = await prisma.client.create({
      data: {
        userId: testUserId,
        fullName: 'Progress Test Client',
        email: testEmail,
        clientType: 'FULL_PROGRAM'
      }
    });
  });

  afterAll(async () => {
    await cleanupTestData();
    await prisma.$disconnect();
  });

  test('saves intake progress', async () => {
    const responses: IntakeResponses = {
      'full-name': 'Progress Test',
      'email': testEmail,
      'primary-goal': 'test goal'
    };

    await IntakeService.saveProgress(testClient.id, {
      selectedPath: 'FULL_PROGRAM',
      currentStep: 5,
      totalSteps: 10,
      responses,
      isComplete: false
    });

    const progress = await prisma.intakeProgress.findUnique({
      where: { clientId: testClient.id }
    });

    expect(progress).toBeDefined();
    expect(progress?.currentStep).toBe(5);
    expect(progress?.totalSteps).toBe(10);
    expect(progress?.isComplete).toBe(false);
  });

  test('updates existing progress', async () => {
    // First save
    await IntakeService.saveProgress(testClient.id, {
      currentStep: 3,
      responses: { 'step-1': 'answer-1' }
    });

    // Update
    await IntakeService.saveProgress(testClient.id, {
      currentStep: 7,
      responses: { 'step-1': 'answer-1', 'step-2': 'answer-2' }
    });

    const progress = await prisma.intakeProgress.findUnique({
      where: { clientId: testClient.id }
    });

    expect(progress?.currentStep).toBe(7);
    expect(progress?.responses).toHaveProperty('step-2');
  });

  test('marks progress as complete', async () => {
    await IntakeService.saveProgress(testClient.id, {
      currentStep: 10,
      totalSteps: 10,
      isComplete: true,
      responses: { 'final-step': 'complete' }
    });

    const progress = await prisma.intakeProgress.findUnique({
      where: { clientId: testClient.id }
    });

    expect(progress?.isComplete).toBe(true);
  });
});

describe('Integration Tests: End-to-End Scenarios', () => {
  beforeAll(async () => {
    await cleanupTestData();
    await createTestUser();
  });

  afterAll(async () => {
    await cleanupTestData();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.intakeProgress.deleteMany({
      where: { client: { userId: testUserId } }
    });
    await prisma.packet.deleteMany({
      where: { client: { userId: testUserId } }
    });
    await prisma.client.deleteMany({
      where: { userId: testUserId }
    });
  });

  test('complete user journey: intake to packet generation', async () => {
    // Step 1: User submits intake
    const responses: IntakeResponses = {
      'full-name': 'Complete Journey User',
      'email': testEmail,
      'primary-goal': 'lose weight',
      'activity-level': 'moderately-active',
      'diet-type': 'omnivore',
      'food-allergies': 'none',
      'meals-per-day': '3',
      'height-inches': '68',
      'weight-lbs': '170',
      'gender': 'female'
    };

    const { client } = await IntakeService.submitIntake(
      testUserId,
      'NUTRITION_ONLY',
      responses
    );

    expect(client).toBeDefined();

    // Step 2: Packets are routed
    const { packetIds } = await PacketRoutingService.routePacketsForClient(
      client.id,
      'NUTRITION_ONLY',
      responses
    );

    expect(packetIds).toHaveLength(1);

    // Step 3: Packet content is generated
    const content = await PacketGenerationService.generatePacket(
      client.id,
      'NUTRITION'
    );

    expect(content).toBeDefined();
    expect(content.sections).toBeDefined();

    // Step 4: Packet is saved
    await PacketGenerationService.savePacketContent(packetIds[0], content);

    // Step 5: Verify final state
    const finalPacket = await prisma.packet.findUnique({
      where: { id: packetIds[0] },
      include: { client: true }
    });

    expect(finalPacket?.status).toBe('READY');
    expect(finalPacket?.content).toBeDefined();
    expect(finalPacket?.client.fullName).toBe('Complete Journey User');
  });

  test('handles multiple packet types for FULL_PROGRAM', async () => {
    const responses: IntakeResponses = {
      'full-name': 'Full Program User',
      'email': testEmail,
      'primary-goal': 'overall fitness',
      'activity-level': 'active',
      'training-experience': 'intermediate',
      'days-per-week': '4',
      'diet-type': 'omnivore',
      'meals-per-day': '3',
      'height-inches': '72',
      'weight-lbs': '185',
      'gender': 'male'
    };

    const { client } = await IntakeService.submitIntake(
      testUserId,
      'FULL_PROGRAM',
      responses
    );

    const { packetIds, packetTypes } = await PacketRoutingService.routePacketsForClient(
      client.id,
      'FULL_PROGRAM',
      responses
    );

    expect(packetIds).toHaveLength(2);

    // Generate both packets
    for (let i = 0; i < packetIds.length; i++) {
      const content = await PacketGenerationService.generatePacket(
        client.id,
        packetTypes[i]
      );
      await PacketGenerationService.savePacketContent(packetIds[i], content);
    }

    // Verify both packets are ready
    const packets = await prisma.packet.findMany({
      where: { clientId: client.id }
    });

    expect(packets).toHaveLength(2);
    expect(packets.every((p: any) => p.status === 'READY')).toBe(true);
  });

  test('handles client updating intake after initial submission', async () => {
    // Initial submission
    const initialResponses: IntakeResponses = {
      'full-name': 'Update Test User',
      'email': testEmail,
      'primary-goal': 'lose weight',
      'activity-level': 'sedentary',
      'diet-type': 'omnivore',
      'height-inches': '66',
      'weight-lbs': '160',
      'gender': 'female'
    };

    const { client: initialClient } = await IntakeService.submitIntake(
      testUserId,
      'NUTRITION_ONLY',
      initialResponses
    );

    // Updated submission
    const updatedResponses: IntakeResponses = {
      ...initialResponses,
      'activity-level': 'moderately-active',
      'weight-lbs': '155'
    };

    const { client: updatedClient } = await IntakeService.submitIntake(
      testUserId,
      'NUTRITION_ONLY',
      updatedResponses
    );

    // Should update existing client, not create new one
    expect(updatedClient.id).toBe(initialClient.id);
    expect(updatedClient.activityLevel).toBe('moderately-active');
    expect(updatedClient.weightLbs).toBe(155);
  });
});
