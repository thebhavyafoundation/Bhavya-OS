/**
 * Fetches Studio-published lessons from SQLite.
 * Used by Academy to display lessons created via Studio.
 *
 * @module academy-published
 */

export interface PublishedLesson {
  id: string;
  title: string;
  domain?: string;
  targetAge?: string;
  status: string;
  sections?: { title: string; content: string; duration?: number }[];
  learningOutcomes?: string[];
  vocabulary?: { term: string; definition: string }[];
  assessment?: unknown;
  teacherGuide?: unknown;
  workbook?: unknown;
  publishedAt?: string;
}

let cachedLessons: PublishedLesson[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 30_000;

export async function getPublishedLessons(): Promise<PublishedLesson[]> {
  const now = Date.now();
  if (cachedLessons && now - cacheTime < CACHE_TTL) return cachedLessons;

  try {
    const res = await fetch("/api/academy/published", { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    cachedLessons = Array.isArray(data) ? data : [];
    cacheTime = now;
    return cachedLessons;
  } catch {
    return [];
  }
}

export async function getPublishedLesson(id: string): Promise<PublishedLesson | null> {
  const lessons = await getPublishedLessons();
  return lessons.find((l) => l.id === id) || null;
}
