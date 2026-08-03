/**
 * @bhavya/api — Middleware
 *
 * Composable middleware for API routes (auth, rate limiting, validation).
 */

import { RateLimiter, RateLimits } from "@bhavya/security";

export interface MiddlewareContext {
  headers: Record<string, string>;
  params: Record<string, string>;
  query: Record<string, string>;
  userId?: string;
  roles?: string[];
}

export type Middleware = (
  ctx: MiddlewareContext,
) => Promise<MiddlewareResult> | MiddlewareResult;

export interface MiddlewareResult {
  ok: boolean;
  error?: { status: number; message: string; code: string };
}

/**
 * Auth middleware — requires a valid session/user.
 */
export function requireAuth(): Middleware {
  return (ctx) => {
    if (!ctx.userId) {
      return {
        ok: false,
        error: { status: 401, message: "Unauthorized", code: "AUTH_REQUIRED" },
      };
    }
    return { ok: true };
  };
}

/**
 * Role-based authorization middleware.
 */
export function requireRole(...roles: string[]): Middleware {
  return (ctx) => {
    if (!ctx.userId) {
      return {
        ok: false,
        error: { status: 401, message: "Unauthorized", code: "AUTH_REQUIRED" },
      };
    }
    if (!ctx.roles?.some((r) => roles.includes(r))) {
      return {
        ok: false,
        error: { status: 403, message: "Forbidden", code: "FORBIDDEN" },
      };
    }
    return { ok: true };
  };
}

/**
 * Rate limiting middleware.
 */
export function rateLimit(
  config: (typeof RateLimits)[keyof typeof RateLimits],
): Middleware {
  const limiter = new RateLimiter();
  return (ctx) => {
    const id = ctx.userId || ctx.headers["x-forwarded-for"] || "anonymous";
    const { limited } = limiter.check(id, config);
    if (limited) {
      return {
        ok: false,
        error: {
          status: 429,
          message: "Too many requests",
          code: "RATE_LIMITED",
        },
      };
    }
    return { ok: true };
  };
}

/**
 * Compose multiple middleware into a single function.
 */
export function compose(...middlewares: Middleware[]): Middleware {
  return async (ctx) => {
    for (const mw of middlewares) {
      const result = await mw(ctx);
      if (!result.ok) return result;
    }
    return { ok: true };
  };
}
