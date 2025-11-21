/**
 * Optimized Script Component
 * 
 * Wrapper for third-party scripts with optimal loading strategies
 */

'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { 
  ScriptStrategy, 
  ScriptPriority, 
  ThirdPartyScript,
  loadScript,
  loadScriptWhenIdle,
  loadScriptOnInteraction,
} from '@/lib/performance/third-party-scripts';

export interface OptimizedScriptProps {
  src?: string;
  strategy?: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload' | 'worker';
  priority?: 'critical' | 'high' | 'medium' | 'low';
  condition?: () => boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  loadOnInteraction?: boolean;
  interactionEvents?: string[];
  children?: string; // Inline script content
}

/**
 * Optimized script component with advanced loading strategies
 */
export function OptimizedScript({
  src,
  strategy = 'afterInteractive',
  priority = 'medium',
  condition,
  onLoad,
  onError,
  loadOnInteraction = false,
  interactionEvents = ['mousedown', 'touchstart'],
  children,
}: OptimizedScriptProps) {
  const loadedRef = useRef(false);

  useEffect(() => {
    // Check condition
    if (condition && !condition()) {
      return;
    }

    // Skip if already loaded
    if (loadedRef.current) return;

    // Handle inline scripts
    if (children && !src) {
      const script = document.createElement('script');
      script.textContent = children;
      document.head.appendChild(script);
      loadedRef.current = true;
      return;
    }

    // Handle external scripts with custom loading
    if (src && (loadOnInteraction || priority === 'low')) {
      const config: ThirdPartyScript = {
        name: src,
        src,
        strategy: ScriptStrategy.LAZY,
        priority: priority === 'critical' ? ScriptPriority.CRITICAL :
                 priority === 'high' ? ScriptPriority.HIGH :
                 priority === 'medium' ? ScriptPriority.MEDIUM :
                 ScriptPriority.LOW,
        onLoad,
        onError,
      };

      if (loadOnInteraction) {
        const cleanup = loadScriptOnInteraction(config, interactionEvents);
        return cleanup;
      } else if (priority === 'low') {
        loadScriptWhenIdle(config);
      }

      loadedRef.current = true;
    }
  }, [src, children, condition, loadOnInteraction, interactionEvents, priority, onLoad, onError]);

  // Use Next.js Script component for standard loading
  if (src && !loadOnInteraction && priority !== 'low') {
    return (
      <Script
        src={src}
        strategy={strategy}
        onLoad={onLoad}
        onError={(e) => onError?.(new Error('Script load error'))}
      />
    );
  }

  // For inline scripts or custom loading, render nothing
  // (script is added via useEffect)
  return null;
}

/**
 * Stripe script component
 */
export function StripeScript({ onLoad }: { onLoad?: () => void }) {
  return (
    <OptimizedScript
      src="https://js.stripe.com/v3/"
      strategy="afterInteractive"
      priority="high"
      condition={() => {
        if (typeof window === 'undefined') return false;
        return window.location.pathname.includes('/shop') ||
               window.location.pathname.includes('/checkout') ||
               window.location.pathname.includes('/donate');
      }}
      onLoad={onLoad}
    />
  );
}

/**
 * Analytics script component (placeholder for future use)
 */
export function AnalyticsScript({ onLoad }: { onLoad?: () => void }) {
  return (
    <OptimizedScript
      strategy="lazyOnload"
      priority="low"
      condition={() => process.env.NODE_ENV === 'production'}
      onLoad={onLoad}
    >
      {`
        // Analytics initialization code
        console.log('Analytics initialized');
      `}
    </OptimizedScript>
  );
}

/**
 * Web Vitals tracking script
 */
export function WebVitalsScript() {
  return (
    <OptimizedScript
      strategy="lazyOnload"
      priority="low"
    >
      {`
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            // Web Vitals will be tracked via the monitoring system
            console.log('Web Vitals tracking ready');
          });
        }
      `}
    </OptimizedScript>
  );
}
