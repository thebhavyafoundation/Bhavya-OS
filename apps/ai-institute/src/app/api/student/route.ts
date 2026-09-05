import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import {
  getStudentByUserId,
  createStudent,
  updateStudent,
} from "@/lib/student-store";
import { getUserRepository } from "@/lib/repositories";
import { checkRateLimit, RateLimits } from "@/lib/rate-limit";
import { createLogger, extractCorrelationId } from "@/lib/logger";
import { recordAuditEvent } from "@/lib/audit-repository";
import { ONBOARDING_ROLES, type Role } from "@/lib/roles";

export async function GET(request: NextRequest) {
  const correlationId = extractCorrelationId(request);
  const log = createLogger("student:get", correlationId);

  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const rateLimit = checkRateLimit(`api:${user.id}`, RateLimits.api);
    if (rateLimit.limited) {
      log.warn("Rate limit exceeded", { userId: user.id });
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    let student = await getStudentByUserId(user.id);
    if (!student) {
      student = await createStudent({
        userId: user.id,
        name: user.name,
        email: user.email,
        role: "student",
        interests: user.interests || [],
      });
      log.info("Student profile created", { userId: user.id });
    }

    return NextResponse.json(
      { student },
      {
        headers: { "X-Correlation-Id": correlationId },
      },
    );
  } catch (err) {
    log.error(
      "Failed to get student",
      err instanceof Error ? err : new Error(String(err)),
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const correlationId = extractCorrelationId(request);
  const log = createLogger("student:update", correlationId);

  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const rateLimit = checkRateLimit(`api:${user.id}`, RateLimits.api);
    if (rateLimit.limited) {
      log.warn("Rate limit exceeded", { userId: user.id });
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();
    const { name, interests, role, onboardingComplete } = body;
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (interests !== undefined) updateData.interests = interests;
    if (onboardingComplete !== undefined)
      updateData.onboardingComplete = onboardingComplete;

    // Role assignment: only allow onboarding roles for self-assignment
    // Admin/instructor roles must be assigned by an admin via a separate endpoint
    if (role !== undefined) {
      if (ONBOARDING_ROLES.includes(role as Role)) {
        updateData.role = role;
      } else {
        log.warn("Unauthorized role self-assignment attempt", {
          userId: user.id,
          requestedRole: role,
        });
        // Silently ignore non-onboarding role assignments
      }
    }

    const updated = await updateStudent(user.id, updateData);
    if (!updated) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Persist role to the users table so it's available across auth checks
    if (updateData.role !== undefined && updateData.role !== user.role) {
      const userRepo = getUserRepository();
      await userRepo.updateRole(user.id, updateData.role as string);
      await recordAuditEvent({
        actorId: user.id,
        actorEmail: user.email,
        action: "role-change",
        resource: "user",
        resourceId: user.id,
        result: "success",
        metadata: { from: user.role, to: updateData.role },
      });
    }

    log.info("Student profile updated", { userId: user.id });

    return NextResponse.json(
      { student: updated },
      {
        headers: { "X-Correlation-Id": correlationId },
      },
    );
  } catch (err) {
    log.error(
      "Failed to update student",
      err instanceof Error ? err : new Error(String(err)),
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
