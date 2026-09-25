import Link from "next/link";
import {
  loadPublishedCourses,
  getTotalLessonsAsync,
} from "@/lib/studio/courses";

const levelColors: Record<string, string> = {
  foundation: "bg-emerald-100 text-emerald-800",
  beginner: "bg-accent-gold/10 text-accent-gold",
  intermediate: "bg-amber-100 text-amber-800",
  advanced: "bg-rose-100 text-rose-800",
  expert: "bg-forest/10 text-forest",
};

export const metadata = {
  title: "Courses | Bhavya Foundation",
  description:
    "Explore our AI curriculum — from foundations to advanced topics. Learn by building real projects.",
};

export default async function CoursesPage() {
  // Load from SQLite first, fall back to static data
  const courses = await loadPublishedCourses();

  // Resolve lesson counts (SQLite or static)
  const lessonCounts = new Map<string, number>();
  await Promise.all(
    courses.map(async (c) => {
      lessonCounts.set(c.id, await getTotalLessonsAsync(c.id));
    }),
  );
  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-12">
          <p className="text-sm font-medium tracking-widest text-accent-gold uppercase">
            Curriculum
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-text-primary">
            Courses
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-text-primary/70">
            Learn AI from the ground up. Each course is designed to build on the
            previous one, taking you from curiosity to capability.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="group rounded-xl border border-border-primary bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${levelColors[course.level]}`}
                >
                  {course.level}
                </span>
                <span className="text-xs text-text-primary/50">
                  Grade {course.grade}
                </span>
              </div>

              <h2 className="text-xl font-semibold text-text-primary group-hover:text-accent-gold transition-colors">
                {course.title}
              </h2>

              <p className="mt-2 text-sm text-text-primary/60 line-clamp-3">
                {course.description}
              </p>

              <div className="mt-4 flex items-center gap-4 text-xs text-text-primary/50">
                <span>{course.modules.length} modules</span>
                <span>{lessonCounts.get(course.id) ?? 0} lessons</span>
                <span>{Math.round(course.estimatedDuration / 60)}h total</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {course.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-bg-secondary px-2 py-0.5 text-xs text-text-primary/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-xl border border-border-primary bg-white p-8">
          <h2 className="text-2xl font-bold text-text-primary">
            Learning Path
          </h2>
          <p className="mt-2 text-text-primary/60">
            Follow the recommended sequence for the best learning experience.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {courses.map((course, i) => (
              <div key={course.id} className="flex items-center gap-3">
                <Link
                  href={`/courses/${course.id}`}
                  className="rounded-lg bg-bg-tertiary px-4 py-2 text-sm font-medium text-text-primary hover:bg-bg-tertiary/80 transition"
                >
                  {course.title}
                </Link>
                {i < courses.length - 1 && (
                  <span className="text-text-primary/30">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
