"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  listCourses,
  deleteCourse,
} from "@/lib/studio/runtime-client";
import { GraduationCap, Plus, Trash2, ArrowRight } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

export default function CoursesPage() {
  const [courses, setCourses] = useState<AnyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listCourses()
      .then((data) => setCourses(data as AnyRecord[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this course?")) return;
    await deleteCourse(id);
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-start mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-6 h-6 text-accent-gold" />
            <h1 className="text-3xl font-bold text-text-primary tracking-tight">
              Courses
            </h1>
          </div>
          <p className="text-sm text-text-tertiary">
            {courses.length} courses · AI-generated curriculum
          </p>
        </div>
        <Link
          href="/studio/courses/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-gold text-text-inverse text-sm font-semibold hover:bg-accent-gold-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Course
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-bg-tertiary rounded w-48 mb-2" />
              <div className="h-3 bg-bg-tertiary rounded w-32" />
            </div>
          ))}
        </div>
      ) : courses.length > 0 ? (
        <div className="space-y-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="glass rounded-xl p-5 flex justify-between items-center hover:border-border-secondary transition-colors"
            >
              <Link
                href={`/studio/courses/${course.id}`}
                className="flex-1"
              >
                <div className="text-base font-semibold text-text-primary mb-1">
                  {course.title}
                </div>
                <div className="text-xs text-text-tertiary">
                  {course.subject} · Grade {course.grade} ·{" "}
                  {course.lessons?.length || 0} lessons
                </div>
              </Link>
              <div className="flex items-center gap-2 ml-4">
                <Link
                  href={`/studio/courses/${course.id}`}
                  className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(course.id)}
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
          <GraduationCap className="w-8 h-8 mx-auto mb-3 text-text-muted" />
          No courses yet
        </div>
      )}
    </div>
  );
}
