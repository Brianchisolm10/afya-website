/**
 * Tests for unit conversion utilities
 */

import {
  lbsToKg,
  kgToLbs,
  inchesToCm,
  cmToInches,
  feetInchesToCm,
} from '../calculations';

describe('Unit Conversion Functions', () => {
  describe('lbsToKg', () => {
    it('should convert pounds to kilograms correctly', () => {
      expect(lbsToKg(100)).toBeCloseTo(45.36, 2);
      expect(lbsToKg(150)).toBeCloseTo(68.04, 2);
      expect(lbsToKg(200)).toBeCloseTo(90.72, 2);
    });

    it('should handle zero', () => {
      expect(lbsToKg(0)).toBe(0);
    });

    it('should handle decimal values', () => {
      expect(lbsToKg(154.3)).toBeCloseTo(69.99, 2);
    });
  });

  describe('kgToLbs', () => {
    it('should convert kilograms to pounds correctly', () => {
      expect(kgToLbs(50)).toBeCloseTo(110.23, 2);
      expect(kgToLbs(70)).toBeCloseTo(154.32, 2);
      expect(kgToLbs(90)).toBeCloseTo(198.42, 2);
    });

    it('should handle zero', () => {
      expect(kgToLbs(0)).toBe(0);
    });

    it('should handle decimal values', () => {
      expect(kgToLbs(68.5)).toBeCloseTo(151.02, 2);
    });
  });

  describe('lbsToKg and kgToLbs - Round Trip', () => {
    it('should convert back and forth accurately', () => {
      const originalLbs = 165;
      const kg = lbsToKg(originalLbs);
      const backToLbs = kgToLbs(kg);
      expect(backToLbs).toBeCloseTo(originalLbs, 1);
    });
  });

  describe('inchesToCm', () => {
    it('should convert inches to centimeters correctly', () => {
      expect(inchesToCm(12)).toBeCloseTo(30.48, 2);
      expect(inchesToCm(60)).toBeCloseTo(152.4, 2);
      expect(inchesToCm(72)).toBeCloseTo(182.88, 2);
    });

    it('should handle zero', () => {
      expect(inchesToCm(0)).toBe(0);
    });

    it('should handle decimal values', () => {
      expect(inchesToCm(65.5)).toBeCloseTo(166.37, 2);
    });
  });

  describe('cmToInches', () => {
    it('should convert centimeters to inches correctly', () => {
      expect(cmToInches(30)).toBeCloseTo(11.81, 2);
      expect(cmToInches(150)).toBeCloseTo(59.06, 2);
      expect(cmToInches(180)).toBeCloseTo(70.87, 2);
    });

    it('should handle zero', () => {
      expect(cmToInches(0)).toBe(0);
    });

    it('should handle decimal values', () => {
      expect(cmToInches(165.5)).toBeCloseTo(65.16, 2);
    });
  });

  describe('inchesToCm and cmToInches - Round Trip', () => {
    it('should convert back and forth accurately', () => {
      const originalInches = 68;
      const cm = inchesToCm(originalInches);
      const backToInches = cmToInches(cm);
      expect(backToInches).toBeCloseTo(originalInches, 1);
    });
  });

  describe('feetInchesToCm', () => {
    it('should convert feet and inches to centimeters', () => {
      // 5 feet 0 inches = 60 inches = 152.4 cm
      expect(feetInchesToCm(5, 0)).toBeCloseTo(152.4, 2);
    });

    it('should handle 5 feet 9 inches (average male height)', () => {
      // 5'9" = 69 inches = 175.26 cm
      expect(feetInchesToCm(5, 9)).toBeCloseTo(175.26, 2);
    });

    it('should handle 6 feet 2 inches', () => {
      // 6'2" = 74 inches = 187.96 cm
      expect(feetInchesToCm(6, 2)).toBeCloseTo(187.96, 2);
    });

    it('should handle zero feet with inches', () => {
      expect(feetInchesToCm(0, 12)).toBeCloseTo(30.48, 2);
    });

    it('should handle feet with zero inches', () => {
      expect(feetInchesToCm(6, 0)).toBeCloseTo(182.88, 2);
    });

    it('should handle decimal inches', () => {
      expect(feetInchesToCm(5, 10.5)).toBeCloseTo(179.07, 2);
    });
  });
});
