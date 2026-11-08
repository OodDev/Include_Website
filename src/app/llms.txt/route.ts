import { getTranslations, setRequestLocale } from "next-intl/server";
import { env } from "@/env";
import { siteConfig } from "@/config/site";
import { pathnames, type AppLocale } from "@/config/locales";


/**
 * llms.txt (§9.6) — machine-readable index of human-edited pages: canonical
 * URLs, one-line summaries from approved metadata only. llms-full extends
 * each entry with the page's approved lead when available.
 */
export const dynamic = "force-dynamic";

function pathFor(locale: string, key: keyof typeof pathnames): string {
  // Guard against a doubled slash when the route key itself is "/".
  const entry = (pathnames[key] ?? pathnames["/"]) as Record<string, string>;
  const local = entry[locale] ?? entry["en"];
  return `${env.NEXT_PUBLIC_SITE_URL}/${locale}${local === "/" ? "" : local}`;
}

export async function GET(): Promise<Response> {
  const locale: AppLocale = "en";
  setRequestLocale(locale);

  const t = await getTranslations("metadata");
  type Meta = { title: string; description: string };
  const metaFor = (key: string): Meta =>
    ({ title: t(`${key}.title`), description: t(`${key}.description`) }) as Meta;
  const routes = ["/", "the-project", "the-pathway", "results-and-tools", "ready-for-inclusion", "partners", "news", "contact"] as const;

  const lines: string[] = [
    `# ${siteConfig.fullName}`,
    "",
    `> ${t("home.description")}`,
    "",
    "## Pages",
    "",
  ];
  for (const key of routes) {
    const keyName = key === "/" ? "home" : key;
    const meta = metaFor(keyName);
    lines.push(`- [${meta.title}](${pathFor(locale, (key.startsWith("/") ? key : `/${key}`) as keyof typeof pathnames)}): ${meta.description}`);
  }
  lines.push(
    "",
    "## Facts",
    "",
    `- Programme: ${siteConfig.programme}`,
    `- Project number: ${siteConfig.projectNumber}`,
    `- Period: ${siteConfig.projectPeriod.label}`,
    `- Partners: ${siteConfig.partnersCount}`,
  );
  lines.push("", "## Feeds", "", `- ${env.NEXT_PUBLIC_SITE_URL}/feed.xml`);

  return new Response(lines.join("\n") + "\n", {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" },
    status: 200,
  });
}
