/**
 * Tests for Hydration & Sleep Snapshot calculations
 */

import {
  getSleepRecommendations,
  getHydrationRecommendations,
  compareToRange,
  getSleepTip,
  getHydrationTip,
} from '../calculations';

describe('Hydration & Sleep Calculations', () => {
  describe('getSleepRecommendations', () => {
    it('should return teen range for ages 13-17', () => {
      expect(getSleepRecommendations(13)).toEqual({ min: 8, max: 10 });
      expect(getSleepRecommendations(15)).toEqual({ min: 8, max: 10 });
      expect(getSleepRecommendations(17)).toEqual({ min: 8, max: 10 });
    });

    it('should return adult range for ages 18-64', () => {
      expect(getSleepRecommendations(18)).toEqual({ min: 7, max: 9 });
      expect(getSleepRecommendations(30)).toEqual({ min: 7, max: 9 });
      expect(getSleepRecommendations(64)).toEqual({ min: 7, max: 9 });
    });

    it('should return senior range for ages 65+', () => {
      expect(getSleepRecommendations(65)).toEqual({ min: 7, max: 8 });
      expect(getSleepRecommendations(80)).toEqual({ min: 7, max: 8 });
    });

    it('should return adult range when no age provided', () => {
      expect(getSleepRecommendations()).toEqual({ min: 7, max: 9 });
    });
  });

  describe('getHydrationRecommendations', () => {
    it('should return standard hydration range', () => {
      expect(getHydrationRecommendations()).toEqual({ min: 8, max: 10 });
    });
  });

  describe('compareToRange', () => {
    it('should return "below" when value is less than min', () => {
      expect(compareToRange(5, 7, 9)).toBe('below');
      expect(compareToRange(6.9, 7, 9)).toBe('below');
    });

    it('should return "within" when value is in range', () => {
      expect(compareToRange(7, 7, 9)).toBe('within');
      expect(compareToRange(8, 7, 9)).toBe('within');
      expect(compareToRange(9, 7, 9)).toBe('within');
    });

    it('should return "above" when value is greater than max', () => {
      expect(compareToRange(10, 7, 9)).toBe('above');
      expect(compareToRange(9.1, 7, 9)).toBe('above');
    });
  });

  describe('getSleepTip', () => {
    it('should return a tip for below range', () => {
      const tip = getSleepTip('below');
      expect(typeof tip).toBe('string');
      expect(tip.length).toBeGreaterThan(0);
    });

    it('should return a tip for within range', () => {
      const tip = getSleepTip('within');
      expect(typeof tip).toBe('string');
      expect(tip.length).toBeGreaterThan(0);
    });

    it('should return a tip for above range', () => {
      const tip = getSleepTip('above');
      expect(typeof tip).toBe('string');
      expect(tip.length).toBeGreaterThan(0);
    });
  });

  describe('getHydrationTip', () => {
    it('should return a tip for below range', () => {
      const tip = getHydrationTip('below');
      expect(typeof tip).toBe('string');
      expect(tip.length).toBeGreaterThan(0);
    });

    it('should return a tip for within range', () => {
      const tip = getHydrationTip('within');
      expect(typeof tip).toBe('string');
      expect(tip.length).toBeGreaterThan(0);
    });

    it('should return a tip for above range', () => {
      const tip = getHydrationTip('above');
      expect(typeof tip).toBe('string');
      expect(tip.length).toBeGreaterThan(0);
    });
  });
});
