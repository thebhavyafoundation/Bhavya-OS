import { NextRequest } from "next/server";
import { register } from "@/lib/auth";
import { apiError, apiSuccess, HttpStatus, ErrorCode } from "@/lib/api-utils";
import { checkRateLimit, RateLimits } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Rate limit by IP
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const rateKey = `register:${ip}`;
    const { limited, remaining, resetAt } = checkRateLimit(
      rateKey,
      RateLimits.auth,
    );

    if (limited) {
      return apiError(
        "Too many registration attempts. Please try again later.",
        HttpStatus.TOO_MANY_REQUESTS,
        ErrorCode.RATE_LIMITED,
        { retryAfter: Math.ceil((resetAt - Date.now()) / 1000) },
      );
    }

    const { email, password, name } = await req.json();
    if (!email || !password) {
      return apiError(
        "Email and password required",
        HttpStatus.BAD_REQUEST,
        ErrorCode.VALIDATION_ERROR,
      );
    }

    const user = await register(email, password, name);
    return apiSuccess(
      {
        success: true,
        user: { id: user.id, email: user.email, name: user.name },
      },
      HttpStatus.CREATED,
    );
  } catch (err: any) {
    return apiError(
      err.message || "Registration failed",
      HttpStatus.BAD_REQUEST,
    );
  }
}
