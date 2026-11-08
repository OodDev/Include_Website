import { defineRouting } from "next-intl/routing";
import { locales, defaultLocale, pathnames } from "@/config/locales";

/**
 * Runtime routing for next-intl. All supported locales are routable so drafts
 * can be previewed; publication (sitemap/hreflang/switcher) is governed by
 * `publishedLocales` from config/locales.js — a content-level gate (§2.3 #2).
 * Locale detection must not set a cookie (no non-essential storage, §11.1);
 * negotiation happens with Accept-Language only inside src/proxy.ts.
 */
export const routing = defineRouting({
  locales: [...locales],
  defaultLocale,
  localePrefix: "always",
  localeDetection: false,
  pathnames: { ...pathnames },
});

/** Everything next-intl RequestConfig asks for, typed. */
export const i18nConfig = { locales, defaultLocale } as const;
