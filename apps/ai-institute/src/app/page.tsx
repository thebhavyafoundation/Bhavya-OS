"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  TreePine,
  Brain,
  Building2,
  HeartHandshake,
  ArrowRight,
  Users,
  GraduationCap,
  Landmark,
  Compass,
  Target,
  Handshake,
  Heart,
  Database,
  BookCheck,
  FlaskConical,
  Map,
  BarChart3,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HeroBackground } from "@/components/HeroBackground";
import { HeroEntrance } from "@/components/motion/HeroEntrance";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { useAnimatedCounter } from "@/hooks/use-animated-counter";
import { OsArchitectureMap } from "@/components/os-architecture/OsArchitectureMap";

gsap.registerPlugin(ScrollTrigger);

/* ============================================
   DATA
   ============================================ */

const missions = [
  {
    key: "forest",
    icon: TreePine,
    label: "Forest",
    desc: "Restore degraded ecosystems. Protect biodiversity. Conserve watersheds.",
    photo: "/photography/forest/forest-cedar-sunlight.jpg",
  },
  {
    key: "knowledge",
    icon: Brain,
    label: "Knowledge",
    desc: "Expand access to learning. Advance research. Bridge the digital divide.",
    photo: "/photography/knowledge/knowledge-school-children.jpg",
  },
  {
    key: "heritage",
    icon: Building2,
    label: "Heritage",
    desc: "Preserve cultural traditions. Document living history. Protect heritage sites.",
    photo: "/photography/heritage/heritage-stone-temple.jpg",
  },
  {
    key: "community",
    icon: HeartHandshake,
    label: "Community",
    desc: "Empower local leadership. Strengthen social fabric. Build resilient communities.",
    photo: "/photography/community/community-village-gathering.jpg",
  },
];

const realWork = [
  {
    title: "Western Himalaya Watershed Restoration",
    category: "Forest",
    desc: "Restoring degraded watersheds across Himachal Pradesh — soil conservation, native species reforestation, and community-led stewardship.",
    metric: "12 villages",
    photo: "/photography/forest/forest-cedar-sunlight.jpg",
  },
  {
    title: "Digital Literacy for Rural Schools",
    category: "Knowledge",
    desc: "Equipping government schools with structured AI curriculum — from digital foundations to applied problem-solving.",
    metric: "13 Levels",
    photo: "/photography/knowledge/knowledge-school-children.jpg",
  },
  {
    title: "Stone Temple Documentation Project",
    category: "Heritage",
    desc: "Systematic documentation of Himalayan sacred architecture — 3D scanning, oral histories, and conservation planning.",
    metric: "Active fieldwork",
    photo: "/photography/heritage/heritage-stone-temple.jpg",
  },
  {
    title: "Mountain Women's Leadership Program",
    category: "Community",
    desc: "Building local leadership capacity through governance training, cooperative development, and community organizing.",
    metric: "Community-led",
    photo: "/photography/community/community-village-gathering.jpg",
  },
];

const getInvolved = [
  {
    icon: Users,
    title: "Volunteer",
    desc: "Join the Bhavya Volunteer Corps. Make hands-on impact.",
    href: "/volunteer",
  },
  {
    icon: Handshake,
    title: "Partner with Us",
    desc: "Collaborate on institutional research and programmes.",
    href: "/get-involved",
  },
  {
    icon: GraduationCap,
    title: "Learn",
    desc: "Structured learning paths from foundations to advanced research.",
    href: "/knowledge/academy",
  },
  {
    icon: Heart,
    title: "Support Our Work",
    desc: "Fund a mission. Every donation is publicly documented.",
    href: "/donate",
  },
];

/* ============================================
   ANIMATED STAT COMPONENT
   ============================================ */

function AnimatedStat({ value, label }: { value: string; label: string }) {
  const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10);
  const suffix = value.replace(/[0-9]/g, "");
  const { ref, value: current } = useAnimatedCounter({
    target: Number.isNaN(numericValue) ? 0 : numericValue,
  });

  return (
    <div>
      <span
        ref={ref}
        style={{
          display: "block",
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-3xl)",
          fontWeight: 400,
          color: "var(--color-brand-forest)",
          lineHeight: 1,
        }}
      >
        {numericValue > 0 ? `${current}${suffix}` : value}
      </span>
      <div
        style={{
          fontSize: "var(--text-xs)",
          color: "var(--color-text-muted)",
          marginTop: "var(--space-1)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          fontWeight: 500,
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ============================================
   MAIN PAGE
   ============================================ */

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-bg-primary)" }}
    >
      <SiteHeader />
