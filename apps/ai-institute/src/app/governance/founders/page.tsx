import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { SectionHeader } from "@/components/site/SectionHeader";
import { CTABand } from "@/components/site/CTABand";

export const metadata: Metadata = {
  title: "The Founder — Bhavya Foundation",
  description:
    "The Founder's Charter of Bhavya Foundation — the office of Founder as stewardship, not ownership.",
};

const guidingQuestions = [
  "Does this protect Nature?",
  "Does this expand Knowledge?",
  "Does this preserve Heritage?",
  "Does this create measurable public benefit?",
  "Will future generations thank us for this?",
];

const charterPrinciples = [
  {
    title: "Stewardship, not possession",
    description:
      "The office of Founder exists not to confer privilege, ownership, or permanent control. The Charter binds the role to protect rather than possess; to build rather than control.",
  },
  {
    title: "A permanent, non-transferable title",
    description:
      "The title of Founder is historical and permanent. It cannot be inherited, transferred, sold, assigned, or assumed by any future individual.",
  },
  {
    title: "Guardian of the vision",
    description:
      "The Founder protects the vision, safeguards institutional integrity, guides long-term strategy, and represents the Foundation — under the Constitution, not above it.",
  },
  {
    title: "Founder Emeritus",
    description:
      "A defined honorary role exists for a Founder Emeritus — recognising contribution without executive authority.",
  },
];

export default function FoundersPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <PageHero
        label="Governance"
        title="The Founder"
        lead="Shri Manohar Lal is the Founder of Bhavya Foundation — Settlor of the public charitable trust, Founder & Steward under the Constitution, and first Managing Trustee."
      />

      <Section variant="cream">
        <SectionHeader
          label="The Charter"
          title="What the office means"
          description="The Founder's Charter (Document 3) defines the office in writing — so that its meaning never depends on who holds it."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {charterPrinciples.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-border bg-bg-raised p-6"
            >
              <h3
                className="editorial-tile-title"
                style={{ fontSize: "var(--text-xl)" }}
              >
                {item.title}
              </h3>
              <p
                className="editorial-tile-desc"
                style={{ marginTop: "var(--space-3)" }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <SectionHeader
              label="Guiding Questions"
              title="Five questions before every decision"
              description="The Founder's Charter holds the office — and the institution — to these questions."
            />
            <ol className="space-y-4">
              {guidingQuestions.map((question, index) => (
                <li
                  key={question}
                  className="flex items-start gap-4"
                  style={{
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="text-accent-gold"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-xl)",
                      lineHeight: 1.2,
                    }}
                  >
                    {index + 1}
                  </span>
                  <span>{question}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <SectionHeader
              label="In the Founder's Words"
              title="Why the office exists"
            />
            <blockquote
              className="rounded-xl border-l-2 border-accent-gold bg-bg-raised p-6"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-lg)",
                lineHeight: 1.6,
                color: "var(--color-text-primary)",
              }}
            >
              &ldquo;I do not wish to build an organization that depends on me.
              I wish to help build an institution that remains worthy of public
              trust long after I am gone.&rdquo;
              <footer
                className="mt-4"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--text-xs)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--color-text-secondary)",
                }}
              >
                The Founder&apos;s Charter — Bhavya Foundation
              </footer>
            </blockquote>
            <p
              style={{
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
                marginTop: "var(--space-6)",
                fontSize: "var(--text-sm)",
              }}
            >
              Source: The Founder&apos;s Charter (Document 3), Articles 1–3 and
              Appendix; The Constitution (Document 1), Article 7; Public
              Charitable Trust Deed (Document 2).
            </p>
          </div>
        </div>
      </Section>

      <CTABand
        title="See how stewardship is structured"
        text="The Board of Trustees carries the Constitution into practice."
        actions={[
          {
            href: "/governance/board-of-trustees",
            label: "Board of Trustees",
            variant: "gold",
          },
          { href: "/mission", label: "The Constitution", variant: "secondary" },
        ]}
      />
    </div>
  );
}
