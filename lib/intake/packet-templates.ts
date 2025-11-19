/**
 * Default Packet Templates
 * 
 * This module contains the default templates for all packet types:
 * - Nutrition Packet
 * - Workout Packet
 * - Performance Packet
 * - Youth Packet
 * - Recovery Packet
 * - Wellness Packet
 */

import { PacketTemplate } from '@/types/intake';

// ============================================================================
// Nutrition Packet Template
// ============================================================================

export const nutritionPacketTemplate: PacketTemplate = {
  id: 'nutrition-default',
  name: 'Default Nutrition Packet',
  packetType: 'NUTRITION',
  isDefault: true,
  sections: [
    {
      id: 'overview',
      title: 'Your Nutrition Overview',
      description: 'Personalized nutrition guidance based on your goals',
      order: 1,
      contentBlockIds: ['welcome', 'goals-summary', 'calorie-target']
    },
    {
      id: 'macros',
      title: 'Macronutrient Breakdown',
      description: 'Your daily protein, carbohydrate, and fat targets',
      order: 2,
      contentBlockIds: ['macro-chart', 'macro-explanation']
    },
    {
      id: 'meal-timing',
      title: 'Meal Timing & Schedule',
      description: 'When to eat for optimal results',
      order: 3,
      contentBlockIds: ['meal-schedule', 'timing-tips']
    },
    {
      id: 'meal-plan',
      title: 'Sample Meal Plan',
      description: 'Example meals incorporating your preferences',
      order: 4,
      contentBlockIds: ['meal-examples', 'recipe-suggestions']
    },
    {
      id: 'shopping',
      title: 'Shopping List',
      description: 'Essential foods to keep on hand',
      order: 5,
      contentBlockIds: ['shopping-list', 'prep-tips']
    },
    {
      id: 'tips',
      title: 'Practical Tips & Strategies',
      description: 'How to stay consistent and overcome challenges',
      order: 6,
      contentBlockIds: ['adherence-tips', 'troubleshooting']
    }
  ],
  contentBlocks: [
    {
      id: 'welcome',
      type: 'text',
      content: 'Welcome {{client.fullName}}! This nutrition plan is designed specifically for your goal of {{client.goal}}. Based on your lifestyle and preferences, we\'ve created a sustainable approach to help you achieve your objectives.',
      order: 1
    },
    {
      id: 'goals-summary',
      type: 'text',
      content: 'Your primary goal: {{client.goal}}\nActivity level: {{client.activityLevel}}\nDietary preferences: {{client.dietType}}',
      order: 2
    },
    {
      id: 'calorie-target',
      type: 'text',
      content: 'Based on your activity level and goals, your daily calorie target is {{calculated.dailyCalories}} calories. This target is designed to support {{client.goal}} while maintaining energy for your daily activities and training.',
      order: 3
    },
    {
      id: 'macro-chart',
      type: 'table',
      content: '',
      dataSource: 'calculated.macros',
      formatting: {
        headers: ['Nutrient', 'Grams', 'Calories', 'Percentage'],
        columns: ['name', 'grams', 'calories', 'percentage']
      },
      order: 4
    },
    {
      id: 'macro-explanation',
      type: 'text',
      content: 'These macronutrient targets are optimized for your goals. Protein supports muscle maintenance and recovery, carbohydrates fuel your training and daily activities, and fats support hormone production and overall health.',
      order: 5
    },
    {
      id: 'meal-schedule',
      type: 'list',
      content: '',
      dataSource: 'calculated.mealTiming',
      formatting: {
        listStyle: 'bullet'
      },
      order: 6
    },
    {
      id: 'timing-tips',
      type: 'text',
      content: 'Meal timing can enhance your results. Aim to eat protein with each meal, consume most carbohydrates around your training sessions, and spread your meals evenly throughout the day to maintain stable energy levels.',
      order: 7
    },
    {
      id: 'meal-examples',
      type: 'text',
      content: 'Sample Daily Menu:\n\nBreakfast: Greek yogurt with berries and granola, or eggs with whole grain toast and avocado\n\nLunch: Grilled chicken salad with mixed vegetables and quinoa, or turkey sandwich with fruit\n\nDinner: Salmon with roasted vegetables and sweet potato, or lean beef stir-fry with brown rice\n\nSnacks: Protein shake, nuts and fruit, or cottage cheese with vegetables',
      order: 8
    },
    {
      id: 'recipe-suggestions',
      type: 'text',
      content: 'We\'ve considered your preferences for {{client.favoriteMeals}} and dietary needs ({{client.dietType}}). All suggestions avoid your listed restrictions: {{client.foodAllergies}}, {{client.foodsToAvoid}}.',
      order: 9
    },
    {
      id: 'shopping-list',
      type: 'text',
      content: 'Essential Items:\n\nProteins: Chicken breast, lean ground turkey, eggs, Greek yogurt, salmon, protein powder\n\nCarbohydrates: Brown rice, quinoa, sweet potatoes, oats, whole grain bread, fruits\n\nFats: Avocado, nuts, olive oil, nut butter\n\nVegetables: Mixed greens, broccoli, peppers, tomatoes, spinach, carrots\n\nPantry: Spices, herbs, low-sodium soy sauce, balsamic vinegar',
      order: 10
    },
    {
      id: 'prep-tips',
      type: 'text',
      content: 'Meal Prep Strategy: Dedicate 2-3 hours on Sunday to prepare proteins and grains for the week. Pre-cut vegetables and portion snacks into containers. This makes healthy eating convenient during busy weekdays.',
      order: 11
    },
    {
      id: 'adherence-tips',
      type: 'text',
      content: 'Keys to Success:\n\n- Track your intake for the first 2 weeks to learn portion sizes\n- Stay hydrated with {{calculated.hydrationOz}} oz of water daily\n- Allow flexibility for social events (80/20 rule)\n- Focus on whole foods but don\'t fear processed foods in moderation\n- Adjust portions based on hunger and energy levels',
      order: 12
    },
    {
      id: 'troubleshooting',
      type: 'text',
      content: 'Common Challenges:\n\nNot seeing results? Ensure you\'re consistent for at least 4 weeks before making changes.\n\nAlways hungry? Increase protein and fiber intake, drink more water.\n\nLow energy? Check that you\'re eating enough, especially carbohydrates around training.\n\nDifficult to follow? Start with small changes rather than overhauling everything at once.',
      order: 13
    }
  ]
};

