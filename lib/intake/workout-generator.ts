/**
 * Workout Packet Generation Logic
 * 
 * Implements training program creation based on client experience,
 * equipment, goals, and time availability.
 */

import { PopulatedContent, TemplateContext } from '@/types/intake';

export class WorkoutGenerator {
  /**
   * Enhance workout packet with detailed training program
   */
  static enhanceWorkoutContent(
    content: PopulatedContent,
    client: any,
    context: TemplateContext
  ): PopulatedContent {
    const enhanced = { ...content };
    
    // Add training split details
    enhanced.trainingSplit = this.generateTrainingSplit(client, context);
    
    // Add weekly schedule
    enhanced.weeklySchedule = this.generateWeeklySchedule(client, context);
    
    // Add exercise selection
    enhanced.exercises = this.generateExerciseSelection(client, context);
    
    // Add sets, reps, and rest periods
    enhanced.volumeGuidelines = this.generateVolumeGuidelines(client, context);
    
    // Add progression plan
    enhanced.progressionPlan = this.generateProgressionPlan(client, context);
    
    // Add safety notes
    enhanced.safetyNotes = this.generateSafetyNotes(client, context);
    
    return enhanced;
  }
  
  /**
   * Generate training split based on frequency and experience
   */
  private static generateTrainingSplit(client: any, context: TemplateContext): any {
    const daysPerWeek = client.daysPerWeek || 3;
    const experience = (client.trainingExperience || 'beginner').toLowerCase();
    const goal = (client.goal || client.mainFitnessGoals || '').toLowerCase();
    
    let splitType = '';
    let splitDescription = '';
    let splitDetails: string[] = [];
    
    if (daysPerWeek <= 2) {
      splitType = 'Full Body';
      splitDescription = 'Train all major muscle groups each session for maximum efficiency';
      splitDetails = [
        'Day 1: Full Body (Push focus)',
        'Day 2: Full Body (Pull focus)'
      ];
    } else if (daysPerWeek === 3) {
      splitType = 'Full Body or Push/Pull/Legs';
      splitDescription = 'Full body workouts or a push/pull/legs split depending on preference';
      splitDetails = [
        'Day 1: Push (Chest, Shoulders, Triceps)',
        'Day 2: Pull (Back, Biceps)',
        'Day 3: Legs (Quads, Hamstrings, Glutes, Calves)'
      ];
    } else if (daysPerWeek === 4) {
      splitType = 'Upper/Lower Split';
      splitDescription = 'Alternate between upper and lower body workouts';
      splitDetails = [
        'Day 1: Upper Body (Strength focus)',
        'Day 2: Lower Body (Strength focus)',
        'Day 3: Upper Body (Hypertrophy focus)',
        'Day 4: Lower Body (Hypertrophy focus)'
      ];
    } else if (daysPerWeek >= 5) {
      splitType = 'Body Part Split';
      splitDescription = 'Focus on specific muscle groups each day';
      splitDetails = [
        'Day 1: Chest & Triceps',
        'Day 2: Back & Biceps',
        'Day 3: Legs',
        'Day 4: Shoulders & Abs',
        'Day 5: Full Body or Weak Points'
      ];
    }
    
    return {
      type: splitType,
      description: splitDescription,
      days: splitDetails,
      rationale: this.getSplitRationale(daysPerWeek, experience, goal)
    };
  }
  
  /**
   * Get rationale for split selection
   */
  private static getSplitRationale(days: number, experience: string, goal: string): string {
    if (days <= 3) {
      return 'Full body or push/pull/legs splits are ideal for your training frequency, allowing you to hit each muscle group multiple times per week for optimal growth and strength gains.';
    } else if (days === 4) {
      return 'An upper/lower split provides a good balance of frequency and volume, allowing you to train each muscle group twice per week with adequate recovery.';
    } else {
      return 'A body part split allows for high volume per muscle group and is well-suited for your training frequency. Each muscle group gets dedicated attention with ample recovery time.';
    }
  }
  
