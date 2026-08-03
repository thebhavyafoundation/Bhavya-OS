import { describe, it, expect } from "vitest";
import { apiError, apiSuccess, HttpStatus, ErrorCode } from "@/lib/api-utils";

describe("api-utils", () => {
  describe("apiError", () => {
    it("returns error response with message and status", async () => {
      const response = apiError("Not found", 404, "NOT_FOUND");
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body.error.message).toBe("Not found");
      expect(body.error.code).toBe("NOT_FOUND");
    });

    it("includes details when provided", async () => {
      const response = apiError("Validation failed", 400, "VALIDATION_ERROR", {
        field: "email",
      });
      const body = await response.json();
      expect(body.error.details.field).toBe("email");
    });

    it("omits details when not provided", async () => {
      const response = apiError("Error", 500);
      const body = await response.json();
      expect(body.error.details).toBeUndefined();
    });
  });

  describe("apiSuccess", () => {
    it("returns success response with data", async () => {
      const response = apiSuccess({ id: 1, name: "test" });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.id).toBe(1);
    });

    it("uses custom status code", async () => {
      const response = apiSuccess({ created: true }, 201);
      expect(response.status).toBe(201);
    });
  });

  describe("HttpStatus", () => {
    it("has standard HTTP status codes", () => {
      expect(HttpStatus.OK).toBe(200);
      expect(HttpStatus.BAD_REQUEST).toBe(400);
      expect(HttpStatus.UNAUTHORIZED).toBe(401);
      expect(HttpStatus.NOT_FOUND).toBe(404);
      expect(HttpStatus.TOO_MANY_REQUESTS).toBe(429);
      expect(HttpStatus.INTERNAL_ERROR).toBe(500);
    });
  });

  describe("ErrorCode", () => {
    it("has standard error codes", () => {
      expect(ErrorCode.VALIDATION_ERROR).toBe("VALIDATION_ERROR");
      expect(ErrorCode.AUTH_REQUIRED).toBe("AUTH_REQUIRED");
      expect(ErrorCode.NOT_FOUND).toBe("NOT_FOUND");
      expect(ErrorCode.RATE_LIMITED).toBe("RATE_LIMITED");
    });
  });
});
