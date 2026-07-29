import { describe, it, expect } from "vitest";
import {
  getMissions,
  getMission,
  createMission,
  getSites,
  createSite,
  getSurveys,
  createSurvey,
  getPlantings,
  createPlanting,
  getMonitoring,
  createMonitoring,
  getImpactReports,
  createImpact,
  getForestStats,
} from "./forest";

describe("forest", () => {
  describe("getMissions", () => {
    it("returns an array of missions", () => {
      const missions = getMissions();
      expect(Array.isArray(missions)).toBe(true);
    });
  });

  describe("createMission", () => {
    it("creates a new mission", () => {
      const mission = createMission({
        name: "Test Forest Mission",
        description: "Test description",
        region: "Test Region",
      });
      expect(mission).toHaveProperty("id");
      expect(mission.name).toBe("Test Forest Mission");
      expect(mission.status).toBe("planning");
    });
  });

  describe("getMission", () => {
    it("returns undefined for nonexistent mission", () => {
      const mission = getMission("nonexistent-id");
      expect(mission).toBeUndefined();
    });
  });

  describe("createSite", () => {
    it("creates a new site", () => {
      const missions = getMissions();
      if (missions.length > 0) {
        const site = createSite({
          missionId: missions[0].id,
          name: "Test Site",
          description: "Site description",
        });
        expect(site).toHaveProperty("id");
        expect(site.name).toBe("Test Site");
      }
    });
  });

  describe("createSurvey", () => {
    it("creates a new survey", () => {
      const sites = getSites();
      if (sites.length > 0) {
        const survey = createSurvey({
          siteId: sites[0].id,
          missionId: sites[0].missionId,
          type: "baseline",
          title: "Test Survey",
          description: "Survey description",
          conductedBy: "Test Researcher",
          conductedDate: new Date().toISOString(),
        });
        expect(survey).toHaveProperty("id");
        expect(survey.type).toBe("baseline");
      }
    });
  });

  describe("createPlanting", () => {
    it("creates a new planting", () => {
      const sites = getSites();
      if (sites.length > 0) {
        const planting = createPlanting({
          siteId: sites[0].id,
          missionId: sites[0].missionId,
          name: "Test Planting",
          species: ["Sal", "Teak"],
          targetCount: 100,
        });
        expect(planting).toHaveProperty("id");
        expect(planting.species).toEqual(["Sal", "Teak"]);
      }
    });
  });

  describe("createMonitoring", () => {
    it("creates a new monitoring entry", () => {
      const sites = getSites();
      if (sites.length > 0) {
        const monitoring = createMonitoring({
          siteId: sites[0].id,
          missionId: sites[0].missionId,
          type: "growth",
          title: "Test Monitoring",
          observations: ["Trees growing well"],
          conductedBy: "Test Observer",
          conductedDate: new Date().toISOString(),
        });
        expect(monitoring).toHaveProperty("id");
        expect(monitoring.type).toBe("growth");
      }
    });
  });

  describe("createImpact", () => {
    it("creates an impact report", () => {
      const missions = getMissions();
      if (missions.length > 0) {
        const impact = createImpact({
          missionId: missions[0].id,
          title: "Test Impact",
          summary: "Impact summary",
          areaRestoredHectares: 50,
          totalPlanted: 1000,
          survivalRate: 0.85,
          speciesCount: 5,
          period: "2026-Q1",
        });
        expect(impact).toHaveProperty("id");
        expect(impact.areaRestoredHectares).toBe(50);
      }
    });
  });

  describe("getForestStats", () => {
    it("returns forest statistics", () => {
      const stats = getForestStats();
      expect(stats).toHaveProperty("totalMissions");
      expect(stats).toHaveProperty("totalSites");
      expect(stats).toHaveProperty("totalPlantings");
    });
  });
});
