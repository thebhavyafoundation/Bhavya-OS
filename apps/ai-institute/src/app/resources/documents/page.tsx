import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { SectionHeader } from "@/components/site/SectionHeader";
import { HubCard } from "@/components/site/HubCard";
import { CTABand } from "@/components/site/CTABand";

export const metadata: Metadata = {
  title: "Documents — Bhavya Foundation",
  description:
    "Official institutional documents of Bhavya Foundation — the Constitution, charters, policies, and legal pages, each with its canonical location.",
};

const documents = [
  {
    href: "/mission",
    title: "The Constitution",
    description:
      "The supreme internal governance document — vision, mission, guiding principles, and permanent commitments. Founder's Edition.",
    status: "available" as const,
    eyebrow: "Governing",
  },
  {
    href: "/governance/founders",
    title: "The Founder's Charter",
    description:
      "Document 3 — the office of Founder defined as stewardship, with its guiding questions and permanent limits.",
    status: "available" as const,
    eyebrow: "Governing",
  },
  {
    href: "/governance/board-of-trustees",
    title: "Board of Trustees Charter",
    description:
      "Document 4 — composition, duties, meetings, committees, and the oath of a Trustee.",
    status: "available" as const,
    eyebrow: "Governing",
  },
  {
    href: "/governance/safeguarding",
    title: "Child Protection & Safeguarding Policy",
    description:
      "BF-SAFE-001 — commitments, zero-tolerance standards, scope, and reporting duties. Founding Edition, reviewed annually.",
    status: "available" as const,
    eyebrow: "Policy",
  },
  {
    href: "/governance/ai-ethics",
    title: "AI Ethics & Responsible AI Policy",
    description:
      "BF-AI-001 — ten principles, prohibited uses, human oversight, and governance. Founding Edition, reviewed every two years.",
    status: "available" as const,
    eyebrow: "Policy",
  },
  {
    href: "/transparency",
    title: "Trust Deed & Policy Library",
    description:
      "The Public Charitable Trust Deed, governance documents, and institutional policies — published with status in the transparency portal.",
    status: "available" as const,
    eyebrow: "Registry",
  },
  {
    href: "/privacy",
    title: "Privacy Policy",
    description:
      "How personal data is collected, handled, and protected across the Foundation's digital surfaces.",
    status: "available" as const,
    eyebrow: "Legal",
  },
  {
    href: "/terms",
    title: "Terms of Service",
    description:
      "The terms governing use of Bhavya Foundation's websites and services.",
    status: "available" as const,
    eyebrow: "Legal",
  },
  {
    href: "/accessibility",
    title: "Accessibility Statement",
    description:
      "The Foundation's commitment to WCAG AA conformance for public-facing digital properties.",
    status: "available" as const,
    eyebrow: "Legal",
  },
];

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <PageHero
        label="Resources"
        title="Documents"
        lead="The institutional documents that govern Bhavya Foundation — where each one lives, and what it is."
      />

      <Section>
        <SectionHeader
          label="The Library"
          title="Official documents"
          description="Every entry links to its canonical page. Governance records and financial disclosures are published in the transparency portal."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((item) => (
            <HubCard
              key={item.title}
              href={item.href}
              title={item.title}
              description={item.description}
              status={item.status}
              eyebrow={item.eyebrow}
            />
          ))}
        </div>
      </Section>

      <CTABand
        title="Governance is a public record"
        text="Financials, project tracking, and releases sit alongside the documents in the transparency portal."
        actions={[
          {
            href: "/transparency",
            label: "Transparency Portal",
            variant: "gold",
          },
          { href: "/governance", label: "Governance", variant: "secondary" },
        ]}
      />
    </div>
  );
}
