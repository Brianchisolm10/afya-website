/**
 * Packet Template Engine
 * 
 * This module provides utilities for rendering packet templates with client data,
 * including placeholder replacement, conditional sections, and calculated values.
 */

import {
  PacketTemplate,
  ContentBlock,
  PacketSection,
  TemplateContext,
  PopulatedContent,
  ConditionalLogicEvaluator,
  CalculatedValues,
  IntakeResponses
} from '@/types/intake';

// ============================================================================
// Template Placeholder System
// ============================================================================

/**
 * Replaces placeholders in template content with actual values
 * Supports nested object paths like {{client.fullName}} or {{calculated.dailyCalories}}
 */
export class TemplatePlaceholderEngine {
  /**
   * Replace all placeholders in a string with values from context
   */
  static replacePlaceholders(
    template: string,
    context: TemplateContext
  ): string {
    // Match {{placeholder}} patterns
    const placeholderRegex = /\{\{([^}]+)\}\}/g;
    
    return template.replace(placeholderRegex, (match, path) => {
      const value = this.getValueByPath(path.trim(), context);
      return this.formatValue(value);
    });
  }
  
  /**
   * Get value from context using dot notation path
   * Example: "client.fullName" or "calculated.macros.protein"
   */
  private static getValueByPath(path: string, context: TemplateContext): any {
    const parts = path.split('.');
    let value: any = context;
    
    for (const part of parts) {
      if (value === null || value === undefined) {
        return '';
      }
      value = value[part];
    }
    
    return value;
  }
  
  /**
   * Format value for display
   */
  private static formatValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    
    if (typeof value === 'object') {
      // For objects/arrays, return JSON string
      return JSON.stringify(value);
    }
    
    if (typeof value === 'number') {
      // Round numbers to 2 decimal places
      return Number.isInteger(value) ? value.toString() : value.toFixed(2);
    }
    
    return String(value);
  }
  
  /**
   * Check if a string contains placeholders
   */
  static hasPlaceholders(template: string): boolean {
    return /\{\{([^}]+)\}\}/.test(template);
  }
  
  /**
   * Extract all placeholder paths from a template
   */
  static extractPlaceholders(template: string): string[] {
    const placeholderRegex = /\{\{([^}]+)\}\}/g;
    const placeholders: string[] = [];
    let match;
    
    while ((match = placeholderRegex.exec(template)) !== null) {
      placeholders.push(match[1].trim());
    }
    
    return placeholders;
  }
}

// ============================================================================
// Template Renderer
// ============================================================================

export class TemplateRenderer {
  /**
   * Render a complete packet template with client data
   */
  static renderTemplate(
    template: PacketTemplate,
    context: TemplateContext
  ): PopulatedContent {
    // Filter sections based on conditional display
    const visibleSections = this.getVisibleSections(template.sections, context);
    
    // Render each section
    const renderedSections = visibleSections.map(section => {
      return this.renderSection(section, template.contentBlocks, context);
    });
    
    return {
      sections: renderedSections
    };
  }
  
  /**
   * Get sections that should be visible based on conditions
   */
  private static getVisibleSections(
    sections: PacketSection[],
    context: TemplateContext
  ): PacketSection[] {
    return sections
      .filter(section => {
        if (!section.conditionalDisplay) {
          return true;
        }
        return ConditionalLogicEvaluator.evaluateCondition(
          section.conditionalDisplay,
          context.responses
        );
      })
      .sort((a, b) => a.order - b.order);
  }
  
  /**
   * Render a single section with its content blocks
   */
  private static renderSection(
    section: PacketSection,
    allBlocks: ContentBlock[],
    context: TemplateContext
  ) {
    // Get content blocks for this section
    const sectionBlocks = allBlocks.filter(block =>
      section.contentBlockIds.includes(block.id)
    );
    
    // Filter visible blocks
    const visibleBlocks = this.getVisibleBlocks(sectionBlocks, context);
    
    // Render each block
    const renderedBlocks = visibleBlocks.map(block => {
      return this.renderContentBlock(block, context);
    });
    
    return {
      id: section.id,
      title: TemplatePlaceholderEngine.replacePlaceholders(section.title, context),
      description: section.description
        ? TemplatePlaceholderEngine.replacePlaceholders(section.description, context)
        : undefined,
      blocks: renderedBlocks
    };
  }
  
  /**
   * Get content blocks that should be visible
   */
  private static getVisibleBlocks(
    blocks: ContentBlock[],
    context: TemplateContext
  ): ContentBlock[] {
    return blocks
      .filter(block => {
        if (!block.conditionalDisplay) {
          return true;
        }
        return ConditionalLogicEvaluator.evaluateCondition(
          block.conditionalDisplay,
          context.responses
        );
      })
      .sort((a, b) => a.order - b.order);
  }
  
