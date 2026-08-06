"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProgress } from "@/data/progress";

const stats = [
  { label: "Students", value: "100+", icon: "🎓" },
  { label: "Projects Built", value: "50+", icon: "🚀" },
  { label: "Open Source", value: "100%", icon: "🔓" },
  { label: "AI-First", value: "Always", icon: "🤖" },
];

const steps = [
  {
    num: "01",
    title: "Take the Assessment",
    desc: "5 minutes to understand where you are",
  },
  {
    num: "02",
    title: "Get Your Roadmap",
    desc: "Personalized path based on your goals",
  },
  { num: "03", title: "Start Building", desc: "Real projects from day one" },
  {
    num: "04",
    title: "Earn Credentials",
    desc: "Certificates backed by real work",
  },
];

const features = [
  {
    title: "Learn by Building",
    desc: "Every lesson has a lab. Every concept has a project. No passive consumption.",
    icon: "🔨",
  },
  {
    title: "AI is Your Mentor",
    desc: "24/7 AI guidance. Not a chatbot — a teaching partner that adapts to you.",
    icon: "🤖",
  },
  {
    title: "Open Source First",
    desc: "All curriculum is open. Contribute back. Learn from real repositories.",
    icon: "🌐",
  },
  {
    title: "Real Portfolios",
    desc: "Every project becomes portfolio evidence. Not certificates of attendance — proof of skill.",
    icon: "📁",
  },
];

export default function LandingPage() {
  const [progress, setProgress] = useState<ReturnType<
    typeof getProgress
  > | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border-primary bg-bg-primary/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-bold text-xs">
              AI
            </div>
            <span className="text-sm font-semibold text-text-primary">
              AI Institute
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/knowledge-graph"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors hidden sm:block"
            >
              Knowledge Graph
            </Link>
            <Link
              href="/learning-paths"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors hidden sm:block"
            >
              Learning Paths
            </Link>
            <Link
              href="/playground"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors hidden sm:block"
            >
              Lab
            </Link>
            {progress?.enrolled ? (
              <Link
                href="/dashboard"
                className="px-4 py-1.5 text-sm font-medium bg-accent-blue text-white rounded-md hover:bg-accent-blue-hover transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/assessment"
                className="px-4 py-1.5 text-sm font-medium bg-accent-blue text-white rounded-md hover:bg-accent-blue-hover transition-colors"
              >
                Start Learning
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <p className="text-sm text-accent-blue font-medium mb-4 tracking-wide uppercase">
            Bhavya Foundation
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-6 leading-tight">
            Learn AI by building real things.
          </h1>
          <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
            Not another LMS. Not another video course. A hands-on learning
            experience where you build AI systems from your first lesson.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/assessment"
              className="px-6 py-3 text-base font-semibold bg-accent-blue text-white rounded-lg hover:bg-accent-blue-hover transition-colors"
            >
              Take the Assessment
            </Link>
            <a
              href="#how-it-works"
              className="px-6 py-3 text-base font-medium text-text-secondary border border-border-primary rounded-lg hover:border-border-secondary hover:text-text-primary transition-colors"
            >
              How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border-primary bg-bg-secondary/50">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl font-bold text-text-primary">
                {s.value}
              </div>
              <div className="text-xs text-text-tertiary">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-12">
            Your journey in 4 steps
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="flex gap-4 animate-fade-in">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent-blue/10 text-accent-blue font-bold text-sm flex items-center justify-center">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-text-primary mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-secondary">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-12">
            Why this is different
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 border border-border-primary rounded-lg bg-bg-secondary animate-fade-in"
              >
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="text-base font-semibold text-text-primary mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Knowledge Graph Preview */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-4">
            The Complete AI Knowledge Graph
          </h2>
          <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">
            Every concept in AI, connected. From "What is AI?" to multi-agent
            systems. Click any node to explore.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Concepts", value: "30+", icon: "🧠" },
              { label: "Learning Paths", value: "8", icon: "🎯" },
              { label: "Projects", value: "15+", icon: "🔨" },
              { label: "Certifications", value: "8", icon: "🏆" },
            ].map((s) => (
              <div
                key={s.label}
                className="text-center p-4 border border-border-primary rounded-lg bg-bg-secondary"
              >
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-xl font-bold text-text-primary">
                  {s.value}
                </div>
                <div className="text-xs text-text-tertiary">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4">
            <Link
              href="/knowledge-graph"
              className="px-6 py-3 text-base font-semibold border border-border-primary rounded-lg text-text-primary hover:border-accent-blue hover:text-accent-blue transition-colors"
            >
              Explore Knowledge Graph →
            </Link>
            <Link
              href="/learning-paths"
              className="px-6 py-3 text-base font-semibold border border-border-primary rounded-lg text-text-primary hover:border-accent-blue hover:text-accent-blue transition-colors"
            >
              View Learning Paths →
            </Link>
            <Link
              href="/playground"
              className="px-6 py-3 text-base font-semibold bg-accent-blue text-white rounded-lg hover:bg-accent-blue-hover transition-colors"
            >
              Open AI Lab →
            </Link>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-text-secondary leading-relaxed mb-6">
            Transform someone with curiosity into someone who can build real AI
            systems, contribute to open source, and eventually teach others.
          </p>
          <p className="text-sm text-text-tertiary">
            Everything else is secondary.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-bg-secondary/30 border-t border-border-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Ready to build?
          </h2>
          <p className="text-text-secondary mb-8">
            5-minute assessment. Personalized roadmap. Start building today.
          </p>
          <Link
            href="/assessment"
            className="inline-block px-8 py-3 text-base font-semibold bg-accent-blue text-white rounded-lg hover:bg-accent-blue-hover transition-colors"
          >
            Start Your Journey
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border-primary text-center">
        <p className="text-xs text-text-muted">
          AI Institute — Bhavya Foundation — Learn AI by building
        </p>
      </footer>
    </div>
  );
}
