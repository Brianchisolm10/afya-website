/**
 * Template Engine Tests
 * 
 * Tests for the packet template system
 */

import { describe, test, expect } from 'vitest';
import {
  TemplatePlaceholderEngine,
  CalculatedValuesGenerator
} from '../template-engine';
import { TemplateContext } from '@/types/intake';

describe('TemplatePlaceholderEngine', () => {
  const mockContext: TemplateContext = {
    client: {
      fullName: 'John Doe',
      email: 'john@example.com',
      goal: 'lose weight',
      activityLevel: 'moderately-active'
    },
    calculated: {
      dailyCalories: 2200,
      hydrationOz: 100
    },
    responses: {
      'question-1': 'answer-1'
    }
  };

  test('replaces simple placeholders', () => {
    const template = 'Hello {{client.fullName}}!';
    const result = TemplatePlaceholderEngine.replacePlaceholders(template, mockContext);
    expect(result).toBe('Hello John Doe!');
  });

  test('replaces multiple placeholders', () => {
    const template = '{{client.fullName}} wants to {{client.goal}}';
    const result = TemplatePlaceholderEngine.replacePlaceholders(template, mockContext);
    expect(result).toBe('John Doe wants to lose weight');
  });

  test('replaces calculated values', () => {
    const template = 'Target: {{calculated.dailyCalories}} calories';
    const result = TemplatePlaceholderEngine.replacePlaceholders(template, mockContext);
    expect(result).toBe('Target: 2200 calories');
  });

  test('handles missing values gracefully', () => {
    const template = 'Missing: {{client.nonexistent}}';
    const result = TemplatePlaceholderEngine.replacePlaceholders(template, mockContext);
    expect(result).toBe('Missing: ');
  });

  test('detects placeholders', () => {
    expect(TemplatePlaceholderEngine.hasPlaceholders('{{test}}')).toBe(true);
    expect(TemplatePlaceholderEngine.hasPlaceholders('no placeholders')).toBe(false);
  });

  test('extracts placeholder paths', () => {
    const template = '{{client.name}} and {{calculated.value}}';
    const paths = TemplatePlaceholderEngine.extractPlaceholders(template);
    expect(paths).toEqual(['client.name', 'calculated.value']);
  });
});

describe('CalculatedValuesGenerator', () => {
  const mockClient = {
    weightLbs: 180,
    heightInches: 70,
    dateOfBirth: new Date('1990-01-01'),
    gender: 'male',
    activityLevel: 'moderately-active',
    goal: 'lose weight',
    daysPerWeek: 4,
    trainingExperience: 'intermediate'
  };

  test('calculates daily calories', () => {
    const calculated = CalculatedValuesGenerator.calculateNutritionValues(
      mockClient,
      {}
    );
    
    expect(calculated.dailyCalories).toBeGreaterThan(0);
    expect(typeof calculated.dailyCalories).toBe('number');
  });

  test('calculates macros', () => {
    const calculated = CalculatedValuesGenerator.calculateNutritionValues(
      mockClient,
      {}
    );
    
    expect(calculated.macros).toHaveLength(3);
    expect(calculated.macros[0]).toHaveProperty('name');
    expect(calculated.macros[0]).toHaveProperty('grams');
    expect(calculated.macros[0]).toHaveProperty('calories');
    expect(calculated.macros[0]).toHaveProperty('percentage');
  });

  test('calculates workout values', () => {
    const calculated = CalculatedValuesGenerator.calculateWorkoutValues(
      mockClient,
      {}
    );
    
    expect(calculated.weeklyFrequency).toBe(4);
    expect(calculated.trainingSplit).toBeTruthy();
    expect(calculated.volumeRecommendations).toHaveProperty('setsPerExercise');
  });
});
