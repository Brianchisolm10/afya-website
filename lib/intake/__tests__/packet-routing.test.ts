/**
 * Packet Routing Logic Tests
 * 
 * Tests for determining which packets should be generated based on client type
 */

import { describe, test, expect } from 'vitest';
import { PacketRoutingService } from '../packet-routing-service';
import { IntakeResponses } from '@/types/intake';

describe('PacketRoutingService', () => {
  describe('determineRequiredPackets', () => {
    test('routes NUTRITION_ONLY to nutrition packet', () => {
      const responses: IntakeResponses = {};
      const packets = PacketRoutingService.determineRequiredPackets('NUTRITION_ONLY', responses);
      
      expect(packets).toEqual(['NUTRITION']);
    });
    
    test('routes WORKOUT_ONLY to workout packet', () => {
      const responses: IntakeResponses = {};
      const packets = PacketRoutingService.determineRequiredPackets('WORKOUT_ONLY', responses);
      
      expect(packets).toEqual(['WORKOUT']);
    });
    
    test('routes FULL_PROGRAM to both nutrition and workout packets', () => {
      const responses: IntakeResponses = {};
      const packets = PacketRoutingService.determineRequiredPackets('FULL_PROGRAM', responses);
      
      expect(packets).toContain('NUTRITION');
      expect(packets).toContain('WORKOUT');
      expect(packets).toHaveLength(2);
    });
    
    test('routes ATHLETE_PERFORMANCE to performance packet', () => {
      const responses: IntakeResponses = {
        'include-nutrition': 'no'
      };
      const packets = PacketRoutingService.determineRequiredPackets('ATHLETE_PERFORMANCE', responses);
      
      expect(packets).toContain('PERFORMANCE');
      expect(packets).not.toContain('NUTRITION');
    });
    
    test('routes ATHLETE_PERFORMANCE with nutrition option', () => {
      const responses: IntakeResponses = {
        'include-nutrition': 'yes'
      };
      const packets = PacketRoutingService.determineRequiredPackets('ATHLETE_PERFORMANCE', responses);
      
      expect(packets).toContain('PERFORMANCE');
      expect(packets).toContain('NUTRITION');
    });
    
    test('routes YOUTH to youth packet', () => {
      const responses: IntakeResponses = {};
      const packets = PacketRoutingService.determineRequiredPackets('YOUTH', responses);
      
      expect(packets).toEqual(['YOUTH']);
    });
    
    test('routes GENERAL_WELLNESS to wellness packet', () => {
      const responses: IntakeResponses = {
        'wellness-focus': ['sleep', 'stress']
      };
      const packets = PacketRoutingService.determineRequiredPackets('GENERAL_WELLNESS', responses);
      
      expect(packets).toContain('WELLNESS');
    });
    
    test('routes GENERAL_WELLNESS with strength focus to include workout', () => {
      const responses: IntakeResponses = {
        'wellness-focus': ['strength', 'mobility']
      };
      const packets = PacketRoutingService.determineRequiredPackets('GENERAL_WELLNESS', responses);
      
      expect(packets).toContain('WELLNESS');
      expect(packets).toContain('WORKOUT');
    });
    
    test('routes GENERAL_WELLNESS with weight focus to include nutrition', () => {
      const responses: IntakeResponses = {
        'wellness-focus': ['weight', 'energy']
      };
      const packets = PacketRoutingService.determineRequiredPackets('GENERAL_WELLNESS', responses);
      
      expect(packets).toContain('WELLNESS');
      expect(packets).toContain('NUTRITION');
    });
    
    test('routes GENERAL_WELLNESS with multiple focuses', () => {
      const responses: IntakeResponses = {
        'wellness-focus': ['strength', 'weight', 'energy']
      };
      const packets = PacketRoutingService.determineRequiredPackets('GENERAL_WELLNESS', responses);
      
      expect(packets).toContain('WELLNESS');
      expect(packets).toContain('WORKOUT');
      expect(packets).toContain('NUTRITION');
    });
    
    test('routes SPECIAL_SITUATION to recovery packet', () => {
      const responses: IntakeResponses = {
        'recovery-goals': 'improve mobility'
      };
      const packets = PacketRoutingService.determineRequiredPackets('SPECIAL_SITUATION', responses);
      
      expect(packets).toContain('RECOVERY');
      expect(packets).not.toContain('NUTRITION');
    });
    
    test('routes SPECIAL_SITUATION with nutrition in goals', () => {
      const responses: IntakeResponses = {
        'recovery-goals': 'improve nutrition and reduce inflammation'
      };
      const packets = PacketRoutingService.determineRequiredPackets('SPECIAL_SITUATION', responses);
      
      expect(packets).toContain('RECOVERY');
      expect(packets).toContain('NUTRITION');
    });
    
    test('handles unknown client type with intro packet', () => {
      const responses: IntakeResponses = {};
      const packets = PacketRoutingService.determineRequiredPackets('UNKNOWN' as any, responses);
      
      expect(packets).toContain('INTRO');
    });
  });
  
  describe('packet routing edge cases', () => {
    test('handles empty responses object', () => {
      const responses: IntakeResponses = {};
      const packets = PacketRoutingService.determineRequiredPackets('NUTRITION_ONLY', responses);
      
      expect(packets).toHaveLength(1);
      expect(packets[0]).toBe('NUTRITION');
    });
    
    test('handles wellness focus as string instead of array', () => {
      const responses: IntakeResponses = {
        'wellness-focus': 'strength'
      };
      const packets = PacketRoutingService.determineRequiredPackets('GENERAL_WELLNESS', responses);
      
      expect(packets).toContain('WELLNESS');
      // Should not crash, but may not include workout since it's not an array
    });
    
    test('handles recovery goals with mixed case', () => {
      const responses: IntakeResponses = {
        'recovery-goals': 'Improve NUTRITION and Mobility'
      };
      const packets = PacketRoutingService.determineRequiredPackets('SPECIAL_SITUATION', responses);
      
      expect(packets).toContain('RECOVERY');
      expect(packets).toContain('NUTRITION');
    });
    
    test('ensures no duplicate packets', () => {
      const responses: IntakeResponses = {
        'wellness-focus': ['strength', 'endurance', 'mobility']
      };
      const packets = PacketRoutingService.determineRequiredPackets('GENERAL_WELLNESS', responses);
      
      // Should only have one WORKOUT packet even though multiple fitness focuses
      const workoutCount = packets.filter(p => p === 'WORKOUT').length;
      expect(workoutCount).toBeLessThanOrEqual(1);
    });
  });
  
  describe('packet type combinations', () => {
    test('FULL_PROGRAM always includes both packets', () => {
      const responses: IntakeResponses = {};
      const packets = PacketRoutingService.determineRequiredPackets('FULL_PROGRAM', responses);
      
      expect(packets).toHaveLength(2);
      expect(new Set(packets).size).toBe(2); // No duplicates
    });
    
    test('ATHLETE_PERFORMANCE can have 1 or 2 packets', () => {
      const withoutNutrition = PacketRoutingService.determineRequiredPackets(
        'ATHLETE_PERFORMANCE',
        { 'include-nutrition': 'no' }
      );
      
      const withNutrition = PacketRoutingService.determineRequiredPackets(
        'ATHLETE_PERFORMANCE',
        { 'include-nutrition': 'yes' }
      );
      
      expect(withoutNutrition).toHaveLength(1);
      expect(withNutrition).toHaveLength(2);
    });
    
    test('GENERAL_WELLNESS can have 1-3 packets', () => {
      const minimal = PacketRoutingService.determineRequiredPackets(
        'GENERAL_WELLNESS',
        { 'wellness-focus': ['sleep'] }
      );
      
      const withWorkout = PacketRoutingService.determineRequiredPackets(
        'GENERAL_WELLNESS',
        { 'wellness-focus': ['strength'] }
      );
      
      const withBoth = PacketRoutingService.determineRequiredPackets(
        'GENERAL_WELLNESS',
        { 'wellness-focus': ['strength', 'weight'] }
      );
      
      expect(minimal.length).toBeGreaterThanOrEqual(1);
      expect(withWorkout.length).toBeGreaterThanOrEqual(2);
      expect(withBoth.length).toBeGreaterThanOrEqual(3);
    });
  });
});
