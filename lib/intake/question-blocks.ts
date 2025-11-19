/**
 * Question Block Library
 * 
 * This file contains all predefined question blocks for the intake system.
 * Each block is a reusable collection of related questions that can be
 * included in multiple intake paths.
 */

import { QuestionBlock } from '@/types/intake';

// ============================================================================
// DEMOGRAPHICS BLOCKS
// ============================================================================

export const basicDemographicsBlock: QuestionBlock = {
  id: 'basic-demographics',
  name: 'Basic Demographics',
  title: 'Tell us about yourself',
  description: 'Basic information to personalize your experience',
  category: 'DEMOGRAPHICS',
  order: 1,
  isActive: true,
  questions: [
    {
      id: 'full-name',
      type: 'text',
      label: 'Full Name',
      placeholder: 'John Doe',
      order: 1,
      isRequired: true,
      validation: [
        { type: 'required', message: 'Name is required' },
        { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' }
      ]
    },
    {
      id: 'email',
      type: 'text',
      label: 'Email Address',
      placeholder: 'john@example.com',
      order: 2,
      isRequired: true,
      validation: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Please enter a valid email address' }
      ]
    },
    {
      id: 'date-of-birth',
      type: 'date',
      label: 'Date of Birth',
      order: 3,
      isRequired: true,
      validation: [
        { type: 'required', message: 'Date of birth is required' }
      ]
    },
    {
      id: 'gender',
      type: 'select',
      label: 'Gender',
      order: 4,
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'non-binary', label: 'Non-binary' },
        { value: 'prefer-not-to-say', label: 'Prefer not to say' }
      ],
      validation: [
        { type: 'required', message: 'Please select your gender' }
      ]
    },
    {
      id: 'height-inches',
      type: 'number',
      label: 'Height (inches)',
      placeholder: '70',
      unit: 'inches',
      order: 5,
      min: 36,
      max: 96,
      validation: [
        { type: 'required', message: 'Height is required' },
        { type: 'min', value: 36, message: 'Height must be at least 36 inches' },
        { type: 'max', value: 96, message: 'Height must be less than 96 inches' }
      ]
    },
    {
      id: 'weight-lbs',
      type: 'number',
      label: 'Current Weight (lbs)',
      placeholder: '150',
      unit: 'lbs',
      order: 6,
      min: 50,
      max: 500,
      validation: [
        { type: 'required', message: 'Weight is required' },
        { type: 'min', value: 50, message: 'Weight must be at least 50 lbs' },
        { type: 'max', value: 500, message: 'Weight must be less than 500 lbs' }
      ]
    }
  ]
};

// ============================================================================
// GOALS BLOCKS
// ============================================================================

export const generalGoalsBlock: QuestionBlock = {
  id: 'general-goals',
  name: 'General Goals',
  title: 'What are your goals?',
  description: 'Help us understand what you want to achieve',
  category: 'GOALS',
  order: 2,
  isActive: true,
  questions: [
    {
      id: 'primary-goal',
      type: 'select',
      label: 'What is your primary goal?',
      order: 1,
      isRequired: true,
      options: [
        { value: 'lose-weight', label: 'Lose weight' },
        { value: 'gain-muscle', label: 'Build muscle' },
        { value: 'improve-performance', label: 'Improve athletic performance' },
        { value: 'general-fitness', label: 'General fitness and health' },
        { value: 'increase-energy', label: 'Increase energy levels' },
        { value: 'improve-mobility', label: 'Improve mobility and flexibility' },
        { value: 'recover-injury', label: 'Recover from injury' },
        { value: 'maintain-health', label: 'Maintain current health' }
      ],
      validation: [
        { type: 'required', message: 'Please select your primary goal' }
      ]
    },
    {
      id: 'target-weight',
      type: 'number',
      label: 'Target Weight (lbs)',
      placeholder: '140',
      unit: 'lbs',
      order: 2,
      min: 50,
      max: 500,
      helpText: 'Optional: Enter your goal weight if applicable',
      conditionalDisplay: {
        type: 'or',
        conditions: [
          { type: 'equals', questionId: 'primary-goal', value: 'lose-weight' },
          { type: 'equals', questionId: 'primary-goal', value: 'gain-muscle' }
        ]
      }
    },
    {
      id: 'timeline',
      type: 'select',
      label: 'What is your timeline?',
      order: 3,
      options: [
        { value: '1-month', label: '1 month' },
        { value: '3-months', label: '3 months' },
        { value: '6-months', label: '6 months' },
        { value: '1-year', label: '1 year' },
        { value: 'no-rush', label: 'No specific timeline' }
      ],
      validation: [
        { type: 'required', message: 'Please select a timeline' }
      ]
    },
    {
      id: 'motivation',
      type: 'textarea',
      label: 'What motivates you to achieve this goal?',
      placeholder: 'Share what drives you...',
      order: 4,
      validation: [
        { type: 'required', message: 'Please share your motivation' },
        { type: 'minLength', value: 10, message: 'Please provide more detail (at least 10 characters)' }
      ]
    },
    {
      id: 'biggest-struggle',
      type: 'textarea',
      label: 'What has been your biggest struggle in the past?',
      placeholder: 'Tell us about challenges you\'ve faced...',
      order: 5,
      validation: [
        { type: 'required', message: 'Please share your biggest struggle' }
      ]
    }
  ]
};

