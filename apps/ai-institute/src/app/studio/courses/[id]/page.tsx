"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getCourse,
  updateCourse,
  deleteCourse,
  listLessons,
} from "@/lib/studio/runtime-client";
import {
  GraduationCap,
  ArrowLeft,
  Trash2,
  Plus,
  BookOpen,
  ArrowRight,
} from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [course, setCourse] = useState<AnyRecord | null>(null);
  const [lessons, setLessons] = useState<AnyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const c = await getCourse(id);
        setCourse(c);
        setTitle(c?.title || "");
        setDescription(c?.description || "");
        const allLessons = await listLessons({ courseId: id });
        setLessons(allLessons);
      } catch { /* course not found */ }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleSave = async () => {
    const updated = await updateCourse(id, { title, description });
    if (updated) {
      setCourse(updated);
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this course and all its lessons?")) return;
    await deleteCourse(id);
    router.push("/studio/courses");
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass rounded-xl p-8 animate-pulse">
          <div className="h-6 bg-bg-tertiary rounded w-64 mb-4" />
          <div className="h-4 bg-bg-tertiary rounded w-96" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-text-muted">
        Course not found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-secondary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex justify-between items-start mb-8">
        <div className="flex-1">
          {editing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl font-bold bg-bg-primary border border-border-primary rounded-lg px-4 py-2 text-text-primary outline-none focus:border-accent-gold/50"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full text-sm bg-bg-primary border border-border-primary rounded-lg px-4 py-2 text-text-primary outline-none focus:border-accent-gold/50 resize-none"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg bg-accent-gold text-text-inverse text-sm font-semibold hover:bg-accent-gold-hover transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => { setEditing(false); setTitle(course.title); setDescription(course.description); }}
                  className="px-4 py-2 rounded-lg border border-border-primary text-text-tertiary text-sm hover:text-text-secondary transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-2">
                <GraduationCap className="w-6 h-6 text-accent-gold" />
                <h1 className="text-2xl font-bold text-text-primary">
                  {course.title}
                </h1>
              </div>
              <p className="text-sm text-text-tertiary">
                {course.subject} · Grade {course.grade} · {lessons.length} lessons
              </p>
              {course.description && (
                <p className="text-sm text-text-secondary mt-2">{course.description}</p>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 ml-4">
          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="px-3 py-1.5 rounded-lg border border-border-primary text-text-tertiary text-xs hover:text-text-secondary transition-colors"
            >
              Edit
            </button>
          )}
          <button
            type="button"
            onClick={handleDelete}
            className="p-2 rounded-lg text-text-tertiary hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Lessons */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-text-primary">
            Lessons ({lessons.length})
          </h2>
          <Link
            href={`/studio/lessons/new?courseId=${id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-gold text-text-inverse text-xs font-semibold hover:bg-accent-gold-hover transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Lesson
          </Link>
        </div>

        {lessons.length > 0 ? (
          <div className="space-y-2">
            {lessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/studio/lessons/${lesson.id}`}
                className="glass rounded-xl p-4 flex justify-between items-center hover:border-border-secondary transition-colors"
              >
                <div>
                  <div className="text-sm font-medium text-text-primary">
                    {lesson.title}
                  </div>
                  <div className="text-xs text-text-tertiary">
                    {lesson.duration}min ·{" "}
                    <span
                      className={
                        lesson.status === "published"
                          ? "text-green-400"
                          : lesson.status === "ready"
                            ? "text-blue-400"
                            : "text-amber-400"
                      }
                    >
                      {lesson.status}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass rounded-xl p-8 text-center text-sm text-text-muted">
            <BookOpen className="w-6 h-6 mx-auto mb-2 text-text-muted" />
            No lessons yet. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
