/**
 * Health Tools Validation Schemas
 * 
 * This module provides Zod validation schemas for all health tool inputs
 */

import { z } from 'zod';

/**
 * Shared validation schemas for common inputs
 */
export const ageSchema = z.number().min(13, 'Age must be at least 13').max(100, 'Age must be 100 or less');

export const weightKgSchema = z.number().min(30, 'Weight must be at least 30 kg').max(300, 'Weight must be 300 kg or less');

export const heightCmSchema = z.number().min(100, 'Height must be at least 100 cm').max(250, 'Height must be 250 cm or less');

export const positiveNumberSchema = z.number().positive('Must be a positive number');

/**
 * Energy & Protein Calculator validation schema
 */
export const energyProteinSchema = z.object({
  age: ageSchema,
  sex: z.enum(['male', 'female'], {
    message: 'Please select a sex',
  }),
  heightCm: heightCmSchema,
  weightKg: weightKgSchema,
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active'], {
    message: 'Please select an activity level',
  }),
  goal: z.enum(['lose', 'maintain', 'gain'], {
    message: 'Please select a goal',
  }),
});

export type EnergyProteinInputs = z.infer<typeof energyProteinSchema>;

/**
 * Plate Builder validation schema
 */
export const plateBuilderSchema = z.object({
  goal: z.enum(['energy', 'performance', 'recovery'], {
    message: 'Please select a goal',
  }),
  mealType: z.enum(['breakfast', 'lunch', 'dinner'], {
    message: 'Please select a meal type',
  }),
});

export type PlateBuilderInputs = z.infer<typeof plateBuilderSchema>;

/**
 * Hydration & Sleep Snapshot validation schema
 */
export const hydrationSleepSchema = z.object({
  sleepHours: z.number().min(0, 'Sleep hours cannot be negative').max(24, 'Sleep hours cannot exceed 24'),
  waterCups: positiveNumberSchema,
});

export type HydrationSleepInputs = z.infer<typeof hydrationSleepSchema>;

/**
 * Heart Rate Zone Finder validation schema
 */
export const heartRateSchema = z.object({
  age: ageSchema,
  restingHR: z.number().min(30, 'Resting heart rate must be at least 30 bpm').max(120, 'Resting heart rate must be 120 bpm or less').optional(),
});

export type HeartRateInputs = z.infer<typeof heartRateSchema>;

/**
 * Stress & Recovery Check-In validation schema
 */
export const recoverySchema = z.object({
  energy: z.number().min(1, 'Please rate your energy').max(5, 'Rating must be between 1 and 5'),
  soreness: z.number().min(1, 'Please rate your soreness').max(5, 'Rating must be between 1 and 5'),
  stress: z.number().min(1, 'Please rate your stress').max(5, 'Rating must be between 1 and 5'),
  mood: z.number().min(1, 'Please rate your mood').max(5, 'Rating must be between 1 and 5'),
});

export type RecoveryInputs = z.infer<typeof recoverySchema>;

/**
 * Youth Corner validation schema
 */
export const youthCornerSchema = z.object({
  screenTimeHours: z.number().min(0, 'Screen time cannot be negative').max(24, 'Screen time cannot exceed 24 hours'),
  playTimeHours: z.number().min(0, 'Play time cannot be negative').max(24, 'Play time cannot exceed 24 hours'),
});

export type YouthCornerInputs = z.infer<typeof youthCornerSchema>;

/**
 * Input sanitization utilities
 */

/**
 * Sanitize numeric input from string
 */
export function sanitizeNumericInput(value: string): number | null {
  const num = parseFloat(value);
  if (isNaN(num) || !isFinite(num)) {
    return null;
  }
  return num;
}

/**
 * Sanitize and clamp numeric input within a range
 */
export function sanitizeAndClamp(value: string, min: number, max: number): number | null {
  const num = sanitizeNumericInput(value);
  if (num === null) return null;
  return Math.max(min, Math.min(max, num));
}

/**
 * Validate input with a Zod schema and return formatted errors
 */
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors: Record<string, string> = {};
  result.error.issues.forEach((err: z.ZodIssue) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  
  return { success: false, errors };
}
