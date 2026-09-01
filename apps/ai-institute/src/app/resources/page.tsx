import type { Metadata } from "next";
import { BookOpen, FileText, Video, Code } from "lucide-react";

export const metadata: Metadata = {
  title: "Resources — Bhavya Foundation",
  description:
    "Field notes, playbooks, and research from Bhavya Foundation — making AI more useful, accessible, and human.",
};

const resources = [
  {
    icon: BookOpen,
    category: "Field Notes",
    title: "AI in Rural Education",
    description:
      "Planned: Lessons from deploying AI tools in rural Indian schools. Content pending real deployment activity.",
    tag: "Education",
    status: "planned" as const,
  },
  {
    icon: FileText,
    category: "Playbook",
    title: "Community-Led Conservation",
    description:
      "Planned: A practical guide to building community stewardship for forest restoration projects.",
    tag: "Conservation",
    status: "planned" as const,
  },
  {
    icon: Video,
    category: "Research",
    title: "Heritage Documentation Methods",
    description:
      "Planned: Digital preservation techniques for cultural heritage sites using AI-assisted documentation.",
    tag: "Heritage",
    status: "planned" as const,
  },
  {
    icon: Code,
    category: "Open Source",
    title: "Knowledge Object Specification",
    description:
      "The KO specification for structured educational content. Open standard for AI-ready learning materials.",
    tag: "Platform",
    status: "available" as const,
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-accent-gold uppercase tracking-wider mb-3">
            Resources
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold text-text-primary mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Field Notes &amp; Playbooks
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Practical knowledge from Bhavya Foundation&apos;s work across
            education, conservation, and heritage. Content is generated from
            real institutional activity — not speculative claims.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((resource) => (
            <div
              key={resource.title}
              className="rounded-xl border border-border bg-bg-raised p-6 hover:border-accent-gold/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-forest/10">
                  <resource.icon size={20} className="text-forest" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-accent-gold uppercase tracking-wider">
                      {resource.category}
                    </span>
                    <span className="text-xs text-text-secondary">·</span>
                    <span className="text-xs text-text-secondary">
                      {resource.tag}
                    </span>
                    {resource.status === "planned" && (
                      <span className="text-xs text-text-secondary italic ml-auto">
                        Planned
                      </span>
                    )}
                  </div>
                  <h3
                    className="text-lg font-semibold text-text-primary mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {resource.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {resource.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-text-secondary">
            Resources are published as real institutional activity produces
            verifiable content. No speculative claims.
          </p>
        </div>
      </section>
    </div>
  );
}
