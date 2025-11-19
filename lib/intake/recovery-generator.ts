/**
 * Recovery Packet Generation Logic
 * 
 * Implements safe, progressive return-to-activity programming
 * for clients with injuries or special conditions.
 */

import { PopulatedContent, TemplateContext } from '@/types/intake';

export class RecoveryGenerator {
  /**
   * Enhance recovery packet with condition-specific guidance
   */
  static enhanceRecoveryContent(
    content: PopulatedContent,
    client: any,
    context: TemplateContext
  ): PopulatedContent {
    const enhanced = { ...content };
    
    // Add condition assessment
    enhanced.conditionAssessment = this.generateConditionAssessment(client, context);
    
    // Add safe exercises
    enhanced.safeExercises = this.generateSafeExercises(client, context);
    
    // Add exercises to avoid
    enhanced.avoidExercises = this.generateAvoidList(client, context);
    
    // Add progressive return protocol
    enhanced.returnProtocol = this.generateReturnProtocol(client, context);
    
    // Add pain management strategies
    enhanced.painManagement = this.generatePainManagement(client, context);
    
    // Add monitoring guidelines
    enhanced.monitoring = this.generateMonitoringGuidelines(client, context);
    
    return enhanced;
  }
  
  /**
   * Generate condition assessment summary
   */
  private static generateConditionAssessment(client: any, context: TemplateContext): any {
    const assessment: any = {
      summary: {},
      limitations: [],
      clearance: '',
      goals: []
    };
    
    assessment.summary = {
      injuryLocation: client.injuryLocation || 'Not specified',
      painPatterns: client.painPatterns || 'Not specified',
      aggravatingPositions: client.aggravatingPositions || 'Not specified',
      mobilityLimitations: client.mobilityLimitations || 'Not specified',
      medicalClearance: client.medicalClearance ? 'Yes' : 'No - Seek clearance before starting'
    };
    
    // Identify key limitations
    const location = (client.injuryLocation || '').toLowerCase();
    const pain = (client.painPatterns || '').toLowerCase();
    const aggravating = (client.aggravatingPositions || '').toLowerCase();
    
    if (location.includes('back') || location.includes('spine')) {
      assessment.limitations = [
        'Avoid heavy spinal loading',
        'Limit flexion/extension under load',
        'Focus on neutral spine positions',
        'Build core stability progressively'
      ];
    } else if (location.includes('shoulder')) {
      assessment.limitations = [
        'Avoid overhead movements initially',
        'Limit horizontal pressing if painful',
        'Focus on scapular stability',
        'Progress range of motion gradually'
      ];
    } else if (location.includes('knee')) {
      assessment.limitations = [
        'Avoid deep knee flexion initially',
        'Limit impact activities',
        'Focus on quad and glute strength',
        'Progress loading gradually'
      ];
    } else if (location.includes('hip')) {
      assessment.limitations = [
        'Avoid deep hip flexion if painful',
        'Limit rotational stress',
        'Focus on hip stability',
        'Progress range of motion carefully'
      ];
    } else if (location.includes('ankle') || location.includes('foot')) {
      assessment.limitations = [
        'Avoid high-impact activities initially',
        'Focus on ankle stability',
        'Progress weight-bearing gradually',
        'Build calf and foot strength'
      ];
    } else {
      assessment.limitations = [
        'Avoid movements that cause pain',
        'Start with pain-free range of motion',
        'Progress slowly and systematically',
        'Listen to your body'
      ];
    }
    
    // Medical clearance note
    if (client.medicalClearance) {
      assessment.clearance = 'You have medical clearance to begin exercise. Follow the progressive protocol and stop if pain increases.';
    } else {
      assessment.clearance = '⚠️ IMPORTANT: You have not indicated medical clearance. Please consult with your healthcare provider before starting this program. This program is for general guidance only and does not replace medical advice.';
    }
    
    // Recovery goals
    assessment.goals = [
      'Reduce pain and discomfort',
      'Restore pain-free range of motion',
      'Build strength in affected area',
      'Return to normal activities safely',
      'Prevent re-injury'
    ];
    
    return assessment;
  }
  
