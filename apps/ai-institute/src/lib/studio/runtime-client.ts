/**
 * Studio Runtime Client
 *
 * Talks to local API routes which persist to SQLite.
 * Runtime engine (localhost:3100) is optional — used for capability
 * execution (lesson generation, assessment generation, etc.) but NOT
 * required for CRUD operations.
 */

import type {
  BuildStatus,
  Course,
  Lesson,
  Assessment,
  TeacherGuide,
  Workbook,
  KnowledgeObject,
} from './types';

const API_BASE = '/api/studio';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `API error: ${response.status}`);
  }
  return response.json();
}

// ── Course Management ──────────────────────────────────────────────

export async function listCourses(): Promise<Course[]> {
  return apiFetch<Course[]>('/courses');
}

export async function getCourse(id: string): Promise<Course | null> {
  try {
    return apiFetch<Course>(`/courses/${id}`);
  } catch {
    return null;
  }
}

export async function createCourse(data: Partial<Course>): Promise<Course> {
  return apiFetch<Course>('/courses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCourse(id: string, data: Partial<Course>): Promise<Course | null> {
  try {
    return apiFetch<Course>(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  } catch {
    return null;
  }
}

export async function deleteCourse(id: string): Promise<boolean> {
  try {
    await apiFetch(`/courses/${id}`, { method: 'DELETE' });
    return true;
  } catch {
    return false;
  }
}

// ── Lesson Management ──────────────────────────────────────────────

export async function listLessons(filters?: Record<string, string>): Promise<Lesson[]> {
  const params = filters ? '?' + new URLSearchParams(filters).toString() : '';
  return apiFetch<Lesson[]>('/lessons' + params);
}

export async function getLesson(id: string): Promise<Lesson | null> {
  try {
    return apiFetch<Lesson>(`/lessons/${id}`);
  } catch {
    return null;
  }
}

export async function createLesson(data: Partial<Lesson>): Promise<Lesson> {
  return apiFetch<Lesson>('/lessons', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function generateLesson(
  knowledgeBase: Record<string, unknown>,
  options: { title?: string; duration?: number } = {},
): Promise<Lesson | null> {
  try {
    return await apiFetch<Lesson>('/lessons', {
      method: 'POST',
      body: JSON.stringify({ ...knowledgeBase, ...options }),
    });
  } catch {
    return null;
  }
}

export async function updateLesson(id: string, data: Partial<Lesson>): Promise<Lesson | null> {
  try {
    return apiFetch<Lesson>(`/lessons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  } catch {
    return null;
  }
}

export async function deleteLesson(id: string): Promise<boolean> {
  try {
    await apiFetch(`/lessons/${id}`, { method: 'DELETE' });
    return true;
  } catch {
    return false;
  }
}

// ── Knowledge Object Management ─────────────────────────────────────

export async function listKnowledgeObjects(): Promise<KnowledgeObject[]> {
  return apiFetch<KnowledgeObject[]>('/knowledge');
}

export async function getKnowledgeObject(id: string): Promise<KnowledgeObject | null> {
  try {
    return apiFetch<KnowledgeObject>(`/knowledge/${id}`);
  } catch {
    return null;
  }
}

export async function createKnowledgeObject(data: Partial<KnowledgeObject>): Promise<KnowledgeObject> {
  return apiFetch<KnowledgeObject>('/knowledge', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateKnowledgeObject(id: string, data: Partial<KnowledgeObject>): Promise<KnowledgeObject | null> {
  try {
    return apiFetch<KnowledgeObject>(`/knowledge/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  } catch {
    return null;
  }
}

export async function deleteKnowledgeObject(id: string): Promise<boolean> {
  try {
    await apiFetch(`/knowledge/${id}`, { method: 'DELETE' });
    return true;
  } catch {
    return false;
  }
}

// ── Assessment ─────────────────────────────────────────────────────

export async function getAssessment(lessonId: string): Promise<Assessment | null> {
  try {
    return apiFetch<Assessment>(`/lessons/${lessonId}/assessment`);
  } catch {
    return null;
  }
}

export async function generateAssessment(lesson: Record<string, unknown>): Promise<Assessment | null> {
  try {
    return apiFetch<Assessment>('/capabilities/assessment', {
      method: 'POST',
      body: JSON.stringify({ lesson }),
    });
  } catch {
    return null;
  }
}

// ── Teacher Guide ──────────────────────────────────────────────────

export async function getTeacherGuide(lessonId: string): Promise<TeacherGuide | null> {
  try {
    return apiFetch<TeacherGuide>(`/lessons/${lessonId}/guide`);
  } catch {
    return null;
  }
}

export async function generateTeacherGuide(lesson: Record<string, unknown>): Promise<TeacherGuide | null> {
  try {
    return apiFetch<TeacherGuide>('/capabilities/guide', {
      method: 'POST',
      body: JSON.stringify({ lesson }),
    });
  } catch {
    return null;
  }
}

// ── Workbook ───────────────────────────────────────────────────────

export async function getWorkbook(lessonId: string): Promise<Workbook | null> {
  try {
    return apiFetch<Workbook>(`/lessons/${lessonId}/workbook`);
  } catch {
    return null;
  }
}

export async function generateWorkbook(lesson: Record<string, unknown>): Promise<Workbook | null> {
  try {
    return apiFetch<Workbook>('/capabilities/workbook', {
      method: 'POST',
      body: JSON.stringify({ lesson }),
    });
  } catch {
    return null;
  }
}

// ── Publishing ─────────────────────────────────────────────────────

export async function publishLesson(lessonId: string, target: string): Promise<{ success: boolean; path?: string }> {
  return apiFetch(`/lessons/${lessonId}/publish`, {
    method: 'POST',
    body: JSON.stringify({ target }),
  });
}

// ── Runtime Capabilities (optional — requires runtime at :3100) ────

const RUNTIME_URL = process.env.NEXT_PUBLIC_RUNTIME_URL || 'http://localhost:3100';

export async function listRuntimeCapabilities(): Promise<Record<string, unknown>[]> {
  try {
    const res = await fetch(`${RUNTIME_URL}/capabilities`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : Object.entries(data).map(([name, info]) => ({ name, ...info as object }));
  } catch {
    return [];
  }
}

export async function requestCapability(name: string, input: Record<string, unknown>): Promise<BuildStatus | null> {
  try {
    const res = await fetch(`${RUNTIME_URL}/capability/${name}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
      signal: AbortSignal.timeout(120000),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
