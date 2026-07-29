import { readJSON, writeJSON, listDir, ensureDir } from "./io";
import { publishFieldReport, publishImpactReport } from "./publish";

// ── Volunteer Domain ──────────────────────────────────────

export type VolunteerStatus = "active" | "inactive" | "on-mission" | "training";

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  status: VolunteerStatus;
  interests: string[];
  skillIds: string[];
  missionIds: string[];
  joinedDate: string;
  lastActive: string;
  created: string;
  updated: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  verified: boolean;
  volunteers: string[];
  created: string;
}

export type TrainingStatus = "enrolled" | "in-progress" | "completed" | "expired";

export interface Training {
  id: string;
  volunteerId: string;
  title: string;
  description: string;
  category: string;
  provider: string;
  status: TrainingStatus;
  enrolledDate: string;
  completedDate?: string;
  expiresDate?: string;
  hours: number;
  certificateUrl?: string;
  created: string;
}

export type MissionType = "forest" | "heritage" | "research";

export type AssignmentStatus = "assigned" | "active" | "completed" | "withdrawn";

export interface MissionAssignment {
  id: string;
  volunteerId: string;
  missionType: MissionType;
  missionId: string;
  role: string;
  description: string;
  status: AssignmentStatus;
  assignedDate: string;
  startDate?: string;
  endDate?: string;
  hoursLogged: number;
  created: string;
  updated: string;
}

export type VolunteerTaskStatus = "pending" | "in-progress" | "completed" | "verified";

export interface Participation {
  id: string;
  volunteerId: string;
  assignmentId: string;
  missionType: MissionType;
  missionId: string;
  task: string;
  description: string;
  status: TaskStatus;
  hours: number;
  date: string;
  verifiedBy?: string;
  created: string;
}

export type RecognitionType = "certificate" | "milestone" | "badge" | "commendation";

export interface Recognition {
  id: string;
  volunteerId: string;
  type: RecognitionType;
  title: string;
  description: string;
  awardedDate: string;
  missionType?: MissionType;
  missionId?: string;
  hoursAtAward?: number;
  created: string;
}

export interface VolunteerStats {
  totalVolunteers: number;
  volunteersByStatus: Record<VolunteerStatus, number>;
  totalSkills: number;
  totalTrainings: number;
  trainingsByStatus: Record<TrainingStatus, number>;
  totalAssignments: number;
  assignmentsByMissionType: Record<MissionType, number>;
  totalParticipations: number;
  totalRecognitions: number;
  totalHoursLogged: number;
}

// ── Data Directory ─────────────────────────────────────────

const VOLUNTEER_DIR = "content/volunteer";

function genId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

function loadFiles<T>(pattern: string, cache: T[] | null, setter: (v: T[]) => void): T[] {
  if (cache) return cache;
  ensureDir(VOLUNTEER_DIR);
  const files = listDir(VOLUNTEER_DIR).filter(
    (f) => f.startsWith(pattern) && f.endsWith(".json"),
  );
  const items = files
    .map((f) => readJSON<T>(`${VOLUNTEER_DIR}/${f}`, {} as T))
    .filter((item) => (item as Record<string, unknown>).id);
  setter(items);
  return items;
}

function saveItem<T extends { id: string }>(prefix: string, item: T): void {
  ensureDir(VOLUNTEER_DIR);
  writeJSON(VOLUNTEER_DIR, `${prefix}-${item.id}.json`, item);
}

// ── Volunteers ─────────────────────────────────────────────

let _volunteersCache: Volunteer[] | null = null;

function loadVolunteers(): Volunteer[] {
  return loadFiles("vol-", _volunteersCache, (v) => { _volunteersCache = v; });
}

export function getVolunteers(): Volunteer[] {
  return loadVolunteers();
}

export function getVolunteer(id: string): Volunteer | undefined {
  return loadVolunteers().find((v) => v.id === id);
}

export function createVolunteer(data: {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  interests?: string[];
}): Volunteer {
  const now = new Date().toISOString();
  const volunteer: Volunteer = {
    id: genId("vol"),
    name: data.name,
    email: data.email,
    phone: data.phone,
    location: data.location,
    status: "active",
    interests: data.interests || [],
    skillIds: [],
    missionIds: [],
    joinedDate: now,
    lastActive: now,
    created: now,
    updated: now,
  };
  saveItem("vol", volunteer);
  _volunteersCache = null;
  publishFieldReport("volunteer", "volunteer", volunteer.id, {
    title: `New Volunteer: ${volunteer.name}`,
    content: `Volunteer ${volunteer.name} joined Bhavya Foundation.`,
    summary: `Location: ${volunteer.location || "TBD"}. Interests: ${volunteer.interests.join(", ") || "none"}.`,
    tags: volunteer.interests,
  });
  return volunteer;
}

