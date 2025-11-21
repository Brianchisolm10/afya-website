/**
 * Virtual scroll hook for optimized rendering of large product lists
 * Only renders visible items + buffer for smooth scrolling (Requirement 4.4)
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { rafThrottle } from './scroll-utils';

interface UseVirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number; // Number of items to render outside viewport
}

interface VirtualScrollResult<T> {
  virtualItems: T[];
  totalHeight: number;
  offsetY: number;
  startIndex: number;
  endIndex: number;
}

/**
 * Hook for virtual scrolling optimization
 * Renders only visible items for better performance with large lists
 */
export function useVirtualScroll<T>(
  items: T[],
  options: UseVirtualScrollOptions
): VirtualScrollResult<T> {
  const { itemHeight, containerHeight, overscan = 3 } = options;
  const [scrollTop, setScrollTop] = useState(0);
  const scrollRef = useRef<number>(0);

  // Calculate visible range
  const { startIndex, endIndex, offsetY } = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    
    // Add overscan for smooth scrolling
    const startWithOverscan = Math.max(0, start - overscan);
    const endWithOverscan = Math.min(
      items.length - 1,
      start + visibleCount + overscan
    );

    return {
      startIndex: startWithOverscan,
      endIndex: endWithOverscan,
      offsetY: startWithOverscan * itemHeight,
    };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  // Get visible items
  const virtualItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1);
  }, [items, startIndex, endIndex]);

  // Total height for scroll container
  const totalHeight = items.length * itemHeight;

  // Throttled scroll handler
  useEffect(() => {
    const handleScroll = rafThrottle(() => {
      const newScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (Math.abs(newScrollTop - scrollRef.current) > itemHeight / 2) {
        scrollRef.current = newScrollTop;
        setScrollTop(newScrollTop);
      }
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [itemHeight]);

  return {
    virtualItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
  };
}

/**
 * Simpler hook for grid-based virtual scrolling
 * Optimized for product grids with multiple columns
 */
export function useVirtualGrid<T>(
  items: T[],
  rowHeight: number,
  columns: number,
  overscan: number = 2
): VirtualScrollResult<T> {
  const [scrollTop, setScrollTop] = useState(0);
  
  const totalRows = Math.ceil(items.length / columns);
  const totalHeight = totalRows * rowHeight;
  
  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endRow = Math.min(
    totalRows - 1,
    Math.ceil((scrollTop + window.innerHeight) / rowHeight) + overscan
  );
  
  const startIndex = startRow * columns;
  const endIndex = Math.min(items.length - 1, (endRow + 1) * columns - 1);
  
  const virtualItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startRow * rowHeight;

  useEffect(() => {
    const handleScroll = rafThrottle(() => {
      setScrollTop(window.pageYOffset || document.documentElement.scrollTop);
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return {
    virtualItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
  };
}
