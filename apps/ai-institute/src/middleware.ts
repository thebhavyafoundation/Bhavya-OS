/**
 * AI Institute — Security Middleware
 *
 * Validates origin on state-changing requests, enforces auth on protected routes,
 * and adds security headers.
 */

import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "http://localhost:3020",
  "http://localhost:3030",
  "https://ai-institute-nine.vercel.app",
  "https://ai-institute-kmkdql49t-bhavya-foundation.vercel.app",
];

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true;
  return ALLOWED_ORIGINS.some((allowed) => origin.startsWith(allowed));
}

function isAllowedReferer(referer: string | null): boolean {
  if (!referer) return true;
  return ALLOWED_ORIGINS.some((allowed) => referer.startsWith(allowed));
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
    pathname.startsWith("/os") ||
    pathname.startsWith("/studio") ||
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

      if (origin && !isAllowedOrigin(origin)) {
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
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
  }

  // Auth enforcement on protected page routes
  if (isProtectedRoute(pathname) && !isPublicOsRoute(pathname)) {
    if (!hasSessionCookie(request)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();

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
