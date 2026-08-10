import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { checkRateLimit, RateLimits } from "@/lib/rate-limit";

describe("rate-limit", () => {
  it("allows requests within limit", () => {
    const result = checkRateLimit("test:allow", {
      maxRequests: 3,
      windowMs: 60000,
    });
    expect(result.limited).toBe(false);
    expect(result.remaining).toBe(2);
  });

  it("blocks requests over limit", () => {
    const key = "test:block";
    checkRateLimit(key, { maxRequests: 2, windowMs: 60000 });
    checkRateLimit(key, { maxRequests: 2, windowMs: 60000 });
    const result = checkRateLimit(key, { maxRequests: 2, windowMs: 60000 });
    expect(result.limited).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it("resets after window expires", async () => {
    const key = "test:reset";
    const config = { maxRequests: 1, windowMs: 100 };
    checkRateLimit(key, config);
    const blocked = checkRateLimit(key, config);
    expect(blocked.limited).toBe(true);

    // Wait for window to expire
    await new Promise((r) => setTimeout(r, 150));
    const reset = checkRateLimit(key, config);
    expect(reset.limited).toBe(false);
  });

  it("uses separate counters per key", () => {
    const config = { maxRequests: 1, windowMs: 60000 };
    checkRateLimit("key-a", config);
    const result = checkRateLimit("key-b", config);
    expect(result.limited).toBe(false);
  });
});

describe("RateLimits config", () => {
  it("has auth, api, and upload configs", () => {
    expect(RateLimits.auth).toBeDefined();
    expect(RateLimits.api).toBeDefined();
    expect(RateLimits.upload).toBeDefined();
  });

  it("auth limits are stricter than api", () => {
    expect(RateLimits.auth.maxRequests).toBeLessThan(
      RateLimits.api.maxRequests,
    );
  });
});
