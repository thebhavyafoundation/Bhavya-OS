import type { MetadataRoute } from "next";

const SITE_URL = "https://bhavya.foundation";

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
  { path: "/accessibility", priority: 0.4, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map(p => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: new Date(),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
