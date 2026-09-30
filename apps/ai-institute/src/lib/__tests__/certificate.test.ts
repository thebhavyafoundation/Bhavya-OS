import { describe, it, expect } from "vitest";
import {
  CREDENTIAL_ID_PATTERN,
  certificateEligibility,
  flattenCourseLessonIds,
  issueCredentialId,
  normalizeCredentialId,
} from "@/lib/certificate";
import {
  findCertificate,
  findCertificateByCredentialId,
  insertCertificate,
  listCertificatesByUser,
  resolveCourseLessonIds,
} from "@/lib/certificate-store";
import { getCourseById, courses } from "@/data/academy-courses";

describe("certificateEligibility", () => {
  it("is eligible only when every lesson id is completed", () => {
    const lessonIds = ["a", "b", "c"];
    expect(certificateEligibility(lessonIds, ["a", "b", "c"])).toEqual({
      eligible: true,
      completedLessons: 3,
      totalLessons: 3,
    });
    expect(certificateEligibility(lessonIds, ["a", "b"])).toEqual({
      eligible: false,
      completedLessons: 2,
      totalLessons: 3,
    });
  });

  it("counts duplicate lesson ids once", () => {
    const result = certificateEligibility(["a", "a", "b"], ["a", "b"]);
    expect(result.totalLessons).toBe(2);
    expect(result.eligible).toBe(true);
  });

  it("never certifies an empty lesson list", () => {
    expect(certificateEligibility([], [])).toEqual({
      eligible: false,
      completedLessons: 0,
      totalLessons: 0,
    });
  });

  it("ignores completions from other courses", () => {
    const result = certificateEligibility(["a", "b"], ["a", "z", "y"]);
    expect(result.completedLessons).toBe(1);
    expect(result.eligible).toBe(false);
  });
});

describe("issueCredentialId", () => {
  it("matches the public id format", () => {
    for (let i = 0; i < 50; i++) {
      expect(CREDENTIAL_ID_PATTERN.test(issueCredentialId())).toBe(true);
    }
  });

  it("does not repeat across many issues", () => {
    const ids = new Set(Array.from({ length: 500 }, issueCredentialId));
    expect(ids.size).toBe(500);
  });

  it("normalizes ids coming back from a URL", () => {
    expect(normalizeCredentialId("  BV-7K2M-9Q4T-X8W1 ")).toBe(
      "bv-7k2m-9q4t-x8w1",
    );
    expect(normalizeCredentialId("bv-%37k2m-9q4t-x8w1")).toBe(
      "bv-7k2m-9q4t-x8w1",
    );
  });
});

describe("flattenCourseLessonIds", () => {
  it("returns every lesson id of a static course", () => {
    const course = courses[0];
    const ids = flattenCourseLessonIds(course);
    const expected = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
    expect(ids).toEqual(expected);
    expect(ids.length).toBeGreaterThan(0);
  });
});

describe("resolveCourseLessonIds", () => {
  it("resolves lessons for a published static course", async () => {
    const course = courses[0];
    const ids = await resolveCourseLessonIds(course.id);
    expect(ids).toEqual(flattenCourseLessonIds(course));
  });

  it("returns nothing for an unknown course", async () => {
    expect(await resolveCourseLessonIds("does-not-exist")).toEqual([]);
  });

  it("agrees with the static lesson count helper", async () => {
    const course = getCourseById("ai-foundations");
    expect(course).toBeDefined();
    const ids = await resolveCourseLessonIds(course!.id);
    expect(ids.length).toBe(
      course!.modules.reduce((sum, m) => sum + m.lessons.length, 0),
    );
  });
});

describe("certificate store", () => {
  const userId = "test-user-certificates";
  const subjectId = "ai-foundations";

  it("issues a certificate once per user and course", async () => {
    const first = await insertCertificate({
      userId,
      holderName: "Test Learner",
      subjectId,
      subjectTitle: "Foundations of AI",
      subjectLevel: "beginner",
    });

    const second = await insertCertificate({
      userId,
      holderName: "Test Learner",
      subjectId,
      subjectTitle: "Foundations of AI",
      subjectLevel: "beginner",
    });

    expect(second.id).toBe(first.id);
    expect(second.credentialId).toBe(first.credentialId);
    expect(CREDENTIAL_ID_PATTERN.test(first.credentialId)).toBe(true);
    expect(first.holderName).toBe("Test Learner");
  });

  it("finds the record by credential id and returns null otherwise", async () => {
    const created = await findCertificate(userId, subjectId);
    expect(created).not.toBeNull();

    const found = await findCertificateByCredentialId(
      ` ${created!.credentialId.toUpperCase()} `,
    );
    expect(found?.id).toBe(created!.id);

    expect(await findCertificateByCredentialId("bv-0000-0000-0000")).toBeNull();
  });

  it("lists certificates newest first for the owning user", async () => {
    const rows = await listCertificatesByUser(userId);
    expect(rows.length).toBeGreaterThanOrEqual(1);
    expect(rows[0].userId).toBe(userId);

    const other = await listCertificatesByUser(
      "test-user-with-no-certificates",
    );
    expect(other).toEqual([]);
  });
});
