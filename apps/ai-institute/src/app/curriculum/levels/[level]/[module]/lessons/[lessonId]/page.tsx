import { notFound } from "next/navigation";
import {
  getModule,
  isLevelParam,
  moduleParams,
  getLessons,
} from "@/data/curriculum";
import { getLesson } from "@/lib/curriculum/lessons";
import { BlockRenderer } from "@/components/curriculum/blocks/BlockRenderer";
import { ModuleQuiz } from "@/components/curriculum/ModuleQuiz";
import { StandardsFooter } from "@/components/curriculum/StandardsFooter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

type Props = {
  params: Promise<{ level: string; module: string; lessonId: string }>;
};

export function generateStaticParams() {
  const params: Array<{ level: string; module: string; lessonId: string }> = [];
  for (const { level, module } of moduleParams()) {
    const mod = getModule(level, module);
    if (mod) {
      const lessons = getLessons(mod.id);
      for (const l of lessons) {
        params.push({ level, module, lessonId: l.id });
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props) {
  const { level, module, lessonId } = await params;
  const mod = getModule(level, module);
  const lesson = mod ? getLesson(mod.id, lessonId) : undefined;
  return {
    title: lesson
      ? `${lesson.title} — ${mod.title} — Curriculum — Bhavya Foundation`
      : "Lesson",
  };
}

export default async function LessonPage({ params }: Props) {
  const { level, module, lessonId } = await params;
  if (!isLevelParam(level)) notFound();
  const mod = getModule(level, module);
  if (!mod) notFound();
  const lesson = getLesson(mod.id, lessonId);
  if (!lesson) notFound();
  const lessons = getLessons(mod.id);
  const lessonIndex = lessons.findIndex((l) => l.id === lessonId);
  const previous = lessonIndex > 0 ? lessons[lessonIndex - 1] : undefined;
  const next =
    lessonIndex >= 0 && lessonIndex < lessons.length - 1
      ? lessons[lessonIndex + 1]
      : undefined;

  return (
    <>
      <div id="main-content" className="min-h-screen">
        {/* Progress bar */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "var(--color-accent-gold)",
            transform: `scaleX(${(lessonIndex + 1) / lessons.length})`,
            transformOrigin: "left",
            zIndex: 50,
            transition: "transform var(--duration-normal) ease",
          }}
        />

        <main
          style={{
            paddingTop: "calc(var(--space-16) + 4px)",
            paddingBottom: "var(--space-16)",
          }}
        >
          <div className="container" style={{ maxWidth: "800px" }}>
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              style={{ marginBottom: "var(--space-6)" }}
            >
              <Link
                href="/curriculum"
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "var(--text-sm)",
                }}
              >
                Curriculum
              </Link>
              <span
                style={{
                  color: "var(--color-text-secondary)",
                  margin: "0 var(--space-2)",
                }}
              >
                {" "}
                /{" "}
              </span>
              <Link
                href={`/curriculum/levels/${level}`}
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "var(--text-sm)",
                }}
              >
                Level {level}
              </Link>
              <span
                style={{
                  color: "var(--color-text-secondary)",
                  margin: "0 var(--space-2)",
                }}
              >
                {" "}
                /{" "}
              </span>
              <Link
                href={`/curriculum/levels/${level}/${mod.id}`}
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "var(--text-sm)",
                }}
              >
                {mod.title}
              </Link>
              <span
                style={{
                  color: "var(--color-text-secondary)",
                  margin: "0 var(--space-2)",
                }}
              >
                {" "}
                /{" "}
              </span>
              <span
                style={{
                  color: "var(--color-text-primary)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                }}
              >
                {lesson.title}
              </span>
            </nav>

            {/* Lesson header */}
            <header style={{ marginBottom: "var(--space-8)" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  marginBottom: "var(--space-3)",
                }}
              >
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "var(--color-brand-forest)",
                    background: "rgba(14, 56, 46, 0.1)",
                    padding: "var(--space-1) var(--space-3)",
                    borderRadius: "var(--radius-full)",
                  }}
                >
                  Lesson {lessonIndex + 1} of {lessons.length}
                </span>
                {lesson.durationMin && (
                  <span
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    ~{lesson.durationMin} min
                  </span>
                )}
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  color: "var(--color-brand-forest)",
                  fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                  lineHeight: 1.2,
                }}
              >
                {lesson.title}
              </h1>
            </header>

            {/* Lesson content */}
            <article style={{ marginBottom: "var(--space-12)" }}>
              <BlockRenderer blocks={lesson.blocks} moduleId={mod.id} />
            </article>

            {/* Module quiz if this is the last lesson */}
            {lessonIndex === lessons.length - 1 && (
              <ModuleQuiz
                questions={lesson.blocks.flatMap((b) =>
                  b.kind === "quiz" ? b.questions : [],
                )}
                moduleId={mod.id}
              />
            )}

            {/* Standards footer */}
            <StandardsFooter moduleId={mod.id} />

            {/* Navigation */}
            <nav
              aria-label="Lesson navigation"
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "var(--space-8)",
                paddingTop: "var(--space-6)",
                borderTop: "1px solid var(--color-border-primary)",
              }}
            >
              <Link
                href={
                  previous
                    ? `/curriculum/levels/${level}/${mod.id}/lessons/${previous.id}`
                    : "#"
                }
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  padding: "var(--space-3) var(--space-5)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--color-border-primary)",
                  background: "var(--color-bg-elevated)",
                  color: "var(--color-text-primary)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  textDecoration: "none",
                  opacity: previous ? 1 : 0.4,
                  pointerEvents: previous ? "auto" : "none",
                }}
              >
                <ChevronLeft size={16} />
                <span>{previous?.title || "Previous lesson"}</span>
              </Link>
              <Link
                href={
                  next
                    ? `/curriculum/levels/${level}/${mod.id}/lessons/${next.id}`
                    : "#"
                }
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  padding: "var(--space-3) var(--space-5)",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--color-brand-forest)",
                  color: "white",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  textDecoration: "none",
                  opacity: next ? 1 : 0.4,
                  pointerEvents: next ? "auto" : "none",
                }}
              >
                <span>{next?.title || "Next lesson"}</span>
                <ChevronRight size={16} />
              </Link>
            </nav>

            {/* Module progress hint */}
            <p
              style={{
                marginTop: "var(--space-8)",
                padding: "var(--space-4)",
                borderRadius: "var(--radius-lg)",
                background: "var(--color-bg-elevated)",
                border: "1px solid var(--color-border-primary)",
                fontSize: "var(--text-sm)",
                color: "var(--color-text-secondary)",
              }}
            >
              Complete all {lessons.length} lessons and score 80%+ on the module
              quiz to earn your certificate.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
