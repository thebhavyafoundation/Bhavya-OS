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
      "Lessons from deploying AI tools in rural Indian schools. What works, what doesn't, and what we learned.",
    tag: "Education",
  },
  {
    icon: FileText,
    category: "Playbook",
    title: "Community-Led Conservation",
    description:
      "A practical guide to building community stewardship for forest restoration projects.",
    tag: "Conservation",
  },
  {
    icon: Video,
    category: "Research",
    title: "Heritage Documentation Methods",
    description:
      "Digital preservation techniques for cultural heritage sites using AI-assisted documentation.",
    tag: "Heritage",
  },
  {
    icon: Code,
    category: "Open Source",
    title: "Knowledge Object Specification",
    description:
      "The KO specification for structured educational content. Open standard for AI-ready learning materials.",
    tag: "Platform",
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-accent-gold uppercase tracking-wider mb-3">
            Bhavya AI Lab
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Resources for a more capable future
          </h1>
          <p className="text-base text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Field notes, playbooks, and research — making AI more useful,
            accessible, and human.
          </p>
        </div>

        <div className="glass-gold rounded-xl p-8 mb-16 text-center">
          <p className="text-xs font-semibold text-accent-gold uppercase tracking-wider mb-2">
            Our Point of View
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">
            AI should widen the circle of who gets to make.
          </h2>
          <p className="text-sm text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Bhavya AI Lab is a public-interest studio for learning,
            experimentation, and responsible technology. We translate complexity
            into confidence — for classrooms, communities, and the curious.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {resources.map((r) => (
            <div key={r.title} className="glass rounded-lg p-5 flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-accent-gold/10 flex items-center justify-center shrink-0">
                <r.icon className="w-4.5 h-4.5 text-accent-gold" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold text-accent-gold uppercase tracking-wider">
                    {r.category}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-bg-tertiary text-text-muted border border-border-primary">
                    {r.tag}
                  </span>
                </div>
                <div className="text-sm font-semibold text-text-primary mb-0.5">
                  {r.title}
                </div>
                <div className="text-xs text-text-tertiary leading-relaxed">
                  {r.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-2">
            Stay curious
          </p>
          <h2 className="text-lg font-bold text-text-primary mb-4">
            Bring a better question.
          </h2>
          <a
            href="mailto:hello@bhavya.foundation"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent-gold text-text-inverse font-semibold text-sm hover:bg-accent-gold-hover transition-colors"
          >
            Join the lab
          </a>
        </div>
      </section>
    </div>
  );
}
