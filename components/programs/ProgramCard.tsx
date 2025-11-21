'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { onLinkHover, onLinkVisible } from '@/lib/performance/prefetch';

export interface ProgramCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  estimatedTime?: string;
  clientType: string;
  isComingSoon?: boolean;
}

export default function ProgramCard({
  id,
  title,
  description,
  icon,
  gradient,
  estimatedTime,
  clientType,
  isComingSoon = false,
}: ProgramCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const [isPrefetched, setIsPrefetched] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  // Intersection Observer for lazy loading animations and prefetching
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            // Trigger animation after a small delay
            setTimeout(() => setIsAnimated(true), 50);
            
            // Prefetch on intersection (viewport-based prefetching)
            if (!isComingSoon && linkRef.current && !isPrefetched) {
              onLinkVisible(linkRef.current);
              setIsPrefetched(true);
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [isVisible, isComingSoon, isPrefetched]);

  // Handle hover prefetching
  const handleMouseEnter = () => {
    if (!isComingSoon) {
      onLinkHover('/book-call');
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      className={`transition-all duration-500 ${
        isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <Card
        variant="hover"
        padding="lg"
        className={`relative overflow-hidden ${isComingSoon ? 'opacity-60' : ''}`}
      >
        {/* Gradient Background with blur placeholder effect */}
        <div
          className={`absolute inset-0 ${gradient} transition-opacity duration-300 ${
            isVisible ? 'opacity-5' : 'opacity-0'
          }`}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Icon with fade-in animation */}
          <div 
            className={`mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#40E0D0] to-[#9370DB] text-white transition-all duration-300 ${
              isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
            }`}
          >
            {icon}
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {title}
          </h3>

          {/* Estimated Time */}
          {estimatedTime && (
            <p className="text-sm text-gray-500 mb-3">
              {estimatedTime}
            </p>
          )}

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {description}
          </p>

          {/* CTA Button */}
          {isComingSoon ? (
            <div className="inline-flex items-center px-6 py-3 text-base font-semibold text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed">
              Coming Soon
            </div>
          ) : (
            <Link href="/book-call" ref={linkRef}>
              <Button variant="primary" size="md" fullWidth>
                Book a Call to Get Access
              </Button>
            </Link>
          )}
        </div>

        {/* Coming Soon Badge */}
        {isComingSoon && (
          <div className="absolute top-4 right-4 bg-gray-200 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
            Coming Soon
          </div>
        )}
      </Card>
    </div>
  );
}
