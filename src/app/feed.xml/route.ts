import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { listNews } from "@/lib/content/loader";
import type { AppLocale } from "@/config/locales";
import { env } from "@/env";
import { siteConfig } from "@/config/site";

/**
 * RSS feed for approved news posts (§9.6). Only published + human-reviewed
 * entries; every tag server-rendered, XML-escaped (XSS through feed §9.2).
 */
export const dynamic = "force-dynamic";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET(): Promise<Response> {
  const base = env.NEXT_PUBLIC_SITE_URL;
  const locale: AppLocale = "en";
  setRequestLocale(locale);

  const posts = (await listNews(locale)).filter((p) => p.humanReviewed);
  const t = await getTranslations("news");
  const tNav = await getTranslations("header");
  const tMeta = await getTranslations("metadata.news");
  const title = `${siteConfig.fullName} · ${tNav("navItems.news")}`;
  const lastBuild = posts[0] ? new Date(posts[0].date).toUTCString() : null;

  const items = posts
    .map((p) =>
      [
        "  <item>",
        `    <title>${escapeXml(p.title)}</title>`,
        `    <link>${base}/en/news/${p.slug}</link>`,
        `    <guid isPermaLink="true">${base}/en/news/${p.slug}</guid>`,
        `    <category>${escapeXml(t(`categories.${p.category}`))}</category>`,
        `    <pubDate>${new Date(p.date).toUTCString()}</pubDate>`,
        `    <description>${escapeXml(p.excerpt)}</description>`,
        "  </item>",
      ].join("\n"),
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${base}/en/news</link>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(tMeta("description"))}</description>
    <language>en</language>
    ${lastBuild ? `<lastBuildDate>${lastBuild}</lastBuildDate>` : ""}
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
