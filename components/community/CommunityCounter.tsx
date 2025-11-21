'use client';

import { useEffect, useState, useRef } from 'react';

interface CommunityCounterProps {
  initialCount: number;
  animationDuration?: number;
  pollingInterval?: number; // in milliseconds, default 30 seconds
  enablePolling?: boolean; // enable/disable real-time updates
}

export function CommunityCounter({ 
  initialCount, 
  animationDuration = 2000,
  pollingInterval = 30000, // 30 seconds
  enablePolling = true
}: CommunityCounterProps) {
  const [count, setCount] = useState(0);
  const [targetCount, setTargetCount] = useState(initialCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const animationFrameRef = useRef<number>();
  const pollingIntervalRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to detect when counter is visible
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsVisible(true);
            setHasAnimated(true);
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% visible
        rootMargin: '0px',
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated]);

  // Fetch updated stats from API
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/community/stats');
      if (response.ok) {
        const data = await response.json();
        const newCount = data.totalMinutesMoved;
        
        // Only update if the count has changed
        if (newCount !== targetCount) {
          setTargetCount(newCount);
        }
      }
    } catch (error) {
      console.error('Error fetching community stats:', error);
    }
  };

  // Set up polling for real-time updates
  useEffect(() => {
    if (!enablePolling || !isVisible) return;

    // Start polling only when visible
    pollingIntervalRef.current = setInterval(fetchStats, pollingInterval);

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [pollingInterval, enablePolling, targetCount, isVisible]);

  // Animate count changes - only when visible
  useEffect(() => {
    if (!isVisible) return;

    setIsAnimating(true);
    const startTime = Date.now();
    const endTime = startTime + animationDuration;
    const startCount = count;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / animationDuration, 1);
      
      // Easing function for smooth animation (easeOutQuart for natural deceleration)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(startCount + easeOutQuart * (targetCount - startCount));
      
      setCount(currentCount);

      if (now < endTime) {
        // Use requestAnimationFrame for 60fps smooth animation
        animationFrameRef.current = requestAnimationFrame(updateCount);
      } else {
        setCount(targetCount);
        setIsAnimating(false);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateCount);

    // Cleanup animation frame on unmount or when targetCount changes
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetCount, animationDuration, isVisible, count]);

  // Format number with commas
  const formattedCount = count.toLocaleString();

  return (
    <div ref={containerRef} className="text-center">
      <div className="inline-block">
        <div 
          className={`text-5xl md:text-7xl font-bold text-gray-900 transition-all duration-300 ${
            isAnimating ? 'scale-105' : 'scale-100'
          } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{
            // Use CSS transform for better performance (GPU acceleration)
            transform: isAnimating ? 'scale(1.05)' : 'scale(1)',
            willChange: isAnimating ? 'transform' : 'auto',
          }}
        >
          {formattedCount}
        </div>
        <div className={`text-lg md:text-xl text-gray-700 mt-2 font-medium transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          Community Minutes Moved
        </div>
        <div className={`text-sm md:text-base text-gray-600 mt-1 transition-opacity duration-700 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          Total movement by our community
        </div>
      </div>
    </div>
  );
}
