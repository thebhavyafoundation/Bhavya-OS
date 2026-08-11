/**
 * Shared JSON parsing utilities for database fields.
 * Used across websites, design-genome, patterns, and knowledge-graph pages.
 */

export function parseJson(str: string): unknown {
  if (!str) return null;
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

export function parseJsonArray(str: string): string[] {
  if (!str) return [];
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseJsonObject(str: string): Record<string, unknown> {
  if (!str) return {};
  try {
    const parsed = JSON.parse(str);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}
