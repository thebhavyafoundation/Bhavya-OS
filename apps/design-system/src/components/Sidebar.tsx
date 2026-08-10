"use client";

import { AppSidebar } from "@bhavya/platform-ui";
import {
  Palette,
  Component,
  Type,
  Layout,
  Shapes,
  Play,
  Layers,
} from "lucide-react";

const sections = [
  { label: "Overview", href: "/", icon: <Layers className="w-4 h-4" /> },
  { label: "Tokens", href: "/tokens", icon: <Palette className="w-4 h-4" /> },
  { label: "Components", href: "/components", icon: <Component className="w-4 h-4" /> },
  { label: "Icons", href: "/icons", icon: <Shapes className="w-4 h-4" /> },
  { label: "Typography", href: "/typography", icon: <Type className="w-4 h-4" /> },
  { label: "Patterns", href: "/patterns", icon: <Layout className="w-4 h-4" /> },
  { label: "Playground", href: "/playground", icon: <Play className="w-4 h-4" /> },
];

export default function Sidebar() {
  return (
    <AppSidebar
      brand="Bhavya Design"
      items={sections.map((s) => ({ ...s, group: "" }))}
    />
  );
}
