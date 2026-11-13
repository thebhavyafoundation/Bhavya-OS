import { describe, it, expect } from "vitest";

import { GET } from "../../app/api/health/route";

/**
 * The health endpoint is the platform's probe surface: load balancers and
 * uptime monitors hit it with no credentials. Its contract is that it stays
 * public and returns the correct shape. These tests pin both.
 */

describe("health endpoint", () => {
  it("responds healthy with the service name", async () => {
    const response = await GET();
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.status).toBe("healthy");
    expect(body.service).toBe("docs");
    expect(typeof body.uptime).toBe("number");
    expect(body.uptime).toBeGreaterThanOrEqual(0);
    expect(typeof body.timestamp).toBe("string");
  });
});
