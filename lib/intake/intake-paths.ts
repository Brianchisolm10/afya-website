/**
 * Intake Path Configuration
 * 
 * This file defines the intake paths for each client type, including
 * which question blocks to display and in what order.
 */

import { IntakePathConfig, ConditionalRule } from '@/types/intake';

// ============================================================================
// NUTRITION ONLY PATH
// ============================================================================

export const nutritionOnlyPath: IntakePathConfig = {
  id: 'nutrition-only',
  clientType: 'NUTRITION_ONLY',
  name: 'Nutrition Only',
  description: 'Get a personalized nutrition plan tailored to your dietary needs and goals',
  estimatedTime: '10-15 minutes',
  questionBlockIds: [
    'basic-demographics',
    'general-goals',
    'diet-type',
    'allergies-restrictions',
    'nutrition-habits',
    'activity-level'
  ],
  branchingRules: [
    // No training-related blocks should be shown
    {
      id: 'nutrition-skip-training',
      condition: {
        type: 'equals',
        questionId: 'client-type',
        value: 'NUTRITION_ONLY'
      },
      action: {
        type: 'skip',
        targetBlockIds: [
          'training-goals',
          'training-schedule',
          'equipment-access',
          'athlete-profile',
          'performance-metrics',
          'youth-profile',
          'wellness-goals',
          'injury-recovery'
        ]
      }
    }
  ],
  isActive: true
};

// ============================================================================
// WORKOUT ONLY PATH
// ============================================================================

export const workoutOnlyPath: IntakePathConfig = {
  id: 'workout-only',
  clientType: 'WORKOUT_ONLY',
  name: 'Workout/Training Program Only',
  description: 'Receive a customized workout program based on your goals and experience',
  estimatedTime: '10-15 minutes',
  questionBlockIds: [
    'basic-demographics',
    'general-goals',
    'training-goals',
    'training-schedule',
    'equipment-access',
    'health-history',
    'activity-level',
    'allergies-restrictions' // Only for critical safety flags
  ],
  branchingRules: [
    // Skip detailed nutrition blocks (keep only allergies for safety)
    {
      id: 'workout-skip-nutrition',
      condition: {
        type: 'equals',
        questionId: 'client-type',
        value: 'WORKOUT_ONLY'
      },
      action: {
        type: 'skip',
        targetBlockIds: [
          'diet-type',
          'nutrition-habits'
        ]
      }
    },
    // Skip athlete-specific blocks
    {
      id: 'workout-skip-athlete',
      condition: {
        type: 'equals',
        questionId: 'client-type',
        value: 'WORKOUT_ONLY'
      },
      action: {
        type: 'skip',
        targetBlockIds: [
          'athlete-profile',
          'performance-metrics',
          'youth-profile',
          'wellness-goals',
          'injury-recovery'
        ]
      }
    }
  ],
  isActive: true
};

// ============================================================================
// FULL PROGRAM PATH
// ============================================================================

export const fullProgramPath: IntakePathConfig = {
  id: 'full-program',
  clientType: 'FULL_PROGRAM',
  name: 'Full Program',
  description: 'Complete nutrition and training guidance for comprehensive support',
  estimatedTime: '20-25 minutes',
  questionBlockIds: [
    'basic-demographics',
    'general-goals',
    // Training section
    'training-goals',
    'training-schedule',
    'equipment-access',
    // Nutrition section
    'diet-type',
    'allergies-restrictions',
    'nutrition-habits',
    // Health section
    'health-history',
    'activity-level'
  ],
  branchingRules: [
    // Skip specialized blocks not relevant to general full program
    {
      id: 'full-skip-specialized',
      condition: {
        type: 'equals',
        questionId: 'client-type',
        value: 'FULL_PROGRAM'
      },
      action: {
        type: 'skip',
        targetBlockIds: [
          'athlete-profile',
          'performance-metrics',
          'youth-profile',
          'wellness-goals',
          'injury-recovery'
        ]
      }
    }
  ],
  isActive: true
};

// ============================================================================
// ATHLETE PERFORMANCE PATH
// ============================================================================

