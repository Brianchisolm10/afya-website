/**
 * Performance Packet Generation Logic
 * 
 * Implements NSCA-CSCS aligned training for competitive athletes
 * with periodization, power development, and sport-specific conditioning.
 */

import { PopulatedContent, TemplateContext } from '@/types/intake';

export class PerformanceGenerator {
  /**
   * Enhance performance packet with NSCA-CSCS aligned programming
   */
  static enhancePerformanceContent(
    content: PopulatedContent,
    client: any,
    context: TemplateContext
  ): PopulatedContent {
    const enhanced = { ...content };
    
    // Add periodization details
    enhanced.periodization = this.generatePeriodization(client, context);
    
    // Add power development protocols
    enhanced.powerDevelopment = this.generatePowerProtocols(client, context);
    
    // Add speed and agility work
    enhanced.speedAgility = this.generateSpeedAgilityWork(client, context);
    
    // Add strength programming
    enhanced.strengthProgramming = this.generateStrengthProgramming(client, context);
    
    // Add conditioning protocols
    enhanced.conditioning = this.generateConditioningProtocols(client, context);
    
    // Add recovery strategies
    enhanced.recovery = this.generateRecoveryStrategies(client, context);
    
    return enhanced;
  }
  
  /**
   * Generate periodization plan based on season phase
   */
  private static generatePeriodization(client: any, context: TemplateContext): any {
    const seasonPhase = (client.seasonPhase || 'off-season').toLowerCase();
    const sport = client.sport || 'general athletics';
    const competitionLevel = client.competitionLevel || 'high school';
    
    const periodization: any = {
      currentPhase: seasonPhase,
      phaseDetails: {},
      weeklyStructure: [],
      recommendations: []
    };
    
    // Define phase-specific details
    if (seasonPhase.includes('off') || seasonPhase.includes('general')) {
      periodization.phaseDetails = {
        name: 'Off-Season / General Preparation',
        duration: '8-12 weeks',
        primaryFocus: 'Build strength base, address weaknesses, increase work capacity',
        volumeIntensity: 'High volume, Moderate intensity',
        trainingEmphasis: [
          'Maximal strength development',
          'Hypertrophy for muscle mass',
          'General conditioning',
          'Movement quality and technique',
          'Address imbalances and weaknesses'
        ],
        weeklyStructure: [
          'Day 1: Lower Body Strength (Heavy)',
          'Day 2: Upper Body Strength (Heavy)',
          'Day 3: Conditioning / Active Recovery',
          'Day 4: Lower Body Hypertrophy',
          'Day 5: Upper Body Hypertrophy',
          'Day 6: Optional Conditioning or Skill Work',
          'Day 7: Rest'
        ]
      };
    } else if (seasonPhase.includes('pre') || seasonPhase.includes('specific')) {
      periodization.phaseDetails = {
        name: 'Pre-Season / Specific Preparation',
        duration: '4-8 weeks',
        primaryFocus: 'Convert strength to power, sport-specific conditioning',
        volumeIntensity: 'Moderate volume, High intensity',
        trainingEmphasis: [
          'Power and rate of force development',
          'Sport-specific strength',
          'Speed and agility',
          'Energy system development',
          'Maintain strength gains'
        ],
        weeklyStructure: [
          'Day 1: Power Development + Lower Body Strength',
          'Day 2: Speed/Agility + Upper Body Strength',
          'Day 3: Sport-Specific Conditioning',
          'Day 4: Power Development + Full Body',
          'Day 5: Sport Practice / Skill Work',
          'Day 6: Optional Light Conditioning',
          'Day 7: Rest'
        ]
      };
    } else if (seasonPhase.includes('in') || seasonPhase.includes('competition')) {
      periodization.phaseDetails = {
        name: 'In-Season / Competition',
        duration: 'Variable based on season length',
        primaryFocus: 'Maintain qualities, manage fatigue, peak for key competitions',
        volumeIntensity: 'Low volume, High intensity',
        trainingEmphasis: [
          'Maintain strength and power',
          'Manage fatigue and recovery',
          'Sport-specific work',
          'Injury prevention',
          'Peak for important competitions'
        ],
        weeklyStructure: [
          'Day 1: Power Maintenance + Lower Body (Light)',
          'Day 2: Sport Practice / Competition',
          'Day 3: Upper Body Maintenance',
          'Day 4: Sport Practice / Competition',
          'Day 5: Full Body Maintenance (Light)',
          'Day 6: Competition or Active Recovery',
          'Day 7: Rest'
        ]
      };
    } else {
      // Transition / Active Rest
      periodization.phaseDetails = {
        name: 'Transition / Active Rest',
        duration: '2-4 weeks',
        primaryFocus: 'Recovery, address injuries, maintain general fitness',
        volumeIntensity: 'Low volume, Low intensity',
        trainingEmphasis: [
          'Physical and mental recovery',
          'Address any injuries or pain',
          'Maintain general fitness',
          'Cross-training and variety',
          'Prepare for next training cycle'
        ],
        weeklyStructure: [
          'Day 1: Light Full Body Circuit',
          'Day 2: Active Recovery (swimming, cycling, yoga)',
          'Day 3: Rest',
          'Day 4: Light Full Body Circuit',
          'Day 5: Active Recovery',
          'Day 6: Optional Light Activity',
          'Day 7: Rest'
        ]
      };
    }
    
    periodization.recommendations = [
      `Current phase (${seasonPhase}) emphasizes ${periodization.phaseDetails.primaryFocus.toLowerCase()}`,
      'Adjust training volume and intensity based on competition schedule',
      'Monitor fatigue and recovery carefully',
      'Deload every 3-4 weeks or before major competitions',
      'Communicate with coaches about training load'
    ];
    
    return periodization;
  }
  
