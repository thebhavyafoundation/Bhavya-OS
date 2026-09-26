import type { ReactNode } from "react";
import { StatusBadge, EmptyState } from "@bhavya/platform-ui";
import type { MissionProfile } from "@/data/mission-profiles";
import { Section } from "./Section";
import { SectionHeader } from "./SectionHeader";
import { CTABand } from "./CTABand";

interface MissionPageProps {
  profile: MissionProfile;
  /** Live institutional activity (real API data); shown under Accomplishments. */
  activity?: ReactNode;
}

/**
 * MissionPage — one honest structure for all four mission pages:
 * status banner · constitutional mandate · plan-labeled roadmap ·
 * accomplishments (live activity or honest empty state) · CTA.
 */
export function MissionPage({ profile, activity }: MissionPageProps) {
  const isActive = profile.status === "active";
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Hero — status banner */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <StatusBadge
              label={profile.statusLabel}
              variant={isActive ? "active" : "draft"}
            />
            <span className="text-sm text-text-secondary">
              {profile.statusCopy}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-5">
            {profile.name}
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl">
            {profile.oneLiner}
          </p>
        </div>
      </section>

      {/* Mandate — verbatim constitutional quotes */}
      <Section variant="ivory">
        <SectionHeader
          label="Mandate"
          title="What the constitution requires"
          description="Quoted verbatim from the legacy constitutional documents — not paraphrased, not interpreted."
        />
        <div className="mt-10 flex flex-col gap-10">
          {profile.mandates.map((m) => (
            <blockquote key={m.source + m.quote.slice(0, 24)}>
              <p
                className="editorial-heading"
                style={{
                  fontSize: "var(--text-2xl)",
                  lineHeight: 1.45,
                  maxWidth: "820px",
                }}
              >
                &ldquo;{m.quote}&rdquo;
              </p>
              <cite
                className="mt-4 block text-sm not-italic text-text-tertiary"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {m.source}
              </cite>
            </blockquote>
          ))}
        </div>
      </Section>

      {/* Roadmap — plan, explicitly not achieved */}
      <Section>
        <SectionHeader
          label="Roadmap"
          title="What comes next"
          description="These phases describe intent, not achievement. Nothing in this roadmap has been achieved yet."
        />
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {profile.roadmap.map((step) => (
            <div
              key={step.phase}
              className="rounded-xl border border-border-primary bg-bg-secondary p-6"
            >
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="editorial-label">{step.phase}</span>
                <span className="rounded-full border border-border-primary px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                  Plan — not yet achieved
                </span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                {step.intent}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Accomplishments — live activity or honest empty state */}
      <Section variant="cream" id="accomplishments">
        <SectionHeader
          label="Accomplishments"
          title="Progress so far"
          description="Dated, sourced records only. Nothing appears here without a source."
        />
        <div className="mt-8">
          {activity ?? (
            <EmptyState
              title="No accomplishments published yet"
              description={profile.accomplishments}
            />
          )}
        </div>
      </Section>

      {/* CTA */}
      {isActive ? (
        <CTABand
          title="Learn with us"
          text="The academy is open. Every lesson is free to read, use, and share."
          actions={[
            { href: "/knowledge", label: "Explore the Knowledge Mission" },
            { href: "/missions", label: "All missions", variant: "secondary" },
          ]}
        />
      ) : (
        <CTABand
          title="Help start this mission"
          text="Volunteers, partners, and donors make the first phase possible."
          actions={[
            { href: "/get-involved", label: "Get involved" },
            {
              href: "/donate",
              label: "Support the Foundation",
              variant: "secondary",
            },
          ]}
        />
      )}
    </div>
  );
}