  /**
   * Generate safe exercises based on condition
   */
  private static generateSafeExercises(client: any, context: TemplateContext): any {
    const location = (client.injuryLocation || '').toLowerCase();
    
    const exercises: any = {
      mobility: [],
      strengthening: [],
      functional: [],
      guidelines: []
    };
    
    // Mobility work (always start here)
    exercises.mobility = [
      {
        name: 'Pain-Free Range of Motion',
        sets: '2-3',
        reps: '10-15',
        frequency: 'Daily',
        notes: 'Move through available range without pain. Gradually increase over time.'
      },
      {
        name: 'Gentle Stretching',
        sets: '2-3',
        duration: '20-30 seconds',
        frequency: 'Daily',
        notes: 'Hold stretches gently. Should feel mild tension, not pain.'
      },
      {
        name: 'Walking',
        duration: '10-20 minutes',
        frequency: 'Daily',
        notes: 'Start short, gradually increase. Excellent for general recovery.'
      }
    ];
    
    // Condition-specific strengthening
    if (location.includes('back') || location.includes('spine')) {
      exercises.strengthening = [
        {
          name: 'Dead Bug',
          sets: '2-3',
          reps: '8-10 each side',
          notes: 'Core stability without spinal movement'
        },
        {
          name: 'Bird Dog',
          sets: '2-3',
          reps: '8-10 each side',
          notes: 'Build back stability and coordination'
        },
        {
          name: 'Glute Bridges',
          sets: '2-3',
          reps: '10-15',
          notes: 'Strengthen glutes and posterior chain'
        },
        {
          name: 'Wall Sits',
          sets: '2-3',
          duration: '20-30 seconds',
          notes: 'Build leg strength without spinal load'
        },
        {
          name: 'Planks (Modified)',
          sets: '2-3',
          duration: '15-30 seconds',
          notes: 'Start on knees if needed. Build core endurance.'
        }
      ];
    } else if (location.includes('shoulder')) {
      exercises.strengthening = [
        {
          name: 'Scapular Wall Slides',
          sets: '2-3',
          reps: '10-12',
          notes: 'Improve scapular mobility and control'
        },
        {
          name: 'Band Pull-Aparts',
          sets: '2-3',
          reps: '12-15',
          notes: 'Strengthen upper back and rear delts'
        },
        {
          name: 'External Rotations (Light Band)',
          sets: '2-3',
          reps: '12-15',
          notes: 'Strengthen rotator cuff'
        },
        {
          name: 'Wall Push-Ups',
          sets: '2-3',
          reps: '10-12',
          notes: 'Build pressing strength with reduced load'
        },
        {
          name: 'Isometric Holds',
          sets: '2-3',
          duration: '10-20 seconds',
          notes: 'Build strength without movement'
        }
      ];
    } else if (location.includes('knee')) {
      exercises.strengthening = [
        {
          name: 'Quad Sets',
          sets: '2-3',
          reps: '15-20',
          notes: 'Tighten quad muscle, hold 5 seconds'
        },
        {
          name: 'Straight Leg Raises',
          sets: '2-3',
          reps: '10-15',
          notes: 'Build quad strength without knee bend'
        },
        {
          name: 'Wall Sits',
          sets: '2-3',
          duration: '20-30 seconds',
          notes: 'Isometric quad and glute strength'
        },
        {
          name: 'Glute Bridges',
          sets: '2-3',
          reps: '12-15',
          notes: 'Strengthen glutes and hamstrings'
        },
        {
          name: 'Mini Squats (Partial Range)',
          sets: '2-3',
          reps: '10-12',
          notes: 'Start shallow, gradually increase depth'
        }
      ];
    } else if (location.includes('hip')) {
      exercises.strengthening = [
        {
          name: 'Clamshells',
          sets: '2-3',
          reps: '12-15',
          notes: 'Strengthen hip abductors'
        },
        {
          name: 'Hip Bridges',
          sets: '2-3',
          reps: '12-15',
          notes: 'Build glute and hip strength'
        },
        {
          name: 'Side-Lying Leg Lifts',
          sets: '2-3',
          reps: '10-12',
          notes: 'Strengthen hip abductors'
        },
        {
          name: 'Standing Hip Flexion',
          sets: '2-3',
          reps: '10-12',
          notes: 'Build hip flexor strength'
        },
        {
          name: 'Seated Hip External Rotation',
          sets: '2-3',
          reps: '10-12',
          notes: 'Improve hip mobility and strength'
        }
      ];
    } else {
      // General safe exercises
      exercises.strengthening = [
        {
          name: 'Isometric Holds',
          sets: '2-3',
          duration: '10-20 seconds',
          notes: 'Build strength without movement'
        },
        {
          name: 'Light Resistance Band Work',
          sets: '2-3',
          reps: '12-15',
          notes: 'Low-load strengthening'
        },
        {
          name: 'Bodyweight Exercises (Modified)',
          sets: '2-3',
          reps: '10-12',
          notes: 'Reduce range or intensity as needed'
        }
      ];
    }
    
    // Functional exercises (progress to these)
    exercises.functional = [
      {
        name: 'Sit-to-Stand',
        sets: '2-3',
        reps: '10-12',
        notes: 'Practice daily movement pattern'
      },
      {
        name: 'Step-Ups (Low Step)',
        sets: '2-3',
        reps: '8-10 each leg',
        notes: 'Build single-leg strength'
      },
      {
        name: 'Balance Exercises',
        sets: '2-3',
        duration: '30 seconds each leg',
        notes: 'Improve stability and proprioception'
      },
      {
        name: 'Farmer Carries (Light Weight)',
        sets: '2-3',
        distance: '20-30 feet',
        notes: 'Functional core and grip strength'
      }
    ];
    
    // General guidelines
    exercises.guidelines = [
      'Start with 2 sets, progress to 3 sets over time',
      'Pain should not exceed 3/10 during or after exercise',
      'If pain increases, reduce intensity or stop',
      'Perform exercises 3x per week with rest days between',
      'Progress slowly - increase reps before adding weight',
      'Focus on quality of movement over quantity',
      'Use ice after exercise if recommended by provider'
    ];
    
    return exercises;
  }
  
