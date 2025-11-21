'use client';

import { useEffect, useRef, useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui";
import { 
  CommunityIllustration,
  HydrationIllustration,
  CelebrationIllustration 
} from "@/components/illustrations/FitnessIllustrations";

interface ImpactStatsSectionProps {
  totalClientsServed: number;
  totalDonationsRaised: number;
  totalGearDonated: number;
}

/**
 * Lazy-loaded Impact Stats Section with Intersection Observer
 */
export function ImpactStatsSection({
  totalClientsServed,
  totalDonationsRaised,
  totalGearDonated,
}: ImpactStatsSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="section-spacing bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center stack-lg" style={{ marginBottom: 'var(--space-12)' }}>
          <h2 className="text-section-title text-gray-900">
            Our Impact
          </h2>
          <p className="text-body-large text-gray-600 content-readable mx-auto">
            Together, we're building a healthier, more active community.
          </p>
        </div>

        {isVisible ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Stat 1: Clients Served */}
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-20 h-20 mb-4">
                  <CommunityIllustration className="w-20 h-20" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {totalClientsServed.toLocaleString()}+
                </div>
                <div className="text-gray-600">
                  Clients Served
                </div>
              </div>

              {/* Stat 2: Donations Raised */}
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-20 h-20 mb-4">
                  <HydrationIllustration className="w-20 h-20" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  ${totalDonationsRaised.toLocaleString()}
                </div>
                <div className="text-gray-600">
                  Donations Raised
                </div>
              </div>

              {/* Stat 3: Gear Donated */}
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-20 h-20 mb-4">
                  <CelebrationIllustration className="w-20 h-20" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {totalGearDonated.toLocaleString()}+
                </div>
                <div className="text-gray-600">
                  Items Donated
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link href="/impact">
                <Button variant="outline" size="lg">
                  See Our Impact
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse text-gray-400">Loading impact stats...</div>
          </div>
        )}
      </div>
    </section>
  );
}