// ============================================================================
// Workout Packet Template
// ============================================================================

export const workoutPacketTemplate: PacketTemplate = {
  id: 'workout-default',
  name: 'Default Workout Packet',
  packetType: 'WORKOUT',
  isDefault: true,
  sections: [
    {
      id: 'overview',
      title: 'Your Training Program Overview',
      description: 'Customized workout plan for your goals',
      order: 1,
      contentBlockIds: ['welcome-workout', 'program-summary', 'training-split']
    },
    {
      id: 'schedule',
      title: 'Weekly Training Schedule',
      description: 'Your workout routine for the week',
      order: 2,
      contentBlockIds: ['weekly-schedule', 'session-structure']
    },
    {
      id: 'exercises',
      title: 'Exercise Library',
      description: 'Detailed exercise instructions',
      order: 3,
      contentBlockIds: ['exercise-list', 'form-tips']
    },
    {
      id: 'progression',
      title: 'Progression Strategy',
      description: 'How to advance your training over time',
      order: 4,
      contentBlockIds: ['progression-plan', 'tracking-guidance']
    },
    {
      id: 'tips',
      title: 'Training Tips & Safety',
      description: 'Important guidelines for success',
      order: 5,
      contentBlockIds: ['safety-tips', 'recovery-guidance']
    }
  ],
  contentBlocks: [
    {
      id: 'welcome-workout',
      type: 'text',
      content: 'Welcome to your personalized training program, {{client.fullName}}! This program is designed for your goal of {{client.mainFitnessGoals}} with {{client.daysPerWeek}} training days per week.',
      order: 1
    },
    {
      id: 'program-summary',
      type: 'text',
      content: 'Program Details:\n\nExperience Level: {{client.trainingExperience}}\nTraining Frequency: {{calculated.weeklyFrequency}} days per week\nSession Duration: {{calculated.sessionDuration}} minutes\nAvailable Equipment: {{client.availableEquipment}}\nTraining Location: {{client.workoutLocation}}',
      order: 2
    },
    {
      id: 'training-split',
      type: 'text',
      content: 'Your Training Split: {{calculated.trainingSplit}}\n\nThis split is optimal for your training frequency and experience level, allowing adequate recovery between sessions while maximizing results.',
      order: 3
    },
    {
      id: 'weekly-schedule',
      type: 'text',
      content: 'Weekly Schedule:\n\nMonday: Upper Body Strength\nTuesday: Lower Body Strength\nWednesday: Rest or Active Recovery\nThursday: Upper Body Hypertrophy\nFriday: Lower Body Hypertrophy\nSaturday: Optional Conditioning\nSunday: Rest\n\n*Adjust days based on your schedule, maintaining at least one rest day between similar sessions',
      order: 4
    },
    {
      id: 'session-structure',
      type: 'text',
      content: 'Each Session Structure:\n\n1. Warm-up (5-10 min): Dynamic stretching and light cardio\n2. Main Work (40-50 min): Strength exercises as programmed\n3. Cool-down (5-10 min): Static stretching and mobility work\n\nSets & Reps: {{calculated.volumeRecommendations.setsPerExercise}} sets of {{calculated.volumeRecommendations.repsPerSet}} reps\nExercises per session: {{calculated.volumeRecommendations.exercisesPerSession}}',
      order: 5
    },
    {
      id: 'exercise-list',
      type: 'text',
      content: 'Core Exercises:\n\nUpper Body:\n- Bench Press or Push-ups: 3-4 sets of 8-12 reps\n- Rows (Barbell/Dumbbell): 3-4 sets of 8-12 reps\n- Overhead Press: 3 sets of 8-12 reps\n- Pull-ups or Lat Pulldowns: 3 sets of 8-12 reps\n- Bicep Curls: 2-3 sets of 10-15 reps\n- Tricep Extensions: 2-3 sets of 10-15 reps\n\nLower Body:\n- Squats: 3-4 sets of 8-12 reps\n- Deadlifts or Romanian Deadlifts: 3-4 sets of 6-10 reps\n- Lunges: 3 sets of 10-12 reps per leg\n- Leg Press: 3 sets of 10-15 reps\n- Leg Curls: 3 sets of 10-15 reps\n- Calf Raises: 3 sets of 15-20 reps',
      order: 6
    },
    {
      id: 'form-tips',
      type: 'text',
      content: 'Exercise Form Guidelines:\n\n- Control the weight through the full range of motion\n- Breathe consistently (exhale on exertion)\n- Maintain neutral spine position\n- Focus on the target muscle group\n- Use a weight that challenges you while maintaining good form\n- Rest 60-90 seconds between sets for hypertrophy, 2-3 minutes for strength',
      order: 7
    },
    {
      id: 'progression-plan',
      type: 'text',
      content: 'Progressive Overload Strategy:\n\nWeeks 1-2: Focus on learning movements and establishing baseline\nWeeks 3-4: Increase weight by 5-10% when you can complete all sets with good form\nWeeks 5-8: Continue progressive overload, add 1-2 reps per set when possible\nWeeks 9-12: Deload week (reduce volume by 40%) then reassess and adjust program\n\nProgression Methods:\n1. Add weight (primary method)\n2. Add reps\n3. Add sets\n4. Decrease rest time\n5. Improve tempo/control',
      order: 8
    },
    {
      id: 'tracking-guidance',
      type: 'text',
      content: 'Track Your Progress:\n\nRecord for each exercise:\n- Weight used\n- Reps completed per set\n- How the weight felt (RPE 1-10)\n- Any form issues or pain\n\nReview weekly to ensure you\'re progressing. If stuck for 2+ weeks, adjust volume or intensity.',
      order: 9
    },
    {
      id: 'safety-tips',
      type: 'text',
      content: 'Safety Guidelines:\n\n- Always warm up before training\n- Use proper form over heavy weight\n- Stop if you feel sharp pain (muscle burn is okay, joint pain is not)\n- Use spotters for heavy lifts\n- Stay within your capabilities\n- Respect your injury history: {{client.injuries}}',
      order: 10
    },
    {
      id: 'recovery-guidance',
      type: 'text',
      content: 'Recovery Essentials:\n\n- Sleep 7-9 hours per night\n- Eat adequate protein (0.7-1g per lb bodyweight)\n- Stay hydrated\n- Take at least 1-2 full rest days per week\n- Listen to your body - extra rest is better than injury\n- Consider active recovery: walking, swimming, yoga',
      order: 11
    }
  ]
};

