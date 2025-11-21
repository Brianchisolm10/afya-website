'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface ImpactStat {
  label: string;
  value: string | number;
  suffix?: string;
}

interface ImpactSectionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  stats?: ImpactStat[];
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  comingSoon?: boolean;
}

function AnimatedStat({ value, suffix, label, delay = 0 }: { 
  value: string | number; 
  suffix?: string; 
  label: string;
  delay?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const statRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  // Parse numeric value
  const numericValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/,/g, ''));
  const isNumeric = !isNaN(numericValue);

  useEffect(() => {
    if (!statRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            // Add delay before starting animation
            setTimeout(() => {
              setIsVisible(true);
              setHasAnimated(true);
            }, delay);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '0px',
      }
    );

    observer.observe(statRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated, delay]);

  // Animate numeric values
  useEffect(() => {
    if (!isVisible || !isNumeric) return;

    const duration = 1500; // 1.5 seconds
    const startTime = Date.now();
    const endTime = startTime + duration;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOutCubic * numericValue);
      
      setDisplayValue(current);

      if (now < endTime) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(numericValue);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVisible, isNumeric, numericValue]);

  const formattedValue = isNumeric 
    ? displayValue.toLocaleString() 
    : value;

  return (
    <div 
      ref={statRef} 
      className={`text-center transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div 
        className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#40E0D0] to-[#9370DB]"
        style={{
          willChange: isVisible && !hasAnimated ? 'transform, opacity' : 'auto',
        }}
      >
        {formattedValue}{suffix}
      </div>
      <div className="text-sm text-gray-600 mt-1">{label}</div>
    </div>
  );
}

export function ImpactSectionCard({
  title,
  description,
  icon,
  stats,
  ctaLabel,
  ctaHref,
  onCtaClick,
  comingSoon = false,
}: ImpactSectionCardProps) {
  return (
    <Card className={`relative ${comingSoon ? 'opacity-60' : ''}`}>
      {comingSoon && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
          Coming Soon
        </div>
      )}
      
      <div className="flex flex-col h-full">
        {/* Icon */}
        <div className="mb-4 text-4xl">{icon}</div>
        
        {/* Title */}
        <h3 className="text-2xl font-bold mb-3 text-gray-900">{title}</h3>
        
        {/* Description */}
        <p className="text-gray-600 mb-4 flex-grow">{description}</p>
        
        {/* Stats with progressive animation */}
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-gray-200">
            {stats.map((stat, index) => (
              <AnimatedStat
                key={index}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                delay={index * 100} // Stagger animations by 100ms
              />
            ))}
          </div>
        )}
        
        {/* CTA Button */}
        {ctaLabel && !comingSoon && (
          <div className="mt-auto">
            {ctaHref ? (
              <Button
                as="a"
                href={ctaHref}
                variant="primary"
                className="w-full"
              >
                {ctaLabel}
              </Button>
            ) : (
              <Button
                onClick={onCtaClick}
                variant="primary"
                className="w-full"
              >
                {ctaLabel}
              </Button>
            )}
          </div>
        )}
        
        {comingSoon && (
          <div className="mt-auto">
            <Button
              variant="outline"
              className="w-full cursor-not-allowed"
              disabled
            >
              Not Available Yet
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