  /**
   * Generate weekly schedule
   */
  private static generateWeeklySchedule(client: any, context: TemplateContext): any {
    const daysPerWeek = client.daysPerWeek || 3;
    const sessionDuration = client.sessionDuration || 60;
    const preferredTime = client.preferredWorkoutTime || 'flexible';
    
    const schedule: any[] = [];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // Generate schedule based on days per week
    if (daysPerWeek === 3) {
      schedule.push(
        { day: 'Monday', workout: 'Push (Chest, Shoulders, Triceps)', duration: sessionDuration },
        { day: 'Tuesday', workout: 'Rest or Active Recovery', duration: 0 },
        { day: 'Wednesday', workout: 'Pull (Back, Biceps)', duration: sessionDuration },
        { day: 'Thursday', workout: 'Rest or Active Recovery', duration: 0 },
        { day: 'Friday', workout: 'Legs (Quads, Hamstrings, Glutes)', duration: sessionDuration },
        { day: 'Saturday', workout: 'Rest or Active Recovery', duration: 0 },
        { day: 'Sunday', workout: 'Rest', duration: 0 }
      );
    } else if (daysPerWeek === 4) {
      schedule.push(
        { day: 'Monday', workout: 'Upper Body Strength', duration: sessionDuration },
        { day: 'Tuesday', workout: 'Lower Body Strength', duration: sessionDuration },
        { day: 'Wednesday', workout: 'Rest or Active Recovery', duration: 0 },
        { day: 'Thursday', workout: 'Upper Body Hypertrophy', duration: sessionDuration },
        { day: 'Friday', workout: 'Lower Body Hypertrophy', duration: sessionDuration },
        { day: 'Saturday', workout: 'Rest or Active Recovery', duration: 0 },
        { day: 'Sunday', workout: 'Rest', duration: 0 }
      );
    } else if (daysPerWeek >= 5) {
      schedule.push(
        { day: 'Monday', workout: 'Chest & Triceps', duration: sessionDuration },
        { day: 'Tuesday', workout: 'Back & Biceps', duration: sessionDuration },
        { day: 'Wednesday', workout: 'Legs', duration: sessionDuration },
        { day: 'Thursday', workout: 'Shoulders & Abs', duration: sessionDuration },
        { day: 'Friday', workout: 'Full Body or Weak Points', duration: sessionDuration },
        { day: 'Saturday', workout: 'Rest or Active Recovery', duration: 0 },
        { day: 'Sunday', workout: 'Rest', duration: 0 }
      );
    } else {
      // 2 days per week
      schedule.push(
        { day: 'Monday', workout: 'Full Body (Push focus)', duration: sessionDuration },
        { day: 'Tuesday', workout: 'Rest', duration: 0 },
        { day: 'Wednesday', workout: 'Rest', duration: 0 },
        { day: 'Thursday', workout: 'Full Body (Pull focus)', duration: sessionDuration },
        { day: 'Friday', workout: 'Rest', duration: 0 },
        { day: 'Saturday', workout: 'Rest or Active Recovery', duration: 0 },
        { day: 'Sunday', workout: 'Rest', duration: 0 }
      );
    }
    
    return {
      schedule,
      notes: [
        'Adjust training days based on your schedule, maintaining at least one rest day between similar sessions',
        'Active recovery can include walking, light cycling, yoga, or stretching',
        `Preferred training time: ${preferredTime}`
      ]
    };
  }
  
