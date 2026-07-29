import { describe, it, expect } from "vitest";
import {
  getGraphNodeNeighbors,
  getGraphStats,
  getRelationships,
} from "./graph";

describe("graph", () => {
  describe("getGraphNodeNeighbors", () => {
    it("returns an array of neighboring nodes", () => {
      const rels = getRelationships();
      if (rels.length > 0) {
        const nodeId = rels[0].sourceId;
        const neighbors = getGraphNodeNeighbors(nodeId);
        expect(Array.isArray(neighbors)).toBe(true);
      }
    });

    it("returns empty array for nonexistent node", () => {
      const neighbors = getGraphNodeNeighbors("nonexistent-node-id");
      expect(neighbors).toEqual([]);
    });
  });

  describe("getGraphStats", () => {
    it("returns graph statistics", () => {
      const stats = getGraphStats();
      expect(stats).toHaveProperty("totalNodes");
      expect(stats).toHaveProperty("totalEdges");
      expect(typeof stats.totalNodes).toBe("number");
      expect(typeof stats.totalEdges).toBe("number");
    });
  });
});
