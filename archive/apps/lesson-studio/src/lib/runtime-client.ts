/**
 * Runtime Client — The ONLY way Lesson Studio talks to the Bhavya AI Lab OS.
 *
 * The application never calls builders directly.
 * It requests capabilities from the runtime. The runtime decides which
 * builder, skills, registries, and quality gates to use.
 *
 * This keeps the application thin and the operating system authoritative.
 */

import type {
  BuildStatus,
  Course,
  Lesson,
  Assessment,
  TeacherGuide,
  Workbook,
  BuilderResult,
  KnowledgeObject,
} from './types';

const RUNTIME_URL = process.env.NEXT_PUBLIC_RUNTIME_URL || 'http://localhost:3100';
const FALLBACK_URL = '/api/fallback';

async function runtimeFetch(path: string, options?: RequestInit) {
  const url = `${RUNTIME_URL}${path}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      signal: AbortSignal.timeout(60000),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || `Runtime error: ${response.status}`);
    }
    return response.json();
  } catch (err) {
    if (err instanceof TypeError && err.message === 'Failed to fetch') {
      // Runtime not running — fall back to adapter layer
      return fallbackFetch(path, options);
    }
    throw err;
  }
}

async function fallbackFetch(path: string, options?: RequestInit) {
  const url = `${FALLBACK_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `Fallback error: ${response.status}`);
  }
  return response.json();
}

// ── Capability Execution ───────────────────────────────────────────

export async function requestCapability(
  name: string,
  input: Record<string, unknown>,
): Promise<BuildStatus> {
  return runtimeFetch('/capability/' + name, {
    method: 'POST',
    body: JSON.stringify({ input }),
  });
}

export async function getCapabilityInfo(name: string) {
  return runtimeFetch('/capability/' + name);
}

export async function listRuntimeCapabilities() {
  return runtimeFetch('/capabilities');
}

export async function getExecutionStatus(execId: string): Promise<BuildStatus | null> {
  try {
    return runtimeFetch('/status/' + execId);
  } catch {
    return null;
  }
}

// ── Knowledge Pipeline ─────────────────────────────────────────────

export async function runFullPipeline(knowledgeObject: Record<string, unknown>, options?: Record<string, unknown>) {
  return runtimeFetch('/pipeline', {
    method: 'POST',
    body: JSON.stringify({ knowledgeObject, options }),
  });
}

// ── Course Management ──────────────────────────────────────────────

export async function listCourses(): Promise<Course[]> {
  return runtimeFetch('/courses');
}

export async function getCourse(id: string): Promise<Course | null> {
  try {
    return runtimeFetch('/courses/' + id);
  } catch {
    return null;
  }
}

