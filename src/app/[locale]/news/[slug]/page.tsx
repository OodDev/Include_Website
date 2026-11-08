import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { locales, type AppLocale } from "@/config/locales";
import { Link } from "@/lib/i18n";
import { getNewsPost, listNews } from "@/lib/content/loader";
import { BreadcrumbSection } from "@/components/layout/Breadcrumbs";
import { Container, Section } from "@/components/ui/LayoutPrimitives";
import { buildMetadata } from "@/lib/seo/metadata";
import { newsArticleSchema, breadcrumbSchema, JsonLd } from "@/lib/seo/schemaorg";
import { Prose } from "@/components/seo/Prose";
import { isProductionSite } from "@/env";

export async function generateStaticParams() {
  // Empty news data is a valid state: no posts, no params, route 404s live.
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    const posts = await listNews(locale as AppLocale);
    for (const p of posts) params.push({ locale, slug: p.slug });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getNewsPost(locale as AppLocale, slug);
  if (!post) return {};
  return buildMetadata({
    locale: locale as AppLocale,
    route: `/news/${slug}`,
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt,
    type: "article",
    publishedAt: post.frontmatter.date,
  });
}

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  // A published post must also carry humanReviewed to be indexable/visible.
  const post = await getNewsPost(locale as AppLocale, slug);
  if (!post) notFound();
  const { frontmatter: fm, body } = post;
  if (isProductionSite() && !fm.humanReviewed) notFound(); // unreviewed drafts never ship (§7)

  const tN = await getTranslations("news");
  const tNav = await getTranslations("header");
  const newsTitle = tNav("navItems.news");

  return (
    <>
      <JsonLd
        data={newsArticleSchema({
          locale,
          route: `/news/${slug}`,
          title: fm.title,
          datePublished: fm.date,
          ...(fm.updated ? { dateModified: fm.updated } : {}),
          ...(fm.author ? { authorName: fm.author } : {}),
          excerpt: fm.excerpt,
        })}
      />
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: newsTitle, route: "/news" },
            { name: fm.title, route: `/news/${slug}` },
          ],
          locale,
        )}
      />
      <BreadcrumbSection
        items={[
          { label: newsTitle, route: "/news" },
          { label: fm.title },
        ]}
      />
      <Container className="max-w-[75ch]">
        <p className="text-[0.8125rem] text-slate/60">
          {fm.date} · {tN(`categories.${fm.category}`)}
          {fm.country ? ` · ${fm.country}` : ""}
        </p>
        <h1 className="mt-2 text-h1 font-extrabold tracking-tight">{fm.title}</h1>
        <p className="mt-6 text-[1.125rem] leading-relaxed">{fm.excerpt}</p>
      </Container>
      {fm.category === "pilot-stories" && (
        <Container>
          <p className="mt-4 rounded-card border border-slate/15 bg-paper p-4 text-[0.9375rem]">
            {tN("ethicalNotice")}
          </p>
        </Container>
      )}
      <Section>
        <Container className="max-w-[75ch]">
          <Prose body={body} />
        </Container>
      </Section>
      <Section tone="paper">
        <Container>
          <Link href="/news" className="font-bold text-petrol-deep underline-offset-4 hover:underline">
            {tN("backToNews")}
          </Link>
        </Container>
      </Section>
    </>
  );
}
