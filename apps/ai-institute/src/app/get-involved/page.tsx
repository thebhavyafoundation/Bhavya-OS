import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  HeartHandshake,
  Heart,
  Users,
  FlaskConical,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Get Involved — Bhavya Foundation",
  description:
    "Learn, volunteer, donate, research, or join the community. One account, every way to participate.",
};

const paths = [
  {
    id: "learn",
    name: "Learn",
    text: "Browse free courses, lessons, and learning paths. Create an account to track progress and earn credentials.",
    icon: BookOpen,
    color: "#3b82f6",
    href: "/courses",
    cta: "Browse courses",
  },
  {
    id: "volunteer",
    name: "Volunteer",
    text: "Give time and skill to forest, knowledge, heritage, and community missions.",
    icon: HeartHandshake,
    color: "#22c55e",
    href: "/volunteer",
    cta: "Volunteer pathways",
  },
  {
    id: "donate",
    name: "Donate",
    text: "Fund restoration, education, and preservation. Confirmed donations are recorded and receipted by the institution.",
    icon: Heart,
    color: "#c9a227",
    href: "/donate",
    cta: "Donate",
  },
  {
    id: "community",
    name: "Join the community",
    text: "Connect with learners, volunteers, mentors, and researchers across all four missions.",
    icon: Users,
    color: "#8b5cf6",
    href: "/community",
    cta: "Community",
  },
  {
    id: "research",
    name: "Research",
    text: "Contribute to open research, knowledge objects, and evidence-backed institutional learning.",
    icon: FlaskConical,
    color: "#f59e0b",
    href: "/research",
    cta: "Research",
  },
];

export default function GetInvolvedPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Get Involved</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            One account. Every way to participate. Start anywhere — learning,
            volunteering, donating, researching, or simply belonging.
          </p>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {paths.map((path) => {
            const Icon = path.icon;
            return (
              <Link
                key={path.id}
                href={path.href}
                className="group block bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: path.color + "20" }}
                >
                  <Icon size={28} style={{ color: path.color }} />
                </div>
                <h2 className="text-2xl font-bold mb-3">{path.name}</h2>
                <p className="text-white/60 leading-relaxed">{path.text}</p>
                <div
                  className="mt-6 flex items-center gap-2 text-sm font-semibold"
                  style={{ color: path.color }}
                >
                  {path.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <p className="text-white/60 text-sm mb-5">
              New here? Create one Bhavya identity and choose how you want to
              participate — you can hold more than one role.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c9a227] text-[#0a0f0d] text-sm font-semibold hover:bg-[#c9a227]/90 transition-colors"
            >
              Create account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
