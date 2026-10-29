/**
 * Regression guards for the 2026-10-28 homepage freeze incident.
 *
 * Root cause: `StorageProvider` (mounted globally) depended on an unstable
 * `useStorage()` identity and unconditionally probed B2 from the browser
 * with placeholder credentials. The CSP-blocked request failed instantly,
 * `setHealth(new object)` re-rendered the tree, and the effect re-ran ~70
 * times/second until low-end devices reported "Page Unresponsive".
 * See docs/incidents/2026-10-28-homepage-freeze-storage-health-loop.md.
 *
 * These tests pin the three invariants that keep it fixed:
 *   1. placeholders/missing env are "not configured";
 *   2. the provider's health probe is gated on that result;
 *   3. the hook facades (`useStorage`, `useAuth`) are memoized.
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import {
  isStorageConfigured,
  STORAGE_PLACEHOLDER_VALUES,
} from "../config-gate";

const srcRoot = resolve(__dirname, "../../.."); // apps/ai-institute/src

function readSrc(rel: string): string {
  return readFileSync(resolve(srcRoot, rel), "utf-8");
}

describe("isStorageConfigured", () => {
  const real = {
    S3_ENDPOINT: "https://s3.us-east-005.backblazeb2.com",
    S3_ACCESS_KEY_ID: "005abcdef0123456789ab",
    S3_SECRET_ACCESS_KEY: "K005realkeyvalue0000000000000000000000",
    S3_BUCKET_NAME: "bhavya-ai-assets",
  };

  it("is false when every variable is missing (the browser reality)", () => {
    expect(isStorageConfigured({})).toBe(false);
  });

  it("is false for every documented placeholder token", () => {
    for (const placeholder of STORAGE_PLACEHOLDER_VALUES) {
      const env = {
        S3_ENDPOINT: "https://s3.us-east-005.backblazeb2.com",
        S3_ACCESS_KEY_ID: placeholder,
        S3_SECRET_ACCESS_KEY: placeholder,
        S3_BUCKET_NAME: placeholder,
      };
      expect(isStorageConfigured(env), `placeholder: ${placeholder}`).toBe(
        false,
      );
    }
  });

  it("is false when only some variables are present", () => {
    expect(
      isStorageConfigured({
        S3_ENDPOINT: real.S3_ENDPOINT,
        S3_BUCKET_NAME: real.S3_BUCKET_NAME,
      }),
    ).toBe(false);
  });

  it("is true only when all four values look real", () => {
    expect(isStorageConfigured(real)).toBe(true);
  });
});

describe("health-probe loop guards (incident 2026-10-28)", () => {
  it("StorageProvider gates its health probe on isStorageConfigured", () => {
    const source = readSrc("lib/providers/AppProviders.tsx");
    expect(source).toContain("isStorageConfigured()");
    // The probe must live behind the gate, not run unconditionally.
    expect(source).toMatch(
      /if\s*\(\s*!isConfiguredNow\s*\)\s*\{[\s\S]*?return;[\s\S]*?\}[\s\S]*?storage\s*\n?\s*\.health\(\)/,
    );
    // State writes in the probe path must be cancellation-guarded.
    expect(source).toContain("cancelled");
  });

  it("useStorage() is memoized so provider identity is render-stable", () => {
    const source = readSrc("lib/storage/index.ts");
    expect(source).toMatch(
      /export function useStorage\(\)\s*\{\s*return useMemo/,
    );
  });

  it("useAuth() is memoized so the authenticator identity is render-stable", () => {
    const source = readSrc("lib/auth/index.ts");
    expect(source).toMatch(/export function useAuth\(\)[\s\S]*?return useMemo/);
  });
});
