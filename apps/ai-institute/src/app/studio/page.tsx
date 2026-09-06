"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  listCourses,
  listLessons,
  listKnowledgeObjects,
  listRuntimeCapabilities,
} from "@/lib/studio/runtime-client";
import {
  BookOpen,
  GraduationCap,
  Brain,
  Zap,
  Plus,
  ArrowRight,
} from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

export default function StudioPage() {
  const [courses, setCourses] = useState<AnyRecord[]>([]);
  const [lessons, setLessons] = useState<AnyRecord[]>([]);
  const [kos, setKos] = useState<AnyRecord[]>([]);
  const [capabilities, setCapabilities] = useState<AnyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [c, l, k, cap] = await Promise.allSettled([
          listCourses(),
          listLessons(),
          listKnowledgeObjects(),
          listRuntimeCapabilities(),
        ]);
        if (c.status === "fulfilled") setCourses(c.value as AnyRecord[]);
        if (l.status === "fulfilled") setLessons(l.value as AnyRecord[]);
        if (k.status === "fulfilled") setKos(k.value as AnyRecord[]);
        if (cap.status === "fulfilled")
          setCapabilities(
            Array.isArray(cap.value)
              ? cap.value
              : Object.keys(cap.value || {}).map((name) => ({ name })),
          );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          Lesson Studio
        </h1>
        <p className="text-sm text-text-tertiary mt-2">
          AI-powered content generation · Courses, lessons, assessments, and
          more
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-bg-secondary border border-border-primary rounded-xl p-5 animate-pulse"
            >
              <div className="h-4 bg-bg-tertiary rounded w-20 mb-3" />
              <div className="h-8 bg-bg-tertiary rounded w-12" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
          <StatCard
            label="Courses"
            value={courses.length}
            icon={<GraduationCap className="w-4 h-4" />}
            colorClass="text-blue-400"
          />
          <StatCard
            label="Lessons"
            value={lessons.length}
            icon={<BookOpen className="w-4 h-4" />}
            colorClass="text-green-400"
          />
          <StatCard
            label="Knowledge Objects"
            value={kos.length}
            icon={<Brain className="w-4 h-4" />}
            colorClass="text-amber-400"
          />
          <StatCard
            label="Capabilities"
            value={capabilities.length}
            icon={<Zap className="w-4 h-4" />}
            colorClass="text-accent-gold"
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <Link
          href="/studio/courses/new"
          className="bg-bg-secondary border border-border-primary rounded-xl p-6 hover:border-border-secondary transition-colors group"
        >
          <GraduationCap className="w-8 h-8 text-accent-gold mb-3" />
          <div className="text-base font-semibold text-text-primary mb-1">
            Create Course
          </div>
          <div className="text-sm text-text-tertiary mb-3">
            Start a new AI-generated course with lessons and assessments
          </div>
          <div className="flex items-center gap-1 text-xs text-accent-gold group-hover:gap-2 transition-all">
            Get started <ArrowRight className="w-3 h-3" />
          </div>
        </Link>

        <Link
          href="/studio/lessons/new"
          className="bg-bg-secondary border border-border-primary rounded-xl p-6 hover:border-border-secondary transition-colors group"
        >
          <BookOpen className="w-8 h-8 text-accent-gold mb-3" />
          <div className="text-base font-semibold text-text-primary mb-1">
            Generate Lesson
          </div>
          <div className="text-sm text-text-tertiary mb-3">
            AI-generate a lesson from a Knowledge Object with quality gates
          </div>
          <div className="flex items-center gap-1 text-xs text-accent-gold group-hover:gap-2 transition-all">
            Get started <ArrowRight className="w-3 h-3" />
          </div>
        </Link>

        <Link
          href="/studio/knowledge"
          className="bg-bg-secondary border border-border-primary rounded-xl p-6 hover:border-border-secondary transition-colors group"
        >
          <Brain className="w-8 h-8 text-accent-gold mb-3" />
          <div className="text-base font-semibold text-text-primary mb-1">
            Knowledge Objects
          </div>
          <div className="text-sm text-text-tertiary mb-3">
            Browse, create, and manage Knowledge Objects for content generation
          </div>
          <div className="flex items-center gap-1 text-xs text-accent-gold group-hover:gap-2 transition-all">
            Get started <ArrowRight className="w-3 h-3" />
          </div>
        </Link>
      </div>

      {/* Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border-primary flex justify-between items-center">
            <span className="text-sm font-semibold text-text-primary">
              Recent Courses
            </span>
            <Link
              href="/studio/courses"
              className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
            >
              View all →
            </Link>
          </div>
          {courses.length > 0 ? (
            courses.slice(0, 5).map((course: AnyRecord) => (
              <Link
                key={course.id}
                href={`/studio/courses/${course.id}`}
                className="px-5 py-3 border-b border-border-primary last:border-b-0 flex justify-between items-center hover:bg-bg-tertiary transition-colors"
              >
                <div>
                  <div className="text-sm font-medium text-text-primary">
                    {course.title}
                  </div>
                  <div className="text-xs text-text-tertiary">
                    {course.subject} · Grade {course.grade}
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
              </Link>
            ))
          ) : (
            <div className="p-8 text-center text-sm text-text-muted">
              No courses yet
            </div>
          )}
        </div>

        <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border-primary flex justify-between items-center">
            <span className="text-sm font-semibold text-text-primary">
              Recent Lessons
            </span>
            <Link
              href="/studio/lessons"
              className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
            >
              View all →
            </Link>
          </div>
          {lessons.length > 0 ? (
            lessons.slice(0, 5).map((lesson: AnyRecord) => (
              <Link
                key={lesson.id}
                href={`/studio/lessons/${lesson.id}`}
                className="px-5 py-3 border-b border-border-primary last:border-b-0 flex justify-between items-center hover:bg-bg-tertiary transition-colors"
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
                <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
              </Link>
            ))
          ) : (
            <div className="p-8 text-center text-sm text-text-muted">
              No lessons yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  colorClass,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
}) {
  return (
    <div className="bg-bg-secondary border border-border-primary rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={colorClass}>{icon}</span>
        <span className="text-xs text-text-tertiary">{label}</span>
      </div>
      <div className="text-2xl font-bold text-text-primary">{value}</div>
    </div>
  );
}
