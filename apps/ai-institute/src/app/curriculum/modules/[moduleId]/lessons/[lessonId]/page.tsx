import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
// Side effect: generates and registers the lessons this page reads. Without it
// the registry is empty and every lesson route 404s.
import "@/data/curriculum/lesson-content";
import { BlockRenderer } from "@/components/curriculum/BlockRenderer";
import { LessonShell } from "@/components/editorial/LessonShell";
import { VisualComponent } from "@/components/curriculum/VisualComponent";
import { resolveAssetUrl } from "@/lib/assetUrls";
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
  const mod = getModuleById(moduleId);
  const lesson = getLesson(moduleId, lessonId);
  if (!mod || !lesson) return {};
  return {
    title: `${lesson.title} — ${mod.title} — AI Curriculum`,
    description: `Lesson ${lesson.title} from the ${mod.title} module, ${BAND_AGES[mod.band].toLowerCase()}, part of the Bhavya AI curriculum.`,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { moduleId, lessonId } = await params;
  const mod = getModuleById(moduleId);
  const lesson = getLesson(moduleId, lessonId);
  if (!mod || !lesson) notFound();

  const lessons = getLessonsForModule(moduleId);
  const lessonIndex = lessons.findIndex((entry) => entry.id === lesson.id);
  const previous = lessonIndex > 0 ? lessons[lessonIndex - 1] : undefined;
  const next =
    lessonIndex >= 0 && lessonIndex < lessons.length - 1
      ? lessons[lessonIndex + 1]
      : undefined;
  const standards = getStandardsForModule(moduleId);

  const base = `/curriculum/modules/${mod.id}/lessons`;

  return (
    <div id="main-content" className="ai-page">
      <nav className="ai-breadcrumb" aria-label="Breadcrumb">
        <Link href="/curriculum">Curriculum</Link>
        {" / "}
        <Link href={`/curriculum/modules/${mod.id}`}>{mod.title}</Link>
        {" / "}
        <span className="ai-breadcrumb-current" aria-current="page">
          {lesson.title}
        </span>
      </nav>

      <LessonShell
        eyebrow={`Lesson ${lessonIndex + 1} of ${lessons.length} · ${BAND_AGES[mod.band]}`}
        title={lesson.title}
        mission={mod.description}
        objectives={mod.learningObjective ? [mod.learningObjective] : []}
        durationMin={lesson.durationMin}
        standards={standards}
        siblings={lessons.map((entry) => ({
          href: `${base}/${entry.id}`,
          title: entry.title,
          current: entry.id === lesson.id,
        }))}
        previous={
          previous
            ? { href: `${base}/${previous.id}`, title: previous.title }
            : undefined
        }
        next={
          next
            ? { href: `${base}/${next.id}`, title: next.title }
            : {
                href: `/curriculum/modules/${mod.id}`,
                title: `Back to ${mod.title}`,
                isModuleEnd: true,
              }
        }
      >
        {mod.recommendedAssetUrl ? (
          <div className="bhv-lesson-visual">
            <VisualComponent
              assetUrl={
                resolveAssetUrl(mod.recommendedAssetUrl) ||
                mod.recommendedAssetUrl
              }
              type={mod.visualFormat === "3d" ? "3d" : "2d"}
              alt={`Visual for ${mod.title}`}
            />
          </div>
        ) : null}

        {lesson.blocks.map((block, index) => (
          <BlockRenderer key={index} block={block} />
        ))}
      </LessonShell>

      <Link className="ai-back-link" href="/curriculum">
        Back to curriculum
      </Link>
    </div>
  );
}
