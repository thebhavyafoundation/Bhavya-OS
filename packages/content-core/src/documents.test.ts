import { describe, it, expect } from "vitest";
import {
  parseMarkdownMetadata,
  parseJsonMetadata,
} from "./documents";

describe("documents", () => {
  describe("parseMarkdownMetadata", () => {
    it("extracts title from markdown heading", () => {
      const content = `# Test Document

**Status:** published
**Date:** 2026-01-01

Body content here`;
      const metadata = parseMarkdownMetadata(content);
      expect(metadata.title).toBe("Test Document");
      expect(metadata.status).toBe("published");
      expect(metadata.date).toBe("2026-01-01");
    });

    it("returns empty title for content without heading", () => {
      const content = "No heading here";
      const metadata = parseMarkdownMetadata(content);
      expect(metadata.title).toBe("");
    });
  });

  describe("parseJsonMetadata", () => {
    it("extracts metadata from JSON record", () => {
      const data = {
        title: "Test Document",
        summary: "Test summary",
        status: "published",
        sections: [
          { heading: "Section 1", body: "Content 1" },
          { heading: "Section 2", body: "Content 2" },
        ],
      };
      const metadata = parseJsonMetadata(data);
      expect(metadata.title).toBe("Test Document");
      expect(metadata.summary).toBe("Test summary");
      expect(metadata.status).toBe("published");
      expect(metadata.content).toContain("## Section 1");
      expect(metadata.content).toContain("Content 2");
    });

    it("handles empty record", () => {
      const metadata = parseJsonMetadata({});
      expect(metadata.title).toBe("");
      expect(metadata.content).toBe("");
    });
  });
});
