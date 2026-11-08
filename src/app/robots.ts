import type { MetadataRoute } from "next";
import { env, isProductionSite } from "@/env";

/**
 * robots.txt (§9.3): full crawl in production; times out development/preview
 * with noindex semantics so preview sites are never indexed by accident.
 * AI crawlers and per-bot rules: treat all bots uniformly (no UA games).
 */
export default function robots(): MetadataRoute.Robots {
  const base = env.NEXT_PUBLIC_SITE_URL;
  const prod = isProductionSite();
  return {
    rules: prod
      ? [{ userAgent: "*", allow: "/" }]
      : [{ userAgent: "*", disallow: "/" }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
