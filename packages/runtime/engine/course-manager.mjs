/**
 * Course Manager — File-based persistent storage for courses
 *
 * Data is stored as JSON files in bhavya-ai-lab/data/courses/
 * This is the canonical source of truth for lesson-studio data.
 */

import fs from "fs";
import path from "path";

import { BHAVYA_LAB, readJSON, writeJSON, ensureDir } from "./config.mjs";

const DATA_DIR = path.join(BHAVYA_LAB, "data", "courses");

function ensureDataDir() {
  ensureDir(DATA_DIR);
}

function coursePath(id) {
  return path.join(DATA_DIR, `${id}.json`);
}

function listFiles() {
  ensureDataDir();
  try {
    return fs.readdirSync(DATA_DIR).filter(f => f.endsWith(".json"));
  } catch {
    return [];
  }
}

function generateId() {
  return `course-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ── CRUD ────────────────────────────────────────────────────────────

export function createCourse(data) {
  ensureDataDir();
  const course = {
    id: generateId(),
    title: data.title || "Untitled Course",
    description: data.description || "",
    subject: data.subject || "General",
    grade: data.grade || 9,
    status: data.status || "draft",
    lessons: data.lessons || [],
    learningOutcomes: data.learningOutcomes || [],
    prerequisites: data.prerequisites || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: "0.1.0",
  };
  writeJSON(coursePath(course.id), course);
  return course;
}

export function getCourse(id) {
  return readJSON(coursePath(id));
}

export function listCourses() {
  return listFiles()
    .map(f => {
      const c = readJSON(path.join(DATA_DIR, f));
      if (!c) return null;
      return {
        id: c.id,
        title: c.title,
        description: c.description,
        subject: c.subject,
        grade: c.grade,
        status: c.status,
        lessonCount: (c.lessons || []).length,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        version: c.version,
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

export function updateCourse(id, updates) {
  const course = getCourse(id);
  if (!course) return null;

  const updated = {
    ...course,
    ...updates,
    id: course.id,
    createdAt: course.createdAt,
    updatedAt: new Date().toISOString(),
  };
  writeJSON(coursePath(id), updated);
  return updated;
}

export function deleteCourse(id) {
  const p = coursePath(id);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    return true;
  }
  return false;
}

export function duplicateCourse(id) {
  const course = getCourse(id);
  if (!course) return null;

  const duplicate = {
    ...course,
    id: generateId(),
    title: `${course.title} (Copy)`,
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: "0.1.0",
  };
  writeJSON(coursePath(duplicate.id), duplicate);
  return duplicate;
}

export function archiveCourse(id) {
  return updateCourse(id, { status: "archived" });
}

export function addLessonToCourse(courseId, lessonId) {
  const course = getCourse(courseId);
  if (!course) return null;

  const lessons = course.lessons || [];
  if (!lessons.find(l => l.id === lessonId)) {
    lessons.push({ id: lessonId, order: lessons.length + 1 });
  }
  return updateCourse(courseId, { lessons });
}

export function reorderLessons(courseId, lessonIds) {
  const course = getCourse(courseId);
  if (!course) return null;

  const lessons = lessonIds.map((id, i) => ({ id, order: i + 1 }));
  return updateCourse(courseId, { lessons });
}
