/**
 * Locale configuration — single source of truth (§2.3 #2).
 * `en` is the source and x-default. A locale is published (sitemap, hreflang,
 * switcher, published URL) only when ALL its pages are humanReviewed.
 */
export const locales = ["en", "it", "pt", "es", "el"] as const;
export type AppLocale = (typeof locales)[number];

/** Locales whose *every* page is complete and humanReviewed. */
export const publishedLocales: AppLocale[] = ["en"];

/** Source-of-truth / default locale. */
export const defaultLocale: AppLocale = "en";

/** Locale display names for the (hidden until >1 published) switcher. */
export const localeNames: Record<AppLocale, string> = {
  en: "English",
  it: "Italiano",
  pt: "Português",
  es: "Español",
  el: "Ελληνικά",
};

/** English route names + localised pathnames (§6.1). */
export const pathnames = {
  "/": { en: "/", it: "/" } as const,
  "/the-project": { en: "/the-project", it: "/il-progetto" },
  "/the-pathway": { en: "/the-pathway", it: "/il-modello" },
  "/results-and-tools": { en: "/results-and-tools", it: "/risorse" },
  "/results-and-tools/[slug]": {
    en: "/results-and-tools/[slug]",
    it: "/risorse/[slug]",
  },
  "/ready-for-inclusion": {
    en: "/ready-for-inclusion",
    it: "/ready-for-inclusion",
  },
  "/partners": { en: "/partners", it: "/partner" },
  "/news": { en: "/news", it: "/news" },
  "/news/[slug]": { en: "/news/[slug]", it: "/news/[slug]" },
  "/news/category/[category]": {
    en: "/news/category/[category]",
    it: "/news/categoria/[category]",
  },
  "/contact": { en: "/contact", it: "/contatti" },
  "/privacy-policy": { en: "/privacy-policy", it: "/privacy" },
  "/cookie-policy": { en: "/cookie-policy", it: "/cookie" },
  "/accessibility": { en: "/accessibility", it: "/accessibilita" },
  "/legal-notice": { en: "/legal-notice", it: "/note-legali" },
  "/glossary": { en: "/glossary", it: "/glossario" },
} as const;

export type RouteName = keyof typeof pathnames;
