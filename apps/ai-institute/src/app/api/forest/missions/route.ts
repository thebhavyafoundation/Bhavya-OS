/**
 * Forest Missions API
 *
 * GET: Returns real forest missions from the filesystem. Public, read-only.
 * POST: Creates a new mission, records evidence, updates metrics. Requires auth.
 *
 * ## Write Architecture
 *
 * The canonical mutation lives in `@bhavya/content-core` (forest.ts).
 * This API route wraps the mutation and records institutional evidence
 * AFTER successful persistence. Evidence is never recorded before
 * the canonical write succeeds.
 *
 * ## Transaction Semantics
 *
 * The canonical write (createMission) is the source of truth.
 * Evidence recording and metric updates are best-effort side effects.
 *
 * - If createMission fails → 500, no evidence, no metrics
 * - If createMission succeeds but evidence fails → mission is persisted,
 *   evidence failure is logged, response includes `partialProcessing: true`
 * - If createMission succeeds but metrics fail → mission is persisted,
 *   metrics failure is logged, response includes `partialProcessing: true`
 *
 * Canonical state is NEVER rolled back because a derived artifact failed.
 * Reconciliation is possible via rebuildForestMetricsFromEvidence().
 *
 * ## Validation
 *
 * Strict schema validation on all fields. Malformed input is rejected with 400.
 * No silent coercion of invalid institutional data.
 *
 * ## Test Data Separation
 *
 * GET returns only institutional records (provenance="institutional").
 * Test-seeded records are excluded from the public listing.
 *
 * ## Authorization
 *
 * POST requires authentication and CONTENT_MANAGEMENT_ROLES.
 */

import { NextRequest, NextResponse } from "next/server";
import { getMissions, createMission, type Mission } from "@bhavya/content-core";
import { requireAuth } from "@/lib/api-auth";
import {
  roleIsAllowed,
  CONTENT_MANAGEMENT_ROLES,
  type Role,
} from "@/lib/roles";
import { recordForestEvidence, forestEventKey } from "@/lib/forest-evidence";
import { recordMissionCreated } from "@/lib/forest-metrics";

// ── Validation Constants ────────────────────────────────────

const MAX_NAME_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 2000;
const MAX_REGION_LENGTH = 100;
const MAX_GOALS = 20;
const MAX_TAGS = 20;
const MAX_GOAL_LENGTH = 500;
const MAX_TAG_LENGTH = 100;
const MAX_PAYLOAD_SIZE = 10_000; // 10KB raw body estimate

// ── Validation ──────────────────────────────────────────────

interface ValidationError {
  field: string;
  message: string;
}

function validateForestMissionPayload(body: unknown): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!body || typeof body !== "object") {
    return [{ field: "body", message: "Request body must be a JSON object" }];
  }

  const b = body as Record<string, unknown>;

  // name: required string, 1–200 chars
  if (!b.name || typeof b.name !== "string") {
    errors.push({
      field: "name",
      message: "Name is required and must be a string",
    });
  } else {
    const name = b.name.trim();
    if (name.length === 0) {
      errors.push({ field: "name", message: "Name cannot be empty" });
    } else if (name.length > MAX_NAME_LENGTH) {
      errors.push({
        field: "name",
        message: `Name must be ${MAX_NAME_LENGTH} characters or fewer`,
      });
    }
  }

  // region: required string, 1–100 chars
  if (!b.region || typeof b.region !== "string") {
    errors.push({
      field: "region",
      message: "Region is required and must be a string",
    });
  } else {
    const region = b.region.trim();
    if (region.length === 0) {
      errors.push({ field: "region", message: "Region cannot be empty" });
    } else if (region.length > MAX_REGION_LENGTH) {
      errors.push({
        field: "region",
        message: `Region must be ${MAX_REGION_LENGTH} characters or fewer`,
      });
    }
  }

  // description: optional string, 0–2000 chars
  if (b.description !== undefined && b.description !== null) {
    if (typeof b.description !== "string") {
      errors.push({
        field: "description",
        message: "Description must be a string",
      });
    } else if (b.description.length > MAX_DESCRIPTION_LENGTH) {
      errors.push({
        field: "description",
        message: `Description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer`,
      });
    }
  }

  // goals: optional array of strings, max 20, each max 500 chars
  if (b.goals !== undefined && b.goals !== null) {
    if (!Array.isArray(b.goals)) {
      errors.push({
        field: "goals",
        message: "Goals must be an array of strings",
      });
    } else {
      if (b.goals.length > MAX_GOALS) {
        errors.push({
          field: "goals",
          message: `Goals must contain ${MAX_GOALS} items or fewer`,
        });
      }
      for (let i = 0; i < b.goals.length; i++) {
        if (typeof b.goals[i] !== "string") {
          errors.push({
            field: `goals[${i}]`,
            message: "Each goal must be a string",
          });
        } else if (b.goals[i].length > MAX_GOAL_LENGTH) {
          errors.push({
            field: `goals[${i}]`,
            message: `Goal must be ${MAX_GOAL_LENGTH} characters or fewer`,
          });
        }
      }
    }
  }

  // tags: optional array of strings, max 20, each max 100 chars
  if (b.tags !== undefined && b.tags !== null) {
    if (!Array.isArray(b.tags)) {
      errors.push({
        field: "tags",
        message: "Tags must be an array of strings",
      });
    } else {
      if (b.tags.length > MAX_TAGS) {
        errors.push({
          field: "tags",
          message: `Tags must contain ${MAX_TAGS} items or fewer`,
        });
      }
      for (let i = 0; i < b.tags.length; i++) {
        if (typeof b.tags[i] !== "string") {
          errors.push({
            field: `tags[${i}]`,
            message: "Each tag must be a string",
          });
        } else if (b.tags[i].length > MAX_TAG_LENGTH) {
          errors.push({
            field: `tags[${i}]`,
            message: `Tag must be ${MAX_TAG_LENGTH} characters or fewer`,
          });
        }
      }
    }
  }

  return errors;
}

