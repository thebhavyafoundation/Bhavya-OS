import type { MetadataRoute } from "next";
import { courses } from "@/data/academy-courses";
import { levelParams, moduleParams, getLessons } from "@/data/curriculum";

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
  "/ai-institute",
  "/ai-institute/experiments",
  "/community",
  "/contributing",
  "/courses",
  "/curriculum",
  "/donate",
  "/faq",
  "/forest",
  "/get-involved",
  "/governance",
  "/governance/ai-ethics",
  "/governance/board-of-trustees",
  "/governance/founders",
  "/governance/safeguarding",
  "/heritage",
  "/impact",
  "/initiatives",
  "/initiatives/rural-innovation",
  "/initiatives/school-outreach",
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
  "/resources/documents",
  "/resources/publications",
  "/resources/videos",
  "/schools",
  "/support",
  "/teachers",
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

  const curriculumLevelEntries = levelParams().map((level) => ({
    url: `${BASE}/curriculum/levels/${level}`,
    lastModified: new Date(),
  }));

  const curriculumModuleEntries = moduleParams().map((m) => ({
    url: `${BASE}/curriculum/levels/${m.level}/${m.module}`,
    lastModified: new Date(),
  }));

  const curriculumLessonEntries = moduleParams().flatMap((m) => {
    const lessons = getLessons(m.module);
    return lessons.map((lesson) => ({
      url: `${BASE}/curriculum/levels/${m.level}/${m.module}/lessons/${lesson.id}`,
      lastModified: new Date(),
    }));
  });

  return [
    ...staticEntries,
    ...courseEntries,
    ...curriculumLevelEntries,
    ...curriculumModuleEntries,
    ...curriculumLessonEntries,
  ];
}