// ============================================================================
// NUTRITION BLOCKS
// ============================================================================

export const dietTypeBlock: QuestionBlock = {
  id: 'diet-type',
  name: 'Diet Type and Preferences',
  title: 'Your dietary approach',
  description: 'Tell us about your current diet and preferences',
  category: 'NUTRITION',
  order: 10,
  isActive: true,
  questions: [
    {
      id: 'diet-type',
      type: 'select',
      label: 'What best describes your current diet?',
      order: 1,
      isRequired: true,
      options: [
        { value: 'omnivore', label: 'Omnivore (eat everything)' },
        { value: 'vegetarian', label: 'Vegetarian' },
        { value: 'vegan', label: 'Vegan' },
        { value: 'pescatarian', label: 'Pescatarian' },
        { value: 'keto', label: 'Ketogenic' },
        { value: 'paleo', label: 'Paleo' },
        { value: 'low-carb', label: 'Low Carb' },
        { value: 'flexible', label: 'Flexible/No specific diet' }
      ],
      validation: [
        { type: 'required', message: 'Please select your diet type' }
      ]
    },
    {
      id: 'eats-animal-products',
      type: 'radio',
      label: 'Do you eat animal products?',
      order: 2,
      isRequired: true,
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ],
      validation: [
        { type: 'required', message: 'Please answer this question' }
      ]
    },
    {
      id: 'meals-per-day',
      type: 'select',
      label: 'How many meals do you typically eat per day?',
      order: 3,
      options: [
        { value: '1-2', label: '1-2 meals' },
        { value: '3', label: '3 meals' },
        { value: '4-5', label: '4-5 meals' },
        { value: '6+', label: '6+ meals' }
      ],
      validation: [
        { type: 'required', message: 'Please select number of meals' }
      ]
    },
    {
      id: 'eats-breakfast',
      type: 'radio',
      label: 'Do you eat breakfast?',
      order: 4,
      options: [
        { value: 'yes', label: 'Yes, regularly' },
        { value: 'sometimes', label: 'Sometimes' },
        { value: 'no', label: 'No, I skip breakfast' }
      ],
      validation: [
        { type: 'required', message: 'Please answer this question' }
      ]
    },
    {
      id: 'fasting-pattern',
      type: 'select',
      label: 'Do you practice intermittent fasting?',
      order: 5,
      options: [
        { value: 'no', label: 'No' },
        { value: '16-8', label: 'Yes, 16:8 (16 hour fast, 8 hour eating window)' },
        { value: '18-6', label: 'Yes, 18:6' },
        { value: '20-4', label: 'Yes, 20:4' },
        { value: 'omad', label: 'Yes, OMAD (one meal a day)' },
        { value: 'other', label: 'Yes, other pattern' }
      ]
    }
  ]
};