  /**
   * Generate power development protocols
   */
  private static generatePowerProtocols(client: any, context: TemplateContext): any {
    const sport = (client.sport || 'general').toLowerCase();
    const trainingAge = client.trainingAge || 1;
    
    const protocols: any = {
      olympicLifts: [],
      plyometrics: [],
      ballisticMovements: [],
      guidelines: []
    };
    
    // Olympic lifts (if appropriate training age)
    if (trainingAge >= 2) {
      protocols.olympicLifts = [
        {
          exercise: 'Power Clean',
          sets: '4-5',
          reps: '2-3',
          intensity: '70-85% 1RM',
          rest: '3-5 minutes',
          notes: 'Focus on bar speed and explosive hip extension'
        },
        {
          exercise: 'Hang Snatch',
          sets: '4-5',
          reps: '2-3',
          intensity: '65-80% 1RM',
          rest: '3-5 minutes',
          notes: 'Emphasize speed under the bar'
        },
        {
          exercise: 'Push Press',
          sets: '3-4',
          reps: '3-5',
          intensity: '70-85% 1RM',
          rest: '2-3 minutes',
          notes: 'Explosive leg drive into overhead press'
        }
      ];
    } else {
      protocols.olympicLifts = [
        {
          exercise: 'Medicine Ball Clean',
          sets: '3-4',
          reps: '5-6',
          intensity: 'Light-moderate load',
          rest: '2-3 minutes',
          notes: 'Learn movement pattern before progressing to barbell'
        }
      ];
    }
    
    // Plyometrics
    protocols.plyometrics = [
      {
        exercise: 'Box Jumps',
        sets: '3-4',
        reps: '3-5',
        height: '24-36 inches',
        rest: '2-3 minutes',
        notes: 'Focus on explosive takeoff and soft landing'
      },
      {
        exercise: 'Depth Jumps',
        sets: '3',
        reps: '3-5',
        height: '12-24 inches',
        rest: '3-5 minutes',
        notes: 'Minimize ground contact time, maximize jump height'
      },
      {
        exercise: 'Broad Jumps',
        sets: '3-4',
        reps: '3-5',
        rest: '2-3 minutes',
        notes: 'Horizontal power development'
      },
      {
        exercise: 'Medicine Ball Throws (Overhead/Chest)',
        sets: '3-4',
        reps: '5-8',
        weight: '6-12 lbs',
        rest: '2 minutes',
        notes: 'Explosive upper body power'
      }
    ];
    
    // Ballistic movements
    protocols.ballisticMovements = [
      {
        exercise: 'Jump Squats',
        sets: '3-4',
        reps: '3-5',
        load: '30-50% 1RM or bodyweight',
        rest: '2-3 minutes',
        notes: 'Maximal intent on each rep'
      },
      {
        exercise: 'Bench Throw (Smith Machine)',
        sets: '3-4',
        reps: '3-5',
        load: '30-50% 1RM',
        rest: '2-3 minutes',
        notes: 'Release bar at top of movement'
      },
      {
        exercise: 'Kettlebell Swings',
        sets: '3-4',
        reps: '8-10',
        weight: 'Moderate-heavy',
        rest: '2 minutes',
        notes: 'Explosive hip hinge pattern'
      }
    ];
    
    // Guidelines
    protocols.guidelines = [
      'Perform power work when fresh (beginning of session)',
      'Use 30-70% 1RM for ballistic exercises',
      'Focus on maximal velocity and intent on every rep',
      'Rest 2-5 minutes between sets for full recovery',
      'Stop set when velocity decreases noticeably',
      'Perform 2-3 power sessions per week in appropriate phases',
      'Reduce volume during in-season to maintain without fatigue'
    ];
    
    return protocols;
  }
  
