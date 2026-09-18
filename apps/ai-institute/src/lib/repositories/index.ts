import type {
  UserRepository,
  StudentRepository,
  ProgressRepository,
  SessionRepository,
} from "./types";
import { SqliteUserRepository } from "./sqlite-user-repository";
import { SqliteStudentRepository } from "./sqlite-student-repository";
import { SqliteProgressRepository } from "./sqlite-progress-repository";
import { SqliteSessionRepository } from "./sqlite-session-repository";
import type { KnowledgeRepository } from "./knowledge-repository";
import { SqliteKnowledgeRepository } from "./sqlite-knowledge-repository";
import type { EvidenceRepository } from "./evidence-repository";
import { SqliteEvidenceRepository } from "./sqlite-evidence-repository";
import type { MissionControlRepository } from "./mission-control-repository";
import { SqliteMissionControlRepository } from "./sqlite-mission-control-repository";

export type {
  User,
  CreateUserInput,
  StudentProfile,
  CreateStudentInput,
  UserRepository,
  StudentRepository,
  ProgressRepository,
  SessionRepository,
} from "./types";

export type {
  KnowledgeObject,
  KOListSummary,
  KOProvenance,
  KOStatus,
  Concept,
  Definition,
  Example,
  Misconception,
  Exercise,
  Reference,
} from "./knowledge-repository";
export type { EvidenceRecord } from "./evidence-repository";
export type {
  McJob,
  McJobStatus,
  McArtifact,
  McArtifactStatus,
  McArtifactVersion,
  McDestination,
  McApprovalRequest,
  McApprovalStatus,
  McDecision,
  McDecisionAction,
  McRequestDecision,
  McSession,
  McEvidenceRow,
  MissionNode,
  MissionEdge,
  MissionGraph,
  MissionControlRepository,
} from "./mission-control-repository";

export function getUserRepository(): UserRepository {
  return new SqliteUserRepository();
}

export function getStudentRepository(): StudentRepository {
  return new SqliteStudentRepository();
}

export function getProgressRepository(): ProgressRepository {
  return new SqliteProgressRepository();
}

export function getSessionRepository(): SessionRepository {
  return new SqliteSessionRepository();
}

export function getKnowledgeRepository(): KnowledgeRepository {
  return new SqliteKnowledgeRepository();
}

export function getEvidenceRepository(): EvidenceRepository {
  return new SqliteEvidenceRepository();
}

export function getMissionControlRepository(): MissionControlRepository {
  return new SqliteMissionControlRepository();
}

export { eventKey } from "./evidence-repository";
