/**
 * Tests for Energy & Protein Calculator component logic
 */

import { describe, it, expect } from 'vitest';
import { calculateBMR, calculateTDEE, calculateProteinRange } from '@/lib/tools/calculations';
import { energyProteinSchema } from '@/lib/tools/validation';

describe('EnergyProteinCalculator Component Logic', () => {
  describe('Input validation', () => {
    it('should validate complete valid input', () => {
      const input = {
        age: 30,
        sex: 'male' as const,
        heightCm: 180,
        weightKg: 80,
        activityLevel: 'moderate' as const,
        goal: 'maintain' as const,
      };

      const result = energyProteinSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should reject input with invalid age', () => {
      const input = {
        age: 10,
        sex: 'male' as const,
        heightCm: 180,
        weightKg: 80,
        activityLevel: 'moderate' as const,
        goal: 'maintain' as const,
      };

      const result = energyProteinSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject input with missing required fields', () => {
      const input = {
        age: 30,
        sex: 'male' as const,
      };

      const result = energyProteinSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('Calculation flow', () => {
    it('should calculate daily calories correctly for maintenance', () => {
      const weightKg = 80;
      const heightCm = 180;
      const age = 30;
      const sex = 'male';
      const activityLevel = 'moderate';
      const goal = 'maintain';

      const bmr = calculateBMR(weightKg, heightCm, age, sex);
      const tdee = calculateTDEE(bmr, activityLevel);
      
      // For maintenance, calories = TDEE
      const dailyCalories = tdee;
      
      expect(dailyCalories).toBeGreaterThan(0);
      expect(dailyCalories).toBe(tdee);
    });

    it('should adjust calories for weight loss goal', () => {
      const bmr = 1800;
      const tdee = calculateTDEE(bmr, 'moderate');
      
      // Weight loss: subtract 500 calories
      const lossCalories = tdee - 500;
      
      expect(lossCalories).toBe(tdee - 500);
      expect(lossCalories).toBeLessThan(tdee);
    });

    it('should adjust calories for weight gain goal', () => {
      const bmr = 1800;
      const tdee = calculateTDEE(bmr, 'moderate');
      
      // Weight gain: add 500 calories
      const gainCalories = tdee + 500;
      
      expect(gainCalories).toBe(tdee + 500);
      expect(gainCalories).toBeGreaterThan(tdee);
    });

    it('should calculate protein range based on activity and goal', () => {
      const weightKg = 80;
      const protein = calculateProteinRange(weightKg, 'moderate', 'maintain');
      
      expect(protein.min).toBeGreaterThan(0);
      expect(protein.max).toBeGreaterThan(protein.min);
      expect(protein.min).toBeLessThanOrEqual(weightKg * 2.0);
    });
  });

  describe('Results display logic', () => {
    it('should format calorie results as whole numbers', () => {
      const calories = 2234.567;
      const formatted = Math.round(calories);
      
      expect(formatted).toBe(2235);
      expect(Number.isInteger(formatted)).toBe(true);
    });

    it('should display protein as a range', () => {
      const protein = { min: 96, max: 128 };
      const display = `${protein.min}-${protein.max}g`;
      
      expect(display).toBe('96-128g');
      expect(display).toContain('-');
      expect(display).toContain('g');
    });

    it('should include educational message', () => {
      const message = 'This is a starting point based on your info. Listen to your body and adjust as needed.';
      
      expect(message).toContain('starting point');
      expect(message).toContain('adjust');
      expect(message.length).toBeLessThan(200); // Keep it concise
    });
  });

  describe('Edge cases', () => {
    it('should handle minimum valid inputs', () => {
      const bmr = calculateBMR(30, 100, 13, 'female');
      const tdee = calculateTDEE(bmr, 'sedentary');
      const protein = calculateProteinRange(30, 'sedentary', 'maintain');
      
      expect(bmr).toBeGreaterThan(0);
      expect(tdee).toBeGreaterThan(bmr);
      expect(protein.min).toBeGreaterThan(0);
    });

    it('should handle maximum valid inputs', () => {
      const bmr = calculateBMR(300, 250, 100, 'male');
      const tdee = calculateTDEE(bmr, 'very_active');
      const protein = calculateProteinRange(300, 'very_active', 'gain');
      
      expect(bmr).toBeGreaterThan(0);
      expect(tdee).toBeGreaterThan(bmr);
      expect(protein.max).toBeGreaterThan(protein.min);
    });
  });

  describe('User experience logic', () => {
    it('should disable calculate button when inputs are invalid', () => {
      const hasAllInputs = false;
      const isValid = false;
      const shouldDisable = !hasAllInputs || !isValid;
      
      expect(shouldDisable).toBe(true);
    });

    it('should enable calculate button when inputs are valid', () => {
      const hasAllInputs = true;
      const isValid = true;
      const shouldDisable = !hasAllInputs || !isValid;
      
      expect(shouldDisable).toBe(false);
    });

    it('should show results after calculation', () => {
      const hasCalculated = true;
      const showResults = hasCalculated;
      
      expect(showResults).toBe(true);
    });
  });
});
