import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EmptyState } from "@bhavya/platform-ui";
import { aiModules } from "@/data/curriculum/ai-module-registry";
import {
  getModuleById,
  getPrerequisites,
  getStandardsForModule,
} from "@/lib/curriculum/ai-registry";
import { BAND_LABELS } from "@/lib/curriculum/bands";
import { getLessonsForModule } from "@/lib/curriculum/lessons";

interface ModulePageProps {
  params: Promise<{ moduleId: string }>;
}

export function generateStaticParams() {
  return aiModules.map((mod) => ({ moduleId: mod.id }));
}

export async function generateMetadata({
  params,
}: ModulePageProps): Promise<Metadata> {
  const { moduleId } = await params;
  const mod = getModuleById(moduleId);
  if (!mod) return {};
  return {
    title: `${mod.title} — AI Curriculum`,
    description: mod.description,
  };
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { moduleId } = await params;
  const mod = getModuleById(moduleId);
  if (!mod) notFound();

  const lessons = getLessonsForModule(mod.id);
  const standards = getStandardsForModule(mod.id);
  const prerequisites = getPrerequisites(mod.id);

  return (
    <div id="main-content" className="ai-page">
      <nav className="ai-breadcrumb" aria-label="Breadcrumb">
        <Link href="/curriculum">Curriculum</Link>
        {" / "}
        <span className="ai-breadcrumb-current" aria-current="page">
          {mod.title}
        </span>
      </nav>

      <p className="ai-eyebrow">
        {BAND_LABELS[mod.band]} · Level {mod.level}
      </p>
      <h1 className="ai-page-title">{mod.title}</h1>
      <p className="ai-page-lead">{mod.description}</p>

      <div className="ai-meta-row">
        <span>{mod.estimatedHours} h estimated</span>
        <span>
          {prerequisites.length > 0
            ? `Builds on: ${prerequisites.map((pre) => pre.title).join(", ")}`
            : "No prerequisites"}
        </span>
      </div>

      <div className="ai-chip-row">
        {mod.topics.map((topic) => (
          <span key={topic} className="ai-chip">
            {topic}
          </span>
        ))}
      </div>

      <section className="ai-section" aria-labelledby="lessons-heading">
        <h2 id="lessons-heading" className="ai-section-title">
          Lessons
        </h2>
        {lessons.length > 0 ? (
          <ol className="ai-lesson-list">
            {lessons.map((lesson, index) => (
              <li key={lesson.id}>
                <Link
                  href={`/curriculum/modules/${mod.id}/lessons/${lesson.id}`}
                  className="ai-lesson-link"
                >
                  <span className="ai-lesson-index" aria-hidden="true">
                    {index + 1}
                  </span>
                  {lesson.title}
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          // Most modules are catalogued before their lessons are authored, so
          // this is the common path, not an edge case. It is stated plainly
          // and given somewhere to go, rather than rendering an empty list.
          <EmptyState
            title="No lessons published for this module yet"
            description="The module is part of the curriculum and its objectives and prerequisites are recorded, but its lessons are still being written. Nothing here is locked or missing from your progress record."
            meta={`Objectives on record: ${mod.objectives.length}`}
            action={
              <Link className="btn btn-secondary" href="/curriculum">
                Back to curriculum
              </Link>
            }
          />
        )}
      </section>

      <section className="ai-section" aria-labelledby="standards-heading">
        <h2 id="standards-heading" className="ai-section-title">
          Standards
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

      <Link className="ai-back-link" href="/curriculum">
        Back to curriculum
      </Link>
    </div>
  );
}
