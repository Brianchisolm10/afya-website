/**
 * Youth Packet Generation Logic
 * 
 * Implements age-appropriate training guidance with emphasis on
 * safety, proper form, and progressive development for young athletes.
 */

import { PopulatedContent, TemplateContext } from '@/types/intake';

export class YouthGenerator {
  /**
   * Enhance youth packet with age-appropriate content
   */
  static enhanceYouthContent(
    content: PopulatedContent,
    client: any,
    context: TemplateContext
  ): PopulatedContent {
    const enhanced = { ...content };
    
    // Add age-appropriate exercises
    enhanced.exercises = this.generateYouthExercises(client, context);
    
    // Add safety guidelines
    enhanced.safetyGuidelines = this.generateSafetyGuidelines(client, context);
    
    // Add progression plan
    enhanced.progressionPlan = this.generateYouthProgression(client, context);
    
    // Add parent guidance
    enhanced.parentGuidance = this.generateParentGuidance(client, context);
    
    // Add fun elements
    enhanced.funElements = this.generateFunElements(client, context);
    
    return enhanced;
  }
  
  /**
   * Generate age-appropriate exercises
   */
  private static generateYouthExercises(client: any, context: TemplateContext): any {
    const grade = client.schoolGrade || 'middle school';
    const sports = client.sportsPlayed || 'various';
    const equipment = (client.availableEquipment || 'minimal').toLowerCase();
    
    const exercises: any = {
      warmUp: [],
      mainExercises: [],
      coolDown: [],
      weeklyPlan: []
    };
    
    // Warm-up (always bodyweight, fun, and engaging)
    exercises.warmUp = [
      { name: 'Jumping Jacks', duration: '30 seconds', notes: 'Get your heart pumping!' },
      { name: 'High Knees', duration: '20 seconds', notes: 'Lift those knees high!' },
      { name: 'Butt Kicks', duration: '20 seconds', notes: 'Try to kick your butt!' },
      { name: 'Arm Circles', reps: '10 each direction', notes: 'Big circles, then small circles' },
      { name: 'Bodyweight Squats', reps: '10', notes: 'Practice good form' },
      { name: 'Lunges', reps: '5 each leg', notes: 'Step forward and down' },
      { name: 'Inchworms', reps: '5', notes: 'Walk your hands out, then walk feet to hands' }
    ];
    
    // Main exercises (bodyweight focus, can add light resistance)
    exercises.mainExercises = {
      lowerBody: [
        {
          name: 'Bodyweight Squats',
          sets: '2-3',
          reps: '10-12',
          notes: 'Sit back like sitting in a chair. Keep chest up!',
          progressions: ['Add a pause at bottom', 'Hold light weight', 'Try jump squats']
        },
        {
          name: 'Lunges',
          sets: '2-3',
          reps: '8-10 each leg',
          notes: 'Step forward and lower down. Front knee stays over ankle.',
          progressions: ['Walking lunges', 'Reverse lunges', 'Hold light weights']
        },
        {
          name: 'Glute Bridges',
          sets: '2-3',
          reps: '12-15',
          notes: 'Lie on back, push hips up. Squeeze your butt at the top!',
          progressions: ['Single-leg bridges', 'Hold at top for 3 seconds', 'Add weight on hips']
        },
        {
          name: 'Step-Ups',
          sets: '2-3',
          reps: '8-10 each leg',
          notes: 'Step up onto a box or bench. Stand tall at top.',
          progressions: ['Higher box', 'Hold light weights', 'Add a knee drive']
        }
      ],
      upperBody: [
        {
          name: 'Push-Ups',
          sets: '2-3',
          reps: '8-12',
          notes: 'Start on knees if needed. Keep body straight like a plank!',
          progressions: ['Regular push-ups', 'Feet elevated', 'Diamond push-ups']
        },
        {
          name: 'Inverted Rows or Pull-Ups',
          sets: '2-3',
          reps: '5-10',
          notes: 'Pull your chest to the bar. Use assistance if needed.',
          progressions: ['Less assistance', 'Slower tempo', 'Add a pause at top']
        },
        {
          name: 'Plank',
          sets: '2-3',
          duration: '20-45 seconds',
          notes: 'Keep body straight. Don\'t let hips sag!',
          progressions: ['Longer holds', 'Plank with shoulder taps', 'Side planks']
        },
        {
          name: 'Superman Holds',
          sets: '2-3',
          duration: '15-20 seconds',
          notes: 'Lie on stomach, lift arms and legs. You\'re flying!',
          progressions: ['Longer holds', 'Superman rocks', 'Add arm/leg movements']
        }
      ],
      core: [
        {
          name: 'Dead Bugs',
          sets: '2-3',
          reps: '8-10 each side',
          notes: 'Lie on back, move opposite arm and leg. Keep back flat!',
          progressions: ['Slower tempo', 'Straighten legs more', 'Hold weights']
        },
        {
          name: 'Bird Dogs',
          sets: '2-3',
          reps: '8-10 each side',
          notes: 'On hands and knees, extend opposite arm and leg. Balance!',
          progressions: ['Hold longer', 'Add small circles', 'Close eyes']
        },
        {
          name: 'Mountain Climbers',
          sets: '2-3',
          duration: '20-30 seconds',
          notes: 'Like running in plank position. Keep hips down!',
          progressions: ['Faster pace', 'Cross-body mountain climbers', 'Longer duration']
        }
      ],
      fun: [
        {
          name: 'Bear Crawls',
          sets: '2-3',
          distance: '20-30 feet',
          notes: 'Crawl like a bear! Keep butt down.',
          progressions: ['Crab walks', 'Backwards bear crawls', 'Race a friend!']
        },
        {
          name: 'Jumping',
          sets: '2-3',
          reps: '5-8',
          notes: 'Jump as high as you can! Land softly.',
          progressions: ['Broad jumps', 'Single-leg hops', 'Jump and reach']
        },
        {
          name: 'Animal Movements',
          sets: '2',
          duration: '30 seconds each',
          notes: 'Frog jumps, bunny hops, gorilla walks - be creative!',
          progressions: ['Create your own animal movements', 'Obstacle courses']
        }
      ]
    };
    
    // Cool-down
    exercises.coolDown = [
      { name: 'Walking', duration: '2-3 minutes', notes: 'Slow walk to bring heart rate down' },
      { name: 'Quad Stretch', duration: '20 seconds each leg', notes: 'Pull foot to butt, hold' },
      { name: 'Hamstring Stretch', duration: '20 seconds each leg', notes: 'Reach for toes, feel stretch in back of leg' },
      { name: 'Shoulder Stretch', duration: '20 seconds each arm', notes: 'Pull arm across body' },
      { name: 'Child\'s Pose', duration: '30 seconds', notes: 'Sit back on heels, reach arms forward' }
    ];
    
    // Weekly plan
    exercises.weeklyPlan = [
      {
        day: 'Monday',
        focus: 'Full Body Fun',
        duration: '30-40 minutes',
        activities: ['Warm-up', '2-3 lower body exercises', '2-3 upper body exercises', '1-2 core exercises', 'Cool-down']
      },
      {
        day: 'Tuesday',
        focus: 'Active Play or Sport Practice',
        duration: 'As scheduled',
        activities: ['Play your favorite sport', 'Ride bikes', 'Play tag', 'Swim']
      },
      {
        day: 'Wednesday',
        focus: 'Rest or Light Activity',
        duration: 'Optional',
        activities: ['Walking', 'Stretching', 'Yoga', 'Light play']
      },
      {
        day: 'Thursday',
        focus: 'Full Body Fun',
        duration: '30-40 minutes',
        activities: ['Warm-up', 'Different exercises than Monday', 'Add fun movements', 'Cool-down']
      },
      {
        day: 'Friday',
        focus: 'Active Play or Sport Practice',
        duration: 'As scheduled',
        activities: ['Sport practice', 'Playground', 'Active games']
      },
      {
        day: 'Saturday',
        focus: 'Fun Activity Day',
        duration: 'Variable',
        activities: ['Family hike', 'Swimming', 'Sports with friends', 'Bike ride']
      },
      {
        day: 'Sunday',
        focus: 'Rest and Recovery',
        duration: 'Rest',
        activities: ['Light stretching', 'Relaxation', 'Prepare for next week']
      }
    ];
    
    return exercises;
  }
  