export async function createCourse(data: Partial<Course>): Promise<Course> {
  return runtimeFetch('/courses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCourse(id: string, data: Partial<Course>): Promise<Course | null> {
  try {
    return runtimeFetch('/courses/' + id, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  } catch {
    return null;
  }
}

export async function deleteCourse(id: string): Promise<boolean> {
  try {
    await runtimeFetch('/courses/' + id, { method: 'DELETE' });
    return true;
  } catch {
    return false;
  }
}

export async function duplicateCourse(id: string) {
  return runtimeFetch('/courses/' + id + '/duplicate', { method: 'POST' });
}

export async function archiveCourse(id: string) {
  return runtimeFetch('/courses/' + id + '/archive', { method: 'POST' });
}

export async function reorderLessons(courseId: string, lessonIds: string[]) {
  return runtimeFetch('/courses/' + courseId + '/reorder', {
    method: 'POST',
    body: JSON.stringify({ lessonIds }),
  });
}

// ── Lesson Management ──────────────────────────────────────────────

export async function listLessons(filters?: Record<string, string>): Promise<Lesson[]> {
  const params = filters ? '?' + new URLSearchParams(filters).toString() : '';
  return runtimeFetch('/lessons' + params);
}

export async function getLesson(id: string): Promise<Lesson | null> {
  try {
    return runtimeFetch('/lessons/' + id);
  } catch {
    return null;
  }
}

export async function createLesson(data: Partial<Lesson>): Promise<Lesson> {
  return runtimeFetch('/lessons', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateLesson(id: string, data: Partial<Lesson>): Promise<Lesson | null> {
  try {
    return runtimeFetch('/lessons/' + id, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  } catch {
    return null;
  }
}

export async function deleteLesson(id: string): Promise<boolean> {
  try {
    await runtimeFetch('/lessons/' + id, { method: 'DELETE' });
    return true;
  } catch {
    return false;
  }
}

export async function getLessonArtifacts(id: string) {
  return runtimeFetch('/lessons/' + id + '/artifacts');
}

export async function getAssessment(lessonId: string): Promise<Assessment | null> {
  try {
    return runtimeFetch('/lessons/' + lessonId + '/assessment');
  } catch {
    return null;
  }
}

export async function getTeacherGuide(lessonId: string): Promise<TeacherGuide | null> {
  try {
    return runtimeFetch('/lessons/' + lessonId + '/guide');
  } catch {
    return null;
  }
}

export async function getWorkbook(lessonId: string): Promise<Workbook | null> {
  try {
    return runtimeFetch('/lessons/' + lessonId + '/workbook');
  } catch {
    return null;
  }
}

// ── Knowledge Object Management ─────────────────────────────────────

export async function listKnowledgeObjects(): Promise<KnowledgeObject[]> {
  return runtimeFetch('/knowledge');
}

export async function getKnowledgeObject(id: string): Promise<KnowledgeObject | null> {
  try {
    return runtimeFetch('/knowledge/' + id);
  } catch {
    return null;
  }
}

export async function createKnowledgeObject(data: Partial<KnowledgeObject>): Promise<KnowledgeObject> {
  return runtimeFetch('/knowledge', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateKnowledgeObject(id: string, data: Partial<KnowledgeObject>): Promise<KnowledgeObject | null> {
  try {
    return runtimeFetch('/knowledge/' + id, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  } catch {
    return null;
  }
}

export async function deleteKnowledgeObject(id: string): Promise<boolean> {
  try {
    await runtimeFetch('/knowledge/' + id, { method: 'DELETE' });
    return true;
  } catch {
    return false;
  }
}

// ── Provenance & Build Manifests ────────────────────────────────────

export async function listProvenanceRecords(sourceKoId?: string): Promise<any[]> {
  const params = sourceKoId ? `?sourceKnowledgeObject=${sourceKoId}` : '';
  return runtimeFetch('/provenance' + params);
}

export async function getProvenanceRecord(artifactId: string): Promise<any | null> {
  try {
    return runtimeFetch('/provenance/' + artifactId);
  } catch { return null; }
}

export async function getProvenanceGraph(sourceKoId?: string): Promise<any[]> {
  const params = sourceKoId ? `?sourceKnowledgeObject=${sourceKoId}&graph=true` : '?graph=true';
  return runtimeFetch('/provenance' + params);
}

export async function listBuildManifests(): Promise<any[]> {
  return runtimeFetch('/manifests');
}

export async function getBuildManifest(buildId: string): Promise<any | null> {
  try {
    return runtimeFetch('/manifests/' + buildId);
  } catch { return null; }
}

// ── Registry ───────────────────────────────────────────────────────

export async function getRuntimeRegistry() {
  return runtimeFetch('/registry');
}

export async function getQualityGates() {
  return runtimeFetch('/quality-gates');
}

// ── Observability ──────────────────────────────────────────────────

export async function getRuntimeMetrics() {
  return runtimeFetch('/metrics');
}

// ── Builder Invocation (capability-based, not direct) ──────────────

export async function generateLesson(knowledgeObject: Record<string, unknown>, options?: Record<string, unknown>) {
  return requestCapability('lesson_generation', {
    knowledgeObject,
    ...options,
  });
}

export async function generateAssessment(lesson: Record<string, unknown>, knowledgeObject?: Record<string, unknown>) {
  return requestCapability('quiz_generation', {
    lesson,
    knowledgeObject,
  });
}

export async function generateTeacherGuide(lesson: Record<string, unknown>, knowledgeObject?: Record<string, unknown>) {
  return requestCapability('lesson_generation', {
    lesson,
    knowledgeObject,
    _builderHint: 'teacher-guide',
  });
}

export async function generateWorkbook(lesson: Record<string, unknown>, knowledgeObject?: Record<string, unknown>) {
  return requestCapability('lesson_generation', {
    lesson,
    knowledgeObject,
    _builderHint: 'workbook',
  });
}

export async function generateWebsite(lesson: Record<string, unknown>, artifacts?: Record<string, unknown>) {
  return requestCapability('website_generation', {
    lesson,
    ...artifacts,
  });
}
