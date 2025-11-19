/**
 * Cache Service for Intake System
 * 
 * Provides in-memory caching for question blocks and intake paths
 * to improve performance and reduce redundant data processing.
 * 
 * Features:
 * - In-memory caching with TTL (time-to-live)
 * - Automatic cache invalidation
 * - Cache statistics for monitoring
 * - Type-safe cache keys
 */

import { QuestionBlock, IntakePathConfig } from '@/types/intake';
import { allQuestionBlocks, getBlockById, getBlocksByIds } from './question-blocks';
import { allIntakePaths, getPathByClientType, getPathById } from './intake-paths';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
}

class CacheService {
  private cache: Map<string, CacheEntry<any>>;
  private stats: { hits: number; misses: number };
  private defaultTTL: number; // in milliseconds

  constructor(defaultTTL: number = 3600000) { // Default 1 hour
    this.cache = new Map();
    this.stats = { hits: 0, misses: 0 };
    this.defaultTTL = defaultTTL;
  }

  /**
   * Get item from cache
   */
  private get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return entry.data as T;
  }

  /**
   * Set item in cache
   */
  private set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expiresAt = now + (ttl || this.defaultTTL);

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt
    });
  }

  /**
   * Clear specific cache key
   */
  private clear(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clearAll(): void {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0 };
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? this.stats.hits / total : 0;

    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      size: this.cache.size,
      hitRate: Math.round(hitRate * 100) / 100
    };
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // ============================================================================
  // QUESTION BLOCKS CACHING
  // ============================================================================

  /**
   * Get all question blocks (cached)
   */
  getAllQuestionBlocks(): QuestionBlock[] {
    const cacheKey = 'question-blocks:all';
    const cached = this.get<QuestionBlock[]>(cacheKey);

    if (cached) {
      return cached;
    }

    // Cache miss - load from source
    const blocks = allQuestionBlocks;
    this.set(cacheKey, blocks);
    return blocks;
  }

  /**
   * Get question block by ID (cached)
   */
  getQuestionBlockById(id: string): QuestionBlock | undefined {
    const cacheKey = `question-block:${id}`;
    const cached = this.get<QuestionBlock | undefined>(cacheKey);

    if (cached !== null) {
      return cached;
    }

    // Cache miss - load from source
    const block = getBlockById(id);
    this.set(cacheKey, block);
    return block;
  }

  /**
   * Get question blocks by IDs (cached)
   */
  getQuestionBlocksByIds(ids: string[]): QuestionBlock[] {
    // Create a cache key from sorted IDs to ensure consistency
    const sortedIds = [...ids].sort();
    const cacheKey = `question-blocks:${sortedIds.join(',')}`;
    const cached = this.get<QuestionBlock[]>(cacheKey);

    if (cached) {
      return cached;
    }

    // Cache miss - load from source
    const blocks = getBlocksByIds(ids);
    this.set(cacheKey, blocks);
    return blocks;
  }

  /**
   * Get question blocks by category (cached)
   */
  getQuestionBlocksByCategory(category: string): QuestionBlock[] {
    const cacheKey = `question-blocks:category:${category}`;
    const cached = this.get<QuestionBlock[]>(cacheKey);

    if (cached) {
      return cached;
    }

    // Cache miss - load from source
    const blocks = allQuestionBlocks.filter(block => block.category === category);
    this.set(cacheKey, blocks);
    return blocks;
  }

  /**
   * Invalidate question block cache
   */
  invalidateQuestionBlocks(): void {
    // Clear all question block related cache entries
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (key.startsWith('question-block')) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // ============================================================================
  // INTAKE PATHS CACHING
  // ============================================================================

  /**
   * Get all intake paths (cached)
   */
  getAllIntakePaths(): IntakePathConfig[] {
    const cacheKey = 'intake-paths:all';
    const cached = this.get<IntakePathConfig[]>(cacheKey);

    if (cached) {
      return cached;
    }

    // Cache miss - load from source
    const paths = allIntakePaths;
    this.set(cacheKey, paths);
    return paths;
  }

  /**
   * Get intake path by client type (cached)
   */
  getIntakePathByClientType(clientType: string): IntakePathConfig | undefined {
    const cacheKey = `intake-path:client-type:${clientType}`;
    const cached = this.get<IntakePathConfig | undefined>(cacheKey);

    if (cached !== null) {
      return cached;
    }

    // Cache miss - load from source
    const path = getPathByClientType(clientType);
    this.set(cacheKey, path);
    return path;
  }

  /**
   * Get intake path by ID (cached)
   */
  getIntakePathById(id: string): IntakePathConfig | undefined {
    const cacheKey = `intake-path:id:${id}`;
    const cached = this.get<IntakePathConfig | undefined>(cacheKey);

    if (cached !== null) {
      return cached;
    }

    // Cache miss - load from source
    const path = getPathById(id);
    this.set(cacheKey, path);
    return path;
  }

  /**
   * Get active intake paths (cached)
   */
  getActiveIntakePaths(): IntakePathConfig[] {
    const cacheKey = 'intake-paths:active';
    const cached = this.get<IntakePathConfig[]>(cacheKey);

    if (cached) {
      return cached;
    }

    // Cache miss - load from source
    const paths = allIntakePaths.filter(path => path.isActive);
    this.set(cacheKey, paths);
    return paths;
  }

  /**
   * Invalidate intake path cache
   */
  invalidateIntakePaths(): void {
    // Clear all intake path related cache entries
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (key.startsWith('intake-path')) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // ============================================================================
  // COMBINED OPERATIONS
  // ============================================================================

  /**
   * Get intake path with question blocks (cached)
   * This is a common operation that benefits from caching
   */
  getIntakePathWithBlocks(clientType: string): {
    path: IntakePathConfig | undefined;
    blocks: QuestionBlock[];
  } {
    const cacheKey = `intake-path-with-blocks:${clientType}`;
    const cached = this.get<{ path: IntakePathConfig | undefined; blocks: QuestionBlock[] }>(cacheKey);

    if (cached) {
      return cached;
    }

    // Cache miss - load from source
    const path = this.getIntakePathByClientType(clientType);
    const blocks = path ? this.getQuestionBlocksByIds(path.questionBlockIds) : [];

    const result = { path, blocks };
    this.set(cacheKey, result);
    return result;
  }

  /**
   * Invalidate all intake-related cache
   */
  invalidateAll(): void {
    this.invalidateQuestionBlocks();
    this.invalidateIntakePaths();
  }
}

// Create singleton instance
const cacheService = new CacheService();

// Set up periodic cleanup (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    cacheService.cleanup();
  }, 300000); // 5 minutes
}

export default cacheService;

// Export for testing and advanced usage
export { CacheService };
