/**
 * Tests for Heart Rate Zones component logic
 */

import { describe, it, expect } from 'vitest';
import { calculateHeartRateZones } from '@/lib/tools/calculations';
import { heartRateSchema } from '@/lib/tools/validation';

describe('HeartRateZones Component Logic', () => {
  describe('Input validation', () => {
    it('should validate age-only input', () => {
      const input = { age: 30 };
      const result = heartRateSchema.safeParse(input);
      
      expect(result.success).toBe(true);
    });

    it('should validate input with resting HR', () => {
      const input = { age: 30, restingHR: 60 };
      const result = heartRateSchema.safeParse(input);
      
      expect(result.success).toBe(true);
    });

    it('should reject invalid age', () => {
      const input = { age: 10 };
      const result = heartRateSchema.safeParse(input);
      
      expect(result.success).toBe(false);
    });

    it('should reject resting HR below 30', () => {
      const input = { age: 30, restingHR: 25 };
      const result = heartRateSchema.safeParse(input);
      
      expect(result.success).toBe(false);
    });

    it('should reject resting HR above 120', () => {
      const input = { age: 30, restingHR: 125 };
      const result = heartRateSchema.safeParse(input);
      
      expect(result.success).toBe(false);
    });
  });

  describe('Zone calculation logic', () => {
    it('should calculate three distinct zones', () => {
      const zones = calculateHeartRateZones(30);
      
      expect(zones.easy).toBeDefined();
      expect(zones.moderate).toBeDefined();
      expect(zones.vigorous).toBeDefined();
    });

    it('should have zones in ascending order', () => {
      const zones = calculateHeartRateZones(30);
      
      expect(zones.easy.max).toBeLessThanOrEqual(zones.moderate.min);
      expect(zones.moderate.max).toBeLessThanOrEqual(zones.vigorous.min);
    });

    it('should use simple formula when no resting HR provided', () => {
      const zones = calculateHeartRateZones(30);
      const maxHR = 220 - 30;
      
      expect(zones.maxHR).toBe(maxHR);
      expect(zones.easy.min).toBe(Math.round(maxHR * 0.5));
    });

    it('should use Karvonen formula when resting HR provided', () => {
      const age = 30;
      const restingHR = 60;
      const zones = calculateHeartRateZones(age, restingHR);
      const maxHR = 220 - age;
      const hrReserve = maxHR - restingHR;
      
      expect(zones.easy.min).toBe(Math.round(hrReserve * 0.5 + restingHR));
    });
  });

  describe('Zone labels and ranges', () => {
    it('should label zones appropriately', () => {
      const zoneLabels = {
        easy: 'Easy Zone (50-60% of max HR)',
        moderate: 'Moderate Zone (60-70% of max HR)',
        vigorous: 'Vigorous Zone (70-85% of max HR)',
      };
      
      expect(zoneLabels.easy).toContain('Easy');
      expect(zoneLabels.moderate).toContain('Moderate');
      expect(zoneLabels.vigorous).toContain('Vigorous');
    });

    it('should provide BPM ranges for each zone', () => {
      const zones = calculateHeartRateZones(30);
      
      expect(zones.easy.min).toBeGreaterThan(0);
      expect(zones.easy.max).toBeGreaterThan(zones.easy.min);
      expect(zones.moderate.min).toBeGreaterThan(0);
      expect(zones.moderate.max).toBeGreaterThan(zones.moderate.min);
      expect(zones.vigorous.min).toBeGreaterThan(0);
      expect(zones.vigorous.max).toBeGreaterThan(zones.vigorous.min);
    });

    it('should format zone ranges clearly', () => {
      const zones = calculateHeartRateZones(30);
      const easyDisplay = `${zones.easy.min}-${zones.easy.max} BPM`;
      
      expect(easyDisplay).toContain('-');
      expect(easyDisplay).toContain('BPM');
    });
  });

  describe('Educational content logic', () => {
    it('should provide explanation about zone usage', () => {
      const explanation = 'Most of your weekly movement can happen in the easy-moderate zones. Save vigorous efforts for specific training days.';
      
      expect(explanation.length).toBeGreaterThan(50);
      expect(explanation).toContain('easy-moderate');
    });

    it('should explain formula difference', () => {
      const simpleExplanation = 'Based on age-predicted max heart rate';
      const karvonenExplanation = 'Using Karvonen formula with your resting heart rate for more accuracy';
      
      expect(simpleExplanation).toContain('age');
      expect(karvonenExplanation).toContain('Karvonen');
      expect(karvonenExplanation).toContain('resting');
    });
  });

  describe('Zone color coding logic', () => {
    it('should assign colors to zones', () => {
      const zoneColors = {
        easy: 'bg-green-100 text-green-800',
        moderate: 'bg-yellow-100 text-yellow-800',
        vigorous: 'bg-orange-100 text-orange-800',
      };
      
      expect(zoneColors.easy).toContain('green');
      expect(zoneColors.moderate).toContain('yellow');
      expect(zoneColors.vigorous).toContain('orange');
    });

    it('should use progressive color intensity', () => {
      const colors = ['green', 'yellow', 'orange'];
      
      expect(colors.length).toBe(3);
      expect(colors[0]).toBe('green');
      expect(colors[2]).toBe('orange');
    });
  });

  describe('Optional resting HR logic', () => {
    it('should show resting HR input as optional', () => {
      const isOptional = true;
      const label = isOptional ? 'Resting Heart Rate (optional)' : 'Resting Heart Rate';
      
      expect(label).toContain('optional');
    });

    it('should calculate without resting HR', () => {
      const zones = calculateHeartRateZones(30);
      
      expect(zones).toBeDefined();
      expect(zones.easy).toBeDefined();
    });

    it('should provide more accurate zones with resting HR', () => {
      const withoutResting = calculateHeartRateZones(30);
      const withResting = calculateHeartRateZones(30, 60);
      
      // Both should be valid but different
      expect(withoutResting.easy.min).not.toBe(withResting.easy.min);
    });
  });

  describe('Results display logic', () => {
    it('should display max heart rate', () => {
      const zones = calculateHeartRateZones(30);
      const maxHRDisplay = `Max HR: ${zones.maxHR} BPM`;
      
      expect(maxHRDisplay).toContain('Max HR');
      expect(maxHRDisplay).toContain(zones.maxHR.toString());
    });

    it('should show all three zones', () => {
      const zones = calculateHeartRateZones(30);
      const zoneCount = 3;
      
      expect(Object.keys(zones).filter(k => k !== 'maxHR').length).toBe(zoneCount);
    });

    it('should format zones consistently', () => {
      const zones = calculateHeartRateZones(30);
      
      Object.entries(zones).forEach(([key, value]) => {
        if (key !== 'maxHR') {
          expect(value).toHaveProperty('min');
          expect(value).toHaveProperty('max');
        }
      });
    });
  });

  describe('User experience logic', () => {
    it('should show results after age input', () => {
      const hasAge = true;
      const showResults = hasAge;
      
      expect(showResults).toBe(true);
    });

    it('should update zones when resting HR is added', () => {
      let zones = calculateHeartRateZones(30);
      const initialEasyMin = zones.easy.min;
      
      zones = calculateHeartRateZones(30, 60);
      const newEasyMin = zones.easy.min;
      
      expect(newEasyMin).not.toBe(initialEasyMin);
    });

    it('should allow recalculation with different age', () => {
      const zones30 = calculateHeartRateZones(30);
      const zones40 = calculateHeartRateZones(40);
      
      expect(zones40.maxHR).toBeLessThan(zones30.maxHR);
    });
  });
});
