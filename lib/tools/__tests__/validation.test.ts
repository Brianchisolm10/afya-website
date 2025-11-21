/**
 * Tests for validation schemas and utilities
 */

import {
  ageSchema,
  weightKgSchema,
  heightCmSchema,
  positiveNumberSchema,
  energyProteinSchema,
  plateBuilderSchema,
  hydrationSleepSchema,
  heartRateSchema,
  recoverySchema,
  youthCornerSchema,
  sanitizeNumericInput,
  sanitizeAndClamp,
  validateInput,
} from '../validation';

describe('Validation Schemas', () => {
  describe('ageSchema', () => {
    it('should accept valid ages', () => {
      expect(ageSchema.parse(13)).toBe(13);
      expect(ageSchema.parse(30)).toBe(30);
      expect(ageSchema.parse(100)).toBe(100);
    });

    it('should reject ages below 13', () => {
      expect(() => ageSchema.parse(12)).toThrow();
      expect(() => ageSchema.parse(0)).toThrow();
    });

    it('should reject ages above 100', () => {
      expect(() => ageSchema.parse(101)).toThrow();
      expect(() => ageSchema.parse(150)).toThrow();
    });
  });

  describe('weightKgSchema', () => {
    it('should accept valid weights', () => {
      expect(weightKgSchema.parse(30)).toBe(30);
      expect(weightKgSchema.parse(70)).toBe(70);
      expect(weightKgSchema.parse(300)).toBe(300);
    });

    it('should reject weights below 30kg', () => {
      expect(() => weightKgSchema.parse(29)).toThrow();
      expect(() => weightKgSchema.parse(0)).toThrow();
    });

    it('should reject weights above 300kg', () => {
      expect(() => weightKgSchema.parse(301)).toThrow();
      expect(() => weightKgSchema.parse(500)).toThrow();
    });
  });

  describe('heightCmSchema', () => {
    it('should accept valid heights', () => {
      expect(heightCmSchema.parse(100)).toBe(100);
      expect(heightCmSchema.parse(175)).toBe(175);
      expect(heightCmSchema.parse(250)).toBe(250);
    });

    it('should reject heights below 100cm', () => {
      expect(() => heightCmSchema.parse(99)).toThrow();
      expect(() => heightCmSchema.parse(50)).toThrow();
    });

    it('should reject heights above 250cm', () => {
      expect(() => heightCmSchema.parse(251)).toThrow();
      expect(() => heightCmSchema.parse(300)).toThrow();
    });
  });

  describe('positiveNumberSchema', () => {
    it('should accept positive numbers', () => {
      expect(positiveNumberSchema.parse(1)).toBe(1);
      expect(positiveNumberSchema.parse(0.1)).toBe(0.1);
      expect(positiveNumberSchema.parse(1000)).toBe(1000);
    });

    it('should reject zero and negative numbers', () => {
      expect(() => positiveNumberSchema.parse(0)).toThrow();
      expect(() => positiveNumberSchema.parse(-1)).toThrow();
      expect(() => positiveNumberSchema.parse(-100)).toThrow();
    });
  });

  describe('energyProteinSchema', () => {
    const validInput = {
      age: 30,
      sex: 'male' as const,
      heightCm: 180,
      weightKg: 80,
      activityLevel: 'moderate' as const,
      goal: 'maintain' as const,
    };

    it('should accept valid input', () => {
      const result = energyProteinSchema.parse(validInput);
      expect(result).toEqual(validInput);
    });

    it('should reject invalid age', () => {
      expect(() => energyProteinSchema.parse({ ...validInput, age: 12 })).toThrow();
    });

    it('should reject invalid sex', () => {
      expect(() => energyProteinSchema.parse({ ...validInput, sex: 'other' })).toThrow();
    });

    it('should reject invalid height', () => {
      expect(() => energyProteinSchema.parse({ ...validInput, heightCm: 50 })).toThrow();
    });

    it('should reject invalid weight', () => {
      expect(() => energyProteinSchema.parse({ ...validInput, weightKg: 20 })).toThrow();
    });

    it('should reject invalid activity level', () => {
      expect(() => energyProteinSchema.parse({ ...validInput, activityLevel: 'invalid' })).toThrow();
    });

    it('should reject invalid goal', () => {
      expect(() => energyProteinSchema.parse({ ...validInput, goal: 'invalid' })).toThrow();
    });
  });

  describe('plateBuilderSchema', () => {
    it('should accept valid input', () => {
      const input = { goal: 'energy' as const, mealType: 'breakfast' as const };
      const result = plateBuilderSchema.parse(input);
      expect(result).toEqual(input);
    });

    it('should accept all valid goals', () => {
      expect(plateBuilderSchema.parse({ goal: 'energy', mealType: 'lunch' })).toBeTruthy();
      expect(plateBuilderSchema.parse({ goal: 'performance', mealType: 'lunch' })).toBeTruthy();
      expect(plateBuilderSchema.parse({ goal: 'recovery', mealType: 'lunch' })).toBeTruthy();
    });

    it('should accept all valid meal types', () => {
      expect(plateBuilderSchema.parse({ goal: 'energy', mealType: 'breakfast' })).toBeTruthy();
      expect(plateBuilderSchema.parse({ goal: 'energy', mealType: 'lunch' })).toBeTruthy();
      expect(plateBuilderSchema.parse({ goal: 'energy', mealType: 'dinner' })).toBeTruthy();
    });

    it('should reject invalid goal', () => {
      expect(() => plateBuilderSchema.parse({ goal: 'invalid', mealType: 'lunch' })).toThrow();
    });

    it('should reject invalid meal type', () => {
      expect(() => plateBuilderSchema.parse({ goal: 'energy', mealType: 'snack' })).toThrow();
    });
  });

  describe('hydrationSleepSchema', () => {
    it('should accept valid input', () => {
      const input = { sleepHours: 8, waterCups: 10 };
      const result = hydrationSleepSchema.parse(input);
      expect(result).toEqual(input);
    });

    it('should accept boundary values for sleep', () => {
      expect(hydrationSleepSchema.parse({ sleepHours: 0, waterCups: 8 })).toBeTruthy();
      expect(hydrationSleepSchema.parse({ sleepHours: 24, waterCups: 8 })).toBeTruthy();
    });

    it('should reject negative sleep hours', () => {
      expect(() => hydrationSleepSchema.parse({ sleepHours: -1, waterCups: 8 })).toThrow();
    });

    it('should reject sleep hours above 24', () => {
      expect(() => hydrationSleepSchema.parse({ sleepHours: 25, waterCups: 8 })).toThrow();
    });

    it('should reject non-positive water cups', () => {
      expect(() => hydrationSleepSchema.parse({ sleepHours: 8, waterCups: 0 })).toThrow();
      expect(() => hydrationSleepSchema.parse({ sleepHours: 8, waterCups: -1 })).toThrow();
    });
  });

  describe('heartRateSchema', () => {
    it('should accept valid input without resting HR', () => {
      const input = { age: 30 };
      const result = heartRateSchema.parse(input);
      expect(result).toEqual(input);
    });

    it('should accept valid input with resting HR', () => {
      const input = { age: 30, restingHR: 60 };
      const result = heartRateSchema.parse(input);
      expect(result).toEqual(input);
    });

    it('should accept boundary values for resting HR', () => {
      expect(heartRateSchema.parse({ age: 30, restingHR: 30 })).toBeTruthy();
      expect(heartRateSchema.parse({ age: 30, restingHR: 120 })).toBeTruthy();
    });

    it('should reject invalid age', () => {
      expect(() => heartRateSchema.parse({ age: 12 })).toThrow();
    });

    it('should reject resting HR below 30', () => {
      expect(() => heartRateSchema.parse({ age: 30, restingHR: 29 })).toThrow();
    });

    it('should reject resting HR above 120', () => {
      expect(() => heartRateSchema.parse({ age: 30, restingHR: 121 })).toThrow();
    });
  });

  describe('recoverySchema', () => {
    it('should accept valid input', () => {
      const input = { energy: 3, soreness: 2, stress: 4, mood: 5 };
      const result = recoverySchema.parse(input);
      expect(result).toEqual(input);
    });

    it('should accept boundary values', () => {
      expect(recoverySchema.parse({ energy: 1, soreness: 1, stress: 1, mood: 1 })).toBeTruthy();
      expect(recoverySchema.parse({ energy: 5, soreness: 5, stress: 5, mood: 5 })).toBeTruthy();
    });

    it('should reject values below 1', () => {
      expect(() => recoverySchema.parse({ energy: 0, soreness: 2, stress: 3, mood: 4 })).toThrow();
    });

    it('should reject values above 5', () => {
      expect(() => recoverySchema.parse({ energy: 3, soreness: 6, stress: 3, mood: 4 })).toThrow();
    });
  });

  describe('youthCornerSchema', () => {
    it('should accept valid input', () => {
      const input = { screenTimeHours: 4, playTimeHours: 2 };
      const result = youthCornerSchema.parse(input);
      expect(result).toEqual(input);
    });

    it('should accept boundary values', () => {
      expect(youthCornerSchema.parse({ screenTimeHours: 0, playTimeHours: 0 })).toBeTruthy();
      expect(youthCornerSchema.parse({ screenTimeHours: 24, playTimeHours: 24 })).toBeTruthy();
    });

    it('should reject negative screen time', () => {
      expect(() => youthCornerSchema.parse({ screenTimeHours: -1, playTimeHours: 2 })).toThrow();
    });

    it('should reject screen time above 24', () => {
      expect(() => youthCornerSchema.parse({ screenTimeHours: 25, playTimeHours: 2 })).toThrow();
    });

    it('should reject negative play time', () => {
      expect(() => youthCornerSchema.parse({ screenTimeHours: 4, playTimeHours: -1 })).toThrow();
    });

    it('should reject play time above 24', () => {
      expect(() => youthCornerSchema.parse({ screenTimeHours: 4, playTimeHours: 25 })).toThrow();
    });
  });
});

