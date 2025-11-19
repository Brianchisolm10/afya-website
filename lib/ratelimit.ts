/**
 * In-memory rate limiter for development
 * For production, consider using Redis-based rate limiting (e.g., @upstash/ratelimit)
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.store.forEach((entry, key) => {
      if (entry.resetAt < now) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.store.delete(key));
  }

  /**
   * Check if a request should be rate limited
   * @param key - Unique identifier for the rate limit (e.g., email, userId)
   * @param config - Rate limit configuration
   * @returns Object with success status and retry information
   */
  check(
    key: string,
    config: RateLimitConfig
  ): {
    success: boolean;
    remaining: number;
    resetAt: number;
    retryAfter?: number;
  } {
    const now = Date.now();
    const entry = this.store.get(key);

    // No entry or expired entry - allow request
    if (!entry || entry.resetAt < now) {
      const resetAt = now + config.windowMs;
      this.store.set(key, { count: 1, resetAt });
      return {
        success: true,
        remaining: config.maxAttempts - 1,
        resetAt,
      };
    }

    // Entry exists and not expired
    if (entry.count >= config.maxAttempts) {
      // Rate limit exceeded
      return {
        success: false,
        remaining: 0,
        resetAt: entry.resetAt,
        retryAfter: Math.ceil((entry.resetAt - now) / 1000), // seconds
      };
    }

    // Increment count
    entry.count++;
    this.store.set(key, entry);

    return {
      success: true,
      remaining: config.maxAttempts - entry.count,
      resetAt: entry.resetAt,
    };
  }

  /**
   * Reset rate limit for a specific key
   * @param key - Unique identifier to reset
   */
  reset(key: string): void {
    this.store.delete(key);
  }

  /**
   * Get current rate limit status without incrementing
   * @param key - Unique identifier to check
   */
  getStatus(key: string): {
    count: number;
    resetAt: number;
  } | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (entry.resetAt < now) {
      this.store.delete(key);
      return null;
    }

    return {
      count: entry.count,
      resetAt: entry.resetAt,
    };
  }

  /**
   * Cleanup and stop the interval timer
   */
  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}

// Singleton instance
const rateLimiter = new RateLimiter();

// Rate limit configurations
export const RATE_LIMITS = {
  // Login: 5 failed attempts per 15 minutes per email
  LOGIN: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  // Password reset: 3 requests per hour per email
  PASSWORD_RESET: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  // Account creation: 10 new accounts per hour per admin
  ACCOUNT_CREATION: {
    maxAttempts: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
} as const;

/**
 * Check rate limit for failed login attempts
 */
export function checkLoginRateLimit(email: string) {
  return rateLimiter.check(`login:${email.toLowerCase()}`, RATE_LIMITS.LOGIN);
}

/**
 * Check rate limit for password reset requests
 */
export function checkPasswordResetRateLimit(email: string) {
  return rateLimiter.check(
    `password-reset:${email.toLowerCase()}`,
    RATE_LIMITS.PASSWORD_RESET
  );
}

/**
 * Check rate limit for account creation by admin
 */
export function checkAccountCreationRateLimit(adminUserId: string) {
  return rateLimiter.check(
    `account-creation:${adminUserId}`,
    RATE_LIMITS.ACCOUNT_CREATION
  );
}

/**
 * Reset login rate limit (e.g., after successful login)
 */
export function resetLoginRateLimit(email: string) {
  rateLimiter.reset(`login:${email.toLowerCase()}`);
}

/**
 * Get rate limiter instance for testing or advanced usage
 */
export function getRateLimiter() {
  return rateLimiter;
}

export default rateLimiter;
