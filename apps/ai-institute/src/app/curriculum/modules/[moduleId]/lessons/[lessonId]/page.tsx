import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmptyState } from "@bhavya/platform-ui";
import { BlockRenderer } from "@/components/curriculum/BlockRenderer";
import { LessonShell } from "@/components/curriculum/LessonShell";
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
  const safeIndex = lessonIndex >= 0 ? lessonIndex + 1 : 1;
  const previous =
    lessonIndex > 0
      ? {
          title: lessons[lessonIndex - 1].title,
          href: `/curriculum/modules/${mod.id}/lessons/${lessons[lessonIndex - 1].id}`,
        }
      : undefined;
  const next =
    lessonIndex >= 0 && lessonIndex < lessons.length - 1
      ? {
          title: lessons[lessonIndex + 1].title,
          href: `/curriculum/modules/${mod.id}/lessons/${lessons[lessonIndex + 1].id}`,
        }
      : {
          title: "Back to the module",
          href: `/curriculum/modules/${mod.id}`,
        };
  const standards = getStandardsForModule(moduleId);

  return (
    <LessonShell
      crumbs={[
        { label: "Curriculum", href: "/curriculum" },
        { label: mod.title, href: `/curriculum/modules/${mod.id}` },
        { label: lesson.title },
      ]}
      index={safeIndex}
      total={lessons.length}
      audience={BAND_AGES[mod.band]}
      title={lesson.title}
      previous={previous}
      next={next}
      footer={
        standards.length > 0 ? (
          <section aria-labelledby="lesson-standards-heading">
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
        ) : (
          // A module with no mapped standards is a real authoring state, not
          // an error. Say so rather than rendering an empty chip row.
          <EmptyState
            title="No standards mapped yet"
            description="This lesson has not been aligned to a published AI-education standard. Alignment is recorded per module and is reviewed during content authoring."
            meta={`Module: ${mod.title}`}
          />
        )
      }
    >
      {mod.recommendedAssetUrl ? (
        <VisualComponent
          assetUrl={
            resolveAssetUrl(mod.recommendedAssetUrl) || mod.recommendedAssetUrl
          }
          type={mod.visualFormat === "3d" ? "3d" : "2d"}
          alt={`Visual for ${mod.title}`}
        />
      ) : null}

      {lesson.blocks.length > 0 ? (
        lesson.blocks.map((block, index) => (
          <BlockRenderer key={index} block={block} />
        ))
      ) : (
        <EmptyState
          title="This lesson has no content yet"
          description="The lesson exists in the registry but its body has not been authored. Nothing is missing from your progress record — the lesson simply is not ready to read."
          meta={`Module: ${mod.title}`}
        />
      )}
    </LessonShell>
  );
}
