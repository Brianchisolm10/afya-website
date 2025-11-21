/**
 * Performance Cache Manager
 * 
 * Enhanced caching layer specifically for performance optimization
 * with advanced features like stale-while-revalidate and cache warming
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  staleTime?: number;
}

interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
  staleHits: number;
}

interface CacheOptions {
  ttl: number;
  staleTime?: number;
  tags?: string[];
}

class PerformanceCacheManager {
  private cache: Map<string, CacheEntry<any>>;
  private stats: { hits: number; misses: number; staleHits: number };
  private tags: Map<string, Set<string>>; // tag -> keys mapping
  private revalidating: Set<string>; // keys currently being revalidated

  constructor() {
    this.cache = new Map();
    this.stats = { hits: 0, misses: 0, staleHits: 0 };
    this.tags = new Map();
    this.revalidating = new Set();

    // Cleanup expired entries periodically
    if (typeof window === 'undefined') {
      setInterval(() => this.cleanup(), 5 * 60 * 1000); // Every 5 minutes
    }
  }

  /**
   * Get data from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    const now = Date.now();
    const age = now - entry.timestamp;

    // Check if completely expired
    if (age > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return entry.data as T;
  }

  /**
   * Get data with stale-while-revalidate support
   * Returns stale data if available while triggering revalidation
   */
  getStale<T>(key: string): { data: T | null; isStale: boolean } {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return { data: null, isStale: false };
    }

    const now = Date.now();
    const age = now - entry.timestamp;

    // Completely expired
    if (age > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return { data: null, isStale: false };
    }

    // Check if stale but within stale-time window
    const staleTime = entry.staleTime || entry.ttl;
    const isStale = age > staleTime;

    if (isStale) {
      this.stats.staleHits++;
    } else {
      this.stats.hits++;
    }

    return { data: entry.data as T, isStale };
  }

  /**
   * Set data in cache
   */
  set<T>(key: string, data: T, options: CacheOptions): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: options.ttl,
      staleTime: options.staleTime,
    };

    this.cache.set(key, entry);

    // Handle tags
    if (options.tags) {
      options.tags.forEach((tag) => {
        if (!this.tags.has(tag)) {
          this.tags.set(tag, new Set());
        }
        this.tags.get(tag)!.add(key);
      });
    }
  }

  /**
   * Invalidate cache by key
   */
  invalidate(key: string): void {
    this.cache.delete(key);
    
    // Remove from tags
    this.tags.forEach((keys) => {
      keys.delete(key);
    });
  }

  /**
   * Invalidate cache by pattern
   */
  invalidatePattern(pattern: string): number {
    let count = 0;
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');

    const keysToDelete: string[] = [];
    this.cache.forEach((_, key) => {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => {
      this.invalidate(key);
      count++;
    });

    return count;
  }

  /**
   * Invalidate cache by tag
   */
  invalidateByTag(tag: string): number {
    const keys = this.tags.get(tag);
    if (!keys) return 0;

    let count = 0;
    keys.forEach((key) => {
      this.cache.delete(key);
      count++;
    });

    this.tags.delete(tag);
    return count;
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    this.tags.clear();
    this.revalidating.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses + this.stats.staleHits;
    const hitRate = totalRequests > 0 
      ? (this.stats.hits + this.stats.staleHits) / totalRequests 
      : 0;

    return {
      size: this.cache.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: Math.round(hitRate * 100) / 100,
      staleHits: this.stats.staleHits,
    };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = { hits: 0, misses: 0, staleHits: 0 };
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      const age = now - entry.timestamp;
      if (age > entry.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => this.invalidate(key));
  }

  /**
   * Check if currently revalidating
   */
  isRevalidating(key: string): boolean {
    return this.revalidating.has(key);
  }

  /**
   * Mark as revalidating
   */
  startRevalidation(key: string): void {
    this.revalidating.add(key);
  }

  /**
   * Mark revalidation complete
   */
  endRevalidation(key: string): void {
    this.revalidating.delete(key);
  }

  /**
   * Get all cache keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Check if key exists
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    const age = now - entry.timestamp;
    return age <= entry.ttl;
  }
}

// Singleton instance
let cacheManagerInstance: PerformanceCacheManager | null = null;

export function getCacheManager(): PerformanceCacheManager {
  if (!cacheManagerInstance) {
    cacheManagerInstance = new PerformanceCacheManager();
  }
  return cacheManagerInstance;
}

/**
 * Cached fetch with stale-while-revalidate support
 */
export async function cachedFetchSWR<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: CacheOptions
): Promise<T> {
  const manager = getCacheManager();
  const { data, isStale } = manager.getStale<T>(key);

  // If we have fresh data, return it
  if (data !== null && !isStale) {
    return data;
  }

  // If we have stale data and not already revalidating, trigger revalidation
  if (data !== null && isStale && !manager.isRevalidating(key)) {
    manager.startRevalidation(key);
    
    // Revalidate in background
    fetchFn()
      .then((freshData) => {
        manager.set(key, freshData, options);
        manager.endRevalidation(key);
      })
      .catch((error) => {
        console.error('Revalidation failed:', error);
        manager.endRevalidation(key);
      });

    // Return stale data immediately
    return data;
  }

  // No data or already revalidating, fetch fresh
  const freshData = await fetchFn();
  manager.set(key, freshData, options);
  return freshData;
}

/**
 * Cache TTL constants
 */
export const CACHE_TTL = {
  SHORT: 30 * 1000, // 30 seconds
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 30 * 60 * 1000, // 30 minutes
  HOUR: 60 * 60 * 1000, // 1 hour
  DAY: 24 * 60 * 60 * 1000, // 24 hours
};

export default PerformanceCacheManager;
