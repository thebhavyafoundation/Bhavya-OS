import Link from "next/link";
import { notFound } from "next/navigation";
import {
  loadPublishedCourseById,
  getTotalLessonsAsync,
  getFirstLessonId,
} from "@/lib/studio/courses";
import { EnrollButton } from "./enroll-button";

const levelColors: Record<string, string> = {
  foundation: "bg-emerald-100 text-emerald-800",
  beginner: "bg-accent-gold/10 text-accent-gold",
  intermediate: "bg-amber-100 text-amber-800",
  advanced: "bg-rose-100 text-rose-800",
  expert: "bg-accent-gold/10 text-accent-gold",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await loadPublishedCourseById(id);
  if (!course) return { title: "Course Not Found" };
  return {
    title: `${course.title} | Bhavya Foundation`,
    description: course.description,
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await loadPublishedCourseById(id);
  if (!course) notFound();

  const totalLessons = await getTotalLessonsAsync(course.id);
  const firstLessonId = await getFirstLessonId(course.id);

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link
          href="/courses"
          className="text-sm text-accent-gold hover:underline"
        >
          ← All Courses
        </Link>

        <header className="mt-6">
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${levelColors[course.level]}`}
            >
              {course.level}
            </span>
            <span className="text-xs text-text-primary/50">
              Grade {course.grade} · {course.domain}
            </span>
            <span className="rounded-full border border-border-primary px-2.5 py-0.5 text-xs text-text-secondary">
              Bhavya Academy
            </span>
          </div>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-text-primary">
            {course.title}
          </h1>

          <p className="mt-4 text-lg text-text-primary/70 max-w-2xl">
            {course.description}
          </p>
        </header>

        <div className="mt-8 flex flex-wrap gap-6 text-sm text-text-tertiary/60">
          <div>
            <span className="font-semibold text-text-primary">
              {course.modules.length}
            </span>{" "}
            modules
          </div>
          <div>
            <span className="font-semibold text-text-primary">
              {totalLessons}
            </span>{" "}
            lessons
          </div>
          <div>
            <span className="font-semibold text-text-primary">
              {Math.round(course.estimatedDuration / 60)}
            </span>{" "}
            hours
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-text-primary">Modules</h2>
          <div className="mt-6 space-y-4">
            {course.modules.map((mod) => (
              <div
                key={mod.id}
                className="rounded-xl border border-border-primary bg-white p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-medium text-accent-gold">
                      Module {mod.order}
                    </span>
                    <h3 className="mt-1 text-lg font-semibold text-text-primary">
                      {mod.title}
                    </h3>
                    <p className="mt-1 text-sm text-text-tertiary/60">
                      {mod.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {mod.lessons.map((lesson) => (
                    <Link
                      key={lesson.id}
                      href={`/courses/${course.id}/lessons/${lesson.id}`}
                      className="flex items-center justify-between rounded-lg border border-border-primary/5 px-4 py-3 hover:bg-bg-primary transition group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-bg-tertiary/5 text-xs font-medium text-text-tertiary/60">
                          {lesson.order}
                        </span>
                        <span className="text-sm font-medium text-text-primary group-hover:text-accent-gold transition">
                          {lesson.title}
                        </span>
                      </div>
                      <span className="text-xs text-text-primary/40">
                        {lesson.duration} min
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {course.prerequisites.length > 0 && (
          <div className="mt-12 rounded-xl border border-border-primary bg-white p-6">
            <h2 className="text-lg font-semibold text-text-primary">
              Prerequisites
            </h2>
            <p className="mt-2 text-sm text-text-tertiary/60">
              Before taking this course, complete:
            </p>
            <ul className="mt-3 space-y-2">
              {course.prerequisites.map((preqId: string) => (
                <li key={preqId}>
                  <Link
                    href={`/courses/${preqId}`}
                    className="text-sm font-medium text-accent-gold hover:underline"
                  >
                    {preqId
                      .split("-")
                      .map(
                        (w: string) => w.charAt(0).toUpperCase() + w.slice(1),
                      )
                      .join(" ")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {firstLessonId && (
          <div className="mt-12 flex justify-center">
            <EnrollButton courseId={course.id} firstLessonId={firstLessonId} />
          </div>
        )}
      </div>
    </div>
  );
}
