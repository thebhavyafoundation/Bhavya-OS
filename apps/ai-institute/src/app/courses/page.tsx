import Link from "next/link";
import { courses, getTotalLessons } from "@/data/academy-courses";

const levelColors: Record<string, string> = {
  foundation: "bg-emerald-100 text-emerald-800",
  beginner: "bg-blue-100 text-blue-800",
  intermediate: "bg-amber-100 text-amber-800",
  advanced: "bg-rose-100 text-rose-800",
  expert: "bg-purple-100 text-purple-800",
};

export const metadata = {
  title: "Courses | Bhavya AI Institute",
  description:
    "Explore our AI curriculum — from foundations to advanced topics. Learn by building real projects.",
};

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-[#f5f1e6]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-12">
          <p className="text-sm font-medium tracking-widest text-[#c9a227] uppercase">
            Curriculum
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#1a3a2a]">
            Courses
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[#1a3a2a]/70">
            Learn AI from the ground up. Each course is designed to build on the
            previous one, taking you from curiosity to capability.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="group rounded-xl border border-[#1a3a2a]/10 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${levelColors[course.level]}`}
                >
                  {course.level}
                </span>
                <span className="text-xs text-[#1a3a2a]/50">
                  Grade {course.grade}
                </span>
              </div>

              <h2 className="text-xl font-semibold text-[#1a3a2a] group-hover:text-[#c9a227] transition-colors">
                {course.title}
              </h2>

              <p className="mt-2 text-sm text-[#1a3a2a]/60 line-clamp-3">
                {course.description}
              </p>

              <div className="mt-4 flex items-center gap-4 text-xs text-[#1a3a2a]/50">
                <span>{course.modules.length} modules</span>
                <span>{getTotalLessons(course.id)} lessons</span>
                <span>{Math.round(course.estimatedDuration / 60)}h total</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {course.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-[#f5f1e6] px-2 py-0.5 text-xs text-[#1a3a2a]/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-xl border border-[#1a3a2a]/10 bg-white p-8">
          <h2 className="text-2xl font-bold text-[#1a3a2a]">
            Learning Path
          </h2>
          <p className="mt-2 text-[#1a3a2a]/60">
            Follow the recommended sequence for the best learning experience.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {courses.map((course, i) => (
              <div key={course.id} className="flex items-center gap-3">
                <Link
                  href={`/courses/${course.id}`}
                  className="rounded-lg bg-[#1a3a2a] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a3a2a]/80 transition"
                >
                  {course.title}
                </Link>
                {i < courses.length - 1 && (
                  <span className="text-[#1a3a2a]/30">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
