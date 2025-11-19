/**
 * Intake Service
 * 
 * Handles intake submission, client profile generation, and intake progress management
 */

import { prisma } from '@/lib/db';
import { IntakeResponses, IntakePathConfig, QuestionBlock, QuestionValidator } from '@/types/intake';
import cacheService from './cache-service';

export class IntakeService {
  /**
   * Get intake path configuration by client type (cached)
   */
  static async getIntakePath(clientType: string): Promise<IntakePathConfig | null> {
    const path = cacheService.getIntakePathByClientType(clientType);
    return path || null;
  }

  /**
   * Get question blocks for a given list of block IDs (cached)
   */
  static async getQuestionBlocks(blockIds: string[]): Promise<QuestionBlock[]> {
    return cacheService.getQuestionBlocksByIds(blockIds);
  }

  /**
   * Save intake progress
   */
  static async saveProgress(
    clientId: string,
    progress: {
      selectedPath?: string;
      currentStep?: number;
      totalSteps?: number;
      responses?: IntakeResponses;
      isComplete?: boolean;
    }
  ): Promise<void> {
    await prisma.intakeProgress.upsert({
      where: { clientId },
      create: {
        clientId,
        selectedPath: progress.selectedPath,
        currentStep: progress.currentStep || 0,
        totalSteps: progress.totalSteps,
        responses: progress.responses || {},
        isComplete: progress.isComplete || false,
        lastSavedAt: new Date()
      },
      update: {
        ...(progress.selectedPath && { selectedPath: progress.selectedPath }),
        ...(progress.currentStep !== undefined && { currentStep: progress.currentStep }),
        ...(progress.totalSteps !== undefined && { totalSteps: progress.totalSteps }),
        ...(progress.responses && { responses: progress.responses }),
        ...(progress.isComplete !== undefined && { isComplete: progress.isComplete }),
        lastSavedAt: new Date()
      }
    });
  }

  /**
   * Validate intake completion
   */
  static validateIntakeCompletion(
    responses: IntakeResponses,
    questionBlocks: QuestionBlock[]
  ): { isValid: boolean; errors: Record<string, string[]> } {
    const allQuestions = questionBlocks.flatMap(block => block.questions);
    return QuestionValidator.validateIntake(allQuestions, responses);
  }