// ============================================================================
// Performance Packet Template (Athlete-Specific)
// ============================================================================

export const performancePacketTemplate: PacketTemplate = {
  id: 'performance-default',
  name: 'Default Performance Packet',
  packetType: 'PERFORMANCE',
  isDefault: true,
  sections: [
    {
      id: 'overview',
      title: 'Performance Program Overview',
      description: 'NSCA-CSCS aligned training for competitive athletes',
      order: 1,
      contentBlockIds: ['welcome-performance', 'athlete-profile', 'periodization-overview']
    },
    {
      id: 'periodization',
      title: 'Periodization Plan',
      description: 'Training phases aligned with your competition schedule',
      order: 2,
      contentBlockIds: ['phase-breakdown', 'current-phase']
    },
    {
      id: 'power',
      title: 'Power Development',
      description: 'Explosive strength and rate of force development',
      order: 3,
      contentBlockIds: ['power-exercises', 'power-protocols']
    },
    {
      id: 'strength',
      title: 'Strength Training',
      description: 'Maximal strength development',
      order: 4,
      contentBlockIds: ['strength-exercises', 'strength-protocols']
    },
    {
      id: 'conditioning',
      title: 'Sport-Specific Conditioning',
      description: 'Energy system development for your sport',
      order: 5,
      contentBlockIds: ['conditioning-protocols', 'energy-systems']
    },
    {
      id: 'recovery',
      title: 'Recovery & Regeneration',
      description: 'Strategies for optimal adaptation',
      order: 6,
      contentBlockIds: ['recovery-strategies', 'monitoring']
    }
  ],
  contentBlocks: [
    {
      id: 'welcome-performance',
      type: 'text',
      content: 'Welcome to your performance training program, {{client.fullName}}! This program is designed specifically for {{client.sport}} athletes at the {{client.competitionLevel}} level, following NSCA-CSCS principles.',
      order: 1
    },
    {
      id: 'athlete-profile',
      type: 'text',
      content: 'Athlete Profile:\n\nSport: {{client.sport}}\nPosition: {{client.position}}\nCompetition Level: {{client.competitionLevel}}\nTraining Age: {{client.trainingAge}} years\nCurrent Phase: {{client.seasonPhase}}',
      order: 2
    },
    {
      id: 'periodization-overview',
      type: 'text',
      content: 'Your training is periodized to peak for competition while managing fatigue. The program cycles through different phases emphasizing various physical qualities at appropriate times in your season.',
      order: 3
    },
    {
      id: 'phase-breakdown',
      type: 'text',
      content: 'Training Phases:\n\nOff-Season (General Preparation):\n- Focus: Build strength base, address weaknesses, increase work capacity\n- Volume: High | Intensity: Moderate\n- Duration: 8-12 weeks\n\nPre-Season (Specific Preparation):\n- Focus: Convert strength to power, sport-specific conditioning\n- Volume: Moderate | Intensity: High\n- Duration: 4-8 weeks\n\nIn-Season (Competition):\n- Focus: Maintain qualities, manage fatigue, peak for key competitions\n- Volume: Low | Intensity: High\n- Duration: Variable based on season\n\nTransition (Active Rest):\n- Focus: Recovery, address injuries, maintain general fitness\n- Volume: Low | Intensity: Low\n- Duration: 2-4 weeks',
      order: 4
    },
    {
      id: 'current-phase',
      type: 'text',
      content: 'Current Phase: {{client.seasonPhase}}\n\nBased on your competition schedule, you are currently in the {{client.seasonPhase}} phase. Training emphasis and volume are adjusted accordingly.',
      order: 5
    },
    {
      id: 'power-exercises',
      type: 'text',
      content: 'Power Development Exercises:\n\nOlympic Lifts:\n- Power Clean: 3-5 sets x 2-3 reps\n- Hang Snatch: 3-5 sets x 2-3 reps\n- Push Press: 3-4 sets x 3-5 reps\n\nPlyometrics:\n- Box Jumps: 3-4 sets x 3-5 reps\n- Depth Jumps: 3 sets x 3-5 reps\n- Medicine Ball Throws: 3-4 sets x 5-8 reps\n\nBallistic Movements:\n- Jump Squats: 3-4 sets x 3-5 reps\n- Bench Throw: 3 sets x 3-5 reps',
      order: 6
    },
    {
      id: 'power-protocols',
      type: 'text',
      content: 'Power Training Guidelines:\n\n- Perform when fresh (beginning of session)\n- Use 30-70% 1RM for ballistic exercises\n- Focus on maximal velocity and intent\n- Rest 2-5 minutes between sets\n- Stop set when velocity decreases\n- 2-3 sessions per week in appropriate phases',
      order: 7
    },
    {
      id: 'strength-exercises',
      type: 'text',
      content: 'Maximal Strength Exercises:\n\nPrimary Lifts:\n- Back Squat: 3-5 sets x 3-6 reps @ 80-90% 1RM\n- Deadlift: 3-5 sets x 2-5 reps @ 80-90% 1RM\n- Bench Press: 3-5 sets x 3-6 reps @ 80-90% 1RM\n- Front Squat: 3-4 sets x 3-6 reps @ 75-85% 1RM\n\nAccessory Lifts:\n- Romanian Deadlift: 3-4 sets x 6-8 reps\n- Bulgarian Split Squat: 3 sets x 6-8 reps per leg\n- Weighted Pull-ups: 3-4 sets x 4-8 reps\n- Overhead Press: 3-4 sets x 5-8 reps',
      order: 8
    },
    {
      id: 'strength-protocols',
      type: 'text',
      content: 'Strength Training Guidelines:\n\n- Emphasize in off-season and early pre-season\n- Use 80-95% 1RM for primary lifts\n- Rest 3-5 minutes between sets\n- Focus on perfect technique\n- Track loads and progress systematically\n- Deload every 3-4 weeks',
      order: 9
    },
    {
      id: 'conditioning-protocols',
      type: 'text',
      content: 'Sport-Specific Conditioning:\n\nFor {{client.sport}}:\n\nAnaerobic Capacity:\n- High-intensity intervals: 20-40 sec work, 1-2 min rest\n- 6-10 repetitions\n- 2x per week\n\nAerobic Base:\n- Steady-state cardio: 20-40 minutes\n- Low intensity (conversational pace)\n- 1-2x per week in off-season\n\nSpeed Development:\n- Sprint intervals: 10-40 meters\n- Full recovery between reps\n- Focus on acceleration and max velocity',
      order: 10
    },
    {
      id: 'energy-systems',
      type: 'text',
      content: 'Energy System Training:\n\nPhosphagen System (0-10 sec):\n- Maximal sprints, jumps, throws\n- Full recovery (3-5 min)\n\nGlycolytic System (10-120 sec):\n- Repeated sprints, high-intensity intervals\n- Incomplete recovery (1-3 min)\n\nOxidative System (>120 sec):\n- Tempo runs, steady-state cardio\n- Continuous or short rest intervals',
      order: 11
    },
    {
      id: 'recovery-strategies',
      type: 'text',
      content: 'Recovery Protocol:\n\nDaily:\n- Sleep 8-10 hours\n- Hydration: 0.5-1 oz per lb bodyweight\n- Nutrition: High protein, adequate carbs\n\nWeekly:\n- 1-2 complete rest days\n- Active recovery sessions\n- Foam rolling and mobility work\n\nMonthly:\n- Deload week (reduce volume 40-50%)\n- Massage or manual therapy\n- Assessment and program adjustment',
      order: 12
    },
    {
      id: 'monitoring',
      type: 'text',
      content: 'Performance Monitoring:\n\nTrack Daily:\n- Sleep quality and duration\n- Muscle soreness (1-10 scale)\n- Mood and motivation\n- Resting heart rate\n\nTrack Weekly:\n- Body weight\n- Training volume and intensity\n- Subjective wellness questionnaire\n\nTest Monthly:\n- Vertical jump\n- Sprint times\n- Strength benchmarks\n- Sport-specific assessments',
      order: 13
    }
  ]
};

