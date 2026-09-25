import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { SectionHeader } from "@/components/site/SectionHeader";
import { HubCard } from "@/components/site/HubCard";
import { CTABand } from "@/components/site/CTABand";

export const metadata: Metadata = {
  title: "Support — Bhavya Foundation",
  description:
    "Every way to support Bhavya Foundation — donate, volunteer, partner, or get help. One page, honest pathways.",
};

const pathways = [
  {
    href: "/donate",
    title: "Donate",
    description:
      "Contributions fund native tree planting, AI education, heritage documentation, and community work — described plainly on the donate page.",
    status: "available" as const,
    eyebrow: "Give",
  },
  {
    href: "/volunteer",
    title: "Volunteer",
    description:
      "Join the Bhavya Volunteer Corps and work alongside the missions — service pathways for time, not just money.",
    status: "available" as const,
    eyebrow: "Give Time",
  },
  {
    href: "/get-involved",
    title: "Partner",
    description:
      "Institutions, schools, and organisations can partner with the Foundation through the involvement pathways.",
    status: "available" as const,
    eyebrow: "Collaborate",
  },
  {
    href: "/initiatives",
    title: "Sponsor an Initiative",
    description:
      "See the full portfolio — with status on each initiative — before deciding where support matters most.",
    status: "available" as const,
    eyebrow: "Direct",
  },
  {
    href: "/faq",
    title: "Get Help",
    description:
      "Questions about programmes, access, and participation — answered in the Help Center.",
    status: "available" as const,
    eyebrow: "Help",
  },
  {
    href: "/contact",
    title: "Talk to a Person",
    description:
      "General, partnership, and press contacts — reach the right desk directly.",
    status: "available" as const,
    eyebrow: "Contact",
  },
];

const contactRoutes = [
  {
    label: "General inquiries",
    email: "info@bhavyafoundation.org",
  },
  {
    label: "Partnerships",
    email: "partnerships@bhavyafoundation.org",
  },
  {
    label: "Press",
    email: "press@bhavyafoundation.org",
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <PageHero
        label="Support Bhavya Foundation"
        title="Ways to support"
        lead="Money, time, partnership, or a simple question — every pathway to support the Foundation's work, in one place."
      />

      <Section>
        <SectionHeader
          label="Pathways"
          title="Choose how you help"
          description="Each pathway leads to a canonical page with the full details — nothing on this page is a form in disguise."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pathways.map((item) => (
            <HubCard
              key={item.href + item.title}
              href={item.href}
              title={item.title}
              description={item.description}
              status={item.status}
              eyebrow={item.eyebrow}
            />
          ))}
        </div>
      </Section>

      <Section variant="cream">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <SectionHeader
              label="Direct Contact"
              title="Reach the right desk"
              description="The full contact page carries addresses, context, and what to expect."
            />
            <div className="space-y-3">
              {contactRoutes.map((item) => (
                <a
                  key={item.email}
                  href={`mailto:${item.email}`}
                  className="flex items-baseline justify-between gap-4 rounded-lg border border-border bg-bg-raised px-4 py-3 transition-colors hover:border-accent-gold/30"
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
                    {item.email}
                  </span>
                </a>
              ))}
            </div>
          </div>
          <div>
            <SectionHeader
              label="Before You Give"
              title="Read the record first"
            />
            <p
              style={{
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
                marginBottom: "var(--space-4)",
              }}
            >
              The transparency portal publishes governance documents, policies,
              and financial disclosures — audited where audited, provisional
              where provisional. Support decisions deserve evidence, and the
              institution publishes its own.
            </p>
            <p
              style={{
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
                marginBottom: "var(--space-4)",
              }}
            >
              Reports are presented honestly and do not exaggerate achievements
              — that is a constitutional rule, not a marketing preference.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/transparency" className="btn btn-secondary">
                Transparency Portal
              </Link>
              <Link href="/missions" className="btn btn-ghost">
                The Missions
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <CTABand
        title="Every form of support compounds"
        text="Forests, knowledge, heritage, and communities — built over decades, not quarters."
        actions={[
          { href: "/donate", label: "Donate", variant: "gold" },
          { href: "/volunteer", label: "Volunteer", variant: "secondary" },
          { href: "/contact", label: "Contact", variant: "ghost" },
        ]}
      />
    </div>
  );
}