export const allergiesRestrictionsBlock: QuestionBlock = {
  id: 'allergies-restrictions',
  name: 'Allergies and Restrictions',
  title: 'Food allergies and restrictions',
  description: 'Important safety information',
  category: 'NUTRITION',
  order: 11,
  isActive: true,
  questions: [
    {
      id: 'food-allergies',
      type: 'multiselect',
      label: 'Do you have any food allergies? (Select all that apply)',
      order: 1,
      options: [
        { value: 'none', label: 'No allergies' },
        { value: 'dairy', label: 'Dairy' },
        { value: 'eggs', label: 'Eggs' },
        { value: 'peanuts', label: 'Peanuts' },
        { value: 'tree-nuts', label: 'Tree nuts' },
        { value: 'soy', label: 'Soy' },
        { value: 'wheat', label: 'Wheat/Gluten' },
        { value: 'fish', label: 'Fish' },
        { value: 'shellfish', label: 'Shellfish' },
        { value: 'other', label: 'Other (please specify below)' }
      ],
      validation: [
        { type: 'required', message: 'Please select any allergies or "No allergies"' }
      ]
    },
    {
      id: 'allergy-details',
      type: 'textarea',
      label: 'Please provide details about your allergies',
      placeholder: 'Describe severity, reactions, etc.',
      order: 2,
      conditionalDisplay: {
        type: 'and',
        conditions: [
          { type: 'isNotEmpty', questionId: 'food-allergies' },
          { type: 'notEquals', questionId: 'food-allergies', value: ['none'] }
        ]
      }
    },
    {
      id: 'foods-to-avoid',
      type: 'textarea',
      label: 'Are there any foods you avoid for other reasons?',
      placeholder: 'Religious, ethical, or personal preferences...',
      order: 3,
      helpText: 'This could include religious restrictions, ethical choices, or foods you simply dislike'
    },
    {
      id: 'cultural-dietary-needs',
      type: 'textarea',
      label: 'Do you have any cultural or religious dietary requirements?',
      placeholder: 'Halal, Kosher, etc.',
      order: 4
    }
  ]
};

export const nutritionHabitsBlock: QuestionBlock = {
  id: 'nutrition-habits',
  name: 'Nutrition Habits',
  title: 'Your eating habits',
  description: 'Help us understand your current nutrition patterns',
  category: 'NUTRITION',
  order: 12,
  isActive: true,
  questions: [
    {
      id: 'water-intake-oz',
      type: 'number',
      label: 'How much water do you drink daily? (ounces)',
      placeholder: '64',
      unit: 'oz',
      order: 1,
      min: 0,
      max: 200,
      helpText: 'A standard water bottle is about 16-20 oz',
      validation: [
        { type: 'required', message: 'Please estimate your daily water intake' }
      ]
    },
    {
      id: 'beverage-consumption',
      type: 'multiselect',
      label: 'What beverages do you regularly consume?',
      order: 2,
      options: [
        { value: 'water', label: 'Water' },
        { value: 'coffee', label: 'Coffee' },
        { value: 'tea', label: 'Tea' },
        { value: 'soda', label: 'Soda/Pop' },
        { value: 'juice', label: 'Juice' },
        { value: 'energy-drinks', label: 'Energy drinks' },
        { value: 'alcohol', label: 'Alcohol' },
        { value: 'protein-shakes', label: 'Protein shakes' },
        { value: 'milk', label: 'Milk' }
      ],
      validation: [
        { type: 'required', message: 'Please select your regular beverages' }
      ]
    },
    {
      id: 'typical-day-eating',
      type: 'textarea',
      label: 'Describe what you typically eat in a day',
      placeholder: 'Breakfast: ...\nLunch: ...\nDinner: ...\nSnacks: ...',
      order: 3,
      validation: [
        { type: 'required', message: 'Please describe your typical eating pattern' },
        { type: 'minLength', value: 20, message: 'Please provide more detail' }
      ]
    },
    {
      id: 'favorite-meals',
      type: 'textarea',
      label: 'What are your favorite meals or foods?',
      placeholder: 'List foods you enjoy eating...',
      order: 4,
      validation: [
        { type: 'required', message: 'Please share your favorite foods' }
      ]
    },
    {
      id: 'cooking-access',
      type: 'select',
      label: 'How often do you have access to cook?',
      order: 5,
      options: [
        { value: 'daily', label: 'Daily' },
        { value: 'few-times-week', label: 'A few times per week' },
        { value: 'weekends', label: 'Only on weekends' },
        { value: 'rarely', label: 'Rarely' },
        { value: 'never', label: 'Never/No cooking facilities' }
      ],
      validation: [
        { type: 'required', message: 'Please select your cooking access' }
      ]
    }
  ]
};

