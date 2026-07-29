import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

// ── Succession Support Types ───────────────────────────────

export interface Role {
  id: string;
  name: string;
  description: string;
  domain: "forest" | "heritage" | "research" | "volunteer" | "governance" | "knowledge" | "cross-domain";
  status: "active" | "vacant" | "transitioning";
  currentHolder?: string;
  responsibilities: string[];
  keyDecisions: string[];
  activeWork: string[];
  recommendedReading: string[];
  institutionalContext: string;
  successionPlan?: SuccessionPlan;
  created: string;
  lastUpdated: string;
}

export interface SuccessionPlan {
  id: string;
  roleId: string;
  potentialSuccessors: SuccessorCandidate[];
  transitionTimeline: string;
  keyKnowledge: string[];
  criticalRelationships: string[];
  riskFactors: string[];
  created: string;
  lastUpdated: string;
}

export interface SuccessorCandidate {
  id: string;
  name: string;
  readiness: "ready" | "near-ready" | "developing" | "future";
  strengths: string[];
  developmentAreas: string[];
  notes: string;
}

export interface TransitionRecord {
  id: string;
  roleId: string;
  fromHolder: string;
  toHolder: string;
  transitionDate: string;
  duration: string;
  knowledgeTransferred: string[];
  lessonsLearned: string[];
  notes: string;
  created: string;
}

export interface SuccessionStats {
  totalRoles: number;
  activeRoles: number;
  vacantRoles: number;
  transitioningRoles: number;
  rolesWithSuccessionPlan: number;
  rolesWithoutSuccessionPlan: number;
  totalTransitions: number;
}

// ── Succession Storage ─────────────────────────────────────

const DATA_DIR = join(import.meta.dirname, "..", "..", "data");
const ROLES_FILE = join(DATA_DIR, "roles.json");
const TRANSITIONS_FILE = join(DATA_DIR, "transitions.json");

function readRolesData(): Role[] {
  if (!existsSync(ROLES_FILE)) {
    return [];
  }
  return JSON.parse(readFileSync(ROLES_FILE, "utf-8")) as Role[];
}

function writeRolesData(data: Role[]): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  writeFileSync(ROLES_FILE, JSON.stringify(data, null, 2));
}

function readTransitionsData(): TransitionRecord[] {
  if (!existsSync(TRANSITIONS_FILE)) {
    return [];
  }
  return JSON.parse(readFileSync(TRANSITIONS_FILE, "utf-8")) as TransitionRecord[];
}

function writeTransitionsData(data: TransitionRecord[]): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  writeFileSync(TRANSITIONS_FILE, JSON.stringify(data, null, 2));
}

// ── Role CRUD ──────────────────────────────────────────────

export function createRole(
  name: string,
  description: string,
  domain: Role["domain"],
  responsibilities: string[] = [],
  keyDecisions: string[] = [],
  activeWork: string[] = [],
  recommendedReading: string[] = [],
  institutionalContext: string = ""
): Role {
  const roles = readRolesData();
  const now = new Date().toISOString();

  const role: Role = {
    id: `role-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name,
    description,
    domain,
    status: "vacant",
    responsibilities,
    keyDecisions,
    activeWork,
    recommendedReading,
    institutionalContext,
    created: now,
    lastUpdated: now,
  };

  roles.push(role);
  writeRolesData(roles);
  return role;
}

export function getRoles(): Role[] {
  return readRolesData();
}

export function getRoleById(id: string): Role | undefined {
  return readRolesData().find((r) => r.id === id);
}

export function getRolesByDomain(domain: Role["domain"]): Role[] {
  return readRolesData().filter((r) => r.domain === domain);
}

export function getRolesByStatus(status: Role["status"]): Role[] {
  return readRolesData().filter((r) => r.status === status);
}

export function updateRole(
  id: string,
  updates: Partial<Omit<Role, "id" | "created">>
): Role {
  const roles = readRolesData();
  const index = roles.findIndex((r) => r.id === id);
  if (index === -1) {
    throw new Error(`Role not found: ${id}`);
  }

  roles[index] = {
    ...roles[index],
    ...updates,
    lastUpdated: new Date().toISOString(),
  };

  writeRolesData(roles);
  return roles[index];
}

export function assignHolder(roleId: string, holderName: string): Role {
  return updateRole(roleId, {
    status: "active",
    currentHolder: holderName,
  });
}

export function transitionHolder(
  roleId: string,
  newHolderName: string,
  knowledgeTransferred: string[] = [],
  lessonsLearned: string[] = [],
  notes: string = ""
): { role: Role; transition: TransitionRecord } {
  const role = getRoleById(roleId);
  if (!role) {
    throw new Error(`Role not found: ${roleId}`);
  }

  const fromHolder = role.currentHolder || "Vacant";
  const now = new Date().toISOString();

  // Create transition record
  const transition: TransitionRecord = {
    id: `transition-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    roleId,
    fromHolder,
    toHolder: newHolderName,
    transitionDate: now,
    duration: "Immediate",
    knowledgeTransferred,
    lessonsLearned,
    notes,
    created: now,
  };

  const transitions = readTransitionsData();
  transitions.push(transition);
  writeTransitionsData(transitions);

  // Update role
  const updatedRole = updateRole(roleId, {
    status: "active",
    currentHolder: newHolderName,
  });

  return { role: updatedRole, transition };
}

