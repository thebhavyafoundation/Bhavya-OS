/**
 * @bhavya/platform — Validation Utilities
 *
 * Common validation functions used across all Bhavya OS packages.
 */

/**
 * Validate an entity ID (alphanumeric, hyphens, underscores only).
 */
export function isValidId(id: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(id);
}

/**
 * Validate an email address.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate a password meets minimum complexity requirements.
 * - At least 8 characters
 * - Contains at least one letter and one number
 */
export function isValidPassword(password: string): boolean {
  if (password.length < 8) return false;
  if (!/[a-zA-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
}

/**
 * Sanitize a filename (remove unsafe characters).
 */
export function sanitizeFilename(name: string, maxLength = 200): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, maxLength);
}

/**
 * Validate a file extension against an allowlist.
 */
export function isValidFileExtension(
  filename: string,
  allowed: string[],
): boolean {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return allowed.includes(ext);
}

/**
 * Check if a value is a non-empty string.
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Check if a value is a valid URL.
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate that required fields are present in an object.
 */
export function validateRequired<T extends Record<string, unknown>>(
  data: T,
  fields: (keyof T)[],
): { valid: boolean; missing: string[] } {
  const missing = fields.filter(
    (f) => data[f] === undefined || data[f] === null || data[f] === "",
  );
  return { valid: missing.length === 0, missing: missing as string[] };
}
