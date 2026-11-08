import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { AppLocale } from "@/config/locales";
import { listNews } from "@/lib/content/loader";
import { BreadcrumbSection } from "@/components/layout/Breadcrumbs";
import { Container, Section } from "@/components/ui/LayoutPrimitives";
import { buildMetadata } from "@/lib/seo/metadata";
import { Link } from "@/lib/i18n";
import { breadcrumbSchema, JsonLd } from "@/lib/seo/schemaorg";

/**
 * Category landing pages (§6.8): browsable hubs for each news category, but
 * they are intentionally NOT indexable filter variants — `robots: noindex`
 * and excluded from the sitemap; the canonical category anchor lives on /news.
 */

export const categories = [
  "project-news",
  "from-the-territories",
  "voices-from-companies",
  "pilot-stories",
  "events",
  "tools-resources",
  "policy-advocacy",
] as const;

export type Category = (typeof categories)[number];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  if (!isValidCategory(category)) return {};
  const t = await getTranslations("news.categories");
  const title = `News · ${t(category)}`;
  return {
    ...buildMetadata({
      locale: locale as AppLocale,
      route: `/news/category/${category}`,
      title,
      description: t(category),
    }),
    robots: { index: false, follow: true },
  };
}

function isValidCategory(value: string): value is Category {
  return (categories as readonly string[]).includes(value);
}

export default async function NewsCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);
  if (!isValidCategory(category)) notFound();

  const posts = (await listNews(locale as AppLocale)).filter((p) => p.category === category);
  const tN = await getTranslations("news");
  const tNav = await getTranslations("header");
  const newsTitle = tNav("navItems.news");
  const title = tN(`categories.${category}`);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: newsTitle, route: "/news" },
            { name: title, route: `/news/category/${category}` },
          ],
          locale,
        )}
      />
      <BreadcrumbSection
        items={[
          { label: newsTitle, route: "/news" },
          { label: title },
        ]}
      />
      <Container>
        <h1 className="max-w-[20ch] text-h1 font-extrabold tracking-tight">{title}</h1>
      </Container>
      <Section>
        <Container>
          <Link
            href="/news"
            className="mb-8 inline-block font-bold text-petrol-deep underline-offset-4 hover:underline"
          >
            {tN("backToNews")}
          </Link>
          {posts.length === 0 ? (
            <p className="max-w-[60ch] text-[1.0625rem]">{tN("empty")}</p>
          ) : (
            <ul className="grid gap-6 md:grid-cols-3">
              {posts.map((p) => (
                <li key={p.slug}>
                  <article className="h-full rounded-card-lg border border-slate/10 bg-white p-6">
                    <p className="text-[0.8125rem] text-slate/60">
                      {p.date}
                      {p.country ? ` · ${p.country}` : ""}
                    </p>
                    <h2 className="mt-2 text-[1.125rem] font-bold leading-snug">{p.title}</h2>
                    <p className="mt-3 text-[0.9375rem]">{p.excerpt}</p>
                    <Link
                      href={`/news/${p.slug}`}
                      className="mt-4 inline-block text-[0.875rem] font-bold text-petrol-deep underline-offset-4 hover:underline"
                    >
                      {tN("backToNews")}
                    </Link>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>
    </>
  );
}
