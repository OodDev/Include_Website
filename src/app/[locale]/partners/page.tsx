import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { loadPage } from "@/lib/content/pages";
import { BreadcrumbSection } from "@/components/layout/Breadcrumbs";
import { Container, Section, Card } from "@/components/ui/LayoutPrimitives";
import { buildMetadata } from "@/lib/seo/metadata";
import { webPageSchema, breadcrumbSchema, JsonLd } from "@/lib/seo/schemaorg";
import { AnswerBlock } from "@/components/seo/KeyFacts";
import { listPartners } from "@/lib/content/data";
import { localisedField } from "@/lib/utils/i18nEntry";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("metadata.partners");
  return buildMetadata({ locale: locale as "en", route: "/partners", title: t("title"), description: t("description") });
}

export default async function PartnersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = await loadPage(locale as "en", "partners");
  if (!page) notFound();
  const fm = page.frontmatter as { hero: { title: string; lead: string }; associatedNote: string };
  const tMeta = await getTranslations("metadata.partners");
  const partners = (await listPartners()).filter((p) => p.type === "full");
  const associated = (await listPartners()).filter((p) => p.type === "associated");

  return (
    <>
      <JsonLd data={webPageSchema({ locale, route: "/partners", name: tMeta("title"), description: tMeta("description") })} />
      <JsonLd data={breadcrumbSchema([{ name: tMeta("title"), route: "/" }, { name: fm.hero.title, route: "/partners" }], locale)} />
      <BreadcrumbSection items={[{ label: fm.hero.title }]} />
      <Container className="pb-12 md:pb-16">
        <h1 className="max-w-[20ch] text-h1 font-extrabold tracking-tight">{fm.hero.title}</h1>
        <div className="mt-8">
          <AnswerBlock question={tMeta("title")} answer={fm.hero.lead} />
        </div>
      </Container>
      <Section tone="paper">
        <Container>
          <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {partners.map((p) => (
              <li key={p.slug}>
                <Card className="h-full">
                  <p className="u-label text-slate/60">{p.country}</p>
                  <h2 className="mt-2 text-[1.125rem] font-bold leading-snug">{p.name}</h2>
                  <p className="mt-3 text-[0.9375rem]">{localisedField(locale, p, "description")}</p>
                  {/* Verified external links only (rel noopener, §12) — not rendered until owner verifies URL */}
                  {p.verifiedUrl ? (
                    <a href={p.verifiedUrl} rel="noopener noreferrer" target="_blank" className="mt-4 inline-block text-[0.875rem] font-bold text-petrol-deep underline-offset-4 hover:underline">
                      Website ↗
                    </a>
                  ) : null}
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <Section>
        <Container className="max-w-[70ch]">
          <h2 className="text-h2 font-bold">Associated partners</h2>
          {/* Neutral neutral architecture copy; names hidden until partners.yaml carries type:associated entries (§6.7) */}
          <p className="mt-6">{fm.associatedNote}</p>
          {associated.length > 0 && (
            <ul className="mt-6">
              {associated.map((p) => (
                <li key={p.slug}>{p.name}</li>
              ))}
            </ul>
          )}
        </Container>
      </Section>
    </>
  );
}
