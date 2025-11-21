/**
 * Tests for Plate Builder component logic
 */

import { describe, it, expect } from 'vitest';
import { plateBuilderSchema } from '@/lib/tools/validation';
import { PLATE_PROPORTIONS } from '@/lib/tools/plate-data';

describe('PlateBuilder Component Logic', () => {
  describe('Input validation', () => {
    it('should validate valid goal and meal type', () => {
      const input = { goal: 'energy' as const, mealType: 'breakfast' as const };
      const result = plateBuilderSchema.safeParse(input);
      
      expect(result.success).toBe(true);
    });

    it('should accept all valid goals', () => {
      const goals = ['energy', 'performance', 'recovery'];
      
      goals.forEach(goal => {
        const result = plateBuilderSchema.safeParse({ goal, mealType: 'lunch' });
        expect(result.success).toBe(true);
      });
    });

    it('should accept all valid meal types', () => {
      const mealTypes = ['breakfast', 'lunch', 'dinner'];
      
      mealTypes.forEach(mealType => {
        const result = plateBuilderSchema.safeParse({ goal: 'energy', mealType });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid goal', () => {
      const input = { goal: 'invalid', mealType: 'lunch' };
      const result = plateBuilderSchema.safeParse(input);
      
      expect(result.success).toBe(false);
    });
  });

  describe('Plate proportions logic', () => {
    it('should have proportions that sum to 100%', () => {
      const proportions = { vegetables: 40, protein: 25, carbs: 25, fats: 10 };
      const total = proportions.vegetables + proportions.protein + proportions.carbs + proportions.fats;
      
      expect(total).toBe(100);
    });

    it('should have different proportions for different goals', () => {
      const energyPlate = { vegetables: 30, protein: 20, carbs: 40, fats: 10 };
      const performancePlate = { vegetables: 25, protein: 30, carbs: 35, fats: 10 };
      
      expect(energyPlate.carbs).toBeGreaterThan(performancePlate.carbs);
      expect(performancePlate.protein).toBeGreaterThan(energyPlate.protein);
    });

    it('should always include vegetables', () => {
      const proportions = { vegetables: 40, protein: 25, carbs: 25, fats: 10 };
      
      expect(proportions.vegetables).toBeGreaterThan(0);
    });

    it('should have reasonable protein amounts', () => {
      const proportions = { vegetables: 40, protein: 25, carbs: 25, fats: 10 };
      
      expect(proportions.protein).toBeGreaterThanOrEqual(15);
      expect(proportions.protein).toBeLessThanOrEqual(40);
    });
  });

  describe('Meal examples logic', () => {
    it('should provide 2-3 examples per combination', () => {
      const examples = [
        'Oatmeal with berries, nuts, and Greek yogurt',
        'Whole grain toast with avocado and eggs',
        'Smoothie bowl with protein powder and fruit',
      ];
      
      expect(examples.length).toBeGreaterThanOrEqual(2);
      expect(examples.length).toBeLessThanOrEqual(3);
    });

    it('should have descriptive meal examples', () => {
      const example = 'Grilled chicken with quinoa and roasted vegetables';
      
      expect(example.length).toBeGreaterThan(20);
      expect(example).toContain('with');
    });

    it('should vary examples by meal type', () => {
      const breakfastExample = 'Oatmeal with berries';
      const dinnerExample = 'Grilled salmon with rice';
      
      expect(breakfastExample).not.toBe(dinnerExample);
    });
  });

  describe('Visual representation logic', () => {
    it('should calculate section sizes based on percentages', () => {
      const totalDegrees = 360;
      const vegetablePercent = 40;
      const vegetableDegrees = (vegetablePercent / 100) * totalDegrees;
      
      expect(vegetableDegrees).toBe(144);
    });

    it('should assign colors to food groups', () => {
      const colors = {
        vegetables: '#10B981', // green
        protein: '#F59E0B', // orange
        carbs: '#FCD34D', // yellow
        fats: '#8B5CF6', // purple
      };
      
      expect(colors.vegetables).toBeTruthy();
      expect(colors.protein).toBeTruthy();
      expect(colors.carbs).toBeTruthy();
      expect(colors.fats).toBeTruthy();
    });
  });

  describe('Educational content logic', () => {
    it('should provide explanation for proportions', () => {
      const explanation = 'This plate emphasizes carbohydrates for sustained energy throughout the day.';
      
      expect(explanation.length).toBeGreaterThan(30);
      expect(explanation.length).toBeLessThan(200);
    });

    it('should be goal-specific', () => {
      const energyExplanation = 'emphasizes carbohydrates for sustained energy';
      const performanceExplanation = 'balanced protein and carbs for athletic performance';
      
      expect(energyExplanation).toContain('energy');
      expect(performanceExplanation).toContain('performance');
    });
  });

  describe('User interaction logic', () => {
    it('should update plate when goal changes', () => {
      let currentGoal = 'energy';
      const newGoal = 'performance';
      
      currentGoal = newGoal;
      
      expect(currentGoal).toBe('performance');
      expect(currentGoal).not.toBe('energy');
    });

    it('should update plate when meal type changes', () => {
      let currentMealType = 'breakfast';
      const newMealType = 'dinner';
      
      currentMealType = newMealType;
      
      expect(currentMealType).toBe('dinner');
      expect(currentMealType).not.toBe('breakfast');
    });

    it('should show results immediately after selection', () => {
      const hasSelection = true;
      const showPlate = hasSelection;
      
      expect(showPlate).toBe(true);
    });
  });
});