  /**
   * Generate list of exercises and movements to avoid
   */
  private static generateAvoidList(client: any, context: TemplateContext): any {
    const location = (client.injuryLocation || '').toLowerCase();
    const aggravating = (client.aggravatingPositions || '').toLowerCase();
    
    const avoidList: any = {
      movements: [],
      positions: [],
      activities: [],
      temporaryRestrictions: []
    };
    
    // Condition-specific restrictions
    if (location.includes('back') || location.includes('spine')) {
      avoidList.movements = [
        'Heavy deadlifts or squats',
        'Loaded spinal flexion (bent-over rows)',
        'Loaded spinal extension (back extensions with weight)',
        'Heavy overhead pressing',
        'Sit-ups or crunches (if painful)',
        'Twisting under load'
      ];
      avoidList.positions = [
        'Prolonged sitting or standing',
        'Slouched postures',
        'Extreme flexion or extension',
        'Positions that increase pain'
      ];
    } else if (location.includes('shoulder')) {
      avoidList.movements = [
        'Overhead pressing (initially)',
        'Behind-the-neck movements',
        'Heavy bench pressing',
        'Dips (if painful)',
        'Pull-ups (if painful)',
        'Throwing motions (initially)'
      ];
      avoidList.positions = [
        'Extreme overhead positions',
        'Internal rotation under load',
        'Positions that cause impingement',
        'Sleeping on affected shoulder'
      ];
    } else if (location.includes('knee')) {
      avoidList.movements = [
        'Deep squats (below parallel)',
        'Lunges with deep knee bend',
        'Running or jumping (initially)',
        'Leg extensions (if painful)',
        'Kneeling positions',
        'Pivoting or twisting on affected leg'
      ];
      avoidList.positions = [
        'Prolonged kneeling',
        'Deep knee flexion',
        'Positions that increase pain',
        'Uneven surfaces initially'
      ];
    } else if (location.includes('hip')) {
      avoidList.movements = [
        'Deep squats',
        'Heavy deadlifts',
        'Running (initially)',
        'Jumping or plyometrics',
        'Extreme hip flexion',
        'Loaded hip rotation'
      ];
      avoidList.positions = [
        'Deep hip flexion (sitting low)',
        'Cross-legged sitting',
        'Positions that cause pinching',
        'Prolonged standing on one leg'
      ];
    } else {
      avoidList.movements = [
        'Any movement that causes sharp pain',
        'High-impact activities',
        'Heavy lifting',
        'Rapid or ballistic movements'
      ];
      avoidList.positions = [
        'Positions that aggravate symptoms',
        'Extreme ranges of motion',
        'Prolonged static positions'
      ];
    }
    
    // Add client-specific aggravating positions
    if (aggravating && aggravating !== 'not specified' && aggravating !== 'none') {
      avoidList.positions.push(`Specifically avoid: ${client.aggravatingPositions}`);
    }
    
    // General activities to avoid
    avoidList.activities = [
      'High-impact sports (initially)',
      'Contact sports until cleared',
      'Activities that caused the injury',
      'Training through sharp or increasing pain',
      'Pushing through "bad" pain (vs. muscle burn)'
    ];
    
    // Temporary restrictions
    avoidList.temporaryRestrictions = [
      'These restrictions are temporary',
      'As you improve, you\'ll gradually reintroduce activities',
      'Follow the progressive return protocol',
      'Get medical clearance before returning to full activity',
      'Some activities may need permanent modifications'
    ];
    
    return avoidList;
  }
  
