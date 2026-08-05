"use client";

import { useGsapStagger } from "../lib/animations";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Code,
  Clock,
  BarChart3,
} from "lucide-react";

const packages = [
  {
    id: "kp-002",
    title: "Operating System Navigation",
    description:
      "Master the desktop interface, window management, system settings, Task Manager, and essential keyboard shortcuts. Your first step to digital confidence.",
    grade: 9,
    subject: "Digital Literacy",
    difficulty: "Beginner",
    concepts: 5,
    duration: "2h",
    color: "var(--forest-600)",
    icon: <BookOpen size={20} />,
    link: "/knowledge/packages#kp-002",
  },
  {
    id: "kp-003",
    title: "File Management",
    description:
      "Organize files and folders using a hierarchical file system with proper naming conventions. Build the foundation for productive computing.",
    grade: 9,
    subject: "Digital Literacy",
    difficulty: "Beginner",
    concepts: 5,
    duration: "2h",
    color: "var(--earth-600)",
    icon: <Code size={20} />,
    link: "/knowledge/packages#kp-003",
  },
  {
    id: "kp-004",
    title: "Software Installation",
    description:
      "Install, configure, and maintain software safely. Learn about software types, safe downloads, updates, and proper uninstallation.",
    grade: 9,
    subject: "Digital Literacy",
    difficulty: "Beginner",
    concepts: 5,
    duration: "2h",
    color: "var(--gold-600)",
    icon: <Brain size={20} />,
    link: "/knowledge/packages#kp-004",
  },
];

export function KnowledgePackages() {
  const containerRef = useGsapStagger(packages.length);

  return (
    <section className="container" id="packages" aria-labelledby="kp-heading">
      <div className="section-group">
        <p className="section-eyebrow">Featured Knowledge Packages</p>
        <h2 className="section-title">Start Learning Today</h2>
        <p className="section-desc">
          Free, structured, and designed for Grade 9 students. Each Knowledge
          Package is a complete learning unit — concepts, definitions,
          exercises, and assessments.
        </p>
      </div>
      <div className="grid-3" ref={containerRef}>
        {packages.map((pkg) => (
          <a
            key={pkg.id}
            href={pkg.link}
            className="card"
            style={{
              textDecoration: "none",
              color: "inherit",
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "var(--radius-md)",
                background: "var(--primary-subtle)",
                border: "1px solid rgba(21, 128, 61, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: pkg.color,
                marginBottom: "var(--space-5)",
              }}
            >
              {pkg.icon}
            </div>
            <div className="stat-eyebrow">
              {pkg.id.toUpperCase()} · GRADE {pkg.grade}
            </div>
            <h3
              style={{
                fontSize: "var(--text-xl)",
                fontWeight: 700,
                color: pkg.color,
                letterSpacing: "-0.02em",
                marginBottom: "var(--space-3)",
              }}
            >
              {pkg.title}
            </h3>
            <p className="stat-description">{pkg.description}</p>
            <div
              style={{
                display: "flex",
                gap: "var(--space-4)",
                marginTop: "var(--space-4)",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-tertiary)",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <BarChart3 size={12} /> {pkg.concepts} concepts
              </span>
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-tertiary)",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Clock size={12} /> {pkg.duration}
              </span>
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  fontFamily: "var(--font-mono)",
                  color: "var(--primary)",
                  background: "var(--primary-subtle)",
                  padding: "2px 8px",
                  borderRadius: "var(--radius-full)",
                  fontWeight: 600,
                }}
              >
                {pkg.difficulty}
              </span>
            </div>
            <span
              className="stat-link"
              style={{
                color: pkg.color,
                marginTop: "var(--space-4)",
                display: "inline-flex",
              }}
            >
              Start Learning
              <ArrowRight size={14} aria-hidden="true" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
