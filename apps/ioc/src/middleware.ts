/**
 * IOC (Institute of Compliance) — Security Middleware
 *
 * Gates API routes behind session-token cookie.
 * Health endpoints remain public.
 * Full auth verification happens when absorbed into ai-institute.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Health endpoints stay public
  if (pathname.includes("/api/health")) {
    const response = NextResponse.next();
    response.headers.set("x-frame-options", "DENY");
    response.headers.set("x-content-type-options", "nosniff");
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
  response.headers.set("x-frame-options", "DENY");
  response.headers.set("x-content-type-options", "nosniff");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
