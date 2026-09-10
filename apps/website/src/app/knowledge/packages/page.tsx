import type { Metadata } from "next";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { PageHero, SectionHeader } from "../../../components/ui/PageHero";
import { buildMetadata } from "../../../lib/metadata";
import { PageContent } from "../../../components/PageContent";
import {
  BookOpen,
  Code,
  Brain,
  Clock,
  BarChart3,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Knowledge Packages — Free AI Education — Bhavya Foundation",
  description:
    "Free, structured Knowledge Packages for Grade 9 students. OS Navigation, File Management, Software Installation — complete learning units with concepts, exercises, and assessments.",
  path: "/knowledge/packages",
});

const packages = [
  {
    id: "kp-002",
    title: "Operating System Navigation",
    description:
      "A comprehensive guide to navigating desktop operating systems. Covers the desktop interface, window management, system settings, Task Manager, and essential keyboard shortcuts.",
    grade: 9,
    subject: "Digital Literacy",
    difficulty: "Beginner",
    concepts: 5,
    duration: "2h",
    color: "var(--forest-600)",
    icon: <BookOpen size={20} />,
    learningOutcomes: [
      "Identify desktop interface elements (taskbar, start menu, icons)",
      "Manage windows efficiently (move, resize, switch, snap)",
      "Configure display, sound, network, and privacy settings",
      "Use Task Manager to monitor and manage processes",
      "Apply essential keyboard shortcuts for productivity",
    ],
    conceptsList: [
      "Desktop Interface",
      "Window Management",
      "System Settings",
      "Task Manager",
      "Keyboard Shortcuts",
    ],
  },
  {
    id: "kp-003",
    title: "File Management",
    description:
      "A comprehensive knowledge package on organizing files and folders using a hierarchical file system with proper naming conventions. Covers file systems, naming standards, folder organization, file operations, and storage management.",
    grade: 9,
    subject: "Digital Literacy",
    difficulty: "Beginner",
    concepts: 5,
    duration: "2h",
    color: "var(--earth-600)",
    icon: <Code size={20} />,
    learningOutcomes: [
      "Understand hierarchical file systems and directory structures",
      "Apply consistent file naming conventions",
      "Create logical folder structures for organization",
      "Perform file operations (copy, move, rename, delete)",
      "Manage storage and implement backup strategies",
    ],
    conceptsList: [
      "File System",
      "File Naming Conventions",
      "Folder Organization",
      "File Operations",
      "Storage Management",
    ],
  },
  {
    id: "kp-004",
    title: "Software Installation",
    description:
      "A comprehensive guide to installing, configuring, and maintaining software on desktop operating systems. Covers software types, safe download practices, post-installation configuration, updates, and proper uninstallation.",
    grade: 9,
    subject: "Digital Literacy",
    difficulty: "Beginner",
    concepts: 5,
    duration: "2h",
    color: "var(--gold-600)",
    icon: <Brain size={20} />,
    learningOutcomes: [
      "Distinguish between system software and application software",
      "Download software safely from official sources",
      "Configure application preferences after installation",
      "Keep software current through updates and patches",
      "Properly uninstall software and clean up residual files",
    ],
    conceptsList: [
      "Software Types",
      "Installation Methods",
      "Software Configuration",
      "Updates and Patches",
      "Uninstallation",
    ],
  },
];

