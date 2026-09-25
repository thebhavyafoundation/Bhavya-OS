import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { SectionHeader } from "@/components/site/SectionHeader";
import { CTABand } from "@/components/site/CTABand";

export const metadata: Metadata = {
  title: "Safeguarding — Bhavya Foundation",
  description:
    "Child Protection & Safeguarding Policy (BF-SAFE-001): commitments, zero-tolerance standards, and reporting duties.",
};

const policyMeta = [
  { label: "Policy number", value: "BF-SAFE-001" },
  { label: "Version", value: "1.0" },
  { label: "Status", value: "Founding Edition" },
  { label: "Approved by", value: "Board of Trustees" },
  { label: "Review cycle", value: "Annually" },
];

const principles = [
  "Every child is respected.",
  "Every child is protected.",
  "Every child is heard.",
  "Every child is treated fairly.",
  "Every child is free from violence, exploitation, and discrimination.",
  "Every child is safe.",
];

const zeroTolerance = [
  "Physical, sexual, emotional, or psychological abuse",
  "Neglect, bullying, and harassment",
  "Child labour and exploitation",
  "Online grooming and inappropriate communication",
  "Retaliation against a child who raises a concern",
];

export default function SafeguardingPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <PageHero
        label="Governance"
        title="Safeguarding"
        lead="No programme objective, institutional reputation, or individual relationship shall ever take precedence over the safety and dignity of a child."
      />

      <Section variant="cream">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <SectionHeader
              label="The Policy"
              title="Child Protection & Safeguarding"
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
          </div>
          <div>
            <SectionHeader
              label="Guiding Principles"
              title="Six commitments to every child"
              description="Every Trustee, employee, volunteer, consultant, trainer, and partner must place the welfare of children above all other interests."
            />
            <ul className="space-y-3">
              {principles.map((item) => (
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
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <SectionHeader
              label="Zero Tolerance"
              title="What is never permitted"
            />
            <ul className="space-y-3">
              {zeroTolerance.map((item) => (
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
              label="Scope & Reporting"
              title="Where it applies, how it works"
            />
            <p
              style={{
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
                marginBottom: "var(--space-4)",
              }}
            >
              The policy covers Trustees, employees, volunteers, trainers,
              mentors, consultants, contractors, and school partners — across
              school awareness sessions, AI Labs, digital library programmes,
              plantation drives, heritage walks, competitions, camps, and online
              programmes.
            </p>
            <p
              style={{
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
                marginBottom: "var(--space-4)",
              }}
            >
              Concerns are reported immediately to the designated safeguarding
              lead with facts, dates, and actions taken — confidentiality is
              maintained, retaliation is prohibited, and the Board reviews
              safeguarding arrangements annually.
            </p>
            <p
              style={{
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
                fontStyle: "italic",
                marginBottom: "var(--space-4)",
              }}
            >
              &ldquo;The measure of our success is not only the number of
              children we reach, but the confidence with which every parent,
              teacher, and child knows they are safe in our care.&rdquo;
            </p>
            <Link href="/contact" className="btn btn-secondary">
              Report a Concern
            </Link>
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
          Source: Child Protection &amp; Safeguarding Policy (Document 11,
          BF-SAFE-001), Preamble and Articles 2–16; The Constitution (Document
          1), Part VII; Code of Ethics (Document 6), Article 8.
        </p>
      </Section>

      <CTABand
        title="Safety is everyone's duty"
        text="Read the full governance structure, or get in touch with a concern."
        actions={[
          {
            href: "/governance",
            label: "Governance Overview",
            variant: "gold",
          },
          { href: "/contact", label: "Contact", variant: "secondary" },
        ]}
      />
    </div>
  );
}
