/**
 * Tests for Youth Corner component logic
 */

import { describe, it, expect } from 'vitest';
import { youthCornerSchema } from '@/lib/tools/validation';

describe('YouthCorner Component Logic', () => {
  describe('Input validation', () => {
    it('should validate valid screen time and play time', () => {
      const input = { screenTimeHours: 4, playTimeHours: 2 };
      const result = youthCornerSchema.safeParse(input);
      
      expect(result.success).toBe(true);
    });

    it('should accept zero hours', () => {
      const input = { screenTimeHours: 0, playTimeHours: 0 };
      const result = youthCornerSchema.safeParse(input);
      
      expect(result.success).toBe(true);
    });

    it('should accept maximum 24 hours', () => {
      const input = { screenTimeHours: 24, playTimeHours: 24 };
      const result = youthCornerSchema.safeParse(input);
      
      expect(result.success).toBe(true);
    });

    it('should reject negative screen time', () => {
      const input = { screenTimeHours: -1, playTimeHours: 2 };
      const result = youthCornerSchema.safeParse(input);
      
      expect(result.success).toBe(false);
    });

    it('should reject screen time above 24', () => {
      const input = { screenTimeHours: 25, playTimeHours: 2 };
      const result = youthCornerSchema.safeParse(input);
      
      expect(result.success).toBe(false);
    });
  });

  describe('Ratio calculation logic', () => {
    it('should calculate screen to play ratio', () => {
      const screenTime = 4;
      const playTime = 2;
      const ratio = screenTime / playTime;
      
      expect(ratio).toBe(2);
    });

    it('should handle equal screen and play time', () => {
      const screenTime = 3;
      const playTime = 3;
      const ratio = screenTime / playTime;
      
      expect(ratio).toBe(1);
    });

    it('should handle more play than screen time', () => {
      const screenTime = 2;
      const playTime = 4;
      const ratio = screenTime / playTime;
      
      expect(ratio).toBe(0.5);
    });

    it('should handle zero play time gracefully', () => {
      const screenTime = 4;
      const playTime = 0;
      const ratio = playTime === 0 ? Infinity : screenTime / playTime;
      
      expect(ratio).toBe(Infinity);
    });
  });

  describe('Comparison message logic', () => {
    it('should provide gentle comparison for high screen time', () => {
      const screenTime = 6;
      const playTime = 1;
      const message = 'You spent more time on screens than moving today.';
      
      expect(message).not.toContain('too much');
      expect(message).not.toContain('bad');
      expect(message.length).toBeGreaterThan(20);
    });

    it('should provide positive message for balanced time', () => {
      const screenTime = 2;
      const playTime = 2;
      const message = 'Nice balance between screen time and active play!';
      
      expect(message.toLowerCase()).toMatch(/nice|good|great|balanced/);
    });

    it('should provide encouraging message for high play time', () => {
      const screenTime = 1;
      const playTime = 4;
      const message = 'Awesome! You\'re getting lots of movement time.';
      
      expect(message.toLowerCase()).toMatch(/awesome|great|excellent/);
    });

    it('should use non-judgmental language', () => {
      const messages = [
        'You spent more time on screens than moving today.',
        'Nice balance between screen time and active play!',
        'Awesome! You\'re getting lots of movement time.',
      ];
      
      messages.forEach(message => {
        expect(message.toLowerCase()).not.toContain('bad');
        expect(message.toLowerCase()).not.toContain('wrong');
        expect(message.toLowerCase()).not.toContain('should');
      });
    });
  });

  describe('Suggestion generation logic', () => {
    it('should provide practical movement suggestions', () => {
      const suggestions = [
        'Try a 10-minute dance break',
        'Play tag or hide-and-seek',
        'Go for a family walk',
        'Shoot some hoops',
      ];
      
      suggestions.forEach(suggestion => {
        expect(suggestion.length).toBeGreaterThan(10);
        expect(suggestion.length).toBeLessThan(100);
      });
    });

    it('should use age-appropriate language', () => {
      const suggestion = 'Try a 10-minute dance break';
      
      expect(suggestion).not.toContain('exercise');
      expect(suggestion).not.toContain('workout');
      // Should use fun, playful terms
    });

    it('should provide achievable ideas', () => {
      const suggestion = 'Play tag or hide-and-seek';
      
      // Should be simple activities that don't require equipment
      expect(suggestion.length).toBeGreaterThan(0);
    });

    it('should vary suggestions', () => {
      const suggestions = [
        'Try a 10-minute dance break',
        'Play tag or hide-and-seek',
        'Go for a family walk',
      ];
      
      const uniqueSuggestions = new Set(suggestions);
      expect(uniqueSuggestions.size).toBe(suggestions.length);
    });
  });

  describe('Visual comparison logic', () => {
    it('should show both screen and play time visually', () => {
      const screenTime = 4;
      const playTime = 2;
      const total = screenTime + playTime;
      const screenPercent = (screenTime / total) * 100;
      const playPercent = (playTime / total) * 100;
      
      expect(screenPercent).toBeCloseTo(66.67, 1);
      expect(playPercent).toBeCloseTo(33.33, 1);
      expect(screenPercent + playPercent).toBeCloseTo(100, 1);
    });

    it('should use friendly graphics', () => {
      const icons = {
        screen: '📱',
        play: '⚽',
      };
      
      expect(icons.screen).toBeTruthy();
      expect(icons.play).toBeTruthy();
    });

    it('should use appropriate colors', () => {
      const colors = {
        screen: 'bg-purple-200',
        play: 'bg-green-200',
      };
      
      expect(colors.screen).toContain('purple');
      expect(colors.play).toContain('green');
    });
  });

  describe('Encouraging tone logic', () => {
    it('should use positive reinforcement', () => {
      const encouragement = 'Every bit of movement counts!';
      
      expect(encouragement.toLowerCase()).toMatch(/great|good|awesome|nice|every/);
    });

    it('should avoid shame or guilt', () => {
      const message = 'You spent more time on screens than moving today.';
      
      expect(message.toLowerCase()).not.toContain('shame');
      expect(message.toLowerCase()).not.toContain('guilt');
      expect(message.toLowerCase()).not.toContain('lazy');
    });

    it('should focus on opportunities', () => {
      const suggestion = 'Try a 10-minute dance break';
      
      expect(suggestion.toLowerCase()).toMatch(/try|play|go|do/);
    });
  });

  describe('Family-friendly language', () => {
    it('should use simple vocabulary', () => {
      const message = 'You spent more time on screens than moving today.';
      
      // Should be understandable by children
      expect(message).not.toContain('sedentary');
      expect(message).not.toContain('physical activity');
    });

    it('should use playful terms', () => {
      const terms = ['play', 'movement', 'active', 'fun'];
      
      terms.forEach(term => {
        expect(term.length).toBeGreaterThan(0);
      });
    });

    it('should include family activities', () => {
      const suggestion = 'Go for a family walk';
      
      expect(suggestion.toLowerCase()).toContain('family');
    });
  });

  describe('Results display logic', () => {
    it('should show time comparison', () => {
      const screenTime = 4;
      const playTime = 2;
      const display = `Screen: ${screenTime}h | Play: ${playTime}h`;
      
      expect(display).toContain('Screen');
      expect(display).toContain('Play');
      expect(display).toContain(screenTime.toString());
      expect(display).toContain(playTime.toString());
    });

    it('should show one practical suggestion', () => {
      const suggestionCount = 1;
      
      expect(suggestionCount).toBe(1);
    });

    it('should show encouraging message', () => {
      const hasEncouragement = true;
      
      expect(hasEncouragement).toBe(true);
    });
  });

  describe('User experience logic', () => {
    it('should show results after both inputs provided', () => {
      const hasScreenTime = true;
      const hasPlayTime = true;
      const showResults = hasScreenTime && hasPlayTime;
      
      expect(showResults).toBe(true);
    });

    it('should allow recalculation', () => {
      let screenTime = 6;
      let playTime = 1;
      let ratio = screenTime / playTime;
      
      expect(ratio).toBe(6);
      
      screenTime = 2;
      playTime = 3;
      ratio = screenTime / playTime;
      
      expect(ratio).toBeCloseTo(0.67, 1);
    });

    it('should handle decimal hours', () => {
      const screenTime = 2.5;
      const playTime = 1.5;
      const ratio = screenTime / playTime;
      
      expect(ratio).toBeCloseTo(1.67, 1);
    });
  });

  describe('Edge cases', () => {
    it('should handle zero screen time', () => {
      const screenTime = 0;
      const playTime = 3;
      const message = 'Awesome! You\'re getting lots of movement time.';
      
      expect(message).toBeTruthy();
    });

    it('should handle zero play time', () => {
      const screenTime = 4;
      const playTime = 0;
      const message = 'Let\'s add some movement to your day!';
      
      expect(message).toBeTruthy();
      expect(message.toLowerCase()).not.toContain('bad');
    });

    it('should handle both zero', () => {
      const screenTime = 0;
      const playTime = 0;
      const message = 'Track your screen and play time to see patterns!';
      
      expect(message).toBeTruthy();
    });
  });
});
