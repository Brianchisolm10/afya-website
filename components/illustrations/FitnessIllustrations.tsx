/**
 * Minimalist Fitness Illustrations
 * Simple SVG-based illustrations matching the fitness theme
 */

import React from 'react';
import { Person, Head, Arm, SKIN_TONES } from './PeopleComponents';

interface IllustrationProps {
  className?: string;
}

// Person doing plank on exercise ball
export const PlankBallIllustration: React.FC<IllustrationProps> = ({ className = 'w-64 h-64' }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Exercise Ball */}
    <circle cx="50" cy="140" r="30" fill="#B0C4DE" opacity="0.8" />
    <ellipse cx="50" cy="140" rx="30" ry="8" fill="#9FA8DA" opacity="0.5" />
    
    {/* Person - Body */}
    <line x1="50" y1="120" x2="120" y2="100" stroke="#FF1493" strokeWidth="12" strokeLinecap="round" />
    
    {/* Legs */}
    <line x1="120" y1="100" x2="140" y2="140" stroke="#FF1493" strokeWidth="10" strokeLinecap="round" />
    
    {/* Arm */}
    <line x1="50" y1="115" x2="30" y2="140" stroke="#FFB6C1" strokeWidth="8" strokeLinecap="round" />
    
    {/* Head */}
    <circle cx="55" cy="105" r="12" fill="#FFB6C1" />
    <path d="M 50 100 Q 55 95 60 100" fill="#2C1B47" />
  </svg>
);

// Person lifting weights - Enhanced with diverse representation
export const WeightLiftingIllustration: React.FC<IllustrationProps> = ({ className = 'w-64 h-64' }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Person lifting weights with proper form"
  >
    <title>Weight Lifting</title>
    <desc>Illustration showing a person performing a barbell lift with proper form</desc>
    
    {/* Barbell */}
    <line x1="60" y1="80" x2="140" y2="80" stroke="#2C1B47" strokeWidth="4" />
    <rect x="55" y="70" width="10" height="20" fill="#2C1B47" rx="2" />
    <rect x="135" y="70" width="10" height="20" fill="#2C1B47" rx="2" />
    
    {/* Person with medium skin tone and average body type */}
    <g>
      {/* Legs */}
      <line x1="95" y1="145" x2="90" y2="170" stroke={SKIN_TONES.medium} strokeWidth="10" strokeLinecap="round" />
      <line x1="105" y1="145" x2="110" y2="170" stroke={SKIN_TONES.medium} strokeWidth="10" strokeLinecap="round" />
      
      {/* Body/Torso */}
      <ellipse cx="100" cy="120" rx="20" ry="26" fill="#FF1493" />
      
      {/* Arms holding barbell */}
      <Arm skinTone="medium" x1={85} y1={110} x2={65} y2={85} width={8} />
      <Arm skinTone="medium" x1={115} y1={110} x2={135} y2={85} width={8} />
      
      {/* Head with short hair */}
      <Head 
        skinTone="medium" 
        hairStyle="short" 
        hairColor="#2C1B47" 
        x={100} 
        y={95} 
        size={14}
      />
    </g>
  </svg>
);

// Person doing squats
export const SquatIllustration: React.FC<IllustrationProps> = ({ className = 'w-64 h-64' }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Person - Body */}
    <ellipse cx="100" cy="130" rx="16" ry="22" fill="#00CED1" />
    
    {/* Arms */}
    <line x1="90" y1="125" x2="70" y2="115" stroke="#FFB6C1" strokeWidth="7" strokeLinecap="round" />
    <line x1="110" y1="125" x2="130" y2="115" stroke="#FFB6C1" strokeWidth="7" strokeLinecap="round" />
    
    {/* Legs (bent) */}
    <path d="M 95 150 Q 85 160 80 175" stroke="#00CED1" strokeWidth="10" strokeLinecap="round" fill="none" />
    <path d="M 105 150 Q 115 160 120 175" stroke="#00CED1" strokeWidth="10" strokeLinecap="round" fill="none" />
    
    {/* Head */}
    <circle cx="100" cy="105" r="13" fill="#FFB6C1" />
    <path d="M 95 100 Q 100 95 105 100" fill="#2C1B47" />
  </svg>
);

// Person running/active - Enhanced with diverse representation
export const RunningIllustration: React.FC<IllustrationProps> = ({ className = 'w-64 h-64' }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Person running with dynamic motion"
  >
    <title>Running</title>
    <desc>Illustration showing a person running with athletic form and dynamic movement</desc>
    
    {/* Motion lines */}
    <line x1="60" y1="100" x2="75" y2="100" stroke="#00CED1" strokeWidth="2" opacity="0.5" />
    <line x1="55" y1="115" x2="70" y2="115" stroke="#00CED1" strokeWidth="2" opacity="0.5" />
    
    {/* Person with dark skin tone and athletic body type */}
    <g>
      {/* Legs (running pose) */}
      <line x1="98" y1="134" x2="85" y2="165" stroke={SKIN_TONES.dark} strokeWidth="9" strokeLinecap="round" />
      <line x1="102" y1="134" x2="120" y2="150" stroke={SKIN_TONES.dark} strokeWidth="9" strokeLinecap="round" />
      
      {/* Body/Torso - athletic build, slightly tilted for running */}
      <ellipse cx="100" cy="110" rx="18" ry="25" fill="#FF1493" transform="rotate(-10 100 110)" />
      
      {/* Arms in running motion */}
      <Arm skinTone="dark" x1={95} y1={105} x2={75} y2={90} width={8} />
      <Arm skinTone="dark" x1={105} y1={115} x2={125} y2={130} width={8} />
      
      {/* Head with short hair */}
      <Head 
        skinTone="dark" 
        hairStyle="short" 
        hairColor="#2C1B47" 
        x={100} 
        y={85} 
        size={12}
      />
    </g>
  </svg>
);