  /**
   * Generate speed and agility work
   */
  private static generateSpeedAgilityWork(client: any, context: TemplateContext): any {
    const sport = (client.sport || 'general').toLowerCase();
    
    const work: any = {
      linearSpeed: [],
      changeOfDirection: [],
      sportSpecific: [],
      guidelines: []
    };
    
    // Linear speed development
    work.linearSpeed = [
      {
        drill: 'Acceleration Sprints',
        distance: '10-20 meters',
        sets: '6-8',
        rest: '2-3 minutes',
        focus: 'Explosive start, forward lean, powerful arm drive'
      },
      {
        drill: 'Flying Sprints',
        distance: '20-30 meters (with 20m build-up)',
        sets: '4-6',
        rest: '3-5 minutes',
        focus: 'Maximal velocity mechanics'
      },
      {
        drill: 'Resisted Sprints (Sled)',
        distance: '10-20 meters',
        sets: '4-6',
        load: '10-20% body weight',
        rest: '2-3 minutes',
        focus: 'Power and acceleration'
      },
      {
        drill: 'Assisted Sprints (Downhill/Band)',
        distance: '20-30 meters',
        sets: '3-4',
        rest: '3-5 minutes',
        focus: 'Overspeed training, leg turnover'
      }
    ];
    
    // Change of direction
    work.changeOfDirection = [
      {
        drill: 'Pro Agility (5-10-5)',
        sets: '4-6',
        rest: '2-3 minutes',
        focus: 'Quick direction changes, body control'
      },
      {
        drill: 'L-Drill (3-Cone)',
        sets: '4-6',
        rest: '2-3 minutes',
        focus: 'Multi-directional speed'
      },
      {
        drill: 'T-Drill',
        sets: '4-6',
        rest: '2-3 minutes',
        focus: 'Lateral movement, backpedaling'
      },
      {
        drill: 'Reactive Agility (Coach Signal)',
        sets: '6-8',
        rest: '90 seconds',
        focus: 'Decision-making under fatigue'
      }
    ];
    
    // Sport-specific recommendations
    if (sport.includes('basketball') || sport.includes('volleyball')) {
      work.sportSpecific = [
        'Vertical jump training',
        'Lateral shuffle drills',
        'Defensive slide work',
        'Jump-stop and pivot drills'
      ];
    } else if (sport.includes('football') || sport.includes('soccer')) {
      work.sportSpecific = [
        'Multi-directional sprints',
        'Cutting and planting drills',
        'Backpedal to sprint transitions',
        'Position-specific movement patterns'
      ];
    } else if (sport.includes('baseball') || sport.includes('softball')) {
      work.sportSpecific = [
        'First-step quickness drills',
        'Base-running acceleration',
        'Rotational power work',
        'Lateral movement for fielding'
      ];
    } else {
      work.sportSpecific = [
        'Analyze movement demands of your sport',
        'Practice sport-specific movement patterns',
        'Incorporate reactive elements',
        'Train in multiple planes of motion'
      ];
    }
    
    work.guidelines = [
      'Perform speed work when fresh (early in session or separate session)',
      'Focus on quality over quantity - full recovery between reps',
      'Use 1:10-1:20 work-to-rest ratio (e.g., 5 sec sprint = 50-100 sec rest)',
      'Perform 2-3 speed sessions per week',
      'Reduce volume during in-season',
      'Monitor for signs of overtraining or injury'
    ];
    
    return work;
  }
  
