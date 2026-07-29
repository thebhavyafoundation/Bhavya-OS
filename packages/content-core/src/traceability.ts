import {
  BoardMeeting,
  Resolution,
  ActionItem,
  Policy,
  GovernanceEvidence,
  TraceabilityChain,
} from "./models.js";
import {
  getBoardMeetingById,
  getResolutionsByMeeting,
} from "./governance.js";
import {
  getActionItems,
  getActionItemById,
} from "./action-items.js";
import {
  getMissions,
  getProjects,
  getPolicies,
} from "./index.js";

// ── Traceability Chain ─────────────────────────────────────

export function buildTraceabilityChain(meetingId: string): TraceabilityChain {
  const meeting = getBoardMeetingById(meetingId);
  const resolutions = meeting ? getResolutionsByMeeting(meetingId) : [];
  const actionItems = getActionItems().filter((a) =>
    resolutions.some((r) => r.id === a.sourceId)
  );

  return {
    meeting: meeting || undefined,
    resolution: resolutions[0],
    actionItems,
    evidence: [],
  };
}

export function traceFromResolution(resolutionId: string): TraceabilityChain {
  const actionItems = getActionItems().filter(
    (a) => a.source === "resolution" && a.sourceId === resolutionId
  );

  // Find meeting from resolution
  const allResolutions = getActionItems();
  const resolution = actionItems[0];

  return {
    actionItems,
    evidence: [],
  };
}

export function traceFromActionItem(actionItemId: string): TraceabilityChain {
  const actionItem = getActionItemById(actionItemId);
  if (!actionItem) {
    return { actionItems: [], evidence: [] };
  }

  // Trace back to source
  let meeting: BoardMeeting | undefined;
  let resolution: Resolution | undefined;

  if (actionItem.source === "resolution") {
    // Find resolution and its meeting
    const allResolutions = getActionItems().filter(
      (a) => a.source === "resolution" && a.sourceId === actionItem.sourceId
    );
    // Resolution would be found via governance module
  }

  // Trace forward to mission/project
  let mission: any;
  let project: any;
  let policy: Policy | undefined;

  if (actionItem.missionId) {
    mission = getMissions().find((m) => m.id === actionItem.missionId);
  }

  if (actionItem.projectId) {
    project = getProjects().find((p) => p.id === actionItem.projectId);
  }

  if (actionItem.policyId) {
    policy = getPolicies().find((p) => p.id === actionItem.policyId);
  }

  return {
    meeting,
    resolution,
    actionItems: [actionItem],
    mission,
    project,
    policy,
    evidence: [],
  };
}

export function traceFromMission(missionId: string): TraceabilityChain {
  const actionItems = getActionItems().filter(
    (a) => a.missionId === missionId
  );

  return {
    actionItems,
    evidence: [],
  };
}

// ── Evidence Management ────────────────────────────────────

const EVIDENCE_FILE = "data/evidence.json";

function loadEvidence(): GovernanceEvidence[] {
  const { readFileSync, existsSync } = require("fs");
  const { join } = require("path");
  const filePath = join(process.cwd(), EVIDENCE_FILE);
  if (!existsSync(filePath)) return [];
  try {
    return JSON.parse(readFileSync(filePath, "utf-8"));
  } catch {
    return [];
  }
}

function saveEvidence(evidence: GovernanceEvidence[]): void {
  const { writeFileSync, mkdirSync, existsSync } = require("fs");
  const { join } = require("path");
  const dir = join(process.cwd(), "data");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(join(process.cwd(), EVIDENCE_FILE), JSON.stringify(evidence, null, 2));
}

export function getEvidence(): GovernanceEvidence[] {
  return loadEvidence();
}

export function getEvidenceByActionItem(actionItemId: string): GovernanceEvidence[] {
  return loadEvidence().filter((e) => e.actionItemId === actionItemId);
}

export function addEvidence(evidence: Omit<GovernanceEvidence, "id" | "created">): GovernanceEvidence {
  const allEvidence = loadEvidence();
  const newEvidence: GovernanceEvidence = {
    ...evidence,
    id: `evidence-${Date.now()}`,
    created: new Date().toISOString(),
  };
  allEvidence.push(newEvidence);
  saveEvidence(allEvidence);
  return newEvidence;
}

export function verifyEvidence(id: string, verifiedBy: string): GovernanceEvidence | null {
  const allEvidence = loadEvidence();
  const index = allEvidence.findIndex((e) => e.id === id);
  if (index === -1) return null;
  allEvidence[index] = {
    ...allEvidence[index],
    verifiedBy,
    verifiedAt: new Date().toISOString(),
  };
  saveEvidence(allEvidence);
  return allEvidence[index];
}

// ── Full Traceability Query ────────────────────────────────

export function getFullTraceability(): {
  meetings: number;
  resolutions: number;
  actionItems: number;
  missions: number;
  projects: number;
  evidence: number;
  completionRate: number;
} {
  const actionItems = getActionItems();
  const completed = actionItems.filter((a) => a.status === "completed");
  const withEvidence = actionItems.filter((a) => a.evidenceIds.length > 0);

  return {
    meetings: 0, // Would come from governance module
    resolutions: 0,
    actionItems: actionItems.length,
    missions: getMissions().length,
    projects: getProjects().length,
    evidence: loadEvidence().length,
    completionRate: actionItems.length > 0
      ? Math.round((completed.length / actionItems.length) * 100)
      : 100,
  };
}
