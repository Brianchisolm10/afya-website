/**
 * Health Tools TypeScript Interfaces
 * 
 * This module defines all TypeScript interfaces for tool inputs and outputs
 */

/**
 * Energy & Protein Calculator
 */
export interface EnergyProteinInputs {
  age: number;
  sex: 'male' | 'female';
  heightCm: number;
  weightKg: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose' | 'maintain' | 'gain';
}

export interface EnergyProteinResults {
  dailyCalories: number;
  proteinRangeMin: number;
  proteinRangeMax: number;
  bmr: number;
  tdee: number;
  explanation: string;
}

/**
 * Plate Builder
 */
export interface PlateBuilderInputs {
  goal: 'energy' | 'performance' | 'recovery';
  mealType: 'breakfast' | 'lunch' | 'dinner';
}

export interface PlateProportions {
  vegetables: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface PlateBuilderResults {
  proportions: PlateProportions;
  examples: string[];
  explanation: string;
}

/**
 * Hydration & Sleep Snapshot
 */
export interface HydrationSleepInputs {
  sleepHours: number;
  waterCups: number;
}

export type StatusLevel = 'below' | 'within' | 'above';

export interface HydrationSleepResults {
  sleepStatus: StatusLevel;
  hydrationStatus: StatusLevel;
  sleepTip: string;
  hydrationTip: string;
  sleepRange: { min: number; max: number };
  hydrationRange: { min: number; max: number };
}

/**
 * Heart Rate Zone Finder
 */
export interface HeartRateInputs {
  age: number;
  restingHR?: number;
}

export interface HeartRateZone {
  min: number;
  max: number;
}

export interface HeartRateZones {
  easy: HeartRateZone;
  moderate: HeartRateZone;
  vigorous: HeartRateZone;
  maxHR: number;
}

export interface HeartRateResults extends HeartRateZones {
  explanation: string;
  usingKarvonen: boolean;
}

/**
 * Stress & Recovery Check-In
 */
export interface RecoveryInputs {
  energy: number; // 1-5 scale
  soreness: number; // 1-5 scale
  stress: number; // 1-5 scale (inverted: 1 = high stress, 5 = low stress)
  mood: number; // 1-5 scale
}

export type RecoveryLabel = 'Recovery Day' | 'Half-Speed Day' | 'Green Light Day';

export interface RecoveryResults {
  score: number;
  label: RecoveryLabel;
  guidance: string;
  color: 'red' | 'yellow' | 'green';
}

/**
 * Youth Corner
 */
export interface YouthInputs {
  screenTimeHours: number;
  playTimeHours: number;
}

export interface YouthResults {
  ratio: number;
  message: string;
  suggestion: string;
  encouragement: string;
}

/**
 * Common types
 */
export interface ValidationError {
  field: string;
  message: string;
}

export interface ToolState<T> {
  inputs: Partial<T>;
  results: any | null;
  errors: Record<string, string>;
  isCalculating: boolean;
}