  /**
   * Generate strength programming
   */
  private static generateStrengthProgramming(client: any, context: TemplateContext): any {
    const seasonPhase = (client.seasonPhase || 'off-season').toLowerCase();
    
    const programming: any = {
      primaryLifts: [],
      accessoryLifts: [],
      guidelines: []
    };
    
    // Adjust intensity based on phase
    let intensity = '80-90% 1RM';
    let sets = '4-5';
    let reps = '3-6';
    
    if (seasonPhase.includes('in') || seasonPhase.includes('competition')) {
      intensity = '75-85% 1RM';
      sets = '2-3';
      reps = '3-5';
    }
    
    // Primary lifts
    programming.primaryLifts = [
      {
        exercise: 'Back Squat',
        sets: sets,
        reps: reps,
        intensity: intensity,
        rest: '3-5 minutes',
        notes: 'Primary lower body strength builder'
      },
      {
        exercise: 'Deadlift or Trap Bar Deadlift',
        sets: sets,
        reps: '2-5',
        intensity: intensity,
        rest: '3-5 minutes',
        notes: 'Posterior chain development'
      },
      {
        exercise: 'Bench Press',
        sets: sets,
        reps: reps,
        intensity: intensity,
        rest: '3-5 minutes',
        notes: 'Primary upper body push'
      },
      {
        exercise: 'Front Squat',
        sets: '3-4',
        reps: '3-6',
        intensity: '75-85% 1RM',
        rest: '2-3 minutes',
        notes: 'Quad emphasis, core stability'
      }
    ];
    
    // Accessory lifts
    programming.accessoryLifts = [
      {
        exercise: 'Romanian Deadlift',
        sets: '3-4',
        reps: '6-8',
        notes: 'Hamstring and glute development'
      },
      {
        exercise: 'Bulgarian Split Squat',
        sets: '3',
        reps: '6-8 per leg',
        notes: 'Single leg strength, balance'
      },
      {
        exercise: 'Weighted Pull-ups',
        sets: '3-4',
        reps: '4-8',
        notes: 'Back and grip strength'
      },
      {
        exercise: 'Overhead Press',
        sets: '3-4',
        reps: '5-8',
        notes: 'Shoulder strength and stability'
      },
      {
        exercise: 'Single-leg RDL',
        sets: '3',
        reps: '8-10 per leg',
        notes: 'Hamstring, balance, injury prevention'
      }
    ];
    
    programming.guidelines = [
      'Emphasize strength in off-season and early pre-season',
      'Use 80-95% 1RM for primary lifts during strength phases',
      'Rest 3-5 minutes between sets of primary lifts',
      'Focus on perfect technique - quality over quantity',
      'Track loads and progress systematically',
      'Deload every 3-4 weeks (reduce volume 40-50%)',
      'Reduce volume and frequency during in-season',
      'Maintain strength with 1-2 sessions per week in-season'
    ];
    
    return programming;
  }
  
