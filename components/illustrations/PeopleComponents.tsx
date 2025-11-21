/**
 * Modular People Component System
 * Reusable components for creating diverse fitness illustrations
 */

import React from 'react';

// ============================================================================
// CONSTANTS - Skin Tones and Body Types
// ============================================================================

/**
 * Skin tone palette with 5 distinct colors for diversity representation
 */
export const SKIN_TONES = {
  light: '#FFE0BD',      // Light peach
  lightMedium: '#F1C27D', // Tan
  medium: '#C68642',      // Medium brown
  mediumDark: '#8D5524',  // Dark tan
  dark: '#5C4033',        // Deep brown
} as const;

export type SkinTone = keyof typeof SKIN_TONES;

/**
 * Body type variations for inclusive representation
 */
export type BodyType = 'athletic' | 'average' | 'plus-size' | 'slim';

/**
 * Height variations for proportional diversity
 */
export type Height = 'short' | 'average' | 'tall';

/**
 * Hair style options
 */
export type HairStyle = 'short' | 'medium' | 'long' | 'curly' | 'bald' | 'ponytail';

/**
 * Pose options for different activities
 */
export type Pose = 'standing' | 'sitting' | 'active' | 'stretching';

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Body type properties interface
 */
export interface BodyTypeProps {
  type: BodyType;
  height: Height;
}

/**
 * Base person component props
 */
export interface PersonProps {
  skinTone: SkinTone;
  bodyType: BodyType;
  height: Height;
  hairStyle: HairStyle;
  hairColor: string;
  clothingColor: string;
  pose: Pose;
  className?: string;
  x?: number;  // X position for composition
  y?: number;  // Y position for composition
}

/**
 * Head component props
 */
export interface HeadProps {
  skinTone: SkinTone;
  hairStyle: HairStyle;
  hairColor: string;
  x: number;
  y: number;
  size?: number;
}

/**
 * Torso component props
 */
export interface TorsoProps {
  bodyType: BodyType;
  clothingColor: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

/**
 * Limb component props
 */
export interface LimbProps {
  skinTone: SkinTone;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width?: number;
}

// ============================================================================
// BODY TYPE CONFIGURATIONS
// ============================================================================

/**
 * Body type configurations for proportional sizing
 */
export const BODY_TYPE_CONFIG = {
  athletic: {
    torsoWidth: 18,
    torsoHeight: 25,
    limbWidth: 8,
    shoulderWidth: 22,
  },
  average: {
    torsoWidth: 20,
    torsoHeight: 26,
    limbWidth: 7,
    shoulderWidth: 24,
  },
  'plus-size': {
    torsoWidth: 26,
    torsoHeight: 28,
    limbWidth: 9,
    shoulderWidth: 30,
  },
  slim: {
    torsoWidth: 16,
    torsoHeight: 28,
    limbWidth: 6,
    shoulderWidth: 20,
  },
} as const;

/**
 * Height configurations for proportional scaling
 */
export const HEIGHT_CONFIG = {
  short: {
    scale: 0.9,
    headSize: 12,
  },
  average: {
    scale: 1.0,
    headSize: 14,
  },
  tall: {
    scale: 1.1,
    headSize: 14,
  },
} as const;

// ============================================================================
// MODULAR BODY PART COMPONENTS
// ============================================================================

/**
 * Head component with skin tone and hair variations
 */
export const Head: React.FC<HeadProps> = ({
  skinTone,
  hairStyle,
  hairColor,
  x,
  y,
  size = 14,
}) => {
  const skinColor = SKIN_TONES[skinTone];

  // Hair path based on style
  const getHairPath = () => {
    switch (hairStyle) {
      case 'short':
        return `M ${x - size * 0.4} ${y - size * 0.3} Q ${x} ${y - size * 0.6} ${x + size * 0.4} ${y - size * 0.3}`;
      case 'medium':
        return `M ${x - size * 0.5} ${y - size * 0.2} Q ${x} ${y - size * 0.7} ${x + size * 0.5} ${y - size * 0.2} L ${x + size * 0.5} ${y} L ${x - size * 0.5} ${y} Z`;
      case 'long':
        return `M ${x - size * 0.5} ${y - size * 0.2} Q ${x} ${y - size * 0.7} ${x + size * 0.5} ${y - size * 0.2} L ${x + size * 0.5} ${y + size * 0.5} L ${x - size * 0.5} ${y + size * 0.5} Z`;
      case 'curly':
        return `M ${x - size * 0.5} ${y - size * 0.3} Q ${x - size * 0.3} ${y - size * 0.7} ${x} ${y - size * 0.5} Q ${x + size * 0.3} ${y - size * 0.7} ${x + size * 0.5} ${y - size * 0.3}`;
      case 'ponytail':
        return `M ${x - size * 0.4} ${y - size * 0.3} Q ${x} ${y - size * 0.6} ${x + size * 0.4} ${y - size * 0.3} M ${x + size * 0.4} ${y} L ${x + size * 0.7} ${y + size * 0.3}`;
      case 'bald':
        return '';
      default:
        return '';
    }
  };

  return (
    <g>
      {/* Head circle */}
      <circle cx={x} cy={y} r={size} fill={skinColor} />
      
      {/* Hair */}
      {hairStyle !== 'bald' && (
        <path d={getHairPath()} fill={hairColor} stroke={hairColor} strokeWidth="2" />
      )}
    </g>
  );
};

/**
 * Torso component with body type variations
 */
export const Torso: React.FC<TorsoProps> = ({
  bodyType,
  clothingColor,
  x,
  y,
  width,
  height,
}) => {
  const config = BODY_TYPE_CONFIG[bodyType];
  const torsoWidth = width || config.torsoWidth;
  const torsoHeight = height || config.torsoHeight;

  return (
    <ellipse
      cx={x}
      cy={y}
      rx={torsoWidth}
      ry={torsoHeight}
      fill={clothingColor}
    />
  );
};

/**
 * Arm component with proportional sizing
 */
export const Arm: React.FC<LimbProps> = ({
  skinTone,
  x1,
  y1,
  x2,
  y2,
  width = 7,
}) => {
  const skinColor = SKIN_TONES[skinTone];

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={skinColor}
      strokeWidth={width}
      strokeLinecap="round"
    />
  );
};

