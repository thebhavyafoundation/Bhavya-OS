"use client";

import { useState } from "react";
import { type Locale } from "@bhavya/mission-runtime";
import { SUPPORTED_LOCALES, setLocale } from "../i18n/config";

export function LanguageSwitcher() {
  const [current, setCurrent] = useState<Locale>(() => {
    if (typeof document !== "undefined") {
      const saved = document.cookie.split("; ").find(r => r.startsWith("locale="));
      if (saved) return saved.split("=")[1] as Locale;
    }
    return "en-IN";
  });

  const handleChange = (locale: Locale) => {
    setCurrent(locale);
    setLocale(locale);
    document.cookie = `locale=${locale}; path=/; max-age=31536000`;
  };

  return (
    <div className="lang-switcher" role="radiogroup" aria-label="Language selection">
      {SUPPORTED_LOCALES.map(locale => (
        <button
          key={locale}
          className={`lang-btn ${current === locale ? "active" : ""}`}
          onClick={() => handleChange(locale)}
          role="radio"
          aria-checked={current === locale}
          aria-label={`Switch to ${locale}`}
        >
          {locale}
        </button>
      ))}
    </div>
  );
}
