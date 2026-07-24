export const brand = {
  name: "Bhavya Foundation",
  product: "Bhavya OS",
  tagline: "Building for Generations.",
  founder: "Manohar Lal",
  promise:
    "A perpetual charitable institution dedicated to forests, knowledge, responsible technology, culture, and future generations."
} as const;

export const missions = [
  {
    id: "forest",
    title: "Forest Mission",
    href: "/forest",
    description: "Restore forests, conserve water, protect biodiversity, and revive sacred landscapes."
  },
  {
    id: "knowledge",
    title: "Knowledge Mission",
    href: "/knowledge",
    description: "Democratize AI, build digital libraries, and expand lifelong learning."
  },
  {
    id: "heritage",
    title: "Heritage Mission",
    href: "/heritage",
    description: "Preserve Indian civilization through archives, restoration, yoga, and documentation."
  },
  {
    id: "volunteer",
    title: "Volunteer Mission",
    href: "/volunteer",
    description: "Equip citizens to serve communities with integrity, skill, and discipline."
  }
] as const;

export const navigation = [
  { title: "Home", href: "/" },
  { title: "Missions", href: "/missions" },
  { title: "Docs", href: "/docs" },
  { title: "Volunteer", href: "/volunteer" },
  { title: "Founder Dashboard", href: "/dashboard" }
] as const;

export const foundationPrinciples = [
  "Service before self.",
  "Nature before exploitation.",
  "Knowledge before ignorance.",
  "Integrity before convenience.",
  "Transparency before secrecy.",
  "Long-term stewardship over short-term gain."
] as const;

export const impactStats = [
  { label: "Core missions", value: "4" },
  { label: "Institutional horizon", value: "Perpetual" },
  { label: "Review cycle", value: "3 years" },
  { label: "Operating principle", value: "Public interest" }
] as const;