/**
 * Leg component with proportional sizing
 */
export const Leg: React.FC<LimbProps> = ({
  skinTone,
  x1,
  y1,
  x2,
  y2,
  width = 9,
}) => {
  const skinColor = SKIN_TONES[skinTone];

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={skinColor}
      strokeWidth={width}
      strokeLinecap="round"
    />
  );
};

// ============================================================================
// BASE PERSON COMPONENT
// ============================================================================

/**
 * Base Person component that composes modular body parts
 * Accepts customization for skin tone, body type, hair, and pose
 */
export const Person: React.FC<PersonProps> = ({
  skinTone,
  bodyType,
  height,
  hairStyle,
  hairColor,
  clothingColor,
  pose,
  className = '',
  x = 100,
  y = 100,
}) => {
  const heightConfig = HEIGHT_CONFIG[height];
  const bodyConfig = BODY_TYPE_CONFIG[bodyType];
  const scale = heightConfig.scale;
  const headSize = heightConfig.headSize;

  // Calculate positions based on pose
  const getPositions = () => {
    const baseY = y;
    const headY = baseY - 25 * scale;
    const torsoY = baseY;
    const legStartY = baseY + bodyConfig.torsoHeight * scale;

    switch (pose) {
      case 'standing':
        return {
          head: { x, y: headY },
          torso: { x, y: torsoY },
          leftArm: { x1: x - bodyConfig.torsoWidth * 0.7, y1: torsoY - 5, x2: x - bodyConfig.shoulderWidth, y2: torsoY + 15 },
          rightArm: { x1: x + bodyConfig.torsoWidth * 0.7, y1: torsoY - 5, x2: x + bodyConfig.shoulderWidth, y2: torsoY + 15 },
          leftLeg: { x1: x - 5, y1: legStartY, x2: x - 10, y2: legStartY + 30 * scale },
          rightLeg: { x1: x + 5, y1: legStartY, x2: x + 10, y2: legStartY + 30 * scale },
        };
      case 'sitting':
        return {
          head: { x, y: headY },
          torso: { x, y: torsoY },
          leftArm: { x1: x - bodyConfig.torsoWidth * 0.7, y1: torsoY, x2: x - bodyConfig.shoulderWidth, y2: torsoY + 20 },
          rightArm: { x1: x + bodyConfig.torsoWidth * 0.7, y1: torsoY, x2: x + bodyConfig.shoulderWidth, y2: torsoY + 20 },
          leftLeg: { x1: x - 5, y1: legStartY, x2: x - 20, y2: legStartY + 15 * scale },
          rightLeg: { x1: x + 5, y1: legStartY, x2: x + 20, y2: legStartY + 15 * scale },
        };
      case 'active':
        return {
          head: { x, y: headY },
          torso: { x, y: torsoY },
          leftArm: { x1: x - bodyConfig.torsoWidth * 0.7, y1: torsoY - 5, x2: x - bodyConfig.shoulderWidth - 5, y2: torsoY - 20 },
          rightArm: { x1: x + bodyConfig.torsoWidth * 0.7, y1: torsoY - 5, x2: x + bodyConfig.shoulderWidth + 5, y2: torsoY + 25 },
          leftLeg: { x1: x - 5, y1: legStartY, x2: x - 15, y2: legStartY + 35 * scale },
          rightLeg: { x1: x + 5, y1: legStartY, x2: x + 20, y2: legStartY + 20 * scale },
        };
      case 'stretching':
        return {
          head: { x, y: headY },
          torso: { x, y: torsoY },
          leftArm: { x1: x - bodyConfig.torsoWidth * 0.7, y1: torsoY - 5, x2: x - bodyConfig.shoulderWidth - 10, y2: headY },
          rightArm: { x1: x + bodyConfig.torsoWidth * 0.7, y1: torsoY - 5, x2: x + bodyConfig.shoulderWidth + 10, y2: headY },
          leftLeg: { x1: x - 5, y1: legStartY, x2: x - 15, y2: legStartY + 25 * scale },
          rightLeg: { x1: x + 5, y1: legStartY, x2: x + 15, y2: legStartY + 25 * scale },
        };
      default:
        return {
          head: { x, y: headY },
          torso: { x, y: torsoY },
          leftArm: { x1: x - bodyConfig.torsoWidth * 0.7, y1: torsoY - 5, x2: x - bodyConfig.shoulderWidth, y2: torsoY + 15 },
          rightArm: { x1: x + bodyConfig.torsoWidth * 0.7, y1: torsoY - 5, x2: x + bodyConfig.shoulderWidth, y2: torsoY + 15 },
          leftLeg: { x1: x - 5, y1: legStartY, x2: x - 10, y2: legStartY + 30 * scale },
          rightLeg: { x1: x + 5, y1: legStartY, x2: x + 10, y2: legStartY + 30 * scale },
        };
    }
  };

  const positions = getPositions();

  return (
    <g className={className}>
      {/* Legs (drawn first, behind body) */}
      <Leg
        skinTone={skinTone}
        x1={positions.leftLeg.x1}
        y1={positions.leftLeg.y1}
        x2={positions.leftLeg.x2}
        y2={positions.leftLeg.y2}
        width={bodyConfig.limbWidth}
      />
      <Leg
        skinTone={skinTone}
        x1={positions.rightLeg.x1}
        y1={positions.rightLeg.y1}
        x2={positions.rightLeg.x2}
        y2={positions.rightLeg.y2}
        width={bodyConfig.limbWidth}
      />

      {/* Torso */}
      <Torso
        bodyType={bodyType}
        clothingColor={clothingColor}
        x={positions.torso.x}
        y={positions.torso.y}
      />

      {/* Arms */}
      <Arm
        skinTone={skinTone}
        x1={positions.leftArm.x1}
        y1={positions.leftArm.y1}
        x2={positions.leftArm.x2}
        y2={positions.leftArm.y2}
        width={bodyConfig.limbWidth}
      />
      <Arm
        skinTone={skinTone}
        x1={positions.rightArm.x1}
        y1={positions.rightArm.y1}
        x2={positions.rightArm.x2}
        y2={positions.rightArm.y2}
        width={bodyConfig.limbWidth}
      />

      {/* Head */}
      <Head
        skinTone={skinTone}
        hairStyle={hairStyle}
        hairColor={hairColor}
        x={positions.head.x}
        y={positions.head.y}
        size={headSize}
      />
    </g>
  );
};


