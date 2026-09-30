import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { checkRateLimit, RateLimits } from "@/lib/rate-limit";
import { getStudentByUserId } from "@/lib/student-store";
import { recordAuditEvent } from "@/lib/audit-repository";
import {
  certificateEligibility,
  type CertificateRecord,
} from "@/lib/certificate";
import {
  ensureCertificatesTable,
  findCertificate,
  insertCertificate,
  listCertificatesByUser,
  resolveCourseLessonIds,
  resolveCourseSnapshot,
} from "@/lib/certificate-store";

const COURSE_ID_PATTERN = /^[a-z0-9-]{1,64}$/;

function jsonError(error: string, code: string, status: number) {
  return NextResponse.json({ error, code }, { status });
}

export async function GET(request: NextRequest) {
  const user = await requireAuth(request);
  if (!user) return jsonError("Authentication required", "unauthorized", 401);

  await ensureCertificatesTable();
  const courseId = request.nextUrl.searchParams.get("courseId");

  if (!courseId) {
    const certificates = await listCertificatesByUser(user.id);
    return NextResponse.json({ certificates });
  }

  if (!COURSE_ID_PATTERN.test(courseId)) {
    return jsonError("Invalid course id", "invalid_course", 400);
  }

  const course = await resolveCourseSnapshot(courseId);
  if (!course) return jsonError("Course not found", "not_found", 404);

  const lessonIds = await resolveCourseLessonIds(courseId);
  const student = await getStudentByUserId(user.id);
  const eligibility = certificateEligibility(
    lessonIds,
    student?.lessonsCompleted ?? [],
  );
  const certificate = await findCertificate(user.id, courseId);

  return NextResponse.json({
    eligible: eligibility.eligible,
    completedLessons: eligibility.completedLessons,
    totalLessons: eligibility.totalLessons,
    hasProfile: !!student,
    certificate,
  });
}

export async function POST(request: NextRequest) {
  const user = await requireAuth(request);
  if (!user) return jsonError("Authentication required", "unauthorized", 401);

  const limit = checkRateLimit(`certificate-claim:${user.id}`, RateLimits.api);
  if (limit.limited) return jsonError("Too many requests", "rate_limited", 429);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", "invalid_body", 400);
  }

  const courseId =
    typeof body === "object" && body !== null && "courseId" in body
      ? (body as { courseId: unknown }).courseId
      : undefined;

  if (typeof courseId !== "string" || !COURSE_ID_PATTERN.test(courseId)) {
    return jsonError("Invalid course id", "invalid_course", 400);
  }

  const course = await resolveCourseSnapshot(courseId);
  if (!course) return jsonError("Course not found", "not_found", 404);

  const student = await getStudentByUserId(user.id);
  if (!student) {
    return jsonError(
      "Complete onboarding before claiming a certificate",
      "no_profile",
      409,
    );
  }

  const lessonIds = await resolveCourseLessonIds(courseId);
  const eligibility = certificateEligibility(
    lessonIds,
    student.lessonsCompleted,
  );
  if (!eligibility.eligible) {
    return jsonError(
      `Complete all ${eligibility.totalLessons} lessons first`,
      "not_eligible",
      403,
    );
  }

  try {
    const certificate: CertificateRecord = await insertCertificate({
      userId: user.id,
      holderName: student.name || user.name,
      subjectId: course.id,
      subjectTitle: course.title,
      subjectLevel: course.level,
    });

    await recordAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      action: "certificate.claim",
      resource: "certificate",
      resourceId: certificate.credentialId,
      result: "success",
      metadata: { courseId: course.id, subjectTitle: course.title },
    });

    return NextResponse.json(certificate, { status: 201 });
  } catch {
    return jsonError("Failed to issue certificate", "issue_failed", 500);
  }
}