  /**
   * Generate exercise selection based on equipment and experience
   */
  private static generateExerciseSelection(client: any, context: TemplateContext): any {
    const equipment = (client.availableEquipment || 'full gym').toLowerCase();
    const experience = (client.trainingExperience || 'beginner').toLowerCase();
    const location = (client.workoutLocation || 'gym').toLowerCase();
    
    const exercises: any = {
      upperPush: [],
      upperPull: [],
      lowerBody: [],
      core: [],
      accessories: []
    };
    
    // Upper Push exercises
    if (equipment.includes('barbell') || equipment.includes('full') || equipment.includes('gym')) {
      exercises.upperPush.push(
        { name: 'Barbell Bench Press', sets: '3-4', reps: '6-10', rest: '2-3 min', notes: 'Primary chest builder' },
        { name: 'Overhead Press', sets: '3-4', reps: '6-10', rest: '2-3 min', notes: 'Primary shoulder builder' },
        { name: 'Incline Dumbbell Press', sets: '3', reps: '8-12', rest: '90 sec', notes: 'Upper chest focus' }
      );
    } else if (equipment.includes('dumbbell')) {
      exercises.upperPush.push(
        { name: 'Dumbbell Bench Press', sets: '3-4', reps: '8-12', rest: '90 sec', notes: 'Primary chest builder' },
        { name: 'Dumbbell Shoulder Press', sets: '3-4', reps: '8-12', rest: '90 sec', notes: 'Primary shoulder builder' },
        { name: 'Dumbbell Flyes', sets: '3', reps: '10-15', rest: '60 sec', notes: 'Chest isolation' }
      );
    } else {
      // Bodyweight or minimal equipment
      exercises.upperPush.push(
        { name: 'Push-ups', sets: '3-4', reps: '10-20', rest: '60 sec', notes: 'Chest and triceps' },
        { name: 'Pike Push-ups', sets: '3', reps: '8-15', rest: '60 sec', notes: 'Shoulder focus' },
        { name: 'Dips (chair or parallel bars)', sets: '3', reps: '8-15', rest: '90 sec', notes: 'Chest and triceps' }
      );
    }
    
    // Upper Pull exercises
    if (equipment.includes('barbell') || equipment.includes('full') || equipment.includes('gym')) {
      exercises.upperPull.push(
        { name: 'Barbell Rows', sets: '3-4', reps: '6-10', rest: '2-3 min', notes: 'Primary back builder' },
        { name: 'Pull-ups or Lat Pulldowns', sets: '3-4', reps: '6-12', rest: '2 min', notes: 'Lat development' },
        { name: 'Face Pulls', sets: '3', reps: '12-15', rest: '60 sec', notes: 'Rear delts and upper back' }
      );
    } else if (equipment.includes('dumbbell')) {
      exercises.upperPull.push(
        { name: 'Dumbbell Rows', sets: '3-4', reps: '8-12', rest: '90 sec', notes: 'Primary back builder' },
        { name: 'Dumbbell Pullovers', sets: '3', reps: '10-15', rest: '60 sec', notes: 'Lat stretch and contraction' },
        { name: 'Dumbbell Shrugs', sets: '3', reps: '12-15', rest: '60 sec', notes: 'Trap development' }
      );
    } else {
      exercises.upperPull.push(
        { name: 'Pull-ups or Inverted Rows', sets: '3-4', reps: '6-12', rest: '2 min', notes: 'Primary back builder' },
        { name: 'Superman Holds', sets: '3', reps: '20-30 sec', rest: '60 sec', notes: 'Lower back and posterior chain' }
      );
    }
    
    // Lower Body exercises
    if (equipment.includes('barbell') || equipment.includes('full') || equipment.includes('gym')) {
      exercises.lowerBody.push(
        { name: 'Barbell Squats', sets: '3-4', reps: '6-10', rest: '2-3 min', notes: 'Primary leg builder' },
        { name: 'Romanian Deadlifts', sets: '3-4', reps: '6-10', rest: '2-3 min', notes: 'Hamstring and glute focus' },
        { name: 'Leg Press', sets: '3', reps: '10-15', rest: '90 sec', notes: 'Quad focus' },
        { name: 'Leg Curls', sets: '3', reps: '10-15', rest: '60 sec', notes: 'Hamstring isolation' },
        { name: 'Calf Raises', sets: '3-4', reps: '15-20', rest: '60 sec', notes: 'Calf development' }
      );
    } else if (equipment.includes('dumbbell')) {
      exercises.lowerBody.push(
        { name: 'Goblet Squats', sets: '3-4', reps: '10-15', rest: '90 sec', notes: 'Quad and glute focus' },
        { name: 'Dumbbell Romanian Deadlifts', sets: '3-4', reps: '10-12', rest: '90 sec', notes: 'Hamstring focus' },
        { name: 'Bulgarian Split Squats', sets: '3', reps: '10-12 per leg', rest: '90 sec', notes: 'Single leg strength' },
        { name: 'Dumbbell Calf Raises', sets: '3', reps: '15-20', rest: '60 sec', notes: 'Calf development' }
      );
    } else {
      exercises.lowerBody.push(
        { name: 'Bodyweight Squats', sets: '3-4', reps: '15-20', rest: '60 sec', notes: 'Leg endurance' },
        { name: 'Lunges', sets: '3', reps: '12-15 per leg', rest: '60 sec', notes: 'Single leg strength' },
        { name: 'Glute Bridges', sets: '3', reps: '15-20', rest: '60 sec', notes: 'Glute activation' },
        { name: 'Single-leg Calf Raises', sets: '3', reps: '15-20 per leg', rest: '60 sec', notes: 'Calf development' }
      );
    }
    
    // Core exercises
    exercises.core = [
      { name: 'Planks', sets: '3', reps: '30-60 sec', rest: '60 sec', notes: 'Core stability' },
      { name: 'Dead Bugs', sets: '3', reps: '10-12 per side', rest: '60 sec', notes: 'Anti-extension' },
      { name: 'Pallof Press or Anti-rotation Hold', sets: '3', reps: '10-12 per side', rest: '60 sec', notes: 'Anti-rotation' },
      { name: 'Hanging Knee Raises or Leg Raises', sets: '3', reps: '10-15', rest: '60 sec', notes: 'Lower abs' }
    ];
    
    // Accessories based on experience
    if (experience.includes('advanced') || experience.includes('intermediate')) {
      exercises.accessories = [
        { name: 'Bicep Curls', sets: '3', reps: '10-15', rest: '60 sec', notes: 'Bicep isolation' },
        { name: 'Tricep Extensions', sets: '3', reps: '10-15', rest: '60 sec', notes: 'Tricep isolation' },
        { name: 'Lateral Raises', sets: '3', reps: '12-15', rest: '60 sec', notes: 'Side delt focus' },
        { name: 'Rear Delt Flyes', sets: '3', reps: '12-15', rest: '60 sec', notes: 'Rear delt isolation' }
      ];
    } else {
      exercises.accessories = [
        { name: 'Bicep Curls', sets: '2-3', reps: '10-12', rest: '60 sec', notes: 'Bicep development' },
        { name: 'Tricep Dips or Extensions', sets: '2-3', reps: '10-12', rest: '60 sec', notes: 'Tricep development' }
      ];
    }
    
    return exercises;
  }
  
