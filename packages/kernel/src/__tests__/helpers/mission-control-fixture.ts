import type { MissionControlJobStatus } from "../../execution/mission-control-mapping.js";

// Test input copied from Mission Control.
//
// The kernel cannot import the application, so the transition table the
// mapping is exercised against has to be restated here. It is kept in one
// place so that the drift guard in `mission-control-drift.spec.ts` can compare
// this copy with the application's own source.
//
// The table is *test input*: the production mapping never holds a copy, the
// caller supplies it.

export const MISSION_CONTROL_JOB_STATUSES: MissionControlJobStatus[] = [
  "queued",
  "running",
  "awaiting_approval",
  "revising",
  "completed",
  "stopped",
  "failed",
  "cancelled",
];

export const MISSION_CONTROL_TRANSITIONS: Record<string, string[]> = {
  queued: ["running", "cancelled"],
  running: ["awaiting_approval", "stopped", "failed", "cancelled"],
  awaiting_approval: ["revising", "completed", "stopped"],
  revising: ["awaiting_approval", "stopped"],
  completed: [],
  stopped: [],
  failed: [],
  cancelled: [],
};