// ============================================================================
// Youth Packet Template
// ============================================================================

export const youthPacketTemplate: PacketTemplate = {
  id: 'youth-default',
  name: 'Default Youth Packet',
  packetType: 'YOUTH',
  isDefault: true,
  sections: [
    {
      id: 'safety',
      title: 'Safety First!',
      description: 'Important safety guidelines for young athletes',
      order: 1,
      contentBlockIds: ['welcome-youth', 'safety-rules', 'parent-overview']
    },
    {
      id: 'basics',
      title: 'Movement Basics',
      description: 'Learning proper movement patterns',
      order: 2,
      contentBlockIds: ['fundamental-movements', 'technique-focus']
    },
    {
      id: 'progression',
      title: 'Your Training Plan',
      description: 'Age-appropriate exercises and progression',
      order: 3,
      contentBlockIds: ['youth-exercises', 'progression-youth']
    },
    {
      id: 'parent-guide',
      title: 'Parent & Guardian Guide',
      description: 'How to support your young athlete',
      order: 4,
      contentBlockIds: ['parent-tips', 'what-to-watch']
    }
  ],
  contentBlocks: [
    {
      id: 'welcome-youth',
      type: 'text',
      content: 'Hey {{client.fullName}}! Welcome to your training program! This plan is designed just for you to help you get stronger, faster, and better at {{client.sportsPlayed}}. Remember, the most important thing is to have fun and learn proper form!',
      order: 1
    },
    {
      id: 'safety-rules',
      type: 'text',
      content: 'Safety Rules (SUPER IMPORTANT!):\n\n1. Always warm up before exercising\n2. Use proper form - quality over quantity!\n3. Start with light weights or bodyweight\n4. Tell an adult if something hurts\n5. Stay hydrated - drink water before, during, and after\n6. Never train alone - always have adult supervision\n7. If you feel dizzy or sick, stop and rest\n8. Listen to your body - rest when you need it',
      order: 2
    },
    {
      id: 'parent-overview',
      type: 'text',
      content: 'For Parents/Guardians:\n\nThis program emphasizes proper movement patterns, injury prevention, and long-term athletic development. Youth training should focus on:\n- Learning correct technique\n- Building general athleticism\n- Developing coordination and body awareness\n- Making exercise fun and engaging\n- Avoiding early specialization and overtraining',
      order: 3
    },
    {
      id: 'fundamental-movements',
      type: 'text',
      content: 'The 7 Fundamental Movements:\n\n1. Squat - Sitting down and standing up\n2. Hinge - Bending at the hips (like picking something up)\n3. Push - Pushing things away from you\n4. Pull - Pulling things toward you\n5. Lunge - Stepping forward or backward\n6. Rotate - Twisting your body\n7. Gait - Walking, running, skipping\n\nMastering these movements will help you in all sports!',
      order: 4
    },
    {
      id: 'technique-focus',
      type: 'text',
      content: 'Perfect Practice Makes Perfect!\n\nWhen learning exercises:\n- Watch demonstrations carefully\n- Start slow and controlled\n- Focus on feeling the right muscles working\n- Ask questions if you\'re unsure\n- It\'s okay to make mistakes - that\'s how we learn!\n\nRemember: Good form now = staying healthy and getting stronger later!',
      order: 5
    },
    {
      id: 'youth-exercises',
      type: 'text',
      content: 'Your Exercise Plan (2-3 times per week):\n\nWarm-Up (5-10 minutes):\n- Jumping jacks: 20 reps\n- High knees: 20 reps\n- Arm circles: 10 each direction\n- Bodyweight squats: 10 reps\n\nMain Exercises:\n1. Bodyweight Squats: 2 sets of 10-12 reps\n2. Push-ups (on knees if needed): 2 sets of 8-10 reps\n3. Lunges: 2 sets of 8 reps each leg\n4. Plank: 2 sets of 20-30 seconds\n5. Superman holds: 2 sets of 15 seconds\n6. Jumping: 2 sets of 5 jumps\n\nCool-Down (5 minutes):\n- Light walking\n- Gentle stretching',
      order: 6
    },
    {
      id: 'progression-youth',
      type: 'text',
      content: 'How to Get Better:\n\nWeeks 1-2: Learn all the movements\nWeeks 3-4: Add more reps (try for 2-3 more)\nWeeks 5-6: Add another set\nWeeks 7-8: Try harder versions (like regular push-ups instead of knee push-ups)\n\nRemember: Progress slowly! It\'s not a race. Getting stronger takes time, and that\'s okay!',
      order: 7
    },
    {
      id: 'parent-tips',
      type: 'text',
      content: 'Parent/Guardian Support Tips:\n\n1. Supervise all training sessions\n2. Emphasize effort and improvement, not comparison to others\n3. Make it fun - use games and challenges\n4. Be patient with skill development\n5. Watch for signs of overtraining or burnout\n6. Encourage multiple sports and activities\n7. Prioritize sleep (9-11 hours for youth)\n8. Ensure proper nutrition and hydration\n9. Celebrate small victories and progress\n10. Model healthy exercise habits yourself',
      order: 8
    },
    {
      id: 'what-to-watch',
      type: 'text',
      content: 'Warning Signs to Watch For:\n\nStop training and consult a healthcare provider if you notice:\n- Sharp or persistent pain\n- Swelling in joints\n- Decreased performance or motivation\n- Difficulty sleeping\n- Loss of appetite\n- Frequent illness\n- Mood changes or irritability\n\nYouth athletes should never "push through pain." Growing bodies need extra care and attention.',
      order: 9
    }
  ]
};

