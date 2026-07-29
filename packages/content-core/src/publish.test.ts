import { describe, it, expect } from "vitest";
import {
  publishKnowledge,
  publishFieldReport,
  publishImpactReport,
  publishSurveyResult,
  publishMonitoringLog,
} from "./publish";

describe("publish", () => {
  describe("publishKnowledge", () => {
    it("publishes content to knowledge layer", () => {
      const result = publishKnowledge({
        source: "test",
        entity: "test-entity",
        entityId: "test-123",
        title: "Test Publication",
        content: "Test content for publishing pipeline",
        summary: "Test summary",
        tags: ["test"],
        visibility: "public",
        documentType: "general",
      });
      expect(result).toHaveProperty("documentId");
      expect(result).toHaveProperty("path");
      expect(result).toHaveProperty("created");
      expect(result.documentId).toBe("test-test-entity-test-123");
    });
  });

  describe("publishFieldReport", () => {
    it("publishes a field report", () => {
      const result = publishFieldReport("test", "mission", "test-mission-1", {
        title: "Test Field Report",
        content: "Field report content",
        summary: "Summary",
        tags: ["test"],
      });
      expect(result).toHaveProperty("documentId");
      expect(result.documentId).toContain("test");
    });
  });

  describe("publishImpactReport", () => {
    it("publishes an impact report", () => {
      const result = publishImpactReport("test", "impact", "test-impact-1", {
        title: "Test Impact Report",
        content: "Impact report content",
        summary: "Summary",
      });
      expect(result).toHaveProperty("documentId");
    });
  });

  describe("publishSurveyResult", () => {
    it("publishes a survey result", () => {
      const result = publishSurveyResult("test", "survey", "test-survey-1", {
        title: "Test Survey Result",
        content: "Survey content",
        summary: "Summary",
        tags: ["survey"],
      });
      expect(result).toHaveProperty("documentId");
    });
  });

  describe("publishMonitoringLog", () => {
    it("publishes a monitoring log", () => {
      const result = publishMonitoringLog("test", "monitoring", "test-mon-1", {
        title: "Test Monitoring Log",
        content: "Monitoring content",
        summary: "Summary",
      });
      expect(result).toHaveProperty("documentId");
    });
  });
});
