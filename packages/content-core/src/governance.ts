import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import {
  BoardMeeting,
  Resolution,
  Policy,
  BoardMeetingStatus,
  ResolutionStatus,
  PolicyStatus,
  GovernanceStats,
  ResolutionEvent,
} from "./models.js";

const DATA_DIR = join(process.cwd(), "data");
const GOVERNANCE_FILE = join(DATA_DIR, "governance.json");

function ensureDataDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadGovernance(): { meetings: BoardMeeting[]; resolutions: Resolution[]; policies: Policy[] } {
  ensureDataDir();
  if (!existsSync(GOVERNANCE_FILE)) {
    return { meetings: [], resolutions: [], policies: [] };
  }
  try {
    return JSON.parse(readFileSync(GOVERNANCE_FILE, "utf-8"));
  } catch {
    return { meetings: [], resolutions: [], policies: [] };
  }
}

function saveGovernance(data: { meetings: BoardMeeting[]; resolutions: Resolution[]; policies: Policy[] }): void {
  ensureDataDir();
  writeFileSync(GOVERNANCE_FILE, JSON.stringify(data, null, 2));
}

// ── Board Meetings ─────────────────────────────────────────

export function getBoardMeetings(): BoardMeeting[] {
  return loadGovernance().meetings;
}

export function getBoardMeetingById(id: string): BoardMeeting | undefined {
  return loadGovernance().meetings.find((m) => m.id === id);
}

export function getBoardMeetingsByStatus(status: BoardMeetingStatus): BoardMeeting[] {
  return loadGovernance().meetings.filter((m) => m.status === status);
}

