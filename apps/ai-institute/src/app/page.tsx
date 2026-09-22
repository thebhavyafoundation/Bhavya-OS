"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TreePine, Brain, Building2, HeartHandshake, ArrowRight, Users, GraduationCap, Landmark, Compass, Target, Handshake, Heart, Database, BookCheck, FlaskConical, Map, BarChart3 } from "lucide-react";
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
