/**
 * Packet Generation Service
 * 
 * This service orchestrates the generation of personalized packets
 * by combining templates with client data and calculated values.
 */

import { PrismaClient } from '@prisma/client';
import {
  PacketTemplate,
  TemplateContext,
  PopulatedContent,
  IntakeResponses
} from '@/types/intake';
import {
  TemplateRenderer,
  CalculatedValuesGenerator
} from './template-engine';
import { getTemplateByPacketType } from './packet-templates';
import { NutritionGenerator } from './nutrition-generator';
import { WorkoutGenerator } from './workout-generator';
import { PerformanceGenerator } from './performance-generator';
import { YouthGenerator } from './youth-generator';
import { RecoveryGenerator } from './recovery-generator';
import { PDFExportService } from './pdf-export-service';
import { PacketErrorHandler } from './packet-error-handler';

const prisma = new PrismaClient();

export class PacketGenerationService {
  /**
   * Generate a complete packet for a client
   */
  static async generatePacket(
    clientId: string,
    packetType: string
  ): Promise<PopulatedContent> {
    // Fetch client data with only needed fields
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        fullName: true,
        email: true,
        clientType: true,
        intakeResponses: true,
        // Demographics
        gender: true,
        dateOfBirth: true,
        heightInches: true,
        weightLbs: true,
        // Goals
        goal: true,
        mainFitnessGoals: true,
        motivation: true,
        biggestStruggle: true,
        // Activity
        activityLevel: true,
        dailyMovementPattern: true,
        // Training
        trainingExperience: true,
        daysPerWeek: true,
        sessionDuration: true,
        preferredWorkoutTime: true,
        availableEquipment: true,
        workoutLocation: true,
        trainingStyle: true,
        // Health
        injuries: true,
        medicalConditions: true,
        painOrDiscomfort: true,
        // Nutrition
        dietType: true,
        foodAllergies: true,
        foodsToAvoid: true,
        mealsPerDay: true,
        favoriteMeals: true,
        culturalDietaryNeeds: true,
        waterIntakeOz: true,
        // Youth
        schoolGrade: true,
        sportsPlayed: true,
        // Athlete
        sport: true,
        position: true,
        competitionLevel: true,
        seasonPhase: true,
        trainingAge: true,
        // Situation
        injuryLocation: true,
        painPatterns: true,
        aggravatingPositions: true,
        medicalClearance: true,
        mobilityLimitations: true,
        recoveryGoals: true,
        user: {
          select: {
            email: true
          }
        }
      }
    });
    
    if (!client) {
      throw new Error(`Client not found: ${clientId}`);
    }
    
    // Get the appropriate template
    const template = await this.getTemplate(packetType, client.clientType);
    
    if (!template) {
      throw new Error(`Template not found for packet type: ${packetType}`);
    }
    
    // Build template context
    const context = await this.buildTemplateContext(client);
    
    // Render the template with client data
    const populatedContent = TemplateRenderer.renderTemplate(template, context);
    
    return populatedContent;
  }
  
  /**
   * Get template for packet type
   * First checks database, falls back to default templates
   */
  private static async getTemplate(
    packetType: string,
    clientType?: string | null
  ): Promise<PacketTemplate | null> {
    // Try to find a client-type-specific template in database
    if (clientType) {
      const specificTemplate = await prisma.packetTemplate.findFirst({
        where: {
          packetType,
          clientType,
          isActive: true
        },
        select: {
          id: true,
          name: true,
          packetType: true,
          clientType: true,
          sections: true,
          contentBlocks: true,
          isDefault: true,
          createdBy: true,
          createdAt: true,
          updatedAt: true
        }
      });
      
      if (specificTemplate) {
        return this.convertPrismaTemplateToPacketTemplate(specificTemplate);
      }
    }
    
    // Try to find a default template in database
    const defaultTemplate = await prisma.packetTemplate.findFirst({
      where: {
        packetType,
        isDefault: true,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        packetType: true,
        clientType: true,
        sections: true,
        contentBlocks: true,
        isDefault: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (defaultTemplate) {
      return this.convertPrismaTemplateToPacketTemplate(defaultTemplate);
    }
    
    // Fall back to hardcoded default templates
    return getTemplateByPacketType(packetType) || null;
  }
  
  /**
   * Convert Prisma template to PacketTemplate type
   */
  private static convertPrismaTemplateToPacketTemplate(prismaTemplate: any): PacketTemplate {
    return {
      id: prismaTemplate.id,
      name: prismaTemplate.name,
      packetType: prismaTemplate.packetType,
      clientType: prismaTemplate.clientType,
      sections: prismaTemplate.sections as any,
      contentBlocks: prismaTemplate.contentBlocks as any,
      isDefault: prismaTemplate.isDefault,
      createdBy: prismaTemplate.createdBy,
      createdAt: prismaTemplate.createdAt,
      updatedAt: prismaTemplate.updatedAt
    };
  }
  
  /**
   * Build template context with client data and calculated values
   */
  private static async buildTemplateContext(client: any): Promise<TemplateContext> {
    // Parse intake responses from JSON
    const responses: IntakeResponses = 
      typeof client.intakeResponses === 'string'
        ? JSON.parse(client.intakeResponses)
        : client.intakeResponses || {};
    
    // Generate calculated values based on packet type needs
    const calculated = this.generateCalculatedValues(client, responses);
    
    return {
      client: this.prepareClientData(client),
      calculated,
      responses
    };
  }
  
  /**
   * Prepare client data for template rendering
   * Ensures all fields are accessible and formatted properly
   */
  private static prepareClientData(client: any): any {
    return {
      // Basic info
      id: client.id,
      fullName: client.fullName || 'Client',
      email: client.email || client.user?.email || '',
      
      // Classification
      clientType: client.clientType,
      
      // Demographics
      gender: client.gender || 'not specified',
      dateOfBirth: client.dateOfBirth,
      age: client.dateOfBirth 
        ? new Date().getFullYear() - new Date(client.dateOfBirth).getFullYear()
        : null,
      heightInches: client.heightInches,
      weightLbs: client.weightLbs,
      
      // Goals
      goal: client.goal || client.mainFitnessGoals || 'general fitness',
      mainFitnessGoals: client.mainFitnessGoals || client.goal || 'general fitness',
      
      // Activity
      activityLevel: client.activityLevel || 'moderately-active',
      daysPerWeek: client.daysPerWeek || 3,
      sessionDuration: client.sessionDuration || 60,
      preferredWorkoutTime: client.preferredWorkoutTime || 'flexible',
      
      // Training
      trainingExperience: client.trainingExperience || 'beginner',
      availableEquipment: client.availableEquipment || 'basic equipment',
      workoutLocation: client.workoutLocation || 'gym',
      trainingStyle: client.trainingStyle || 'balanced',
      
      // Health
      injuries: client.injuries || 'none reported',
      medicalConditions: client.medicalConditions || 'none reported',
      painOrDiscomfort: client.painOrDiscomfort || 'none reported',
      
      // Nutrition
      dietType: client.dietType || 'no restrictions',
      foodAllergies: client.foodAllergies || 'none',
      foodsToAvoid: client.foodsToAvoid || 'none',
      mealsPerDay: client.mealsPerDay || 3,
      favoriteMeals: client.favoriteMeals || 'varied',
      culturalDietaryNeeds: client.culturalDietaryNeeds || 'none',
      waterIntakeOz: client.waterIntakeOz,
      
      // Youth-specific
      schoolGrade: client.schoolGrade,
      sportsPlayed: client.sportsPlayed || 'various',
      
      // Athlete-specific
      sport: client.sport,
      position: client.position,
      competitionLevel: client.competitionLevel,
      seasonPhase: client.seasonPhase,
      trainingAge: client.trainingAge,
      
      // Situation-based
      injuryLocation: client.injuryLocation,
      painPatterns: client.painPatterns,
      aggravatingPositions: client.aggravatingPositions,
      medicalClearance: client.medicalClearance ? 'Yes' : 'No',
      mobilityLimitations: client.mobilityLimitations,
      recoveryGoals: client.recoveryGoals,
      
      // Motivation
      motivation: client.motivation || 'improve health',
      biggestStruggle: client.biggestStruggle || 'consistency'
    };
  }
  
  /**
   * Generate all calculated values needed for templates
   */
  private static generateCalculatedValues(
    client: any,
    responses: IntakeResponses
  ): any {
    const calculated: any = {};
    
    // Always calculate nutrition values (useful for multiple packet types)
    const nutritionValues = CalculatedValuesGenerator.calculateNutritionValues(
      client,
      responses
    );
    Object.assign(calculated, nutritionValues);
    
    // Always calculate workout values (useful for multiple packet types)
    const workoutValues = CalculatedValuesGenerator.calculateWorkoutValues(
      client,
      responses
    );
    Object.assign(calculated, workoutValues);
    
    // Add any additional calculated fields
    calculated.bmi = this.calculateBMI(client.heightInches, client.weightLbs);
    calculated.experienceLevel = this.mapExperienceLevel(client.trainingExperience);
    
    return calculated;
  }
  
  /**
   * Calculate BMI
   */
  private static calculateBMI(heightInches?: number, weightLbs?: number): number | null {
    if (!heightInches || !weightLbs) {
      return null;
    }
    
    // BMI = (weight in pounds / (height in inches)^2) * 703
    const bmi = (weightLbs / (heightInches * heightInches)) * 703;
    return Math.round(bmi * 10) / 10;
  }
  
  /**
   * Map experience level to descriptive text
   */
  private static mapExperienceLevel(experience?: string): string {
    const mapping: Record<string, string> = {
      'beginner': 'New to training',
      'intermediate': 'Some training experience',
      'advanced': 'Experienced athlete',
      'expert': 'Elite level'
    };
    
    return mapping[experience || 'beginner'] || 'Beginner';
  }
  
  /**
   * Save generated packet content to database
   */
  static async savePacketContent(
    packetId: string,
    content: PopulatedContent
  ): Promise<void> {
    await prisma.packet.update({
      where: { id: packetId },
      data: {
        content: content as any,
        status: 'READY',
        updatedAt: new Date()
      }
    });
  }
  
  /**
   * Generate and save packet in one operation
   */
  static async generateAndSavePacket(
    clientId: string,
    packetId: string,
    packetType: string
  ): Promise<PopulatedContent> {
    try {
      // Update status to GENERATING
      await prisma.packet.update({
        where: { id: packetId },
        data: { status: 'GENERATING' }
      });
      
      // Generate content
      const content = await this.generatePacket(clientId, packetType);
      
      // Save content
      await this.savePacketContent(packetId, content);
      
      return content;
    } catch (error) {
      // Use centralized error handler
      await PacketErrorHandler.handleGenerationError(
        error,
        packetId,
        clientId,
        packetType
      );
      
      throw error;
    }
  }

  /**
   * Main orchestration method for packet generation
   * This is the entry point called by the job queue
   */
  static async orchestratePacketGeneration(
    clientId: string,
    packetId: string,
    packetType: string
  ): Promise<void> {
    console.log(`[PacketGeneration] Starting generation for packet ${packetId} (type: ${packetType})`);
    
    try {
      // Step 1: Fetch client data with only needed fields
      const client = await prisma.client.findUnique({
        where: { id: clientId },
        select: {
          id: true,
          fullName: true,
          email: true,
          clientType: true,
          intakeResponses: true,
          // Demographics
          gender: true,
          dateOfBirth: true,
          heightInches: true,
          weightLbs: true,
          // Goals
          goal: true,
          mainFitnessGoals: true,
          motivation: true,
          biggestStruggle: true,
          // Activity
          activityLevel: true,
          dailyMovementPattern: true,
          // Training
          trainingExperience: true,
          daysPerWeek: true,
          sessionDuration: true,
          preferredWorkoutTime: true,
          availableEquipment: true,
          workoutLocation: true,
          trainingStyle: true,
          // Health
          injuries: true,
          medicalConditions: true,
          painOrDiscomfort: true,
          // Nutrition
          dietType: true,
          foodAllergies: true,
          foodsToAvoid: true,
          mealsPerDay: true,
          favoriteMeals: true,
          culturalDietaryNeeds: true,
          waterIntakeOz: true,
          // Youth
          schoolGrade: true,
          sportsPlayed: true,
          // Athlete
          sport: true,
          position: true,
          competitionLevel: true,
          seasonPhase: true,
          trainingAge: true,
          // Situation
          injuryLocation: true,
          painPatterns: true,
          aggravatingPositions: true,
          medicalClearance: true,
          mobilityLimitations: true,
          recoveryGoals: true,
          user: {
            select: {
              email: true
            }
          }
        }
      });
      
      if (!client) {
        throw new Error(`Client not found: ${clientId}`);
      }
      
      const template = await this.getTemplate(packetType, client.clientType);
      
      if (!template) {
        throw new Error(`Template not found for packet type: ${packetType}`);
      }
      
      // Step 2: Build template context with client data
      const context = await this.buildTemplateContext(client);
      
      // Step 3: Populate template with client data
      const populatedContent = TemplateRenderer.renderTemplate(template, context);
      
      // Step 4: Generate custom content sections based on packet type
      const enhancedContent = await this.generateCustomContent(
        populatedContent,
        packetType,
        client,
        context
      );
      
      // Step 5: Format final packet content
      const finalContent = this.formatPacketContent(enhancedContent, packetType);
      
      // Step 6: Generate PDF export
      let pdfUrl: string | null = null;
      try {
        pdfUrl = await PDFExportService.generatePDF(
          packetId,
          finalContent,
          client.fullName,
          packetType,
          {
            title: `${this.formatPacketType(packetType)} Plan - ${client.fullName}`,
            author: 'Afya Performance',
            subject: `Personalized ${this.formatPacketType(packetType)} Plan`,
            keywords: [packetType, 'fitness', 'nutrition', 'training'],
          }
        );
        console.log(`[PacketGeneration] PDF generated: ${pdfUrl}`);
      } catch (pdfError) {
        console.error(`[PacketGeneration] PDF generation failed:`, pdfError);
        // Continue without PDF - packet content is still available
      }
      
      // Step 7: Store packet content in database
      await prisma.packet.update({
        where: { id: packetId },
        data: {
          content: finalContent as any,
          pdfUrl: pdfUrl,
          status: 'READY',
          generationMethod: 'TEMPLATE',
          updatedAt: new Date()
        }
      });
      
      console.log(`[PacketGeneration] Successfully generated packet ${packetId}`);
      
      // Send notification to client that packet is ready
      const { PacketNotificationService } = await import('./packet-notification-service');
      await PacketNotificationService.notifyClientPacketReady(packetId);
      
    } catch (error) {
      console.error(`[PacketGeneration] Error generating packet ${packetId}:`, error);
      
      // Use centralized error handler
      await PacketErrorHandler.handleGenerationError(
        error,
        packetId,
        clientId,
        packetType
      );
      
      throw error;
    }
  }
  
  /**
   * Generate custom content sections based on packet type
   * This is where packet-specific logic is applied
   */
  private static async generateCustomContent(
    baseContent: PopulatedContent,
    packetType: string,
    client: any,
    context: TemplateContext
  ): Promise<PopulatedContent> {
    // Clone the content to avoid mutations
    const enhancedContent = JSON.parse(JSON.stringify(baseContent));
    
    // Apply packet-specific enhancements
    switch (packetType) {
      case 'NUTRITION':
        return this.enhanceNutritionContent(enhancedContent, client, context);
      case 'WORKOUT':
        return this.enhanceWorkoutContent(enhancedContent, client, context);
      case 'PERFORMANCE':
        return this.enhancePerformanceContent(enhancedContent, client, context);
      case 'YOUTH':
        return this.enhanceYouthContent(enhancedContent, client, context);
      case 'RECOVERY':
        return this.enhanceRecoveryContent(enhancedContent, client, context);
      case 'WELLNESS':
        return this.enhanceWellnessContent(enhancedContent, client, context);
      default:
        return enhancedContent;
    }
  }
  
  /**
   * Enhance nutrition packet with custom content
   */
  private static enhanceNutritionContent(
    content: PopulatedContent,
    client: any,
    context: TemplateContext
  ): PopulatedContent {
    return NutritionGenerator.enhanceNutritionContent(content, client, context);
  }
  
  /**
   * Enhance workout packet with custom content
   */
  private static enhanceWorkoutContent(
    content: PopulatedContent,
    client: any,
    context: TemplateContext
  ): PopulatedContent {
    return WorkoutGenerator.enhanceWorkoutContent(content, client, context);
  }
  
  /**
   * Enhance performance packet with custom content
   */
  private static enhancePerformanceContent(
    content: PopulatedContent,
    client: any,
    context: TemplateContext
  ): PopulatedContent {
    return PerformanceGenerator.enhancePerformanceContent(content, client, context);
  }
  
  /**
   * Enhance youth packet with custom content
   */
  private static enhanceYouthContent(
    content: PopulatedContent,
    client: any,
    context: TemplateContext
  ): PopulatedContent {
    return YouthGenerator.enhanceYouthContent(content, client, context);
  }
  
  /**
   * Enhance recovery packet with custom content
   */
  private static enhanceRecoveryContent(
    content: PopulatedContent,
    client: any,
    context: TemplateContext
  ): PopulatedContent {
    return RecoveryGenerator.enhanceRecoveryContent(content, client, context);
  }
  
  /**
   * Enhance wellness packet with custom content
   */
  private static enhanceWellnessContent(
    content: PopulatedContent,
    client: any,
    context: TemplateContext
  ): PopulatedContent {
    // Add custom wellness-specific enhancements
    return content;
  }
  
  /**
   * Format final packet content for storage and display
   */
  private static formatPacketContent(
    content: PopulatedContent,
    packetType: string
  ): PopulatedContent {
    // Add metadata
    const formatted = {
      ...content,
      metadata: {
        packetType,
        generatedAt: new Date().toISOString(),
        version: '1.0'
      }
    };
    
    return formatted;
  }
  
  /**
   * Format packet type for display
   */
  private static formatPacketType(type: string): string {
    const typeMap: Record<string, string> = {
      NUTRITION: 'Nutrition',
      WORKOUT: 'Workout',
      PERFORMANCE: 'Performance',
      YOUTH: 'Youth Training',
      RECOVERY: 'Recovery',
      WELLNESS: 'Wellness',
      INTRO: 'Introduction',
    };

    return typeMap[type] || type;
  }
}
