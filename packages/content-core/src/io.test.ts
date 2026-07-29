import { describe, it, expect } from "vitest";
import { readJSON, writeJSON, listDir, ensureDir } from "./io";

describe("io", () => {
  describe("ensureDir", () => {
    it("does not throw when creating directory", () => {
      expect(() => ensureDir("__test_io_dir__")).not.toThrow();
    });
  });

  describe("writeJSON / readJSON", () => {
    it("writes and reads JSON files", () => {
      ensureDir("__test_io_json__");
      const data = { id: "test-1", name: "Test Item", count: 42 };
      writeJSON("__test_io_json__", "test-item.json", data);
      const result = readJSON("__test_io_json__/test-item.json", {});
      expect(result).toEqual(data);
    });

    it("returns fallback on read error", () => {
      const result = readJSON("__test_io_json__/nonexistent.json", { fallback: true });
      expect(result).toEqual({ fallback: true });
    });
  });

  describe("listDir", () => {
    it("lists files in directory", () => {
      ensureDir("__test_io_list__");
      writeJSON("__test_io_list__", "alpha.json", { id: "alpha" });
      writeJSON("__test_io_list__", "beta.json", { id: "beta" });
      const files = listDir("__test_io_list__");
      expect(files).toContain("alpha.json");
      expect(files).toContain("beta.json");
    });

    it("returns empty array for nonexistent directory", () => {
      const files = listDir("__test_io_nonexistent__");
      expect(files).toEqual([]);
    });
  });
});
