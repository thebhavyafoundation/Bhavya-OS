/**
 * AI Institute — Security Middleware
 *
 * Validates origin on state-changing requests, enforces auth on protected routes,
 * and adds security headers.
 */

import { NextRequest, NextResponse } from "next/server";

/**
 * Origins permitted to make state-changing cross-origin requests.
 * Same-origin requests are always allowed (checked per request).
 * Additional origins come from the environment — never hardcoded
 * preview URLs (stale allows are a CSRF risk if domains are reassigned).
 * Set ALLOWED_ORIGINS="https://example.org,https://www.example.org".
 */
const BASE_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3020",
  "http://localhost:3030",
];

function getAllowedOrigins(): string[] {
  const env = (process.env.ALLOWED_ORIGINS || "").split(",");
  const extra = env.map((s) => s.trim()).filter(Boolean);
  return [...BASE_ORIGINS, ...extra];
}

const ALLOWED_ORIGINS = getAllowedOrigins();

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true;
  try {
    const url = new URL(origin);
    const originNoPort = `${url.protocol}//${url.hostname}`;
    const originFull = `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ""}`;
    return ALLOWED_ORIGINS.some((allowed) => {
      const allowedUrl = new URL(allowed);
      const allowedNoPort = `${allowedUrl.protocol}//${allowedUrl.hostname}`;
      const allowedFull = `${allowedUrl.protocol}//${allowedUrl.hostname}${allowedUrl.port ? `:${allowedUrl.port}` : ""}`;
      return originFull === allowedFull || originNoPort === allowedNoPort;
    });
  } catch {
    return false;
  }
}

function isAllowedReferer(referer: string | null): boolean {
  if (!referer) return true;
  try {
    const url = new URL(referer);
    const refererOrigin = `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ""}`;
    return ALLOWED_ORIGINS.some(
      (allowed) => refererOrigin === allowed || referer.startsWith(allowed),
    );
  } catch {
    return false;
  }
}

function isSameOrigin(origin: string | null, request: NextRequest): boolean {
  if (!origin) return false;
  try {
    return new URL(origin).host === request.nextUrl.host;
  } catch {
    return false;
  }
}

function isMutatingMethod(method: string): boolean {
  return ["POST", "PUT", "PATCH", "DELETE"].includes(method);
}

function hasSessionCookie(request: NextRequest): boolean {
  const token = request.cookies.get("session-token")?.value;
  return !!token && token.length > 0;
}

function isProtectedRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/app") ||
    pathname.startsWith("/os") ||
    pathname.startsWith("/studio") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/api/studio")
  );
}

function isPublicOsRoute(pathname: string): boolean {
  const publicRoutes = ["/os", "/os/knowledge", "/os/search"];
  return publicRoutes.includes(pathname);
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // CSRF checks on API routes
  if (pathname.startsWith("/api/")) {
    if (isMutatingMethod(request.method)) {
      const origin = request.headers.get("origin");
      const referer = request.headers.get("referer");

      if (
        origin &&
        !isSameOrigin(origin, request) &&
        !isAllowedOrigin(origin)
      ) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (!origin && referer && !isAllowedReferer(referer)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }
  }

  // Auth enforcement on protected API routes
  if (pathname.startsWith("/api/studio")) {
    // Block the open proxy fallback entirely
    if (pathname.startsWith("/api/studio/fallback")) {
      return NextResponse.json(
        { error: "Proxy fallback disabled" },
        { status: 403 },
      );
    }
    // Require session for ALL studio API requests (GET and mutations)
    if (!hasSessionCookie(request)) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }
  }

  // Auth enforcement on protected page routes. API routes under /os/*
  // (e.g. /os/admin/api/*) are excluded: their handlers own auth and
  // respond with JSON 401/403, which a login redirect would break.
  if (
    isProtectedRoute(pathname) &&
    !isPublicOsRoute(pathname) &&
    !pathname.includes("/api/")
  ) {
    if (!hasSessionCookie(request)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();

  // Keep authenticated/internal surfaces out of search indexes.
  // Public knowledge stays indexable: /os itself plus /os/knowledge
  // and /os/search are explicitly public (see isPublicOsRoute).
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/app") ||
    pathname.startsWith("/studio") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/onboarding" ||
    pathname === "/forbidden" ||
    (pathname.startsWith("/os") && !isPublicOsRoute(pathname))
  ) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }

  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  );

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
