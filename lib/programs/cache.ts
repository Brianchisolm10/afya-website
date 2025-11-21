/**
 * Programs Data Caching
 * 
 * Server-side caching for program data with cache invalidation support
 */

import { getCacheManager, CACHE_TTL } from '@/lib/performance/cache-manager';

export interface Program {
  id: string;
  title: string;
  description: string;
  gradient: string;
  estimatedTime?: string;
  clientType: string;
  isComingSoon?: boolean;
}

const CACHE_KEY_PROGRAMS = 'programs:all';
const CACHE_TAG_PROGRAMS = 'programs';

/**
 * Get all programs with caching
 */
export async function getCachedPrograms(): Promise<Program[]> {
  const cacheManager = getCacheManager();
  
  // Try to get from cache
  const cached = cacheManager.get<Program[]>(CACHE_KEY_PROGRAMS);
  if (cached) {
    return cached;
  }

  // Fetch fresh data
  const programs = await fetchPrograms();
  
  // Cache for 10 minutes with 5-minute stale time
  cacheManager.set(CACHE_KEY_PROGRAMS, programs, {
    ttl: 10 * 60 * 1000, // 10 minutes
    staleTime: 5 * 60 * 1000, // 5 minutes
    tags: [CACHE_TAG_PROGRAMS],
  });

  return programs;
}

/**
 * Fetch programs data
 * In a real app, this would fetch from database
 */
async function fetchPrograms(): Promise<Program[]> {
  // For now, return static data
  // In production, this would query the database
  return [
    {
      id: 'intro',
      title: 'Intro',
      description: 'Get started with personalized wellness guidance. Perfect for beginners exploring health and fitness. Quick assessment, clear next steps.',
      gradient: 'bg-gradient-to-br from-[#40E0D0] to-[#7FFFD4]',
      estimatedTime: '5-10 minutes',
      clientType: 'GENERAL_WELLNESS',
    },
    {
      id: 'nutrition',
      title: 'Nutrition',
      description: 'Custom meal plans tailored to your goals and preferences. Learn sustainable eating habits. Achieve your nutrition targets.',
      gradient: 'bg-gradient-to-br from-[#9370DB] to-[#DDA0DD]',
      estimatedTime: '10-15 minutes',
      clientType: 'NUTRITION_ONLY',
    },
    {
      id: 'training',
      title: 'Training',
      description: 'Structured workout programs designed for your fitness level. Build strength, endurance, and confidence. Train smarter, not harder.',
      gradient: 'bg-gradient-to-br from-[#40E0D0] to-[#20B2AA]',
      estimatedTime: '10-15 minutes',
      clientType: 'WORKOUT_ONLY',
    },
    {
      id: 'athlete',
      title: 'Athlete',
      description: 'Performance-focused programming for competitive athletes. Sport-specific training and nutrition. Elevate your game.',
      gradient: 'bg-gradient-to-br from-[#8A2BE2] to-[#9370DB]',
      estimatedTime: '15-20 minutes',
      clientType: 'ATHLETE_PERFORMANCE',
    },
    {
      id: 'youth',
      title: 'Youth',
      description: 'Age-appropriate fitness and nutrition for young athletes. Safe, fun, and effective. Build healthy habits early.',
      gradient: 'bg-gradient-to-br from-[#7FFFD4] to-[#40E0D0]',
      estimatedTime: '10-12 minutes',
      clientType: 'YOUTH',
    },
    {
      id: 'recovery',
      title: 'Recovery',
      description: 'Specialized guidance for injury recovery and rehabilitation. Safe movement patterns and progressive protocols. Return to activity confidently.',
      gradient: 'bg-gradient-to-br from-[#DDA0DD] to-[#9370DB]',
      estimatedTime: '12-15 minutes',
      clientType: 'FULL_PROGRAM',
    },
    {
      id: 'movement-needs',
      title: 'Movement Needs',
      description: 'Modified programs for chronic conditions or limitations. Adaptive exercises and supportive guidance. Move better, feel better.',
      gradient: 'bg-gradient-to-br from-[#20B2AA] to-[#40E0D0]',
      estimatedTime: '12-15 minutes',
      clientType: 'SPECIAL_SITUATION',
    },
  ];
}

/**
 * Get coming soon programs
 */
export async function getCachedComingSoonPrograms(): Promise<Program[]> {
  const cacheManager = getCacheManager();
  const cacheKey = 'programs:coming-soon';
  
  // Try to get from cache
  const cached = cacheManager.get<Program[]>(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch fresh data
  const programs: Program[] = [
    {
      id: 'corporate-wellness',
      title: 'Corporate Wellness',
      description: 'Workplace wellness programs designed to improve employee health and productivity. Team-based challenges and group support.',
      gradient: 'bg-gradient-to-br from-[#40E0D0] to-[#9370DB]',
      clientType: '',
      isComingSoon: true,
    },
    {
      id: 'prenatal-postnatal',
      title: 'Prenatal & Postnatal',
      description: 'Safe, effective fitness and nutrition guidance for expecting and new mothers. Support through every stage of your journey.',
      gradient: 'bg-gradient-to-br from-[#DDA0DD] to-[#7FFFD4]',
      clientType: '',
      isComingSoon: true,
    },
    {
      id: 'senior-fitness',
      title: 'Senior Fitness',
      description: 'Age-appropriate movement programs focused on maintaining independence and quality of life. Gentle, effective, and empowering.',
      gradient: 'bg-gradient-to-br from-[#9370DB] to-[#20B2AA]',
      clientType: '',
      isComingSoon: true,
    },
  ];
  
  // Cache for 10 minutes
  cacheManager.set(cacheKey, programs, {
    ttl: 10 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    tags: [CACHE_TAG_PROGRAMS],
  });

  return programs;
}

/**
 * Invalidate programs cache
 * Call this when program data is updated
 */
export function invalidateProgramsCache(): void {
  const cacheManager = getCacheManager();
  cacheManager.invalidateByTag(CACHE_TAG_PROGRAMS);
}
