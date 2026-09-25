import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { SectionHeader } from "@/components/site/SectionHeader";
import { StatusLabel } from "@/components/site/StatusLabel";
import { CTABand } from "@/components/site/CTABand";

export const metadata: Metadata = {
  title: "Experiments — Bhavya Foundation",
  description:
    "Bhavya AI Labs — centres for learning, experimentation, and innovation under the AI Ethics & Responsible AI Policy.",
};

const labOffering = [
  {
    title: "Learning spaces",
    description:
      "Workstations and internet-enabled learning spaces with open-source AI software, available for study and practice.",
  },
  {
    title: "Coding & innovation",
    description:
      "Coding workshops, innovation challenges, and community hackathons where ideas are built and tested in the open.",
  },
  {
    title: "Mentorship",
    description:
      "Mentorship, research support, and career guidance for participants — from first-time learners to young researchers.",
  },
  {
    title: "Learning over commercialisation",
    description:
      "The policy is explicit: AI Labs shall prioritise learning over commercialisation. Success is measured by what participants can do, not what is sold.",
  },
];

const labStandards = [
  "A safe and inclusive environment for all participants",
  "Open-source AI software wherever practical",
  "Reliable, high-speed internet access",
  "Modern, well-maintained equipment",
  "A structured AI curriculum",
  "Mentorship and career guidance",
  "Community innovation programmes",
  "Accessibility as a design requirement, not an afterthought",
];

export default function ExperimentsPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <PageHero
        label="Flagship Programme"
        title="Experiments & AI Labs"
        lead="Bhavya AI Labs are centres for learning, experimentation, and innovation — where the Foundation's AI education mandate becomes something you can touch, build, and question."
      >
        <div className="mt-6 flex justify-center">
          <StatusLabel status="in-development" />
        </div>
      </PageHero>

      <Section variant="cream">
        <SectionHeader
          label="The Programme"
          title="What an AI Lab offers"
          description="Authorised by the Constitution and specified in the AI Ethics & Responsible AI Policy (BF-AI-001), Article 5."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {labOffering.map((item) => (
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
              label="Standards"
              title="What every lab must provide"
            />
            <ul className="space-y-4">
              {labStandards.map((standard) => (
                <li
                  key={standard}
                  className="flex items-start gap-3"
                  style={{
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  <span aria-hidden="true" className="mt-1 text-accent-gold">
                    ✦
                  </span>
                  <span>{standard}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeader
              label="Guardrails"
              title="Ethics and safety come first"
            />
            <p
              style={{
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
                marginBottom: "var(--space-4)",
              }}
            >
              Every lab operates under the AI Ethics &amp; Responsible AI
              Policy: AI is used to enhance human capability, never for
              surveillance, discrimination, deception, exploitation, or harm. AI
              outputs are reviewed before being relied upon for significant
              decisions.
            </p>
            <p
              style={{
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
                marginBottom: "var(--space-4)",
              }}
            >
              AI Labs are explicitly within the scope of the Child Protection
              &amp; Safeguarding Policy — every session involving young people
              runs under written school or partner approval, with trained adults
              and defined incident procedures.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/governance/ai-ethics" className="btn btn-secondary">
                AI Ethics Policy
              </Link>
              <Link href="/governance/safeguarding" className="btn btn-ghost">
                Safeguarding Policy
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <Section variant="ivory">
        <div className="max-w-3xl">
          <SectionHeader
            label="Status"
            title="In development"
            description="The programme is authorised and specified in policy. Lab locations, schedules, and enrolment are published here as they are confirmed — no counts, dates, or partners are claimed before they exist."
          />
        </div>
      </Section>

      <CTABand
        title="Follow the work as it happens"
        text="Programme announcements appear through the initiatives and community channels."
        actions={[
          { href: "/initiatives", label: "All Initiatives", variant: "gold" },
          { href: "/contact", label: "Contact the Team", variant: "secondary" },
        ]}
      />
    </div>
  );
}
