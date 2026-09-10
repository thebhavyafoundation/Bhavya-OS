import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = "https://thebhavyafoundation.github.io/Bhavya-OS";

const pages = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/mission", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/nature", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/knowledge", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/heritage", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/community", priority: 0.7, changeFrequency: "daily" as const },
  { path: "/transparency", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/programs", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/curriculum", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/curriculum/levels", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/knowledge/articles", priority: 0.6, changeFrequency: "weekly" as const },
  { path: "/knowledge/glossary", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/research", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/library", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/get-involved", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/accessibility", priority: 0.4, changeFrequency: "yearly" as const },
  { path: "/donate", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/resources", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/knowledge/packages", priority: 0.6, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map(p => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: new Date(),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