  /**
   * Generate comprehensive safety guidelines
   */
  private static generateSafetyGuidelines(client: any, context: TemplateContext): any {
    const guidelines: any = {
      beforeExercise: [],
      duringExercise: [],
      afterExercise: [],
      whenToStop: [],
      parentSupervision: []
    };
    
    guidelines.beforeExercise = [
      '✓ Always have an adult present when exercising',
      '✓ Wear comfortable clothes and proper shoes',
      '✓ Drink water before starting',
      '✓ Clear the area of obstacles and hazards',
      '✓ Do a proper warm-up (5-10 minutes)',
      '✓ Never exercise if you\'re sick or injured'
    ];
    
    guidelines.duringExercise = [
      '✓ Focus on proper form, not how much weight you lift',
      '✓ Start with bodyweight or very light weights',
      '✓ Move slowly and with control',
      '✓ Breathe normally - don\'t hold your breath',
      '✓ Take breaks when you need them',
      '✓ Drink water during exercise',
      '✓ Tell an adult if something hurts',
      '✓ It\'s okay if exercises feel hard, but they shouldn\'t hurt'
    ];
    
    guidelines.afterExercise = [
      '✓ Do a cool-down with stretching (5-10 minutes)',
      '✓ Drink plenty of water',
      '✓ Eat a healthy snack or meal',
      '✓ Tell an adult how you feel',
      '✓ Rest if you\'re very tired or sore'
    ];
    
    guidelines.whenToStop = [
      '🛑 STOP if you feel sharp pain',
      '🛑 STOP if you feel dizzy or lightheaded',
      '🛑 STOP if you can\'t breathe normally',
      '🛑 STOP if something doesn\'t feel right',
      '🛑 STOP if you\'re too tired to use good form',
      '',
      'Remember: It\'s always okay to stop and rest!'
    ];
    
    guidelines.parentSupervision = [
      'Parents/Guardians should:',
      '• Supervise ALL training sessions',
      '• Watch for proper form and technique',
      '• Ensure adequate warm-up and cool-down',
      '• Monitor for signs of fatigue or overtraining',
      '• Keep exercise fun and positive',
      '• Never push through pain',
      '• Encourage effort, not perfection',
      '• Make sure adequate rest between sessions'
    ];
    
    return guidelines;
  }
  
