'use client';

import Link from "next/link";
import { Button } from "@/components/ui";
import { CommunityCounter } from "@/components/community/CommunityCounter";

interface HeroSectionProps {
  totalMinutesMoved: number;
}

/**
 * Optimized Hero Section with priority loading and optimized animations
 */
export function HeroSection({ totalMinutesMoved }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-br from-teal-50 via-purple-50 to-white section-spacing-lg relative overflow-hidden">
      {/* Subtle decorative background shapes - optimized with will-change */}
      <div 
        className="absolute top-0 right-0 w-96 h-96 bg-teal-100/20 rounded-full -mr-48 -mt-48"
        style={{ willChange: 'transform' }}
      ></div>
      <div 
        className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100/20 rounded-full -ml-32 -mb-32"
        style={{ willChange: 'transform' }}
      ></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Main heading - critical content */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            A Happier, Healthier You.
            <span className="block text-teal-600 mt-2">Your Way.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Personalized wellness programs designed to fit your life, your goals, and your journey.
          </p>
          
          {/* Community Minutes Moved Counter */}
          <div className="mb-12">
            <CommunityCounter initialCount={totalMinutesMoved} />
          </div>

          <Link href="/programs" passHref legacyBehavior>
            <Button
              as="a"
              size="lg"
              className="bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500 shadow-lg font-semibold text-lg px-12 py-4 transition-all duration-200"
            >
              Start Your Journey
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