  /**
   * Render a single content block
   */
  private static renderContentBlock(
    block: ContentBlock,
    context: TemplateContext
  ) {
    let content = block.content;
    
    // If block has a dataSource, use that data
    if (block.dataSource) {
      const data = this.getDataFromSource(block.dataSource, context);
      content = this.formatDataByType(data, block.type, block.formatting);
    } else {
      // Replace placeholders in content
      content = TemplatePlaceholderEngine.replacePlaceholders(content, context);
    }
    
    return {
      id: block.id,
      type: block.type,
      content,
      formatting: block.formatting
    };
  }
  
  /**
   * Get data from a data source path
   */
  private static getDataFromSource(
    dataSource: string,
    context: TemplateContext
  ): any {
    const parts = dataSource.split('.');
    let value: any = context;
    
    for (const part of parts) {
      if (value === null || value === undefined) {
        return null;
      }
      value = value[part];
    }
    
    return value;
  }
  
  /**
   * Format data based on content block type
   */
  private static formatDataByType(
    data: any,
    type: string,
    formatting?: any
  ): string {
    if (data === null || data === undefined) {
      return '';
    }
    
    switch (type) {
      case 'table':
        return this.formatAsTable(data, formatting);
      case 'list':
        return this.formatAsList(data, formatting);
      case 'text':
      default:
        return String(data);
    }
  }
  
  /**
   * Format data as a table (returns markdown table)
   */
  private static formatAsTable(data: any, formatting?: any): string {
    if (!Array.isArray(data)) {
      return '';
    }
    
    const headers = formatting?.headers || Object.keys(data[0] || {});
    const columns = formatting?.columns || headers;
    
    // Create header row
    let table = '| ' + headers.join(' | ') + ' |\n';
    table += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
    
    // Create data rows
    for (const row of data) {
      const values = columns.map(col => {
        const value = row[col];
        return value !== null && value !== undefined ? String(value) : '';
      });
      table += '| ' + values.join(' | ') + ' |\n';
    }
    
    return table;
  }
  
  /**
   * Format data as a list
   */
  private static formatAsList(data: any, formatting?: any): string {
    if (!Array.isArray(data)) {
      return String(data);
    }
    
    const listStyle = formatting?.listStyle || 'bullet';
    const bullet = listStyle === 'numbered' ? '1.' : '-';
    
    return data
      .map((item, index) => {
        const prefix = listStyle === 'numbered' ? `${index + 1}.` : bullet;
        return `${prefix} ${String(item)}`;
      })
      .join('\n');
  }
}

// ============================================================================
// Calculated Values Generator
// ============================================================================

export class CalculatedValuesGenerator {
  /**
   * Generate calculated values for nutrition packets
   */
  static calculateNutritionValues(
    client: any,
    responses: IntakeResponses
  ): CalculatedValues {
    const calculated: CalculatedValues = {};
    
    // Calculate daily calorie target
    calculated.dailyCalories = this.calculateDailyCalories(client);
    
    // Calculate macronutrient breakdown
    calculated.macros = this.calculateMacros(client, calculated.dailyCalories);
    
    // Calculate meal timing
    calculated.mealTiming = this.calculateMealTiming(client);
    
    // Calculate hydration target
    calculated.hydrationOz = this.calculateHydration(client);
    
    return calculated;
  }
  
  /**
   * Calculate daily calorie target based on client data
   */
  private static calculateDailyCalories(client: any): number {
    // Basic BMR calculation (Mifflin-St Jeor)
    const weight = client.weightLbs || 150;
    const height = client.heightInches || 66;
    const age = client.dateOfBirth 
      ? new Date().getFullYear() - new Date(client.dateOfBirth).getFullYear()
      : 30;
    const gender = client.gender || 'other';
    
    let bmr: number;
    if (gender === 'male') {
      bmr = (10 * weight * 0.453592) + (6.25 * height * 2.54) - (5 * age) + 5;
    } else if (gender === 'female') {
      bmr = (10 * weight * 0.453592) + (6.25 * height * 2.54) - (5 * age) - 161;
    } else {
      bmr = (10 * weight * 0.453592) + (6.25 * height * 2.54) - (5 * age) - 78;
    }
    
    // Activity multiplier
    const activityMultipliers: Record<string, number> = {
      'sedentary': 1.2,
      'lightly-active': 1.375,
      'moderately-active': 1.55,
      'very-active': 1.725,
      'extremely-active': 1.9
    };
    
    const activityLevel = client.activityLevel || 'moderately-active';
    const tdee = bmr * (activityMultipliers[activityLevel] || 1.55);
    
    // Adjust for goal
    const goal = client.goal || client.mainFitnessGoals || '';
    let calorieTarget = tdee;
    
    if (goal.toLowerCase().includes('lose') || goal.toLowerCase().includes('fat')) {
      calorieTarget = tdee - 500; // 500 calorie deficit
    } else if (goal.toLowerCase().includes('gain') || goal.toLowerCase().includes('muscle')) {
      calorieTarget = tdee + 300; // 300 calorie surplus
    }
    
    return Math.round(calorieTarget);
  }
  
