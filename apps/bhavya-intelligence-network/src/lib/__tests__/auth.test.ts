import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";

import { requireAuthenticated, requireOperator } from "../auth";

/**
 * The Intelligence Network's authorization boundary.
 *
 * Routes are classified as OPERATOR (admin/operator) or AUTHENTICATED (any
 * user). The operator helper is the one guarding the approvals and engine
 * surfaces, so a widened role check there hands an unprivileged user the
 * whole intelligence loop. These tests pin the branches for both helpers.
 */

vi.mock("@bhavya/auth", () => ({
  requireAuth: vi.fn(),
}));

import { requireAuth } from "@bhavya/auth";

const mockRequireAuth = vi.mocked(requireAuth);
const fakeRequest = {} as unknown as NextRequest;

describe("requireAuthenticated", () => {
  beforeEach(() => {
    mockRequireAuth.mockReset();
  });

  it("rejects an unauthenticated request with 401", async () => {
    mockRequireAuth.mockResolvedValue(null);

    const result = await requireAuthenticated(fakeRequest);

    expect(result.error?.status).toBe(401);
    expect(await result.error?.json()).toEqual({
      error: "Authentication required",
    });
  });

  it("lets any authenticated role through", async () => {
    for (const role of ["student", "staff", "operator", "admin", "volunteer"]) {
      const user = { id: "user-1", role, name: "A", email: "a@b.org" } as never;
      mockRequireAuth.mockResolvedValue(user);

      const result = await requireAuthenticated(fakeRequest);

      expect(result.error, `role=${role}`).toBeUndefined();
      expect(result.user).toBe(user);
    }
  });
});

describe("requireOperator", () => {
  beforeEach(() => {
    mockRequireAuth.mockReset();
  });

  it("rejects an unauthenticated request with 401", async () => {
    mockRequireAuth.mockResolvedValue(null);

    const result = await requireOperator(fakeRequest);

    expect(result.error?.status).toBe(401);
  });

  it("rejects an authenticated non-operator with 403", async () => {
    for (const role of ["student", "staff", "volunteer", "parent"]) {
      mockRequireAuth.mockResolvedValue({
        id: "user-1",
        role,
        name: "A",
        email: "a@b.org",
      } as never);

      const result = await requireOperator(fakeRequest);

      expect(result.error?.status, `role=${role}`).toBe(403);
      expect(await result.error?.json()).toEqual({
        error: "Insufficient permissions",
      });
    }
  });

  it("lets an operator and an admin through", async () => {
    for (const role of ["operator", "admin"]) {
      const user = { id: "user-2", role, name: "An Operator", email: "o@b.org" } as never;
      mockRequireAuth.mockResolvedValue(user);

      const result = await requireOperator(fakeRequest);

      expect(result.error, `role=${role}`).toBeUndefined();
      expect(result.user).toBe(user);
    }
  });
});