  /**
   * Generate conditioning protocols
   */
  private static generateConditioningProtocols(client: any, context: TemplateContext): any {
    const sport = (client.sport || 'general').toLowerCase();
    const seasonPhase = (client.seasonPhase || 'off-season').toLowerCase();
    
    const protocols: any = {
      anaerobicCapacity: [],
      aerobicBase: [],
      sportSpecific: [],
      energySystems: {}
    };
    
    // Anaerobic capacity work
    protocols.anaerobicCapacity = [
      {
        protocol: 'High-Intensity Intervals',
        workDuration: '20-40 seconds',
        restDuration: '1-2 minutes',
        sets: '6-10',
        intensity: '90-95% max effort',
        frequency: '2x per week',
        notes: 'Develops lactate tolerance and repeat sprint ability'
      },
      {
        protocol: 'Repeated Sprints',
        workDuration: '10-15 seconds',
        restDuration: '45-60 seconds',
        sets: '8-12',
        intensity: 'Maximal',
        frequency: '1-2x per week',
        notes: 'Sport-specific conditioning for intermittent sports'
      }
    ];
    
    // Aerobic base
    protocols.aerobicBase = [
      {
        protocol: 'Steady-State Cardio',
        duration: '20-40 minutes',
        intensity: 'Conversational pace (60-70% max HR)',
        frequency: '1-2x per week in off-season',
        notes: 'Builds aerobic base, aids recovery'
      },
      {
        protocol: 'Tempo Runs',
        duration: '15-25 minutes',
        intensity: 'Moderate (70-80% max HR)',
        frequency: '1x per week',
        notes: 'Improves lactate threshold'
      }
    ];
    
    // Sport-specific conditioning
    if (sport.includes('basketball') || sport.includes('soccer') || sport.includes('hockey')) {
      protocols.sportSpecific = [
        'Repeated sprint ability (RSA) training',
        'Small-sided games',
        'Position-specific conditioning drills',
        'Interval work matching game demands (e.g., 30 sec work, 30 sec rest)'
      ];
    } else if (sport.includes('football')) {
      protocols.sportSpecific = [
        'Position-specific work-to-rest ratios',
        'Linemen: 5-10 sec work, 25-40 sec rest',
        'Skill positions: 10-20 sec work, 40-60 sec rest',
        'Conditioning drills mimicking play structure'
      ];
    } else if (sport.includes('baseball') || sport.includes('softball')) {
      protocols.sportSpecific = [
        'Alactic power (short sprints, full recovery)',
        'Minimal aerobic work needed',
        'Focus on explosive movements',
        'Position-specific conditioning'
      ];
    } else {
      protocols.sportSpecific = [
        'Analyze energy system demands of your sport',
        'Match conditioning to sport-specific work-to-rest ratios',
        'Prioritize quality over volume',
        'Integrate conditioning with skill work when possible'
      ];
    }
    
    // Energy systems overview
    protocols.energySystems = {
      phosphagen: {
        duration: '0-10 seconds',
        training: 'Maximal sprints, jumps, throws',
        recovery: 'Full recovery (3-5 minutes)',
        sportExamples: 'Single play, jump, throw'
      },
      glycolytic: {
        duration: '10-120 seconds',
        training: 'Repeated sprints, high-intensity intervals',
        recovery: 'Incomplete recovery (1-3 minutes)',
        sportExamples: 'Sustained effort, multiple plays'
      },
      oxidative: {
        duration: '>120 seconds',
        training: 'Tempo runs, steady-state cardio',
        recovery: 'Continuous or short rest intervals',
        sportExamples: 'Endurance sports, recovery between efforts'
      }
    };
    
    return protocols;
  }
  
  /**
   * Generate recovery strategies
   */
  private static generateRecoveryStrategies(client: any, context: TemplateContext): any {
    const strategies: any = {
      daily: [],
      weekly: [],
      monthly: [],
      monitoring: []
    };
    
    // Daily recovery
    strategies.daily = [
      'Sleep 8-10 hours per night (athletes need more than general population)',
      'Hydration: 0.5-1 oz per lb bodyweight (more on training days)',
      'Nutrition: High protein (1.2-2.0 g/lb), adequate carbs for training',
      'Post-workout nutrition within 30-60 minutes',
      'Active recovery: Light movement, walking',
      'Foam rolling and mobility work (10-15 minutes)'
    ];
    
    // Weekly recovery
    strategies.weekly = [
      '1-2 complete rest days (no training)',
      'Active recovery sessions (swimming, cycling, yoga)',
      'Massage or manual therapy if available',
      'Contrast therapy (hot/cold) for soreness',
      'Adequate sleep on rest days',
      'Social and mental recovery time'
    ];
    
    // Monthly recovery
    strategies.monthly = [
      'Deload week every 3-4 weeks (reduce volume 40-50%)',
      'Massage or bodywork session',
      'Assessment and program adjustment',
      'Address any nagging injuries or pain',
      'Mental break from intense training'
    ];
    
    // Monitoring
    strategies.monitoring = {
      trackDaily: [
        'Sleep quality and duration (aim for 8-10 hours)',
        'Muscle soreness (1-10 scale)',
        'Mood and motivation',
        'Resting heart rate (elevated = poor recovery)',
        'Appetite and digestion'
      ],
      trackWeekly: [
        'Body weight (track trends, not daily fluctuations)',
        'Training volume and intensity',
        'Subjective wellness questionnaire',
        'Performance in key lifts or drills'
      ],
      testMonthly: [
        'Vertical jump or broad jump',
        'Sprint times (10m, 20m, 40m)',
        'Strength benchmarks (1RM or 3RM)',
        'Sport-specific assessments'
      ],
      warningSigns: [
        'Persistent fatigue despite rest',
        'Decreased performance',
        'Elevated resting heart rate',
        'Mood changes or irritability',
        'Frequent illness',
        'Persistent muscle soreness',
        'Loss of appetite',
        'Sleep disturbances'
      ]
    };
    
    return strategies;
  }
}