// ── Skills ─────────────────────────────────────────────────

let _skillsCache: Skill[] | null = null;

function loadSkills(): Skill[] {
  return loadFiles("skill-", _skillsCache, (v) => { _skillsCache = v; });
}

export function getSkills(): Skill[] {
  return loadSkills();
}

export function getSkill(id: string): Skill | undefined {
  return loadSkills().find((s) => s.id === id);
}

export function createSkill(data: {
  name: string;
  category: string;
  description: string;
}): Skill {
  const now = new Date().toISOString();
  const skill: Skill = {
    id: genId("skill"),
    name: data.name,
    category: data.category,
    description: data.description,
    verified: false,
    volunteers: [],
    created: now,
  };
  saveItem("skill", skill);
  _skillsCache = null;
  return skill;
}

// ── Training ───────────────────────────────────────────────

let _trainingCache: Training[] | null = null;

function loadTraining(): Training[] {
  return loadFiles("train-", _trainingCache, (v) => { _trainingCache = v; });
}

export function getTrainings(): Training[] {
  return loadTraining();
}

export function getTraining(id: string): Training | undefined {
  return loadTraining().find((t) => t.id === id);
}

export function getTrainingsByVolunteer(volunteerId: string): Training[] {
  return loadTraining().filter((t) => t.volunteerId === volunteerId);
}

export function createTraining(data: {
  volunteerId: string;
  title: string;
  description: string;
  category: string;
  provider: string;
  hours: number;
  expiresDate?: string;
}): Training {
  const now = new Date().toISOString();
  const training: Training = {
    id: genId("train"),
    volunteerId: data.volunteerId,
    title: data.title,
    description: data.description,
    category: data.category,
    provider: data.provider,
    status: "enrolled",
    enrolledDate: now,
    hours: data.hours,
    expiresDate: data.expiresDate,
    created: now,
  };
  saveItem("train", training);
  _trainingCache = null;
  return training;
}

// ── Mission Assignments ────────────────────────────────────

let _assignmentsCache: MissionAssignment[] | null = null;

function loadAssignments(): MissionAssignment[] {
  return loadFiles("assign-", _assignmentsCache, (v) => { _assignmentsCache = v; });
}

export function getAssignments(): MissionAssignment[] {
  return loadAssignments();
}

export function getAssignment(id: string): MissionAssignment | undefined {
  return loadAssignments().find((a) => a.id === id);
}

export function getAssignmentsByVolunteer(volunteerId: string): MissionAssignment[] {
  return loadAssignments().filter((a) => a.volunteerId === volunteerId);
}

export function createAssignment(data: {
  volunteerId: string;
  missionType: MissionType;
  missionId: string;
  role: string;
  description: string;
}): MissionAssignment {
  const now = new Date().toISOString();
  const assignment: MissionAssignment = {
    id: genId("assign"),
    volunteerId: data.volunteerId,
    missionType: data.missionType,
    missionId: data.missionId,
    role: data.role,
    description: data.description,
    status: "assigned",
    assignedDate: now,
    hoursLogged: 0,
    created: now,
    updated: now,
  };
  saveItem("assign", assignment);
  _assignmentsCache = null;

  const volunteer = getVolunteer(data.volunteerId);
  if (volunteer) {
    const updated = { ...volunteer, missionIds: [...volunteer.missionIds, assignment.id], updated: now };
    saveItem("vol", updated);
    _volunteersCache = null;
  }

  publishFieldReport("volunteer", "assignment", assignment.id, {
    title: `Volunteer Assigned: ${volunteer?.name || data.volunteerId}`,
    content: `${volunteer?.name || "Volunteer"} assigned to ${data.missionType} mission as ${data.role}.`,
    summary: `Mission type: ${data.missionType}. Role: ${data.role}.`,
    tags: [data.missionType, data.role],
  });
  return assignment;
}

// ── Participation ──────────────────────────────────────────

let _participationCache: Participation[] | null = null;