// Dumbbell icon
export const DumbbellIllustration: React.FC<IllustrationProps> = ({ className = 'w-32 h-32' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="35" width="12" height="30" fill="#2C1B47" rx="2" />
    <rect x="78" y="35" width="12" height="30" fill="#2C1B47" rx="2" />
    <line x1="22" y1="50" x2="78" y2="50" stroke="#4A148C" strokeWidth="6" />
    <circle cx="16" cy="50" r="8" fill="#00CED1" />
    <circle cx="84" cy="50" r="8" fill="#00CED1" />
  </svg>
);

// Heart rate / activity icon
export const HeartRateIllustration: React.FC<IllustrationProps> = ({ className = 'w-32 h-32' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M50 75 L30 55 Q20 45 20 35 Q20 20 32 20 Q40 20 50 30 Q60 20 68 20 Q80 20 80 35 Q80 45 70 55 Z" 
      fill="#FF1493" 
      opacity="0.9"
    />
    <path 
      d="M25 50 L35 50 L40 40 L45 60 L50 50 L55 50" 
      stroke="#fff" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// Yoga/stretching pose - Enhanced with diverse representation
export const YogaIllustration: React.FC<IllustrationProps> = ({ className = 'w-64 h-64' }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Person in peaceful yoga meditation pose"
  >
    <title>Yoga Meditation</title>
    <desc>Illustration showing a person in a seated yoga pose with raised arms</desc>
    
    {/* Person with light-medium skin tone and slim body type */}
    <g>
      {/* Legs (crossed in meditation pose) */}
      <path d="M 95 140 Q 85 155 90 165" stroke="#ADFF2F" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M 105 140 Q 115 155 110 165" stroke="#ADFF2F" strokeWidth="8" strokeLinecap="round" fill="none" />
      
      {/* Body/Torso - slim build */}
      <ellipse cx="100" cy="120" rx="16" ry="28" fill="#ADFF2F" opacity="0.8" />
      
      {/* Arms (raised in yoga pose) */}
      <Arm skinTone="lightMedium" x1={95} y1={115} x2={80} y2={85} width={6} />
      <Arm skinTone="lightMedium" x1={105} y1={115} x2={120} y2={85} width={6} />
      
      {/* Head with ponytail */}
      <Head 
        skinTone="lightMedium" 
        hairStyle="ponytail" 
        hairColor="#8B4513" 
        x={100} 
        y={95} 
        size={12}
      />
    </g>
  </svg>
);

// Group of people (community) - Enhanced with diverse representation
export const CommunityIllustration: React.FC<IllustrationProps> = ({ className = 'w-64 h-64' }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Diverse group of people in fitness community"
  >
    <title>Fitness Community</title>
    <desc>Illustration showing three diverse people standing together representing an inclusive fitness community</desc>
    
    {/* Person 1 - Light skin tone, athletic body type */}
    <g>
      {/* Legs */}
      <line x1="67" y1="133" x2="63" y2="155" stroke={SKIN_TONES.light} strokeWidth="7" strokeLinecap="round" />
      <line x1="73" y1="133" x2="77" y2="155" stroke={SKIN_TONES.light} strokeWidth="7" strokeLinecap="round" />
      
      {/* Body */}
      <ellipse cx="70" cy="115" rx="12" ry="18" fill="#FF1493" />
      
      {/* Arms */}
      <Arm skinTone="light" x1={62} y1={110} x2={55} y2={125} width={6} />
      <Arm skinTone="light" x1={78} y1={110} x2={85} y2={125} width={6} />
      
      {/* Head */}
      <Head 
        skinTone="light" 
        hairStyle="medium" 
        hairColor="#8B4513" 
        x={70} 
        y={90} 
        size={10}
      />
    </g>
    
    {/* Person 2 (center, larger) - Medium skin tone, average body type */}
    <g>
      {/* Legs */}
      <line x1="96" y1="132" x2="92" y2="158" stroke={SKIN_TONES.medium} strokeWidth="8" strokeLinecap="round" />
      <line x1="104" y1="132" x2="108" y2="158" stroke={SKIN_TONES.medium} strokeWidth="8" strokeLinecap="round" />
      
      {/* Body */}
      <ellipse cx="100" cy="112" rx="14" ry="20" fill="#00CED1" />
      
      {/* Arms */}
      <Arm skinTone="medium" x1={90} y1={107} x2={82} y2={122} width={7} />
      <Arm skinTone="medium" x1={110} y1={107} x2={118} y2={122} width={7} />
      
      {/* Head */}
      <Head 
        skinTone="medium" 
        hairStyle="curly" 
        hairColor="#2C1B47" 
        x={100} 
        y={85} 
        size={12}
      />
    </g>
    
    {/* Person 3 - Dark skin tone, plus-size body type */}
    <g>
      {/* Legs */}
      <line x1="126" y1="133" x2="122" y2="155" stroke={SKIN_TONES.dark} strokeWidth="9" strokeLinecap="round" />
      <line x1="134" y1="133" x2="138" y2="155" stroke={SKIN_TONES.dark} strokeWidth="9" strokeLinecap="round" />
      
      {/* Body */}
      <ellipse cx="130" cy="115" rx="16" ry="18" fill="#ADFF2F" />
      
      {/* Arms */}
      <Arm skinTone="dark" x1={118} y1={110} x2={110} y2={125} width={7} />
      <Arm skinTone="dark" x1={142} y1={110} x2={150} y2={125} width={7} />
      
      {/* Head */}
      <Head 
        skinTone="dark" 
        hairStyle="short" 
        hairColor="#2C1B47" 
        x={130} 
        y={90} 
        size={10}
      />
    </g>
  </svg>
);

// Deadlift illustration - Strength training
export const DeadliftIllustration: React.FC<IllustrationProps> = ({ className = 'w-64 h-64' }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Person performing deadlift with proper form showing straight back and hip hinge"
  >
    <title>Deadlift Exercise</title>
    <desc>Illustration showing a person performing a deadlift with proper form, including straight back and hip hinge position</desc>
    
    {/* Barbell on ground */}
    <line x1="60" y1="145" x2="140" y2="145" stroke="#2C1B47" strokeWidth="5" />
    <rect x="55" y="135" width="12" height="20" fill="#2C1B47" rx="2" />
    <rect x="133" y="135" width="12" height="20" fill="#2C1B47" rx="2" />
    
    {/* Person with medium-dark skin tone and athletic body type in deadlift position */}
    <g>
      {/* Legs (bent at knees, hip-width apart) */}
      <line x1="92" y1="125" x2="85" y2="145" stroke={SKIN_TONES.mediumDark} strokeWidth="10" strokeLinecap="round" />
      <line x1="108" y1="125" x2="115" y2="145" stroke={SKIN_TONES.mediumDark} strokeWidth="10" strokeLinecap="round" />
      
      {/* Body/Torso - athletic build, angled forward for deadlift */}
      <ellipse cx="100" cy="105" rx="18" ry="25" fill="#00CED1" transform="rotate(15 100 105)" />
      
      {/* Arms reaching down to barbell (straight arms) */}
      <Arm skinTone="mediumDark" x1={88} y1={110} x2={70} y2={140} width={8} />
      <Arm skinTone="mediumDark" x1={112} y1={110} x2={130} y2={140} width={8} />
      
      {/* Head looking forward (proper form) */}
      <Head 
        skinTone="mediumDark" 
        hairStyle="short" 
        hairColor="#2C1B47" 
        x={100} 
        y={80} 
        size={13}
      />
    </g>
    
    {/* Form indicator line (straight back) */}
    <line x1="100" y1="80" x2="100" y2="120" stroke="#FF1493" strokeWidth="2" strokeDasharray="4 2" opacity="0.3" />
  </svg>
);

// Push-up illustration - Strength training
export const PushUpIllustration: React.FC<IllustrationProps> = ({ className = 'w-64 h-64' }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Person in push-up plank position with straight body alignment"
  >
    <title>Push-Up Exercise</title>
    <desc>Illustration showing a person in push-up plank position with proper alignment and straight body line</desc>
    
    {/* Ground line */}
    <line x1="40" y1="145" x2="160" y2="145" stroke="#E0E0E0" strokeWidth="2" opacity="0.5" />
    
    {/* Person with light skin tone and average body type in plank position */}
    <g>
      {/* Legs (straight, together) */}
      <line x1="130" y1="115" x2="150" y2="140" stroke={SKIN_TONES.light} strokeWidth="9" strokeLinecap="round" />
      <line x1="135" y1="115" x2="155" y2="140" stroke={SKIN_TONES.light} strokeWidth="9" strokeLinecap="round" />
      
      {/* Body/Torso - average build, horizontal for plank */}
      <ellipse cx="100" cy="110" rx="20" ry="26" fill="#FF1493" transform="rotate(-10 100 110)" />
      
      {/* Arms (supporting body weight) */}
      <Arm skinTone="light" x1={85} y1={105} x2={60} y2={140} width={8} />
      <Arm skinTone="light" x1={80} y1={108} x2={55} y2={143} width={8} />
      
      {/* Head looking down (proper form) */}
      <Head 
        skinTone="light" 
        hairStyle="medium" 
        hairColor="#8B4513" 
        x={90} 
        y={85} 
        size={12}
      />
    </g>
    
    {/* Form indicator line (straight body) */}
    <line x1="90" y1="85" x2="145" y2="130" stroke="#00CED1" strokeWidth="2" strokeDasharray="4 2" opacity="0.3" />
  </svg>
);

// Lunge illustration - Strength training
export const LungeIllustration: React.FC<IllustrationProps> = ({ className = 'w-64 h-64' }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Person performing forward lunge with 90-degree angles and upright torso"
  >
    <title>Lunge Exercise</title>
    <desc>Illustration showing a person performing a forward lunge with proper form, including 90-degree angles at both knees and upright torso</desc>
    
    {/* Ground line */}
    <line x1="40" y1="170" x2="160" y2="170" stroke="#E0E0E0" strokeWidth="2" opacity="0.5" />
    
    {/* Person with dark skin tone and plus-size body type in lunge position */}
    <g>
      {/* Front leg (bent at 90 degrees) */}
      <line x1="85" y1="130" x2="70" y2="165" stroke={SKIN_TONES.dark} strokeWidth="11" strokeLinecap="round" />
      
      {/* Back leg (bent, knee toward ground) */}
      <line x1="105" y1="130" x2="130" y2="160" stroke={SKIN_TONES.dark} strokeWidth="11" strokeLinecap="round" />
      
      {/* Body/Torso - plus-size build, upright */}
      <ellipse cx="95" cy="105" rx="26" ry="28" fill="#ADFF2F" />
      
      {/* Arms (at sides for balance) */}
      <Arm skinTone="dark" x1={75} y1={100} x2={60} y2={115} width={9} />
      <Arm skinTone="dark" x1={115} y1={100} x2={130} y2={115} width={9} />
      
      {/* Head looking forward */}
      <Head 
        skinTone="dark" 
        hairStyle="curly" 
        hairColor="#2C1B47" 
        x={95} 
        y={75} 
        size={14}
      />
    </g>
    
    {/* Form indicator lines (90-degree angles) */}
    <circle cx="70" cy="150" r="3" fill="#FF1493" opacity="0.5" />
    <circle cx="115" cy="145" r="3" fill="#FF1493" opacity="0.5" />
  </svg>
);

// Side plank illustration - Strength training
export const PlankVariationIllustration: React.FC<IllustrationProps> = ({ className = 'w-64 h-64' }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Person in side plank position with straight body and stacked feet"
  >
    <title>Side Plank Exercise</title>
    <desc>Illustration showing a person in side plank position with proper form, including straight body alignment and stacked feet</desc>
    
    {/* Ground line */}
    <line x1="40" y1="150" x2="160" y2="150" stroke="#E0E0E0" strokeWidth="2" opacity="0.5" />
    
    {/* Person with medium skin tone and slim body type in side plank */}
    <g>
      {/* Legs (stacked, straight) */}
      <line x1="120" y1="110" x2="140" y2="145" stroke={SKIN_TONES.medium} strokeWidth="7" strokeLinecap="round" />
      <line x1="122" y1="110" x2="142" y2="145" stroke={SKIN_TONES.medium} strokeWidth="7" strokeLinecap="round" />
      
      {/* Body/Torso - slim build, on side */}
      <ellipse cx="95" cy="105" rx="16" ry="28" fill="#00CED1" transform="rotate(-25 95 105)" />
      
      {/* Bottom arm (supporting) */}
      <Arm skinTone="medium" x1={85} y1={100} x2={70} y2={145} width={7} />
      
      {/* Top arm (raised for balance) */}
      <Arm skinTone="medium" x1={95} y1={95} x2={95} y2={65} width={6} />
      
      {/* Head looking forward */}
      <Head 
        skinTone="medium" 
        hairStyle="ponytail" 
        hairColor="#2C1B47" 
        x={85} 
        y={80} 
        size={12}
      />
    </g>
    
    {/* Form indicator line (straight body) */}
    <line x1="85" y1="80" x2="135" y2="135" stroke="#FF1493" strokeWidth="2" strokeDasharray="4 2" opacity="0.3" />
  </svg>
);

// Kettlebell swing illustration - Strength training
export const KettlebellSwingIllustration: React.FC<IllustrationProps> = ({ className = 'w-64 h-64' }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Person swinging kettlebell with dynamic movement and proper form"
  >
    <title>Kettlebell Swing Exercise</title>
    <desc>Illustration showing a person performing a kettlebell swing with dynamic movement indicated by motion lines</desc>
    
    {/* Motion lines */}
    <path d="M 85 70 Q 90 65 95 70" stroke="#FF1493" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
    <path d="M 80 75 Q 85 70 90 75" stroke="#FF1493" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
    <path d="M 75 80 Q 80 75 85 80" stroke="#FF1493" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
    
    {/* Kettlebell */}
    <circle cx="100" cy="75" r="10" fill="#2C1B47" />
    <ellipse cx="100" cy="68" rx="8" ry="4" fill="#4A148C" />
    <path d="M 95 68 Q 100 60 105 68" stroke="#2C1B47" strokeWidth="3" fill="none" />
    
    {/* Person with light-medium skin tone and athletic body type swinging kettlebell */}
    <g>
      {/* Legs (athletic stance, slightly bent) */}
      <line x1="95" y1="140" x2="85" y2="165" stroke={SKIN_TONES.lightMedium} strokeWidth="9" strokeLinecap="round" />
      <line x1="105" y1="140" x2="115" y2="165" stroke={SKIN_TONES.lightMedium} strokeWidth="9" strokeLinecap="round" />
      
      {/* Body/Torso - athletic build, slightly hinged */}
      <ellipse cx="100" cy="120" rx="18" ry="25" fill="#ADFF2F" transform="rotate(5 100 120)" />
      
      {/* Arms (extended, holding kettlebell at top of swing) */}
      <Arm skinTone="lightMedium" x1={92} y1={110} x2={95} y2={80} width={8} />
      <Arm skinTone="lightMedium" x1={108} y1={110} x2={105} y2={80} width={8} />
      
      {/* Head looking forward */}
      <Head 
        skinTone="lightMedium" 
        hairStyle="short" 
        hairColor="#8B4513" 
        x={100} 
        y={90} 
        size={13}
      />
    </g>
    
    {/* Ground line */}
    <line x1="60" y1="170" x2="140" y2="170" stroke="#E0E0E0" strokeWidth="2" opacity="0.5" />
  </svg>
);

// Cycling illustration - Cardio activity
export const CyclingIllustration: React.FC<IllustrationProps> = ({ className = 'w-64 h-64' }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Person cycling on stationary bike with proper posture"
  >
    <title>Cycling Exercise</title>
    <desc>Illustration showing a person on a stationary bike with pedaling motion and proper posture</desc>
    
    {/* Bike frame */}
    <line x1="80" y1="140" x2="120" y2="140" stroke="#2C1B47" strokeWidth="4" />
    <line x1="80" y1="140" x2="90" y2="110" stroke="#2C1B47" strokeWidth="4" />
    <line x1="120" y1="140" x2="110" y2="110" stroke="#2C1B47" strokeWidth="4" />
    
    {/* Handlebars */}
    <line x1="90" y1="110" x2="85" y2="105" stroke="#2C1B47" strokeWidth="3" />
    <line x1="90" y1="110" x2="95" y2="105" stroke="#2C1B47" strokeWidth="3" />
    
    {/* Seat */}
    <ellipse cx="110" cy="108" rx="8" ry="4" fill="#4A148C" />
    
    {/* Wheels */}
    <circle cx="80" cy="150" r="15" stroke="#2C1B47" strokeWidth="3" fill="none" />
    <circle cx="120" cy="150" r="15" stroke="#2C1B47" strokeWidth="3" fill="none" />
    <line x1="80" y1="150" x2="85" y2="155" stroke="#2C1B47" strokeWidth="2" />
    <line x1="120" y1="150" x2="125" y2="155" stroke="#2C1B47" strokeWidth="2" />
    
    {/* Person with medium-dark skin tone and average body type */}
    <g>
      {/* Legs (pedaling motion) */}
      <line x1="108" y1="120" x2="95" y2="145" stroke={SKIN_TONES.mediumDark} strokeWidth="9" strokeLinecap="round" />
      <line x1="112" y1="120" x2="115" y2="150" stroke={SKIN_TONES.mediumDark} strokeWidth="9" strokeLinecap="round" />
      
      {/* Body/Torso - average build, leaning forward */}
      <ellipse cx="100" cy="100" rx="16" ry="22" fill="#00CED1" transform="rotate(-15 100 100)" />
      
      {/* Arms (holding handlebars) */}
      <Arm skinTone="mediumDark" x1={95} y1={95} x2={88} y2={108} width={7} />
      <Arm skinTone="mediumDark" x1={100} y1={95} x2={93} y2={108} width={7} />
      
      {/* Head looking forward */}
      <Head 
        skinTone="mediumDark" 
        hairStyle="short" 
        hairColor="#2C1B47" 
        x={95} 
        y={75} 
        size={12}
      />
    </g>
    
    {/* Motion lines */}
    <path d="M 75 145 Q 70 150 75 155" stroke="#00CED1" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
    <path d="M 115 145 Q 110 150 115 155" stroke="#00CED1" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
  </svg>
);

// Jump rope illustration - Cardio activity
export const JumpRopeIllustration: React.FC<IllustrationProps> = ({ className = 'w-64 h-64' }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Person jumping rope mid-jump with dynamic motion"
  >
    <title>Jump Rope Exercise</title>
    <desc>Illustration showing a person jumping rope mid-jump with motion lines indicating dynamic movement</desc>
    
    {/* Jump rope */}
    <path 
      d="M 60 100 Q 100 50 140 100" 
      stroke="#FF1493" 
      strokeWidth="3" 
      fill="none"
      strokeLinecap="round"
    />
    
    {/* Rope handles */}
    <rect x="58" y="95" width="4" height="12" fill="#2C1B47" rx="2" />
    <rect x="138" y="95" width="4" height="12" fill="#2C1B47" rx="2" />
    
    {/* Person with light skin tone and slim body type mid-jump */}
    <g>
      {/* Legs (bent, off ground) */}
      <line x1="95" y1="125" x2="90" y2="140" stroke={SKIN_TONES.light} strokeWidth="7" strokeLinecap="round" />
      <line x1="105" y1="125" x2="110" y2="140" stroke={SKIN_TONES.light} strokeWidth="7" strokeLinecap="round" />
      
      {/* Body/Torso - slim build, upright */}
      <ellipse cx="100" cy="105" rx="14" ry="24" fill="#ADFF2F" />
      
      {/* Arms (holding rope handles) */}
      <Arm skinTone="light" x1={90} y1={100} x2={62} y2={102} width={6} />
      <Arm skinTone="light" x1={110} y1={100} x2={138} y2={102} width={6} />
      
      {/* Head looking forward */}
      <Head 
        skinTone="light" 
        hairStyle="ponytail" 
        hairColor="#8B4513" 
        x={100} 
        y={78} 
        size={11}
      />
    </g>
    
    {/* Motion lines (jumping) */}
    <line x1="85" y1="145" x2="85" y2="155" stroke="#00CED1" strokeWidth="2" opacity="0.4" />
    <line x1="100" y1="145" x2="100" y2="155" stroke="#00CED1" strokeWidth="2" opacity="0.4" />
    <line x1="115" y1="145" x2="115" y2="155" stroke="#00CED1" strokeWidth="2" opacity="0.4" />
    
    {/* Ground line */}
    <line x1="60" y1="160" x2="140" y2="160" stroke="#E0E0E0" strokeWidth="2" opacity="0.5" />
  </svg>
);

// Dance fitness illustration - Cardio activity
export const DanceFitnessIllustration: React.FC<IllustrationProps> = ({ className = 'w-64 h-64' }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Person in dynamic dance pose showing joyful movement and energy"
  >
    <title>Dance Fitness</title>
    <desc>Illustration showing a person in a dynamic dance pose with joyful movement and energy</desc>
    
    {/* Motion/energy lines */}
    <path d="M 60 90 Q 65 85 70 90" stroke="#FF1493" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
    <path d="M 130 110 Q 135 105 140 110" stroke="#FF1493" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
    <path d="M 55 120 Q 60 115 65 120" stroke="#00CED1" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
    
    {/* Musical notes for energy */}
    <circle cx="145" cy="85" r="3" fill="#ADFF2F" opacity="0.6" />
    <ellipse cx="145" cy="92" rx="2" ry="3" fill="#ADFF2F" opacity="0.6" />
    <circle cx="155" cy="95" r="3" fill="#FF1493" opacity="0.6" />
    <ellipse cx="155" cy="102" rx="2" ry="3" fill="#FF1493" opacity="0.6" />
    
    {/* Person with dark skin tone and plus-size body type in dance pose */}
    <g>
      {/* Legs (dynamic dance stance) */}
      <line x1="92" y1="135" x2="80" y2="165" stroke={SKIN_TONES.dark} strokeWidth="11" strokeLinecap="round" />
      <line x1="108" y1="135" x2="120" y2="160" stroke={SKIN_TONES.dark} strokeWidth="11" strokeLinecap="round" />
      
      {/* Body/Torso - plus-size build, tilted for dance movement */}
      <ellipse cx="100" cy="110" rx="24" ry="28" fill="#FF1493" transform="rotate(-8 100 110)" />
      
      {/* Arms (expressive dance pose) */}
      <Arm skinTone="dark" x1={85} y1={105} x2={65} y2={90} width={9} />
      <Arm skinTone="dark" x1={115} y1={105} x2={135} y2={115} width={9} />
      
      {/* Head with joyful expression */}
      <Head 
        skinTone="dark" 
        hairStyle="curly" 
        hairColor="#2C1B47" 
        x={100} 
        y={80} 
        size={14}
      />
      
      {/* Smile indicator */}
      <path d="M 95 85 Q 100 88 105 85" stroke="#2C1B47" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
    
    {/* Ground line */}
    <line x1="60" y1="170" x2="140" y2="170" stroke="#E0E0E0" strokeWidth="2" opacity="0.5" />
  </svg>
);

// Warrior II Pose illustration - Yoga & Flexibility
export const WarriorPoseIllustration: React.FC<IllustrationProps> = ({ className = 'w-64 h-64' }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Person in warrior II yoga pose with proper alignment and balance"
  >
    <title>Warrior II Yoga Pose</title>
    <desc>Illustration showing a person in warrior II yoga pose with arms extended, front knee bent, and proper alignment demonstrating balance and strength</desc>
    
    {/* Ground line */}
    <line x1="40" y1="165" x2="160" y2="165" stroke="#E0E0E0" strokeWidth="2" opacity="0.5" />
    
    {/* Person with medium skin tone and athletic body type in warrior II */}
    <g>
      {/* Front leg (bent at 90 degrees) */}
      <line x1="85" y1="130" x2="70" y2="160" stroke={SKIN_TONES.medium} strokeWidth="9" strokeLinecap="round" />
      
      {/* Back leg (straight, extended) */}
      <line x1="105" y1="130" x2="130" y2="160" stroke={SKIN_TONES.medium} strokeWidth="9" strokeLinecap="round" />
      
      {/* Body/Torso - athletic build, upright and centered */}
      <ellipse cx="95" cy="105" rx="18" ry="26" fill="#00CED1" />
      
      {/* Arms (extended horizontally in opposite directions) */}
      <Arm skinTone="medium" x1={80} y1={100} x2={50} y2={100} width={8} />
      <Arm skinTone="medium" x1={110} y1={100} x2={140} y2={100} width={8} />
      
      {/* Head looking over front arm */}
      <Head 
        skinTone="medium" 
        hairStyle="ponytail" 
        hairColor="#2C1B47" 
        x={95} 
        y={75} 
        size={13}
      />
    </g>
    
    {/* Balance indicator - subtle energy lines */}
    <circle cx="95" cy="105" r="45" stroke="#ADFF2F" strokeWidth="1" opacity="0.2" />
  </svg>
);

// Child's Pose illustration - Yoga & Flexibility
export const ChildPoseIllustration: React.FC<IllustrationProps> = ({ className = 'w-64 h-64' }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Person in child's pose showing relaxed, restorative resting position"
  >
    <title>Child's Pose</title>
    <desc>Illustration showing a person in child's pose, a relaxed and restorative yoga position with knees bent and torso folded forward</desc>
    
    {/* Ground/mat line */}
    <line x1="50" y1="155" x2="150" y2="155" stroke="#E0E0E0" strokeWidth="2" opacity="0.5" />
    
    {/* Person with light-medium skin tone and average body type in child's pose */}
    <g>
      {/* Folded legs (knees bent, sitting on heels) */}
      <ellipse cx="100" cy="140" rx="28" ry="18" fill="#ADFF2F" opacity="0.8" />
      
      {/* Body/Torso - average build, folded forward over legs */}
      <ellipse cx="100" cy="120" rx="24" ry="20" fill="#ADFF2F" transform="rotate(-5 100 120)" />
      
      {/* Arms (extended forward on ground) */}
      <Arm skinTone="lightMedium" x1={95} y1={115} x2={75} y2={145} width={7} />
      <Arm skinTone="lightMedium" x1={105} y1={115} x2={125} y2={145} width={7} />
      
      {/* Head (resting, facing down) */}
      <ellipse cx="100" cy="110" rx="11" ry="9" fill={SKIN_TONES.lightMedium} />
      
      {/* Hair visible */}
      <ellipse cx="100" cy="108" rx="12" ry="7" fill="#8B4513" />
    </g>
    
    {/* Peaceful energy indicator */}
    <circle cx="100" cy="125" r="50" stroke="#00CED1" strokeWidth="1" opacity="0.15" />
    <circle cx="100" cy="125" r="60" stroke="#00CED1" strokeWidth="1" opacity="0.1" />
  </svg>
);

// Tree Pose illustration - Yoga & Flexibility
export const TreePoseIllustration: React.FC<IllustrationProps> = ({ className = 'w-64 h-64' }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Person in tree balance pose demonstrating focus and stability"
  >
    <title>Tree Pose</title>
    <desc>Illustration showing a person in tree pose, a standing balance yoga position with one foot placed on the inner thigh and hands in prayer position</desc>
    
    {/* Ground line */}
    <line x1="70" y1="165" x2="130" y2="165" stroke="#E0E0E0" strokeWidth="2" opacity="0.5" />
    
    {/* Person with dark skin tone and slim body type in tree pose */}
    <g>
      {/* Standing leg (straight, grounded) */}
      <line x1="100" y1="130" x2="100" y2="160" stroke={SKIN_TONES.dark} strokeWidth="8" strokeLinecap="round" />
      
      {/* Bent leg (foot on inner thigh) */}
      <path 
        d="M 100 130 Q 115 125 120 115" 
        stroke={SKIN_TONES.dark} 
        strokeWidth="7" 
        strokeLinecap="round" 
        fill="none"
      />
      
      {/* Body/Torso - slim build, upright and centered */}
      <ellipse cx="100" cy="105" rx="15" ry="28" fill="#FF1493" />
      
      {/* Arms (in prayer position at chest) */}
      <Arm skinTone="dark" x1={92} y1={100} x2={85} y2={105} width={6} />
      <Arm skinTone="dark" x1={108} y1={100} x2={115} y2={105} width={6} />
      
      {/* Hands together (prayer position) */}
      <ellipse cx="100" cy="100" rx="6" ry="8" fill={SKIN_TONES.dark} />
      
      {/* Head looking forward with focus */}
      <Head 
        skinTone="dark" 
        hairStyle="short" 
        hairColor="#2C1B47" 
        x={100} 
        y={72} 
        size={12}
      />
    </g>
    
    {/* Balance/focus indicators - subtle lines */}
    <line x1="100" y1="70" x2="100" y2="165" stroke="#ADFF2F" strokeWidth="1" strokeDasharray="3 3" opacity="0.2" />
    <circle cx="100" cy="100" r="40" stroke="#00CED1" strokeWidth="1" opacity="0.15" />
  </svg>
);

// Foam rolling illustration - Recovery & Wellness
export const FoamRollingIllustration: React.FC<IllustrationProps> = ({ className = 'w-64 h-64' }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Person using foam roller on leg showing proper recovery technique"
  >
    <title>Foam Rolling Recovery</title>
    <desc>Illustration showing a person using a foam roller on their leg, demonstrating proper foam rolling technique for muscle recovery</desc>
    
    {/* Ground/mat line */}
    <line x1="40" y1="155" x2="160" y2="155" stroke="#E0E0E0" strokeWidth="2" opacity="0.5" />
    
    {/* Foam roller */}
    <rect x="75" y="135" width="40" height="12" fill="#4A148C" rx="6" />
    <ellipse cx="95" cy="141" rx="20" ry="4" fill="#6A1B9A" opacity="0.5" />
    
    {/* Person with medium-dark skin tone and athletic body type using foam roller */}
    <g>
      {/* Supporting leg (bent, on ground) */}
      <line x1="120" y1="130" x2="135" y2="150" stroke={SKIN_TONES.mediumDark} strokeWidth="9" strokeLinecap="round" />
      
      {/* Leg on foam roller */}
      <line x1="85" y1="125" x2="95" y2="140" stroke={SKIN_TONES.mediumDark} strokeWidth="10" strokeLinecap="round" />
      
      {/* Body/Torso - athletic build, propped up on side */}
      <ellipse cx="105" cy="110" rx="18" ry="24" fill="#00CED1" transform="rotate(-20 105 110)" />
      
      {/* Supporting arm (propping up body) */}
      <Arm skinTone="mediumDark" x1={95} y1={105} x2={75} y2={145} width={8} />
      
      {/* Other arm (for balance) */}
      <Arm skinTone="mediumDark" x1={110} y1={105} x2={125} y2={115} width={7} />
      
      {/* Head looking down at leg */}
      <Head 
        skinTone="mediumDark" 
        hairStyle="short" 
        hairColor="#2C1B47" 
        x={100} 
        y={85} 
        size={13}
      />
    </g>
    
    {/* Recovery/wellness indicator - gentle waves */}
    <path d="M 70 125 Q 75 120 80 125" stroke="#ADFF2F" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
    <path d="M 65 130 Q 70 125 75 130" stroke="#ADFF2F" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
  </svg>
);

// Hydration illustration - Recovery & Wellness
export const HydrationIllustration: React.FC<IllustrationProps> = ({ className = 'w-64 h-64' }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Person drinking water from bottle showing healthy hydration habit"
  >
    <title>Hydration</title>
    <desc>Illustration showing a person drinking water from a bottle, demonstrating healthy hydration habits for wellness and recovery</desc>
    
    {/* Water bottle */}
    <g>
      {/* Bottle body */}
      <rect x="115" y="85" width="18" height="35" fill="#00CED1" opacity="0.3" rx="2" />
      <rect x="115" y="85" width="18" height="15" fill="#00CED1" opacity="0.5" rx="2" />
      
      {/* Bottle cap */}
      <rect x="118" y="80" width="12" height="6" fill="#2C1B47" rx="1" />
      
      {/* Water level indicator */}
      <line x1="117" y1="95" x2="131" y2="95" stroke="#00CED1" strokeWidth="1" opacity="0.6" />
      
      {/* Bottle highlights */}
      <line x1="120" y1="88" x2="120" y2="115" stroke="#fff" strokeWidth="1.5" opacity="0.4" />
    </g>
    
    {/* Person with light skin tone and plus-size body type drinking water */}
    <g>
      {/* Legs (standing) */}
      <line x1="92" y1="140" x2="85" y2="165" stroke={SKIN_TONES.light} strokeWidth="11" strokeLinecap="round" />
      <line x1="108" y1="140" x2="115" y2="165" stroke={SKIN_TONES.light} strokeWidth="11" strokeLinecap="round" />
      
      {/* Body/Torso - plus-size build, upright */}
      <ellipse cx="100" cy="115" rx="26" ry="28" fill="#FF1493" />
      
      {/* Arm holding bottle */}
      <Arm skinTone="light" x1={110} y1={105} x2={120} y2={90} width={9} />
      
      {/* Other arm (at side) */}
      <Arm skinTone="light" x1={80} y1={110} x2={70} y2={125} width={9} />
      
      {/* Head tilted back slightly for drinking */}
      <Head 
        skinTone="light" 
        hairStyle="curly" 
        hairColor="#8B4513" 
        x={100} 
        y={85} 
        size={14}
      />
    </g>
    
    {/* Water droplets for emphasis */}
    <circle cx="125" cy="75" r="2" fill="#00CED1" opacity="0.6" />
    <circle cx="130" cy="78" r="1.5" fill="#00CED1" opacity="0.5" />
    <circle cx="122" cy="72" r="1.5" fill="#00CED1" opacity="0.5" />
    
    {/* Wellness indicator - gentle glow */}
    <circle cx="100" cy="110" r="50" stroke="#ADFF2F" strokeWidth="1" opacity="0.15" />
    
    {/* Ground line */}
    <line x1="60" y1="170" x2="140" y2="170" stroke="#E0E0E0" strokeWidth="2" opacity="0.5" />
  </svg>
);

// Group fitness class illustration - Group & Community
export const GroupClassIllustration: React.FC<IllustrationProps> = ({ className = 'w-64 h-64' }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Diverse group of people in fitness class showing inclusivity and community"
  >
    <title>Group Fitness Class</title>
    <desc>Illustration showing 4-5 diverse people in a fitness class setting with varied skin tones, body types, and gender presentations, emphasizing inclusivity and community engagement</desc>
    
    {/* Ground/floor line */}
    <line x1="20" y1="170" x2="180" y2="170" stroke="#E0E0E0" strokeWidth="2" opacity="0.5" />
    
    {/* Person 1 (Front Left) - Light skin tone, athletic body type, short hair */}
    <g>
      {/* Legs in active stance */}
      <line x1="52" y1="145" x2="48" y2="165" stroke={SKIN_TONES.light} strokeWidth="8" strokeLinecap="round" />
      <line x1="60" y1="145" x2="64" y2="165" stroke={SKIN_TONES.light} strokeWidth="8" strokeLinecap="round" />
      
      {/* Body/Torso - athletic build */}
      <ellipse cx="56" cy="125" rx="16" ry="22" fill="#FF1493" />
      
      {/* Arms in active pose */}
      <Arm skinTone="light" x1={46} y1={120} x2={35} y2={110} width={7} />
      <Arm skinTone="light" x1={66} y1={120} x2={77} y2={130} width={7} />
      
      {/* Head */}
      <Head 
        skinTone="light" 
        hairStyle="short" 
        hairColor="#8B4513" 
        x={56} 
        y={100} 
        size={11}
      />
    </g>
    
    {/* Person 2 (Front Center) - Medium skin tone, average body type, curly hair */}
    <g>
      {/* Legs in active stance */}
      <line x1="92" y1="145" x2="88" y2="165" stroke={SKIN_TONES.medium} strokeWidth="9" strokeLinecap="round" />
      <line x1="100" y1="145" x2="104" y2="165" stroke={SKIN_TONES.medium} strokeWidth="9" strokeLinecap="round" />
      
      {/* Body/Torso - average build */}
      <ellipse cx="96" cy="125" rx="18" ry="24" fill="#00CED1" />
      
      {/* Arms in active pose */}
      <Arm skinTone="medium" x1={84} y1={120} x2={72} y2={108} width={8} />
      <Arm skinTone="medium" x1={108} y1={120} x2={120} y2={132} width={8} />
      
      {/* Head */}
      <Head 
        skinTone="medium" 
        hairStyle="curly" 
        hairColor="#2C1B47" 
        x={96} 
        y={98} 
        size={12}
      />
    </g>
    
    {/* Person 3 (Front Right) - Dark skin tone, plus-size body type, medium hair */}
    <g>
      {/* Legs in active stance */}
      <line x1="132" y1="145" x2="128" y2="165" stroke={SKIN_TONES.dark} strokeWidth="10" strokeLinecap="round" />
      <line x1="140" y1="145" x2="144" y2="165" stroke={SKIN_TONES.dark} strokeWidth="10" strokeLinecap="round" />
      
      {/* Body/Torso - plus-size build */}
      <ellipse cx="136" cy="125" rx="24" ry="26" fill="#ADFF2F" />
      
      {/* Arms in active pose */}
      <Arm skinTone="dark" x1={120} y1={120} x2={108} y2={110} width={9} />
      <Arm skinTone="dark" x1={152} y1={120} x2={164} y2={130} width={9} />
      
      {/* Head */}
      <Head 
        skinTone="dark" 
        hairStyle="medium" 
        hairColor="#2C1B47" 
        x={136} 
        y={98} 
        size={12}
      />
    </g>
    
    {/* Person 4 (Back Left) - Light-medium skin tone, slim body type, ponytail */}
    <g>
      {/* Legs in active stance (partially visible behind others) */}
      <line x1="38" y1="125" x2="34" y2="145" stroke={SKIN_TONES.lightMedium} strokeWidth="7" strokeLinecap="round" />
      <line x1="46" y1="125" x2="50" y2="145" stroke={SKIN_TONES.lightMedium} strokeWidth="7" strokeLinecap="round" />
      
      {/* Body/Torso - slim build */}
      <ellipse cx="42" cy="105" rx="14" ry="22" fill="#FF1493" opacity="0.8" />
      
      {/* Arms in active pose */}
      <Arm skinTone="lightMedium" x1={34} y1={100} x2={24} y2={90} width={6} />
      <Arm skinTone="lightMedium" x1={50} y1={100} x2={60} y2={110} width={6} />
      
      {/* Head */}
      <Head 
        skinTone="lightMedium" 
        hairStyle="ponytail" 
        hairColor="#8B4513" 
        x={42} 
        y={82} 
        size={10}
      />
    </g>
    
    {/* Person 5 (Back Right) - Medium-dark skin tone, athletic body type, short hair */}
    <g>
      {/* Legs in active stance (partially visible behind others) */}
      <line x1="152" y1="125" x2="148" y2="145" stroke={SKIN_TONES.mediumDark} strokeWidth="8" strokeLinecap="round" />
      <line x1="160" y1="125" x2="164" y2="145" stroke={SKIN_TONES.mediumDark} strokeWidth="8" strokeLinecap="round" />
      
      {/* Body/Torso - athletic build */}
      <ellipse cx="156" cy="105" rx="16" ry="22" fill="#00CED1" opacity="0.8" />
      
      {/* Arms in active pose */}
      <Arm skinTone="mediumDark" x1={146} y1={100} x2={136} y2={88} width={7} />
      <Arm skinTone="mediumDark" x1={166} y1={100} x2={176} y2={110} width={7} />
      
      {/* Head */}
      <Head 
        skinTone="mediumDark" 
        hairStyle="short" 
        hairColor="#2C1B47" 
        x={156} 
        y={82} 
        size={10}
      />
    </g>
    
    {/* Energy/community indicators - connecting lines and shapes */}
    <circle cx="100" cy="120" r="70" stroke="#ADFF2F" strokeWidth="1" opacity="0.1" />
    <circle cx="100" cy="120" r="85" stroke="#00CED1" strokeWidth="1" opacity="0.08" />
    
    {/* Motion/energy lines */}
    <path d="M 20 100 Q 25 95 30 100" stroke="#FF1493" strokeWidth="2" opacity="0.2" strokeLinecap="round" />
    <path d="M 170 100 Q 175 95 180 100" stroke="#FF1493" strokeWidth="2" opacity="0.2" strokeLinecap="round" />
  </svg>
);

// Partner workout illustration - Group & Community
export const PartnerWorkoutIllustration: React.FC<IllustrationProps> = ({ className = 'w-64 h-64' }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Two people working out together showing collaboration and support"
  >
    <title>Partner Workout</title>
    <desc>Illustration showing two people working out together with contrasting skin tones and different body types, demonstrating collaboration, support, and teamwork in fitness</desc>
    
    {/* Ground line */}
    <line x1="40" y1="165" x2="160" y2="165" stroke="#E0E0E0" strokeWidth="2" opacity="0.5" />
    
    {/* Person 1 (Left) - Light skin tone, athletic body type, doing plank */}
    <g>
      {/* Legs (plank position) */}
      <line x1="85" y1="115" x2="100" y2="145" stroke={SKIN_TONES.light} strokeWidth="8" strokeLinecap="round" />
      <line x1="90" y1="115" x2="105" y2="145" stroke={SKIN_TONES.light} strokeWidth="8" strokeLinecap="round" />
      
      {/* Body/Torso - athletic build, horizontal for plank */}
      <ellipse cx="65" cy="110" rx="18" ry="24" fill="#00CED1" transform="rotate(-15 65 110)" />
      
      {/* Arms (supporting plank) */}
      <Arm skinTone="light" x1={55} y1={105} x2={40} y2={140} width={8} />
      <Arm skinTone="light" x1={50} y1={108} x2={35} y2={143} width={8} />
      
      {/* Head looking forward */}
      <Head 
        skinTone="light" 
        hairStyle="short" 
        hairColor="#8B4513" 
        x={60} 
        y={85} 
        size={12}
      />
    </g>
    
    {/* Person 2 (Right) - Dark skin tone, average body type, spotting/supporting */}
    <g>
      {/* Legs (standing, supportive stance) */}
      <line x1="128" y1="135" x2="122" y2="160" stroke={SKIN_TONES.dark} strokeWidth="9" strokeLinecap="round" />
      <line x1="136" y1="135" x2="142" y2="160" stroke={SKIN_TONES.dark} strokeWidth="9" strokeLinecap="round" />
      
      {/* Body/Torso - average build, leaning forward to support */}
      <ellipse cx="132" cy="115" rx="18" ry="24" fill="#FF1493" transform="rotate(-10 132 115)" />
      
      {/* Arms (one reaching to support partner) */}
      <Arm skinTone="dark" x1={122} y1={110} x2={105} y2={105} width={8} />
      <Arm skinTone="dark" x1={138} y1={115} x2={148} y2={125} width={8} />
      
      {/* Head looking at partner */}
      <Head 
        skinTone="dark" 
        hairStyle="curly" 
        hairColor="#2C1B47" 
        x={132} 
        y={90} 
        size={13}
      />
    </g>
    
    {/* Connection/support indicator - subtle line between partners */}
    <path 
      d="M 75 105 Q 100 100 120 105" 
      stroke="#ADFF2F" 
      strokeWidth="2" 
      strokeDasharray="4 2" 
      opacity="0.3"
    />
    
    {/* Teamwork/collaboration indicators */}
    <circle cx="100" cy="110" r="55" stroke="#00CED1" strokeWidth="1" opacity="0.15" />
    
    {/* Motivational energy lines */}
    <path d="M 50 80 Q 55 75 60 80" stroke="#FF1493" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
    <path d="M 140 75 Q 145 70 150 75" stroke="#ADFF2F" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
  </svg>
);

// Celebration illustration - Motivational
export const CelebrationIllustration: React.FC<IllustrationProps> = ({ className = 'w-64 h-64' }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Person in victory celebration pose showing joy and achievement"
  >
    <title>Celebration Victory Pose</title>
    <desc>Illustration showing a person in a victory celebration pose with arms raised, expressing joy and achievement</desc>
    
    {/* Celebration confetti/sparkles */}
    <circle cx="60" cy="60" r="3" fill="#FF1493" opacity="0.6" />
    <circle cx="140" cy="70" r="3" fill="#00CED1" opacity="0.6" />
    <circle cx="75" cy="50" r="2" fill="#ADFF2F" opacity="0.7" />
    <circle cx="125" cy="55" r="2" fill="#FF1493" opacity="0.7" />
    <circle cx="150" cy="85" r="2.5" fill="#ADFF2F" opacity="0.6" />
    <circle cx="50" cy="75" r="2.5" fill="#00CED1" opacity="0.6" />
    
    {/* Star shapes for celebration */}
    <path d="M 65 45 L 67 50 L 72 50 L 68 53 L 70 58 L 65 55 L 60 58 L 62 53 L 58 50 L 63 50 Z" fill="#FF1493" opacity="0.5" />
    <path d="M 135 60 L 137 65 L 142 65 L 138 68 L 140 73 L 135 70 L 130 73 L 132 68 L 128 65 L 133 65 Z" fill="#00CED1" opacity="0.5" />
    
    {/* Ground line */}
    <line x1="60" y1="170" x2="140" y2="170" stroke="#E0E0E0" strokeWidth="2" opacity="0.5" />
    
    {/* Person with medium skin tone and average body type in victory pose */}
    <g>
      {/* Legs (standing, energetic stance) */}
      <line x1="95" y1="140" x2="88" y2="165" stroke={SKIN_TONES.medium} strokeWidth="9" strokeLinecap="round" />
      <line x1="105" y1="140" x2="112" y2="165" stroke={SKIN_TONES.medium} strokeWidth="9" strokeLinecap="round" />
      
      {/* Body/Torso - average build, upright and energized */}
      <ellipse cx="100" cy="115" rx="18" ry="26" fill="#FF1493" />
      
      {/* Arms (raised in victory V-shape) */}
      <Arm skinTone="medium" x1={90} y1={105} x2={70} y2={75} width={8} />
      <Arm skinTone="medium" x1={110} y1={105} x2={130} y2={75} width={8} />
      
      {/* Hands (fists in celebration) */}
      <circle cx="70" cy="75" r="5" fill={SKIN_TONES.medium} />
      <circle cx="130" cy="75" r="5" fill={SKIN_TONES.medium} />
      
      {/* Head with joyful expression */}
      <Head 
        skinTone="medium" 
        hairStyle="short" 
        hairColor="#2C1B47" 
        x={100} 
        y={85} 
        size={13}
      />
      
      {/* Smile */}
      <path d="M 95 90 Q 100 93 105 90" stroke="#2C1B47" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
    
    {/* Energy/achievement radiating lines */}
    <circle cx="100" cy="100" r="60" stroke="#ADFF2F" strokeWidth="1.5" opacity="0.2" />
    <circle cx="100" cy="100" r="70" stroke="#00CED1" strokeWidth="1.5" opacity="0.15" />
    
    {/* Additional celebration elements - motion lines */}
    <path d="M 45 90 L 55 90" stroke="#FF1493" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
    <path d="M 145 90 L 155 90" stroke="#FF1493" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
    <path d="M 50 110 L 60 110" stroke="#00CED1" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
    <path d="M 140 110 L 150 110" stroke="#00CED1" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
  </svg>
);

// Goal setting illustration - Motivational
export const GoalSettingIllustration: React.FC<IllustrationProps> = ({ className = 'w-64 h-64' }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Person with checklist and goal board showing planning and determination"
  >
    <title>Goal Setting and Planning</title>
    <desc>Illustration showing a person with a checklist or goal board, demonstrating planning, focus, and determination in achieving fitness goals</desc>
    
    {/* Goal board/checklist */}
    <g>
      {/* Board background */}
      <rect x="115" y="75" width="45" height="60" fill="#E8F5E9" stroke="#2C1B47" strokeWidth="2" rx="2" />
      
      {/* Checklist items */}
      <g>
        {/* Item 1 - checked */}
        <rect x="122" y="83" width="8" height="8" fill="#00CED1" stroke="#2C1B47" strokeWidth="1" rx="1" />
        <path d="M 124 87 L 126 89 L 129 85" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="133" y1="87" x2="153" y2="87" stroke="#2C1B47" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Item 2 - checked */}
        <rect x="122" y="96" width="8" height="8" fill="#00CED1" stroke="#2C1B47" strokeWidth="1" rx="1" />
        <path d="M 124 100 L 126 102 L 129 98" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="133" y1="100" x2="153" y2="100" stroke="#2C1B47" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Item 3 - in progress */}
        <rect x="122" y="109" width="8" height="8" fill="#fff" stroke="#2C1B47" strokeWidth="1" rx="1" />
        <line x1="133" y1="113" x2="153" y2="113" stroke="#2C1B47" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Item 4 - unchecked */}
        <rect x="122" y="122" width="8" height="8" fill="#fff" stroke="#2C1B47" strokeWidth="1" rx="1" />
        <line x1="133" y1="126" x2="153" y2="126" stroke="#2C1B47" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      
      {/* Board title/header */}
      <line x1="120" y1="80" x2="155" y2="80" stroke="#FF1493" strokeWidth="2" strokeLinecap="round" />
    </g>
    
    {/* Pen/pencil in hand */}
    <g>
      <rect x="108" y="105" width="3" height="15" fill="#FF1493" rx="1" />
      <path d="M 108 105 L 109.5 100 L 111 105" fill="#2C1B47" />
    </g>
    
    {/* Ground line */}
    <line x1="40" y1="170" x2="140" y2="170" stroke="#E0E0E0" strokeWidth="2" opacity="0.5" />
    
    {/* Person with dark skin tone and slim body type looking at goals */}
    <g>
      {/* Legs (standing, focused stance) */}
      <line x1="72" y1="140" x2="68" y2="165" stroke={SKIN_TONES.dark} strokeWidth="8" strokeLinecap="round" />
      <line x1="80" y1="140" x2="84" y2="165" stroke={SKIN_TONES.dark} strokeWidth="8" strokeLinecap="round" />
      
      {/* Body/Torso - slim build, upright and focused */}
      <ellipse cx="76" cy="115" rx="16" ry="28" fill="#00CED1" />
      
      {/* Arm holding pen/pointing at board */}
      <Arm skinTone="dark" x1={88} y1={110} x2={110} y2={110} width={7} />
      
      {/* Other arm (at side) */}
      <Arm skinTone="dark" x1={66} y1={110} x2={55} y2={125} width={7} />
      
      {/* Head looking at board with focus */}
      <Head 
        skinTone="dark" 
        hairStyle="medium" 
        hairColor="#2C1B47" 
        x={76} 
        y={85} 
        size={12}
      />
    </g>
    
    {/* Focus/determination indicators - thought/concentration lines */}
    <path d="M 85 90 L 95 85" stroke="#ADFF2F" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
    <path d="M 88 95 L 98 92" stroke="#ADFF2F" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
    <path d="M 90 100 L 100 98" stroke="#ADFF2F" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
    
    {/* Motivational stars/sparkles near board */}
    <circle cx="165" cy="70" r="2" fill="#FF1493" opacity="0.6" />
    <circle cx="170" cy="80" r="1.5" fill="#ADFF2F" opacity="0.6" />
    <path d="M 168 90 L 169 93 L 172 93 L 170 95 L 171 98 L 168 96 L 165 98 L 166 95 L 164 93 L 167 93 Z" fill="#00CED1" opacity="0.5" />
    
    {/* Determination/focus aura */}
    <circle cx="76" cy="110" r="50" stroke="#FF1493" strokeWidth="1" opacity="0.1" />
  </svg>
);

// Simple decorative shapes
export const DecorativeShapes: React.FC<IllustrationProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 400 400" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="30" fill="#00CED1" opacity="0.1" />
    <circle cx="350" cy="100" r="40" fill="#FF1493" opacity="0.1" />
    <circle cx="300" cy="350" r="50" fill="#ADFF2F" opacity="0.1" />
    <circle cx="80" cy="320" r="35" fill="#B0C4DE" opacity="0.1" />
  </svg>
);

export default {
  PlankBallIllustration,
  WeightLiftingIllustration,
  SquatIllustration,
  RunningIllustration,
  DumbbellIllustration,
  HeartRateIllustration,
  YogaIllustration,
  CommunityIllustration,
  DeadliftIllustration,
  PushUpIllustration,
  LungeIllustration,
  PlankVariationIllustration,
  KettlebellSwingIllustration,
  CyclingIllustration,
  JumpRopeIllustration,
  DanceFitnessIllustration,
  WarriorPoseIllustration,
  ChildPoseIllustration,
  TreePoseIllustration,
  FoamRollingIllustration,
  HydrationIllustration,
  GroupClassIllustration,
  PartnerWorkoutIllustration,
  CelebrationIllustration,
  GoalSettingIllustration,
  DecorativeShapes,
};