// ============================================================================
// TRAINING BLOCKS
// ============================================================================

export const trainingGoalsBlock: QuestionBlock = {
  id: 'training-goals',
  name: 'Training Goals',
  title: 'Your training objectives',
  description: 'What do you want to achieve with your training?',
  category: 'TRAINING',
  order: 20,
  isActive: true,
  questions: [
    {
      id: 'training-goal',
      type: 'multiselect',
      label: 'What are your training goals? (Select all that apply)',
      order: 1,
      isRequired: true,
      options: [
        { value: 'strength', label: 'Build strength' },
        { value: 'muscle', label: 'Build muscle mass' },
        { value: 'endurance', label: 'Improve endurance' },
        { value: 'power', label: 'Increase power/explosiveness' },
        { value: 'speed', label: 'Improve speed' },
        { value: 'mobility', label: 'Improve mobility/flexibility' },
        { value: 'weight-loss', label: 'Lose weight' },
        { value: 'sport-performance', label: 'Improve sport performance' },
        { value: 'general-fitness', label: 'General fitness' }
      ],
      validation: [
        { type: 'required', message: 'Please select at least one training goal' }
      ]
    },
    {
      id: 'training-experience',
      type: 'select',
      label: 'What is your training experience level?',
      order: 2,
      isRequired: true,
      options: [
        { value: 'beginner', label: 'Beginner (0-6 months)' },
        { value: 'novice', label: 'Novice (6-12 months)' },
        { value: 'intermediate', label: 'Intermediate (1-3 years)' },
        { value: 'advanced', label: 'Advanced (3-5 years)' },
        { value: 'expert', label: 'Expert (5+ years)' }
      ],
      validation: [
        { type: 'required', message: 'Please select your experience level' }
      ]
    },
    {
      id: 'training-history',
      type: 'textarea',
      label: 'Describe your training history',
      placeholder: 'What types of training have you done? What worked well? What didn\'t?',
      order: 3,
      validation: [
        { type: 'required', message: 'Please describe your training history' }
      ]
    }
  ]
};

export const trainingScheduleBlock: QuestionBlock = {
  id: 'training-schedule',
  name: 'Training Schedule',
  title: 'Your availability',
  description: 'Help us design a program that fits your schedule',
  category: 'TRAINING',
  order: 21,
  isActive: true,
  questions: [
    {
      id: 'days-per-week',
      type: 'select',
      label: 'How many days per week can you train?',
      order: 1,
      isRequired: true,
      options: [
        { value: '2', label: '2 days' },
        { value: '3', label: '3 days' },
        { value: '4', label: '4 days' },
        { value: '5', label: '5 days' },
        { value: '6', label: '6 days' },
        { value: '7', label: '7 days' }
      ],
      validation: [
        { type: 'required', message: 'Please select training frequency' }
      ]
    },
    {
      id: 'session-duration',
      type: 'select',
      label: 'How long can each training session be?',
      order: 2,
      isRequired: true,
      options: [
        { value: '30', label: '30 minutes' },
        { value: '45', label: '45 minutes' },
        { value: '60', label: '60 minutes' },
        { value: '75', label: '75 minutes' },
        { value: '90', label: '90 minutes' },
        { value: '120', label: '2 hours' }
      ],
      validation: [
        { type: 'required', message: 'Please select session duration' }
      ]
    },
    {
      id: 'preferred-workout-time',
      type: 'select',
      label: 'When do you prefer to train?',
      order: 3,
      options: [
        { value: 'early-morning', label: 'Early morning (5-7 AM)' },
        { value: 'morning', label: 'Morning (7-10 AM)' },
        { value: 'midday', label: 'Midday (10 AM-2 PM)' },
        { value: 'afternoon', label: 'Afternoon (2-5 PM)' },
        { value: 'evening', label: 'Evening (5-8 PM)' },
        { value: 'night', label: 'Night (8 PM+)' },
        { value: 'flexible', label: 'Flexible' }
      ]
    }
  ]
};