// ============================================================================
// Recovery/Modification Packet Template
// ============================================================================

export const recoveryPacketTemplate: PacketTemplate = {
  id: 'recovery-default',
  name: 'Default Recovery Packet',
  packetType: 'RECOVERY',
  isDefault: true,
  sections: [
    {
      id: 'limitations',
      title: 'Understanding Your Limitations',
      description: 'Important information about your condition',
      order: 1,
      contentBlockIds: ['welcome-recovery', 'condition-summary', 'medical-clearance']
    },
    {
      id: 'safe-movements',
      title: 'Safe Movement Patterns',
      description: 'Exercises you can do safely',
      order: 2,
      contentBlockIds: ['safe-exercises', 'modifications']
    },
    {
      id: 'avoid',
      title: 'What to Avoid',
      description: 'Movements and positions to avoid',
      order: 3,
      contentBlockIds: ['avoid-list', 'pain-management']
    },
    {
      id: 'progression',
      title: 'Progressive Return to Activity',
      description: 'How to gradually increase activity',
      order: 4,
      contentBlockIds: ['progression-protocol', 'monitoring-recovery']
    }
  ],
  contentBlocks: [
    {
      id: 'welcome-recovery',
      type: 'text',
      content: 'Welcome {{client.fullName}}. This program is designed to help you safely return to activity while respecting your current limitations. Recovery takes time and patience, but with the right approach, you can make steady progress.',
      order: 1
    },
    {
      id: 'condition-summary',
      type: 'text',
      content: 'Your Situation:\n\nArea of concern: {{client.injuryLocation}}\nPain patterns: {{client.painPatterns}}\nAggravating positions: {{client.aggravatingPositions}}\nMobility limitations: {{client.mobilityLimitations}}\n\nThis program takes all of these factors into account.',
      order: 2
    },
    {
      id: 'medical-clearance',
      type: 'text',
      content: '⚠️ IMPORTANT: Medical Clearance\n\nMedical clearance status: {{client.medicalClearance}}\n\nThis program is designed for general guidance only and does not replace medical advice. Always follow your healthcare provider\'s recommendations. If you experience increased pain, swelling, or new symptoms, stop exercising and consult your doctor.',
      order: 3
    },
    {
      id: 'safe-exercises',
      type: 'text',
      content: 'Safe Exercises to Start:\n\nGentle Movement (Daily):\n- Pain-free range of motion exercises\n- Gentle stretching (hold 20-30 seconds)\n- Walking (start with 10-15 minutes)\n\nStrengthening (3x per week):\n- Isometric holds: 3 sets of 10-20 seconds\n- Light resistance band exercises: 2 sets of 12-15 reps\n- Bodyweight exercises (modified as needed): 2 sets of 10 reps\n\nStart conservatively and progress slowly. Pain should not exceed 3/10 during or after exercise.',
      order: 4
    },
    {
      id: 'modifications',
      type: 'text',
      content: 'Exercise Modifications:\n\nGeneral Principles:\n- Reduce range of motion if needed\n- Use lighter resistance\n- Perform exercises seated if standing is difficult\n- Break exercises into smaller sets\n- Focus on pain-free movement\n- Use support (wall, chair) as needed\n\nExamples:\n- Squats → Wall sits or chair squats\n- Push-ups → Wall push-ups or incline push-ups\n- Lunges → Step-ups or split stance holds\n- Planks → Knee planks or standing wall planks',
      order: 5
    },
    {
      id: 'avoid-list',
      type: 'text',
      content: 'Movements to Avoid:\n\nBased on your condition, avoid:\n- Positions that aggravate symptoms: {{client.aggravatingPositions}}\n- High-impact activities until cleared\n- Heavy lifting (>50% perceived max)\n- Rapid or ballistic movements\n- Exercises that cause pain >3/10\n- Training through sharp or increasing pain\n\nThese restrictions are temporary. As you improve, you\'ll gradually reintroduce more activities.',
      order: 6
    },
    {
      id: 'pain-management',
      type: 'text',
      content: 'Pain Management Strategies:\n\nDuring Exercise:\n- Use the 0-10 pain scale\n- Stay below 3/10 pain level\n- Stop if pain increases during activity\n- Modify or skip exercises that cause discomfort\n\nAfter Exercise:\n- Some soreness (2-3/10) is normal\n- Ice if recommended by your provider\n- Gentle movement to reduce stiffness\n- Rest if pain persists >24 hours\n\nRed Flags (Stop and seek medical attention):\n- Sharp, severe pain\n- Numbness or tingling\n- Swelling or warmth\n- Loss of function\n- Pain that worsens over time',
      order: 7
    },
    {
      id: 'progression-protocol',
      type: 'text',
      content: 'Progressive Return Protocol:\n\nPhase 1 (Weeks 1-2): Pain-Free Movement\n- Focus: Restore range of motion\n- Activity: Gentle stretching, walking\n- Progression criteria: No pain increase, improved mobility\n\nPhase 2 (Weeks 3-4): Light Strengthening\n- Focus: Build basic strength\n- Activity: Bodyweight exercises, light resistance\n- Progression criteria: Exercises pain-free, no flare-ups\n\nPhase 3 (Weeks 5-8): Moderate Activity\n- Focus: Increase load and complexity\n- Activity: Progressive resistance, functional movements\n- Progression criteria: Consistent pain-free training\n\nPhase 4 (Weeks 9+): Return to Normal Activity\n- Focus: Sport/activity-specific training\n- Activity: Gradual return to previous activities\n- Progression criteria: Medical clearance, confidence in movement\n\nNote: Timeline is approximate. Progress at your own pace.',
      order: 8
    },
    {
      id: 'monitoring-recovery',
      type: 'text',
      content: 'Monitoring Your Recovery:\n\nTrack Daily:\n- Pain level (0-10 scale)\n- Activities performed\n- Any flare-ups or setbacks\n- Sleep quality\n- Stress levels\n\nGood Signs:\n- Decreasing pain over time\n- Improved range of motion\n- Ability to do more activities\n- Better sleep\n- Increased confidence\n\nWarning Signs:\n- Increasing pain\n- New symptoms\n- Frequent flare-ups\n- Difficulty with daily activities\n- Poor sleep due to pain\n\nReview progress weekly and adjust as needed. Recovery is not always linear - some setbacks are normal.',
      order: 9
    }
  ]
};

