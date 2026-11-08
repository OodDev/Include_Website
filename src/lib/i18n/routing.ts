import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/server";

/** Locales supported by the architecture. `en` is the source and x-default.
 *  A locale is published only when ALL its pages are humanReviewed (§2.3 #2). */
const locales = ["en", "it", "pt", "es", "el"] as const;

export type AppLocale = (typeof locales)[number];
export const appLocales = locales;

export const i18nConfig = {
  locales,
  /** locales that are complete + humanReviewed — drives sitemap, hreflang, switcher */
  publishedLocales: ["en"] satisfies AppLocale[],
  defaultLocale: "en" as AppLocale,
  localePrefix: "always",
  /** localised pathnames: English route names + per-locale slugs (§6.1) */
  pathnames: {
    "/": { en: "/", it: "/", pt: "/", es: "/", el: "/" },
    "/the-project": { en: "/the-project", it: "/il-progetto" },
    "/the-pathway": { en: "/the-pathway", it: "/il-modello" },
    "/results-and-tools": { en: "/results-and-tools", it: "/risorse" },
    "/results-and-tools/[slug]": {
      en: "/results-and-tools/[slug]",
      it: "/risorse/[slug]",
    },
    "/ready-for-inclusion": { en: "/ready-for-inclusion", it: "/ready-for-inclusion" },
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
  } as const,
  /** Disable the locale cookie: no non-essential storage without consent (§11.1) */
  localeDetection: true,
} as const;

export const routing = defineRouting({
  locales: [...i18nConfig.publishedLocales],
  defaultLocale: i18nConfig.defaultLocale,
  localePrefix: "always",
  localeDetection: false, // cookieless negotiation handled in proxy — no cookie stored
});

// Weakly-typed navigation helpers for the published locale set.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
