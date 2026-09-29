"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

interface LessonCompleteButtonProps {
  lessonId: string;
}

const PROGRESS_ROLES = ["student", "builder"];

/**
 * Records lesson completion against the existing progress API.
 *
 * AuthProvider exposes the same mutation, but without an error channel; this
 * button posts directly so a rejected save (invalid lesson, forbidden role)
 * can be reported instead of silently doing nothing. State is written back
 * through `updateStudent`, the same setter the provider uses.
 */
export function LessonCompleteButton({ lessonId }: LessonCompleteButtonProps) {
  const { user, student, isAuthenticated, isLoading, updateStudent } =
    useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isLoading) return null;

  if (!isAuthenticated || !student) {
    return (
      <p className="mt-10 text-sm text-text-tertiary">
        Sign in to record lesson progress toward a certificate.{" "}
        <Link href="/login" className="text-accent-gold hover:underline">
          Sign in
        </Link>
      </p>
    );
  }

  const completed = student.lessonsCompleted.includes(lessonId);
  const canRecord = user ? PROGRESS_ROLES.includes(user.role) : false;

  if (completed) {
    return (
      <div className="mt-10 flex flex-wrap items-center gap-3 border border-border-gold bg-surface px-5 py-4">
        <span className="text-sm font-medium text-forest-700">
          Lesson complete
        </span>
        <span className="text-xs text-text-tertiary">
          Recorded on your course record. Finish every lesson to claim the
          certificate.
        </span>
      </div>
    );
  }

  if (!canRecord) {
    return (
      <p className="mt-10 text-sm text-text-tertiary">
        Lesson progress is recorded for learner accounts.
      </p>
    );
  }

  async function markComplete() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/student/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "completeLesson", data: { lessonId } }),
      });
      const payload = (await res.json()) as {
        student?: { lessonsCompleted: string[] };
        error?: string;
      };
      if (res.ok && payload.student) {
        updateStudent({ lessonsCompleted: payload.student.lessonsCompleted });
      } else {
        setError(payload.error ?? "Progress could not be saved.");
      }
    } catch {
      setError("Progress could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-10 flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={markComplete}
        disabled={saving}
        className="btn-secondary disabled:cursor-wait disabled:opacity-70"
      >
        {saving ? "Recording..." : "Mark lesson complete"}
      </button>
      <span className="text-xs text-text-tertiary">
        Saves this lesson to your course record.
      </span>
      {error && (
        <p role="alert" className="w-full text-sm text-status-error">
          {error}
        </p>
      )}
    </div>
  );
}
