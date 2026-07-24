import { NextResponse, type NextRequest } from "next/server";

const SUPPORTED_LOCALES = ["en-IN", "hi", "ta", "te"];
const DEFAULT_LOCALE = "en-IN";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const cookieLocale = request.cookies.get("locale")?.value;
  if (!cookieLocale || !SUPPORTED_LOCALES.includes(cookieLocale)) {
    const acceptLang = request.headers.get("accept-language") || "";
    const preferred = SUPPORTED_LOCALES.find(l => acceptLang.startsWith(l)) || DEFAULT_LOCALE;
    response.cookies.set("locale", preferred, { path: "/", maxAge: 31536000 });
  }

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
