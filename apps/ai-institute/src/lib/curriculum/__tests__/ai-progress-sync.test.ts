import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchCurriculumProgress,
  pushCurriculumProgress,
} from "../ai-progress-sync";

afterEach(() => {
  vi.unstubAllGlobals();
});

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function requestBody(mock: ReturnType<typeof vi.fn>): Record<string, unknown> {
  const calls = mock.mock.calls as unknown as [string, RequestInit][];
  return JSON.parse(String(calls[0]?.[1]?.body)) as Record<string, unknown>;
}

describe("fetchCurriculumProgress", () => {
  it("returns completed module ids from a successful response", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(200, {
        completedModules: ["l0-m1", 42, "l0-m7"],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    await expect(fetchCurriculumProgress()).resolves.toEqual([
      "l0-m1",
      "l0-m7",
    ]);
    const body = requestBody(fetchMock);
    expect(body.action).toBe("syncCurriculumProgress");
    expect(body.data).toEqual({});
  });

  it("returns null when the request is not authenticated", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("{}", { status: 401 })),
    );
    await expect(fetchCurriculumProgress()).resolves.toBeNull();
  });

  it("returns null when the server errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("{}", { status: 500 })),
    );
    await expect(fetchCurriculumProgress()).resolves.toBeNull();
  });

  it("returns null when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    await expect(fetchCurriculumProgress()).resolves.toBeNull();
  });
});

describe("pushCurriculumProgress", () => {
  it("posts the local completion list and returns the server list", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse(200, { completedModules: ["l0-m1"] }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(pushCurriculumProgress(["l0-m1", "l0-m2"])).resolves.toEqual([
      "l0-m1",
    ]);
    const body = requestBody(fetchMock);
    expect(body.action).toBe("syncCurriculumProgress");
    expect(body.data).toEqual({ completedModules: ["l0-m1", "l0-m2"] });
  });

  it("returns null when the push fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    await expect(pushCurriculumProgress(["l0-m1"])).resolves.toBeNull();
  });
});