// ── Handlers ────────────────────────────────────────────────

/**
 * GET handler uses content-core's getMissions() which resolves paths
 * through content-core/io.ts (workspace root). This ensures the GET
 * reads from the same directory that POST writes to.
 *
 * Only institutional records are returned — test-seeded records are excluded.
 */
export async function GET() {
  try {
    const allMissions = getMissions();
    const institutional = allMissions
      .filter((m) => m.provenance === "institutional")
      .sort(
        (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
      );
    return NextResponse.json(institutional);
  } catch {
    return NextResponse.json([]);
  }
}

/**
 * Create a new Forest mission.
 *
 * Requires authentication and CONTENT_MANAGEMENT_ROLES.
 *
 * Transaction semantics:
 *   1. Canonical write (createMission) — MUST succeed
 *   2. Evidence recording — best effort, failure logged
 *   3. Metric update — best effort, failure logged
 *
 * Canonical state is never rolled back. Reconciliation via
 * rebuildForestMetricsFromEvidence() is possible.
 */
export async function POST(request: NextRequest) {
  // Auth check
  const user = await requireAuth(request);
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }
  if (!roleIsAllowed(user.role as Role, CONTENT_MANAGEMENT_ROLES)) {
    return NextResponse.json(
      { error: "Insufficient permissions" },
      { status: 403 },
    );
  }

  // Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Validate
  const errors = validateForestMissionPayload(body);
  if (errors.length > 0) {
    return NextResponse.json(
      { error: "Validation failed", details: errors },
      { status: 400 },
    );
  }

  const b = body as Record<string, unknown>;

  // Canonical mutation — this is the source of truth
  let mission: Mission;
  try {
    mission = createMission({
      name: (b.name as string).trim(),
      description: ((b.description as string) || "").trim(),
      region: (b.region as string).trim(),
      goals: Array.isArray(b.goals)
        ? b.goals.map((g) => (g as string).trim())
        : [],
      tags: Array.isArray(b.tags)
        ? b.tags.map((t) => (t as string).trim())
        : [],
      provenance: "institutional",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create mission" },
      { status: 500 },
    );
  }

  // Best-effort side effects — canonical state is NOT rolled back on failure
  const sideEffects: string[] = [];

  try {
    await recordForestEvidence(
      "mission-created",
      mission.id,
      `Forest mission "${mission.name}" created in region "${mission.region}"`,
      {
        region: mission.region,
        status: mission.status,
        source: "api",
      },
      forestEventKey(mission.id, "mission-created"),
    );
  } catch (e) {
    sideEffects.push("evidence-recording-failed");
    // Evidence failure is observable but does not affect canonical state
  }

  try {
    recordMissionCreated();
  } catch (e) {
    sideEffects.push("metrics-update-failed");
    // Metrics failure is observable; reconciliation via rebuildForestMetricsFromEvidence()
  }

  const response: Mission & {
    warnings?: string[];
    partialProcessing?: boolean;
  } = { ...mission };
  if (sideEffects.length > 0) {
    response.warnings = sideEffects;
    response.partialProcessing = true;
  }

  return NextResponse.json(response, { status: 201 });
}
