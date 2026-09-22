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
