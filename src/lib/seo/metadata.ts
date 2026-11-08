import type { Metadata } from "next";
import { env, isProductionSite } from "@/env";
import { publishedLocales, type AppLocale } from "@/config/locales";
import { siteConfig } from "@/config/site";

export const SITE_URL: string = env.NEXT_PUBLIC_SITE_URL;

/**
 * buildMetadata (§9.1): unique title ≤ 60 chars, description 140–160,
 * self-canonical from the single production origin, hreflang alternates
 * for published locales only, OG/Twitter noindex off production.
 */
export function buildMetadata({
  locale,
  route,
  title,
  description,
  type = "website",
  publishedAt,
  ogImage = true,
}: {
  locale: AppLocale;
  /** Localised canonical path for this route, e.g. "/the-project" */
  route: string;
  title: string;
  description: string;
  type?: "website" | "article";
  publishedAt?: string;
  ogImage?: boolean;
}): Metadata {
  const canonical = `${SITE_URL}/${locale}${route === "/" ? "" : route}`.replace(/\/$/, "");
  const titleTag = `${title} · INCLUDE`.slice(0, 60);

  const languages: Record<string, string> = { "x-default": canonical };
  for (const l of publishedLocales) {
    languages[l] = `${SITE_URL}/${l}${route === "/" ? "" : route}`;
  }

  const noindex = !isProductionSite();
  return {
    title: titleTag,
    description: description.slice(0, 160),
    alternates: { canonical, languages },
    robots: { index: !noindex, follow: !noindex },
    ...(ogImage ? { openGraph: defaultOg({ locale, route, type, publishedAt }) } : {}),
  };
}

export function defaultOg({
  locale,
  route,
  type,
  publishedAt,
}: {
  locale: AppLocale;
  route: string;
  type: "website" | "article";
  publishedAt?: string | undefined;
}): Metadata["openGraph"] {
  const url = `${SITE_URL}/${locale}${route === "/" ? "" : route}`;
  return {
    title: `${siteConfig.fullName}`,
    siteName: siteConfig.fullName,
    locale: locale === "en" ? "en" : locale,
    type,
    url,
    images: [{ url: `${SITE_URL}/og${route === "/" ? "" : route}`, width: 1200, height: 630, alt: siteConfig.fullName }],
    ...(publishedAt ? { publishedTime: publishedAt } : {}),
  };
}
