import type { Metadata } from "next";
import Link from "next/link";
import {
  TreePine,
  Brain,
  Landmark,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Volunteer — Bhavya Foundation",
  description:
    "Contribute your time and skill to forest restoration, knowledge, heritage, and community missions.",
};

const pathways = [
  {
    id: "forest",
    name: "Forest Mission",
    slug: "/missions/forest",
    text: "Plantations, biodiversity surveys, water conservation, and long-term stewardship of restoration sites.",
    icon: TreePine,
    colorToken: "var(--color-accent-green)",
  },
  {
    id: "knowledge",
    name: "Knowledge Mission",
    slug: "/missions/knowledge",
    text: "Mentor learners, review lessons, contribute research, and help keep public knowledge accurate.",
    icon: Brain,
    colorToken: "var(--color-status-info)",
  },
  {
    id: "heritage",
    name: "Heritage Mission",
    slug: "/missions/heritage",
    text: "Document traditions, architecture, and living heritage alongside the communities that carry them.",
    icon: Landmark,
    colorToken: "var(--color-accent-gold)",
  },
  {
    id: "community",
    name: "Community Mission",
    slug: "/missions/community",
    text: "Support education programs, events, and local leadership in the communities we serve.",
    icon: HeartHandshake,
    colorToken: "var(--color-accent-earth)",
  },
];

const steps = [
  {
    n: "1",
    title: "Create one account",
    text: "Register once. One Bhavya identity covers learning, volunteering, and community — never a separate account per role.",
    href: "/register?intent=volunteer",
    cta: "Create account",
  },
  {
    n: "2",
    title: "Choose a mission",
    text: "Explore the four missions and find the work that matches your skill, place, and availability.",
    href: "/missions",
    cta: "Explore missions",
  },
  {
    n: "3",
    title: "Show up and contribute",
    text: "Join mission activities and community programs. Your contributions are recorded in your volunteer workspace.",
    href: "/app/missions",
    cta: "My missions",
  },
];

export default function VolunteerPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <SiteHeader />

      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="editorial-heading"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
              marginBottom: "var(--space-6)",
            }}
          >
            Volunteer with Bhavya
          </h1>
          <p
            className="editorial-lead"
            style={{ maxWidth: "640px", margin: "0 auto" }}
          >
            Give your time and skill to work that outlives trends — forests that
            take decades, knowledge that compounds, heritage that must be
            carried.
          </p>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {pathways.map((pathway) => {
            const Icon = pathway.icon;
            return (
              <Link
                key={pathway.id}
                href={pathway.slug}
                className="group block"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border-primary)",
                  borderRadius: "var(--radius-xl)",
                  padding: "var(--space-8)",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "all var(--duration-normal) var(--ease-out)",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "var(--radius-lg)",
                    background: `color-mix(in srgb, ${pathway.colorToken} 15%, transparent)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "var(--space-6)",
                    color: pathway.colorToken,
                  }}
                >
                  <Icon size={28} />
                </div>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-2xl)",
                    fontWeight: 400,
                    color: "var(--color-text-primary)",
                    marginBottom: "var(--space-3)",
                  }}
                >
                  {pathway.name}
                </h2>
                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  {pathway.text}
                </p>
                <div
                  className="group-hover:translate-x-1"
                  style={{
                    marginTop: "var(--space-6)",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    color: "var(--color-accent-gold)",
                    transition: "transform var(--duration-fast) ease",
                  }}
                >
                  Learn more <ArrowRight size={16} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <h2
            className="editorial-heading"
            style={{
              fontSize: "var(--text-3xl)",
              textAlign: "center",
              marginBottom: "var(--space-10)",
            }}
          >
            How volunteering works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div
                key={step.n}
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border-primary)",
                  borderRadius: "var(--radius-xl)",
                  padding: "var(--space-6)",
                }}
              >
                <div
                  style={{
                    fontSize: "var(--text-sm)",
                    fontFamily: "var(--font-mono)",
                    color: "var(--color-text-muted)",
                    marginBottom: "var(--space-3)",
                  }}
                >
                  Step {step.n}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-lg)",
                    fontWeight: 400,
                    color: "var(--color-text-primary)",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.7,
                    marginBottom: "var(--space-5)",
                  }}
                >
                  {step.text}
                </p>
                <Link
                  href={step.href}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    color: "var(--color-accent-gold)",
                    textDecoration: "none",
                  }}
                >
                  {step.cta}
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
