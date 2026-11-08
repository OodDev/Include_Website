import { getTranslations, setRequestLocale } from "next-intl/server";
import { env } from "@/env";
import { siteConfig } from "@/config/site";
import { pathnames, type AppLocale } from "@/config/locales";
import { loadPage } from "@/lib/content/pages";

/**
 * llms-full.txt (§9.6): the same index as llms.txt plus each page's approved
 * lead copy. Generated on demand, English only (source locale), repo content.
 */
export const dynamic = "force-dynamic";

function pathFor(locale: string, key: keyof typeof pathnames): string {
  // Guard against a doubled slash when the route key itself is "/".
  const entry = (pathnames[key] ?? pathnames["/"]) as Record<string, string>;
  const local = entry[locale] ?? entry["en"];
  return `${env.NEXT_PUBLIC_SITE_URL}/${locale}${local === "/" ? "" : local}`;
}

const ROUTES = ["/", "the-project", "the-pathway", "results-and-tools", "ready-for-inclusion", "partners", "news", "contact"] as const;

export async function GET(): Promise<Response> {
  const locale: AppLocale = "en";
  setRequestLocale(locale);

  const t = await getTranslations("metadata");
  const tNav = await getTranslations("header");
  const tMeta = await getTranslations("metadata.news");

  const lines: string[] = [
    `# ${siteConfig.fullName}`,
    "",
    `> ${t("home.description")}`,
    "",
    "## Pages",
    "",
  ];

  for (const key of ROUTES) {
    const metaKey = key === "/" ? "home" : key;
    const url = pathFor(locale, (key.startsWith("/") ? key : `/${key}`) as keyof typeof pathnames);
    lines.push(
      `## ${key === "news" ? tNav("navItems.news") : t(`${metaKey}.title`)}`,
      "",
      `URL: ${url}`,
      `Description: ${t(`${metaKey}.description`)}`,
    );
    if (key === "news") {
      lines.push(`Feed: ${env.NEXT_PUBLIC_SITE_URL}/feed.xml`, `Summary: ${tMeta("description")}`);
    }
    // Approved lead from the MDX frontmatter, when the loader has a document.
    const slug = key as string;
    const doc = await loadPage(locale, slug);
    const hero = doc?.frontmatter as Record<string, unknown> | undefined;
    if (hero && typeof hero.hero === "object" && hero.hero) {
      const lead = (hero.hero as Record<string, unknown>).lead;
      if (typeof lead === "string") lines.push("", lead);
    }
    lines.push("");
  }

  return new Response(lines.join("\n") + "\n", {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" },
    status: 200,
  });
}
