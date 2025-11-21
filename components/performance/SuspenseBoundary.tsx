/**
 * Suspense Boundary Components
 * 
 * Reusable Suspense boundaries with error handling
 */

'use client';

import React, { Suspense, Component, ReactNode } from 'react';
import { SectionLoader, PageLoader } from './LoadingStates';

interface SuspenseBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
}

/**
 * Error Boundary for catching errors in Suspense
 */
class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 mb-4">
            We encountered an error loading this content.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Suspense boundary with error handling
 */
export function SuspenseBoundary({
  children,
  fallback,
  errorFallback,
}: SuspenseBoundaryProps) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback || <SectionLoader />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

/**
 * Page-level suspense boundary
 */
export function PageSuspenseBoundary({
  children,
  fallback,
  errorFallback,
}: SuspenseBoundaryProps) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback || <PageLoader />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

/**
 * Section-level suspense boundary
 */
export function SectionSuspenseBoundary({
  children,
  fallback,
  errorFallback,
}: SuspenseBoundaryProps) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback || <SectionLoader />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

/**
 * Inline suspense boundary (minimal loading state)
 */
export function InlineSuspenseBoundary({
  children,
  fallback,
  errorFallback,
}: SuspenseBoundaryProps) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback || <div className="animate-pulse">Loading...</div>}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

/**
 * Multiple suspense boundaries for parallel loading
 */
export function ParallelSuspenseBoundaries({
  children,
  fallbacks,
}: {
  children: ReactNode[];
  fallbacks?: ReactNode[];
}) {
  return (
    <>
      {React.Children.map(children, (child, index) => (
        <SuspenseBoundary
          key={index}
          fallback={fallbacks?.[index] || <SectionLoader />}
        >
          {child}
        </SuspenseBoundary>
      ))}
    </>
  );
}

export default SuspenseBoundary;
