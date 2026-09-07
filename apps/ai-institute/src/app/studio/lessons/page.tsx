"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { listLessons, deleteLesson } from "@/lib/studio/runtime-client";
import { BookOpen, Plus, Trash2, ArrowRight } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

export default function LessonsPage() {
  const [lessons, setLessons] = useState<AnyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    listLessons()
      .then((data) => setLessons(data as AnyRecord[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all" ? lessons : lessons.filter((l) => l.status === filter);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lesson?")) return;
    await deleteLesson(id);
    setLessons((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-start mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-accent-gold" />
            <h1 className="text-3xl font-bold text-text-primary tracking-tight">
              Lessons
            </h1>
          </div>
          <p className="text-sm text-text-tertiary">
            {lessons.length} lessons · AI-generated from Knowledge Objects
          </p>
        </div>
        <Link
          href="/studio/lessons/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-gold text-text-inverse text-sm font-semibold hover:bg-accent-gold-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          Generate Lesson
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {["all", "draft", "ready", "published"].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f
                ? "bg-accent-gold/10 text-accent-gold border border-accent-gold/20"
                : "text-text-tertiary hover:text-text-secondary border border-border-primary"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-bg-tertiary rounded w-48 mb-2" />
              <div className="h-3 bg-bg-tertiary rounded w-32" />
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((lesson) => (
            <div
              key={lesson.id}
              className="glass rounded-xl p-5 flex justify-between items-center hover:border-border-secondary transition-colors"
            >
              <Link href={`/studio/lessons/${lesson.id}`} className="flex-1">
                <div className="text-base font-semibold text-text-primary mb-1">
                  {lesson.title}
                </div>
                <div className="text-xs text-text-tertiary">
                  {lesson.duration}min · {lesson.subject || "General"} · Grade{" "}
                  {lesson.grade || "—"}
                  <span
                    className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      lesson.status === "published"
                        ? "bg-green-900/30 text-green-400"
                        : lesson.status === "ready"
                          ? "bg-forest/30 text-accent-gold"
                          : "bg-amber-900/30 text-amber-400"
                    }`}
                  >
                    {lesson.status}
                  </span>
                </div>
              </Link>
              <div className="flex items-center gap-2 ml-4">
                <Link
                  href={`/studio/lessons/${lesson.id}`}
                  className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(lesson.id)}
                  className="p-2 rounded-lg text-text-tertiary hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center text-sm text-text-muted bg-bg-secondary border border-border-primary rounded-xl">
          <BookOpen className="w-8 h-8 mx-auto mb-3 text-text-muted" />
          No lessons{filter !== "all" ? ` with status "${filter}"` : ""} yet
        </div>
      )}
    </div>
  );
}