function loadParticipation(): Participation[] {
  return loadFiles("part-", _participationCache, (v) => { _participationCache = v; });
}

export function getParticipations(): Participation[] {
  return loadParticipation();
}

export function getParticipation(id: string): Participation | undefined {
  return loadParticipation().find((p) => p.id === id);
}

export function getParticipationsByVolunteer(volunteerId: string): Participation[] {
  return loadParticipation().filter((p) => p.volunteerId === volunteerId);
}

export function createParticipation(data: {
  volunteerId: string;
  assignmentId: string;
  missionType: MissionType;
  missionId: string;
  task: string;
  description: string;
  hours: number;
  date: string;
}): Participation {
  const now = new Date().toISOString();
  const participation: Participation = {
    id: genId("part"),
    volunteerId: data.volunteerId,
    assignmentId: data.assignmentId,
    missionType: data.missionType,
    missionId: data.missionId,
    task: data.task,
    description: data.description,
    status: "completed",
    hours: data.hours,
    date: data.date,
    created: now,
  };
  saveItem("part", participation);
  _participationCache = null;

  const assignment = getAssignment(data.assignmentId);
  if (assignment) {
    const updated = { ...assignment, hoursLogged: assignment.hoursLogged + data.hours, updated: now };
    saveItem("assign", updated);
    _assignmentsCache = null;
  }

  return participation;
}

// ── Recognition ────────────────────────────────────────────

let _recognitionCache: Recognition[] | null = null;

function loadRecognition(): Recognition[] {
  return loadFiles("recog-", _recognitionCache, (v) => { _recognitionCache = v; });
}

export function getRecognitions(): Recognition[] {
  return loadRecognition();
}

export function getRecognition(id: string): Recognition | undefined {
  return loadRecognition().find((r) => r.id === id);
}

export function getRecognitionsByVolunteer(volunteerId: string): Recognition[] {
  return loadRecognition().filter((r) => r.volunteerId === volunteerId);
}

export function createRecognition(data: {
  volunteerId: string;
  type: RecognitionType;
  title: string;
  description: string;
  missionType?: MissionType;
  missionId?: string;
  hoursAtAward?: number;
}): Recognition {
  const now = new Date().toISOString();
  const recognition: Recognition = {
    id: genId("recog"),
    volunteerId: data.volunteerId,
    type: data.type,
    title: data.title,
    description: data.description,
    awardedDate: now,
    missionType: data.missionType,
    missionId: data.missionId,
    hoursAtAward: data.hoursAtAward,
    created: now,
  };
  saveItem("recog", recognition);
  _recognitionCache = null;

  const volunteer = getVolunteer(data.volunteerId);
  publishImpactReport("volunteer", "recognition", recognition.id, {
    title: `${data.type}: ${data.title}`,
    content: `Recognition awarded to ${volunteer?.name || data.volunteerId}: ${data.title}`,
    summary: `Type: ${data.type}. ${data.description}`,
  });
  return recognition;
}

// ── Stats ──────────────────────────────────────────────────

export function getVolunteerStats(): VolunteerStats {
  const volunteers = loadVolunteers();
  const skills = loadSkills();
  const training = loadTraining();
  const assignments = loadAssignments();
  const participations = loadParticipation();
  const recognitions = loadRecognition();

  const volunteersByStatus: Record<VolunteerStatus, number> = {
    active: 0, inactive: 0, "on-mission": 0, training: 0,
  };
  volunteers.forEach((v) => volunteersByStatus[v.status]++);

  const trainingsByStatus: Record<TrainingStatus, number> = {
    enrolled: 0, "in-progress": 0, completed: 0, expired: 0,
  };
  training.forEach((t) => trainingsByStatus[t.status]++);

  const assignmentsByMissionType: Record<MissionType, number> = {
    forest: 0, heritage: 0, research: 0,
  };
  assignments.forEach((a) => assignmentsByMissionType[a.missionType]++);

  const totalHoursLogged = assignments.reduce((sum, a) => sum + a.hoursLogged, 0);

  return {
    totalVolunteers: volunteers.length,
    volunteersByStatus,
    totalSkills: skills.length,
    totalTrainings: training.length,
    trainingsByStatus,
    totalAssignments: assignments.length,
    assignmentsByMissionType,
    totalParticipations: participations.length,
    totalRecognitions: recognitions.length,
    totalHoursLogged,
  };
}