export const athletePerformancePath: IntakePathConfig = {
  id: 'athlete-performance',
  clientType: 'ATHLETE_PERFORMANCE',
  name: 'Athlete Performance Program',
  description: 'NSCA-CSCS aligned performance training for competitive athletes',
  estimatedTime: '15-20 minutes',
  questionBlockIds: [
    'basic-demographics',
    'athlete-profile',
    'general-goals',
    'training-schedule',
    'equipment-access',
    'performance-metrics',
    'health-history',
    'activity-level',
    'diet-type',
    'allergies-restrictions',
    'nutrition-habits'
  ],
  branchingRules: [
    // Skip non-athlete blocks
    {
      id: 'athlete-skip-general',
      condition: {
        type: 'equals',
        questionId: 'client-type',
        value: 'ATHLETE_PERFORMANCE'
      },
      action: {
        type: 'skip',
        targetBlockIds: [
          'training-goals', // Use athlete-profile instead
          'youth-profile',
          'wellness-goals',
          'injury-recovery'
        ]
      }
    },
    // Show performance metrics only for intermediate+ athletes
    {
      id: 'athlete-show-metrics',
      condition: {
        type: 'or',
        conditions: [
          { type: 'equals', questionId: 'competition-level', value: 'high-school' },
          { type: 'equals', questionId: 'competition-level', value: 'college' },
          { type: 'equals', questionId: 'competition-level', value: 'professional' }
        ]
      },
      action: {
        type: 'show',
        targetBlockIds: ['performance-metrics']
      }
    },
    // Make nutrition optional but available
    {
      id: 'athlete-nutrition-optional',
      condition: {
        type: 'equals',
        questionId: 'include-nutrition',
        value: 'yes'
      },
      action: {
        type: 'show',
        targetBlockIds: ['diet-type', 'allergies-restrictions', 'nutrition-habits']
      }
    }
  ],
  isActive: true
};

// ============================================================================
// YOUTH PROGRAM PATH
// ============================================================================

export const youthProgramPath: IntakePathConfig = {
  id: 'youth-program',
  clientType: 'YOUTH',
  name: 'Youth Program',
  description: 'Age-appropriate training and nutrition guidance with safety emphasis',
  estimatedTime: '10-12 minutes',
  questionBlockIds: [
    'basic-demographics',
    'youth-profile',
    'general-goals',
    'training-schedule',
    'equipment-access',
    'health-history',
    'allergies-restrictions'
  ],
  branchingRules: [
    // Skip adult-focused blocks
    {
      id: 'youth-skip-adult',
      condition: {
        type: 'equals',
        questionId: 'client-type',
        value: 'YOUTH'
      },
      action: {
        type: 'skip',
        targetBlockIds: [
          'training-goals', // Use youth-profile instead
          'athlete-profile',
          'performance-metrics',
          'wellness-goals',
          'injury-recovery',
          'diet-type',
          'nutrition-habits'
        ]
      }
    },
    // Simplify training schedule for youth
    {
      id: 'youth-simple-schedule',
      condition: {
        type: 'or',
        conditions: [
          { type: 'equals', questionId: 'school-grade', value: '6' },
          { type: 'equals', questionId: 'school-grade', value: '7' },
          { type: 'equals', questionId: 'school-grade', value: '8' }
        ]
      },
      action: {
        type: 'require',
        targetBlockIds: ['training-schedule']
      }
    }
  ],
  isActive: true
};

// ============================================================================
// GENERAL WELLNESS PATH
// ============================================================================

export const generalWellnessPath: IntakePathConfig = {
  id: 'general-wellness',
  clientType: 'GENERAL_WELLNESS',
  name: 'General Wellness Guidance',
  description: 'Practical health and fitness guidance for overall wellbeing',
  estimatedTime: '8-10 minutes',
  questionBlockIds: [
    'basic-demographics',
    'wellness-goals',
    'activity-level',
    'training-schedule',
    'equipment-access',
    'health-history',
    'diet-type',
    'allergies-restrictions',
    'nutrition-habits'
  ],
  branchingRules: [
    // Skip advanced/specialized blocks
    {
      id: 'wellness-skip-advanced',
      condition: {
        type: 'equals',
        questionId: 'client-type',
        value: 'GENERAL_WELLNESS'
      },
      action: {
        type: 'skip',
        targetBlockIds: [
          'general-goals', // Use wellness-goals instead
          'training-goals',
          'athlete-profile',
          'performance-metrics',
          'youth-profile',
          'injury-recovery'
        ]
      }
    },
    // Show training schedule only if interested in exercise
    {
      id: 'wellness-show-training',
      condition: {
        type: 'or',
        conditions: [
          { type: 'contains', questionId: 'wellness-focus', value: 'strength' },
          { type: 'contains', questionId: 'wellness-focus', value: 'endurance' },
          { type: 'contains', questionId: 'wellness-focus', value: 'mobility' }
        ]
      },
      action: {
        type: 'show',
        targetBlockIds: ['training-schedule', 'equipment-access']
      }
    },
    // Show nutrition blocks if weight or energy is a focus
    {
      id: 'wellness-show-nutrition',
      condition: {
        type: 'or',
        conditions: [
          { type: 'contains', questionId: 'wellness-focus', value: 'weight' },
          { type: 'contains', questionId: 'wellness-focus', value: 'energy' }
        ]
      },
      action: {
        type: 'show',
        targetBlockIds: ['diet-type', 'nutrition-habits']
      }
    }
  ],
  isActive: true
};

// ============================================================================
// SITUATION BASED PATH
// ============================================================================

