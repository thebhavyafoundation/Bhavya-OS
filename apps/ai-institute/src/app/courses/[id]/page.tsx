import Link from "next/link";
import { notFound } from "next/navigation";
import { loadPublishedCourseById, getTotalLessonsAsync, getFirstLessonId } from "@/data/academy-courses";

const levelColors: Record<string, string> = {
  foundation: "bg-emerald-100 text-emerald-800",
  beginner: "bg-blue-100 text-blue-800",
  intermediate: "bg-amber-100 text-amber-800",
  advanced: "bg-rose-100 text-rose-800",
  expert: "bg-purple-100 text-purple-800",
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
    title: `${course.title} | Bhavya AI Institute`,
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
    <main className="min-h-screen bg-[#f5f1e6]">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link
          href="/courses"
          className="text-sm text-[#c9a227] hover:underline"
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
            <span className="text-xs text-[#1a3a2a]/50">
              Grade {course.grade} · {course.domain}
            </span>
          </div>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#1a3a2a]">
            {course.title}
          </h1>

          <p className="mt-4 text-lg text-[#1a3a2a]/70 max-w-2xl">
            {course.description}
          </p>
        </header>

        <div className="mt-8 flex flex-wrap gap-6 text-sm text-[#1a3a2a]/60">
          <div>
            <span className="font-semibold text-[#1a3a2a]">
              {course.modules.length}
            </span>{" "}
            modules
          </div>
          <div>
            <span className="font-semibold text-[#1a3a2a]">
              {totalLessons}
            </span>{" "}
            lessons
          </div>
          <div>
            <span className="font-semibold text-[#1a3a2a]">
              {Math.round(course.estimatedDuration / 60)}
            </span>{" "}
            hours
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-[#1a3a2a]">Modules</h2>
          <div className="mt-6 space-y-4">
            {course.modules.map((mod) => (
              <div
                key={mod.id}
                className="rounded-xl border border-[#1a3a2a]/10 bg-white p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-medium text-[#c9a227]">
                      Module {mod.order}
                    </span>
                    <h3 className="mt-1 text-lg font-semibold text-[#1a3a2a]">
                      {mod.title}
                    </h3>
                    <p className="mt-1 text-sm text-[#1a3a2a]/60">
                      {mod.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {mod.lessons.map((lesson) => (
                    <Link
                      key={lesson.id}
                      href={`/courses/${course.id}/lessons/${lesson.id}`}
                      className="flex items-center justify-between rounded-lg border border-[#1a3a2a]/5 px-4 py-3 hover:bg-[#f5f1e6] transition group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1a3a2a]/5 text-xs font-medium text-[#1a3a2a]/60">
                          {lesson.order}
                        </span>
                        <span className="text-sm font-medium text-[#1a3a2a] group-hover:text-[#c9a227] transition">
                          {lesson.title}
                        </span>
                      </div>
                      <span className="text-xs text-[#1a3a2a]/40">
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
          <div className="mt-12 rounded-xl border border-[#1a3a2a]/10 bg-white p-6">
            <h2 className="text-lg font-semibold text-[#1a3a2a]">
              Prerequisites
            </h2>
            <p className="mt-2 text-sm text-[#1a3a2a]/60">
              Before taking this course, complete:
            </p>
            <ul className="mt-3 space-y-2">
              {course.prerequisites.map((preqId: string) => (
                <li key={preqId}>
                  <Link
                    href={`/courses/${preqId}`}
                    className="text-sm font-medium text-[#c9a227] hover:underline"
                  >
                    {preqId
                      .split("-")
                      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {firstLessonId && (
          <div className="mt-12 flex justify-center">
            <Link
              href={`/courses/${course.id}/lessons/${firstLessonId}`}
              className="rounded-lg bg-[#1a3a2a] px-8 py-3 text-sm font-medium text-white hover:bg-[#1a3a2a]/80 transition"
            >
              Start Course
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
