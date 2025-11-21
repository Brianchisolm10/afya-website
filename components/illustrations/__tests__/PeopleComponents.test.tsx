/**
 * Tests for modular people component system
 * Testing component logic, constants, and configurations
 */

import { describe, it, expect } from 'vitest';
import {
  SKIN_TONES,
  BODY_TYPE_CONFIG,
  HEIGHT_CONFIG,
  type SkinTone,
  type BodyType,
  type Height,
  type HairStyle,
  type Pose,
} from '../PeopleComponents';

describe('PeopleComponents', () => {
  describe('Skin Tone Constants', () => {
    it('should have exactly 5 skin tone variations', () => {
      const skinToneKeys = Object.keys(SKIN_TONES);
      expect(skinToneKeys).toHaveLength(5);
      expect(skinToneKeys).toEqual(['light', 'lightMedium', 'medium', 'mediumDark', 'dark']);
    });

    it('should have valid hex color values for all skin tones', () => {
      Object.values(SKIN_TONES).forEach(color => {
        expect(color).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    it('should have distinct colors for each skin tone', () => {
      const colors = Object.values(SKIN_TONES);
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(5);
    });

    it('should map skin tone keys to correct color values', () => {
      expect(SKIN_TONES.light).toBe('#FFE0BD');
      expect(SKIN_TONES.lightMedium).toBe('#F1C27D');
      expect(SKIN_TONES.medium).toBe('#C68642');
      expect(SKIN_TONES.mediumDark).toBe('#8D5524');
      expect(SKIN_TONES.dark).toBe('#5C4033');
    });
  });

  describe('Body Type Configuration', () => {
    it('should have exactly 4 body type configurations', () => {
      const bodyTypes = Object.keys(BODY_TYPE_CONFIG);
      expect(bodyTypes).toHaveLength(4);
      expect(bodyTypes).toEqual(['athletic', 'average', 'plus-size', 'slim']);
    });

    it('should have all required properties for each body type', () => {
      Object.values(BODY_TYPE_CONFIG).forEach(config => {
        expect(config).toHaveProperty('torsoWidth');
        expect(config).toHaveProperty('torsoHeight');
        expect(config).toHaveProperty('limbWidth');
        expect(config).toHaveProperty('shoulderWidth');
      });
    });

    it('should have numeric values for all body type properties', () => {
      Object.values(BODY_TYPE_CONFIG).forEach(config => {
        expect(typeof config.torsoWidth).toBe('number');
        expect(typeof config.torsoHeight).toBe('number');
        expect(typeof config.limbWidth).toBe('number');
        expect(typeof config.shoulderWidth).toBe('number');
      });
    });

    it('should have plus-size body type with larger dimensions', () => {
      const plusSize = BODY_TYPE_CONFIG['plus-size'];
      const average = BODY_TYPE_CONFIG.average;
      
      expect(plusSize.torsoWidth).toBeGreaterThan(average.torsoWidth);
      expect(plusSize.shoulderWidth).toBeGreaterThan(average.shoulderWidth);
    });

    it('should have slim body type with smaller dimensions', () => {
      const slim = BODY_TYPE_CONFIG.slim;
      const average = BODY_TYPE_CONFIG.average;
      
      expect(slim.torsoWidth).toBeLessThan(average.torsoWidth);
      expect(slim.shoulderWidth).toBeLessThan(average.shoulderWidth);
    });

    it('should have athletic body type with appropriate proportions', () => {
      const athletic = BODY_TYPE_CONFIG.athletic;
      
      expect(athletic.torsoWidth).toBe(18);
      expect(athletic.torsoHeight).toBe(25);
      expect(athletic.limbWidth).toBe(8);
      expect(athletic.shoulderWidth).toBe(22);
    });
  });

  describe('Height Configuration', () => {
    it('should have exactly 3 height configurations', () => {
      const heights = Object.keys(HEIGHT_CONFIG);
      expect(heights).toHaveLength(3);
      expect(heights).toEqual(['short', 'average', 'tall']);
    });

    it('should have scale and headSize properties for each height', () => {
      Object.values(HEIGHT_CONFIG).forEach(config => {
        expect(config).toHaveProperty('scale');
        expect(config).toHaveProperty('headSize');
      });
    });

    it('should have numeric values for all height properties', () => {
      Object.values(HEIGHT_CONFIG).forEach(config => {
        expect(typeof config.scale).toBe('number');
        expect(typeof config.headSize).toBe('number');
      });
    });

    it('should have short height with scale less than 1', () => {
      expect(HEIGHT_CONFIG.short.scale).toBeLessThan(1);
      expect(HEIGHT_CONFIG.short.scale).toBe(0.9);
    });

    it('should have average height with scale of 1', () => {
      expect(HEIGHT_CONFIG.average.scale).toBe(1.0);
    });

    it('should have tall height with scale greater than 1', () => {
      expect(HEIGHT_CONFIG.tall.scale).toBeGreaterThan(1);
      expect(HEIGHT_CONFIG.tall.scale).toBe(1.1);
    });
  });

  describe('Type Definitions', () => {
    it('should support all skin tone types', () => {
      const skinTones: SkinTone[] = ['light', 'lightMedium', 'medium', 'mediumDark', 'dark'];
      
      skinTones.forEach(tone => {
        expect(SKIN_TONES[tone]).toBeDefined();
      });
    });

    it('should support all body type types', () => {
      const bodyTypes: BodyType[] = ['athletic', 'average', 'plus-size', 'slim'];
      
      bodyTypes.forEach(type => {
        expect(BODY_TYPE_CONFIG[type]).toBeDefined();
      });
    });

    it('should support all height types', () => {
      const heights: Height[] = ['short', 'average', 'tall'];
      
      heights.forEach(height => {
        expect(HEIGHT_CONFIG[height]).toBeDefined();
      });
    });

    it('should support all hair style types', () => {
      const hairStyles: HairStyle[] = ['short', 'medium', 'long', 'curly', 'bald', 'ponytail'];
      
      expect(hairStyles).toHaveLength(6);
    });

    it('should support all pose types', () => {
      const poses: Pose[] = ['standing', 'sitting', 'active', 'stretching'];
      
      expect(poses).toHaveLength(4);
    });
  });

  describe('Component Composition Logic', () => {
    it('should calculate proportional dimensions based on body type', () => {
      const bodyTypes: BodyType[] = ['athletic', 'average', 'plus-size', 'slim'];
      
      bodyTypes.forEach(bodyType => {
        const config = BODY_TYPE_CONFIG[bodyType];
        
        // Shoulder width should be greater than torso width
        expect(config.shoulderWidth).toBeGreaterThan(config.torsoWidth);
        
        // Torso height should be greater than torso width
        expect(config.torsoHeight).toBeGreaterThan(config.torsoWidth);
      });
    });

    it('should scale dimensions based on height', () => {
      const heights: Height[] = ['short', 'average', 'tall'];
      const scales = heights.map(h => HEIGHT_CONFIG[h].scale);
      
      // Scales should be in ascending order
      expect(scales[0]).toBeLessThan(scales[1]);
      expect(scales[1]).toBeLessThan(scales[2]);
    });

    it('should maintain consistent head sizes for average and tall heights', () => {
      expect(HEIGHT_CONFIG.average.headSize).toBe(HEIGHT_CONFIG.tall.headSize);
    });

    it('should have smaller head size for short height', () => {
      expect(HEIGHT_CONFIG.short.headSize).toBeLessThan(HEIGHT_CONFIG.average.headSize);
    });
  });

  describe('Diversity Features', () => {
    it('should provide sufficient skin tone diversity', () => {
      const skinToneCount = Object.keys(SKIN_TONES).length;
      expect(skinToneCount).toBeGreaterThanOrEqual(5);
    });

    it('should provide sufficient body type diversity', () => {
      const bodyTypeCount = Object.keys(BODY_TYPE_CONFIG).length;
      expect(bodyTypeCount).toBeGreaterThanOrEqual(4);
    });

    it('should include plus-size representation', () => {
      expect(BODY_TYPE_CONFIG).toHaveProperty('plus-size');
    });

    it('should include multiple height variations', () => {
      const heightCount = Object.keys(HEIGHT_CONFIG).length;
      expect(heightCount).toBeGreaterThanOrEqual(3);
    });
  });
});