export function getUpcomingMeetings(): BoardMeeting[] {
  const now = new Date().toISOString();
  return loadGovernance().meetings
    .filter((m) => m.date >= now && m.status === "scheduled")
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function createBoardMeeting(meeting: Omit<BoardMeeting, "created" | "updated">): BoardMeeting {
  const data = loadGovernance();
  const newMeeting: BoardMeeting = {
    ...meeting,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  };
  data.meetings.push(newMeeting);
  saveGovernance(data);
  return newMeeting;
}

export function updateBoardMeeting(id: string, updates: Partial<BoardMeeting>): BoardMeeting | null {
  const data = loadGovernance();
  const index = data.meetings.findIndex((m) => m.id === id);
  if (index === -1) return null;
  data.meetings[index] = { ...data.meetings[index], ...updates, updated: new Date().toISOString() };
  saveGovernance(data);
  return data.meetings[index];
}

// ── Resolutions ────────────────────────────────────────────

export function getResolutions(): Resolution[] {
  return loadGovernance().resolutions;
}

export function getResolutionById(id: string): Resolution | undefined {
  return loadGovernance().resolutions.find((r) => r.id === id);
}

export function getResolutionsByStatus(status: ResolutionStatus): Resolution[] {
  return loadGovernance().resolutions.filter((r) => r.status === status);
}

export function getResolutionsByMeeting(meetingId: string): Resolution[] {
  return loadGovernance().resolutions.filter((r) => r.meetingId === meetingId);
}

export function getOverdueResolutions(): Resolution[] {
  const now = new Date().toISOString();
  return loadGovernance().resolutions.filter(
    (r) => r.dueDate && r.dueDate < now && !["approved", "rejected", "tabled"].includes(r.status)
  );
}

export function createResolution(resolution: Omit<Resolution, "created" | "updated">): Resolution {
  const data = loadGovernance();
  const newResolution: Resolution = {
    ...resolution,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  };
  data.resolutions.push(newResolution);
  saveGovernance(data);
  return newResolution;
}

export function updateResolution(id: string, updates: Partial<Resolution>): Resolution | null {
  const data = loadGovernance();
  const index = data.resolutions.findIndex((r) => r.id === id);
  if (index === -1) return null;
  data.resolutions[index] = { ...data.resolutions[index], ...updates, updated: new Date().toISOString() };
  saveGovernance(data);
  return data.resolutions[index];
}

export function advanceResolution(id: string, toStatus: ResolutionStatus, actor: string, notes?: string): Resolution | null {
  const data = loadGovernance();
  const index = data.resolutions.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const resolution = data.resolutions[index];
  const fromStatus = resolution.status;

  // Valid transitions
  const validTransitions: Record<ResolutionStatus, ResolutionStatus[]> = {
    "draft": ["under-review", "tabled"],
    "under-review": ["voting", "tabled", "draft"],
    "voting": ["approved", "rejected", "tabled"],
    "approved": ["implemented", "archived"],
    "implemented": ["archived"],
    "rejected": ["archived"],
    "tabled": ["under-review", "archived"],
    "archived": [],
  };

  if (!validTransitions[fromStatus]?.includes(toStatus)) {
    return null; // Invalid transition
  }

  const event: ResolutionEvent = {
    timestamp: new Date().toISOString(),
    fromStatus,
    toStatus,
    actor,
    notes,
  };

  data.resolutions[index] = {
    ...resolution,
    status: toStatus,
    history: [...resolution.history, event],
    implementedDate: toStatus === "implemented" ? new Date().toISOString() : resolution.implementedDate,
    updated: new Date().toISOString(),
  };

  saveGovernance(data);
  return data.resolutions[index];
}

export function getResolutionsDueForImplementation(): Resolution[] {
  const now = new Date().toISOString();
  return loadGovernance().resolutions.filter(
    (r) => r.status === "approved" && r.dueDate && r.dueDate < now
  );
}

// ── Policies ───────────────────────────────────────────────

export function getPolicies(): Policy[] {
  return loadGovernance().policies;
}

export function getPolicyById(id: string): Policy | undefined {
  return loadGovernance().policies.find((p) => p.id === id);
}

export function getPoliciesByStatus(status: PolicyStatus): Policy[] {
  return loadGovernance().policies.filter((p) => p.status === status);
}

export function getPoliciesDueForReview(): Policy[] {
  const now = new Date().toISOString();
  return loadGovernance().policies.filter(
    (p) => p.reviewDate <= now && p.status === "active"
  );
}

export function createPolicy(policy: Omit<Policy, "created" | "updated">): Policy {
  const data = loadGovernance();
  const newPolicy: Policy = {
    ...policy,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  };
  data.policies.push(newPolicy);
  saveGovernance(data);
  return newPolicy;
}

export function updatePolicy(id: string, updates: Partial<Policy>): Policy | null {
  const data = loadGovernance();
  const index = data.policies.findIndex((p) => p.id === id);
  if (index === -1) return null;
  data.policies[index] = { ...data.policies[index], ...updates, updated: new Date().toISOString() };
  saveGovernance(data);
  return data.policies[index];
}

export function createPolicyVersion(policyId: string, updates: Partial<Policy>): Policy | null {
  const data = loadGovernance();
  const index = data.policies.findIndex((p) => p.id === policyId);
  if (index === -1) return null;

  const currentPolicy = data.policies[index];
  const newVersion = currentPolicy.version + 1;

  // Archive current version
  data.policies[index] = {
    ...currentPolicy,
    status: "archived",
    supersededBy: `${policyId}-v${newVersion}`,
    updated: new Date().toISOString(),
  };

  // Create new version
  const newPolicy: Policy = {
    ...currentPolicy,
    ...updates,
    id: `${policyId}-v${newVersion}`,
    version: newVersion,
    previousVersionId: policyId,
    status: "draft",
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  };

  data.policies.push(newPolicy);
  saveGovernance(data);
  return newPolicy;
}

export function getPolicyLineage(policyId: string): Policy[] {
  const data = loadGovernance();
  const lineage: Policy[] = [];

  // Find the original policy
  let currentId = policyId;
  while (currentId) {
    const policy = data.policies.find((p) => p.id === currentId);
    if (!policy) break;
    lineage.unshift(policy);
    currentId = policy.previousVersionId || "";
  }

  // Find subsequent versions
  let nextId = policyId;
  while (nextId) {
    const policy = data.policies.find((p) => p.previousVersionId === nextId);
    if (!policy) break;
    if (policy.id !== policyId) {
      lineage.push(policy);
    }
    nextId = policy.id;
  }

  return lineage;
}

// ── Statistics ─────────────────────────────────────────────

export function getGovernanceStats(): GovernanceStats {
  const data = loadGovernance();
  const now = new Date().toISOString();

  const meetingsByStatus: Record<BoardMeetingStatus, number> = {
    scheduled: 0,
    "in-progress": 0,
    completed: 0,
    cancelled: 0,
  };

  const resolutionsByStatus: Record<ResolutionStatus, number> = {
    draft: 0,
    "under-review": 0,
    voting: 0,
    approved: 0,
    implemented: 0,
    rejected: 0,
    tabled: 0,
    archived: 0,
  };

  const policiesByStatus: Record<PolicyStatus, number> = {
    draft: 0,
    review: 0,
    active: 0,
    "under-review": 0,
    archived: 0,
  };

  for (const meeting of data.meetings) {
    meetingsByStatus[meeting.status]++;
  }

  for (const resolution of data.resolutions) {
    resolutionsByStatus[resolution.status]++;
  }

  for (const policy of data.policies) {
    policiesByStatus[policy.status]++;
  }

  const pendingReviews = data.policies.filter(
    (p) => p.status === "active" && p.reviewDate <= now
  ).length;

  const overdueResolutions = data.resolutions.filter(
    (r) => r.dueDate && r.dueDate < now && !["implemented", "archived", "rejected"].includes(r.status)
  ).length;

  return {
    totalMeetings: data.meetings.length,
    meetingsByStatus,
    totalResolutions: data.resolutions.length,
    resolutionsByStatus,
    totalPolicies: data.policies.length,
    policiesByStatus,
    pendingReviews,
    overdueResolutions,
  };
}

export function getOperationalHealth() {
  const data = loadGovernance();
  const now = new Date().toISOString();

  // Resolution implementation rate
  const approvedResolutions = data.resolutions.filter((r) => r.status === "approved");
  const implementedResolutions = data.resolutions.filter((r) => r.status === "implemented");
  const implementationRate = approvedResolutions.length > 0
    ? Math.round((implementedResolutions.length / approvedResolutions.length) * 100)
    : 100;

  // Average time from meeting to resolution
  const resolutionsWithMeetings = data.resolutions.filter((r) => {
    const meeting = data.meetings.find((m) => m.id === r.meetingId);
    return meeting && meeting.status === "completed";
  });

  let avgTimeToResolution = 0;
  if (resolutionsWithMeetings.length > 0) {
    const totalTime = resolutionsWithMeetings.reduce((sum, r) => {
      const meeting = data.meetings.find((m) => m.id === r.meetingId);
      if (meeting) {
        const meetingDate = new Date(meeting.date).getTime();
        const resolutionDate = new Date(r.created).getTime();
        return sum + (resolutionDate - meetingDate);
      }
      return sum;
    }, 0);
    avgTimeToResolution = Math.round(totalTime / resolutionsWithMeetings.length / (1000 * 60 * 60 * 24)); // days
  }

  // Policy review compliance
  const activePolicies = data.policies.filter((p) => p.status === "active");
  const policiesUpToDate = activePolicies.filter((p) => p.reviewDate > now);
  const policyComplianceRate = activePolicies.length > 0
    ? Math.round((policiesUpToDate.length / activePolicies.length) * 100)
    : 100;

  // Meetings with completed resolutions
  const completedMeetings = data.meetings.filter((m) => m.status === "completed");
  const meetingsWithResolutions = completedMeetings.filter((m) =>
    data.resolutions.some((r) => r.meetingId === m.id)
  );
  const meetingResolutionRate = completedMeetings.length > 0
    ? Math.round((meetingsWithResolutions.length / completedMeetings.length) * 100)
    : 100;

  // Resolution backlog (open resolutions)
  const openResolutions = data.resolutions.filter(
    (r) => !["implemented", "archived", "rejected"].includes(r.status)
  ).length;

  // Policies approaching review (within 30 days)
  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const policiesApproachingReview = activePolicies.filter(
    (p) => p.reviewDate <= thirtyDaysFromNow && p.reviewDate > now
  ).length;

  // Policy revision frequency (versions per policy)
  const policyIds = [...new Set(data.policies.map((p) => p.id.replace(/-v\d+$/, "")))];
  const avgPolicyVersions = policyIds.length > 0
    ? Math.round((data.policies.length / policyIds.length) * 10) / 10
    : 1;

  return {
    implementationRate,
    avgTimeToResolution,
    policyComplianceRate,
    meetingResolutionRate,
    totalActivePolicies: activePolicies.length,
    totalPendingReviews: data.policies.filter((p) => p.reviewDate <= now && p.status === "active").length,
    openResolutions,
    policiesApproachingReview,
    avgPolicyVersions,
  };
}
