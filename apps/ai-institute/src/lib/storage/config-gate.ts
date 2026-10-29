/**
 * Storage configuration gate.
 *
 * Remote storage is OPTIONAL. Two facts make placeholder detection
 * mandatory rather than cosmetic:
 *
 *   1. Next.js inlines only `NEXT_PUBLIC_*` env vars into client bundles, so
 *      every `S3_*`/`B2_*` value is `undefined` in the browser and the code
 *      defaults fall back to obvious placeholder tokens
 *      (`your-b2-bucket-name`, ...).
 *   2. A request built from those placeholders is blocked by the site's own
 *      CSP (`connect-src 'self' ...`), fails synchronously, and — before this
 *      gate existed — fed an infinite health-check/render loop that froze
 *      low-end devices on every page. See
 *      `docs/incidents/2026-10-28-homepage-freeze-storage-health-loop.md`.
 *
 * Rule: when storage is not genuinely configured, no storage network attempt
 * may be made from either plane, and the UI must degrade gracefully.
 *
 * This module is deliberately dependency-free so it can be unit-tested
 * without importing the AWS SDK.
 */

/** Values that mean "unset" no matter which env supplied them. */
export const STORAGE_PLACEHOLDER_VALUES: readonly string[] = [
  "your_b2_account_id",
  "your_b2_application_key",
  "your-b2-bucket-name",
  "your-bucket-name",
];

function isReal(value: string | undefined): value is string {
  if (!value) return false;
  return !STORAGE_PLACEHOLDER_VALUES.includes(value);
}

/**
 * True only when all four S3-compatible storage variables hold real values.
 *
 * Reads `process.env` by default (correct on the server, where worker
 * secrets populate it; always false in the browser, where these names are
 * never inlined). Tests may pass an explicit env-like object.
 */
export function isStorageConfigured(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return (
    isReal(env.S3_ENDPOINT) &&
    isReal(env.S3_ACCESS_KEY_ID) &&
    isReal(env.S3_SECRET_ACCESS_KEY) &&
    isReal(env.S3_BUCKET_NAME)
  );
}
