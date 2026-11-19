import { describe, it, expect } from "vitest";

import { getSearchIndex, searchAll } from "../data";

/**
 * Search corpus integrity guards.
 *
 * The search page is the only way visitors find the standards and decision
 * records. The index is generated from content, and a document whose fields
 * were dropped renders an invisible, unsearchable record.
 */

describe("search index", () => {
  const index = getSearchIndex();

  it("contains the expected knowledge documents", () => {
    expect(index.length).toBeGreaterThanOrEqual(6);
  });

  it("requires id, title, category, path and content on every document", () => {
    for (const doc of index) {
      for (const [key, value] of Object.entries({
        id: doc.id,
        title: doc.title,
        category: doc.category,
        path: doc.path,
        content: doc.content,
      })) {
        expect(typeof value, `${doc.id} ${key}`).toBe("string");
        expect(value.trim().length, `${doc.id} ${key} is blank`).toBeGreaterThan(0);
      }
    }
  });

  it("has unique ids", () => {
    const ids = index.map((doc) => doc.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every hit for a query actually contains that query", () => {
    const q = "architecture";
    const hits = searchAll(q);
    expect(hits.length).toBeGreaterThan(0);

    for (const doc of hits) {
      const matches =
        doc.title.toLowerCase().includes(q) ||
        doc.content.toLowerCase().includes(q) ||
        doc.tags?.some((tag) => tag.toLowerCase().includes(q));
      expect(matches, `${doc.id} does not match the query`).toBe(true);
    }
  });

  it("returns nothing for a query that appears nowhere", () => {
    expect(searchAll("zqx-nonexistent-token-zzz")).toEqual([]);
  });
});
