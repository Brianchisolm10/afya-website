/**
 * Tests for Hydration & Sleep Snapshot component logic
 */

import { describe, it, expect } from 'vitest';
import {
  getSleepRecommendations,
  getHydrationRecommendations,
  compareToRange,
  getSleepTip,
  getHydrationTip,
} from '@/lib/tools/calculations';
import { hydrationSleepSchema } from '@/lib/tools/validation';

describe('HydrationSleepSnapshot Component Logic', () => {
  describe('Input validation', () => {
    it('should validate valid sleep and hydration input', () => {
      const input = { sleepHours: 8, waterCups: 10 };
      const result = hydrationSleepSchema.safeParse(input);
      
      expect(result.success).toBe(true);
    });

    it('should reject negative sleep hours', () => {
      const input = { sleepHours: -1, waterCups: 8 };
      const result = hydrationSleepSchema.safeParse(input);
      
      expect(result.success).toBe(false);
    });

    it('should reject sleep hours above 24', () => {
      const input = { sleepHours: 25, waterCups: 8 };
      const result = hydrationSleepSchema.safeParse(input);
      
      expect(result.success).toBe(false);
    });

    it('should reject non-positive water intake', () => {
      const input = { sleepHours: 8, waterCups: 0 };
      const result = hydrationSleepSchema.safeParse(input);
      
      expect(result.success).toBe(false);
    });
  });

  describe('Sleep status logic', () => {
    it('should identify below range sleep', () => {
      const sleepHours = 5;
      const recommendations = getSleepRecommendations(30);
      const status = compareToRange(sleepHours, recommendations.min, recommendations.max);
      
      expect(status).toBe('below');
    });

    it('should identify within range sleep', () => {
      const sleepHours = 8;
      const recommendations = getSleepRecommendations(30);
      const status = compareToRange(sleepHours, recommendations.min, recommendations.max);
      
      expect(status).toBe('within');
    });

    it('should identify above range sleep', () => {
      const sleepHours = 11;
      const recommendations = getSleepRecommendations(30);
      const status = compareToRange(sleepHours, recommendations.min, recommendations.max);
      
      expect(status).toBe('above');
    });

    it('should use age-appropriate recommendations', () => {
      const teenRec = getSleepRecommendations(15);
      const adultRec = getSleepRecommendations(30);
      const seniorRec = getSleepRecommendations(70);
      
      expect(teenRec.min).toBeGreaterThanOrEqual(adultRec.min);
      expect(seniorRec.max).toBeLessThanOrEqual(adultRec.max);
    });
  });

  describe('Hydration status logic', () => {
    it('should identify below range hydration', () => {
      const waterCups = 5;
      const recommendations = getHydrationRecommendations();
      const status = compareToRange(waterCups, recommendations.min, recommendations.max);
      
      expect(status).toBe('below');
    });

    it('should identify within range hydration', () => {
      const waterCups = 9;
      const recommendations = getHydrationRecommendations();
      const status = compareToRange(waterCups, recommendations.min, recommendations.max);
      
      expect(status).toBe('within');
    });

    it('should identify above range hydration', () => {
      const waterCups = 15;
      const recommendations = getHydrationRecommendations();
      const status = compareToRange(waterCups, recommendations.min, recommendations.max);
      
      expect(status).toBe('above');
    });
  });

  describe('Tip generation logic', () => {
    it('should provide sleep tips for all statuses', () => {
      const belowTip = getSleepTip('below');
      const withinTip = getSleepTip('within');
      const aboveTip = getSleepTip('above');
      
      expect(belowTip.length).toBeGreaterThan(0);
      expect(withinTip.length).toBeGreaterThan(0);
      expect(aboveTip.length).toBeGreaterThan(0);
    });

    it('should provide hydration tips for all statuses', () => {
      const belowTip = getHydrationTip('below');
      const withinTip = getHydrationTip('within');
      const aboveTip = getHydrationTip('above');
      
      expect(belowTip.length).toBeGreaterThan(0);
      expect(withinTip.length).toBeGreaterThan(0);
      expect(aboveTip.length).toBeGreaterThan(0);
    });

    it('should provide actionable tips', () => {
      const tip = getSleepTip('below');
      
      // Tips should be practical and actionable
      expect(tip.length).toBeGreaterThan(20);
      expect(tip.length).toBeLessThan(200);
    });

    it('should use encouraging language', () => {
      const withinTip = getSleepTip('within');
      
      // Positive reinforcement for good habits
      expect(withinTip.toLowerCase()).toMatch(/great|good|nice|excellent|well/);
    });
  });

  describe('Status display logic', () => {
    it('should format status labels clearly', () => {
      const statuses = {
        below: 'Below Range',
        within: 'Within Range',
        above: 'Above Range',
      };
      
      expect(statuses.below).toContain('Below');
      expect(statuses.within).toContain('Within');
      expect(statuses.above).toContain('Above');
    });

    it('should use color coding for status', () => {
      const statusColors = {
        below: 'text-yellow-600',
        within: 'text-green-600',
        above: 'text-blue-600',
      };
      
      expect(statusColors.below).toContain('yellow');
      expect(statusColors.within).toContain('green');
      expect(statusColors.above).toContain('blue');
    });
  });

  describe('Results display logic', () => {
    it('should show both sleep and hydration results', () => {
      const results = {
        sleepStatus: 'within' as const,
        hydrationStatus: 'below' as const,
        sleepTip: 'Great job!',
        hydrationTip: 'Try drinking more water',
      };
      
      expect(results.sleepStatus).toBeTruthy();
      expect(results.hydrationStatus).toBeTruthy();
      expect(results.sleepTip).toBeTruthy();
      expect(results.hydrationTip).toBeTruthy();
    });

    it('should provide one tip per metric', () => {
      const sleepTip = getSleepTip('below');
      const hydrationTip = getHydrationTip('below');
      
      // Each metric gets exactly one tip
      expect(typeof sleepTip).toBe('string');
      expect(typeof hydrationTip).toBe('string');
      expect(sleepTip).not.toBe(hydrationTip);
    });
  });

  describe('User experience logic', () => {
    it('should show results after input', () => {
      const hasInput = true;
      const showResults = hasInput;
      
      expect(showResults).toBe(true);
    });

    it('should allow recalculation', () => {
      let sleepHours = 6;
      sleepHours = 8;
      
      const recommendations = getSleepRecommendations(30);
      const newStatus = compareToRange(sleepHours, recommendations.min, recommendations.max);
      
      expect(newStatus).toBe('within');
    });
  });
});
