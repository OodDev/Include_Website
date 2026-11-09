import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { AppLocale } from "@/config/locales";
import { features } from "@/config/site";
import { listGlossary } from "@/lib/content/data";
import { BreadcrumbSection } from "@/components/layout/Breadcrumbs";
import { Container, Section } from "@/components/ui/LayoutPrimitives";
import { webPageSchema, breadcrumbSchema, JsonLd } from "@/lib/seo/schemaorg";
import { buildMetadata } from "@/lib/seo/metadata";

/**
 * Glossary (§6.10): entries recreated only from source definitions.
 * Hidden until the owner approves (features.showGlossary) — noindex regardless,
 * because the page never becomes a primary SEO surface.
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("metadata.glossary");
  const md = buildMetadata({
    locale: locale as AppLocale,
    route: "/glossary",
    title: t("title"),
    description: t("description"),
  });
  return { ...md, robots: { index: false, follow: false } };
}

export default async function GlossaryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!features.showGlossary) notFound();

  const tGloss = await getTranslations("glossary");
  const entries = await listGlossary();

  return (
    <>
      <JsonLd data={webPageSchema({ locale, route: "/glossary", name: tGloss("title") })} />
      <JsonLd data={breadcrumbSchema([{ name: tGloss("title"), route: "/glossary" }], locale)} />
      <BreadcrumbSection items={[{ label: tGloss("title") }]} />
      <Container className="max-w-[75ch] pb-12 md:pb-16">
        <h1 className="text-h1 font-extrabold tracking-tight">{tGloss("title")}</h1>
        <p className="mt-6 text-[1.0625rem]">{tGloss("intro")}</p>
      </Container>
      <Section tone="paper">
        <Container className="max-w-[75ch]">
          <dl className="grid gap-8">
            {entries.map((e) => (
              <div key={e.term} className="border-b border-slate/10 pb-8 last:border-0">
                <dt className="text-[1.125rem] font-bold">{e.term}</dt>
                <dd className="mt-2 text-[0.9375rem] leading-relaxed">{e.definition}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>
    </>
  );
}
