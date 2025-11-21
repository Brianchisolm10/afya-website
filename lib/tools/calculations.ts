/**
 * Health Tools Calculation Utilities
 * 
 * This module provides calculation functions for various health metrics
 * including BMR, TDEE, heart rate zones, and protein requirements.
 */

export interface HeartRateZones {
  easy: { min: number; max: number };
  moderate: { min: number; max: number };
  vigorous: { min: number; max: number };
  maxHR: number;
}

/**
 * Calculate Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation
 * 
 * @param weightKg - Weight in kilograms
 * @param heightCm - Height in centimeters
 * @param age - Age in years
 * @param sex - Biological sex ('male' or 'female')
 * @returns BMR in calories per day
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: 'male' | 'female'
): number {
  // Mifflin-St Jeor equation
  // Men: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(y) + 5
  // Women: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(y) - 161
  
  const baseBMR = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const sexAdjustment = sex === 'male' ? 5 : -161;
  
  return Math.round(baseBMR + sexAdjustment);
}

/**
 * Calculate Total Daily Energy Expenditure (TDEE)
 * 
 * @param bmr - Basal Metabolic Rate
 * @param activityLevel - Activity level multiplier key
 * @returns TDEE in calories per day
 */
export function calculateTDEE(
  bmr: number,
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
): number {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  
  return Math.round(bmr * multipliers[activityLevel]);
}

/**
 * Calculate protein range based on activity level and goal
 * 
 * @param weightKg - Weight in kilograms
 * @param activityLevel - Activity level
 * @param goal - Fitness goal
 * @returns Object with min and max protein in grams per day
 */
export function calculateProteinRange(
  weightKg: number,
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active',
  goal: 'lose' | 'maintain' | 'gain'
): { min: number; max: number } {
  let minMultiplier = 0.8;
  let maxMultiplier = 1.0;
  
  // Adjust based on activity level
  if (activityLevel === 'moderate' || activityLevel === 'active') {
    minMultiplier = 1.2;
    maxMultiplier = 1.6;
  } else if (activityLevel === 'very_active') {
    minMultiplier = 1.6;
    maxMultiplier = 2.0;
  }
  
  // Adjust based on goal
  if (goal === 'lose') {
    // Higher protein helps preserve muscle during weight loss
    minMultiplier = Math.max(minMultiplier, 1.2);
    maxMultiplier = Math.max(maxMultiplier, 1.6);
  } else if (goal === 'gain') {
    // Higher protein supports muscle growth
    minMultiplier = Math.max(minMultiplier, 1.4);
    maxMultiplier = Math.max(maxMultiplier, 2.0);
  }
  
  return {
    min: Math.round(weightKg * minMultiplier),
    max: Math.round(weightKg * maxMultiplier),
  };
}

/**
 * Calculate heart rate zones using age-based formula
 * 
 * @param age - Age in years
 * @param restingHR - Optional resting heart rate for Karvonen formula
 * @returns Heart rate zones object
 */
export function calculateHeartRateZones(
  age: number,
  restingHR?: number
): HeartRateZones {
  // Calculate maximum heart rate
  const maxHR = 220 - age;
  
  if (restingHR) {
    // Use Karvonen formula for more accurate zones
    // Target HR = ((max HR − resting HR) × %Intensity) + resting HR
    const hrReserve = maxHR - restingHR;
    
    return {
      easy: {
        min: Math.round(hrReserve * 0.5 + restingHR),
        max: Math.round(hrReserve * 0.6 + restingHR),
      },
      moderate: {
        min: Math.round(hrReserve * 0.6 + restingHR),
        max: Math.round(hrReserve * 0.7 + restingHR),
      },
      vigorous: {
        min: Math.round(hrReserve * 0.7 + restingHR),
        max: Math.round(hrReserve * 0.85 + restingHR),
      },
      maxHR,
    };
  } else {
    // Use simple percentage method
    return {
      easy: {
        min: Math.round(maxHR * 0.5),
        max: Math.round(maxHR * 0.6),
      },
      moderate: {
        min: Math.round(maxHR * 0.6),
        max: Math.round(maxHR * 0.7),
      },
      vigorous: {
        min: Math.round(maxHR * 0.7),
        max: Math.round(maxHR * 0.85),
      },
      maxHR,
    };
  }
}

