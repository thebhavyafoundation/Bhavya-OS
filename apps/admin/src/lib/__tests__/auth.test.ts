import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";

import { requireAdminAuth } from "../auth";

/**
 * The admin app's authorization boundary.
 *
 * Every admin API route calls requireAdminAuth and forwards its error
 * response. If the role check is broken, an unprivileged user reaches the
 * admin API with the error response nowhere. These tests pin the three
 * branches: unauthenticated, authenticated but not admin, and admin.
 */

vi.mock("@bhavya/auth", () => ({
  requireAuth: vi.fn(),
}));

import { requireAuth } from "@bhavya/auth";

const mockRequireAuth = vi.mocked(requireAuth);

const fakeRequest = {} as unknown as NextRequest;

describe("requireAdminAuth", () => {
  beforeEach(() => {
    mockRequireAuth.mockReset();
  });

  it("rejects an unauthenticated request with 401", async () => {
    mockRequireAuth.mockResolvedValue(null);

    const result = await requireAdminAuth(fakeRequest);

    expect(result.error).toBeDefined();
    expect(result.error?.status).toBe(401);
    expect(await result.error?.json()).toEqual({
      error: "Authentication required",
    });
    expect(result.user).toBeUndefined();
  });

  it("rejects an authenticated non-admin user with 403", async () => {
    for (const role of ["student", "staff", "volunteer", "parent"]) {
      mockRequireAuth.mockResolvedValue({
        id: "user-1",
        role,
        name: "A Person",
        email: "a@example.com",
      } as never);

      const result = await requireAdminAuth(fakeRequest);

      expect(result.error, `role=${role}`).toBeDefined();
      expect(result.error?.status, `role=${role}`).toBe(403);
      expect(await result.error?.json()).toEqual({
        error: "Insufficient permissions",
      });
      expect(result.user).toBeUndefined();
    }
  });

  it("lets an admin through with the user attached", async () => {
    const admin = {
      id: "user-9",
      role: "admin",
      name: "Admin Person",
      email: "admin@example.com",
    } as never;
    mockRequireAuth.mockResolvedValue(admin);

    const result = await requireAdminAuth(fakeRequest);

    expect(result.error).toBeUndefined();
    expect(result.user).toBe(admin);
  });
});
