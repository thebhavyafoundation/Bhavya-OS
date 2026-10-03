import { describe, it, expect } from "vitest";
import {
  getAllModules,
  getTotalModules,
  TRACKS,
  getTrackCount,
  levelParams,
  moduleParams,
  isLevelParam,
  getModule,
} from "../index";

describe("curriculum registry", () => {
  it("totals 86 computed modules (D2)", () => {
    expect(getTotalModules()).toBe(86);
    expect(getAllModules().length).toBe(86);
  });
  it("track counts are 6 / 6 / 38 / 36", () => {
    expect(getTrackCount("jr-a")).toBe(6);
    expect(getTrackCount("jr-b")).toBe(6);
    expect(getTrackCount("core")).toBe(38);
    expect(getTrackCount("advanced")).toBe(36);
    expect(TRACKS.length).toBe(4);
  });
  it("exposes 15 level params and 86 module params for routes", () => {
    expect(levelParams().length).toBe(15);
    expect(moduleParams().length).toBe(86);
    expect(levelParams()).toContain("jr-a");
    expect(isLevelParam("jr-b")).toBe(true);
    expect(isLevelParam("banana")).toBe(false);
  });
  it("resolves a module by level + id", () => {
    expect(getModule("3", "l3-m2")?.level).toBe("3");
    expect(getModule("jr-a", "jr-a-1")?.ageBand).toBe("6-8");
  });
});
