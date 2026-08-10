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
