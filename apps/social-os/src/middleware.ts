/**
 * Social OS — Security Middleware
 *
 * Validates origin on state-changing requests, enforces auth on protected routes,
 * and adds security headers.
 */

import { NextRequest, NextResponse } from "next/server";

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
    const originFull = `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ""}`;
    return ALLOWED_ORIGINS.some((allowed) => {
      const allowedUrl = new URL(allowed);
      const allowedFull = `${allowedUrl.protocol}//${allowedUrl.hostname}${allowedUrl.port ? `:${allowedUrl.port}` : ""}`;
      return originFull === allowedFull;
    });
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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // CSRF checks on mutating API routes
  if (pathname.startsWith("/api/") && isMutatingMethod(request.method)) {
    const origin = request.headers.get("origin");
    if (origin && !isSameOrigin(origin, request) && !isAllowedOrigin(origin)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // Health endpoints stay public
  if (pathname.includes("/api/health")) {
    const response = NextResponse.next();
    applySecurityHeaders(response);
    return response;
  }

  // API routes require session-token cookie
  if (pathname.startsWith("/api/")) {
    const sessionToken = request.cookies.get("session-token")?.value;
    if (!sessionToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }
  }

  const response = NextResponse.next();
  applySecurityHeaders(response);
  return response;
}

function applySecurityHeaders(response: NextResponse) {
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
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
