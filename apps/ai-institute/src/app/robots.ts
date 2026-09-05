import type { MetadataRoute } from "next";

/**
 * Authenticated, internal, and API surfaces stay out of search indexes.
 * (Defense in depth: middleware also sends X-Robots-Tag: noindex for
 * these paths at runtime.)
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/app/",
          "/os/",
          "/studio/",
          "/dashboard",
          "/profile",
          "/login",
          "/register",
          "/onboarding",
          "/forbidden",
        ],
      },
    ],
    sitemap: "https://bhavyafoundation.org/sitemap.xml",
  };
}
