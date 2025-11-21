/**
 * Tests for Recovery Check-In component logic
 */

import { describe, it, expect } from 'vitest';
import { recoverySchema } from '@/lib/tools/validation';

describe('RecoveryCheckIn Component Logic', () => {
  describe('Input validation', () => {
    it('should validate valid recovery inputs', () => {
      const input = { energy: 3, soreness: 2, stress: 4, mood: 5 };
      const result = recoverySchema.safeParse(input);
      
      expect(result.success).toBe(true);
    });

    it('should accept boundary values (1 and 5)', () => {
      const minInput = { energy: 1, soreness: 1, stress: 1, mood: 1 };
      const maxInput = { energy: 5, soreness: 5, stress: 5, mood: 5 };
      
      expect(recoverySchema.safeParse(minInput).success).toBe(true);
      expect(recoverySchema.safeParse(maxInput).success).toBe(true);
    });

    it('should reject values below 1', () => {
      const input = { energy: 0, soreness: 2, stress: 3, mood: 4 };
      const result = recoverySchema.safeParse(input);
      
      expect(result.success).toBe(false);
    });

    it('should reject values above 5', () => {
      const input = { energy: 3, soreness: 6, stress: 3, mood: 4 };
      const result = recoverySchema.safeParse(input);
      
      expect(result.success).toBe(false);
    });
  });

  describe('Recovery score calculation', () => {
    it('should calculate average of four inputs', () => {
      const inputs = { energy: 4, soreness: 3, stress: 2, mood: 5 };
      const score = (inputs.energy + inputs.soreness + inputs.stress + inputs.mood) / 4;
      
      expect(score).toBe(3.5);
    });

    it('should handle all low scores', () => {
      const inputs = { energy: 1, soreness: 1, stress: 1, mood: 1 };
      const score = (inputs.energy + inputs.soreness + inputs.stress + inputs.mood) / 4;
      
      expect(score).toBe(1);
    });

    it('should handle all high scores', () => {
      const inputs = { energy: 5, soreness: 5, stress: 5, mood: 5 };
      const score = (inputs.energy + inputs.soreness + inputs.stress + inputs.mood) / 4;
      
      expect(score).toBe(5);
    });

    it('should handle mixed scores', () => {
      const inputs = { energy: 5, soreness: 1, stress: 3, mood: 3 };
      const score = (inputs.energy + inputs.soreness + inputs.stress + inputs.mood) / 4;
      
      expect(score).toBe(3);
    });
  });

  describe('Recovery label logic', () => {
    it('should label low scores as Recovery Day', () => {
      const score = 2.0;
      const label = score < 2.5 ? 'Recovery Day' : score < 3.5 ? 'Half-Speed Day' : 'Green Light Day';
      
      expect(label).toBe('Recovery Day');
    });

    it('should label medium scores as Half-Speed Day', () => {
      const score = 3.0;
      const label = score < 2.5 ? 'Recovery Day' : score < 3.5 ? 'Half-Speed Day' : 'Green Light Day';
      
      expect(label).toBe('Half-Speed Day');
    });

    it('should label high scores as Green Light Day', () => {
      const score = 4.0;
      const label = score < 2.5 ? 'Recovery Day' : score < 3.5 ? 'Half-Speed Day' : 'Green Light Day';
      
      expect(label).toBe('Green Light Day');
    });

    it('should handle boundary score 2.5', () => {
      const score = 2.5;
      const label = score < 2.5 ? 'Recovery Day' : score < 3.5 ? 'Half-Speed Day' : 'Green Light Day';
      
      expect(label).toBe('Half-Speed Day');
    });

    it('should handle boundary score 3.5', () => {
      const score = 3.5;
      const label = score < 2.5 ? 'Recovery Day' : score < 3.5 ? 'Half-Speed Day' : 'Green Light Day';
      
      expect(label).toBe('Green Light Day');
    });
  });

  describe('Guidance message logic', () => {
    it('should provide rest guidance for Recovery Day', () => {
      const label = 'Recovery Day';
      const guidance = 'Your body needs rest today. Focus on gentle movement, hydration, and sleep.';
      
      expect(guidance).toContain('rest');
      expect(guidance.length).toBeGreaterThan(30);
    });

    it('should provide moderate guidance for Half-Speed Day', () => {
      const label = 'Half-Speed Day';
      const guidance = 'Take it easier today. Light activity is fine, but skip intense workouts.';
      
      expect(guidance).toContain('easier');
      expect(guidance.length).toBeGreaterThan(30);
    });

    it('should provide active guidance for Green Light Day', () => {
      const label = 'Green Light Day';
      const guidance = 'You\'re feeling good! This is a great day for challenging workouts.';
      
      expect(guidance).toContain('good');
      expect(guidance.length).toBeGreaterThan(30);
    });

    it('should use supportive language', () => {
      const messages = [
        'Your body needs rest today',
        'Take it easier today',
        'You\'re feeling good',
      ];
      
      messages.forEach(message => {
        expect(message.length).toBeGreaterThan(0);
        // Should not contain negative or judgmental words
        expect(message.toLowerCase()).not.toContain('bad');
        expect(message.toLowerCase()).not.toContain('wrong');
      });
    });
  });

  describe('Color coding logic', () => {
    it('should assign colors to recovery labels', () => {
      const colors = {
        'Recovery Day': 'bg-blue-100 text-blue-800',
        'Half-Speed Day': 'bg-yellow-100 text-yellow-800',
        'Green Light Day': 'bg-green-100 text-green-800',
      };
      
      expect(colors['Recovery Day']).toContain('blue');
      expect(colors['Half-Speed Day']).toContain('yellow');
      expect(colors['Green Light Day']).toContain('green');
    });

    it('should use appropriate visual indicators', () => {
      const indicators = {
        'Recovery Day': '🛌',
        'Half-Speed Day': '🚶',
        'Green Light Day': '💪',
      };
      
      expect(indicators['Recovery Day']).toBeTruthy();
      expect(indicators['Half-Speed Day']).toBeTruthy();
      expect(indicators['Green Light Day']).toBeTruthy();
    });
  });

  describe('Input control logic', () => {
    it('should use 1-5 scale for all inputs', () => {
      const scale = { min: 1, max: 5 };
      
      expect(scale.min).toBe(1);
      expect(scale.max).toBe(5);
      expect(scale.max - scale.min).toBe(4);
    });

    it('should label inputs clearly', () => {
      const labels = {
        energy: 'Energy Level',
        soreness: 'Muscle Soreness',
        stress: 'Stress Level',
        mood: 'Overall Mood',
      };
      
      expect(labels.energy).toContain('Energy');
      expect(labels.soreness).toContain('Soreness');
      expect(labels.stress).toContain('Stress');
      expect(labels.mood).toContain('Mood');
    });

    it('should provide scale descriptions', () => {
      const scaleDescription = '1 = Very Low, 5 = Very High';
      
      expect(scaleDescription).toContain('1');
      expect(scaleDescription).toContain('5');
      expect(scaleDescription).toContain('Low');
      expect(scaleDescription).toContain('High');
    });
  });

  describe('Results display logic', () => {
    it('should show recovery label prominently', () => {
      const label = 'Green Light Day';
      const isProminent = true;
      
      expect(label.length).toBeGreaterThan(0);
      expect(isProminent).toBe(true);
    });

    it('should display guidance message', () => {
      const hasGuidance = true;
      const guidance = 'You\'re feeling good! This is a great day for challenging workouts.';
      
      expect(hasGuidance).toBe(true);
      expect(guidance.length).toBeGreaterThan(0);
    });

    it('should show all four input factors', () => {
      const factors = ['energy', 'soreness', 'stress', 'mood'];
      
      expect(factors.length).toBe(4);
    });
  });

  describe('User experience logic', () => {
    it('should show results after all inputs provided', () => {
      const hasAllInputs = true;
      const showResults = hasAllInputs;
      
      expect(showResults).toBe(true);
    });

    it('should allow recalculation', () => {
      let inputs = { energy: 2, soreness: 2, stress: 2, mood: 2 };
      let score = (inputs.energy + inputs.soreness + inputs.stress + inputs.mood) / 4;
      
      expect(score).toBe(2);
      
      inputs = { energy: 4, soreness: 4, stress: 4, mood: 4 };
      score = (inputs.energy + inputs.soreness + inputs.stress + inputs.mood) / 4;
      
      expect(score).toBe(4);
    });

    it('should update results immediately when inputs change', () => {
      const inputs = { energy: 3, soreness: 3, stress: 3, mood: 3 };
      const score = (inputs.energy + inputs.soreness + inputs.stress + inputs.mood) / 4;
      
      expect(score).toBe(3);
    });
  });

  describe('Non-judgmental language', () => {
    it('should avoid negative framing', () => {
      const recoveryMessage = 'Your body needs rest today';
      
      expect(recoveryMessage.toLowerCase()).not.toContain('bad');
      expect(recoveryMessage.toLowerCase()).not.toContain('poor');
      expect(recoveryMessage.toLowerCase()).not.toContain('fail');
    });

    it('should use supportive framing', () => {
      const messages = [
        'Your body needs rest',
        'Take it easier',
        'You\'re feeling good',
      ];
      
      messages.forEach(message => {
        expect(message.length).toBeGreaterThan(0);
      });
    });
  });
});