/**
 * Convert pounds to kilograms
 */
export function lbsToKg(lbs: number): number {
  return lbs * 0.453592;
}

/**
 * Convert kilograms to pounds
 */
export function kgToLbs(kg: number): number {
  return kg * 2.20462;
}

/**
 * Convert inches to centimeters
 */
export function inchesToCm(inches: number): number {
  return inches * 2.54;
}

/**
 * Convert centimeters to inches
 */
export function cmToInches(cm: number): number {
  return cm / 2.54;
}

/**
 * Convert feet and inches to centimeters
 */
export function feetInchesToCm(feet: number, inches: number): number {
  return inchesToCm(feet * 12 + inches);
}

/**
 * Get sleep recommendations based on age
 * 
 * @param age - Age in years (optional, defaults to adult range)
 * @returns Object with min and max recommended sleep hours
 */
export function getSleepRecommendations(age?: number): { min: number; max: number } {
  if (!age) {
    // Default to adult range
    return { min: 7, max: 9 };
  }
  
  if (age >= 13 && age <= 17) {
    // Teens
    return { min: 8, max: 10 };
  } else if (age >= 18 && age <= 64) {
    // Adults
    return { min: 7, max: 9 };
  } else {
    // Seniors (65+)
    return { min: 7, max: 8 };
  }
}

/**
 * Get hydration recommendations
 * 
 * @returns Object with min and max recommended water cups per day
 */
export function getHydrationRecommendations(): { min: number; max: number } {
  // General recommendation: 8-10 cups per day
  return { min: 8, max: 10 };
}

/**
 * Compare a value to a range and return status
 * 
 * @param value - The value to compare
 * @param min - Minimum of the range
 * @param max - Maximum of the range
 * @returns Status: 'below', 'within', or 'above'
 */
export function compareToRange(
  value: number,
  min: number,
  max: number
): 'below' | 'within' | 'above' {
  if (value < min) return 'below';
  if (value > max) return 'above';
  return 'within';
}

/**
 * Get a sleep improvement tip based on current status
 * 
 * @param status - Current sleep status
 * @returns A helpful tip for improving sleep
 */
export function getSleepTip(status: 'below' | 'within' | 'above'): string {
  const belowTips = [
    'Try keeping a consistent sleep schedule, even on weekends',
    'Create a relaxing bedtime routine 30 minutes before sleep',
    'Keep your bedroom cool, dark, and quiet',
    'Limit screen time at least an hour before bed',
  ];
  
  const withinTips = [
    'Great job! Keep maintaining your consistent sleep schedule',
    'You\'re doing well. Consider tracking your sleep quality too',
    'Nice work! A consistent routine helps maintain good sleep',
  ];
  
  const aboveTips = [
    'While sleep is important, make sure you\'re balancing rest with activity',
    'Quality matters as much as quantity. Focus on sleep quality too',
    'Consider if you\'re getting enough physical activity during the day',
  ];
  
  const tips = status === 'below' ? belowTips : status === 'within' ? withinTips : aboveTips;
  return tips[Math.floor(Math.random() * tips.length)];
}

/**
 * Get a hydration improvement tip based on current status
 * 
 * @param status - Current hydration status
 * @returns A helpful tip for improving hydration
 */
export function getHydrationTip(status: 'below' | 'within' | 'above'): string {
  const belowTips = [
    'Keep a water bottle with you throughout the day',
    'Set reminders on your phone to drink water',
    'Drink a glass of water with each meal',
    'Add fruit slices to your water for flavor',
  ];
  
  const withinTips = [
    'You\'re doing great! Keep up your hydration habits',
    'Nice work staying hydrated. Your body thanks you',
    'Excellent! Consistent hydration supports your overall health',
  ];
  
  const aboveTips = [
    'You\'re well hydrated! Just make sure it feels comfortable',
    'Great hydration! Balance is key - listen to your body',
    'Excellent hydration. Make sure you\'re not overdoing it',
  ];
  
  const tips = status === 'below' ? belowTips : status === 'within' ? withinTips : aboveTips;
  return tips[Math.floor(Math.random() * tips.length)];
}
