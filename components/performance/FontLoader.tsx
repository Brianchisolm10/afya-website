'use client';

import { useEffect, useState } from 'react';
import { fontLoader } from '@/lib/performance/font-optimization';

/**
 * FontLoader Component
 * 
 * Handles dynamic font loading and provides loading state
 */
export function FontLoader() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  
  useEffect(() => {
    // Preload critical fonts on mount
    fontLoader.preloadCriticalFonts()
      .then(() => {
        setFontsLoaded(true);
        // Add class to body when fonts are loaded
        document.body.classList.add('fonts-loaded');
      })
      .catch(err => {
        console.warn('Failed to preload fonts:', err);
        // Still mark as loaded to prevent blocking
        setFontsLoaded(true);
      });
  }, []);
  
  return null;
}

/**
 * Font Loading Indicator
 * 
 * Shows a subtle indicator while fonts are loading
 */
export function FontLoadingIndicator() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fontLoader.preloadCriticalFonts()
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false));
  }, []);
  
  if (!isLoading) return null;
  
  return (
    <div
      className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-afya-primary to-afya-secondary z-50 animate-pulse"
      aria-hidden="true"
    />
  );
}

/**
 * Hook to check if fonts are loaded
 */
export function useFontsLoaded(): boolean {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    // Check if fonts are already loaded
    if (fontLoader.isLoaded('primary')) {
      setLoaded(true);
      return;
    }
    
    // Wait for fonts to load
    fontLoader.preloadCriticalFonts()
      .then(() => setLoaded(true))
      .catch(() => setLoaded(true)); // Fail gracefully
  }, []);
  
  return loaded;
}