  /**
   * Generate youth-specific progression plan
   */
  private static generateYouthProgression(client: any, context: TemplateContext): any {
    const progression: any = {
      phases: [],
      howToProgress: [],
      importantNotes: []
    };
    
    progression.phases = [
      {
        phase: 'Weeks 1-2: Learning Phase',
        goal: 'Learn all the movements with perfect form',
        approach: 'Use only bodyweight, go slow, focus on technique',
        success: 'You can do all exercises with good form'
      },
      {
        phase: 'Weeks 3-4: Building Phase',
        goal: 'Get stronger and more confident',
        approach: 'Try to do 2-3 more reps than last week',
        success: 'Exercises feel easier, you can do more reps'
      },
      {
        phase: 'Weeks 5-6: Challenge Phase',
        goal: 'Make exercises harder',
        approach: 'Add another set or try harder versions',
        success: 'You\'re ready for new challenges'
      },
      {
        phase: 'Weeks 7-8: Progress Phase',
        goal: 'Keep getting better',
        approach: 'Try advanced versions or add light weights',
        success: 'You feel strong and confident'
      },
      {
        phase: 'Week 9+: Keep Going!',
        goal: 'Continue improving',
        approach: 'Keep challenging yourself in safe ways',
        success: 'Exercise is part of your routine'
      }
    ];
    
    progression.howToProgress = [
      {
        method: 'Do More Reps',
        example: 'Push-ups: 8 reps → 10 reps → 12 reps',
        notes: 'Easiest way to get stronger!'
      },
      {
        method: 'Add Another Set',
        example: 'Squats: 2 sets → 3 sets',
        notes: 'Do the exercise one more time'
      },
      {
        method: 'Try Harder Versions',
        example: 'Knee push-ups → Regular push-ups',
        notes: 'Make the exercise more challenging'
      },
      {
        method: 'Add Light Weight',
        example: 'Bodyweight squats → Hold light dumbbell',
        notes: 'Only after mastering bodyweight!'
      },
      {
        method: 'Go Slower',
        example: 'Count to 3 while lowering down',
        notes: 'Makes exercises harder without adding weight'
      }
    ];
    
    progression.importantNotes = [
      '🌟 Progress slowly - there\'s no rush!',
      '🌟 Good form is MORE important than doing more reps',
      '🌟 It\'s okay to have easy days and hard days',
      '🌟 Rest days help you get stronger',
      '🌟 If something feels too hard, go back to an easier version',
      '🌟 Celebrate small victories!',
      '🌟 Have fun - exercise should be enjoyable!'
    ];
    
    return progression;
  }
  
