import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { SectionHeader } from "@/components/site/SectionHeader";
import { CTABand } from "@/components/site/CTABand";

export const metadata: Metadata = {
  title: "Board of Trustees — Bhavya Foundation",
  description:
    "The principal governing body of Bhavya Foundation: composition, duties, meetings, and standing committees.",
};

const trustees = [
  {
    name: "Shri Manohar Lal",
    role: "Founder & Managing Trustee",
  },
  {
    name: "Smt. Kanta Devi",
    role: "Trustee",
  },
  {
    name: "Shri Kuldeep Sangal",
    role: "Trustee",
  },
];

const duties = [
  {
    title: "Loyalty",
    description:
      "Act in the institution's best interest — never for private gain or outside influence.",
  },
  {
    title: "Care",
    description:
      "Prepare, ask, and scrutinise. Decisions are made with information, not habit.",
  },
  {
    title: "Integrity",
    description:
      "Disclose conflicts of interest; recuse where a material conflict exists; record disclosures in the minutes.",
  },
  {
    title: "Stewardship",
    description:
      "Protect the mission, the assets, and the trust placed in the institution by the public.",
  },
  {
    title: "Duty to Future Generations",
    description:
      "Every significant decision is asked: what impact will this have ten years from now?",
  },
];

const committees = [
  "Finance & Audit",
  "Governance & Ethics",
  "Nature",
  "Knowledge",
  "Heritage",
  "Risk",
  "Technology",
  "Fundraising",
];

export default function BoardOfTrusteesPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <PageHero
        label="Governance"
        title="Board of Trustees"
        lead="The Board is the principal governing body of Bhavya Foundation. It governs — it does not manage. Its authority comes from the Trust Deed and the Constitution."
      />

      <Section variant="cream">
        <SectionHeader
          label="Composition"
          title="The Trustees"
          description="The founding Board; the Constitution provides that its preferred long-term size is ordinarily five, seven, or nine Trustees."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {trustees.map((trustee) => (
            <div
              key={trustee.name}
              className="rounded-xl border border-border bg-bg-raised p-6 text-center"
            >
              <div
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
                style={{
                  background: "var(--color-surface-forest-light)",
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-xl)",
                  color: "var(--color-accent-gold)",
                }}
                aria-hidden="true"
              >
                {trustee.name.split(" ").slice(-1)[0].charAt(0)}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-xl)",
                  color: "var(--color-text-primary)",
                }}
              >
                {trustee.name}
              </h3>
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-secondary)",
                  marginTop: "var(--space-2)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {trustee.role}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <SectionHeader
              label="Duties"
              title="Five constitutional duties"
              description="Every Trustee swears these duties under the Board of Trustees Charter."
            />
            <div className="space-y-5">
              {duties.map((duty) => (
                <div key={duty.title}>
                  <h3
                    className="editorial-tile-title"
                    style={{ fontSize: "var(--text-lg)" }}
                  >
                    {duty.title}
                  </h3>
                  <p
                    className="editorial-tile-desc"
                    style={{ marginTop: "var(--space-2)" }}
                  >
                    {duty.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionHeader label="How It Works" title="Meetings & committees" />
            <div className="space-y-5">
              <div className="rounded-xl border border-border bg-bg-raised p-5">
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-lg)",
                    color: "var(--color-text-primary)",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  Meetings
                </h3>
                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    fontSize: "var(--text-sm)",
                    lineHeight: 1.7,
                  }}
                >
                  The Board meets quarterly — at least four times each calendar
                  year. Consensus is preferred; otherwise each Trustee holds one
                  vote. Until the Board expands, all three Trustees form the
                  quorum for significant decisions.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-bg-raised p-5">
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-lg)",
                    color: "var(--color-text-primary)",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  Self-review
                </h3>
                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    fontSize: "var(--text-sm)",
                    lineHeight: 1.7,
                  }}
                >
                  At least once every two years, the Board reviews its own
                  effectiveness — attendance, preparedness, decision quality,
                  strategy, and oversight.
                </p>
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-lg)",
                    color: "var(--color-text-primary)",
                    marginBottom: "var(--space-3)",
                  }}
                >
                  Standing committees
                </h3>
                <div className="flex flex-wrap gap-2">
                  {committees.map((name) => (
                    <span
                      key={name}
                      className="rounded-full border border-border px-3 py-1 text-xs font-medium"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <p
          style={{
            color: "var(--color-text-secondary)",
            lineHeight: 1.7,
            marginTop: "var(--space-8)",
            fontSize: "var(--text-sm)",
          }}
        >
          Source: Board of Trustees Charter (Document 4), Articles 2–4 and 7–14;
          The Constitution (Document 1), Article 8; Governance Manual (Document
          5), Chapters 2 and 5; Public Charitable Trust Deed (Document 2),
          Articles 6 and 9.
        </p>
      </Section>

      <CTABand
        title="Read the records"
        text="Governance documents and financial disclosures are published in the transparency portal."
        actions={[
          {
            href: "/transparency",
            label: "Transparency Portal",
            variant: "gold",
          },
          {
            href: "/governance",
            label: "Governance Overview",
            variant: "secondary",
          },
        ]}
      />
    </div>
  );
}
