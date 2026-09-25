import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { SectionHeader } from "@/components/site/SectionHeader";
import { CTABand } from "@/components/site/CTABand";

export const metadata: Metadata = {
  title: "AI Ethics — Bhavya Foundation",
  description:
    "AI Ethics & Responsible AI Policy (BF-AI-001): ten principles, prohibited uses, human oversight, and governance of AI at Bhavya Foundation.",
};

const policyMeta = [
  { label: "Policy number", value: "BF-AI-001" },
  { label: "Version", value: "1.0" },
  { label: "Status", value: "Founding Edition" },
  { label: "Approved by", value: "Board of Trustees" },
  { label: "Review cycle", value: "Every 2 years" },
];

const principles = [
  {
    title: "Human Dignity",
    description: "AI serves people — never the reverse.",
  },
  {
    title: "Transparency",
    description: "People are told when AI is being used.",
  },
  {
    title: "Fairness",
    description: "Bias is assessed; outcomes are checked for unfairness.",
  },
  {
    title: "Safety",
    description: "Systems are reviewed before they are relied upon.",
  },
  {
    title: "Privacy",
    description: "Data is minimised, purpose-limited, and protected.",
  },
  {
    title: "Accountability",
    description: "A human remains answerable for every decision.",
  },
  {
    title: "Inclusivity",
    description:
      "Access includes first-generation learners and underserved communities.",
  },
  {
    title: "Public Benefit",
    description: "AI work must produce measurable public benefit.",
  },
  {
    title: "Environmental Responsibility",
    description:
      "Efficient computing, long equipment life, responsible e-waste.",
  },
  {
    title: "Continuous Learning",
    description: "Practice and policy are reviewed and improved.",
  },
];

const prohibited = [
  "Deceptive or fraudulent content",
  "Unauthorised impersonation",
  "Unlawful activity",
  "Incitement to hatred or violence",
  "Infringement of intellectual property",
  "Intentional misinformation",
];

export default function AIEthicsPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <PageHero
        label="Governance"
        title="AI Ethics & Responsible AI"
        lead="Artificial intelligence is not merely a technological advancement — it is a societal responsibility. Technology shall always remain accountable to human values."
      />

      <Section variant="cream">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <SectionHeader
              label="The Policy"
              title="AI Ethics & Responsible AI Policy"
            />
            <div className="space-y-3">
              {policyMeta.map((item) => (
                <div
                  key={item.label}
                  className="flex items-baseline justify-between gap-4 rounded-lg border border-border bg-bg-raised px-4 py-3"
                >
                  <span
                    style={{
                      fontSize: "var(--text-xs)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                      textAlign: "right",
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            <p
              style={{
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
                marginTop: "var(--space-6)",
                fontSize: "var(--text-sm)",
              }}
            >
              The Foundation rejects the use of AI for unlawful surveillance,
              discrimination, deception, exploitation, or harm. AI shall assist
              human decision-making rather than replace human responsibility —
              with appropriate human oversight for decisions that affect
              individuals.
            </p>
          </div>
          <div>
            <SectionHeader
              label="Ten Principles"
              title="What the policy requires"
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {principles.map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-border bg-bg-raised p-4"
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-base)",
                      color: "var(--color-text-primary)",
                      marginBottom: "var(--space-1)",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <SectionHeader
              label="Prohibited Uses"
              title="What AI is never used for"
            />
            <ul className="space-y-3">
              {prohibited.map((item) => (
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
              label="Oversight & Governance"
              title="Who watches the AI"
            />
            <p
              style={{
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
                marginBottom: "var(--space-4)",
              }}
            >
              AI outputs are reviewed before being relied upon for significant
              decisions or public communications. Participants are told when AI
              is used as a learning tool or decision-support system. The Board
              may establish an AI Ethics &amp; Technology Committee, and the
              entire policy is reviewed every two years.
            </p>
            <p
              style={{
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
                marginBottom: "var(--space-4)",
              }}
            >
              The policy spans AI education, AI Labs, digital libraries,
              research, community outreach, software development, and internal
              operations — every surface where the Foundation touches AI.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/ai-institute/experiments"
                className="btn btn-secondary"
              >
                AI Labs
              </Link>
              <Link href="/ai-institute" className="btn btn-ghost">
                AI Institute
              </Link>
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
          Source: Artificial Intelligence Ethics &amp; Responsible AI Policy
          (Document 13, BF-AI-001), Articles 1–16; The Constitution (Document
          1), Article 13.5; Code of Ethics (Document 6), Article 10.
        </p>
      </Section>

      <CTABand
        title="Ethics in practice"
        text="See how the policy binds the programmes it governs."
        actions={[
          {
            href: "/ai-institute/experiments",
            label: "AI Labs",
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
