import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCourseById,
  getLessonById,
  getNextLesson,
  getPreviousLesson,
} from "@/data/academy-courses";
import { getLessonContent, getPublishedLessonContent } from "@/data/academy-lessons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id, lessonId } = await params;
  const result = getLessonById(id, lessonId);
  if (!result) return { title: "Lesson Not Found" };
  const lessonTitle = result.module.lessons[result.lessonIndex].title;
  return {
    title: `${lessonTitle} | ${result.course.title}`,
    description: `Lesson ${result.module.lessons[result.lessonIndex].order} in ${result.module.title}`,
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id, lessonId } = await params;
  const result = getLessonById(id, lessonId);
  if (!result) notFound();

  const { course, module: mod, lessonIndex } = result;
  const lesson = mod.lessons[lessonIndex];
  const content = (await getPublishedLessonContent(lessonId)) || getLessonContent(lessonId);

  const next = getNextLesson(id, lessonId);
  const prev = getPreviousLesson(id, lessonId);

  return (
    <main className="min-h-screen bg-[#f5f1e6]">
      <div className="mx-auto max-w-4xl px-6 py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#1a3a2a]/50">
          <Link href="/courses" className="hover:text-[#c9a227]">
            Courses
          </Link>
          <span>/</span>
          <Link href={`/courses/${course.id}`} className="hover:text-[#c9a227]">
            {course.title}
          </Link>
          <span>/</span>
          <span className="text-[#1a3a2a]">{lesson.title}</span>
        </nav>

        {/* Module context */}
        <div className="mt-4 rounded-lg bg-[#1a3a2a]/5 px-4 py-2 text-xs text-[#1a3a2a]/60">
          Module {mod.order}: {mod.title} · Lesson {lesson.order} of{" "}
          {mod.lessons.length}
        </div>

        {/* Lesson title */}
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-[#1a3a2a]">
          {lesson.title}
        </h1>
        <p className="mt-2 text-sm text-[#1a3a2a]/50">
          {lesson.duration} minutes
        </p>

        {/* Content */}
        {content ? (
          <article className="mt-10 prose prose-stone max-w-none">
            {/* Reading */}
            <div
              className="lesson-content"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(content.reading) }}
            />

            {/* Key Concepts */}
            {content.keyConcepts.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold text-[#1a3a2a]">
                  Key Concepts
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {content.keyConcepts.map((concept) => (
                    <div
                      key={concept.term}
                      className="rounded-xl border border-[#1a3a2a]/10 bg-white p-4"
                    >
                      <h3 className="font-semibold text-[#1a3a2a]">
                        {concept.term}
                      </h3>
                      <p className="mt-1 text-sm text-[#1a3a2a]/60">
                        {concept.definition}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Examples */}
            {content.examples.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold text-[#1a3a2a]">Examples</h2>
                {content.examples.map((ex) => (
                  <div key={ex.title} className="mt-4 rounded-xl border border-[#1a3a2a]/10 bg-white p-6">
                    <h3 className="font-semibold text-[#1a3a2a]">{ex.title}</h3>
                    {ex.code && (
                      <pre className="mt-3 rounded-lg bg-[#1a3a2a]/5 p-4 text-sm overflow-x-auto">
                        <code>{ex.code}</code>
                      </pre>
                    )}
                    <p className="mt-3 text-sm text-[#1a3a2a]/70">
                      {ex.explanation}
                    </p>
                  </div>
                ))}
              </section>
            )}

            {/* Exercises */}
            {content.exercises.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold text-[#1a3a2a]">
                  Exercises
                </h2>
                <div className="mt-4 space-y-4">
                  {content.exercises.map((ex) => (
                    <div
                      key={ex.id}
                      className="rounded-xl border border-[#c9a227]/30 bg-[#c9a227]/5 p-6"
                    >
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-[#c9a227]/20 px-2.5 py-0.5 text-xs font-medium text-[#8a7359]">
                          {ex.type}
                        </span>
                        <h3 className="font-semibold text-[#1a3a2a]">
                          {ex.title}
                        </h3>
                      </div>
                      <p className="mt-2 text-sm text-[#1a3a2a]/70">
                        {ex.instructions}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reflection */}
            <section className="mt-12 rounded-xl border border-[#1a3a2a]/10 bg-white p-6">
              <h2 className="text-2xl font-bold text-[#1a3a2a]">Reflect</h2>
              <p className="mt-3 text-[#1a3a2a]/70">
                {content.reflection.prompt}
              </p>
              {content.reflection.followUp.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {content.reflection.followUp.map((q: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-[#1a3a2a]/60"
                    >
                      <span className="mt-0.5 text-[#c9a227]">→</span>
                      {q}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </article>
        ) : (
          <div className="mt-10 rounded-xl border border-[#1a3a2a]/10 bg-white p-8 text-center">
            <p className="text-[#1a3a2a]/60">
              Lesson content is being prepared. Check back soon.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-16 flex items-center justify-between border-t border-[#1a3a2a]/10 pt-8">
          {prev ? (
            <Link
              href={`/courses/${prev.courseId}/lessons/${prev.lessonId}`}
              className="rounded-lg border border-[#1a3a2a]/10 px-6 py-3 text-sm font-medium text-[#1a3a2a] hover:bg-white transition"
            >
              ← Previous Lesson
            </Link>
          ) : (
            <div />
          )}

          {next ? (
            <Link
              href={`/courses/${next.courseId}/lessons/${next.lessonId}`}
              className="rounded-lg bg-[#1a3a2a] px-6 py-3 text-sm font-medium text-white hover:bg-[#1a3a2a]/80 transition"
            >
              Next Lesson →
            </Link>
          ) : (
            <Link
              href={`/courses/${course.id}`}
              className="rounded-lg bg-[#c9a227] px-6 py-3 text-sm font-medium text-white hover:bg-[#c9a227]/80 transition"
            >
              Course Complete ✓
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}

// Simple markdown to HTML converter
function markdownToHtml(md: string): string {
  return md
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";

      if (trimmed.startsWith("## ")) return `<h2>${trimmed.slice(3)}</h2>`;
      if (trimmed.startsWith("### ")) return `<h3>${trimmed.slice(4)}</h3>`;

      if (trimmed.startsWith("```")) {
        const code = trimmed.slice(3, -3).replace(/^\w+\n/, "");
        return `<pre><code>${code}</code></pre>`;
      }

      if (trimmed.startsWith("- ")) {
        const items = trimmed
          .split("\n")
          .map((l) => `<li>${l.slice(2).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }

      if (/^\d+\./.test(trimmed)) {
        const items = trimmed
          .split("\n")
          .map((l) => {
            const text = l.replace(/^\d+\.\s*/, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
            return `<li>${text}</li>`;
          })
          .join("");
        return `<ol>${items}</ol>`;
      }

      if (trimmed.includes("|") && trimmed.includes("---")) {
        const rows = trimmed.split("\n").filter((r) => !r.match(/^\|[\s-]+\|/));
        if (rows.length > 0) {
          const header = rows[0];
          const body = rows.slice(1);
          const headerCells = header
            .split("|")
            .filter(Boolean)
            .map((c) => `<th>${c.trim()}</th>`)
            .join("");
          const bodyRows = body
            .map((r) => {
              const cells = r
                .split("|")
                .filter(Boolean)
                .map((c) => `<td>${c.trim()}</td>`)
                .join("");
              return `<tr>${cells}</tr>`;
            })
            .join("");
          return `<table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table>`;
        }
      }

      return `<p>${trimmed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n");
}
