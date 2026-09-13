import { NextRequest, NextResponse } from "next/server";
import {
  listKOs,
  createKO,
  updateKO,
  deleteKO,
  type KOProvenance,
  type KOStatus,
} from "@/lib/knowledge-repository";
import { requireAuth } from "@/lib/api-auth";
import {
  roleIsAllowed,
  CONTENT_MANAGEMENT_ROLES,
  type Role,
} from "@/lib/roles";
import { recordEvidence, koEventKey } from "@/lib/institutional-evidence";
import { recordKoCreated } from "@/lib/knowledge-metrics";

// ── Validation ────────────────────────────────────────────────

const MAX_TITLE = 200;
const MAX_DESCRIPTION = 2000;
const MAX_DOMAIN = 100;
const MAX_SUBJECT = 100;
const MAX_CONCEPTS = 50;
const MAX_DEFINITIONS = 100;
const MAX_EXAMPLES = 50;
const MAX_EXERCISES = 50;
const MAX_PREREQUISITES = 20;
const MAX_RELATED = 20;

interface ValidationError {
  field: string;
  message: string;
}

function validateKOCreate(body: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required: title
  if (!body.title || typeof body.title !== "string") {
    errors.push({
      field: "title",
      message: "Title is required and must be a string",
    });
  } else if (body.title.trim().length === 0) {
    errors.push({ field: "title", message: "Title cannot be empty" });
  } else if (body.title.length > MAX_TITLE) {
    errors.push({
      field: "title",
      message: `Title must be ${MAX_TITLE} characters or fewer`,
    });
  }

  // Required: domain
  if (!body.domain || typeof body.domain !== "string") {
    errors.push({
      field: "domain",
      message: "Domain is required and must be a string",
    });
  } else if (body.domain.trim().length === 0) {
    errors.push({ field: "domain", message: "Domain cannot be empty" });
  } else if (body.domain.length > MAX_DOMAIN) {
    errors.push({
      field: "domain",
      message: `Domain must be ${MAX_DOMAIN} characters or fewer`,
    });
  }

  // Optional: description
  if (body.description !== undefined) {
    if (typeof body.description !== "string") {
      errors.push({
        field: "description",
        message: "Description must be a string",
      });
    } else if (body.description.length > MAX_DESCRIPTION) {
      errors.push({
        field: "description",
        message: `Description must be ${MAX_DESCRIPTION} characters or fewer`,
      });
    }
  }

  // Optional: subject
  if (body.subject !== undefined) {
    if (typeof body.subject !== "string") {
      errors.push({ field: "subject", message: "Subject must be a string" });
    } else if (body.subject.length > MAX_SUBJECT) {
      errors.push({
        field: "subject",
        message: `Subject must be ${MAX_SUBJECT} characters or fewer`,
      });
    }
  }

  // Optional: grade
  if (body.grade !== undefined) {
    if (typeof body.grade !== "number" || !Number.isInteger(body.grade)) {
      errors.push({ field: "grade", message: "Grade must be an integer" });
    } else if (body.grade < 1 || body.grade > 12) {
      errors.push({
        field: "grade",
        message: "Grade must be between 1 and 12",
      });
    }
  }

  // Optional: concepts
  if (body.concepts !== undefined) {
    if (!Array.isArray(body.concepts)) {
      errors.push({ field: "concepts", message: "Concepts must be an array" });
    } else if (body.concepts.length > MAX_CONCEPTS) {
      errors.push({
        field: "concepts",
        message: `Concepts must be ${MAX_CONCEPTS} or fewer`,
      });
    }
  }

  // Optional: definitions
  if (body.definitions !== undefined) {
    if (!Array.isArray(body.definitions)) {
      errors.push({
        field: "definitions",
        message: "Definitions must be an array",
      });
    } else if (body.definitions.length > MAX_DEFINITIONS) {
      errors.push({
        field: "definitions",
        message: `Definitions must be ${MAX_DEFINITIONS} or fewer`,
      });
    }
  }

  // Optional: examples
  if (body.examples !== undefined) {
    if (!Array.isArray(body.examples)) {
      errors.push({ field: "examples", message: "Examples must be an array" });
    } else if (body.examples.length > MAX_EXAMPLES) {
      errors.push({
        field: "examples",
        message: `Examples must be ${MAX_EXAMPLES} or fewer`,
      });
    }
  }

  // Optional: exercises
  if (body.exercises !== undefined) {
    if (!Array.isArray(body.exercises)) {
      errors.push({
        field: "exercises",
        message: "Exercises must be an array",
      });
    } else if (body.exercises.length > MAX_EXERCISES) {
      errors.push({
        field: "exercises",
        message: `Exercises must be ${MAX_EXERCISES} or fewer`,
      });
    }
  }

  // Optional: prerequisites
  if (body.prerequisites !== undefined) {
    if (!Array.isArray(body.prerequisites)) {
      errors.push({
        field: "prerequisites",
        message: "Prerequisites must be an array",
      });
    } else if (body.prerequisites.length > MAX_PREREQUISITES) {
      errors.push({
        field: "prerequisites",
        message: `Prerequisites must be ${MAX_PREREQUISITES} or fewer`,
      });
    }
  }

  // Optional: related
  if (body.related !== undefined) {
    if (!Array.isArray(body.related)) {
      errors.push({ field: "related", message: "Related must be an array" });
    } else if (body.related.length > MAX_RELATED) {
      errors.push({
        field: "related",
        message: `Related must be ${MAX_RELATED} or fewer`,
      });
    }
  }

  // Reject unexpected fields
  const allowedFields = new Set([
    "title",
    "domain",
    "description",
    "grade",
    "subject",
    "concepts",
    "definitions",
    "examples",
    "misconceptions",
    "exercises",
    "references",
    "prerequisites",
    "related",
    "metadata",
  ]);
  for (const key of Object.keys(body)) {
    if (!allowedFields.has(key)) {
      errors.push({ field: key, message: `Unexpected field "${key}"` });
    }
  }

  return errors;
}