export const equipmentAccessBlock: QuestionBlock = {
  id: 'equipment-access',
  name: 'Equipment Access',
  title: 'Available equipment',
  description: 'What equipment do you have access to?',
  category: 'TRAINING',
  order: 22,
  isActive: true,
  questions: [
    {
      id: 'workout-location',
      type: 'multiselect',
      label: 'Where will you be training? (Select all that apply)',
      order: 1,
      isRequired: true,
      options: [
        { value: 'commercial-gym', label: 'Commercial gym' },
        { value: 'home-gym', label: 'Home gym' },
        { value: 'outdoors', label: 'Outdoors' },
        { value: 'bodyweight-only', label: 'Bodyweight only (no equipment)' }
      ],
      validation: [
        { type: 'required', message: 'Please select training location' }
      ]
    },
    {
      id: 'available-equipment',
      type: 'multiselect',
      label: 'What equipment do you have access to? (Select all that apply)',
      order: 2,
      options: [
        { value: 'barbell', label: 'Barbell' },
        { value: 'dumbbells', label: 'Dumbbells' },
        { value: 'kettlebells', label: 'Kettlebells' },
        { value: 'resistance-bands', label: 'Resistance bands' },
        { value: 'pull-up-bar', label: 'Pull-up bar' },
        { value: 'bench', label: 'Bench' },
        { value: 'squat-rack', label: 'Squat rack/Power rack' },
        { value: 'cable-machine', label: 'Cable machine' },
        { value: 'cardio-equipment', label: 'Cardio equipment (treadmill, bike, etc.)' },
        { value: 'trx', label: 'TRX/Suspension trainer' },
        { value: 'medicine-ball', label: 'Medicine ball' },
        { value: 'none', label: 'None - bodyweight only' }
      ],
      validation: [
        { type: 'required', message: 'Please select available equipment' }
      ]
    }
  ]
};

// ============================================================================
// HEALTH BLOCKS
// ============================================================================

export const healthHistoryBlock: QuestionBlock = {
  id: 'health-history',
  name: 'Health History',
  title: 'Your health background',
  description: 'Important information for safe programming',
  category: 'HEALTH',
  order: 30,
  isActive: true,
  questions: [
    {
      id: 'injuries',
      type: 'textarea',
      label: 'Do you have any current or past injuries?',
      placeholder: 'Describe any injuries, surgeries, or chronic pain...',
      order: 1,
      validation: [
        { type: 'required', message: 'Please describe any injuries or write "None"' }
      ]
    },
    {
      id: 'medical-conditions',
      type: 'textarea',
      label: 'Do you have any medical conditions we should know about?',
      placeholder: 'Diabetes, heart conditions, asthma, etc.',
      order: 2,
      validation: [
        { type: 'required', message: 'Please list any conditions or write "None"' }
      ]
    },
    {
      id: 'medications',
      type: 'textarea',
      label: 'Are you currently taking any medications?',
      placeholder: 'List medications and what they\'re for...',
      order: 3,
      validation: [
        { type: 'required', message: 'Please list medications or write "None"' }
      ]
    },
    {
      id: 'pain-or-discomfort',
      type: 'textarea',
      label: 'Do you experience any pain or discomfort during daily activities or exercise?',
      placeholder: 'Describe location, intensity, and when it occurs...',
      order: 4,
      validation: [
        { type: 'required', message: 'Please describe any pain or write "None"' }
      ]
    }
  ]
};

export const activityLevelBlock: QuestionBlock = {
  id: 'activity-level',
  name: 'Activity Level',
  title: 'Your current activity',
  description: 'Help us understand your baseline activity',
  category: 'HEALTH',
  order: 31,
  isActive: true,
  questions: [
    {
      id: 'activity-level',
      type: 'select',
      label: 'How would you describe your current activity level?',
      order: 1,
      isRequired: true,
      options: [
        { value: 'sedentary', label: 'Sedentary (little to no exercise)' },
        { value: 'lightly-active', label: 'Lightly active (1-3 days/week)' },
        { value: 'moderately-active', label: 'Moderately active (3-5 days/week)' },
        { value: 'very-active', label: 'Very active (6-7 days/week)' },
        { value: 'extremely-active', label: 'Extremely active (physical job + training)' }
      ],
      validation: [
        { type: 'required', message: 'Please select your activity level' }
      ]
    },
    {
      id: 'daily-movement-pattern',
      type: 'select',
      label: 'What best describes your daily movement?',
      order: 2,
      options: [
        { value: 'desk-job', label: 'Mostly sitting (desk job)' },
        { value: 'standing', label: 'Mostly standing' },
        { value: 'walking', label: 'Lots of walking' },
        { value: 'physical-labor', label: 'Physical labor' },
        { value: 'mixed', label: 'Mixed/Varies' }
      ],
      validation: [
        { type: 'required', message: 'Please select your movement pattern' }
      ]
    }
  ]
};

