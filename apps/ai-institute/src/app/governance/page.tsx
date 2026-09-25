import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { SectionHeader } from "@/components/site/SectionHeader";
import { HubCard } from "@/components/site/HubCard";
import { CTABand } from "@/components/site/CTABand";

export const metadata: Metadata = {
  title: "Governance — Bhavya Foundation",
  description:
    "How Bhavya Foundation is governed: the Constitution, the Board of Trustees, safeguarding, AI ethics, policies, and transparency.",
};

const governancePaths = [
  {
    href: "/governance/founders",
    title: "The Founder",
    description:
      "The Founder's Charter — stewardship rather than ownership, and the office that carries it.",
    status: "available" as const,
  },
  {
    href: "/governance/board-of-trustees",
    title: "Board of Trustees",
    description:
      "The principal governing body: composition, duties, meetings, and committees.",
    status: "available" as const,
  },
  {
    href: "/mission",
    title: "The Constitution",
    description:
      "The supreme internal governance document — vision, guiding principles, and the permanent commitments.",
    status: "available" as const,
  },
  {
    href: "/governance/safeguarding",
    title: "Safeguarding",
    description:
      "Child Protection & Safeguarding Policy — the first condition of every programme involving young people.",
    status: "available" as const,
  },
  {
    href: "/governance/ai-ethics",
    title: "AI Ethics",
    description:
      "AI Ethics & Responsible AI Policy — ten principles, prohibited uses, and human oversight.",
    status: "available" as const,
  },
  {
    href: "/transparency",
    title: "Policies & Documents",
    description:
      "Governance documents and institutional policies, published with their status.",
    status: "available" as const,
  },
  {
    href: "/transparency",
    title: "Transparency Portal",
    description:
      "Financial disclosures, governance records, project tracking, and releases.",
    status: "available" as const,
  },
];

const authorityChain = [
  "Applicable law",
  "Public Charitable Trust Deed",
  "The Constitution",
  "Governance Manual",
  "Board of Trustees Charter",
  "Policies",
  "Standard operating procedures",
];

export default function GovernancePage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <PageHero
        label="Institutional Governance"
        title="Governance"
        lead="Bhavya Foundation is a public charitable trust governed by a Constitution, a Board of Trustees, and published policies — authority flows downward, accountability flows upward."
      />

      <Section variant="cream">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <SectionHeader label="The Model" title="Govern, not manage" />
            <p
              style={{
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
                marginBottom: "var(--space-4)",
              }}
            >
              The Board of Trustees is the principal governing body. It sets
              direction, safeguards the mission, and holds the institution to
              its Constitution — it does not run day-to-day management. That
              work belongs to the executive structure beneath it.
            </p>
            <p
              style={{
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
              }}
            >
              Every Trustee owes five duties: loyalty, care, integrity,
              stewardship, and a duty to future generations — decisions are
              asked to answer one question: what impact will this have ten years
              from now?
            </p>
          </div>
          <div>
            <SectionHeader
              label="Document Hierarchy"
              title="Which document wins"
              description="When documents disagree, the higher authority prevails."
            />
            <ol className="space-y-3">
              {authorityChain.map((item, index) => (
                <li
                  key={item}
                  className="flex items-center gap-4 rounded-lg border border-border bg-bg-raised px-4 py-3"
                >
                  <span
                    className="text-accent-gold"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-lg)",
                      minWidth: "1.5rem",
                    }}
                  >
                    {index + 1}
                  </span>
                  <span
                    style={{
                      color: "var(--color-text-secondary)",
                      fontSize: "var(--text-sm)",
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader
          label="Explore"
          title="The governance surface"
          description="Where each part of the institution's governance is published."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {governancePaths.map((item) => (
            <HubCard
              key={item.title}
              href={item.href}
              title={item.title}
              description={item.description}
              status={item.status}
            />
          ))}
        </div>
      </Section>

      <Section variant="ivory">
        <div className="max-w-3xl">
          <SectionHeader
            label="Transparency by Default"
            title="Reports that do not exaggerate"
            description="Annual reporting must present activities, outcomes, impact, partnerships, governance, and financial summaries honestly. Published records live in the transparency portal — audited where audited, provisional where provisional."
          />
          <div className="mt-6">
            <Link href="/transparency" className="btn btn-primary">
              Open the Transparency Portal
            </Link>
          </div>
        </div>
      </Section>

      <CTABand
        title="Trust is verified, not asserted"
        text="Read the records, the policies, and the structure for yourself."
        actions={[
          { href: "/transparency", label: "View Records", variant: "gold" },
          { href: "/contact", label: "Ask a Question", variant: "secondary" },
        ]}
      />
    </div>
  );
}
