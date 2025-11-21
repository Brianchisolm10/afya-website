/**
 * Tests for BMR and TDEE calculations
 */

import { calculateBMR, calculateTDEE, calculateProteinRange } from '../calculations';

describe('BMR Calculations', () => {
  describe('calculateBMR - Male', () => {
    it('should calculate BMR correctly for a 30-year-old male', () => {
      // 80kg, 180cm, 30 years, male
      // BMR = 10 * 80 + 6.25 * 180 - 5 * 30 + 5
      // BMR = 800 + 1125 - 150 + 5 = 1780
      const bmr = calculateBMR(80, 180, 30, 'male');
      expect(bmr).toBe(1780);
    });

    it('should calculate BMR correctly for a 25-year-old male', () => {
      // 75kg, 175cm, 25 years, male
      // BMR = 10 * 75 + 6.25 * 175 - 5 * 25 + 5 = 750 + 1093.75 - 125 + 5 = 1723.75 ≈ 1724
      const bmr = calculateBMR(75, 175, 25, 'male');
      expect(bmr).toBe(1724);
    });

    it('should calculate BMR correctly for a 50-year-old male', () => {
      // 90kg, 185cm, 50 years, male
      const bmr = calculateBMR(90, 185, 50, 'male');
      expect(bmr).toBe(1811);
    });
  });

  describe('calculateBMR - Female', () => {
    it('should calculate BMR correctly for a 30-year-old female', () => {
      // 65kg, 165cm, 30 years, female
      // BMR = 10 * 65 + 6.25 * 165 - 5 * 30 - 161
      // BMR = 650 + 1031.25 - 150 - 161 = 1370.25 ≈ 1370
      const bmr = calculateBMR(65, 165, 30, 'female');
      expect(bmr).toBe(1370);
    });

    it('should calculate BMR correctly for a 25-year-old female', () => {
      // 60kg, 160cm, 25 years, female
      const bmr = calculateBMR(60, 160, 25, 'female');
      expect(bmr).toBe(1314);
    });

    it('should calculate BMR correctly for a 50-year-old female', () => {
      // 70kg, 170cm, 50 years, female
      // BMR = 10 * 70 + 6.25 * 170 - 5 * 50 - 161 = 700 + 1062.5 - 250 - 161 = 1351.5 ≈ 1352
      const bmr = calculateBMR(70, 170, 50, 'female');
      expect(bmr).toBe(1352);
    });
  });

  describe('calculateBMR - Edge Cases', () => {
    it('should handle minimum age (13)', () => {
      const bmr = calculateBMR(50, 150, 13, 'female');
      expect(bmr).toBeGreaterThan(0);
      expect(typeof bmr).toBe('number');
    });

    it('should handle maximum age (100)', () => {
      const bmr = calculateBMR(70, 170, 100, 'male');
      expect(bmr).toBeGreaterThan(0);
      expect(typeof bmr).toBe('number');
    });

    it('should handle minimum weight (30kg)', () => {
      const bmr = calculateBMR(30, 150, 20, 'female');
      expect(bmr).toBeGreaterThan(0);
    });

    it('should handle maximum weight (300kg)', () => {
      const bmr = calculateBMR(300, 200, 40, 'male');
      expect(bmr).toBeGreaterThan(0);
    });
  });

  describe('calculateBMR - Sex Differences', () => {
    it('should calculate higher BMR for males than females with same stats', () => {
      const maleBMR = calculateBMR(70, 170, 30, 'male');
      const femaleBMR = calculateBMR(70, 170, 30, 'female');
      
      // Male formula adds 5, female subtracts 161, so difference is 166
      expect(maleBMR - femaleBMR).toBe(166);
    });
  });
});

describe('TDEE Calculations', () => {
  const baseBMR = 1500;

  describe('calculateTDEE - Activity Levels', () => {
    it('should calculate TDEE for sedentary activity', () => {
      const tdee = calculateTDEE(baseBMR, 'sedentary');
      expect(tdee).toBe(Math.round(baseBMR * 1.2)); // 1800
    });

    it('should calculate TDEE for light activity', () => {
      const tdee = calculateTDEE(baseBMR, 'light');
      expect(tdee).toBe(Math.round(baseBMR * 1.375)); // 2063
    });

    it('should calculate TDEE for moderate activity', () => {
      const tdee = calculateTDEE(baseBMR, 'moderate');
      expect(tdee).toBe(Math.round(baseBMR * 1.55)); // 2325
    });

    it('should calculate TDEE for active lifestyle', () => {
      const tdee = calculateTDEE(baseBMR, 'active');
      expect(tdee).toBe(Math.round(baseBMR * 1.725)); // 2588
    });

    it('should calculate TDEE for very active lifestyle', () => {
      const tdee = calculateTDEE(baseBMR, 'very_active');
      expect(tdee).toBe(Math.round(baseBMR * 1.9)); // 2850
    });
  });

  describe('calculateTDEE - Activity Level Progression', () => {
    it('should increase TDEE with higher activity levels', () => {
      const sedentary = calculateTDEE(baseBMR, 'sedentary');
      const light = calculateTDEE(baseBMR, 'light');
      const moderate = calculateTDEE(baseBMR, 'moderate');
      const active = calculateTDEE(baseBMR, 'active');
      const veryActive = calculateTDEE(baseBMR, 'very_active');
      
      expect(light).toBeGreaterThan(sedentary);
      expect(moderate).toBeGreaterThan(light);
      expect(active).toBeGreaterThan(moderate);
      expect(veryActive).toBeGreaterThan(active);
    });
  });

  describe('calculateTDEE - Edge Cases', () => {
    it('should handle very low BMR', () => {
      const tdee = calculateTDEE(800, 'moderate');
      expect(tdee).toBeGreaterThan(800);
      expect(typeof tdee).toBe('number');
    });

    it('should handle very high BMR', () => {
      const tdee = calculateTDEE(3000, 'active');
      expect(tdee).toBeGreaterThan(3000);
      expect(typeof tdee).toBe('number');
    });
  });
});

