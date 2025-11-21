/**
 * Loading State Components
 * 
 * Reusable loading components for code-split modules
 */

import React from 'react';

/**
 * Generic spinner component
 */
export function Spinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin`}
      />
    </div>
  );
}

/**
 * Skeleton loader for text content
 */
export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 rounded animate-pulse"
          style={{ width: i === lines - 1 ? '75%' : '100%' }}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton loader for card
 */
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="space-y-4">
        {/* Image placeholder */}
        <div className="w-full h-48 bg-gray-200 rounded animate-pulse" />
        
        {/* Title placeholder */}
        <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
        
        {/* Text placeholders */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton loader for grid of cards
 */
export function SkeletonGrid({ count = 6, columns = 3, className = '' }: { count?: number; columns?: number; className?: string }) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton loader for list items
 */
export function SkeletonList({ count = 5, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Full page loading component
 */
export function PageLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Spinner size="lg" />
      {message && <p className="mt-4 text-gray-600">{message}</p>}
    </div>
  );
}

/**
 * Section loading component
 */
export function SectionLoader({ message, className = '' }: { message?: string; className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <Spinner size="md" />
      {message && <p className="mt-4 text-gray-600">{message}</p>}
    </div>
  );
}

/**
 * Inline loading component
 */
export function InlineLoader({ message, className = '' }: { message?: string; className?: string }) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Spinner size="sm" />
      {message && <span className="text-sm text-gray-600">{message}</span>}
    </div>
  );
}

/**
 * Tool-specific skeleton loader
 */
export function ToolSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="h-12 bg-gray-200 rounded animate-pulse w-full" />

        {/* Results area */}
        <div className="space-y-3 pt-4 border-t border-gray-200">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
          <div className="h-20 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/**
 * Product card skeleton
 */
export function ProductSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <div className="w-full h-64 bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
        <div className="h-8 bg-gray-200 rounded animate-pulse w-full" />
      </div>
    </div>
  );
}

/**
 * Program card skeleton
 */
export function ProgramSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <div className="w-full h-48 bg-gray-200 animate-pulse" />
      <div className="p-6 space-y-4">
        <div className="h-7 bg-gray-200 rounded animate-pulse w-2/3" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
        </div>
        <div className="flex space-x-2">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
          <div className="h-6 bg-gray-200 rounded animate-pulse w-24" />
        </div>
      </div>
    </div>
  );
}

/**
 * Fade-in wrapper for loaded content
 */
export function FadeIn({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`animate-fadeIn ${className}`}>
      {children}
    </div>
  );
}
