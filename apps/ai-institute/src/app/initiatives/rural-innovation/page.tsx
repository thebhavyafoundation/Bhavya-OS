import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { SectionHeader } from "@/components/site/SectionHeader";
import { StatusLabel } from "@/components/site/StatusLabel";
import { CTABand } from "@/components/site/CTABand";

export const metadata: Metadata = {
  title: "Rural Innovation — Bhavya Foundation",
  description:
    "Bhavya Rural Innovation Centre — rural technology centres, village learning hubs, and AI education beyond the cities. Constitutionally authorised, in vision.",
};

const commitments = [
  {
    title: "Rural technology centres",
    description:
      "A constitutional Knowledge-pillar activity and an object of the Trust: technology centres that serve communities outside major cities.",
  },
  {
    title: "Village learning hubs",
    description:
      "Under the Digital Library Policy, delivery includes village learning hubs and mobile libraries — knowledge that travels to where people are.",
  },
  {
    title: "AI for rural communities",
    description:
      "The AI education mandate exists to make AI education accessible to rural and underserved communities, with digital inclusion for first-generation learners.",
  },
  {
    title: "Priority for rural youth",
    description:
      "The Digital Library Policy names rural youth among priority-access groups, alongside students, job seekers, women, and persons with disabilities.",
  },
  {
    title: "Agriculture & livelihoods",
    description:
      "Agricultural resources and entrepreneurship material sit in the library's collections; AI for agriculture is part of the education curriculum.",
  },
  {
    title: "Vision 2040",
    description:
      "A Bhavya Knowledge Network of community centres across rural and urban India — each combining digital library, AI lab, computer education, and innovation space.",
  },
];

export default function RuralInnovationPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <PageHero
        label="Community Initiative"
        title="Rural Innovation"
        lead="The Bhavya Rural Innovation Centre is constitutionally authorised: innovation capacity, digital access, and AI education rooted in rural communities — built to stay."
      >
        <div className="mt-6 flex justify-center">
          <StatusLabel status="vision" />
        </div>
      </PageHero>

      <Section variant="cream">
        <SectionHeader
          label="The Mandate"
          title="What is authorised"
          description="Rural innovation is named in the Constitution, the Trust Deed, the AI Ethics policy, and the Digital Library Policy. These are commitments on paper — the page below says exactly what they mean."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {commitments.map((item) => (
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
        <div className="max-w-3xl">
          <SectionHeader
            label="Status"
            title="Vision — authorised, not yet launched"
            description="No villages, centres, dates, or participant numbers are claimed here, because none have been established yet. When the first centre opens, this page will carry the facts — where it is, what it runs, and how to join."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/initiatives" className="btn btn-secondary">
              All Initiatives
            </Link>
            <Link href="/library" className="btn btn-ghost">
              Bhavya Digital Library
            </Link>
          </div>
        </div>
      </Section>

      <CTABand
        title="Build this with us"
        text="Rural innovation needs educators, engineers, volunteers, and partners willing to work on the ground."
        actions={[
          { href: "/volunteer", label: "Volunteer", variant: "gold" },
          { href: "/get-involved", label: "Partner", variant: "secondary" },
        ]}
      />
    </div>
  );
}
