export { ApiClient } from "./client.js";
export type {
  ApiClientConfig,
  RequestOptions,
  ApiResponse,
  ApiError as ApiErrorType,
} from "./client.js";
export { ApiError, HttpStatus, ErrorCode } from "./errors.js";
export type { ApiErrorResponse } from "./errors.js";
export { requireAuth, requireRole, rateLimit, compose } from "./middleware.js";
export type {
  MiddlewareContext,
  Middleware,
  MiddlewareResult,
} from "./middleware.js";