  /**
   * Generate volume guidelines (sets, reps, rest)
   */
  private static generateVolumeGuidelines(client: any, context: TemplateContext): any {
    const experience = (client.trainingExperience || 'beginner').toLowerCase();
    const goal = (client.goal || client.mainFitnessGoals || '').toLowerCase();
    
    let guidelines: any = {};
    
    if (experience.includes('beginner')) {
      guidelines = {
        setsPerExercise: '2-3',
        repsPerSet: '10-12',
        exercisesPerSession: '6-8',
        restBetweenSets: '60-90 seconds',
        weeklyVolume: '10-15 sets per muscle group',
        notes: [
          'Focus on learning proper form with lighter weights',
          'Gradually increase weight when you can complete all reps with good form',
          'Don\'t train to failure - leave 1-2 reps in reserve'
        ]
      };
    } else if (experience.includes('intermediate')) {
      guidelines = {
        setsPerExercise: '3-4',
        repsPerSet: '8-12 (strength) or 10-15 (hypertrophy)',
        exercisesPerSession: '8-10',
        restBetweenSets: '90-120 seconds (strength) or 60-90 seconds (hypertrophy)',
        weeklyVolume: '15-20 sets per muscle group',
        notes: [
          'Vary rep ranges between strength and hypertrophy phases',
          'Train close to failure (1-2 reps in reserve) on main lifts',
          'Use progressive overload - increase weight, reps, or sets over time'
        ]
      };
    } else {
      guidelines = {
        setsPerExercise: '4-5',
        repsPerSet: '6-10 (strength) or 10-15 (hypertrophy)',
        exercisesPerSession: '10-12',
        restBetweenSets: '2-3 minutes (strength) or 60-90 seconds (hypertrophy)',
        weeklyVolume: '20-25 sets per muscle group',
        notes: [
          'Periodize training with strength, hypertrophy, and deload phases',
          'Train to or near failure on most sets',
          'Use advanced techniques like drop sets, supersets, or rest-pause when appropriate',
          'Monitor recovery carefully to avoid overtraining'
        ]
      };
    }
    
    // Adjust for goals
    if (goal.includes('strength')) {
      guidelines.primaryRepRange = '3-6 reps for main lifts';
      guidelines.restPeriods = '3-5 minutes for main lifts';
    } else if (goal.includes('endurance')) {
      guidelines.primaryRepRange = '15-20 reps';
      guidelines.restPeriods = '30-60 seconds';
    }
    
    return guidelines;
  }
  
