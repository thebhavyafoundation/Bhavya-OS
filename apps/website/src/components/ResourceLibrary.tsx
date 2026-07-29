"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  Compass,
  FileText,
  Play,
  Sparkles,
} from "lucide-react";

type ResourceKind = "All" | "Field Notes" | "Playbooks" | "Research" | "Media";

const resources = [
  {
    type: "Field Notes" as const,
    eyebrow: "Field note  /  001",
    title: "The village is the interface",
    description:
      "What we learned while designing an AI learning space for people who do not think of themselves as technologists.",
    meta: "8 min read",
    icon: Compass,
    accent: "violet",
  },
  {
    type: "Playbooks" as const,
    eyebrow: "Practical guide  /  004",
    title: "A humane way to learn AI",
    description:
      "A field-tested starting point for teachers, students, and community leaders building confidence with new tools.",
    meta: "Download PDF",
    icon: BookOpen,
    accent: "lime",
  },
  {
    type: "Research" as const,
    eyebrow: "Research brief  /  002",
    title: "Trust is a technical primitive",
    description:
      "A short investigation into why transparency, context, and consent belong in the architecture of every public AI system.",
    meta: "12 min read",
    icon: BrainCircuit,
    accent: "coral",
  },
  {
    type: "Media" as const,
    eyebrow: "Studio session  /  007",
    title: "The quiet power of useful AI",
    description:
      "A conversation with the people turning curiosity into confidence, one small experiment at a time.",
    meta: "34 min listen",
    icon: Play,
    accent: "sky",
  },
  {
    type: "Field Notes" as const,
    eyebrow: "Field note  /  005",
    title: "Small rooms, wide horizons",
    description:
      "How a community lab becomes a place for making, asking better questions, and finding your people.",
    meta: "6 min read",
    icon: Sparkles,
    accent: "amber",
  },
  {
    type: "Playbooks" as const,
    eyebrow: "Toolkit  /  003",
    title: "Build an AI lab from first principles",
    description:
      "A modular blueprint for setting up the space, rituals, and safeguards that make learning stick.",
    meta: "Download toolkit",
    icon: FileText,
    accent: "violet",
  },
];

const filters: ResourceKind[] = ["All", "Field Notes", "Playbooks", "Research", "Media"];

export function ResourceLibrary() {
  const [activeFilter, setActiveFilter] = useState<ResourceKind>("All");
  const filteredResources = useMemo(
    () =>
      activeFilter === "All"
        ? resources
        : resources.filter((resource) => resource.type === activeFilter),
    [activeFilter],
  );

  return (
    <section className="lab-library" id="resource-grid" aria-labelledby="library-title">
      <div className="lab-section-heading">
        <div>
          <p className="lab-kicker">The library</p>
          <h2 id="library-title">Ideas with a point of view.</h2>
        </div>
        <p>
          Notes from the field, practical playbooks, and research for people
          building a more capable and humane future.
        </p>
      </div>

      <div className="lab-filters" role="group" aria-label="Filter resources">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={activeFilter === filter ? "is-active" : ""}
            onClick={() => setActiveFilter(filter)}
            aria-pressed={activeFilter === filter}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="lab-resource-grid" aria-live="polite">
        {filteredResources.map((resource, index) => {
          const Icon = resource.icon;
          return (
            <article className={`lab-resource-card accent-${resource.accent}`} key={resource.title}>
              <div className="lab-resource-topline">
                <span>{resource.type}</span>
                <span className="lab-resource-index">0{index + 1}</span>
              </div>
              <div className="lab-resource-icon"><Icon size={20} aria-hidden="true" /></div>
              <p className="lab-resource-eyebrow">{resource.eyebrow}</p>
              <h3>{resource.title}</h3>
              <p className="lab-resource-description">{resource.description}</p>
              <a href="#resource-grid" className="lab-resource-link">
                {resource.meta}<ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