  /**
   * Generate progressive return-to-activity protocol
   */
  private static generateReturnProtocol(client: any, context: TemplateContext): any {
    const protocol: any = {
      phases: [],
      progressionCriteria: [],
      setbackProtocol: []
    };
    
    protocol.phases = [
      {
        phase: 'Phase 1: Pain-Free Movement (Weeks 1-2)',
        focus: 'Restore range of motion without pain',
        activities: [
          'Gentle range of motion exercises',
          'Light stretching',
          'Walking',
          'Pain-free daily activities'
        ],
        volume: 'Low - focus on quality',
        intensity: 'Very light - no pain',
        progressionCriteria: [
          'No pain increase during or after activity',
          'Improved range of motion',
          'Able to perform daily activities without difficulty'
        ]
      },
      {
        phase: 'Phase 2: Light Strengthening (Weeks 3-4)',
        focus: 'Build basic strength in affected area',
        activities: [
          'Bodyweight exercises (modified)',
          'Light resistance band work',
          'Isometric holds',
          'Continued mobility work'
        ],
        volume: 'Low to moderate',
        intensity: 'Light - pain <3/10',
        progressionCriteria: [
          'Exercises completed pain-free',
          'No flare-ups or setbacks',
          'Improved strength and confidence'
        ]
      },
      {
        phase: 'Phase 3: Moderate Activity (Weeks 5-8)',
        focus: 'Increase load and movement complexity',
        activities: [
          'Progressive resistance training',
          'Functional movements',
          'Light cardio activities',
          'Sport-specific movements (modified)'
        ],
        volume: 'Moderate',
        intensity: 'Moderate - pain <2/10',
        progressionCriteria: [
          'Consistent pain-free training',
          'Improved function in daily activities',
          'Able to perform modified sport movements'
        ]
      },
      {
        phase: 'Phase 4: Return to Activity (Weeks 9-12)',
        focus: 'Gradual return to normal activities',
        activities: [
          'Sport-specific training',
          'Progressive return to previous activities',
          'Continued strengthening',
          'Maintenance exercises'
        ],
        volume: 'Moderate to high',
        intensity: 'Moderate to high - minimal pain',
        progressionCriteria: [
          'Medical clearance obtained',
          'Confidence in movement',
          'Minimal to no pain',
          'Able to perform sport/activity demands'
        ]
      }
    ];
    
    protocol.progressionCriteria = [
      'Spend at least 2 weeks in each phase',
      'Meet all criteria before progressing',
      'Progress is not always linear - some setbacks are normal',
      'If pain increases, return to previous phase',
      'Consult healthcare provider if unsure about progression'
    ];
    
    protocol.setbackProtocol = [
      'If you experience a flare-up or setback:',
      '1. Reduce activity level immediately',
      '2. Return to previous phase that was pain-free',
      '3. Apply ice if recommended (15-20 minutes)',
      '4. Rest for 1-2 days',
      '5. Resume at lower intensity',
      '6. Progress more slowly',
      '7. Consult provider if pain persists >3 days',
      '',
      'Remember: Setbacks are normal and don\'t mean you\'re back to square one'
    ];
    
    return protocol;
  }
  
