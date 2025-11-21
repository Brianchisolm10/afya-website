'use client';

/**
 * Navigation Feedback Components
 * 
 * Provides instant visual feedback for navigation actions.
 * Requirements: 7.3, 7.5
 */

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Visual feedback for page changes
 */
export function NavigationFeedback() {
  const pathname = usePathname();
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    setIsChanging(true);
    const timer = setTimeout(() => setIsChanging(false), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isChanging) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-white/20 dark:bg-gray-900/20 animate-fadeIn" />
    </div>
  );
}

/**
 * Optimistic UI overlay for pending navigation
 */
export function OptimisticNavigationOverlay({ isPending }: { isPending: boolean }) {
  if (!isPending) return null;

  return (
    <div
      className="fixed inset-0 bg-white/50 dark:bg-gray-900/50 pointer-events-none z-40 transition-opacity duration-200"
      style={{ opacity: isPending ? 0.5 : 0 }}
      aria-hidden="true"
    />
  );
}

/**
 * Instant feedback indicator for link clicks
 */
export function LinkFeedback({ children, href }: {
  children: React.ReactNode;
  href: string;
}) {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(true);
    setTimeout(() => setIsActive(false), 150);
  };

  return (
    <div
      onClick={handleClick}
      className={`transition-all duration-150 ${
        isActive ? 'scale-95 opacity-80' : 'scale-100 opacity-100'
      }`}
    >
      {children}
    </div>
  );
}
