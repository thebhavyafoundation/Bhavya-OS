import { describe, it, expect } from "vitest";
import {
  getVolunteers,
  getVolunteer,
  createVolunteer,
  getSkills,
  createSkill,
  getTrainings,
  createTraining,
  getAssignments,
  createAssignment,
  getParticipations,
  createParticipation,
  getRecognitions,
  createRecognition,
  getVolunteerStats,
} from "./volunteer";

describe("volunteer", () => {
  describe("getVolunteers", () => {
    it("returns an array of volunteers", () => {
      const volunteers = getVolunteers();
      expect(Array.isArray(volunteers)).toBe(true);
    });
  });

  describe("createVolunteer", () => {
    it("creates a new volunteer", () => {
      const volunteer = createVolunteer({
        name: "Test Volunteer",
        email: "test@example.com",
      });
      expect(volunteer).toHaveProperty("id");
      expect(volunteer.name).toBe("Test Volunteer");
      expect(volunteer.status).toBe("active");
    });
  });

  describe("getVolunteer", () => {
    it("returns undefined for nonexistent volunteer", () => {
      const volunteer = getVolunteer("nonexistent-id");
      expect(volunteer).toBeUndefined();
    });
  });

  describe("createSkill", () => {
    it("creates a new skill", () => {
      const skill = createSkill({
        name: "Tree Planting",
        category: "forestry",
        description: "Ability to plant trees correctly",
      });
      expect(skill).toHaveProperty("id");
      expect(skill.name).toBe("Tree Planting");
    });
  });

  describe("createTraining", () => {
    it("creates a new training record", () => {
      const volunteers = getVolunteers();
      if (volunteers.length > 0) {
        const training = createTraining({
          volunteerId: volunteers[0].id,
          title: "Safety Training",
          description: "Basic safety protocols",
          category: "safety",
          provider: "Bhavya Foundation",
          hours: 4,
        });
        expect(training).toHaveProperty("id");
        expect(training.status).toBe("enrolled");
      }
    });
  });

  describe("createAssignment", () => {
    it("creates a mission assignment", () => {
      const volunteers = getVolunteers();
      if (volunteers.length > 0) {
        const assignment = createAssignment({
          volunteerId: volunteers[0].id,
          missionType: "forest",
          missionId: "test-mission-1",
          role: "Field Worker",
          description: "Assist with planting operations",
        });
        expect(assignment).toHaveProperty("id");
        expect(assignment.missionType).toBe("forest");
        expect(assignment.status).toBe("assigned");
      }
    });
  });

  describe("createParticipation", () => {
    it("creates a participation record", () => {
      const assignments = getAssignments();
      if (assignments.length > 0) {
        const participation = createParticipation({
          volunteerId: assignments[0].volunteerId,
          assignmentId: assignments[0].id,
          missionType: assignments[0].missionType,
          missionId: assignments[0].missionId,
          task: "Planted 50 saplings",
          description: "Morning planting session",
          hours: 4,
          date: new Date().toISOString(),
        });
        expect(participation).toHaveProperty("id");
        expect(participation.hours).toBe(4);
      }
    });
  });

  describe("createRecognition", () => {
    it("creates a recognition record", () => {
      const volunteers = getVolunteers();
      if (volunteers.length > 0) {
        const recognition = createRecognition({
          volunteerId: volunteers[0].id,
          type: "milestone",
          title: "100 Hours Service",
          description: "Completed 100 hours of volunteer service",
        });
        expect(recognition).toHaveProperty("id");
        expect(recognition.type).toBe("milestone");
      }
    });
  });

  describe("getVolunteerStats", () => {
    it("returns volunteer statistics", () => {
      const stats = getVolunteerStats();
      expect(stats).toHaveProperty("totalVolunteers");
      expect(stats).toHaveProperty("totalAssignments");
      expect(stats).toHaveProperty("totalHoursLogged");
    });
  });
});
