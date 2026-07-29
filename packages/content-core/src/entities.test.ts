import { describe, it, expect } from "vitest";
import { getEntities, getEntity, getEntitiesByType, searchEntities } from "./entities";

describe("entities", () => {
  describe("getEntities", () => {
    it("returns an array of entities", () => {
      const entities = getEntities();
      expect(Array.isArray(entities)).toBe(true);
    });

    it("each entity has required fields", () => {
      const entities = getEntities();
      entities.forEach((entity) => {
        expect(entity).toHaveProperty("id");
        expect(entity).toHaveProperty("name");
        expect(entity).toHaveProperty("type");
        expect(entity).toHaveProperty("description");
      });
    });
  });

  describe("getEntity", () => {
    it("returns undefined for nonexistent entity", () => {
      const entity = getEntity("nonexistent-id-xyz");
      expect(entity).toBeUndefined();
    });
  });

  describe("getEntitiesByType", () => {
    it("filters entities by type", () => {
      const organizations = getEntitiesByType("organization");
      expect(Array.isArray(organizations)).toBe(true);
      organizations.forEach((entity) => {
        expect(entity.type).toBe("organization");
      });
    });
  });

  describe("searchEntities", () => {
    it("returns matching entities", () => {
      const results = searchEntities("Bhavya");
      expect(Array.isArray(results)).toBe(true);
    });

    it("returns empty array for no matches", () => {
      const results = searchEntities("zzz-nonexistent-entity-zzz");
      expect(results).toEqual([]);
    });
  });
});
