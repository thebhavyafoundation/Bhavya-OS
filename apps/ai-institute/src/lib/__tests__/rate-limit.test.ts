import { describe, it, expect } from "vitest";
import { checkRateLimit, RateLimits } from "../rate-limit";

describe("Rate Limiter", () => {
  it("should allow requests within limit", () => {
    const result = checkRateLimit("test-allow", { maxRequests: 3, windowMs: 60000 });
    expect(result.limited).toBe(false);
    expect(result.remaining).toBe(2);
  });

  it("should block requests over limit", () => {
    const key = "test-block-" + Date.now();
    checkRateLimit(key, { maxRequests: 2, windowMs: 60000 });
    checkRateLimit(key, { maxRequests: 2, windowMs: 60000 });
    const result = checkRateLimit(key, { maxRequests: 2, windowMs: 60000 });
    expect(result.limited).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it("should track remaining correctly", () => {
    const key = "test-remaining-" + Date.now();
    const r1 = checkRateLimit(key, { maxRequests: 5, windowMs: 60000 });
    expect(r1.remaining).toBe(4);
    const r2 = checkRateLimit(key, { maxRequests: 5, windowMs: 60000 });
    expect(r2.remaining).toBe(3);
  });

  it("should have correct rate limit configs", () => {
    expect(RateLimits.register.maxRequests).toBe(3);
    expect(RateLimits.login.maxRequests).toBe(5);
    expect(RateLimits.api.maxRequests).toBe(60);
    expect(RateLimits.progress.maxRequests).toBe(30);
  });
});
