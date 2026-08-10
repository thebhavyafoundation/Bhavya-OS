/**
 * AI Institute — Rate Limiter
 *
 * Serverless-safe: in-memory Map for serverless, filesystem for local dev.
 * In serverless, each instance has its own Map — acceptable for rate limiting.
 * For true distributed limiting, use Redis/Upstash.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store — works everywhere (local + serverless)
const memoryStore = new Map<string, RateLimitEntry>();

function isServerless(): boolean {
  return !!process.env.VERCEL || !!process.env.TURSO_DATABASE_URL;
}

// Filesystem store — local dev only
let fileStore: Record<string, RateLimitEntry> = {};

function loadFileStore(): void {
  if (isServerless()) return;
  try {
    const filePath = join(process.cwd(), "bhavya-ai-lab", "data", "rate-limits.json");
    if (existsSync(filePath)) {
      fileStore = JSON.parse(readFileSync(filePath, "utf-8"));
    }
  } catch {
    fileStore = {};
  }
}

function saveFileStore(): void {
  if (isServerless()) return;
  try {
    const dir = join(process.cwd(), "bhavya-ai-lab", "data");
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "rate-limits.json"), JSON.stringify(fileStore, null, 2));
  } catch {
    // Silent fail — rate limiting still works via memory
  }
}

function cleanupStore(now: number): void {
  if (isServerless()) {
    for (const [key, entry] of memoryStore) {
      if (entry.resetAt <= now) memoryStore.delete(key);
    }
  } else {
    loadFileStore();
    for (const [key, entry] of Object.entries(fileStore)) {
      if (entry.resetAt <= now) delete fileStore[key];
    }
    saveFileStore();
  }
}

function getEntry(key: string): RateLimitEntry | undefined {
  if (isServerless()) return memoryStore.get(key);
  loadFileStore();
  return fileStore[key];
}

function setEntry(key: string, entry: RateLimitEntry): void {
  if (isServerless()) {
    memoryStore.set(key, entry);
  } else {
    loadFileStore();
    fileStore[key] = entry;
    saveFileStore();
  }
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  limited: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig,
): RateLimitResult {
  const now = Date.now();
  cleanupStore(now);

  const entry = getEntry(identifier);

  if (!entry || entry.resetAt < now) {
    const resetAt = now + config.windowMs;
    setEntry(identifier, { count: 1, resetAt });
    return { limited: false, remaining: config.maxRequests - 1, resetAt };
  }

  if (entry.count >= config.maxRequests) {
    return { limited: true, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  setEntry(identifier, entry);
  return {
    limited: false,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

export const RateLimits = {
  register: { maxRequests: 3, windowMs: 60 * 60 * 1000 },
  login: { maxRequests: 5, windowMs: 15 * 60 * 1000 },
  api: { maxRequests: 60, windowMs: 60 * 1000 },
  progress: { maxRequests: 30, windowMs: 60 * 1000 },
} as const;
