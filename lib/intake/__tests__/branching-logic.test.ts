/**
 * Branching Logic Tests
 * 
 * Tests for conditional logic evaluation in intake forms
 */

import { describe, test, expect } from 'vitest';
import { ConditionalLogicEvaluator } from '@/types/intake';
import { IntakeResponses } from '@/types/intake';

describe('ConditionalLogicEvaluator', () => {
  describe('equals condition', () => {
    test('evaluates simple equals condition - true', () => {
      const responses: IntakeResponses = {
        'client-type': 'NUTRITION_ONLY'
      };
      
      const condition = {
        type: 'equals' as const,
        questionId: 'client-type',
        value: 'NUTRITION_ONLY'
      };
      
      const result = ConditionalLogicEvaluator.evaluateCondition(condition, responses);
      expect(result).toBe(true);
    });
    
    test('evaluates simple equals condition - false', () => {
      const responses: IntakeResponses = {
        'client-type': 'WORKOUT_ONLY'
      };
      
      const condition = {
        type: 'equals' as const,
        questionId: 'client-type',
        value: 'NUTRITION_ONLY'
      };
      
      const result = ConditionalLogicEvaluator.evaluateCondition(condition, responses);
      expect(result).toBe(false);
    });
    
    test('evaluates array equals condition', () => {
      const responses: IntakeResponses = {
        'competition-level': 'college'
      };
      
      const condition = {
        type: 'equals' as const,
        questionId: 'competition-level',
        value: ['high-school', 'college', 'professional']
      };
      
      const result = ConditionalLogicEvaluator.evaluateCondition(condition, responses);
      expect(result).toBe(true);
    });
  });
  
  describe('contains condition', () => {
    test('evaluates contains condition with array response', () => {
      const responses: IntakeResponses = {
        'wellness-focus': ['strength', 'endurance', 'mobility']
      };
      
      const condition = {
        type: 'contains' as const,
        questionId: 'wellness-focus',
        value: 'strength'
      };
      
      const result = ConditionalLogicEvaluator.evaluateCondition(condition, responses);
      expect(result).toBe(true);
    });
    
    test('evaluates contains condition with string response', () => {
      const responses: IntakeResponses = {
        'recovery-goals': 'improve nutrition and mobility'
      };
      
      const condition = {
        type: 'contains' as const,
        questionId: 'recovery-goals',
        value: 'nutrition'
      };
      
      const result = ConditionalLogicEvaluator.evaluateCondition(condition, responses);
      expect(result).toBe(true);
    });
    
    test('evaluates contains condition - false', () => {
      const responses: IntakeResponses = {
        'wellness-focus': ['weight', 'energy']
      };
      
      const condition = {
        type: 'contains' as const,
        questionId: 'wellness-focus',
        value: 'strength'
      };
      
      const result = ConditionalLogicEvaluator.evaluateCondition(condition, responses);
      expect(result).toBe(false);
    });
  });
  
  describe('greaterThan condition', () => {
    test('evaluates greaterThan condition - true', () => {
      const responses: IntakeResponses = {
        'days-per-week': 5
      };
      
      const condition = {
        type: 'greaterThan' as const,
        questionId: 'days-per-week',
        value: 3
      };
      
      const result = ConditionalLogicEvaluator.evaluateCondition(condition, responses);
      expect(result).toBe(true);
    });
    
    test('evaluates greaterThan condition - false', () => {
      const responses: IntakeResponses = {
        'days-per-week': 2
      };
      
      const condition = {
        type: 'greaterThan' as const,
        questionId: 'days-per-week',
        value: 3
      };
      
      const result = ConditionalLogicEvaluator.evaluateCondition(condition, responses);
      expect(result).toBe(false);
    });
  });
  
  describe('lessThan condition', () => {
    test('evaluates lessThan condition - true', () => {
      const responses: IntakeResponses = {
        'training-age': 1
      };
      
      const condition = {
        type: 'lessThan' as const,
        questionId: 'training-age',
        value: 2
      };
      
      const result = ConditionalLogicEvaluator.evaluateCondition(condition, responses);
      expect(result).toBe(true);
    });
    
    test('evaluates lessThan condition - false', () => {
      const responses: IntakeResponses = {
        'training-age': 5
      };
      
      const condition = {
        type: 'lessThan' as const,
        questionId: 'training-age',
        value: 2
      };
      
      const result = ConditionalLogicEvaluator.evaluateCondition(condition, responses);
      expect(result).toBe(false);
    });
  });
  
  describe('and condition', () => {
    test('evaluates and condition - both true', () => {
      const responses: IntakeResponses = {
        'has-injury': 'yes',
        'medical-clearance': 'yes'
      };
      
      const condition = {
        type: 'and' as const,
        conditions: [
          {
            type: 'equals' as const,
            questionId: 'has-injury',
            value: 'yes'
          },
          {
            type: 'equals' as const,
            questionId: 'medical-clearance',
            value: 'yes'
          }
        ]
      };
      
      const result = ConditionalLogicEvaluator.evaluateCondition(condition, responses);
      expect(result).toBe(true);
    });
    
    test('evaluates and condition - one false', () => {
      const responses: IntakeResponses = {
        'has-injury': 'yes',
        'medical-clearance': 'no'
      };
      
      const condition = {
        type: 'and' as const,
        conditions: [
          {
            type: 'equals' as const,
            questionId: 'has-injury',
            value: 'yes'
          },
          {
            type: 'equals' as const,
            questionId: 'medical-clearance',
            value: 'yes'
          }
        ]
      };
      
      const result = ConditionalLogicEvaluator.evaluateCondition(condition, responses);
      expect(result).toBe(false);
    });
  });
  
  describe('or condition', () => {
    test('evaluates or condition - one true', () => {
      const responses: IntakeResponses = {
        'goal': 'lose weight'
      };
      
      const condition = {
        type: 'or' as const,
        conditions: [
          {
            type: 'contains' as const,
            questionId: 'goal',
            value: 'lose'
          },
          {
            type: 'contains' as const,
            questionId: 'goal',
            value: 'fat'
          }
        ]
      };
      
      const result = ConditionalLogicEvaluator.evaluateCondition(condition, responses);
      expect(result).toBe(true);
    });
    
    test('evaluates or condition - both false', () => {
      const responses: IntakeResponses = {
        'goal': 'gain muscle'
      };
      
      const condition = {
        type: 'or' as const,
        conditions: [
          {
            type: 'contains' as const,
            questionId: 'goal',
            value: 'lose'
          },
          {
            type: 'contains' as const,
            questionId: 'goal',
            value: 'fat'
          }
        ]
      };
      
      const result = ConditionalLogicEvaluator.evaluateCondition(condition, responses);
      expect(result).toBe(false);
    });
  });
  
  describe('not condition', () => {
    test('evaluates not condition - negates true to false', () => {
      const responses: IntakeResponses = {
        'client-type': 'NUTRITION_ONLY'
      };
      
      const condition = {
        type: 'not' as const,
        conditions: [{
          type: 'equals' as const,
          questionId: 'client-type',
          value: 'NUTRITION_ONLY'
        }]
      };
      
      const result = ConditionalLogicEvaluator.evaluateCondition(condition, responses);
      expect(result).toBe(false);
    });
    
    test('evaluates not condition - negates false to true', () => {
      const responses: IntakeResponses = {
        'client-type': 'WORKOUT_ONLY'
      };
      
      const condition = {
        type: 'not' as const,
        conditions: [{
          type: 'equals' as const,
          questionId: 'client-type',
          value: 'NUTRITION_ONLY'
        }]
      };
      
      const result = ConditionalLogicEvaluator.evaluateCondition(condition, responses);
      expect(result).toBe(true);
    });
  });
  
  describe('complex nested conditions', () => {
    test('evaluates complex nested condition', () => {
      const responses: IntakeResponses = {
        'client-type': 'ATHLETE_PERFORMANCE',
        'competition-level': 'college',
        'has-testing-data': 'yes'
      };
      
      const condition = {
        type: 'and' as const,
        conditions: [
          {
            type: 'equals' as const,
            questionId: 'client-type',
            value: 'ATHLETE_PERFORMANCE'
          },
          {
            type: 'or' as const,
            conditions: [
              {
                type: 'equals' as const,
                questionId: 'competition-level',
                value: ['college', 'professional']
              },
              {
                type: 'equals' as const,
                questionId: 'has-testing-data',
                value: 'yes'
              }
            ]
          }
        ]
      };
      
      const result = ConditionalLogicEvaluator.evaluateCondition(condition, responses);
      expect(result).toBe(true);
    });
  });
});
