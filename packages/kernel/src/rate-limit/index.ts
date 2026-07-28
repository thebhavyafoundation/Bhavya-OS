// Rate Limiting & Throttling
// Protects the system from overload.

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (context: Record<string, unknown>) => string;
  skip?: (context: Record<string, unknown>) => boolean;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  total: number;
}

interface RequestRecord {
  count: number;
  windowStart: Date;
}

export class RateLimiter {
  private config: RateLimitConfig;
  private records = new Map<string, RequestRecord>();
  private blocked = new Map<string, Date>();

  constructor(config: RateLimitConfig) {
    this.config = {
      keyGenerator: (ctx) => (ctx.agentId as string) ?? 'unknown',
      ...config,
    };
  }

  async initialize(): Promise<void> {
    // Start cleanup interval
    setInterval(() => this.cleanup(), this.config.windowMs);
  }

  // Check rate limit
  async check(context: Record<string, unknown>): Promise<RateLimitResult> {
    const key = this.config.keyGenerator!(context);

    // Check if blocked
    const blockedUntil = this.blocked.get(key);
    if (blockedUntil && blockedUntil > new Date()) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: blockedUntil,
        total: this.config.maxRequests,
      };
    }

    const now = new Date();
    let record = this.records.get(key);

    // New window
    if (!record || now.getTime() - record.windowStart.getTime() > this.config.windowMs) {
      record = { count: 1, windowStart: now };
      this.records.set(key, record);
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetAt: new Date(now.getTime() + this.config.windowMs),
        total: this.config.maxRequests,
      };
    }

    // Increment
    record.count++;

    if (record.count > this.config.maxRequests) {
      // Block for remainder of window
      const resetAt = new Date(record.windowStart.getTime() + this.config.windowMs);
      this.blocked.set(key, resetAt);
      return {
        allowed: false,
        remaining: 0,
        resetAt,
        total: this.config.maxRequests,
      };
    }

    return {
      allowed: true,
      remaining: this.config.maxRequests - record.count,
      resetAt: new Date(record.windowStart.getTime() + this.config.windowMs),
      total: this.config.maxRequests,
    };
  }

  // Reset rate limit for key
  async reset(key: string): Promise<void> {
    this.records.delete(key);
    this.blocked.delete(key);
  }

  // Get stats
  getStats(): { activeKeys: number; blockedKeys: number } {
    return {
      activeKeys: this.records.size,
      blockedKeys: this.blocked.size,
    };
  }

  // Cleanup expired records
  private cleanup(): void {
    const now = new Date();
    for (const [key, record] of this.records) {
      if (now.getTime() - record.windowStart.getTime() > this.config.windowMs * 2) {
        this.records.delete(key);
      }
    }
    for (const [key, until] of this.blocked) {
      if (until < now) {
        this.blocked.delete(key);
      }
    }
  }

  async shutdown(): Promise<void> {
    this.records.clear();
    this.blocked.clear();
  }
}
