import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/auth", () => ({
  requireAuth: vi.fn(),
  extractCorrelationId: vi.fn(() => "test-correlation-id"),
}));

import { requireAuth } from "@/lib/auth";
import { POST } from "../route";

const mockRequireAuth = vi.mocked(requireAuth);

type AuthUser = Awaited<ReturnType<typeof requireAuth>>;

function mockUser(role: string): AuthUser {
  return {
    id: "user-1",
    email: "parent@example.com",
    role,
  } as unknown as AuthUser;
}

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/student/progress", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

describe("POST /api/student/progress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    mockRequireAuth.mockResolvedValue(null);
    const res = await POST(
      makeRequest({
        action: "completeLesson",
        data: { data: { lessonId: "lesson-1" } },
      }),
    );
    expect(res.status).toBe(401);
  });

  it("returns 403 for a disallowed role (camelCase action)", async () => {
    mockRequireAuth.mockResolvedValue(mockUser("parent"));
    const res = await POST(
      makeRequest({
        action: "completeLesson",
        data: { data: { lessonId: "lesson-1" } },
      }),
    );
    expect(res.status).toBe(403);
    await expect(res.json()).resolves.toEqual({
      error: "Insufficient permissions",
    });
  });

  it("returns 403 for a disallowed role (kebab-case action)", async () => {
    mockRequireAuth.mockResolvedValue(mockUser("parent"));
    const res = await POST(
      makeRequest({
        action: "complete-lesson",
        data: { data: { lessonId: "lesson-1" } },
      }),
    );
    expect(res.status).toBe(403);
    await expect(res.json()).resolves.toEqual({
      error: "Insufficient permissions",
    });
  });
});
