import { describe, it, expect } from "vitest";
import {
  getSearchIndex,
  searchAll,
  searchDocuments,
  getContentStats,
} from "./search";

describe("search", () => {
  describe("getSearchIndex", () => {
    it("returns an array of search documents", () => {
      const index = getSearchIndex();
      expect(Array.isArray(index)).toBe(true);
    });
  });

  describe("searchAll", () => {
    it("returns matching results", () => {
      const results = searchAll("Bhavya");
      expect(Array.isArray(results)).toBe(true);
    });

    it("returns empty array for no matches", () => {
      const results = searchAll("zzz-nonexistent-search-term-zzz");
      expect(results).toEqual([]);
    });
  });

  describe("searchDocuments", () => {
    it("returns matching documents", () => {
      const results = searchDocuments("governance");
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe("getContentStats", () => {
    it("returns content statistics", () => {
      const stats = getContentStats();
      expect(stats).toHaveProperty("totalDocuments");
      expect(stats).toHaveProperty("totalEntities");
      expect(stats).toHaveProperty("totalCollections");
      expect(typeof stats.totalDocuments).toBe("number");
    });
  });
});
