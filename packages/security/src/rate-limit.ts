/**
 * @bhavya/security — Rate Limiting
 *
 * Sliding window rate limiter with configurable windows.
 */

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  limited: boolean;
  remaining: number;
  resetAt: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

/**
 * In-memory sliding window rate limiter.
 * For production, use Redis-backed rate limiting.
 */
export class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private cleanupTimer?: ReturnType<typeof setInterval>;

  constructor(private cleanupIntervalMs = 5 * 60 * 1000) {
    this.cleanupTimer = setInterval(() => this.cleanup(), cleanupIntervalMs);
  }

  check(identifier: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now();
    const entry = this.store.get(identifier);

    if (!entry || entry.resetAt < now) {
      const resetAt = now + config.windowMs;
      this.store.set(identifier, { count: 1, resetAt });
      return { limited: false, remaining: config.maxRequests - 1, resetAt };
    }

    if (entry.count >= config.maxRequests) {
      return { limited: true, remaining: 0, resetAt: entry.resetAt };
    }

    entry.count++;
    return {
      limited: false,
      remaining: config.maxRequests - entry.count,
      resetAt: entry.resetAt,
    };
  }

  reset(identifier: string): void {
    this.store.delete(identifier);
  }

  getStats(identifier: string): { count: number; resetAt: number } | null {
    const entry = this.store.get(identifier);
    return entry ? { count: entry.count, resetAt: entry.resetAt } : null;
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store) {
      if (entry.resetAt < now) this.store.delete(key);
    }
  }

  destroy() {
    if (this.cleanupTimer) clearInterval(this.cleanupTimer);
  }
}

/** Pre-defined rate limit configs */
export const RateLimits = {
  auth: { maxRequests: 5, windowMs: 15 * 60 * 1000 },
  api: { maxRequests: 60, windowMs: 60 * 1000 },
  upload: { maxRequests: 10, windowMs: 60 * 1000 },
  search: { maxRequests: 30, windowMs: 60 * 1000 },
} as const;