// ============================================================================
// Wellness Packet Template
// ============================================================================

export const wellnessPacketTemplate: PacketTemplate = {
  id: 'wellness-default',
  name: 'Default Wellness Packet',
  packetType: 'WELLNESS',
  isDefault: true,
  sections: [
    {
      id: 'overview',
      title: 'Your Wellness Journey',
      description: 'A holistic approach to health and fitness',
      order: 1,
      contentBlockIds: ['welcome-wellness', 'wellness-goals', 'holistic-approach']
    },
    {
      id: 'movement',
      title: 'Movement & Activity',
      description: 'Simple, sustainable exercise habits',
      order: 2,
      contentBlockIds: ['daily-movement', 'weekly-exercise']
    },
    {
      id: 'nutrition',
      title: 'Nutrition Basics',
      description: 'Simple nutrition principles for health',
      order: 3,
      contentBlockIds: ['nutrition-principles', 'hydration']
    },
    {
      id: 'lifestyle',
      title: 'Lifestyle Factors',
      description: 'Sleep, stress, and recovery',
      order: 4,
      contentBlockIds: ['sleep-guidance', 'stress-management']
    },
    {
      id: 'sustainability',
      title: 'Building Sustainable Habits',
      description: 'Making wellness a lifestyle',
      order: 5,
      contentBlockIds: ['habit-building', 'overcoming-barriers']
    }
  ],
  contentBlocks: [
    {
      id: 'welcome-wellness',
      type: 'text',
      content: 'Welcome {{client.fullName}}! This wellness guide is designed to help you build sustainable healthy habits. The focus is on progress, not perfection, and finding what works for your lifestyle.',
      order: 1
    },
    {
      id: 'wellness-goals',
      type: 'text',
      content: 'Your Wellness Goals:\n\nPrimary focus: {{client.goal}}\nCurrent barriers: {{client.biggestStruggle}}\nMotivation: {{client.motivation}}\n\nWe\'ll address these factors with practical, achievable strategies.',
      order: 2
    },
    {
      id: 'holistic-approach',
      type: 'text',
      content: 'The Four Pillars of Wellness:\n\n1. Movement: Regular physical activity\n2. Nutrition: Balanced, nourishing food\n3. Recovery: Quality sleep and stress management\n4. Mindset: Positive relationship with health\n\nAll four pillars work together. Small improvements in each area create significant overall impact.',
      order: 3
    },
    {
      id: 'daily-movement',
      type: 'text',
      content: 'Daily Movement Goals:\n\nMinimum Target: 7,000-10,000 steps per day\n\nWays to increase daily movement:\n- Take walking breaks every hour\n- Use stairs instead of elevators\n- Park farther away\n- Walk during phone calls\n- Do household chores actively\n- Play with kids or pets\n- Garden or do yard work\n\nRemember: All movement counts! You don\'t need a gym to be active.',
      order: 4
    },
    {
      id: 'weekly-exercise',
      type: 'text',
      content: 'Weekly Exercise Plan (Start with 2-3 days, build to 4-5):\n\nCardio (2-3 days):\n- Walking, cycling, swimming, or dancing\n- Start: 20 minutes\n- Build to: 30-45 minutes\n- Intensity: Able to hold a conversation\n\nStrength (2 days):\n- Bodyweight exercises or light weights\n- 2 sets of 10-12 reps\n- Focus on major muscle groups\n- Examples: Squats, push-ups, rows, planks\n\nFlexibility (Daily):\n- 5-10 minutes of stretching\n- Focus on tight areas\n- Gentle, pain-free stretches\n\nRest Days: At least 1-2 per week',
      order: 5
    },
    {
      id: 'nutrition-principles',
      type: 'text',
      content: 'Simple Nutrition Guidelines:\n\n1. Eat mostly whole foods (foods with one ingredient)\n2. Include protein with each meal\n3. Fill half your plate with vegetables\n4. Choose whole grains over refined grains\n5. Eat fruit for sweetness\n6. Limit processed foods and added sugars\n7. Practice portion awareness (not perfection)\n8. Eat slowly and mindfully\n9. Allow flexibility for social occasions\n10. Focus on adding good foods, not just restricting\n\nNo need to count calories or follow strict rules. Focus on consistent, balanced choices.',
      order: 6
    },
    {
      id: 'hydration',
      type: 'text',
      content: 'Hydration Guidelines:\n\nDaily water target: 64-80 oz (8-10 cups)\n\nTips to drink more water:\n- Start your day with a glass of water\n- Keep a water bottle with you\n- Drink a glass before each meal\n- Set reminders on your phone\n- Add lemon or cucumber for flavor\n- Drink herbal tea (counts toward hydration)\n\nSigns of good hydration:\n- Light yellow urine\n- Consistent energy\n- Healthy skin\n- Regular digestion',
      order: 7
    },
    {
      id: 'sleep-guidance',
      type: 'text',
      content: 'Sleep Optimization:\n\nTarget: 7-9 hours per night\n\nSleep Hygiene Tips:\n- Consistent sleep schedule (even weekends)\n- Dark, cool, quiet bedroom\n- No screens 1 hour before bed\n- Avoid caffeine after 2 PM\n- Light dinner, avoid heavy meals before bed\n- Relaxing bedtime routine\n- Exercise regularly (but not right before bed)\n- Manage stress during the day\n\nQuality sleep improves:\n- Energy and mood\n- Weight management\n- Immune function\n- Mental clarity\n- Recovery from exercise',
      order: 8
    },
    {
      id: 'stress-management',
      type: 'text',
      content: 'Stress Management Strategies:\n\nDaily Practices:\n- Deep breathing (5 minutes)\n- Short walks in nature\n- Mindful moments during routine tasks\n- Gratitude journaling\n- Connect with friends or family\n\nWeekly Activities:\n- Hobby or creative activity\n- Social connection\n- Time in nature\n- Relaxation practice (yoga, meditation, massage)\n\nRemember: Some stress is normal. The goal is to manage it, not eliminate it completely.',
      order: 9
    },
    {
      id: 'habit-building',
      type: 'text',
      content: 'Building Sustainable Habits:\n\nStart Small:\n- Choose 1-2 habits to focus on\n- Make them easy to do\n- Attach to existing routines\n- Track your progress\n\nExample Habit Stack:\n- Wake up → Drink water\n- Breakfast → Take vitamins\n- Lunch break → 10-minute walk\n- Before dinner → 5-minute stretch\n- Before bed → Gratitude journal\n\nBe Patient:\n- Habits take 2-3 months to become automatic\n- Expect some setbacks\n- Focus on consistency, not perfection\n- Celebrate small wins',
      order: 10
    },
    {
      id: 'overcoming-barriers',
      type: 'text',
      content: 'Overcoming Common Barriers:\n\n"I don\'t have time"\n→ Start with 10 minutes\n→ Break it into smaller chunks\n→ Combine activities (walk during calls)\n\n"I\'m too tired"\n→ Exercise actually increases energy\n→ Start with gentle movement\n→ Prioritize sleep\n\n"It\'s too expensive"\n→ Walking is free\n→ Bodyweight exercises need no equipment\n→ Cook simple meals at home\n\n"I don\'t know where to start"\n→ You\'re already starting by reading this!\n→ Pick one small action today\n→ Build from there\n\n"I always fall off track"\n→ That\'s normal - just restart\n→ Don\'t aim for perfection\n→ Focus on progress over time\n\nYour identified barrier: {{client.biggestStruggle}}\nStrategy: Start with the smallest possible step and build momentum gradually.',
      order: 11
    }
  ]
};

// ============================================================================
// Template Registry
// ============================================================================

export const defaultTemplates: PacketTemplate[] = [
  nutritionPacketTemplate,
  workoutPacketTemplate,
  performancePacketTemplate,
  youthPacketTemplate,
  recoveryPacketTemplate,
  wellnessPacketTemplate
];

export function getTemplateByPacketType(packetType: string): PacketTemplate | undefined {
  return defaultTemplates.find(t => t.packetType === packetType && t.isDefault);
}

export function getAllTemplates(): PacketTemplate[] {
  return defaultTemplates;
}
