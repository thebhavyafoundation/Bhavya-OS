import type { Metadata } from "next";

interface PageMeta {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
}

const SITE_URL = "https://bhavya.foundation";
const SITE_NAME = "Bhavya Foundation — Nature, Knowledge, Heritage, Community";
const DEFAULT_IMAGE = "/brand/og-image.svg";

export function buildMetadata(page: PageMeta): Metadata {
  const url = `${SITE_URL}${page.path}`;
  return {
    title: page.title,
    description: page.description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      siteName: SITE_NAME,
      type: page.type ?? "website",
      locale: "en_IN",
      images: [{ url: page.image ?? DEFAULT_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
      },
    },
  };
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: "Bhavya Foundation",
  description:
    "Protecting forests, preserving heritage, advancing knowledge, and empowering communities.",
  url: SITE_URL,
  foundingDate: "2026",
  knowsLanguage: ["en-IN", "hi", "ta", "te"],
  accessibilityFeature: [
    "alternativeText",
    "longDescription",
    "structuredNavigation",
  ],
  accessibilityHazard: ["none"],
  accessibilityAPI: ["ARIA"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "General Inquiries",
    url: `${SITE_URL}/community`,
  },
};
