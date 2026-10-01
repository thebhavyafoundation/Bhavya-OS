import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
  return aiModules.map((module) => ({ moduleId: module.id }));
}

export async function generateMetadata({
  params,
}: ModulePageProps): Promise<Metadata> {
  const { moduleId } = await params;
  const module = getModuleById(moduleId);
  if (!module) return {};
  return {
    title: `${module.title} — AI Curriculum`,
    description: module.description,
  };
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { moduleId } = await params;
  const module = getModuleById(moduleId);
  if (!module) notFound();

  const lessons = getLessonsForModule(module.id);
  const standards = getStandardsForModule(module.id);
  const prerequisites = getPrerequisites(module.id);

  return (
    <div id="main-content" className="ai-page">
      <nav className="ai-breadcrumb" aria-label="Breadcrumb">
        <Link href="/curriculum">Curriculum</Link>
        {" / "}
        <span className="ai-breadcrumb-current" aria-current="page">
          {module.title}
        </span>
      </nav>

      <p className="ai-eyebrow">
        {BAND_LABELS[module.band]} · Level {module.level}
      </p>
      <h1 className="ai-page-title">{module.title}</h1>
      <p className="ai-page-lead">{module.description}</p>

      <div className="ai-meta-row">
        <span>{module.estimatedHours} h estimated</span>
        <span>
          {prerequisites.length > 0
            ? `Builds on: ${prerequisites.map((pre) => pre.title).join(", ")}`
            : "No prerequisites"}
        </span>
      </div>

      <div className="ai-chip-row">
        {module.topics.map((topic) => (
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
                  href={`/curriculum/modules/${module.id}/lessons/${lesson.id}`}
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
          <div className="ai-empty">
            <p>
              Lesson content for this module is being prepared. You can still
              track module completion from the curriculum timeline.
            </p>
            <Link className="ai-back-link" href="/curriculum">
              Back to curriculum
            </Link>
          </div>
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
