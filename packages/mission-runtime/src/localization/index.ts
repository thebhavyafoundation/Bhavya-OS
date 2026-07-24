export type Locale = "en-IN" | "hi" | "ta" | "te" | "kn" | "ml" | "mr" | "gu" | "bn";

export interface LocalizationProvider {
  translate(key: string, locale: Locale, params?: Record<string, string>): string;
  getLocale(): Locale;
  setLocale(locale: Locale): void;
  getSupportedLocales(): Locale[];
}

export class LocalizationService implements LocalizationProvider {
  private locale: Locale = "en-IN";
  private translations: Map<string, Map<Locale, string>> = new Map();
  private supported: Locale[] = ["en-IN", "hi", "ta", "te"];

  register(key: string, translations: Partial<Record<Locale, string>>): void {
    const map = new Map<Locale, string>();
    for (const [locale, value] of Object.entries(translations)) {
      map.set(locale as Locale, value);
    }
    this.translations.set(key, map);
  }

  registerBulk(bundle: Record<string, Partial<Record<Locale, string>>>): void {
    for (const [key, translations] of Object.entries(bundle)) {
      this.register(key, translations);
    }
  }

  translate(key: string, locale?: Locale, params?: Record<string, string>): string {
    const targetLocale = locale ?? this.locale;
    const translations = this.translations.get(key);
    let text = translations?.get(targetLocale) ?? translations?.get("en-IN") ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{${k}}`, v);
      }
    }
    return text;
  }

  getLocale(): Locale {
    return this.locale;
  }

  setLocale(locale: Locale): void {
    this.locale = locale;
  }

  getSupportedLocales(): Locale[] {
    return [...this.supported];
  }
}
