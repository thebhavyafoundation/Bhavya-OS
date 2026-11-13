import { describe, expect, it } from "vitest";

import { cacheControlFor } from "@/lib/http/cache-policy";

/**
 * The cache policy guards against the one failure mode that matters most:
 * a personalised or sensitive response being held by a shared cache and
 * served to someone else.
 *
 * The policy is fail-closed for private surfaces, and explicitly declines to
 * claim the public content pages, whose shared-cache TTL is a product
 * decision (risk R-15) that has not been taken yet.
 */

const PRIVATE_PATHS = [
  "/dashboard",
  "/dashboard/activity",
  "/app",
  "/app/subtask",
  "/studio",
  "/studio/projects",
  "/onboarding",
  "/api",
  "/api/student/progress",
  "/api/admin/members",
  "/api/studio/extension",
  "/account",
  "/account/billing",
  "/profile",
  "/settings",
  "/os/admin",
  "/os/mission",
  "/os/operations",
  "/os/governance",
  "/os/finance",
  "/os/projects",
  "/os/coach",
  "/os/approvals",
  "/os/inventory",
];

const PUBLIC_PATHS = [
  "/",
  "/about",
  "/login",
  "/register",
  "/curriculum",
  "/faq",
  "/transparency",
  "/forest",
  "/impact",
  "/research",
  "/heritage",
  "/knowledge",
  "/programs",
  "/community",
  "/terms",
  "/privacy",
  "/os",
  "/os/knowledge",
  "/os/search",
  "/os/research",
  "/appzzz",
  "/profiles",
  "/about/team",
];

describe("cache policy", () => {
  it("never lets a private surface into a shared cache", () => {
    for (const path of PRIVATE_PATHS) {
      const decision = cacheControlFor(path);
      expect(decision, path).not.toBeNull();
      expect(decision!.value).toBe("private, no-store");
      expect(decision!.reason).not.toBe("");
    }
  });

  it("does not claim the public surface, whose TTL is a product decision", () => {
    for (const path of PUBLIC_PATHS) {
      expect(cacheControlFor(path), path).toBeNull();
    }
  });

  it("does not claim the hashed static assets", () => {
    expect(cacheControlFor("/_next/static/chunks/main-app.js")).toBeNull();
    expect(cacheControlFor("/_next/static/css/app.css")).toBeNull();
  });

  it("does not mistake a public path that merely starts with a word prefix for a private one", () => {
    expect(cacheControlFor("/appzzz")).toBeNull();
    expect(cacheControlFor("/profiles")).toBeNull();
    expect(cacheControlFor("/oszzz")).toBeNull();
    expect(cacheControlFor("/accountx")).toBeNull();
  });

  it("matches a private prefix exactly as well as by path segment", () => {
    expect(cacheControlFor("/settings")).not.toBeNull();
    expect(cacheControlFor("/settings/billing")).not.toBeNull();
    expect(cacheControlFor("/os/mission")).not.toBeNull();
    expect(cacheControlFor("/os/mission/create")).not.toBeNull();
  });
});
