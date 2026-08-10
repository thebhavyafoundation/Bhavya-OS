import { NextResponse } from "next/server";

/**
 * Standardized API error response.
 * All API routes should use this format for consistency.
 */
export function apiError(
  message: string,
  status: number,
  code?: string,
  details?: any,
) {
  return NextResponse.json(
    {
      error: {
        message,
        code: code || "ERROR",
        ...(details ? { details } : {}),
      },
    },
    { status },
  );
}

/**
 * Standardized API success response.
 */
export function apiSuccess(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Common HTTP status codes as constants.
 */
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
} as const;

/**
 * Common error codes.
 */
export const ErrorCode = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTH_REQUIRED: "AUTH_REQUIRED",
  AUTH_INVALID: "AUTH_INVALID",
  NOT_FOUND: "NOT_FOUND",
  RATE_LIMITED: "RATE_LIMITED",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  INVALID_FILE_TYPE: "INVALID_FILE_TYPE",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;