export default function KnowledgePackagesPage() {
  return (
    <>
      <Header currentPath="/knowledge" />
      <main id="main-content">
        <PageHero
          badge="KNOWLEDGE PACKAGES"
          title="Free AI Education for Rural India"
          lead="Structured learning units designed for Grade 9 students. Each Knowledge Package includes concepts, definitions, exercises, assessments, and a portfolio project — completely free."
        />
        <div className="container">
          <div style={{ marginTop: "var(--space-12)" }}>
            <PageContent>
              <SectionHeader
                eyebrow="Digital Foundations"
                title="Start Your Learning Journey"
                description="Three Knowledge Packages covering the fundamentals of digital literacy. Each package is a complete learning unit — 2 hours, 5 concepts, hands-on exercises."
              />
            </PageContent>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-8)",
              marginTop: "var(--space-8)",
            }}
          >
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                id={pkg.id}
                className="card"
                style={{
                  textAlign: "left",
                  scrollMarginTop: "var(--header-h)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "var(--space-6)",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "var(--radius-md)",
                      background: "var(--primary-subtle)",
                      border: "1px solid rgba(21, 128, 61, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: pkg.color,
                      flexShrink: 0,
                    }}
                  >
                    {pkg.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 280 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-2)",
                        marginBottom: "var(--space-2)",
                      }}
                    >
                      <span className="stat-eyebrow">
                        {pkg.id.toUpperCase()} · GRADE {pkg.grade} · {pkg.subject}
                      </span>
                      <span
                        style={{
                          fontSize: "var(--text-xs)",
                          fontFamily: "var(--font-mono)",
                          color: "var(--color-text-muted, #999)",
                          background: "var(--surface-2, #f0f0ea)",
                          padding: "2px 8px",
                          borderRadius: "var(--radius-full, 9999px)",
                          fontWeight: 600,
                        }}
                      >
                        Planned
                      </span>
                    </div>
                    <h2
                      style={{
                        fontSize: "var(--text-2xl)",
                        fontWeight: 700,
                        color: pkg.color,
                        letterSpacing: "-0.02em",
                        marginBottom: "var(--space-3)",
                      }}
                    >
                      {pkg.title}
                    </h2>
                    <p
                      style={{
                        fontSize: "var(--text-base)",
                        color: "var(--text-secondary)",
                        lineHeight: 1.7,
                        marginBottom: "var(--space-4)",
                      }}
                    >
                      {pkg.description}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "var(--space-4)",
                        flexWrap: "wrap",
                        marginBottom: "var(--space-5)",
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

                    <div style={{ marginBottom: "var(--space-4)" }}>
                      <h3
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: 700,
                          color: "var(--text)",
                          marginBottom: "var(--space-3)",
                        }}
                      >
                        Learning Outcomes
                      </h3>
                      <ul
                        style={{
                          listStyle: "none",
                          padding: 0,
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--space-2)",
                        }}
                      >
                        {pkg.learningOutcomes.map((outcome, i) => (
                          <li
                            key={i}
                            style={{
                              fontSize: "var(--text-sm)",
                              color: "var(--text-secondary)",
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "var(--space-2)",
                            }}
                          >
                            <CheckCircle2
                              size={14}
                              style={{
                                color: pkg.color,
                                flexShrink: 0,
                                marginTop: 3,
                              }}
                            />
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ marginBottom: "var(--space-4)" }}>
                      <h3
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: 700,
                          color: "var(--text)",
                          marginBottom: "var(--space-3)",
                        }}
                      >
                        Concepts Covered
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          gap: "var(--space-2)",
                          flexWrap: "wrap",
                        }}
                      >
                        {pkg.conceptsList.map((concept, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: "var(--text-xs)",
                              fontFamily: "var(--font-mono)",
                              color: "var(--text-tertiary)",
                              background: "var(--surface-2)",
                              padding: "4px 10px",
                              borderRadius: "var(--radius-full)",
                            }}
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "var(--space-16)", textAlign: "center" }}>
            <PageContent>
              <SectionHeader
                eyebrow="What's Next"
                title="More Knowledge Packages Coming"
                description="We're building 331 Knowledge Packages across 13 levels. From digital foundations to advanced AI — all free, all structured, all designed for real learning."
              />
            </PageContent>
            <div
              style={{
                display: "flex",
                gap: "var(--space-4)",
                justifyContent: "center",
                marginTop: "var(--space-6)",
                flexWrap: "wrap",
              }}
            >
              <a href="/knowledge" className="btn btn-primary">
                Explore Knowledge Mission
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a href="/mission" className="btn btn-secondary">
                Read the Constitution
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
