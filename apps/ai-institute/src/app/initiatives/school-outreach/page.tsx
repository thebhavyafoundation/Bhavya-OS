import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { SectionHeader } from "@/components/site/SectionHeader";
import { StatusLabel } from "@/components/site/StatusLabel";
import { CTABand } from "@/components/site/CTABand";

export const metadata: Metadata = {
  title: "School Outreach — Bhavya Foundation",
  description:
    "School awareness sessions, teacher training, and environmental education delivered with school partners under written approvals.",
};

const formats = [
  {
    title: "School awareness sessions",
    description:
      "Structured sessions on AI literacy and environmental awareness — listed in the Child Protection & Safeguarding Policy as covered programme activity.",
  },
  {
    title: "Teacher training",
    description:
      "Teacher training accompanies environmental education under the Environmental Conservation Policy, alongside school awareness and environmental clubs.",
  },
  {
    title: "Environmental clubs",
    description:
      "Practical conservation learning that continues inside the school after a session ends — education paired with action.",
  },
  {
    title: "AI literacy in classrooms",
    description:
      "Working with schools to integrate AI literacy and environmental education into curricula — the Community Mission's school partnerships.",
  },
];

const safeguards = [
  "Every school programme runs under a written understanding or approval from the school or competent authority.",
  "The Foundation follows its own safeguarding policy while respecting the school's procedures.",
  "All representatives comply with school rules; sessions are covered by trained adults and defined incident procedures.",
];

export default function SchoolOutreachPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <PageHero
        label="Community Initiative"
        title="School Outreach"
        lead="Constitutionally authorised as Bhavya School Outreach: bringing AI literacy, environmental education, and teacher support into schools — always with the school's agreement, never around it."
      >
        <div className="mt-6 flex justify-center">
          <StatusLabel status="available" />
        </div>
      </PageHero>

      <Section variant="cream">
        <SectionHeader
          label="Formats"
          title="How outreach takes shape"
          description="Programme formats are drawn from the Foundation's own safeguarding and environmental policies — the activities it is mandated to run with schools."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {formats.map((item) => (
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
              label="Ground Rules"
              title="Partnership, not insertion"
            />
            <ul className="space-y-4">
              {safeguards.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3"
                  style={{
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  <span aria-hidden="true" className="mt-1 text-accent-gold">
                    ✦
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeader
              label="Safeguarding"
              title="Children's safety is the first condition"
            />
            <p
              style={{
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
                marginBottom: "var(--space-4)",
              }}
            >
              No programme objective takes precedence over the safety and
              dignity of a child. Every session operates under the Child
              Protection &amp; Safeguarding Policy, reviewed annually by the
              Board of Trustees.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/governance/safeguarding"
                className="btn btn-secondary"
              >
                Safeguarding Policy
              </Link>
              <Link href="/schools" className="btn btn-ghost">
                School Programmes
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <CTABand
        title="Bring outreach to your school"
        text="Schools and educators can open a conversation about partnership, sessions, or teacher training."
        actions={[
          { href: "/teachers", label: "For Teachers", variant: "gold" },
          { href: "/contact", label: "Contact Us", variant: "secondary" },
        ]}
      />
    </div>
  );
}
