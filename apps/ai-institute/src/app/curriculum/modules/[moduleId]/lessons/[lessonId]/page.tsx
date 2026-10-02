import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/curriculum/BlockRenderer";
import {
  getModuleById,
  getStandardsForModule,
} from "@/lib/curriculum/ai-registry";
import { BAND_AGES } from "@/lib/curriculum/bands";
import {
  getAllLessons,
  getLesson,
  getLessonsForModule,
} from "@/lib/curriculum/lessons";

interface LessonPageProps {
  params: Promise<{ moduleId: string; lessonId: string }>;
}

export function generateStaticParams() {
  return getAllLessons().map((lesson) => ({
    moduleId: lesson.moduleId,
    lessonId: lesson.id,
  }));
}

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { moduleId, lessonId } = await params;
  const courseModule = getModuleById(moduleId);
  const lesson = getLesson(moduleId, lessonId);
  if (!courseModule || !lesson) return {};
  return {
    title: `${lesson.title} — ${courseModule.title} — AI Curriculum`,
    description: `Lesson ${lesson.title} from the ${courseModule.title} module, ${BAND_AGES[courseModule.band].toLowerCase()}, part of the Bhavya AI curriculum.`,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { moduleId, lessonId } = await params;
  const courseModule = getModuleById(moduleId);
  const lesson = getLesson(moduleId, lessonId);
  if (!courseModule || !lesson) notFound();

  const lessons = getLessonsForModule(moduleId);
  const lessonIndex = lessons.findIndex((entry) => entry.id === lesson.id);
  const previous = lessonIndex > 0 ? lessons[lessonIndex - 1] : undefined;
  const next =
    lessonIndex >= 0 && lessonIndex < lessons.length - 1
      ? lessons[lessonIndex + 1]
      : undefined;
  const standards = getStandardsForModule(moduleId);

  return (
    <div id="main-content" className="ai-page">
      <nav className="ai-breadcrumb" aria-label="Breadcrumb">
        <Link href="/curriculum">Curriculum</Link>
        {" / "}
        <Link href={`/curriculum/modules/${courseModule.id}`}>
          {courseModule.title}
        </Link>
        {" / "}
        <span className="ai-breadcrumb-current" aria-current="page">
          {lesson.title}
        </span>
      </nav>

      <p className="ai-eyebrow">
        Lesson {lessonIndex + 1} of {lessons.length} ·{" "}
        {BAND_AGES[courseModule.band]}
      </p>
      <h1 className="ai-page-title">{lesson.title}</h1>

      <div>
        {lesson.blocks.map((block, index) => (
          <BlockRenderer key={index} block={block} />
        ))}
      </div>

      <section
        className="ai-section"
        aria-labelledby="lesson-standards-heading"
      >
        <h2 id="lesson-standards-heading" className="ai-section-title">
          Standards this lesson works toward
        </h2>
        <div className="ai-chip-row">
          {standards.map((standard) => (
            <span
              key={standard.id}
              className="ai-chip"
              title={`${standard.source} · ${standard.gradeBand}`}
            >
              {standard.concept}
            </span>
          ))}
        </div>
      </section>

      <nav className="ai-lesson-nav" aria-label="Lesson navigation">
        <span>
          {previous && (
            <Link
              href={`/curriculum/modules/${courseModule.id}/lessons/${previous.id}`}
              className="ai-nav-btn"
            >
              ← {previous.title}
            </Link>
          )}
        </span>
        <span>
          {next ? (
            <Link
              href={`/curriculum/modules/${courseModule.id}/lessons/${next.id}`}
              className="ai-nav-btn ai-nav-btn-primary"
            >
              {next.title} →
            </Link>
          ) : (
            <Link
              href={`/curriculum/modules/${courseModule.id}`}
              className="ai-nav-btn ai-nav-btn-primary"
            >
              Back to module →
            </Link>
          )}
        </span>
      </nav>

      <Link className="ai-back-link" href="/curriculum">
        Back to curriculum
      </Link>
    </div>
  );
}
