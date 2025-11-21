/**
 * Health Tools Constants and Configuration
 * 
 * This module provides constants, multipliers, ranges, and templates
 * used across all health tools
 */

/**
 * Activity level multipliers for TDEE calculation
 */
export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,      // Little or no exercise
  light: 1.375,        // Light exercise 1-3 days/week
  moderate: 1.55,      // Moderate exercise 3-5 days/week
  active: 1.725,       // Hard exercise 6-7 days/week
  very_active: 1.9,    // Very hard exercise & physical job
} as const;

/**
 * Activity level descriptions for UI
 */
export const ACTIVITY_DESCRIPTIONS = {
  sedentary: 'Little or no exercise',
  light: 'Light exercise 1-3 days/week',
  moderate: 'Moderate exercise 3-5 days/week',
  active: 'Hard exercise 6-7 days/week',
  very_active: 'Very hard exercise & physical job',
} as const;

/**
 * Protein recommendations (grams per kg body weight)
 */
export const PROTEIN_RANGES = {
  sedentary: { min: 0.8, max: 1.0 },
  light: { min: 1.0, max: 1.2 },
  moderate: { min: 1.2, max: 1.6 },
  active: { min: 1.4, max: 1.8 },
  very_active: { min: 1.6, max: 2.0 },
} as const;

/**
 * Sleep recommendations by age group (hours per night)
 */
export const SLEEP_RANGES = {
  teen: { min: 8, max: 10, ageMin: 13, ageMax: 17 },
  adult: { min: 7, max: 9, ageMin: 18, ageMax: 64 },
  senior: { min: 7, max: 8, ageMin: 65, ageMax: 100 },
} as const;

/**
 * Hydration recommendations (cups per day)
 */
export const HYDRATION_RANGES = {
  general: { min: 8, max: 10 },
  active: { min: 10, max: 13 },
} as const;

/**
 * Plate proportion templates for different goals and meals
 * Percentages represent approximate portions of the plate
 */
export interface PlateProportions {
  vegetables: number;
  protein: number;
  carbs: number;
  fats: number;
}

export const PLATE_TEMPLATES: Record<string, Record<string, PlateProportions>> = {
  energy: {
    breakfast: { vegetables: 20, protein: 25, carbs: 45, fats: 10 },
    lunch: { vegetables: 35, protein: 25, carbs: 30, fats: 10 },
    dinner: { vegetables: 40, protein: 30, carbs: 20, fats: 10 },
  },
  performance: {
    breakfast: { vegetables: 15, protein: 30, carbs: 45, fats: 10 },
    lunch: { vegetables: 30, protein: 30, carbs: 30, fats: 10 },
    dinner: { vegetables: 35, protein: 35, carbs: 20, fats: 10 },
  },
  recovery: {
    breakfast: { vegetables: 25, protein: 30, carbs: 35, fats: 10 },
    lunch: { vegetables: 40, protein: 30, carbs: 20, fats: 10 },
    dinner: { vegetables: 45, protein: 30, carbs: 15, fats: 10 },
  },
} as const;

/**
 * Example meals for each goal/meal combination
 */
