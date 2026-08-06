"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  TreePine,
  Brain,
  Building2,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";

const missions = [
  {
    key: "nature",
    icon: TreePine,
    title: "Bhavya Forest Mission",
    href: "/nature",
    desc: "Restore ecosystems, protect biodiversity, increase native forest cover, and conserve water through community-led ecological stewardship.",
    color: "#15803d",
    bgColor: "rgba(21, 128, 61, 0.06)",
    stat: "89%",
    statLabel: "first-year survival rate",
  },
  {
    key: "knowledge",
    icon: Brain,
    title: "Bhavya Knowledge Mission",
    href: "/knowledge",
    desc: "AI Labs, Digital Libraries, research, and innovation. Making education accessible to rural and underserved communities.",
    color: "#8a7359",
    bgColor: "rgba(138, 115, 89, 0.06)",
    stat: "AI Labs",
    statLabel: "in rural communities",
  },
  {
    key: "heritage",
    icon: Building2,
    title: "Bhavya Heritage Mission",
    href: "/heritage",
    desc: "Preserving traditional knowledge, yoga, temple documentation, architecture, history, and living heritage for future generations.",
    color: "#ca8a04",
    bgColor: "rgba(202, 138, 4, 0.06)",
    stat: "Living",
    statLabel: "heritage preservation",
  },
  {
    key: "community",
    icon: HeartHandshake,
    title: "Bhavya Community Mission",
    href: "/community",
    desc: "Youth empowerment, women's leadership, school programmes, village development, and the Bhavya Volunteer Corps.",
    color: "#15803d",
    bgColor: "rgba(21, 128, 61, 0.06)",
    stat: "500+",
    statLabel: "volunteers & growing",
  },
];

function MissionCard({
  mission,
  index,
}: {
  mission: (typeof missions)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const Icon = mission.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, filter: "blur(4px)" }}
      animate={
        isInView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 60, filter: "blur(4px)" }
      }
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <a
        href={mission.href}
        className="card mission-card-cinematic"
        style={{
          textDecoration: "none",
          color: "inherit",
          background: mission.bgColor,
          borderColor: `${mission.color}15`,
        }}
      >
        <motion.div
          className="card-icon mission-card-icon"
          style={{ color: mission.color, background: `${mission.color}10` }}
          whileHover={{ scale: 1.05, rotate: -3 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <Icon size={22} />
        </motion.div>
        <h3 className="card-title">{mission.title}</h3>
        <p className="card-desc">{mission.desc}</p>
        <div className="mission-card-footer">
          <div className="mission-card-stat">
            <span
              className="mission-card-stat-value"
              style={{ color: mission.color }}
            >
              {mission.stat}
            </span>
            <span className="mission-card-stat-label">{mission.statLabel}</span>
          </div>
          <motion.div
            className="mission-card-arrow"
            style={{ color: mission.color }}
            whileHover={{ x: 4 }}
          >
            <ArrowRight size={16} />
          </motion.div>
        </div>
      </a>
    </motion.div>
  );
}

export function MissionCards() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      className="container"
      aria-labelledby="missions-heading"
      ref={sectionRef}
    >
      <motion.div
        className="section-group"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="section-eyebrow">Our Four Missions</p>
        <h2 className="section-title">Institutions That Endure</h2>
        <p className="section-desc">
          Everything under Bhavya belongs to one of these permanent missions.
          Projects finish. Institutions endure.
        </p>
      </motion.div>
      <div className="grid-2">
        {missions.map((m, i) => (
          <MissionCard key={m.key} mission={m} index={i} />
        ))}
      </div>
    </section>
  );
}
