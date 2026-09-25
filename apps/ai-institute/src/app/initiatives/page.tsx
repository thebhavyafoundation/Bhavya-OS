import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { SectionHeader } from "@/components/site/SectionHeader";
import { HubCard } from "@/components/site/HubCard";
import { CTABand } from "@/components/site/CTABand";

export const metadata: Metadata = {
  title: "Initiatives — Bhavya Foundation",
  description:
    "The institutional portfolio of Bhavya Foundation — missions, programmes, and initiatives, with honest status on each.",
};

const initiativePaths = [
  {
    href: "/ai-institute/experiments",
    title: "AI Labs",
    description:
      "Centres for learning, experimentation, and innovation under the AI Ethics & Responsible AI Policy.",
    status: "in-development" as const,
    eyebrow: "Knowledge",
  },
  {
    href: "/initiatives/school-outreach",
    title: "School Outreach",
    description:
      "Awareness sessions, teacher training, and environmental clubs delivered with school partners.",
    status: "available" as const,
    eyebrow: "Community",
  },
  {
    href: "/initiatives/rural-innovation",
    title: "Rural Innovation",
    description:
      "Rural technology centres and village learning hubs — the constitutional mandate for innovation outside cities.",
    status: "vision" as const,
    eyebrow: "Community",
  },
  {
    href: "/missions/forest",
    title: "Forest Mission",
    description:
      "Ecosystem restoration, water security, biodiversity, and GIS monitoring on the ground.",
    status: "available" as const,
    eyebrow: "Nature",
  },
  {
    href: "/heritage",
    title: "Heritage",
    description:
      "Documentation and preservation of cultural and heritage assets for the generations after us.",
    status: "available" as const,
    eyebrow: "Heritage",
  },
  {
    href: "/library",
    title: "Digital Library",
    description:
      "The Bhavya Digital Library — a flagship institution under the Bhavya Knowledge Mission.",
    status: "available" as const,
    eyebrow: "Knowledge",
  },
  {
    href: "/forest",
    title: "Environment",
    description:
      "Environmental conservation as a constitutional commitment: restoration that outlives any single programme.",
    status: "available" as const,
    eyebrow: "Nature",
  },
  {
    href: "/volunteer",
    title: "Volunteer Corps",
    description:
      "The Bhavya Volunteer Corps — service pathways for people who want to build alongside the missions.",
    status: "available" as const,
    eyebrow: "Service",
  },
  {
    href: "/research",
    title: "Research",
    description:
      "Research across ecology, AI, education, heritage, and rural development — conducted ethically and openly.",
    status: "available" as const,
    eyebrow: "Knowledge",
  },
];

export default function InitiativesPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <PageHero
        label="Institutional Portfolio"
        title="Initiatives"
        lead="Every programme Bhavya Foundation runs or is building toward — one entry point, honest status on each, no initiative presented as more than it is."
      />

      <Section>
        <SectionHeader
          label="All Initiatives"
          title="The portfolio"
          description="Status labels are deliberate: Available means you can engage with it today; In Development means the programme is specified and being delivered; Vision means constitutionally authorised and not yet launched."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {initiativePaths.map((item) => (
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

      <Section variant="ivory">
        <div className="max-w-3xl">
          <SectionHeader
            label="How Status Works"
            title="Nothing here is dressed up"
            description="Programmes are listed exactly where they stand. Where the institution has authorised work but not yet delivered it, the initiative is marked Vision — never counted, dated, or celebrated ahead of the facts."
          />
        </div>
      </Section>

      <CTABand
        title="Find your way in"
        text="Volunteer with a mission, bring a school partnership forward, or support the work directly."
        actions={[
          { href: "/volunteer", label: "Volunteer", variant: "gold" },
          {
            href: "/get-involved",
            label: "Partner With Us",
            variant: "secondary",
          },
          { href: "/donate", label: "Donate", variant: "ghost" },
        ]}
      />
    </div>
  );
}