export const MEAL_EXAMPLES: Record<string, Record<string, string[]>> = {
  energy: {
    breakfast: [
      'Oatmeal with berries, nuts, and a side of scrambled eggs',
      'Whole grain toast with avocado, eggs, and fruit',
      'Greek yogurt parfait with granola, banana, and honey',
    ],
    lunch: [
      'Grilled chicken salad with quinoa, mixed greens, and olive oil dressing',
      'Turkey and veggie wrap with hummus and a side of fruit',
      'Brown rice bowl with salmon, roasted vegetables, and tahini',
    ],
    dinner: [
      'Baked fish with roasted sweet potato and steamed broccoli',
      'Lean beef stir-fry with lots of colorful vegetables over rice',
      'Grilled chicken with quinoa and a large mixed salad',
    ],
  },
  performance: {
    breakfast: [
      'Protein pancakes with berries and a side of turkey sausage',
      'Egg white omelet with vegetables, whole grain toast, and fruit',
      'Smoothie bowl with protein powder, banana, berries, and granola',
    ],
    lunch: [
      'Grilled chicken breast with brown rice and roasted vegetables',
      'Tuna salad with mixed greens, chickpeas, and whole grain crackers',
      'Lean beef burger on whole grain bun with sweet potato fries and salad',
    ],
    dinner: [
      'Grilled salmon with quinoa and asparagus',
      'Chicken breast with roasted vegetables and a small portion of pasta',
      'Lean steak with roasted Brussels sprouts and a side salad',
    ],
  },
  recovery: {
    breakfast: [
      'Veggie-packed omelet with avocado and a small portion of whole grain toast',
      'Greek yogurt with berries, chia seeds, and a handful of nuts',
      'Smoothie with spinach, protein powder, berries, and almond butter',
    ],
    lunch: [
      'Large mixed salad with grilled chicken, lots of vegetables, and olive oil',
      'Vegetable soup with white beans and a side of grilled fish',
      'Buddha bowl with roasted vegetables, chickpeas, and tahini dressing',
    ],
    dinner: [
      'Grilled fish with a large portion of roasted vegetables',
      'Chicken breast with cauliflower rice and steamed broccoli',
      'Vegetable stir-fry with tofu and a small portion of brown rice',
    ],
  },
} as const;

/**
 * Recovery assessment thresholds
 */
export const RECOVERY_THRESHOLDS = {
  recovery: { max: 2.5, label: 'Recovery Day', color: 'red' },
  halfSpeed: { min: 2.5, max: 3.5, label: 'Half-Speed Day', color: 'yellow' },
  greenLight: { min: 3.5, label: 'Green Light Day', color: 'green' },
} as const;

/**
 * Recovery guidance messages based on score
 */
export const RECOVERY_GUIDANCE = {
  recovery: 'Your body is asking for rest. Focus on gentle movement, hydration, and sleep today.',
  halfSpeed: 'You\'re recovering but not quite at 100%. Consider a lighter workout or active recovery.',
  greenLight: 'You\'re feeling good! This is a great day for a challenging workout or training session.',
} as const;

/**
 * Sleep improvement tips
 */
export const SLEEP_TIPS = [
  'Try keeping a consistent sleep schedule, even on weekends',
  'Create a relaxing bedtime routine 30 minutes before sleep',
  'Keep your bedroom cool, dark, and quiet',
  'Limit screen time at least an hour before bed',
  'Avoid caffeine in the afternoon and evening',
  'Get some natural sunlight during the day',
] as const;

/**
 * Hydration improvement tips
 */
export const HYDRATION_TIPS = [
  'Keep a water bottle with you throughout the day',
  'Set reminders on your phone to drink water',
  'Drink a glass of water with each meal',
  'Add fruit slices to your water for flavor',
  'Drink a glass of water when you wake up',
  'Track your water intake with an app or journal',
] as const;

/**
 * Youth movement suggestions
 */
export const YOUTH_MOVEMENT_SUGGESTIONS = [
  'Take a family walk after dinner',
  'Play a game of tag or hide-and-seek',
  'Dance to your favorite music for 10 minutes',
  'Ride bikes around the neighborhood',
  'Play catch or shoot hoops in the driveway',
  'Do a fun workout video together',
  'Visit a local playground or park',
  'Have a dance party in the living room',
  'Go for a nature hike and explore',
  'Play active video games that get you moving',
] as const;

/**
 * Goal descriptions for UI
 */
export const GOAL_DESCRIPTIONS = {
  lose: 'Lose weight',
  maintain: 'Maintain weight',
  gain: 'Gain muscle',
} as const;

/**
 * Meal type descriptions for UI
 */
export const MEAL_TYPE_DESCRIPTIONS = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
} as const;

/**
 * Plate goal descriptions for UI
 */
export const PLATE_GOAL_DESCRIPTIONS = {
  energy: 'Balanced Energy',
  performance: 'Athletic Performance',
  recovery: 'Recovery & Wellness',
} as const;
