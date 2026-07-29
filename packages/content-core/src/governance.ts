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
    proposed: 0,
    seconded: 0,
    voting: 0,
    approved: 0,
    rejected: 0,
    tabled: 0,
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
    (r) => r.dueDate && r.dueDate < now && !["approved", "rejected", "tabled"].includes(r.status)
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
