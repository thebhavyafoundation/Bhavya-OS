import { describe, expect, it, beforeEach, afterEach } from "vitest";

import { buildIdentity } from "@/lib/build-identity";

/**
 * Build identity guards.
 *
 * The preview worker is shared, so a deployment from one pull request replaces
 * the previous one. The identity is what makes a preview verification
 * trustworthy: it says which commit is actually serving.
 *
 * The identity must also fail honestly. A deployment that recorded nothing
 * must report "unknown" rather than an invented commit.
 */

const originalCommit = process.env.NEXT_PUBLIC_BUILD_COMMIT;
const originalTime = process.env.NEXT_PUBLIC_BUILD_TIME;

beforeEach(() => {
  delete process.env.NEXT_PUBLIC_BUILD_COMMIT;
  delete process.env.NEXT_PUBLIC_BUILD_TIME;
});

afterEach(() => {
  if (originalCommit === undefined) delete process.env.NEXT_PUBLIC_BUILD_COMMIT;
  else process.env.NEXT_PUBLIC_BUILD_COMMIT = originalCommit;
  if (originalTime === undefined) delete process.env.NEXT_PUBLIC_BUILD_TIME;
  else process.env.NEXT_PUBLIC_BUILD_TIME = originalTime;
});

describe("buildIdentity", () => {
  it("reports nothing when the build recorded no commit", () => {
    expect(buildIdentity()).toBeNull();
  });

  it("reports nothing when the recorded commit is blank", () => {
    process.env.NEXT_PUBLIC_BUILD_COMMIT = "   ";
    expect(buildIdentity()).toBeNull();
  });

  it("returns the recorded commit and build time", () => {
    process.env.NEXT_PUBLIC_BUILD_COMMIT =
      "d4fdb6ef64d85ce335ed1ca622cbecdf2936d8a1";
    process.env.NEXT_PUBLIC_BUILD_TIME = "2026-11-15T09:00:00Z";

    const identity = buildIdentity();

    expect(identity).not.toBeNull();
    expect(identity!.commit).toBe(
      "d4fdb6ef64d85ce335ed1ca622cbecdf2936d8a1",
    );
    expect(identity!.shortCommit).toBe("d4fdb6ef64d8");
    expect(identity!.builtAt).toBe("2026-11-15T09:00:00Z");
    expect(identity!.buildId).toBe("d4fdb6ef64d8-2026-11-15T09:00:00Z");
  });

  it("still identifies the commit when no build time was recorded", () => {
    process.env.NEXT_PUBLIC_BUILD_COMMIT = "abc123";

    const identity = buildIdentity();

    expect(identity!.commit).toBe("abc123");
    expect(identity!.builtAt).toBe("unknown");
    expect(identity!.buildId).toBe("abc123");
  });

  it("does not expose any other environment variable", () => {
    process.env.NEXT_PUBLIC_BUILD_COMMIT = "abc123";
    process.env.ANOTHER_SETTING = "must-not-appear";

    const identity = buildIdentity();

    expect(JSON.stringify(identity)).not.toContain("must-not-appear");
    expect(Object.keys(identity!).sort()).toEqual([
      "buildId",
      "builtAt",
      "commit",
      "shortCommit",
    ]);
  });
});
