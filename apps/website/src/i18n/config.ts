import { LocalizationService, type Locale } from "@bhavya/mission-runtime";

export const SUPPORTED_LOCALES: Locale[] = ["en-IN", "hi", "ta", "te"];
export const DEFAULT_LOCALE: Locale = "en-IN";

export type TranslationKey =
  | "nav.home" | "nav.mission" | "nav.nature" | "nav.knowledge"
  | "nav.heritage" | "nav.community" | "nav.transparency" | "nav.about"
  | "nav.programs" | "nav.accessibility"
  | "hero.badge" | "hero.title" | "hero.desc"
  | "hero.explore" | "hero.transparency"
  | "section.scope" | "section.pillars" | "section.pillars.desc"
  | "section.platform" | "section.services"
  | "footer.tagline"
  | "search.placeholder" | "search.button"
  | "accessibility.skip"
  | "theme.dark"
  ;

export const TRANSLATIONS: Record<TranslationKey, Partial<Record<Locale, string>>> = {
  "nav.home":            { "en-IN": "Home", "hi": "होम" },
  "nav.mission":         { "en-IN": "Our Mission", "hi": "हमारा मिशन" },
  "nav.nature":          { "en-IN": "Nature", "hi": "प्रकृति" },
  "nav.knowledge":       { "en-IN": "Knowledge", "hi": "ज्ञान" },
  "nav.heritage":        { "en-IN": "Heritage", "hi": "विरासत" },
  "nav.community":       { "en-IN": "Community", "hi": "समुदाय" },
  "nav.transparency":    { "en-IN": "Transparency", "hi": "पारदर्शिता" },
  "nav.about":           { "en-IN": "About", "hi": "हमारे बारे में" },
  "nav.programs":        { "en-IN": "Programs" },
  "nav.accessibility":   { "en-IN": "Accessibility" },
  "hero.badge":          { "en-IN": "Bhavya OS {version} Active" },
  "hero.title":          { "en-IN": "Serving <span>Nature</span>,<br />Knowledge, Heritage<br />and Community.", "hi": "प्रकृति, ज्ञान, विरासत<br />और समुदाय की सेवा" },
  "hero.desc":           { "en-IN": "Bhavya Foundation is an institutional platform built for the long term — operating with radical transparency, governance discipline, and an enduring commitment to humanity." },
  "hero.explore":        { "en-IN": "Explore Our Mission →" },
  "hero.transparency":   { "en-IN": "View Transparency Portal" },
  "section.scope":       { "en-IN": "Institutional Scope" },
  "section.pillars":     { "en-IN": "Four Pillars of Purpose" },
  "section.pillars.desc": { "en-IN": "Click any pillar to explore its dedicated programs, live telemetry, and active field operations." },
  "section.platform":    { "en-IN": "Real-Time Platform" },
  "section.services":    { "en-IN": "Institutional Services & Portals" },
  "footer.tagline":      { "en-IN": "© 2026 Bhavya Foundation · Operating with Radical Transparency · Built on Bhavya OS v3.0" },
  "search.placeholder":  { "en-IN": "Search the foundation...", "hi": "फाउंडेशन खोजें..." },
  "search.button":       { "en-IN": "Search", "hi": "खोज" },
  "accessibility.skip":  { "en-IN": "Skip to main content", "hi": "मुख्य सामग्री पर जाएं" },
  "theme.dark":          { "en-IN": "Dark" },
};

let currentLocale: Locale = DEFAULT_LOCALE;

export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

export function t(key: TranslationKey, params?: Record<string, string>): string {
  const loc = new LocalizationService();
  for (const [k, v] of Object.entries(TRANSLATIONS)) {
    loc.register(k, v);
  }
  return loc.translate(key, currentLocale, params);
}
