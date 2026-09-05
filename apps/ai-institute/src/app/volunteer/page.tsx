import type { Metadata } from "next";
import Link from "next/link";
import {
  TreePine,
  Brain,
  Landmark,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";

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
    color: "#22c55e",
  },
  {
    id: "knowledge",
    name: "Knowledge Mission",
    slug: "/missions/knowledge",
    text: "Mentor learners, review lessons, contribute research, and help keep public knowledge accurate.",
    icon: Brain,
    color: "#3b82f6",
  },
  {
    id: "heritage",
    name: "Heritage Mission",
    slug: "/missions/heritage",
    text: "Document traditions, architecture, and living heritage alongside the communities that carry them.",
    icon: Landmark,
    color: "#f59e0b",
  },
  {
    id: "community",
    name: "Community Mission",
    slug: "/missions/community",
    text: "Support education programs, events, and local leadership in the communities we serve.",
    icon: HeartHandshake,
    color: "#8b5cf6",
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
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Volunteer with Bhavya
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
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
                className="group block bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: pathway.color + "20" }}
                >
                  <Icon size={28} style={{ color: pathway.color }} />
                </div>
                <h2 className="text-2xl font-bold mb-3">{pathway.name}</h2>
                <p className="text-white/60 leading-relaxed">{pathway.text}</p>
                <div
                  className="mt-6 flex items-center gap-2 text-sm font-semibold"
                  style={{ color: pathway.color }}
                >
                  Learn more
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">
            How volunteering works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div
                key={step.n}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <div className="text-sm font-mono text-white/40 mb-3">
                  Step {step.n}
                </div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed mb-5">
                  {step.text}
                </p>
                <Link
                  href={step.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#c9a227] hover:underline"
                >
                  {step.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
