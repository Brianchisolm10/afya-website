/**
 * LazyLoadOnScroll Component
 * 
 * Lazy loads content when it enters the viewport using Intersection Observer
 * Optimizes performance by deferring non-critical content loading
 */

'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { SectionLoader } from './LoadingStates';

interface LazyLoadOnScrollProps {
  children: ReactNode;
  threshold?: number;
  rootMargin?: string;
  fallback?: ReactNode;
  className?: string;
  once?: boolean; // Only load once when visible
}

export function LazyLoadOnScroll({
  children,
  threshold = 0.1,
  rootMargin = '100px',
  fallback,
  className = '',
  once = true,
}: LazyLoadOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setShouldRender(true);
            
            // Disconnect observer if only loading once
            if (once) {
              observer.disconnect();
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  return (
    <div ref={containerRef} className={className}>
      {shouldRender ? (
        <div
          className={`transition-opacity duration-500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {children}
        </div>
      ) : (
        fallback || <SectionLoader />
      )}
    </div>
  );
}

/**
 * LazyImage Component
 * 
 * Lazy loads images when they enter the viewport
 */
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  threshold?: number;
  rootMargin?: string;
}

export function LazyImage({
  src,
  alt,
  className = '',
  width,
  height,
  threshold = 0.1,
  rootMargin = '50px',
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return (
    <div className="relative">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <img
        ref={imgRef}
        src={shouldLoad ? src : undefined}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        width={width}
        height={height}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}

export default LazyLoadOnScroll;
