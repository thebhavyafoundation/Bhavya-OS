/**
 * @bhavya/platform — ID Generation
 *
 * Consistent, prefix-based ID generation across all Bhavya OS packages.
 * Format: `{prefix}-{timestamp}-{random}`
 */

/**
 * Generate a unique ID with a prefix.
 * @param prefix - Entity type prefix (e.g., 'ko', 'pkg', 'user', 'evt')
 * @param randomLength - Length of random suffix (default: 8)
 */
export function generateId(prefix: string, randomLength = 8): string {
  const timestamp = Date.now();
  const random = Math.random()
    .toString(36)
    .slice(2, 2 + randomLength);
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Generate a compact ID without prefix.
 */
export function compactId(length = 12): string {
  return Math.random()
    .toString(36)
    .slice(2, 2 + length);
}

/**
 * Generate a UUID v4 (for when standard UUIDs are needed).
 */
export function uuid(): string {
  return crypto.randomUUID?.() ?? generateId("id", 16);
}

/**
 * Extract the prefix from an ID.
 * @example extractPrefix("ko-12345-abc") === "ko"
 */
export function extractPrefix(id: string): string {
  return id.split("-")[0] || "";
}

/**
 * Extract the timestamp from an ID.
 * @example extractTimestamp("ko-1700000000000-abc") === 1700000000000
 */
export function extractTimestamp(id: string): number {
  const parts = id.split("-");
  return parts.length >= 2 ? parseInt(parts[1], 10) || 0 : 0;
}