// ============================================================================
// ATHLETE-SPECIFIC BLOCKS
// ============================================================================

export const athleteProfileBlock: QuestionBlock = {
  id: 'athlete-profile',
  name: 'Athlete Profile',
  title: 'Your athletic background',
  description: 'Sport-specific information',
  category: 'PERFORMANCE',
  order: 40,
  isActive: true,
  questions: [
    {
      id: 'sport',
      type: 'text',
      label: 'What sport do you play?',
      placeholder: 'Basketball, Soccer, Track, etc.',
      order: 1,
      isRequired: true,
      validation: [
        { type: 'required', message: 'Please enter your sport' }
      ]
    },
    {
      id: 'position',
      type: 'text',
      label: 'What position do you play?',
      placeholder: 'Point guard, Midfielder, Sprinter, etc.',
      order: 2
    },
    {
      id: 'competition-level',
      type: 'select',
      label: 'What is your competition level?',
      order: 3,
      isRequired: true,
      options: [
        { value: 'youth-recreational', label: 'Youth recreational' },
        { value: 'youth-competitive', label: 'Youth competitive' },
        { value: 'high-school', label: 'High school' },
        { value: 'college', label: 'College' },
        { value: 'professional', label: 'Professional' },
        { value: 'masters', label: 'Masters/Adult recreational' }
      ],
      validation: [
        { type: 'required', message: 'Please select your competition level' }
      ]
    },
    {
      id: 'season-phase',
      type: 'select',
      label: 'What phase of the season are you in?',
      order: 4,
      isRequired: true,
      options: [
        { value: 'off-season', label: 'Off-season' },
        { value: 'pre-season', label: 'Pre-season' },
        { value: 'in-season', label: 'In-season' },
        { value: 'post-season', label: 'Post-season' },
        { value: 'year-round', label: 'Year-round sport' }
      ],
      validation: [
        { type: 'required', message: 'Please select season phase' }
      ]
    },
    {
      id: 'training-age',
      type: 'number',
      label: 'How many years have you been training for your sport?',
      placeholder: '5',
      unit: 'years',
      order: 5,
      min: 0,
      max: 50,
      validation: [
        { type: 'required', message: 'Please enter your training age' }
      ]
    }
  ]
};

export const performanceMetricsBlock: QuestionBlock = {
  id: 'performance-metrics',
  name: 'Performance Metrics',
  title: 'Your performance data',
  description: 'Current strength and performance benchmarks',
  category: 'PERFORMANCE',
  order: 41,
  isActive: true,
  questions: [
    {
      id: 'squat-1rm',
      type: 'number',
      label: 'Back Squat 1RM (lbs)',
      placeholder: '225',
      unit: 'lbs',
      order: 1,
      min: 0,
      helpText: 'Leave blank if unknown'
    },
    {
      id: 'bench-1rm',
      type: 'number',
      label: 'Bench Press 1RM (lbs)',
      placeholder: '185',
      unit: 'lbs',
      order: 2,
      min: 0,
      helpText: 'Leave blank if unknown'
    },
    {
      id: 'deadlift-1rm',
      type: 'number',
      label: 'Deadlift 1RM (lbs)',
      placeholder: '315',
      unit: 'lbs',
      order: 3,
      min: 0,
      helpText: 'Leave blank if unknown'
    },
    {
      id: 'vertical-jump',
      type: 'number',
      label: 'Vertical Jump (inches)',
      placeholder: '28',
      unit: 'inches',
      order: 4,
      min: 0,
      max: 60,
      helpText: 'Leave blank if unknown'
    },
    {
      id: '40-yard-dash',
      type: 'number',
      label: '40-Yard Dash Time (seconds)',
      placeholder: '4.8',
      unit: 'seconds',
      order: 5,
      min: 3,
      max: 10,
      step: 0.01,
      helpText: 'Leave blank if unknown'
    }
  ]
};

