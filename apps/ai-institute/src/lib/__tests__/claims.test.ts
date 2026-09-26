import { describe, it, expect } from "vitest";
import { CLAIMS, claimValue, isApprovedNumber } from "../claims";

describe("claims registry", () => {
  it("every claim has a source and checked date", () => {
    for (const c of CLAIMS) {
      expect(c.source.length).toBeGreaterThan(0);
      expect(c.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
  it("claimValue returns verified values", () => {
    expect(claimValue("curriculum-modules")).toBe(
      CLAIMS.find((c) => c.id === "curriculum-modules")!.value,
    );
    expect(() => claimValue("nope")).toThrow();
  });
  it("isApprovedNumber allows registry values and structural curriculum counts", () => {
    expect(isApprovedNumber(claimValue("curriculum-modules"))).toBe(true);
    expect(isApprovedNumber("74 modules")).toBe(true);
    expect(isApprovedNumber("10,000+ students")).toBe(false);
    expect(isApprovedNumber("8+ years")).toBe(false);
  });
});