// ============================================================================
// EXAMPLE USAGE
// ============================================================================

/**
 * Example: Creating a diverse person illustration
 * 
 * import { Person } from './PeopleComponents';
 * 
 * // Athletic person with medium skin tone
 * <svg viewBox="0 0 200 200">
 *   <Person
 *     skinTone="medium"
 *     bodyType="athletic"
 *     height="tall"
 *     hairStyle="short"
 *     hairColor="#2C1B47"
 *     clothingColor="#FF1493"
 *     pose="active"
 *     x={100}
 *     y={100}
 *   />
 * </svg>
 * 
 * // Plus-size person with dark skin tone
 * <svg viewBox="0 0 200 200">
 *   <Person
 *     skinTone="dark"
 *     bodyType="plus-size"
 *     height="average"
 *     hairStyle="curly"
 *     hairColor="#2C1B47"
 *     clothingColor="#00CED1"
 *     pose="standing"
 *     x={100}
 *     y={100}
 *   />
 * </svg>
 * 
 * // Slim person with light skin tone
 * <svg viewBox="0 0 200 200">
 *   <Person
 *     skinTone="light"
 *     bodyType="slim"
 *     height="short"
 *     hairStyle="ponytail"
 *     hairColor="#8B4513"
 *     clothingColor="#ADFF2F"
 *     pose="stretching"
 *     x={100}
 *     y={100}
 *   />
 * </svg>
 */
