'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'placeholder' | 'blurDataURL'> {
  fallbackSrc?: string;
  showLoader?: boolean;
  blurDataURL?: string;
  useBlurPlaceholder?: boolean;
  lazyLoad?: boolean;
  rootMargin?: string;
  quality?: number;
}

/**
 * OptimizedImage component with advanced lazy loading, blur placeholders, and WebP support
 * 
 * Features:
 * - Automatic WebP/AVIF format conversion
 * - Blur placeholder support for smooth loading
 * - Intersection Observer-based lazy loading
 * - Responsive image sizes
 * - Loading state with skeleton
 * - Error fallback
 * - Priority loading for above-the-fold images
 */
export default function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/placeholder-image.png',
  showLoader = true,
  blurDataURL,
  useBlurPlaceholder = true,
  lazyLoad = true,
  rootMargin = '50px',
  className = '',
  priority = false,
  quality = 75,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const [shouldLoad, setShouldLoad] = useState(!lazyLoad || priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazyLoad || priority || shouldLoad) {
      return;
    }

    if (!imgRef.current) {
      return;
    }

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
        rootMargin,
      }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, [lazyLoad, priority, shouldLoad, rootMargin]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
    if (fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  };

  // Determine placeholder strategy
  const placeholderProp = useBlurPlaceholder && blurDataURL ? 'blur' : 'empty';
  const blurDataURLProp = useBlurPlaceholder && blurDataURL ? blurDataURL : undefined;

  return (
    <div ref={imgRef} className="relative">
      {/* Loading skeleton - only show if no blur placeholder */}
      {isLoading && showLoader && !blurDataURL && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}

      {/* Only render image when it should load */}
      {shouldLoad && (
        <Image
          src={imageSrc}
          alt={alt}
          className={`${className} ${isLoading && !blurDataURL ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? undefined : 'lazy'}
          priority={priority}
          quality={quality}
          placeholder={placeholderProp as 'blur' | 'empty'}
          blurDataURL={blurDataURLProp}
          {...props}
        />
      )}

      {/* Error state */}
      {error && !fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
