import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { loadPage } from "@/lib/content/pages";
import { listNews } from "@/lib/content/loader";
import { Link } from "@/lib/i18n";
import { BreadcrumbSection } from "@/components/layout/Breadcrumbs";
import { Container, Section } from "@/components/ui/LayoutPrimitives";
import { buildMetadata } from "@/lib/seo/metadata";
import { webPageSchema, breadcrumbSchema, JsonLd } from "@/lib/seo/schemaorg";
import { AnswerBlock } from "@/components/seo/KeyFacts";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("metadata.news");
  return buildMetadata({ locale: locale as "en", route: "/news", title: t("title"), description: t("description") });
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = await loadPage(locale as "en", "news");
  if (!page) notFound();
  const tN = await getTranslations("news");
  const tReadMore = await getTranslations("common");
  const tBread = await getTranslations("breadcrumbs");
  const tMeta = await getTranslations("metadata.news");
  const posts = await listNews(locale as "en");
  const fm = page.frontmatter as { hero: { title: string; lead: string }; categories: string[] };

  return (
    <>
      <JsonLd
        data={webPageSchema({
          locale,
          route: "/news",
          name: fm.hero.title,
          description: tMeta("description"),
        })}
      />
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: tBread("home"), route: "/" },
            { name: fm.hero.title, route: "/news" },
          ],
          locale,
        )}
      />
      <BreadcrumbSection items={[{ label: fm.hero.title }]} />

      <Container className="pb-12 md:pb-16">
        <h1 className="max-w-[20ch] text-h1 font-semibold tracking-tight">{fm.hero.title}</h1>
        <div className="mt-8">
          <AnswerBlock question={tMeta("title")} answer={fm.hero.lead} />
        </div>
        {/* Ethical storytelling callout (§6.8) */}
        <p className="mt-6 max-w-[68ch] rounded-card bg-paper p-4 text-[0.9375rem]">
          {tN("ethicalNotice")}
        </p>
      </Container>

      <Section tone="paper">
        <Container>
          {/* Static category anchors (no indexable filter variants) */}
          <ul className="flex flex-wrap gap-3">
            {fm.categories.map((c) => (
              <li key={c}>
                <a
                  href={`#${c}`}
                  id={c}
                  className="inline-block scroll-mt-28 rounded-pill border border-slate/15 bg-white px-4 py-2 text-[0.875rem] font-bold hover:border-slate motion-safe"
                >
                  {tN(`categories.${c}`)}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section>
        <Container>
          {posts.length === 0 ? (
            // Intentional empty state: no fictional news (§6.8)
            <p className="max-w-[60ch] text-[1.0625rem]">{tN("empty")}</p>
          ) : (
            <ul className="grid gap-6 md:grid-cols-3">
              {posts.map((p) => (
                <li key={p.slug}>
                  <article className="h-full rounded-card-lg border border-slate/10 bg-white p-6">
                    <p className="text-[0.8125rem] text-slate/60">
                      {p.date} · {tN(`categories.${p.category}`)}
                    </p>
                    <h2 className="mt-2 text-[1.125rem] font-semibold leading-snug">{p.title}</h2>
                    <p className="mt-3 text-[0.9375rem]">{p.excerpt}</p>
                    <Link
                      href={`/news/${p.slug}`}
                      className="mt-4 inline-block text-[0.875rem] font-bold text-petrol-deep underline-offset-4 hover:underline"
                    >
                      {tReadMore("readMore")}
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