describe('Protein Range Calculations', () => {
  const baseWeight = 70; // 70kg

  describe('calculateProteinRange - Activity Levels', () => {
    it('should calculate protein for sedentary activity', () => {
      const protein = calculateProteinRange(baseWeight, 'sedentary', 'maintain');
      expect(protein.min).toBe(Math.round(baseWeight * 0.8)); // 56g
      expect(protein.max).toBe(Math.round(baseWeight * 1.0)); // 70g
    });

    it('should calculate protein for light activity', () => {
      const protein = calculateProteinRange(baseWeight, 'light', 'maintain');
      expect(protein.min).toBe(Math.round(baseWeight * 0.8));
      expect(protein.max).toBe(Math.round(baseWeight * 1.0));
    });

    it('should calculate protein for moderate activity', () => {
      const protein = calculateProteinRange(baseWeight, 'moderate', 'maintain');
      expect(protein.min).toBe(Math.round(baseWeight * 1.2)); // 84g
      expect(protein.max).toBe(Math.round(baseWeight * 1.6)); // 112g
    });

    it('should calculate protein for active lifestyle', () => {
      const protein = calculateProteinRange(baseWeight, 'active', 'maintain');
      expect(protein.min).toBe(Math.round(baseWeight * 1.2));
      expect(protein.max).toBe(Math.round(baseWeight * 1.6));
    });

    it('should calculate protein for very active lifestyle', () => {
      const protein = calculateProteinRange(baseWeight, 'very_active', 'maintain');
      expect(protein.min).toBe(Math.round(baseWeight * 1.6)); // 112g
      expect(protein.max).toBe(Math.round(baseWeight * 2.0)); // 140g
    });
  });

  describe('calculateProteinRange - Goals', () => {
    it('should calculate higher protein for weight loss goal', () => {
      const maintain = calculateProteinRange(baseWeight, 'sedentary', 'maintain');
      const lose = calculateProteinRange(baseWeight, 'sedentary', 'lose');
      
      // Weight loss should have higher protein to preserve muscle
      expect(lose.min).toBeGreaterThanOrEqual(maintain.min);
      expect(lose.max).toBeGreaterThanOrEqual(maintain.max);
    });

    it('should calculate higher protein for weight gain goal', () => {
      const maintain = calculateProteinRange(baseWeight, 'sedentary', 'maintain');
      const gain = calculateProteinRange(baseWeight, 'sedentary', 'gain');
      
      // Weight gain should have higher protein to support muscle growth
      expect(gain.min).toBeGreaterThanOrEqual(maintain.min);
      expect(gain.max).toBeGreaterThanOrEqual(maintain.max);
    });

    it('should calculate appropriate protein for maintenance', () => {
      const protein = calculateProteinRange(baseWeight, 'moderate', 'maintain');
      expect(protein.min).toBeGreaterThan(0);
      expect(protein.max).toBeGreaterThan(protein.min);
    });
  });

  describe('calculateProteinRange - Combined Factors', () => {
    it('should calculate highest protein for very active + gain', () => {
      const protein = calculateProteinRange(baseWeight, 'very_active', 'gain');
      expect(protein.min).toBe(Math.round(baseWeight * 1.6));
      expect(protein.max).toBe(Math.round(baseWeight * 2.0));
    });

    it('should calculate appropriate protein for sedentary + lose', () => {
      const protein = calculateProteinRange(baseWeight, 'sedentary', 'lose');
      // Should be at least 1.2g/kg for weight loss
      expect(protein.min).toBeGreaterThanOrEqual(Math.round(baseWeight * 1.2));
    });

    it('should calculate appropriate protein for active + gain', () => {
      const protein = calculateProteinRange(baseWeight, 'active', 'gain');
      expect(protein.min).toBeGreaterThanOrEqual(Math.round(baseWeight * 1.4));
      expect(protein.max).toBeGreaterThanOrEqual(Math.round(baseWeight * 2.0));
    });
  });

  describe('calculateProteinRange - Edge Cases', () => {
    it('should handle minimum weight (30kg)', () => {
      const protein = calculateProteinRange(30, 'moderate', 'maintain');
      expect(protein.min).toBeGreaterThan(0);
      expect(protein.max).toBeGreaterThan(protein.min);
    });

    it('should handle maximum weight (300kg)', () => {
      const protein = calculateProteinRange(300, 'active', 'gain');
      expect(protein.min).toBeGreaterThan(0);
      expect(protein.max).toBeGreaterThan(protein.min);
    });
  });

  describe('calculateProteinRange - Range Validity', () => {
    it('should always have max greater than or equal to min', () => {
      const activities: Array<'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'> = 
        ['sedentary', 'light', 'moderate', 'active', 'very_active'];
      const goals: Array<'lose' | 'maintain' | 'gain'> = ['lose', 'maintain', 'gain'];
      
      activities.forEach(activity => {
        goals.forEach(goal => {
          const protein = calculateProteinRange(baseWeight, activity, goal);
          expect(protein.max).toBeGreaterThanOrEqual(protein.min);
        });
      });
    });
  });
});