// ── Succession Planning ────────────────────────────────────

export function createSuccessionPlan(
  roleId: string,
  potentialSuccessors: SuccessorCandidate[] = [],
  transitionTimeline: string = "To be determined",
  keyKnowledge: string[] = [],
  criticalRelationships: string[] = [],
  riskFactors: string[] = []
): SuccessionPlan {
  const roles = readRolesData();
  const roleIndex = roles.findIndex((r) => r.id === roleId);
  if (roleIndex === -1) {
    throw new Error(`Role not found: ${roleId}`);
  }

  const now = new Date().toISOString();
  const plan: SuccessionPlan = {
    id: `plan-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    roleId,
    potentialSuccessors,
    transitionTimeline,
    keyKnowledge,
    criticalRelationships,
    riskFactors,
    created: now,
    lastUpdated: now,
  };

  roles[roleIndex].successionPlan = plan;
  roles[roleIndex].lastUpdated = now;
  writeRolesData(roles);

  return plan;
}

export function updateSuccessionPlan(
  roleId: string,
  updates: Partial<Omit<SuccessionPlan, "id" | "roleId" | "created">>
): SuccessionPlan {
  const roles = readRolesData();
  const roleIndex = roles.findIndex((r) => r.id === roleId);
  if (roleIndex === -1) {
    throw new Error(`Role not found: ${roleId}`);
  }

  if (!roles[roleIndex].successionPlan) {
    throw new Error(`No succession plan exists for role: ${roleId}`);
  }

  const now = new Date().toISOString();
  roles[roleIndex].successionPlan = {
    ...roles[roleIndex].successionPlan!,
    ...updates,
    lastUpdated: now,
  };
  roles[roleIndex].lastUpdated = now;
  writeRolesData(roles);

  return roles[roleIndex].successionPlan!;
}

// ── Transition Records ─────────────────────────────────────

export function getTransitions(): TransitionRecord[] {
  return readTransitionsData();
}

export function getTransitionsByRole(roleId: string): TransitionRecord[] {
  return readTransitionsData().filter((t) => t.roleId === roleId);
}

// ── Succession Stats ───────────────────────────────────────

export function getSuccessionStats(): SuccessionStats {
  const roles = readRolesData();
  const transitions = readTransitionsData();

  return {
    totalRoles: roles.length,
    activeRoles: roles.filter((r) => r.status === "active").length,
    vacantRoles: roles.filter((r) => r.status === "vacant").length,
    transitioningRoles: roles.filter((r) => r.status === "transitioning").length,
    rolesWithSuccessionPlan: roles.filter((r) => r.successionPlan).length,
    rolesWithoutSuccessionPlan: roles.filter((r) => !r.successionPlan).length,
    totalTransitions: transitions.length,
  };
}

// ── Succession Readiness ───────────────────────────────────

export function assessSuccessionReadiness(): {
  readyRoles: number;
  nearReadyRoles: number;
  atRiskRoles: number;
  details: Array<{
    roleId: string;
    roleName: string;
    status: string;
    hasPlan: boolean;
    readyCandidates: number;
    riskLevel: "low" | "medium" | "high";
  }>;
} {
  const roles = readRolesData();
  const details = roles.map((role) => {
    const hasPlan = !!role.successionPlan;
    const readyCandidates = role.successionPlan?.potentialSuccessors.filter(
      (s) => s.readiness === "ready" || s.readiness === "near-ready"
    ).length || 0;

    let riskLevel: "low" | "medium" | "high" = "low";
    if (!hasPlan) {
      riskLevel = "high";
    } else if (readyCandidates === 0) {
      riskLevel = "high";
    } else if (readyCandidates === 1) {
      riskLevel = "medium";
    }

    return {
      roleId: role.id,
      roleName: role.name,
      status: role.status,
      hasPlan,
      readyCandidates,
      riskLevel,
    };
  });

  const readyRoles = details.filter((d) => d.riskLevel === "low").length;
  const nearReadyRoles = details.filter((d) => d.riskLevel === "medium").length;
  const atRiskRoles = details.filter((d) => d.riskLevel === "high").length;

  return {
    readyRoles,
    nearReadyRoles,
    atRiskRoles,
    details,
  };
}
