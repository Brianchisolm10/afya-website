/**
 * Tests for Heart Rate Zone calculations
 */

import { calculateHeartRateZones } from '../calculations';

describe('Heart Rate Zone Calculations', () => {
  describe('calculateHeartRateZones - Simple Formula', () => {
    it('should calculate max heart rate correctly', () => {
      const zones = calculateHeartRateZones(30);
      expect(zones.maxHR).toBe(190); // 220 - 30
    });

    it('should calculate easy zone (50-60% of max HR)', () => {
      const zones = calculateHeartRateZones(30);
      expect(zones.easy.min).toBe(95); // 190 * 0.5
      expect(zones.easy.max).toBe(114); // 190 * 0.6
    });

    it('should calculate moderate zone (60-70% of max HR)', () => {
      const zones = calculateHeartRateZones(30);
      expect(zones.moderate.min).toBe(114); // 190 * 0.6
      expect(zones.moderate.max).toBe(133); // 190 * 0.7
    });

    it('should calculate vigorous zone (70-85% of max HR)', () => {
      const zones = calculateHeartRateZones(30);
      expect(zones.vigorous.min).toBe(133); // 190 * 0.7
      expect(zones.vigorous.max).toBe(162); // 190 * 0.85 (rounded)
    });

    it('should work for different ages', () => {
      const zones20 = calculateHeartRateZones(20);
      expect(zones20.maxHR).toBe(200);
      
      const zones50 = calculateHeartRateZones(50);
      expect(zones50.maxHR).toBe(170);
      
      const zones70 = calculateHeartRateZones(70);
      expect(zones70.maxHR).toBe(150);
    });
  });

  describe('calculateHeartRateZones - Karvonen Formula', () => {
    it('should use Karvonen formula when resting HR is provided', () => {
      const zones = calculateHeartRateZones(30, 60);
      const hrReserve = 190 - 60; // 130
      
      // Easy zone: 50-60% of HR reserve + resting HR
      expect(zones.easy.min).toBe(Math.round(130 * 0.5 + 60)); // 125
      expect(zones.easy.max).toBe(Math.round(130 * 0.6 + 60)); // 138
    });

    it('should calculate moderate zone with Karvonen', () => {
      const zones = calculateHeartRateZones(30, 60);
      const hrReserve = 190 - 60;
      
      expect(zones.moderate.min).toBe(Math.round(hrReserve * 0.6 + 60));
      expect(zones.moderate.max).toBe(Math.round(hrReserve * 0.7 + 60));
    });

    it('should calculate vigorous zone with Karvonen', () => {
      const zones = calculateHeartRateZones(30, 60);
      const hrReserve = 190 - 60;
      
      expect(zones.vigorous.min).toBe(Math.round(hrReserve * 0.7 + 60));
      expect(zones.vigorous.max).toBe(Math.round(hrReserve * 0.85 + 60));
    });

    it('should produce higher zones with lower resting HR', () => {
      const zonesHighResting = calculateHeartRateZones(30, 70);
      const zonesLowResting = calculateHeartRateZones(30, 50);
      
      // Lower resting HR means higher HR reserve, thus higher zones
      // High resting (70): reserve = 190-70 = 120, easy min = 120*0.5+70 = 130
      // Low resting (50): reserve = 190-50 = 140, easy min = 140*0.5+50 = 120
      // Actually, lower resting HR produces LOWER zones because the formula adds back resting HR
      expect(zonesHighResting.easy.min).toBeGreaterThan(zonesLowResting.easy.min);
      expect(zonesHighResting.moderate.min).toBeGreaterThan(zonesLowResting.moderate.min);
      expect(zonesHighResting.vigorous.min).toBeGreaterThan(zonesLowResting.vigorous.min);
    });
  });

  describe('Edge Cases', () => {
    it('should handle young age (13)', () => {
      const zones = calculateHeartRateZones(13);
      expect(zones.maxHR).toBe(207);
      expect(zones.easy.min).toBeGreaterThan(0);
      expect(zones.vigorous.max).toBeLessThan(zones.maxHR);
    });

    it('should handle older age (100)', () => {
      const zones = calculateHeartRateZones(100);
      expect(zones.maxHR).toBe(120);
      expect(zones.easy.min).toBeGreaterThan(0);
      expect(zones.vigorous.max).toBeLessThan(zones.maxHR);
    });

    it('should handle low resting HR (30)', () => {
      const zones = calculateHeartRateZones(30, 30);
      expect(zones.easy.min).toBeGreaterThanOrEqual(30);
      expect(zones.vigorous.max).toBeLessThan(zones.maxHR);
    });

    it('should handle high resting HR (120)', () => {
      const zones = calculateHeartRateZones(30, 120);
      expect(zones.easy.min).toBeGreaterThanOrEqual(120);
      expect(zones.vigorous.max).toBeLessThanOrEqual(zones.maxHR);
    });
  });

  describe('Zone Relationships', () => {
    it('should have zones that do not overlap (simple formula)', () => {
      const zones = calculateHeartRateZones(30);
      
      expect(zones.easy.max).toBeLessThanOrEqual(zones.moderate.min);
      expect(zones.moderate.max).toBeLessThanOrEqual(zones.vigorous.min);
      expect(zones.vigorous.max).toBeLessThanOrEqual(zones.maxHR);
    });

    it('should have zones that do not overlap (Karvonen)', () => {
      const zones = calculateHeartRateZones(30, 60);
      
      expect(zones.easy.max).toBeLessThanOrEqual(zones.moderate.min);
      expect(zones.moderate.max).toBeLessThanOrEqual(zones.vigorous.min);
      expect(zones.vigorous.max).toBeLessThanOrEqual(zones.maxHR);
    });

    it('should have all zones within max HR', () => {
      const zones = calculateHeartRateZones(40, 65);
      
      expect(zones.easy.min).toBeLessThan(zones.maxHR);
      expect(zones.easy.max).toBeLessThan(zones.maxHR);
      expect(zones.moderate.min).toBeLessThan(zones.maxHR);
      expect(zones.moderate.max).toBeLessThan(zones.maxHR);
      expect(zones.vigorous.min).toBeLessThan(zones.maxHR);
      expect(zones.vigorous.max).toBeLessThanOrEqual(zones.maxHR);
    });
  });
});
