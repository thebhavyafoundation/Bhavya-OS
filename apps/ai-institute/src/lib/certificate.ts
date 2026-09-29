/**
 * AI Institute — Certificate of Completion helpers.
 *
 * Pure logic only: eligibility math, credential id generation, and the
 * record shape shared by API routes, pages, and client components.
 *
 * Nothing here reads the database or the Next.js runtime, so client
 * components may import types from this module freely. Course/lesson data
 * itself stays where it already lives (src/data/academy-courses.ts).
 */

import { randomBytes } from "node:crypto";
import type { Course } from "@/data/academy-courses";

export interface CertificateRecord {
  id: string;
  credentialId: string;
  userId: string;
  subjectId: string;
  subjectType: string;
  holderName: string;
  subjectTitle: string;
  subjectLevel: string;
  issuedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateEligibility {
  eligible: boolean;
  completedLessons: number;
  totalLessons: number;
}

/**
 * URL-safe alphabet without lookalikes (no 0/o, 1/l/i, 2/z, u).
 * Lowercase so credential ids stay case-insensitive for humans retyping them.
 */
const CREDENTIAL_ALPHABET = "abcdefgh3456789mnprstvw";

const CREDENTIAL_GROUP_SIZE = 4;
const CREDENTIAL_GROUPS = 3;

/** Matches issueCredentialId(): bv-xxxx-xxxx-xxxx. */
export const CREDENTIAL_ID_PATTERN = /^bv-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}$/;

/**
 * Issue an unguessable credential id.
 * 12 characters over a 24-symbol alphabet is 56 bits of entropy in the
 * random part; sequential guessing of a public verify endpoint is not a
 * realistic attack at that size.
 */
export function issueCredentialId(): string {
  const bytes = randomBytes(CREDENTIAL_GROUP_SIZE * CREDENTIAL_GROUPS);
  const chars = Array.from(
    bytes,
    (byte) => CREDENTIAL_ALPHABET[byte % CREDENTIAL_ALPHABET.length],
  );
  const groups: string[] = [];
  for (let i = 0; i < CREDENTIAL_GROUPS; i++) {
    groups.push(
      chars
        .slice(i * CREDENTIAL_GROUP_SIZE, (i + 1) * CREDENTIAL_GROUP_SIZE)
        .join(""),
    );
  }
  return `bv-${groups.join("-")}`;
}

/** Normalize user-supplied ids from a URL segment before lookup. */
export function normalizeCredentialId(raw: string): string {
  let value = raw;
  try {
    value = decodeURIComponent(raw);
  } catch {
    // Malformed escape — fall through and treat the raw value as-is.
  }
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

/** Flatten every lesson id reachable from a static course definition. */
export function flattenCourseLessonIds(
  course: Pick<Course, "modules">,
): string[] {
  const ids: string[] = [];
  for (const module_ of course.modules) {
    for (const lesson of module_.lessons) {
      ids.push(lesson.id);
    }
  }
  return ids;
}

/**
 * Decide claim eligibility from resolved lesson ids and the learner's
 * completed set. A course with no resolvable lessons is never eligible:
 * certification must never rest on an empty lesson list.
 */
export function certificateEligibility(
  lessonIds: string[],
  completedLessonIds: string[],
): CertificateEligibility {
  const unique = Array.from(new Set(lessonIds));
  const completed = new Set(completedLessonIds);
  let completedLessons = 0;
  for (const id of unique) {
    if (completed.has(id)) completedLessons++;
  }
  const eligible = unique.length > 0 && completedLessons === unique.length;
  return { eligible, completedLessons, totalLessons: unique.length };
}

/** Absolute verification URL for a credential (used by QR codes and links). */
export function verificationUrl(credentialId: string): string {
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://bhavyafoundation.org";
  return `${origin.replace(/\/$/, "")}/verify/${credentialId}`;
}