// ============================================================================
// YOUTH-SPECIFIC BLOCKS
// ============================================================================

export const youthProfileBlock: QuestionBlock = {
  id: 'youth-profile',
  name: 'Youth Profile',
  title: 'About the young athlete',
  description: 'Age-appropriate information',
  category: 'YOUTH',
  order: 50,
  isActive: true,
  questions: [
    {
      id: 'school-grade',
      type: 'select',
      label: 'What grade are you in?',
      order: 1,
      isRequired: true,
      options: [
        { value: '6', label: '6th grade' },
        { value: '7', label: '7th grade' },
        { value: '8', label: '8th grade' },
        { value: '9', label: '9th grade (Freshman)' },
        { value: '10', label: '10th grade (Sophomore)' },
        { value: '11', label: '11th grade (Junior)' },
        { value: '12', label: '12th grade (Senior)' }
      ],
      validation: [
        { type: 'required', message: 'Please select your grade' }
      ]
    },
    {
      id: 'sports-played',
      type: 'text',
      label: 'What sports do you play?',
      placeholder: 'Basketball, Soccer, Track...',
      order: 2,
      isRequired: true,
      validation: [
        { type: 'required', message: 'Please list the sports you play' }
      ]
    },
    {
      id: 'weekly-activity-hours',
      type: 'number',
      label: 'How many hours per week do you spend on sports/activities?',
      placeholder: '10',
      unit: 'hours',
      order: 3,
      min: 0,
      max: 40,
      validation: [
        { type: 'required', message: 'Please estimate weekly activity hours' }
      ]
    },
    {
      id: 'parent-name',
      type: 'text',
      label: 'Parent/Guardian Name',
      placeholder: 'Jane Doe',
      order: 4,
      isRequired: true,
      validation: [
        { type: 'required', message: 'Parent/guardian name is required' }
      ]
    },
    {
      id: 'parent-email',
      type: 'text',
      label: 'Parent/Guardian Email',
      placeholder: 'parent@example.com',
      order: 5,
      isRequired: true,
      validation: [
        { type: 'required', message: 'Parent/guardian email is required' },
        { type: 'email', message: 'Please enter a valid email' }
      ]
    }
  ]
};

// ============================================================================
// WELLNESS BLOCKS
// ============================================================================

export const wellnessGoalsBlock: QuestionBlock = {
  id: 'wellness-goals',
  name: 'Wellness Goals',
  title: 'Your wellness objectives',
  description: 'What aspects of health do you want to improve?',
  category: 'WELLNESS',
  order: 60,
  isActive: true,
  questions: [
    {
      id: 'wellness-focus',
      type: 'multiselect',
      label: 'What areas do you want to focus on? (Select all that apply)',
      order: 1,
      isRequired: true,
      options: [
        { value: 'energy', label: 'Increase energy levels' },
        { value: 'sleep', label: 'Improve sleep quality' },
        { value: 'stress', label: 'Reduce stress' },
        { value: 'mobility', label: 'Improve mobility' },
        { value: 'weight', label: 'Manage weight' },
        { value: 'strength', label: 'Build functional strength' },
        { value: 'endurance', label: 'Improve endurance' },
        { value: 'overall-health', label: 'Overall health and wellness' }
      ],
      validation: [
        { type: 'required', message: 'Please select at least one focus area' }
      ]
    },
    {
      id: 'wellness-barriers',
      type: 'multiselect',
      label: 'What are your biggest barriers to wellness? (Select all that apply)',
      order: 2,
      options: [
        { value: 'time', label: 'Lack of time' },
        { value: 'motivation', label: 'Lack of motivation' },
        { value: 'knowledge', label: 'Don\'t know where to start' },
        { value: 'energy', label: 'Low energy' },
        { value: 'pain', label: 'Pain or discomfort' },
        { value: 'stress', label: 'High stress' },
        { value: 'support', label: 'Lack of support' },
        { value: 'resources', label: 'Limited resources/equipment' }
      ],
      validation: [
        { type: 'required', message: 'Please select your barriers' }
      ]
    }
  ]
};

// ============================================================================
// SITUATION BASED BLOCKS
// ============================================================================

