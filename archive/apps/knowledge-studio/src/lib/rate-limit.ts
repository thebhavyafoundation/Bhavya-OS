/**
 * Simple in-memory rate limiter for Next.js API routes.
 * Uses a Map with sliding window per IP.
 *
 * For production, use Redis-backed rate limiting (e.g., @upstash/ratelimit).
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (entry.resetAt < now) store.delete(key);
    }
  },
  5 * 60 * 1000,
);

export interface RateLimitConfig {
  /** Max requests per window */
  maxRequests: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

/**
 * Check if a request is rate-limited.
 * @param identifier - unique key (e.g., IP + endpoint)
 * @param config - rate limit configuration
 * @returns { limited: boolean, remaining: number, resetAt: number }
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig,
): { limited: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || entry.resetAt < now) {
    // New window
    const resetAt = now + config.windowMs;
    store.set(identifier, { count: 1, resetAt });
    return { limited: false, remaining: config.maxRequests - 1, resetAt };
  }

  if (entry.count >= config.maxRequests) {
    // Rate limited
    return {
      limited: true,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  // Increment
  entry.count++;
  return {
    limited: false,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Rate limit configs for different endpoints.
 */
export const RateLimits = {
  /** Auth endpoints: 5 attempts per 15 minutes */
  auth: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
  },
  /** General API: 60 requests per minute */
  api: {
    maxRequests: 60,
    windowMs: 60 * 1000,
  },
  /** File upload: 10 uploads per minute */
  upload: {
    maxRequests: 10,
    windowMs: 60 * 1000,
  },
} as const;
