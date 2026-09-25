import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { SectionHeader } from "@/components/site/SectionHeader";
import { HubCard } from "@/components/site/HubCard";
import { CTABand } from "@/components/site/CTABand";

export const metadata: Metadata = {
  title: "For Teachers — Bhavya Foundation",
  description:
    "What Bhavya Foundation offers teachers: curriculum access, environmental education training, digital library membership, and school partnerships.",
};

const commitments = [
  {
    title: "Teacher development",
    description:
      "Teacher development is a constitutional activity of the Knowledge pillar — written into the mandate, not added as an afterthought.",
  },
  {
    title: "Environmental education training",
    description:
      "Teacher training accompanies school awareness sessions, biodiversity work, and environmental clubs under the Environmental Conservation Policy.",
  },
  {
    title: "Digital library membership",
    description:
      "Teachers are named members of the Bhavya Digital Library, with priority access designated alongside students, rural youth, and persons with disabilities.",
  },
  {
    title: "Open curriculum",
    description:
      "The Bhavya Academy curriculum is open-source and freely available to educators and students — use it, adapt it, teach from it.",
  },
];

const pathways = [
  {
    href: "/curriculum",
    title: "Teach from the curriculum",
    description:
      "Thirteen levels of AI mastery, from foundations to institution building — open for classroom use.",
    status: "available" as const,
  },
  {
    href: "/initiatives/school-outreach",
    title: "Bring outreach to your school",
    description:
      "Awareness sessions, teacher training, and environmental clubs — delivered under written school approval.",
    status: "available" as const,
  },
  {
    href: "/library",
    title: "Digital library access",
    description:
      "Membership open to teachers, with priority access for the groups the policy names.",
    status: "available" as const,
  },
  {
    href: "/governance/safeguarding",
    title: "Safeguarding standards",
    description:
      "Every programme involving young people runs under the Child Protection & Safeguarding Policy.",
    status: "available" as const,
  },
  {
    href: "/get-involved",
    title: "Partner with us",
    description:
      "Schools and educators can open a partnership conversation through the involvement pathways.",
    status: "available" as const,
  },
  {
    href: "/contact",
    title: "Ask the team",
    description:
      "Questions about training, resources, or school programmes — reach the team directly.",
    status: "available" as const,
  },
];

export default function TeachersPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <PageHero
        label="For Educators"
        title="For Teachers"
        lead="Teachers carry the Knowledge pillar into classrooms. Here is what the Foundation commits to educators — and where to start."
      />

      <Section variant="cream">
        <SectionHeader
          label="Commitments"
          title="What the institution owes teachers"
          description="Drawn from the Constitution, the environmental and digital library policies, and the open curriculum — each commitment cites its source."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
        <p
          style={{
            color: "var(--color-text-secondary)",
            lineHeight: 1.7,
            marginTop: "var(--space-8)",
            fontSize: "var(--text-sm)",
          }}
        >
          Source: The Constitution (Document 1), Article 13.4; Environmental
          Conservation Policy (Document 12), Article 9; Digital Library Policy
          (Document 14), Articles 7–8; Child Protection &amp; Safeguarding
          Policy (Document 11), Article 11.
        </p>
      </Section>

      <Section>
        <SectionHeader
          label="Start Here"
          title="Practical pathways"
          description="Everything a teacher can do with the Foundation today."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pathways.map((item) => (
            <HubCard
              key={item.href + item.title}
              href={item.href}
              title={item.title}
              description={item.description}
              status={item.status}
            />
          ))}
        </div>
      </Section>

      <CTABand
        title="Bring it into your classroom"
        text="Start with the open curriculum, or talk to us about your school."
        actions={[
          {
            href: "/curriculum",
            label: "View the Curriculum",
            variant: "gold",
          },
          { href: "/contact", label: "Contact Us", variant: "secondary" },
        ]}
      />
    </div>
  );
}