  /**
   * Generate progression plan
   */
  private static generateProgressionPlan(client: any, context: TemplateContext): any {
    const experience = (client.trainingExperience || 'beginner').toLowerCase();
    
    const plan: any = {
      phases: [],
      methods: [],
      tracking: []
    };
    
    // Progression phases
    plan.phases = [
      {
        name: 'Weeks 1-2: Adaptation',
        focus: 'Learn movements and establish baseline',
        approach: 'Use conservative weights, focus on form',
        progression: 'Increase weight by 5-10 lbs when all sets completed with good form'
      },
      {
        name: 'Weeks 3-6: Linear Progression',
        focus: 'Build strength and muscle',
        approach: 'Increase weight consistently each week',
        progression: 'Add 5 lbs to upper body, 10 lbs to lower body exercises weekly'
      },
      {
        name: 'Weeks 7-10: Continued Growth',
        focus: 'Maintain progressive overload',
        approach: 'Progress weight, reps, or sets',
        progression: 'When you can complete all sets at top of rep range, increase weight'
      },
      {
        name: 'Week 11: Deload',
        focus: 'Recovery and adaptation',
        approach: 'Reduce volume by 40-50%',
        progression: 'Use lighter weights, maintain frequency'
      },
      {
        name: 'Week 12+: Reassess and Adjust',
        focus: 'Evaluate progress and modify program',
        approach: 'Test new maxes, adjust training split if needed',
        progression: 'Continue with new baseline'
      }
    ];
    
    // Progression methods
    plan.methods = [
      {
        method: 'Add Weight',
        description: 'Primary method - increase load when you can complete all sets',
        example: 'Bench press: 135 lbs x 10 reps → 140 lbs x 10 reps'
      },
      {
        method: 'Add Reps',
        description: 'Increase reps within your target range',
        example: 'Squats: 185 lbs x 8 reps → 185 lbs x 10 reps'
      },
      {
        method: 'Add Sets',
        description: 'Increase training volume',
        example: 'Rows: 3 sets → 4 sets at same weight and reps'
      },
      {
        method: 'Decrease Rest',
        description: 'Improve work capacity',
        example: 'Rest periods: 90 seconds → 75 seconds'
      },
      {
        method: 'Improve Tempo',
        description: 'Control the eccentric (lowering) phase',
        example: 'Add 3-second eccentric to each rep'
      }
    ];
    
    // Tracking recommendations
    plan.tracking = [
      'Record weight, sets, and reps for each exercise',
      'Note how the weight felt (RPE 1-10 scale)',
      'Track any form issues or pain',
      'Review weekly to ensure consistent progression',
      'If stuck for 2+ weeks, adjust volume or intensity'
    ];
    
    return plan;
  }
  
  /**
   * Generate safety notes based on injury history
   */
  private static generateSafetyNotes(client: any, context: TemplateContext): string[] {
    const injuries = (client.injuries || 'none').toLowerCase();
    const pain = (client.painOrDiscomfort || 'none').toLowerCase();
    const conditions = (client.medicalConditions || 'none').toLowerCase();
    
    const notes = [
      'Always warm up before training with 5-10 minutes of light cardio and dynamic stretching',
      'Use proper form over heavy weight - ego lifting leads to injury',
      'Stop if you feel sharp pain (muscle burn is okay, joint pain is not)',
      'Use spotters for heavy lifts, especially bench press and squats',
      'Stay within your capabilities and progress gradually',
      'Cool down with 5-10 minutes of static stretching',
      'Listen to your body - extra rest is better than injury'
    ];
    
    // Add specific notes based on injury history
    if (injuries !== 'none' && injuries !== 'none reported') {
      notes.push(`⚠️ Injury History: ${client.injuries}`);
      notes.push('Modify exercises as needed to avoid aggravating previous injuries');
      notes.push('Consider working with a physical therapist for injury-specific modifications');
    }
    
    if (pain !== 'none' && pain !== 'none reported') {
      notes.push(`⚠️ Current Pain/Discomfort: ${client.painOrDiscomfort}`);
      notes.push('Avoid exercises that cause or worsen pain');
      notes.push('Focus on pain-free range of motion');
    }
    
    if (conditions !== 'none' && conditions !== 'none reported') {
      notes.push(`⚠️ Medical Conditions: ${client.medicalConditions}`);
      notes.push('Consult with your healthcare provider before starting any new exercise program');
    }
    
    return notes;
  }
}
