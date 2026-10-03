import { notFound } from "next/navigation";
import { getModule, moduleParams, isLevelParam } from "@/data/curriculum";
import { getLessons } from "@/lib/curriculum/lessons";

type Props = { params: Promise<{ level: string; module: string }> };

export function generateStaticParams() {
  return moduleParams().map((m) => ({ level: m.level, module: m.module }));
}

export async function generateMetadata({ params }: Props) {
  const { level, module: id } = await params;
  const mod = getModule(level, id);
  return {
    title: mod ? `${mod.title} — Curriculum — Bhavya Foundation` : "Module",
  };
}

export default async function ModulePage({ params }: Props) {
  const { level, module: id } = await params;
  if (!isLevelParam(level)) notFound();
  const mod = getModule(level, id);
  if (!mod) notFound();
  const lessons = getLessons(mod.id);
  return (
    <main
      id="main-content"
      className="container"
      style={{ paddingBlock: "var(--space-16)" }}
    >
      <nav aria-label="Breadcrumb">
        <a href="/curriculum">Curriculum</a> /{" "}
        <a href={`/curriculum/levels/${level}`}>Level {level}</a> / {mod.title}
      </nav>
      <span
        className="curriculum-tier-band"
        style={{
          display: "inline-block",
          fontSize: "var(--text-xs)",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "var(--color-brand-forest)",
          marginBottom: "var(--space-4)",
        }}
      >
        {mod.ageBand === "advanced"
          ? "Advanced · mentor-led"
          : `Ages ${mod.ageBand}`}
      </span>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          color: "var(--color-brand-forest)",
          marginBottom: "var(--space-4)",
        }}
      >
        {mod.title}
      </h1>
      <p
        style={{
          color: "var(--color-earth)",
          marginBottom: "var(--space-8)",
          lineHeight: 1.7,
        }}
      >
        {mod.mission}
      </p>
      <section style={{ marginBottom: "var(--space-8)" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            color: "var(--color-brand-forest)",
            marginBottom: "var(--space-4)",
            fontSize: "var(--text-xl)",
          }}
        >
          Learning objectives
        </h2>
        <ul
          style={{
            color: "var(--color-earth)",
            paddingLeft: "var(--space-6)",
            lineHeight: 2,
          }}
        >
          {mod.objectives.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </section>
      <section style={{ marginBottom: "var(--space-8)" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            color: "var(--color-brand-forest)",
            marginBottom: "var(--space-4)",
            fontSize: "var(--text-xl)",
          }}
        >
          Format
        </h2>
        <p style={{ color: "var(--color-earth)", lineHeight: 1.7 }}>
          {mod.duration} · {mod.handsOnPercent}% hands-on
        </p>
      </section>
      {mod.projects.length > 0 && (
        <section style={{ marginBottom: "var(--space-8)" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              color: "var(--color-brand-forest)",
              marginBottom: "var(--space-4)",
              fontSize: "var(--text-xl)",
            }}
          >
            Projects
          </h2>
          <ul
            style={{
              color: "var(--color-earth)",
              paddingLeft: "var(--space-6)",
              lineHeight: 2,
            }}
          >
            {mod.projects.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      )}
      {mod.labs.length > 0 && (
        <section style={{ marginBottom: "var(--space-8)" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              color: "var(--color-brand-forest)",
              marginBottom: "var(--space-4)",
              fontSize: "var(--text-xl)",
            }}
          >
            Labs
          </h2>
          <ul
            style={{
              color: "var(--color-earth)",
              paddingLeft: "var(--space-6)",
              lineHeight: 2,
            }}
          >
            {mod.labs.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </section>
      )}
      <section style={{ marginBottom: "var(--space-8)" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            color: "var(--color-brand-forest)",
            marginBottom: "var(--space-4)",
            fontSize: "var(--text-xl)",
          }}
        >
          Lessons
        </h2>
        {lessons.length === 0 ? (
          <p style={{ color: "var(--color-earth)" }}>
            Lessons for this module are being prepared.
          </p>
        ) : (
          <ol
            style={{
              paddingLeft: "var(--space-6)",
              color: "var(--color-earth)",
              lineHeight: 2.5,
            }}
          >
            {lessons.map((l) => (
              <li key={l.id}>
                <a
                  href={`/curriculum/levels/${level}/${mod.id}/lessons/${l.id}`}
                  style={{
                    color: "var(--color-brand-forest)",
                    textDecoration: "underline",
                  }}
                >
                  {l.title}
                </a>
                <span
                  style={{
                    marginLeft: "var(--space-2)",
                    color: "var(--color-earth)",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  — {l.durationMin} min
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>
      <p
        style={{
          color: "var(--color-earth)",
          borderTop: "1px solid var(--color-border-primary)",
          paddingTop: "var(--space-6)",
        }}
      >
        A certificate of completion is available once every lesson is complete
        and the module check scores 80% or higher.
      </p>
    </main>
  );
}
