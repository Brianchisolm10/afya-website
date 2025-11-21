/**
 * End-to-End Tests for Dynamic Intake and Packet System
 * 
 * Tests complete user journeys from path selection through packet delivery
 * and admin management workflows
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { IntakeService } from '../intake-service';
import { PacketRoutingService } from '../packet-routing-service';
import { PacketGenerationService } from '../packet-generation-service';
import { PDFExportService } from '../pdf-export-service';
import { IntakeResponses } from '@/types/intake';

const prisma = new PrismaClient();

// Test data
const testTimestamp = Date.now();
const testUserId = `e2e-user-${testTimestamp}`;
const testAdminId = `e2e-admin-${testTimestamp}`;
const testEmail = `e2e-${testTimestamp}@example.com`;
const testAdminEmail = `e2e-admin-${testTimestamp}@example.com`;

// Helper to create test user
async function createTestUser(role: 'CLIENT' | 'ADMIN' = 'CLIENT', userId?: string, email?: string) {
  return await prisma.user.create({
    data: {
      id: userId || testUserId,
      email: email || testEmail,
      name: role === 'ADMIN' ? 'Test Admin' : 'Test User',
      role,
      status: 'ACTIVE',
      password: 'test-hash',
    }
  });
}

// Helper to cleanup test data
async function cleanupTestData() {
  try {
    // Delete in correct order due to foreign key constraints
    await prisma.intakeProgress.deleteMany({
      where: { 
        OR: [
          { client: { userId: testUserId } },
          { client: { userId: testAdminId } }
        ]
      }
    });
    
    await prisma.packet.deleteMany({
      where: { 
        OR: [
          { client: { userId: testUserId } },
          { client: { userId: testAdminId } }
        ]
      }
    });
    
    await prisma.client.deleteMany({
      where: { 
        OR: [
          { userId: testUserId },
          { userId: testAdminId }
        ]
      }
    });
    
    await prisma.user.deleteMany({
      where: { 
        id: { in: [testUserId, testAdminId] }
      }
    });
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}

describe('E2E: Complete Intake Flows for All Paths', () => {
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

  test('E2E: NUTRITION_ONLY path - complete journey', async () => {
    // Step 1: User selects Nutrition Only path
    const selectedPath = 'NUTRITION_ONLY';
    
    // Step 2: User fills out nutrition-focused questions
    const responses: IntakeResponses = {
      // Basic Demographics
      'full-name': 'Sarah Nutrition',
      'email': testEmail,
      'date-of-birth': '1992-05-15',
      'gender': 'female',
      'height-inches': '65',
      'weight-lbs': '150',
      // General Goals
      'primary-goal': 'lose-weight',
      'timeline': '3-months',
      'motivation': 'I want to feel healthier and more confident in my body',
      'biggest-struggle': 'Staying consistent with healthy eating habits',
      // Diet Type
      'diet-type': 'vegetarian',
      'eats-animal-products': 'no',
      'meals-per-day': '3',
      'eats-breakfast': 'yes',
      // Allergies & Restrictions
      'food-allergies': 'peanuts',
      // Nutrition Habits
      'water-intake-oz': '64',
      'beverage-consumption': ['water', 'coffee'],
      'typical-day-eating': 'I usually have oatmeal for breakfast, salad for lunch, and pasta for dinner',
      'favorite-meals': 'pasta, salads, stir-fry',
      'cooking-access': 'full-kitchen',
      // Activity Level
      'activity-level': 'moderately-active',
      'daily-movement-pattern': 'desk-job-active-evenings'
    };
    
    // Step 3: Submit intake
    const { client, requiresPackets } = await IntakeService.submitIntake(
      testUserId,
      selectedPath,
      responses
    );
    
    expect(client).toBeDefined();
    expect(client.clientType).toBe('NUTRITION_ONLY');
    expect(client.fullName).toBe('Sarah Nutrition');
    expect(requiresPackets).toBe(true);
    
    // Step 4: System routes packets
    const { packetIds, packetTypes } = await PacketRoutingService.routePacketsForClient(
      client.id,
      selectedPath,
      responses
    );
    
    expect(packetIds).toHaveLength(1);
    expect(packetTypes).toEqual(['NUTRITION']);
    
    // Step 5: System generates packet content
    const content = await PacketGenerationService.generatePacket(
      client.id,
      'NUTRITION'
    );
    
    expect(content).toBeDefined();
    expect(content.sections).toBeDefined();
    expect(content.sections.length).toBeGreaterThan(0);
    
    // Verify nutrition-specific content
    const sectionTitles = content.sections.map(s => s.title);
    expect(sectionTitles).toContain('Your Nutrition Overview');
    
    // Step 6: Save packet content
    await PacketGenerationService.savePacketContent(packetIds[0], content);
    
    // Step 7: Verify packet is ready for client
    const finalPacket = await prisma.packet.findUnique({
      where: { id: packetIds[0] }
    });
    
    expect(finalPacket?.status).toBe('READY');
    expect(finalPacket?.content).toBeDefined();
    
    // Step 8: Client can retrieve their packet
    const clientPackets = await prisma.packet.findMany({
      where: { clientId: client.id, status: 'READY' }
    });
    
    expect(clientPackets).toHaveLength(1);
    expect(clientPackets[0].type).toBe('NUTRITION');
  });

  test('E2E: WORKOUT_ONLY path - complete journey', async () => {
    const selectedPath = 'WORKOUT_ONLY';
    
    const responses: IntakeResponses = {
      // Basic Demographics
      'full-name': 'Mike Fitness',
      'email': testEmail,
      'date-of-birth': '1988-03-20',
      'gender': 'male',
      'height-inches': '72',
      'weight-lbs': '185',
      // General Goals
      'primary-goal': 'gain-muscle',
      'timeline': '6-months',
      'motivation': 'I want to build strength and improve my physique for better health',
      'biggest-struggle': 'Finding time to train consistently with my work schedule',
      // Training Goals
      'training-goal': ['strength', 'muscle-gain'],
      'training-experience': 'intermediate',
      'training-history': 'I have been lifting weights for 3 years with some breaks',
      // Training Schedule
      'days-per-week': '5',
      'session-duration': '60-90',
      'workout-location': 'home-gym',
      // Equipment Access
      'available-equipment': ['dumbbells', 'barbell', 'bench', 'squat-rack'],
      // Health History
      'injuries': 'Previous shoulder injury from 2 years ago, mostly healed',
      'medical-conditions': 'None',
      'medications': 'None',
      'pain-or-discomfort': 'Occasional shoulder discomfort with overhead pressing',
      // Activity Level
      'activity-level': 'active',
      'daily-movement-pattern': 'desk-job-active-evenings',
      // Allergies (for safety)
      'food-allergies': 'none'
    };
    
    const { client } = await IntakeService.submitIntake(
      testUserId,
      selectedPath,
      responses
    );
    
    expect(client.clientType).toBe('WORKOUT_ONLY');
    
    const { packetIds, packetTypes } = await PacketRoutingService.routePacketsForClient(
      client.id,
      selectedPath,
      responses
    );
    
    expect(packetIds).toHaveLength(1);
    expect(packetTypes).toEqual(['WORKOUT']);
    
    const content = await PacketGenerationService.generatePacket(
      client.id,
      'WORKOUT'
    );
    
    expect(content).toBeDefined();
    expect(content.sections).toBeDefined();
    expect(content.sections.length).toBeGreaterThan(0);
    
    await PacketGenerationService.savePacketContent(packetIds[0], content);
    
    const finalPacket = await prisma.packet.findUnique({
      where: { id: packetIds[0] }
    });
    
    expect(finalPacket?.status).toBe('READY');
  });

  test('E2E: FULL_PROGRAM path - complete journey with multiple packets', async () => {
    const selectedPath = 'FULL_PROGRAM';
    
    const responses: IntakeResponses = {
      // Basic Demographics
      'full-name': 'Alex Complete',
      'email': testEmail,
      'date-of-birth': '1995-07-10',
      'gender': 'non-binary',
      'height-inches': '68',
      'weight-lbs': '160',
      // General Goals
      'primary-goal': 'general-fitness',
      'timeline': '6-months',
      'motivation': 'I want to improve my overall health and feel more energetic',
      'biggest-struggle': 'Balancing nutrition and exercise with a busy lifestyle',
      // Training Goals
      'training-goal': ['general-fitness', 'endurance'],
      'training-experience': 'beginner',
      'training-history': 'I am new to structured training but have been active casually',
      // Training Schedule
      'days-per-week': '4',
      'session-duration': '45-60',
      'workout-location': 'home',
      // Equipment Access
      'available-equipment': ['resistance-bands', 'dumbbells'],
      // Diet Type
      'diet-type': 'omnivore',
      'eats-animal-products': 'yes',
      'meals-per-day': '3',
      'eats-breakfast': 'yes',
      // Allergies & Restrictions
      'food-allergies': 'none',
      // Nutrition Habits
      'water-intake-oz': '80',
      'beverage-consumption': ['water', 'tea'],
      'typical-day-eating': 'I eat three balanced meals with occasional snacks',
      'favorite-meals': 'chicken, rice, vegetables, smoothies',
      'cooking-access': 'full-kitchen',
      // Health History
      'injuries': 'None',
      'medical-conditions': 'None',
      'medications': 'None',
      'pain-or-discomfort': 'None',
      // Activity Level
      'activity-level': 'active',
      'daily-movement-pattern': 'mixed-sitting-standing'
    };
    
    const { client } = await IntakeService.submitIntake(
      testUserId,
      selectedPath,
      responses
    );
    
    expect(client.clientType).toBe('FULL_PROGRAM');
    
    const { packetIds, packetTypes } = await PacketRoutingService.routePacketsForClient(
      client.id,
      selectedPath,
      responses
    );
    
    expect(packetIds).toHaveLength(2);
    expect(packetTypes).toContain('NUTRITION');
    expect(packetTypes).toContain('WORKOUT');
    
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
    expect(packets.every(p => p.status === 'READY')).toBe(true);
  });

  test('E2E: ATHLETE_PERFORMANCE path - complete journey', async () => {
    const selectedPath = 'ATHLETE_PERFORMANCE';
    
    const responses: IntakeResponses = {
      // Basic Demographics
      'full-name': 'Jordan Athlete',
      'email': testEmail,
      'date-of-birth': '2002-04-15',
      'gender': 'male',
      'height-inches': '70',
      'weight-lbs': '175',
      // Athlete Profile
      'sport': 'soccer',
      'position': 'midfielder',
      'competition-level': 'college',
      'season-phase': 'pre-season',
      'training-age': '6',
      // General Goals
      'primary-goal': 'improve-performance',
      'timeline': '3-months',
      'motivation': 'I want to improve my speed and endurance for the upcoming season',
      'biggest-struggle': 'Maintaining peak performance throughout the season',
      // Training Schedule
      'days-per-week': '5',
      'session-duration': '90-120',
      'workout-location': 'gym',
      // Equipment Access
      'available-equipment': ['full-gym'],
      // Performance Metrics
      'strength-benchmarks': 'Squat: 225lbs, Bench: 185lbs, Deadlift: 275lbs',
      'power-metrics': 'Vertical Jump: 28in, Broad Jump: 9.5ft',
      // Health History
      'injuries': 'Minor ankle sprain last season, fully recovered',
      'medical-conditions': 'None',
      'medications': 'None',
      'pain-or-discomfort': 'None',
      // Activity Level
      'activity-level': 'very-active',
      'daily-movement-pattern': 'athlete',
      // Nutrition (included)
      'include-nutrition': 'yes',
      'diet-type': 'omnivore',
      'eats-animal-products': 'yes',
      'meals-per-day': '4-5',
      'eats-breakfast': 'yes',
      'food-allergies': 'none',
      'water-intake-oz': '100',
      'beverage-consumption': ['water', 'sports-drinks'],
      'typical-day-eating': 'High protein meals throughout the day with focus on recovery',
      'favorite-meals': 'chicken, rice, pasta, protein shakes',
      'cooking-access': 'full-kitchen'
    };
    
    const { client } = await IntakeService.submitIntake(
      testUserId,
      selectedPath,
      responses
    );
    
    expect(client.clientType).toBe('ATHLETE_PERFORMANCE');
    
    const { packetIds, packetTypes } = await PacketRoutingService.routePacketsForClient(
      client.id,
      selectedPath,
      responses
    );
    
    expect(packetTypes).toContain('PERFORMANCE');
    expect(packetTypes).toContain('NUTRITION');
    
    // Generate performance packet
    const perfContent = await PacketGenerationService.generatePacket(
      client.id,
      'PERFORMANCE'
    );
    
    expect(perfContent).toBeDefined();
    expect(perfContent.sections).toBeDefined();
    expect(perfContent.sections.length).toBeGreaterThan(0);
    
    // Save all packets
    for (let i = 0; i < packetIds.length; i++) {
      const content = await PacketGenerationService.generatePacket(
        client.id,
        packetTypes[i]
      );
      await PacketGenerationService.savePacketContent(packetIds[i], content);
    }
    
    const packets = await prisma.packet.findMany({
      where: { clientId: client.id }
    });
    
    expect(packets.every(p => p.status === 'READY')).toBe(true);
  });

  test('E2E: YOUTH path - complete journey', async () => {
    const selectedPath = 'YOUTH';
    
    const responses: IntakeResponses = {
      // Basic Demographics
      'full-name': 'Tommy Young',
      'email': testEmail,
      'date-of-birth': '2010-03-20',
      'gender': 'male',
      'height-inches': '62',
      'weight-lbs': '120',
      // Youth Profile
      'school-grade': '8',
      'sports-played': 'basketball, track',
      'weekly-activity-hours': '10',
      'parent-name': 'Parent Name',
      'parent-email': 'parent@example.com',
      // General Goals
      'primary-goal': 'improve-performance',
      'timeline': '6-months',
      'motivation': 'I want to get better at basketball and run faster in track',
      'biggest-struggle': 'Sometimes I get tired during games',
      // Training Schedule
      'days-per-week': '3',
      'session-duration': '30-45',
      'workout-location': 'home',
      // Equipment Access
      'available-equipment': ['bodyweight', 'light-dumbbells'],
      // Health History
      'injuries': 'None',
      'medical-conditions': 'None',
      'medications': 'None',
      'pain-or-discomfort': 'None',
      // Allergies
      'food-allergies': 'none'
    };
    
    const { client } = await IntakeService.submitIntake(
      testUserId,
      selectedPath,
      responses
    );
    
    expect(client.clientType).toBe('YOUTH');
    
    const { packetIds, packetTypes } = await PacketRoutingService.routePacketsForClient(
      client.id,
      selectedPath,
      responses
    );
    
    expect(packetTypes).toContain('YOUTH');
    
    const content = await PacketGenerationService.generatePacket(
      client.id,
      'YOUTH'
    );
    
    expect(content).toBeDefined();
    expect(content.sections).toBeDefined();
    expect(content.sections.length).toBeGreaterThan(0);
    
    await PacketGenerationService.savePacketContent(packetIds[0], content);
    
    const finalPacket = await prisma.packet.findUnique({
      where: { id: packetIds[0] }
    });
    
    expect(finalPacket?.status).toBe('READY');
  });

  test('E2E: GENERAL_WELLNESS path - complete journey', async () => {
    const selectedPath = 'GENERAL_WELLNESS';
    
    const responses: IntakeResponses = {
      // Basic Demographics
      'full-name': 'Pat Wellness',
      'email': testEmail,
      'date-of-birth': '1985-09-12',
      'gender': 'female',
      'height-inches': '66',
      'weight-lbs': '155',
      // Wellness Goals
      'wellness-focus': ['energy', 'weight', 'stress'],
      'wellness-barriers': ['time', 'motivation'],
      // Activity Level
      'activity-level': 'lightly-active',
      'daily-movement-pattern': 'mostly-sitting',
      // Training Schedule
      'days-per-week': '3',
      'session-duration': '30-45',
      'workout-location': 'home',
      // Equipment Access
      'available-equipment': ['bodyweight', 'resistance-bands'],
      // Health History
      'injuries': 'None',
      'medical-conditions': 'None',
      'medications': 'None',
      'pain-or-discomfort': 'Occasional lower back stiffness',
      // Diet Type
      'diet-type': 'flexible',
      'eats-animal-products': 'yes',
      'meals-per-day': '3',
      'eats-breakfast': 'sometimes',
      // Allergies
      'food-allergies': 'none',
      // Nutrition Habits
      'water-intake-oz': '50',
      'beverage-consumption': ['water', 'coffee'],
      'typical-day-eating': 'I usually skip breakfast, have lunch at my desk, and dinner at home',
      'favorite-meals': 'pasta, sandwiches, salads',
      'cooking-access': 'full-kitchen'
    };
    
    const { client } = await IntakeService.submitIntake(
      testUserId,
      selectedPath,
      responses
    );
    
    expect(client.clientType).toBe('GENERAL_WELLNESS');
    
    const { packetIds, packetTypes } = await PacketRoutingService.routePacketsForClient(
      client.id,
      selectedPath,
      responses
    );
    
    expect(packetTypes).toContain('WELLNESS');
    
    const content = await PacketGenerationService.generatePacket(
      client.id,
      'WELLNESS'
    );
    
    expect(content).toBeDefined();
    
    await PacketGenerationService.savePacketContent(packetIds[0], content);
    
    const finalPacket = await prisma.packet.findUnique({
      where: { id: packetIds[0] }
    });
    
    expect(finalPacket?.status).toBe('READY');
  });

  test('E2E: SPECIAL_SITUATION path - complete journey', async () => {
    const selectedPath = 'SPECIAL_SITUATION';
    
    const responses: IntakeResponses = {
      // Basic Demographics
      'full-name': 'Chris Recovery',
      'email': testEmail,
      'date-of-birth': '1980-11-05',
      'gender': 'male',
      'height-inches': '69',
      'weight-lbs': '170',
      // Injury Recovery
      'injury-location': 'lower-back',
      'injury-date': '2024-06-01',
      'pain-level': '3',
      'pain-patterns': 'Pain increases with bending forward and sitting for long periods',
      'aggravating-activities': 'Sitting, bending, lifting',
      'aggravating-positions': 'Sitting for long periods, forward bending, twisting',
      'relieving-activities': 'Walking, lying down, stretching',
      'medical-clearance': 'yes',
      'healthcare-provider': 'Dr. Smith, Physical Therapist',
      'current-treatment': 'Physical therapy twice a week',
      'mobility-limitations': 'Limited hip flexion and spinal rotation',
      'recovery-goals': 'Return to running and normal daily activities without pain',
      'activity-tolerance': 'Can walk 30 minutes, light household activities',
      // General Goals
      'primary-goal': 'recover-injury',
      'timeline': '6-months',
      'motivation': 'I want to get back to my active lifestyle and be pain-free',
      'biggest-struggle': 'Managing pain while staying active',
      // Health History
      'injuries': 'Current lower back injury, previous knee injury 5 years ago',
      'medical-conditions': 'None',
      'medications': 'Ibuprofen as needed',
      'pain-or-discomfort': 'Lower back pain, rated 3/10',
      // Activity Level
      'activity-level': 'lightly-active',
      'daily-movement-pattern': 'mostly-sitting',
      // Training Schedule (cleared for exercise)
      'days-per-week': '3',
      'session-duration': '30-45',
      'workout-location': 'home',
      // Equipment Access
      'available-equipment': ['bodyweight', 'resistance-bands'],
      // Allergies
      'food-allergies': 'none'
    };
    
    const { client } = await IntakeService.submitIntake(
      testUserId,
      selectedPath,
      responses
    );
    
    expect(client.clientType).toBe('SPECIAL_SITUATION');
    
    const { packetIds, packetTypes } = await PacketRoutingService.routePacketsForClient(
      client.id,
      selectedPath,
      responses
    );
    
    expect(packetTypes).toContain('RECOVERY');
    
    const content = await PacketGenerationService.generatePacket(
      client.id,
      'RECOVERY'
    );
    
    expect(content).toBeDefined();
    expect(content.sections).toBeDefined();
    expect(content.sections.length).toBeGreaterThan(0);
    
    await PacketGenerationService.savePacketContent(packetIds[0], content);
    
    const finalPacket = await prisma.packet.findUnique({
      where: { id: packetIds[0] }
    });
    
    expect(finalPacket?.status).toBe('READY');
  });
});

describe('E2E: Packet Generation and Delivery', () => {
  let testClient: any;

  beforeAll(async () => {
    await cleanupTestData();
    await createTestUser();
    
    // Create test client
    testClient = await prisma.client.create({
      data: {
        userId: testUserId,
        fullName: 'Delivery Test Client',
        email: testEmail,
        clientType: 'FULL_PROGRAM',
        intakeCompletedAt: new Date(),
        intakeResponses: {
          'primary-goal': 'overall fitness',
          'activity-level': 'active'
        },
        goal: 'overall fitness',
        activityLevel: 'active',
        heightInches: 70,
        weightLbs: 175,
        gender: 'male',
        daysPerWeek: 4,
        trainingExperience: 'intermediate',
        dietType: 'omnivore'
      }
    });
  });

  afterAll(async () => {
    await cleanupTestData();
    await prisma.$disconnect();
  });

  test('E2E: Packet generation and content storage', async () => {
    // Create packet
    const packet = await prisma.packet.create({
      data: {
        clientId: testClient.id,
        type: 'NUTRITION',
        status: 'PENDING'
      }
    });
    
    // Generate content
    const content = await PacketGenerationService.generatePacket(
      testClient.id,
      'NUTRITION'
    );
    
    expect(content).toBeDefined();
    expect(content.sections).toBeDefined();
    
    // Save content
    await PacketGenerationService.savePacketContent(packet.id, content);
    
    // Verify packet is ready
    const updatedPacket = await prisma.packet.findUnique({
      where: { id: packet.id }
    });
    
    expect(updatedPacket?.content).toBeDefined();
    expect(updatedPacket?.status).toBe('READY');
  });

  test('E2E: Multiple packet generation for same client', async () => {
    // Clean up any existing packets for this client first
    await prisma.packet.deleteMany({
      where: { clientId: testClient.id }
    });
    
    // Create multiple packets
    const nutritionPacket = await prisma.packet.create({
      data: {
        clientId: testClient.id,
        type: 'NUTRITION',
        status: 'PENDING'
      }
    });
    
    const workoutPacket = await prisma.packet.create({
      data: {
        clientId: testClient.id,
        type: 'WORKOUT',
        status: 'PENDING'
      }
    });
    
    // Generate both packets
    const nutritionContent = await PacketGenerationService.generatePacket(
      testClient.id,
      'NUTRITION'
    );
    await PacketGenerationService.savePacketContent(nutritionPacket.id, nutritionContent);
    
    const workoutContent = await PacketGenerationService.generatePacket(
      testClient.id,
      'WORKOUT'
    );
    await PacketGenerationService.savePacketContent(workoutPacket.id, workoutContent);
    
    // Verify both packets are ready
    const packets = await prisma.packet.findMany({
      where: { clientId: testClient.id }
    });
    
    expect(packets).toHaveLength(2);
    expect(packets.every(p => p.status === 'READY')).toBe(true);
    
    // Verify each packet has unique content
    const nutritionPkt = packets.find(p => p.type === 'NUTRITION');
    const workoutPkt = packets.find(p => p.type === 'WORKOUT');
    
    expect(nutritionPkt?.content).not.toEqual(workoutPkt?.content);
  });

  test('E2E: Packet regeneration workflow', async () => {
    // Create and generate initial packet
    const packet = await prisma.packet.create({
      data: {
        clientId: testClient.id,
        type: 'NUTRITION',
        status: 'PENDING',
        version: 1
      }
    });
    
    const initialContent = await PacketGenerationService.generatePacket(
      testClient.id,
      'NUTRITION'
    );
    await PacketGenerationService.savePacketContent(packet.id, initialContent);
    
    const initialPacket = await prisma.packet.findUnique({
      where: { id: packet.id }
    });
    
    expect(initialPacket?.version).toBe(1);
    
    // Regenerate packet (simulating admin action)
    await prisma.packet.update({
      where: { id: packet.id },
      data: {
        status: 'PENDING',
        version: { increment: 1 },
        previousVersionId: packet.id
      }
    });
    
    const newContent = await PacketGenerationService.generatePacket(
      testClient.id,
      'NUTRITION'
    );
    await PacketGenerationService.savePacketContent(packet.id, newContent);
    
    const regeneratedPacket = await prisma.packet.findUnique({
      where: { id: packet.id }
    });
    
    expect(regeneratedPacket?.version).toBe(2);
    expect(regeneratedPacket?.status).toBe('READY');
  });
});

describe('E2E: Admin Management Workflows', () => {
  let adminUser: any;
  let testClient: any;
  let testPacket: any;

  beforeAll(async () => {
    await cleanupTestData();
    
    // Create admin user
    adminUser = await createTestUser('ADMIN', testAdminId, testAdminEmail);
    
    // Create regular user
    await createTestUser('CLIENT', testUserId, testEmail);
    
    // Create test client with intake data
    testClient = await prisma.client.create({
      data: {
        userId: testUserId,
        fullName: 'Admin Test Client',
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
        heightInches: 68,
        weightLbs: 165,
        gender: 'female'
      }
    });
    
    // Create test packet
    testPacket = await prisma.packet.create({
      data: {
        clientId: testClient.id,
        type: 'NUTRITION',
        status: 'READY',
        content: {
          sections: [
            { title: 'Overview', content: 'Test content' }
          ]
        }
      }
    });
  });

  afterAll(async () => {
    await cleanupTestData();
    await prisma.$disconnect();
  });

  test('E2E: Admin views all clients and their packets', async () => {
    // Admin queries all clients
    const clients = await prisma.client.findMany({
      include: {
        packets: true
      }
    });
    
    expect(clients.length).toBeGreaterThan(0);
    
    // Find our test client
    const client = clients.find(c => c.id === testClient.id);
    expect(client).toBeDefined();
    expect(client?.packets).toHaveLength(1);
    expect(client?.packets[0].type).toBe('NUTRITION');
  });

  test('E2E: Admin edits packet content', async () => {
    // Admin retrieves packet
    const packet = await prisma.packet.findUnique({
      where: { id: testPacket.id }
    });
    
    expect(packet).toBeDefined();
    
    // Admin modifies content
    const updatedContent = {
      sections: [
        { title: 'Overview', content: 'Updated by admin' },
        { title: 'New Section', content: 'Admin added section' }
      ]
    };
    
    // Save edited content
    await prisma.packet.update({
      where: { id: testPacket.id },
      data: {
        content: updatedContent,
        version: { increment: 1 },
        generatedBy: adminUser.id,
        generationMethod: 'MANUAL'
      }
    });
    
    // Verify changes
    const editedPacket = await prisma.packet.findUnique({
      where: { id: testPacket.id }
    });
    
    expect(editedPacket?.content).toEqual(updatedContent);
    expect(editedPacket?.version).toBe(2);
    expect(editedPacket?.generatedBy).toBe(adminUser.id);
    expect(editedPacket?.generationMethod).toBe('MANUAL');
  });

  test('E2E: Admin triggers packet regeneration', async () => {
    // Create a new packet for regeneration test
    const packet = await prisma.packet.create({
      data: {
        clientId: testClient.id,
        type: 'NUTRITION',
        status: 'READY',
        version: 1,
        content: { sections: [{ title: 'Old', content: 'Old content' }] }
      }
    });
    
    // Admin triggers regeneration
    await prisma.packet.update({
      where: { id: packet.id },
      data: {
        status: 'PENDING',
        previousVersionId: packet.id
      }
    });
    
    // System regenerates packet
    const newContent = await PacketGenerationService.generatePacket(
      testClient.id,
      'NUTRITION'
    );
    
    await prisma.packet.update({
      where: { id: packet.id },
      data: {
        content: newContent,
        status: 'READY',
        version: { increment: 1 }
      }
    });
    
    // Verify regeneration
    const regeneratedPacket = await prisma.packet.findUnique({
      where: { id: packet.id }
    });
    
    expect(regeneratedPacket?.version).toBe(2);
    expect(regeneratedPacket?.status).toBe('READY');
    expect(regeneratedPacket?.content).not.toEqual({ sections: [{ title: 'Old', content: 'Old content' }] });
  });

  test('E2E: Admin manages failed packet generation', async () => {
    // Create a failed packet
    const failedPacket = await prisma.packet.create({
      data: {
        clientId: testClient.id,
        type: 'WORKOUT',
        status: 'FAILED',
        lastError: 'Generation timeout',
        retryCount: 2
      }
    });
    
    // Admin queries failed packets
    const failedPackets = await prisma.packet.findMany({
      where: { status: 'FAILED' },
      include: { client: true }
    });
    
    expect(failedPackets.length).toBeGreaterThan(0);
    
    const packet = failedPackets.find(p => p.id === failedPacket.id);
    expect(packet).toBeDefined();
    expect(packet?.lastError).toBe('Generation timeout');
    
    // Admin manually fixes and regenerates
    await prisma.packet.update({
      where: { id: failedPacket.id },
      data: {
        status: 'PENDING',
        lastError: null,
        retryCount: 0
      }
    });
    
    // Attempt regeneration
    try {
      const content = await PacketGenerationService.generatePacket(
        testClient.id,
        'WORKOUT'
      );
      
      await prisma.packet.update({
        where: { id: failedPacket.id },
        data: {
          content,
          status: 'READY'
        }
      });
    } catch (error) {
      // If generation still fails, mark as failed again
      await prisma.packet.update({
        where: { id: failedPacket.id },
        data: {
          status: 'FAILED',
          lastError: (error as Error).message,
          retryCount: { increment: 1 }
        }
      });
    }
    
    // Verify packet status changed
    const finalPacket = await prisma.packet.findUnique({
      where: { id: failedPacket.id }
    });
    
    expect(finalPacket?.status).not.toBe('PENDING');
  });

  test('E2E: Admin deletes packet', async () => {
    // Create packet to delete
    const packetToDelete = await prisma.packet.create({
      data: {
        clientId: testClient.id,
        type: 'WELLNESS',
        status: 'READY'
      }
    });
    
    const packetId = packetToDelete.id;
    
    // Admin deletes packet
    await prisma.packet.delete({
      where: { id: packetId }
    });
    
    // Verify deletion
    const deletedPacket = await prisma.packet.findUnique({
      where: { id: packetId }
    });
    
    expect(deletedPacket).toBeNull();
  });

  test('E2E: Admin views client intake responses', async () => {
    // Admin retrieves client with full intake data
    const client = await prisma.client.findUnique({
      where: { id: testClient.id },
      include: {
        intakeProgress: true,
        packets: true
      }
    });
    
    expect(client).toBeDefined();
    expect(client?.intakeResponses).toBeDefined();
    expect(client?.intakeCompletedAt).toBeDefined();
    
    // Verify admin can access intake responses
    const responses = client?.intakeResponses as any;
    expect(responses['primary-goal']).toBe('lose weight');
    expect(responses['activity-level']).toBe('moderately-active');
  });

  test('E2E: Admin filters clients by type', async () => {
    // Admin filters by NUTRITION_ONLY
    const nutritionClients = await prisma.client.findMany({
      where: { clientType: 'NUTRITION_ONLY' }
    });
    
    expect(nutritionClients.length).toBeGreaterThan(0);
    expect(nutritionClients.every(c => c.clientType === 'NUTRITION_ONLY')).toBe(true);
    
    // Admin filters by WORKOUT_ONLY
    const workoutClients = await prisma.client.findMany({
      where: { clientType: 'WORKOUT_ONLY' }
    });
    
    // May be 0 if no workout clients exist yet
    if (workoutClients.length > 0) {
      expect(workoutClients.every(c => c.clientType === 'WORKOUT_ONLY')).toBe(true);
    }
    
    // Verify we can filter by client type
    const allClients = await prisma.client.findMany();
    expect(allClients.length).toBeGreaterThan(0);
  });

  test('E2E: Admin views packet generation statistics', async () => {
    // Query packet statistics
    const totalPackets = await prisma.packet.count();
    const readyPackets = await prisma.packet.count({
      where: { status: 'READY' }
    });
    const pendingPackets = await prisma.packet.count({
      where: { status: 'PENDING' }
    });
    const failedPackets = await prisma.packet.count({
      where: { status: 'FAILED' }
    });
    
    expect(totalPackets).toBeGreaterThan(0);
    expect(readyPackets + pendingPackets + failedPackets).toBeLessThanOrEqual(totalPackets);
    
    // Query by packet type
    const nutritionPackets = await prisma.packet.count({
      where: { type: 'NUTRITION' }
    });
    
    expect(nutritionPackets).toBeGreaterThan(0);
  });
});

describe('E2E: Error Handling and Edge Cases', () => {
  beforeAll(async () => {
    await cleanupTestData();
    await createTestUser();
  });

  afterAll(async () => {
    await cleanupTestData();
    await prisma.$disconnect();
  });

  test('E2E: Handle incomplete intake submission', async () => {
    const incompleteResponses: IntakeResponses = {
      'full-name': 'Incomplete User',
      'email': testEmail
      // Missing required fields
    };
    
    await expect(
      IntakeService.submitIntake(testUserId, 'NUTRITION_ONLY', incompleteResponses)
    ).rejects.toThrow();
  });

  test('E2E: Handle duplicate intake submission', async () => {
    const responses: IntakeResponses = {
      'full-name': 'Duplicate Test',
      'email': testEmail,
      'date-of-birth': '1990-01-01',
      'gender': 'male',
      'height-inches': '70',
      'weight-lbs': '170',
      'primary-goal': 'lose-weight',
      'timeline': '3-months',
      'motivation': 'Test motivation for duplicate submission',
      'biggest-struggle': 'Test struggle',
      'diet-type': 'omnivore',
      'eats-animal-products': 'yes',
      'meals-per-day': '3',
      'eats-breakfast': 'yes',
      'food-allergies': 'none',
      'water-intake-oz': '64',
      'beverage-consumption': ['water'],
      'typical-day-eating': 'I eat regular balanced meals throughout the day with healthy snacks',
      'favorite-meals': 'Various',
      'cooking-access': 'full-kitchen',
      'activity-level': 'moderately-active',
      'daily-movement-pattern': 'mixed-sitting-standing'
    };
    
    // First submission
    const { client: firstClient } = await IntakeService.submitIntake(
      testUserId,
      'NUTRITION_ONLY',
      responses
    );
    
    // Second submission (should update, not create new)
    const { client: secondClient } = await IntakeService.submitIntake(
      testUserId,
      'NUTRITION_ONLY',
      { ...responses, 'weight-lbs': '165' }
    );
    
    expect(secondClient.id).toBe(firstClient.id);
    expect(secondClient.weightLbs).toBe(165);
  });

  test('E2E: Handle packet generation for non-existent client', async () => {
    await expect(
      PacketGenerationService.generatePacket('non-existent-id', 'NUTRITION')
    ).rejects.toThrow('Client not found');
  });

  test('E2E: Handle invalid packet type', async () => {
    // Create unique user for this test
    const uniqueUserId = `e2e-invalid-type-${Date.now()}`;
    await prisma.user.create({
      data: {
        id: uniqueUserId,
        email: `invalid-type-${Date.now()}@example.com`,
        name: 'Invalid Type Test User',
        role: 'CLIENT',
        status: 'ACTIVE',
        password: 'test-hash',
      }
    });
    
    const client = await prisma.client.create({
      data: {
        userId: uniqueUserId,
        fullName: 'Invalid Type Test',
        email: `invalid-type-client-${Date.now()}@example.com`,
        clientType: 'NUTRITION_ONLY'
      }
    });
    
    await expect(
      PacketGenerationService.generatePacket(client.id, 'INVALID_TYPE' as any)
    ).rejects.toThrow();
  });

  test('E2E: Handle client with missing required data', async () => {
    // Create unique user for this test
    const uniqueUserId = `e2e-missing-data-${Date.now()}`;
    await prisma.user.create({
      data: {
        id: uniqueUserId,
        email: `missing-data-${Date.now()}@example.com`,
        name: 'Missing Data Test User',
        role: 'CLIENT',
        status: 'ACTIVE',
        password: 'test-hash',
      }
    });
    
    const client = await prisma.client.create({
      data: {
        userId: uniqueUserId,
        fullName: 'Missing Data Test',
        email: `missing-data-client-${Date.now()}@example.com`,
        clientType: 'NUTRITION_ONLY'
        // Missing height, weight, etc.
      }
    });
    
    // Should still generate packet with available data
    const content = await PacketGenerationService.generatePacket(
      client.id,
      'NUTRITION'
    );
    
    expect(content).toBeDefined();
    expect(content.sections).toBeDefined();
  });
});
