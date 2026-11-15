import { describe, expect, it, beforeEach, afterEach } from "vitest";

import { GET } from "@/app/api/build-identity/route";

/**
 * The build-identity endpoint guards preview verification.
 *
 * Every preview deployment replaces the previous one on the shared worker, so
 * a verification that does not first establish which commit is serving proves
 * nothing. The endpoint must also never be cached, and must never disclose
 * anything beyond the commit and the build time.
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

describe("GET /api/build-identity", () => {
  it("answers 404 when the deployment recorded no identity", async () => {
    const response = await GET();

    expect(response.status).toBe(404);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("reports the commit and build time of a recorded deployment", async () => {
    process.env.NEXT_PUBLIC_BUILD_COMMIT = "85f66456b7553ab3538abd73f954ec0208e6fdbc";
    process.env.NEXT_PUBLIC_BUILD_TIME = "2026-11-15T10:15:00Z";

    const response = await GET();
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.commit).toBe("85f66456b7553ab3538abd73f954ec0208e6fdbc");
    expect(body.shortCommit).toBe("85f66456b755");
    expect(body.builtAt).toBe("2026-11-15T10:15:00Z");
  });

  it("is never cached", async () => {
    process.env.NEXT_PUBLIC_BUILD_COMMIT = "85f66456b7553ab3538abd73f954ec0208e6fdbc";

    const response = await GET();

    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("discloses nothing beyond the build identity", async () => {
    process.env.NEXT_PUBLIC_BUILD_COMMIT = "85f66456b7553ab3538abd73f954ec0208e6fdbc";
    process.env.UNRELATED_SETTING = "must-not-appear";

    const body = await (await GET()).json();

    expect(JSON.stringify(body)).not.toContain("must-not-appear");
    expect(Object.keys(body).sort()).toEqual([
      "buildId",
      "builtAt",
      "commit",
      "shortCommit",
    ]);
  });
});
