import type { MissionId } from "./mission-profiles";

export interface PillarCard {
  id: MissionId;
  name: string;
  blurb: string;
  href: string;
  accent: "forest" | "knowledge" | "heritage" | "community";
}

export const PILLARS: readonly PillarCard[] = [
  {
    id: "forest",
    name: "Forest",
    blurb: "Restoring living landscapes with communities, season by season.",
    href: "/missions/forest",
    accent: "forest",
  },
  {
    id: "knowledge",
    name: "Knowledge",
    blurb: "Education and AI literacy that outlasts any single classroom.",
    href: "/missions/knowledge",
    accent: "knowledge",
  },
  {
    id: "heritage",
    name: "Heritage",
    blurb:
      "Keeping the records, crafts, and stories that hold a people together.",
    href: "/missions/heritage",
    accent: "heritage",
  },
  {
    id: "community",
    name: "Community",
    blurb: "Local institutions that let good work continue without us.",
    href: "/missions/community",
    accent: "community",
  },
];

export const SMALL_TILES: readonly {
  title: string;
  body: string;
  href: string;
}[] = [
  {
    title: "Foundation",
    body: "A stronger tomorrow — institutions, alliances, and long-term systems for change.",
    href: "/about",
  },
  {
    title: "Evidence",
    body: "Every claim we publish will be sourced, checked, and open to scrutiny.",
    href: "/transparency",
  },
  {
    title: "Participate",
    body: "Donate. Volunteer. Collaborate. Build what lasts with us.",
    href: "/get-involved",
  },
  {
    title: "Bhavya OS",
    body: "The open operating layer behind how this institution works.",
    href: "/os",
  },
];

export const QUOTE = {
  text: "Forests grow slowly. So do stronger societies. Both are worth the wait.",
  attribution: "Bhavya Foundation",
} as const;
