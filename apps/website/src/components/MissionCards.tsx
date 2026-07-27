"use client";

import { useGsapStagger } from "../lib/animations";
import { TreePine, Brain, Building2, HeartHandshake } from "lucide-react";

const missions = [
  {
    key: "nature",
    icon: <TreePine />,
    title: "Bhavya Forest Mission",
    href: "/nature",
    desc: "Restore ecosystems, protect biodiversity, increase native forest cover, and conserve water through community-led ecological stewardship.",
    color: "var(--forest-600)",
  },
  {
    key: "knowledge",
    icon: <Brain />,
    title: "Bhavya Knowledge Mission",
    href: "/knowledge",
    desc: "AI Labs, Digital Libraries, research, and innovation. Making education accessible to rural and underserved communities.",
    color: "var(--earth-600)",
  },
  {
    key: "heritage",
    icon: <Building2 />,
    title: "Bhavya Heritage Mission",
    href: "/heritage",
    desc: "Preserving traditional knowledge, yoga, temple documentation, architecture, history, and living heritage for future generations.",
    color: "var(--gold-600)",
  },
  {
    key: "community",
    icon: <HeartHandshake />,
    title: "Bhavya Community Mission",
    href: "/community",
    desc: "Youth empowerment, women's leadership, school programmes, village development, and the Bhavya Volunteer Corps.",
    color: "var(--forest-700)",
  },
];

export function MissionCards() {
  const containerRef = useGsapStagger(missions.length);

  return (
    <section className="container" aria-labelledby="missions-heading">
      <div className="section-group">
        <p className="section-eyebrow">Our Four Missions</p>
        <h2 className="section-title">Institutions That Endure</h2>
        <p className="section-desc">
          Everything under Bhavya belongs to one of these permanent missions.
          Projects finish. Institutions endure.
        </p>
      </div>
      <div className="grid-2" ref={containerRef}>
        {missions.map((m) => (
          <a
            key={m.key}
            href={m.href}
            className="card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="card-icon" style={{ color: m.color }}>
              {m.icon}
            </div>
            <h3 className="card-title">{m.title}</h3>
            <p className="card-desc">{m.desc}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
