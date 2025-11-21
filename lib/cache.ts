/**
 * Caching utilities for API responses
 * 
 * Provides in-memory caching with TTL (Time To Live) support
 * for improved API performance and reduced database load.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
  keys: string[];
}

class Cache {
  private store: Map<string, CacheEntry<any>>;
  private hits: number;
  private misses: number;

  constructor() {
    this.store = new Map();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Get cached data if it exists and hasn't expired
   * 
   * @param key - Cache key
   * @returns Cached data or null if not found/expired
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key);

    if (!entry) {
      this.misses++;
      return null;
    }

    const now = Date.now();
    const age = now - entry.timestamp;

    // Check if cache has expired
    if (age > entry.ttl) {
      this.store.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    return entry.data as T;
  }

  /**
   * Set cached data with TTL
   * 
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttl - Time to live in milliseconds
   */
  set<T>(key: string, data: T, ttl: number): void {
    this.store.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Delete cached data
   * 
   * @param key - Cache key
   */
  delete(key: string): void {
    this.store.delete(key);
  }

  /**
   * Clear all cached data
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const totalRequests = this.hits + this.misses;
    const hitRate = totalRequests > 0 ? this.hits / totalRequests : 0;

    return {
      size: this.store.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: Math.round(hitRate * 100) / 100,
      keys: Array.from(this.store.keys()),
    };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Invalidate cache entries by pattern
   * 
   * @param pattern - Pattern to match (supports wildcards with *)
   * @returns Number of entries invalidated
   */
  invalidatePattern(pattern: string): number {
    let count = 0;
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');

    const keysToDelete: string[] = [];
    this.store.forEach((_, key) => {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => {
      this.store.delete(key);
      count++;
    });

    return count;
  }

  /**
   * Check if a key exists in cache (without affecting stats)
   */
  has(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;

    const now = Date.now();
    const age = now - entry.timestamp;

    return age <= entry.ttl;
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.store.forEach((entry, key) => {
      const age = now - entry.timestamp;
      if (age > entry.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => this.store.delete(key));
  }
}

// Singleton cache instance
const cache = new Cache();

// Run cleanup every 5 minutes
if (typeof window === 'undefined') {
  setInterval(() => {
    cache.cleanup();
  }, 5 * 60 * 1000);
}

/**
 * Cache TTL constants (in milliseconds)
 */
export const CACHE_TTL = {
  SHORT: 30 * 1000, // 30 seconds
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 30 * 60 * 1000, // 30 minutes
  HOUR: 60 * 60 * 1000, // 1 hour
  DAY: 24 * 60 * 60 * 1000, // 24 hours
};

/**
 * Generate cache key from request parameters
 * 
 * @param prefix - Cache key prefix
 * @param params - Parameters to include in key
 * @returns Cache key string
 */
export function generateCacheKey(prefix: string, params: Record<string, any> = {}): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');

  return sortedParams ? `${prefix}:${sortedParams}` : prefix;
}

/**
 * Cached fetch wrapper
 * Fetches data and caches the result
 * 
 * @param key - Cache key
 * @param fetchFn - Function to fetch data
 * @param ttl - Time to live in milliseconds
 * @returns Cached or fresh data
 */
export async function cachedFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<T> {
  // Try to get from cache
  const cached = cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetchFn();

  // Cache the result
  cache.set(key, data, ttl);

  return data;
}

/**
 * Invalidate cache by key or pattern
 * 
 * @param keyOrPattern - Cache key or pattern to match (supports wildcards with *)
 * @returns Number of entries invalidated
 */
export function invalidateCache(keyOrPattern: string): number {
  if (keyOrPattern.includes('*')) {
    // Pattern matching
    return cache.invalidatePattern(keyOrPattern);
  } else {
    // Exact key match
    cache.delete(keyOrPattern);
    return 1;
  }
}

/**
 * Clear all cache
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats(): CacheStats {
  return cache.getStats();
}

/**
 * Reset cache statistics
 */
export function resetCacheStats(): void {
  cache.resetStats();
}

/**
 * Check if key exists in cache
 */
export function hasCache(key: string): boolean {
  return cache.has(key);
}

/**
 * Cache decorator for API route handlers
 * 
 * @param ttl - Time to live in milliseconds
 * @param keyGenerator - Function to generate cache key from request
 */
export function withCache(
  ttl: number = CACHE_TTL.MEDIUM,
  keyGenerator?: (request: Request) => string
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const request = args[0];
      
      // Generate cache key
      const cacheKey = keyGenerator
        ? keyGenerator(request)
        : `${propertyKey}:${request.url}`;

      // Try to get from cache
      const cached = cache.get(cacheKey);
      if (cached !== null) {
        return cached;
      }

      // Call original method
      const result = await originalMethod.apply(this, args);

      // Cache the result
      cache.set(cacheKey, result, ttl);

      return result;
    };

    return descriptor;
  };
}

export default cache;