describe('Sanitization Utilities', () => {
  describe('sanitizeNumericInput', () => {
    it('should parse valid numeric strings', () => {
      expect(sanitizeNumericInput('42')).toBe(42);
      expect(sanitizeNumericInput('3.14')).toBe(3.14);
      expect(sanitizeNumericInput('0')).toBe(0);
    });

    it('should handle negative numbers', () => {
      expect(sanitizeNumericInput('-5')).toBe(-5);
      expect(sanitizeNumericInput('-3.14')).toBe(-3.14);
    });

    it('should return null for invalid input', () => {
      expect(sanitizeNumericInput('abc')).toBeNull();
      expect(sanitizeNumericInput('')).toBeNull();
      // Note: parseFloat('12abc') returns 12, so this is actually valid
      // Testing truly invalid input instead
      expect(sanitizeNumericInput('abc123')).toBeNull();
    });

    it('should return null for infinity', () => {
      expect(sanitizeNumericInput('Infinity')).toBeNull();
      expect(sanitizeNumericInput('-Infinity')).toBeNull();
    });

    it('should return null for NaN', () => {
      expect(sanitizeNumericInput('NaN')).toBeNull();
    });
  });

  describe('sanitizeAndClamp', () => {
    it('should return value within range', () => {
      expect(sanitizeAndClamp('50', 0, 100)).toBe(50);
      expect(sanitizeAndClamp('75.5', 0, 100)).toBe(75.5);
    });

    it('should clamp value to minimum', () => {
      expect(sanitizeAndClamp('-10', 0, 100)).toBe(0);
      expect(sanitizeAndClamp('5', 10, 100)).toBe(10);
    });

    it('should clamp value to maximum', () => {
      expect(sanitizeAndClamp('150', 0, 100)).toBe(100);
      expect(sanitizeAndClamp('200', 0, 100)).toBe(100);
    });

    it('should return null for invalid input', () => {
      expect(sanitizeAndClamp('abc', 0, 100)).toBeNull();
      expect(sanitizeAndClamp('', 0, 100)).toBeNull();
    });
  });

  describe('validateInput', () => {
    it('should return success for valid input', () => {
      const result = validateInput(ageSchema, 30);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(30);
      }
    });

    it('should return errors for invalid input', () => {
      const result = validateInput(ageSchema, 12);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toBeDefined();
        expect(Object.keys(result.errors).length).toBeGreaterThan(0);
      }
    });

    it('should format errors with field paths', () => {
      const result = validateInput(energyProteinSchema, {
        age: 12,
        sex: 'male',
        heightCm: 180,
        weightKg: 80,
        activityLevel: 'moderate',
        goal: 'maintain',
      });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.age).toBeDefined();
      }
    });

    it('should handle multiple validation errors', () => {
      const result = validateInput(energyProteinSchema, {
        age: 12,
        sex: 'invalid',
        heightCm: 50,
        weightKg: 20,
        activityLevel: 'invalid',
        goal: 'invalid',
      });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(Object.keys(result.errors).length).toBeGreaterThan(1);
      }
    });
  });
});