export const situationBasedPath: IntakePathConfig = {
  id: 'situation-based',
  clientType: 'SPECIAL_SITUATION',
  name: 'Movement Needs',
  description: 'Modified guidance for injury recovery or specific health conditions',
  estimatedTime: '12-15 minutes',
  questionBlockIds: [
    'basic-demographics',
    'injury-recovery',
    'general-goals',
    'health-history',
    'activity-level',
    'training-schedule',
    'equipment-access',
    'allergies-restrictions'
  ],
  branchingRules: [
    // Skip non-relevant blocks
    {
      id: 'situation-skip-standard',
      condition: {
        type: 'equals',
        questionId: 'client-type',
        value: 'SPECIAL_SITUATION'
      },
      action: {
        type: 'skip',
        targetBlockIds: [
          'training-goals',
          'athlete-profile',
          'performance-metrics',
          'youth-profile',
          'wellness-goals',
          'diet-type',
          'nutrition-habits'
        ]
      }
    },
    // Show training schedule only if cleared for exercise
    {
      id: 'situation-show-training',
      condition: {
        type: 'equals',
        questionId: 'medical-clearance',
        value: 'yes'
      },
      action: {
        type: 'show',
        targetBlockIds: ['training-schedule', 'equipment-access']
      }
    },
    // Hide training if not cleared
    {
      id: 'situation-hide-training',
      condition: {
        type: 'equals',
        questionId: 'medical-clearance',
        value: 'no'
      },
      action: {
        type: 'skip',
        targetBlockIds: ['training-schedule', 'equipment-access']
      }
    },
    // Show nutrition if recovery goals include it
    {
      id: 'situation-show-nutrition',
      condition: {
        type: 'contains',
        questionId: 'recovery-goals',
        value: 'nutrition'
      },
      action: {
        type: 'show',
        targetBlockIds: ['diet-type', 'allergies-restrictions', 'nutrition-habits']
      }
    }
  ],
  isActive: true
};

// ============================================================================
// EXPORT ALL PATHS
// ============================================================================

export const allIntakePaths: IntakePathConfig[] = [
  nutritionOnlyPath,
  workoutOnlyPath,
  fullProgramPath,
  athletePerformancePath,
  youthProgramPath,
  generalWellnessPath,
  situationBasedPath
];

// Helper function to get path by client type
export function getPathByClientType(clientType: string): IntakePathConfig | undefined {
  return allIntakePaths.find(path => path.clientType === clientType);
}

// Helper function to get path by ID
export function getPathById(id: string): IntakePathConfig | undefined {
  return allIntakePaths.find(path => path.id === id);
}

// Helper function to get all active paths
export function getActivePaths(): IntakePathConfig[] {
  return allIntakePaths.filter(path => path.isActive);
}

// ============================================================================
// BRANCHING LOGIC DOCUMENTATION
// ============================================================================

/**
 * Branching Logic Rules Overview
 * 
 * Each intake path includes branching rules that control which question blocks
 * are shown or hidden based on user responses. This creates a dynamic,
 * personalized intake experience.
 * 
 * Rule Types:
 * -----------
 * 1. SKIP: Hide question blocks that are not relevant to the selected path
 * 2. SHOW: Display question blocks when certain conditions are met
 * 3. REQUIRE: Mark question blocks as required when conditions are met
 * 4. HIDE: Explicitly hide blocks based on user responses
 * 
 * Condition Types:
 * ----------------
 * - equals: Check if a response equals a specific value
 * - notEquals: Check if a response does not equal a value
 * - contains: Check if an array response contains a value
 * - notContains: Check if an array response does not contain a value
 * - greaterThan/lessThan: Numeric comparisons
 * - isEmpty/isNotEmpty: Check if a field has a value
 * - and/or/not: Combine multiple conditions
 * 
 * Path-Specific Logic:
 * --------------------
 * 
 * NUTRITION_ONLY:
 * - Skips all training-related blocks
 * - Focuses on dietary information and goals
 * 
 * WORKOUT_ONLY:
 * - Skips detailed nutrition blocks (keeps allergies for safety)
 * - Focuses on training goals, schedule, and equipment
 * 
 * FULL_PROGRAM:
 * - Includes both nutrition and training blocks
 * - Skips specialized blocks (athlete, youth, wellness, injury)
 * 
 * ATHLETE_PERFORMANCE:
 * - Shows performance metrics for high-level athletes
 * - Makes nutrition optional but available
 * - Uses athlete-specific profile instead of general training goals
 * 
 * YOUTH:
 * - Simplifies content for age-appropriate guidance
 * - Skips adult-focused blocks
 * - Emphasizes safety and parent involvement
 * 
 * GENERAL_WELLNESS:
 * - Conditionally shows training blocks if exercise is a focus
 * - Conditionally shows nutrition blocks if weight/energy is a focus
 * - Skips advanced performance metrics
 * 
 * SPECIAL_SITUATION:
 * - Shows training blocks only if medically cleared
 * - Focuses on injury/condition details
 * - Conditionally shows nutrition based on recovery goals
 * 
 * Implementation Notes:
 * ---------------------
 * - Rules are evaluated in order
 * - Multiple rules can affect the same block
 * - The ConditionalLogicEvaluator class handles rule evaluation
 * - Question-level conditional display is also supported within blocks
 */