// ── Handlers ──────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const user = await requireAuth(request);
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }
  try {
    let knowledge = await listKOs();
    if (user.role !== "admin") {
      knowledge = knowledge.filter((ko) => ko.provenance !== "test-seed");
    }
    return NextResponse.json(knowledge);
  } catch {
    return NextResponse.json(
      { error: "Failed to list knowledge objects" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  // 1. Authentication
  const user = await requireAuth(request);
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  // 2. Authorization
  if (!roleIsAllowed(user.role as Role, CONTENT_MANAGEMENT_ROLES)) {
    return NextResponse.json(
      { error: "Insufficient permissions" },
      { status: 403 },
    );
  }

  // 3. Parse body
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "Invalid JSON",
        errors: [{ field: "body", message: "Request body must be valid JSON" }],
      },
      { status: 400 },
    );
  }

  // 4. Validate
  const errors = validateKOCreate(body);
  if (errors.length > 0) {
    return NextResponse.json(
      { error: "Validation failed", errors },
      { status: 400 },
    );
  }

  // 5. Canonical persistence (provenance + status enforced server-side)
  try {
    const ko = await createKO({
      ...body,
      provenance: "institutional" as KOProvenance,
      status: "draft" as KOStatus,
    });

    // 6. Record evidence (AFTER canonical persistence succeeds)
    let evidenceRecorded = true;
    try {
      await recordEvidence(
        "ko-created",
        ko.id,
        `Knowledge Object "${ko.title}" created in domain "${ko.domain}"`,
        {
          domain: ko.domain,
          title: ko.title,
          concepts: ko.concepts?.length || 0,
          createdBy: user.id,
        },
        koEventKey(ko.id, "ko-created"),
      );
    } catch {
      evidenceRecorded = false;
    }

    // 7. Update metrics (AFTER canonical persistence succeeds)
    let metricsRecorded = true;
    try {
      recordKoCreated();
    } catch {
      metricsRecorded = false;
    }

    // 8. Return result with partial processing warnings if needed
    const warnings: string[] = [];
    if (!evidenceRecorded) warnings.push("Evidence recording failed");
    if (!metricsRecorded) warnings.push("Metrics update failed");

    const response: Record<string, unknown> = { ...ko };
    if (warnings.length > 0) {
      response.warnings = warnings;
      response.partialProcessing = true;
    }

    return NextResponse.json(response, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create knowledge object" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
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
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    const rawBody = await request.json();

    // Server-controlled fields: clients cannot overwrite these
    const {
      id: _id,
      createdAt: _createdAt,
      provenance: _provenance,
      ...safeBody
    } = rawBody as Record<string, unknown>;

    // Status validation: only allow "draft" or "published"
    if (
      safeBody.status !== undefined &&
      safeBody.status !== "draft" &&
      safeBody.status !== "published"
    ) {
      return NextResponse.json(
        {
          error: "Invalid status",
          errors: [
            {
              field: "status",
              message: "Status must be 'draft' or 'published'",
            },
          ],
        },
        { status: 400 },
      );
    }

    const ko = await updateKO(id, safeBody);
    if (!ko) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Record evidence of update
    try {
      await recordEvidence(
        "ko-updated",
        ko.id,
        `Knowledge Object "${ko.title}" updated`,
        { domain: ko.domain, updatedBy: user.id },
        koEventKey(ko.id, "ko-updated"),
      );
    } catch {
      /* evidence failure is non-fatal */
    }

    return NextResponse.json(ko);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await requireAuth(request);
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }
  if (!roleIsAllowed(user.role as Role, ["admin"])) {
    return NextResponse.json(
      { error: "Insufficient permissions" },
      { status: 403 },
    );
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    const deleted = await deleteKO(id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Record evidence of deletion
    try {
      await recordEvidence(
        "ko-deleted",
        id,
        `Knowledge Object "${id}" deleted`,
        { deletedBy: user.id },
        koEventKey(id, "ko-deleted"),
      );
    } catch {
      /* evidence failure is non-fatal */
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