  /**
   * Generate parent/guardian guidance
   */
  private static generateParentGuidance(client: any, context: TemplateContext): any {
    const guidance: any = {
      supervision: [],
      encouragement: [],
      warningSigns: [],
      nutrition: [],
      sleep: []
    };
    
    guidance.supervision = [
      'Always supervise training sessions',
      'Watch for proper form and technique',
      'Ensure adequate warm-up (5-10 min) and cool-down (5-10 min)',
      'Keep sessions short (30-45 minutes max)',
      'Make it fun - use games and challenges',
      'Never force exercise if child is resistant',
      'Respect rest days and recovery'
    ];
    
    guidance.encouragement = [
      'Praise effort, not just results',
      'Focus on improvement, not comparison to others',
      'Celebrate small victories and progress',
      'Make exercise a family activity when possible',
      'Be a positive role model',
      'Keep it fun and age-appropriate',
      'Avoid pressure or criticism',
      'Encourage multiple sports and activities'
    ];
    
    guidance.warningSigns = [
      '⚠️ Watch for these signs of overtraining or problems:',
      '• Persistent fatigue or low energy',
      '• Decreased interest in activities they usually enjoy',
      '• Frequent illness or injuries',
      '• Difficulty sleeping',
      '• Mood changes or irritability',
      '• Complaints of persistent pain',
      '• Decreased appetite',
      '• Declining performance',
      '',
      'If you notice these signs, reduce training and consult a healthcare provider.'
    ];
    
    guidance.nutrition = [
      'Nutrition Tips for Young Athletes:',
      '• Provide balanced meals with protein, carbs, and vegetables',
      '• Encourage water throughout the day',
      '• Offer healthy snacks (fruit, yogurt, nuts)',
      '• Don\'t restrict food or put child on a diet',
      '• Make sure they eat before and after exercise',
      '• Limit sugary drinks and processed foods',
      '• Focus on whole, nutritious foods',
      '• Never use food as punishment or reward for exercise'
    ];
    
    guidance.sleep = [
      'Sleep is Critical for Young Athletes:',
      '• School-age children need 9-11 hours per night',
      '• Teenagers need 8-10 hours per night',
      '• Consistent bedtime and wake time',
      '• No screens 1 hour before bed',
      '• Cool, dark, quiet bedroom',
      '• Growth and recovery happen during sleep',
      '• Poor sleep affects performance and mood'
    ];
    
    return guidance;
  }
  
  /**
   * Generate fun elements to keep youth engaged
   */
  private static generateFunElements(client: any, context: TemplateContext): any {
    const sports = client.sportsPlayed || 'various';
    
    const funElements: any = {
      challenges: [],
      games: [],
      rewards: [],
      sportSpecific: []
    };
    
    funElements.challenges = [
      'Weekly Challenge: Beat your push-up record!',
      'Plank Challenge: Hold a plank 5 seconds longer each week',
      'Jump Challenge: See how high you can jump',
      'Balance Challenge: Stand on one foot while brushing teeth',
      'Family Challenge: Who can do the most squats?',
      'Create Your Own: Make up a new exercise!'
    ];
    
    funElements.games = [
      'Exercise Dice: Roll dice, do that many reps',
      'Card Workout: Each suit is a different exercise',
      'Simon Says: Exercise edition',
      'Obstacle Course: Set up a course in your yard',
      'Animal Race: Bear crawl, frog jump, crab walk',
      'Freeze Dance: Dance and freeze in exercise positions'
    ];
    
    funElements.rewards = [
      'Track progress with stickers or checkmarks',
      'Earn badges for consistency (not performance)',
      'Celebrate weekly completion',
      'Take progress photos to see improvement',
      'Share achievements with family',
      'Non-food rewards for reaching goals'
    ];
    
    // Sport-specific fun elements
    if (sports.toLowerCase().includes('basketball')) {
      funElements.sportSpecific = [
        'Practice vertical jump for better rebounds',
        'Do defensive slides during commercial breaks',
        'Wall sits to build leg strength for defense',
        'Practice jump shots after exercise'
      ];
    } else if (sports.toLowerCase().includes('soccer')) {
      funElements.sportSpecific = [
        'Practice quick feet drills',
        'Do lunges while dribbling a ball',
        'Sprint drills in the backyard',
        'Core work helps with balance and kicking power'
      ];
    } else if (sports.toLowerCase().includes('baseball') || sports.toLowerCase().includes('softball')) {
      funElements.sportSpecific = [
        'Rotational exercises help with hitting power',
        'Practice explosive starts for base running',
        'Core work improves throwing power',
        'Balance exercises help with fielding'
      ];
    } else {
      funElements.sportSpecific = [
        'Think about how exercises help your sport',
        'Practice sport skills after exercising',
        'Strong legs help you run faster',
        'Strong core helps with balance and power'
      ];
    }
    
    return funElements;
  }
}
