"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { ArrowRight, CheckCircle } from "lucide-react";

export function EnrollButton({
  courseId,
  firstLessonId,
}: {
  courseId: string;
  firstLessonId: string | null;
}) {
  const { student, isAuthenticated } = useAuth();
  const router = useRouter();
  const [enrolling, setEnrolling] = useState(false);

  const isEnrolled = student?.enrolledCourses.includes(courseId) ?? false;

  async function handleEnroll() {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/courses/${courseId}`);
      return;
    }
    if (isEnrolled || enrolling) return;

    setEnrolling(true);
    try {
      const res = await fetch("/api/student/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "enroll", data: { courseId } }),
      });
      if (res.ok) {
        router.refresh();
        if (firstLessonId) {
          router.push(`/courses/${courseId}/lessons/${firstLessonId}`);
        }
      }
    } finally {
      setEnrolling(false);
    }
  }

  if (isEnrolled) {
    return (
      <Link
        href={
          firstLessonId
            ? `/courses/${courseId}/lessons/${firstLessonId}`
            : `/courses/${courseId}`
        }
        className="inline-flex items-center gap-2 rounded-lg bg-accent-gold px-8 py-3 text-sm font-medium text-text-primary hover:bg-accent-gold/90 transition"
      >
        <CheckCircle className="w-4 h-4" />
        Continue Course
        <ArrowRight className="w-4 h-4" />
      </Link>
    );
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={enrolling}
      className="inline-flex items-center gap-2 rounded-lg bg-accent-gold px-8 py-3 text-sm font-medium text-text-primary hover:bg-accent-gold/90 transition disabled:opacity-50"
    >
      {enrolling ? "Enrolling..." : "Start Course"}
      {!enrolling && <ArrowRight className="w-4 h-4" />}
    </button>
  );
}
