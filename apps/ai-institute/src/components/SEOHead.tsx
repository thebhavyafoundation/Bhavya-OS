"use client";

import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
}

const DEFAULT_TITLE = "Bhavya AI Institute — Learn AI, Build the Future";
const DEFAULT_DESCRIPTION =
  "World-class AI education with hands-on labs, expert mentorship, and industry-ready skills.";
const DEFAULT_URL = "https://ai.bhavya.foundation";
const DEFAULT_IMAGE = "https://ai.bhavya.foundation/og-image.png";

export default function SEOHead({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  url = DEFAULT_URL,
  image = DEFAULT_IMAGE,
}: SEOHeadProps) {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string, attr?: string) => {
      let el = document.querySelector(
        `meta[${attr || "name"}="${name}"]`,
      ) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        if (attr) el.setAttribute(attr, name);
        else el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("viewport", "width=device-width, initial-scale=1");
    setMeta("theme-color", "#0a0f0d");
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:image", image, "property");
    setMeta("og:url", url, "property");
    setMeta("og:type", "website", "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", image);

    const ld = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: "Bhavya AI Institute",
      description,
      url,
      logo: image,
      sameAs: [],
    };

    let script = document.getElementById("org-ld") as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.id = "org-ld";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(ld);
  }, [title, description, url, image]);

  return null;
}
