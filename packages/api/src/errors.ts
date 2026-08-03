/**
 * @bhavya/api — Error Handling
 *
 * Standardized API error types and response builders.
 */

export interface ApiErrorResponse {
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
}

export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
} as const;

export const ErrorCode = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTH_REQUIRED: "AUTH_REQUIRED",
  AUTH_INVALID: "AUTH_INVALID",
  NOT_FOUND: "NOT_FOUND",
  RATE_LIMITED: "RATE_LIMITED",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  INVALID_FILE_TYPE: "INVALID_FILE_TYPE",
  CONFLICT: "CONFLICT",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }

  toResponse(): ApiErrorResponse {
    return {
      error: {
        message: this.message,
        code: this.code,
        ...(this.details ? { details: this.details } : {}),
      },
    };
  }

  static badRequest(message: string, details?: unknown) {
    return new ApiError(400, ErrorCode.VALIDATION_ERROR, message, details);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, ErrorCode.AUTH_REQUIRED, message);
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(403, "FORBIDDEN", message);
  }

  static notFound(message = "Not found") {
    return new ApiError(404, ErrorCode.NOT_FOUND, message);
  }

  static tooManyRequests(message = "Too many requests", retryAfter?: number) {
    return new ApiError(429, ErrorCode.RATE_LIMITED, message, { retryAfter });
  }

  static internal(message = "Internal server error") {
    return new ApiError(500, ErrorCode.INTERNAL_ERROR, message);
  }
}
