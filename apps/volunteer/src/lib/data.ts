import {
  getVolunteers as _getVolunteers,
  getVolunteer as _getVolunteer,
  createVolunteer as _createVolunteer,
  getSkills as _getSkills,
  getSkill as _getSkill,
  createSkill as _createSkill,
  getTrainings as _getTrainings,
  getTraining as _getTraining,
  getTrainingsByVolunteer as _getTrainingsByVolunteer,
  createTraining as _createTraining,
  getAssignments as _getAssignments,
  getAssignment as _getAssignment,
  getAssignmentsByVolunteer as _getAssignmentsByVolunteer,
  createAssignment as _createAssignment,
  getParticipations as _getParticipations,
  getParticipation as _getParticipation,
  getParticipationsByVolunteer as _getParticipationsByVolunteer,
  createParticipation as _createParticipation,
  getRecognitions as _getRecognitions,
  getRecognition as _getRecognition,
  getRecognitionsByVolunteer as _getRecognitionsByVolunteer,
  createRecognition as _createRecognition,
  getVolunteerStats as _getVolunteerStats,
} from "@bhavya/content-core";

export const getVolunteers = _getVolunteers;
export const getVolunteer = _getVolunteer;
export const createVolunteer = _createVolunteer;
export const getSkills = _getSkills;
export const getSkill = _getSkill;
export const createSkill = _createSkill;
export const getTrainings = _getTrainings;
export const getTraining = _getTraining;
export const getTrainingsByVolunteer = _getTrainingsByVolunteer;
export const createTraining = _createTraining;
export const getAssignments = _getAssignments;
export const getAssignment = _getAssignment;
export const getAssignmentsByVolunteer = _getAssignmentsByVolunteer;
export const createAssignment = _createAssignment;
export const getParticipations = _getParticipations;
export const getParticipation = _getParticipation;
export const getParticipationsByVolunteer = _getParticipationsByVolunteer;
export const createParticipation = _createParticipation;
export const getRecognitions = _getRecognitions;
export const getRecognition = _getRecognition;
export const getRecognitionsByVolunteer = _getRecognitionsByVolunteer;
export const createRecognition = _createRecognition;
export const getVolunteerStats = _getVolunteerStats;

export type {
  VolunteerStatus,
  Volunteer,
  Skill,
  TrainingStatus,
  Training,
  MissionType,
  AssignmentStatus,
  MissionAssignment,
  TaskStatus,
  Participation,
  RecognitionType,
  Recognition,
  VolunteerStats,
} from "@bhavya/content-core";