export const injuryRecoveryBlock: QuestionBlock = {
  id: 'injury-recovery',
  name: 'Injury/Recovery Details',
  title: 'Your injury or condition',
  description: 'Detailed information for safe programming',
  category: 'SITUATION_BASED',
  order: 70,
  isActive: true,
  questions: [
    {
      id: 'injury-location',
      type: 'multiselect',
      label: 'Where is your injury or pain located? (Select all that apply)',
      order: 1,
      isRequired: true,
      options: [
        { value: 'neck', label: 'Neck' },
        { value: 'shoulder', label: 'Shoulder' },
        { value: 'elbow', label: 'Elbow' },
        { value: 'wrist-hand', label: 'Wrist/Hand' },
        { value: 'upper-back', label: 'Upper back' },
        { value: 'lower-back', label: 'Lower back' },
        { value: 'hip', label: 'Hip' },
        { value: 'knee', label: 'Knee' },
        { value: 'ankle-foot', label: 'Ankle/Foot' },
        { value: 'other', label: 'Other' }
      ],
      validation: [
        { type: 'required', message: 'Please select injury location(s)' }
      ]
    },
    {
      id: 'pain-patterns',
      type: 'textarea',
      label: 'Describe your pain patterns',
      placeholder: 'When does it hurt? How intense? Sharp or dull? Constant or intermittent?',
      order: 2,
      isRequired: true,
      validation: [
        { type: 'required', message: 'Please describe your pain patterns' },
        { type: 'minLength', value: 20, message: 'Please provide more detail' }
      ]
    },
    {
      id: 'aggravating-positions',
      type: 'textarea',
      label: 'What movements or positions make it worse?',
      placeholder: 'Bending, twisting, overhead movements, sitting, etc.',
      order: 3,
      isRequired: true,
      validation: [
        { type: 'required', message: 'Please describe aggravating movements' }
      ]
    },
    {
      id: 'medical-clearance',
      type: 'radio',
      label: 'Have you been cleared by a medical professional to exercise?',
      order: 4,
      isRequired: true,
      options: [
        { value: 'yes', label: 'Yes, I have medical clearance' },
        { value: 'no', label: 'No, not yet' },
        { value: 'not-needed', label: 'Not applicable/not needed' }
      ],
      validation: [
        { type: 'required', message: 'Please answer this question' }
      ]
    },
    {
      id: 'mobility-limitations',
      type: 'textarea',
      label: 'Describe any mobility limitations',
      placeholder: 'Can\'t raise arm overhead, limited hip flexion, etc.',
      order: 5,
      validation: [
        { type: 'required', message: 'Please describe mobility limitations or write "None"' }
      ]
    },
    {
      id: 'recovery-goals',
      type: 'textarea',
      label: 'What are your recovery goals?',
      placeholder: 'Return to sport, pain-free daily activities, etc.',
      order: 6,
      isRequired: true,
      validation: [
        { type: 'required', message: 'Please describe your recovery goals' }
      ]
    }
  ]
};

// ============================================================================
// EXPORT ALL BLOCKS
// ============================================================================

export const allQuestionBlocks: QuestionBlock[] = [
  // Demographics
  basicDemographicsBlock,
  
  // Goals
  generalGoalsBlock,
  
  // Nutrition
  dietTypeBlock,
  allergiesRestrictionsBlock,
  nutritionHabitsBlock,
  
  // Training
  trainingGoalsBlock,
  trainingScheduleBlock,
  equipmentAccessBlock,
  
  // Health
  healthHistoryBlock,
  activityLevelBlock,
  
  // Performance
  athleteProfileBlock,
  performanceMetricsBlock,
  
  // Youth
  youthProfileBlock,
  
  // Wellness
  wellnessGoalsBlock,
  
  // Situation Based
  injuryRecoveryBlock
];

// Helper function to get blocks by category
export function getBlocksByCategory(category: string): QuestionBlock[] {
  return allQuestionBlocks.filter(block => block.category === category);
}

// Helper function to get block by ID
export function getBlockById(id: string): QuestionBlock | undefined {
  return allQuestionBlocks.find(block => block.id === id);
}

// Helper function to get blocks by IDs
export function getBlocksByIds(ids: string[]): QuestionBlock[] {
  return ids
    .map(id => getBlockById(id))
    .filter((block): block is QuestionBlock => block !== undefined);
}
