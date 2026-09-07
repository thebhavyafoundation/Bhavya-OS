import type { MetadataRoute } from "next";
import { courses } from "@/data/academy-courses";

/**
 * Public sitemap. Every URL below is a verified real page (page.tsx on
 * disk). Authenticated, internal, deferred, and redirect routes are
 * never listed here.
 */
const BASE = "https://bhavyafoundation.org";

const STATIC_ROUTES = [
  "/",
  "/about",
  "/accessibility",
  "/community",
  "/contributing",
  "/courses",
  "/donate",
  "/faq",
  "/forest",
  "/get-involved",
  "/heritage",
  "/impact",
  "/knowledge",
  "/knowledge-graph",
  "/learning-paths",
  "/library",
  "/mentor",
  "/mission",
  "/missions",
  "/missions/forest",
  "/missions/heritage",
  "/missions/knowledge",
  "/missions/community",
  "/nature",
  "/press",
  "/privacy",
  "/projects",
  "/research",
  "/resources",
  "/schools",
  "/terms",
  "/transparency",
  "/volunteer",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_ROUTES.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
  }));

  const courseEntries = courses
    .filter((c) => c.status === "published")
    .map((c) => ({
      url: `${BASE}/courses/${c.id}`,
      lastModified: new Date(c.updatedAt),
    }));

  return [...staticEntries, ...courseEntries];
}