  /**
   * Sanitize intake responses
   */
  static sanitizeResponses(responses: IntakeResponses): IntakeResponses {
    const sanitized: IntakeResponses = {};
    
    for (const [key, value] of Object.entries(responses)) {
      if (value === null || value === undefined) {
        continue;
      }
      
      // Sanitize strings
      if (typeof value === 'string') {
        sanitized[key] = value.trim();
      }
      // Sanitize arrays
      else if (Array.isArray(value)) {
        sanitized[key] = value.map(v => 
          typeof v === 'string' ? v.trim() : v
        );
      }
      // Keep other types as-is
      else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  /**
   * Generate client profile from intake responses
   */
  static async generateClientProfile(
    responses: IntakeResponses,
    clientType: string,
    userId: string
  ): Promise<any> {
    // Sanitize responses
    const sanitizedResponses = this.sanitizeResponses(responses);
    
    // Helper functions for parsing
    const parseOptionalInt = (value?: any): number | undefined => {
      if (!value) return undefined;
      const parsed = parseInt(String(value), 10);
      return isNaN(parsed) ? undefined : parsed;
    };

    const parseOptionalFloat = (value?: any): number | undefined => {
      if (!value) return undefined;
      const parsed = parseFloat(String(value));
      return isNaN(parsed) ? undefined : parsed;
    };

    const parseOptionalBoolean = (value?: any): boolean | undefined => {
      if (value === undefined || value === null || value === '') return undefined;
      if (typeof value === 'boolean') return value;
      return value === 'yes' || value === 'true' || value === true;
    };

    const parseOptionalDate = (value?: any): Date | undefined => {
      if (!value) return undefined;
      const date = new Date(value);
      return isNaN(date.getTime()) ? undefined : date;
    };

    // Map responses to Client model fields
    const clientData: any = {
      user: { connect: { id: userId } },
      fullName: sanitizedResponses['full-name'] || '',
      email: sanitizedResponses['email'] || '',
      clientType,
      intakeCompletedAt: new Date(),
      intakeResponses: sanitizedResponses,
      
      // Basic demographics
      gender: sanitizedResponses['gender'],
      dateOfBirth: parseOptionalDate(sanitizedResponses['date-of-birth']),
      heightInches: parseOptionalInt(sanitizedResponses['height-inches']),
      weightLbs: parseOptionalFloat(sanitizedResponses['weight-lbs']),
      
      // Goals
      goal: sanitizedResponses['primary-goal'],
      mainFitnessGoals: sanitizedResponses['primary-goal'],
      motivation: sanitizedResponses['motivation'],
      biggestStruggle: sanitizedResponses['biggest-struggle'],
      
      // Activity level
      activityLevel: sanitizedResponses['activity-level'],
      dailyMovementPattern: sanitizedResponses['daily-movement-pattern'],
      
      // Training
      trainingExperience: sanitizedResponses['training-experience'],
      trainingHistory: sanitizedResponses['training-history'],
      daysPerWeek: parseOptionalInt(sanitizedResponses['days-per-week']),
      sessionDuration: parseOptionalInt(sanitizedResponses['session-duration']),
      preferredWorkoutTime: sanitizedResponses['preferred-workout-time'],
      availableEquipment: Array.isArray(sanitizedResponses['available-equipment'])
        ? sanitizedResponses['available-equipment'].join(', ')
        : sanitizedResponses['available-equipment'],
      workoutLocation: Array.isArray(sanitizedResponses['workout-location'])
        ? sanitizedResponses['workout-location'].join(', ')
        : sanitizedResponses['workout-location'],
      trainingStyle: sanitizedResponses['training-style'],
      
      // Health
      injuries: sanitizedResponses['injuries'],
      medicalConditions: sanitizedResponses['medical-conditions'],
      medications: sanitizedResponses['medications'],
      painOrDiscomfort: sanitizedResponses['pain-or-discomfort'],
      
      // Nutrition
      dietType: sanitizedResponses['diet-type'],
      foodAllergies: Array.isArray(sanitizedResponses['food-allergies'])
        ? sanitizedResponses['food-allergies'].join(', ')
        : sanitizedResponses['food-allergies'],
      foodsToAvoid: sanitizedResponses['foods-to-avoid'],
      eatsBreakfast: parseOptionalBoolean(sanitizedResponses['eats-breakfast']),
      eatsAnimalProducts: parseOptionalBoolean(sanitizedResponses['eats-animal-products']),
      mealsPerDay: parseOptionalInt(sanitizedResponses['meals-per-day']?.split('-')[0]),
      beverageConsumption: Array.isArray(sanitizedResponses['beverage-consumption'])
        ? sanitizedResponses['beverage-consumption'].join(', ')
        : sanitizedResponses['beverage-consumption'],
      waterIntakeOz: parseOptionalInt(sanitizedResponses['water-intake-oz']),
      typicalDayEating: sanitizedResponses['typical-day-eating'],
      favoriteMeals: sanitizedResponses['favorite-meals'],
      fastingPattern: sanitizedResponses['fasting-pattern'],
      culturalDietaryNeeds: sanitizedResponses['cultural-dietary-needs'],
      
      // Athlete-specific
      sport: sanitizedResponses['sport'],
      position: sanitizedResponses['position'],
      competitionLevel: sanitizedResponses['competition-level'],
      seasonPhase: sanitizedResponses['season-phase'],
      trainingAge: parseOptionalInt(sanitizedResponses['training-age']),
      
      // Performance metrics (store as JSON)
      strengthBenchmarks: {
        squat: parseOptionalInt(sanitizedResponses['squat-1rm']),
        bench: parseOptionalInt(sanitizedResponses['bench-1rm']),
        deadlift: parseOptionalInt(sanitizedResponses['deadlift-1rm'])
      },
      powerMetrics: {
        verticalJump: parseOptionalInt(sanitizedResponses['vertical-jump'])
      },
      speedMetrics: {
        fortyYardDash: parseOptionalFloat(sanitizedResponses['40-yard-dash'])
      },
      
      // Youth-specific
      schoolGrade: sanitizedResponses['school-grade'],
      sportsPlayed: sanitizedResponses['sports-played'],
      
      // Situation-based
      injuryLocation: Array.isArray(sanitizedResponses['injury-location'])
        ? sanitizedResponses['injury-location'].join(', ')
        : sanitizedResponses['injury-location'],
      painPatterns: sanitizedResponses['pain-patterns'],
      aggravatingPositions: sanitizedResponses['aggravating-positions'],
      medicalClearance: parseOptionalBoolean(sanitizedResponses['medical-clearance']),
      mobilityLimitations: sanitizedResponses['mobility-limitations'],
      recoveryGoals: sanitizedResponses['recovery-goals']
    };

    return clientData;
  }

  /**
   * Submit intake and create/update client profile
   */
  static async submitIntake(
    userId: string,
    clientType: string,
    responses: IntakeResponses
  ): Promise<{ client: any; requiresPackets: boolean }> {
    // Get intake path to validate
    const path = await this.getIntakePath(clientType);
    if (!path) {
      throw new Error(`Invalid client type: ${clientType}`);
    }

    // Get question blocks for validation
    const questionBlocks = await this.getQuestionBlocks(path.questionBlockIds);
    
    // Validate intake completion
    const validation = this.validateIntakeCompletion(responses, questionBlocks);
    if (!validation.isValid) {
      throw new Error(`Intake validation failed: ${JSON.stringify(validation.errors)}`);
    }

    // Generate client profile data
    const clientData = await this.generateClientProfile(responses, clientType, userId);

    // Check if client already exists
    const existingClient = await prisma.client.findUnique({
      where: { userId },
      include: { intakeProgress: true }
    });

    let client;
    if (existingClient) {
      // Update existing client
      client = await prisma.client.update({
        where: { userId },
        data: clientData
      });
    } else {
      // Create new client
      client = await prisma.client.create({
        data: clientData
      });
    }

    // Mark intake as complete
    await this.saveProgress(client.id, {
      selectedPath: clientType,
      responses,
      isComplete: true
    });

    // Track completion analytics
    await this.trackIntakeCompletion(clientType, existingClient?.intakeProgress?.createdAt);

    return {
      client,
      requiresPackets: true
    };
  }

  /**
   * Track intake completion analytics
   */
  static async trackIntakeCompletion(
    clientType: string,
    startedAt?: Date
  ): Promise<void> {
    const completedAt = new Date();
    
    // Find the most recent incomplete analytics record for this client type
    const analyticsRecord = await prisma.intakeAnalytics.findFirst({
      where: {
        clientType,
        completedAt: null,
        abandonedAt: null
      },
      orderBy: {
        startedAt: 'desc'
      }
    });

    if (analyticsRecord) {
      // Update existing analytics record
      const completionTime = Math.floor(
        (completedAt.getTime() - analyticsRecord.startedAt.getTime()) / 1000
      );

      await prisma.intakeAnalytics.update({
        where: { id: analyticsRecord.id },
        data: {
          completedAt,
          completionTime
        }
      });
    } else if (startedAt) {
      // Create analytics record if we have a start time but no record
      const completionTime = Math.floor(
        (completedAt.getTime() - startedAt.getTime()) / 1000
      );

      await prisma.intakeAnalytics.create({
        data: {
          clientType: clientType as any,
          startedAt,
          completedAt,
          completionTime
        }
      });
    }
  }

  /**
   * Track intake abandonment
   */
  static async trackIntakeAbandonment(
    clientType: string,
    dropOffStep: number
  ): Promise<void> {
    // Find the most recent incomplete analytics record
    const analyticsRecord = await prisma.intakeAnalytics.findFirst({
      where: {
        clientType,
        completedAt: null,
        abandonedAt: null
      },
      orderBy: {
        startedAt: 'desc'
      }
    });

    if (analyticsRecord) {
      await prisma.intakeAnalytics.update({
        where: { id: analyticsRecord.id },
        data: {
          abandonedAt: new Date(),
          dropOffStep
        }
      });
    }
  }
}