  /**
   * Generate pain management strategies
   */
  private static generatePainManagement(client: any, context: TemplateContext): any {
    const management: any = {
      painScale: {},
      duringExercise: [],
      afterExercise: [],
      redFlags: []
    };
    
    management.painScale = {
      description: 'Use the 0-10 pain scale to guide your activity',
      scale: [
        '0-2: Minimal pain - Safe to continue',
        '3-4: Moderate discomfort - Proceed with caution, modify if needed',
        '5-6: Significant pain - Stop and rest',
        '7-10: Severe pain - Stop immediately and seek medical attention'
      ],
      guideline: 'During exercise, stay below 3/10. After exercise, some soreness (2-3/10) is normal.'
    };
    
    management.duringExercise = [
      'Monitor pain level throughout exercise',
      'Stay below 3/10 on pain scale',
      'Stop if pain increases during activity',
      'Modify exercises that cause discomfort',
      'Focus on pain-free range of motion',
      'Breathe normally - don\'t hold breath',
      'Move slowly and with control'
    ];
    
    management.afterExercise = [
      'Some muscle soreness (2-3/10) is normal 24-48 hours after exercise',
      'Sharp pain or pain that worsens is not normal',
      'Ice affected area if recommended (15-20 minutes)',
      'Gentle movement can help reduce stiffness',
      'Rest if pain persists >24 hours',
      'Track pain patterns to identify triggers',
      'Adjust next session based on recovery'
    ];
    
    management.redFlags = [
      '🚨 STOP and seek medical attention if you experience:',
      '• Sharp, severe pain',
      '• Numbness or tingling',
      '• Swelling or warmth in affected area',
      '• Loss of function or range of motion',
      '• Pain that worsens over time despite rest',
      '• Pain that radiates or spreads',
      '• Instability or feeling of "giving way"',
      '• Any new or concerning symptoms',
      '',
      'When in doubt, consult your healthcare provider'
    ];
    
    return management;
  }
  
  /**
   * Generate monitoring and tracking guidelines
   */
  private static generateMonitoringGuidelines(client: any, context: TemplateContext): any {
    const monitoring: any = {
      dailyTracking: [],
      weeklyReview: [],
      progressIndicators: [],
      warningSignsOfOverdoing: []
    };
    
    monitoring.dailyTracking = [
      'Track these daily in a journal or app:',
      '• Pain level (0-10 scale) at rest and during activity',
      '• Activities performed',
      '• Any flare-ups or setbacks',
      '• Sleep quality',
      '• Stress levels',
      '• Medications or treatments used',
      '• How you feel overall'
    ];
    
    monitoring.weeklyReview = [
      'Review your week and assess:',
      '• Is pain decreasing over time?',
      '• Are you able to do more activities?',
      '• Is range of motion improving?',
      '• Are you sleeping better?',
      '• Do you feel more confident in movement?',
      '• Have you had any setbacks?',
      '',
      'Adjust your program based on this review'
    ];
    
    monitoring.progressIndicators = [
      'Good signs of progress:',
      '✓ Decreasing pain over time',
      '✓ Improved range of motion',
      '✓ Ability to do more activities',
      '✓ Better sleep quality',
      '✓ Increased confidence in movement',
      '✓ Fewer flare-ups',
      '✓ Improved function in daily activities',
      '✓ Positive mood and motivation'
    ];
    
    monitoring.warningSignsOfOverdoing = [
      'Warning signs you may be doing too much:',
      '⚠️ Increasing pain over time',
      '⚠️ Frequent flare-ups',
      '⚠️ Pain that lasts >24 hours after activity',
      '⚠️ Difficulty with daily activities',
      '⚠️ Poor sleep due to pain',
      '⚠️ Swelling or inflammation',
      '⚠️ Decreased range of motion',
      '⚠️ Feeling discouraged or frustrated',
      '',
      'If you notice these signs, reduce activity and consult your provider'
    ];
    
    return monitoring;
  }
}