  /**
   * Calculate macronutrient breakdown
   */
  private static calculateMacros(client: any, dailyCalories: number) {
    const goal = client.goal || client.mainFitnessGoals || '';
    let proteinPercent = 0.30;
    let carbPercent = 0.40;
    let fatPercent = 0.30;
    
    // Adjust based on goal
    if (goal.toLowerCase().includes('muscle') || goal.toLowerCase().includes('strength')) {
      proteinPercent = 0.35;
      carbPercent = 0.40;
      fatPercent = 0.25;
    } else if (goal.toLowerCase().includes('endurance')) {
      proteinPercent = 0.25;
      carbPercent = 0.50;
      fatPercent = 0.25;
    } else if (goal.toLowerCase().includes('fat') || goal.toLowerCase().includes('lose')) {
      proteinPercent = 0.35;
      carbPercent = 0.30;
      fatPercent = 0.35;
    }
    
    const proteinCalories = dailyCalories * proteinPercent;
    const carbCalories = dailyCalories * carbPercent;
    const fatCalories = dailyCalories * fatPercent;
    
    return [
      {
        name: 'Protein',
        grams: Math.round(proteinCalories / 4),
        calories: Math.round(proteinCalories),
        percentage: Math.round(proteinPercent * 100)
      },
      {
        name: 'Carbohydrates',
        grams: Math.round(carbCalories / 4),
        calories: Math.round(carbCalories),
        percentage: Math.round(carbPercent * 100)
      },
      {
        name: 'Fats',
        grams: Math.round(fatCalories / 9),
        calories: Math.round(fatCalories),
        percentage: Math.round(fatPercent * 100)
      }
    ];
  }
  
  /**
   * Calculate meal timing recommendations
   */
  private static calculateMealTiming(client: any): string[] {
    const mealsPerDay = client.mealsPerDay || 3;
    const workoutTime = client.preferredWorkoutTime || 'morning';
    
    const timings: string[] = [];
    
    if (mealsPerDay >= 3) {
      timings.push('Breakfast: 7:00-9:00 AM');
      timings.push('Lunch: 12:00-2:00 PM');
      timings.push('Dinner: 6:00-8:00 PM');
    }
    
    if (mealsPerDay >= 4) {
      if (workoutTime === 'morning') {
        timings.push('Pre-Workout Snack: 6:00-7:00 AM');
      } else if (workoutTime === 'afternoon') {
        timings.push('Afternoon Snack: 3:00-4:00 PM');
      } else {
        timings.push('Evening Snack: 4:00-5:00 PM');
      }
    }
    
    if (mealsPerDay >= 5) {
      timings.push('Post-Workout Snack: Within 30 minutes after training');
    }
    
    return timings;
  }
  
  /**
   * Calculate hydration target
   */
  private static calculateHydration(client: any): number {
    const weight = client.weightLbs || 150;
    // Basic formula: 0.5-1 oz per pound of body weight
    const baseHydration = weight * 0.67;
    
    // Adjust for activity level
    const activityLevel = client.activityLevel || 'moderately-active';
    let multiplier = 1.0;
    
    if (activityLevel === 'very-active' || activityLevel === 'extremely-active') {
      multiplier = 1.2;
    }
    
    return Math.round(baseHydration * multiplier);
  }
  
  /**
   * Generate calculated values for workout packets
   */
  static calculateWorkoutValues(
    client: any,
    responses: IntakeResponses
  ): CalculatedValues {
    const calculated: CalculatedValues = {};
    
    // Calculate training frequency
    calculated.weeklyFrequency = client.daysPerWeek || 3;
    
    // Calculate session duration
    calculated.sessionDuration = client.sessionDuration || 60;
    
    // Determine training split
    calculated.trainingSplit = this.determineTrainingSplit(client);
    
    // Calculate volume recommendations
    calculated.volumeRecommendations = this.calculateVolume(client);
    
    return calculated;
  }
  
  /**
   * Determine appropriate training split
   */
  private static determineTrainingSplit(client: any): string {
    const frequency = client.daysPerWeek || 3;
    const experience = client.trainingExperience || 'beginner';
    
    if (frequency <= 2) {
      return 'Full Body';
    } else if (frequency === 3) {
      return experience === 'beginner' ? 'Full Body' : 'Upper/Lower Split';
    } else if (frequency === 4) {
      return 'Upper/Lower Split';
    } else {
      return 'Push/Pull/Legs Split';
    }
  }
  
  /**
   * Calculate volume recommendations
   */
  private static calculateVolume(client: any): any {
    const experience = client.trainingExperience || 'beginner';
    
    const volumeMap: Record<string, any> = {
      'beginner': {
        setsPerExercise: '2-3',
        repsPerSet: '10-15',
        exercisesPerSession: '4-6'
      },
      'intermediate': {
        setsPerExercise: '3-4',
        repsPerSet: '8-12',
        exercisesPerSession: '6-8'
      },
      'advanced': {
        setsPerExercise: '4-5',
        repsPerSet: '6-12',
        exercisesPerSession: '8-10'
      }
    };
    
    return volumeMap[experience] || volumeMap['beginner'];
  }
}
