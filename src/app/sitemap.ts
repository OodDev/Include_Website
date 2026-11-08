import type { MetadataRoute } from "next";
import { publishedLocales } from "@/config/locales";
import { pathnames } from "@/config/locales";
import { env } from "@/env";
import { loadPage } from "@/lib/content/pages";
import { listNews } from "@/lib/content/loader";
import type { AppLocale } from "@/config/locales";

/**
 * XML sitemap (§9.3): published locales and human-reviewed, indexable routes
 * only. Draft legal pages, glossary (flag off) and category filter hubs are
 * intentionally excluded.
 */

/** Localised URL per pathname for a published locale. */
function url(locale: string, key: keyof typeof pathnames, base: string): string {
  const path = pathnames[key];
  const entry = (path as Record<string, string>)[locale] ?? (path as Record<string, string>).en;
  return `${base}/${locale}${entry === "/" ? "" : entry}`;
}

const PAGES: (keyof typeof pathnames)[] = [
  "/",
  "/the-project",
  "/the-pathway",
  "/results-and-tools",
  "/ready-for-inclusion",
  "/partners",
  "/news",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.NEXT_PUBLIC_SITE_URL;
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of publishedLocales) {
    for (const key of PAGES) {
      const slug = key.replace(/^\//, "");
      let lastModified: Date | undefined;
      if (slug) {
        const doc = await loadPage(locale as AppLocale, slug);
        if (doc && !doc.meta.humanReviewed) continue; // unreviewed pages never enter the sitemap
        lastModified = doc?.meta.updated ? new Date(doc.meta.updated) : undefined;
      }
      entries.push({
        url: url(locale, key, base),
        changeFrequency: "monthly",
        priority: key === "/" ? 1 : 0.8,
        lastModified,
      });
    }
  }

  // News posts: newest first, only for published locales.
  for (const locale of publishedLocales) {
    const posts = await listNews(locale);
    for (const p of posts) {
      entries.push({
        url: `${base}/${locale}${(pathnames["/news/[slug]"] as Record<string, string>)[locale] ?? "/news/[slug]"}`.replace(
          "[slug]",
          p.slug,
        ),
        lastModified: new Date(p.updated ?? p.date),
        changeFrequency: "yearly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
