/**
 * Lesson Manager — File-based persistent storage for lessons and their artifacts
 *
 * Lessons, assessments, guides, and workbooks are stored as JSON files.
 * The data directory mirrors the Knowledge Object pipeline output.
 */

import fs from "fs";
import path from "path";

import { BHAVYA_LAB, readJSON, writeJSON, ensureDir } from "./config.mjs";

const DATA_DIR = path.join(BHAVYA_LAB, "data", "lessons");

function ensureDataDir() {
  ensureDir(DATA_DIR);
}

function lessonPath(id) {
  return path.join(DATA_DIR, `${id}.json`);
}

function listFiles() {
  ensureDataDir();
  try {
    return fs.readdirSync(DATA_DIR).filter(f => f.endsWith(".json"));
  } catch { return []; }
}

function generateId() {
  return `lesson-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ── Lesson CRUD ─────────────────────────────────────────────────────

export function createLesson(data) {
  ensureDataDir();
  const lesson = {
    id: generateId(),
    courseId: data.courseId || null,
    knowledgeObjectId: data.knowledgeObjectId || null,
    title: data.title || "Untitled Lesson",
    subject: data.subject || "General",
    grade: data.grade || 9,
    duration: data.duration || 45,
    status: data.status || "draft",
    learningOutcomes: data.learningOutcomes || [],
    sections: data.sections || [],
    vocabulary: data.vocabulary || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: "0.1.0",
  };
  writeJSON(lessonPath(lesson.id), lesson);
  return lesson;
}

export function getLesson(id) {
  return readJSON(lessonPath(id));
}

export function listLessons(filters = {}) {
  let lessons = listFiles()
    .map(f => {
      const l = readJSON(path.join(DATA_DIR, f));
      if (!l) return null;
      return {
        id: l.id,
        courseId: l.courseId,
        title: l.title,
        subject: l.subject,
        grade: l.grade,
        duration: l.duration,
        status: l.status,
        sections: (l.sections || []).length,
        learningOutcomes: (l.learningOutcomes || []).length,
        createdAt: l.createdAt,
        updatedAt: l.updatedAt,
        version: l.version,
      };
    })
    .filter(Boolean);

  if (filters.status && filters.status !== "all") {
    lessons = lessons.filter(l => l.status === filters.status);
  }
  if (filters.courseId) {
    lessons = lessons.filter(l => l.courseId === filters.courseId);
  }
  if (filters.subject) {
    lessons = lessons.filter(l => l.subject === filters.subject);
  }

  return lessons.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

export function updateLesson(id, updates) {
  const lesson = getLesson(id);
  if (!lesson) return null;

  const updated = {
    ...lesson,
    ...updates,
    id: lesson.id,
    createdAt: lesson.createdAt,
    updatedAt: new Date().toISOString(),
  };
  writeJSON(lessonPath(id), updated);
  return updated;
}

export function deleteLesson(id) {
  const p = lessonPath(id);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    // Also clean up associated artifacts
    for (const suffix of ["-assessment", "-guide", "-workbook"]) {
      const artifactPath = path.join(DATA_DIR, `${id}${suffix}.json`);
      if (fs.existsSync(artifactPath)) fs.unlinkSync(artifactPath);
    }
    return true;
  }
  return false;
}

// ── Lesson Artifacts ────────────────────────────────────────────────

export function saveAssessment(lessonId, data) {
  writeJSON(path.join(DATA_DIR, `${lessonId}-assessment.json`), {
    lessonId,
    ...data,
    savedAt: new Date().toISOString(),
  });
}

export function getAssessment(lessonId) {
  return readJSON(path.join(DATA_DIR, `${lessonId}-assessment.json`));
}

export function saveTeacherGuide(lessonId, data) {
  writeJSON(path.join(DATA_DIR, `${lessonId}-guide.json`), {
    lessonId,
    ...data,
    savedAt: new Date().toISOString(),
  });
}

export function getTeacherGuide(lessonId) {
  return readJSON(path.join(DATA_DIR, `${lessonId}-guide.json`));
}

export function saveWorkbook(lessonId, data) {
  writeJSON(path.join(DATA_DIR, `${lessonId}-workbook.json`), {
    lessonId,
    ...data,
    savedAt: new Date().toISOString(),
  });
}

export function getWorkbook(lessonId) {
  return readJSON(path.join(DATA_DIR, `${lessonId}-workbook.json`));
}

export function getLessonArtifacts(lessonId) {
  return {
    lesson: getLesson(lessonId),
    assessment: getAssessment(lessonId),
    teacherGuide: getTeacherGuide(lessonId),
    workbook: getWorkbook(lessonId),
  };
}
