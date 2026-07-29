import { describe, it, expect } from "vitest";
import {
  getProjects,
  getProject,
  getProjectsByStatus,
  createProject,
  getSources,
  addSource,
  getEvidence,
  addEvidence,
  getReviews,
  addReview,
  getResearchStats,
} from "./research";

describe("research", () => {
  describe("getProjects", () => {
    it("returns an array of projects", () => {
      const projects = getProjects();
      expect(Array.isArray(projects)).toBe(true);
    });
  });

  describe("getProject", () => {
    it("returns undefined for nonexistent project", () => {
      const project = getProject("nonexistent-id");
      expect(project).toBeUndefined();
    });
  });

  describe("getProjectsByStatus", () => {
    it("filters projects by status", () => {
      const active = getProjectsByStatus("active");
      expect(Array.isArray(active)).toBe(true);
    });
  });

  describe("createProject", () => {
    it("creates a new project with required fields", () => {
      const project = createProject({
        title: "Test Research Project",
        principalInvestigator: "Dr. Test",
        mission: "test-mission",
      });
      expect(project).toHaveProperty("id");
      expect(project.title).toBe("Test Research Project");
      expect(project.status).toBe("idea");
    });
  });

  describe("getSources", () => {
    it("returns an array of sources", () => {
      const sources = getSources();
      expect(Array.isArray(sources)).toBe(true);
    });
  });

  describe("addSource", () => {
    it("adds a source to a project", () => {
      const projects = getProjects();
      if (projects.length > 0) {
        const source = addSource({
          name: "Test Source",
          type: "pdf",
          projectId: projects[0].id,
        });
        expect(source).toHaveProperty("id");
        expect(source.name).toBe("Test Source");
      }
    });
  });

  describe("getEvidence", () => {
    it("returns an array of evidence", () => {
      const evidence = getEvidence();
      expect(Array.isArray(evidence)).toBe(true);
    });
  });

  describe("getReviews", () => {
    it("returns an array of reviews", () => {
      const reviews = getReviews();
      expect(Array.isArray(reviews)).toBe(true);
    });
  });

  describe("getResearchStats", () => {
    it("returns research statistics", () => {
      const stats = getResearchStats();
      expect(stats).toHaveProperty("totalProjects");
      expect(stats).toHaveProperty("totalSources");
      expect(stats).toHaveProperty("totalEvidence");
    });
  });
});
