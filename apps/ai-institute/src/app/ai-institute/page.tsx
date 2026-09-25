import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { SectionHeader } from "@/components/site/SectionHeader";
import { HubCard } from "@/components/site/HubCard";
import { CTABand } from "@/components/site/CTABand";

export const metadata: Metadata = {
  title: "AI Institute — Bhavya Foundation",
  description:
    "Bhavya Foundation's AI Institute: education, applied research, and responsible AI practice under the Knowledge pillar.",
};

const instituteAreas = [
  {
    title: "AI Education",
    description:
      "AI literacy, machine learning fundamentals, responsible AI, and programming — with the constitutional objective of making AI education accessible to rural and underserved communities.",
  },
  {
    title: "Responsible AI",
    description:
      "All AI activities must respect human dignity, fairness, transparency, privacy, and applicable law. Technology remains accountable to human values.",
  },
  {
    title: "Open Knowledge",
    description:
      "Open educational resources, digital libraries, and community learning programmes — knowledge treated as a public good under the Constitution.",
  },
  {
    title: "Research",
    description:
      "Research in AI and adjacent fields is encouraged and must be conducted ethically and responsibly, feeding back into how the Foundation teaches and builds.",
  },
];

const institutePaths = [
  {
    href: "/curriculum",
    title: "Curriculum",
    description:
      "The Bhavya Academy curriculum — thirteen levels from AI foundations to institution building.",
    status: "available" as const,
  },
  {
    href: "/ai-institute/experiments",
    title: "Experiments",
    description:
      "Bhavya AI Labs and the innovation programme: learning, experimentation, and community hackathons.",
    status: "in-development" as const,
    eyebrow: "Flagship",
  },
  {
    href: "/learning-paths",
    title: "Learning Paths",
    description:
      "Structured journeys through the academy, matched to where you are today.",
    status: "available" as const,
  },
  {
    href: "/community",
    title: "Community",
    description:
      "Learners, mentors, and practitioners studying and building together in the open.",
    status: "available" as const,
  },
  {
    href: "/schools",
    title: "Schools",
    description:
      "School programmes that bring AI literacy and environmental education into classrooms.",
    status: "available" as const,
  },
  {
    href: "/projects",
    title: "Projects",
    description:
      "Real projects learners contribute to, from code to community documentation.",
    status: "available" as const,
  },
  {
    href: "/faq",
    title: "Questions & Answers",
    description:
      "How programmes, access, and participation work — answered plainly.",
    status: "available" as const,
  },
];

export default function AIInstitutePage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <PageHero
        label="Bhavya AI Institute"
        title="AI in service of humanity"
        lead="Education, applied research, and responsible practice — the Knowledge pillar's institute within Bhavya Foundation. Technology accountable to human values, knowledge treated as a public good."
      />

      <Section variant="cream">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <SectionHeader
              label="What This Is"
              title="One pillar of a larger institution"
            />
            <p
              style={{
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
                marginBottom: "var(--space-4)",
              }}
            >
              Bhavya Foundation is the parent institution. The AI Institute sits
              within its Knowledge pillar — alongside forest, heritage, and
              community work — and is measured by the same Constitution: every
              programme must substantially advance Nature, Knowledge, or
              Heritage.
            </p>
            <p
              style={{
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
              }}
            >
              The Constitution authorises AI laboratories, AI education,
              responsible-AI practice, and AI research — provided every activity
              respects human dignity, fairness, transparency, privacy, and
              applicable law. That is the mandate this institute operates under.
            </p>
          </div>
          <div>
            <SectionHeader label="Focus Areas" title="Four commitments" />
            <div className="space-y-6">
              {instituteAreas.map((area) => (
                <div key={area.title}>
                  <h3
                    className="editorial-tile-title"
                    style={{ fontSize: "var(--text-lg)" }}
                  >
                    {area.title}
                  </h3>
                  <p
                    className="editorial-tile-desc"
                    style={{ marginTop: "var(--space-2)" }}
                  >
                    {area.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader
          label="Explore"
          title="Study, build, and contribute"
          description="Everything the institute offers, in one place. Each path leads to a canonical surface of the institution."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {institutePaths.map((path) => (
            <HubCard
              key={path.href}
              href={path.href}
              title={path.title}
              description={path.description}
              status={path.status}
              eyebrow={path.eyebrow}
            />
          ))}
        </div>
      </Section>

      <Section variant="ivory">
        <div className="flex flex-col items-start gap-6 rounded-2xl border border-border bg-bg-raised p-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="editorial-label">Governing Policy</p>
            <h2
              className="editorial-heading"
              style={{
                fontSize: "var(--text-2xl)",
                marginTop: "var(--space-3)",
              }}
            >
              AI ethics is constitutional here
            </h2>
            <p
              style={{
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
                marginTop: "var(--space-3)",
              }}
            >
              The Foundation rejects AI used for surveillance, discrimination,
              deception, exploitation, or harm. The full policy — ten
              principles, prohibited uses, and oversight — is published under
              governance.
            </p>
          </div>
          <Link
            href="/governance/ai-ethics"
            className="btn btn-primary shrink-0"
          >
            Read the AI Ethics Policy
          </Link>
        </div>
      </Section>

      <CTABand
        title="Begin where you are"
        text="Start with the curriculum, or get answers first — both are open to everyone."
        actions={[
          {
            href: "/curriculum",
            label: "View the Curriculum",
            variant: "gold",
          },
          { href: "/faq", label: "Read the FAQ", variant: "secondary" },
        ]}
      />
    </div>
  );
}
