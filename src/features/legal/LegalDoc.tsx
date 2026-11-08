import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { AppLocale } from "@/config/locales";
import { loadLegal } from "@/lib/content/pages";
import { buildMetadata } from "@/lib/seo/metadata";
import { BreadcrumbSection } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/ui/LayoutPrimitives";
import { Prose } from "@/components/seo/Prose";
import { webPageSchema, breadcrumbSchema, JsonLd } from "@/lib/seo/schemaorg";

/**
 * Shared legal document renderer (§11.4):
 * - document body is repo-only MDX, never filled from the URL,
 * - a draft banner persists until `humanReviewed: true` (legal sign-off),
 * - draft legal pages render noindex metadata (robot crawl waste avoided).
 * Legal IT copies are EN equivalents pending owner translation, so they also
 * carry humanReviewed: false in their frontmatter.
 */

export function legalSlugs() {
  return ["privacy-policy", "cookie-policy", "accessibility", "legal-notice"] as const;
}
export type LegalSlug = ReturnType<typeof legalSlugs>[number];

export function isLegalSlug(value: string): value is LegalSlug {
  return (legalSlugs() as readonly string[]).includes(value);
}

export async function legalMetadata(locale: AppLocale, slug: LegalSlug): Promise<Metadata> {
  const t = await getTranslations(`metadata.${slug}`);
  const md = buildMetadata({
    locale,
    route: `/${slug}`,
    title: t("title"),
    description: t("description"),
  });
  return { ...md, robots: { index: false, follow: true } };
}

export async function LegalDoc({ locale, slug }: { locale: AppLocale; slug: LegalSlug }) {
  setRequestLocale(locale);
  const doc = await loadLegal(locale, slug);
  if (!doc) notFound();

  const t = await getTranslations("common");
  const tMeta = await getTranslations(`metadata.${slug}`);
  const isDraft = !doc.meta.humanReviewed || doc.meta.status === "draft";

  return (
    <>
      <JsonLd
        data={webPageSchema({ locale, route: `/${slug}`, name: tMeta("title"), description: tMeta("description") })}
      />
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: tMeta("title"), route: `/${slug}` },
          ],
          locale,
        )}
      />
      <BreadcrumbSection items={[{ label: tMeta("title") }]} />
      <Container className="max-w-[75ch]">
        {isDraft && (
          <p role="note" className="mb-8 rounded-card border border-rust/30 bg-rust/5 px-4 py-3 text-[0.875rem]">
            <strong className="font-bold">{t("draftBannerTitle")}</strong> {t("draftBannerText")}
          </p>
        )}
        {typeof doc.meta.updated === "string" && (
          <p className="text-[0.8125rem] text-slate/60">
            {t("lastUpdated", { date: new Date(doc.meta.updated) })}
          </p>
        )}
        <h1 className="mt-3 text-h1 font-extrabold tracking-tight">{tMeta("title")}</h1>
        <div className="mt-10">
          <Prose body={doc.body} />
        </div>
      </Container>
    </>
  );
}
