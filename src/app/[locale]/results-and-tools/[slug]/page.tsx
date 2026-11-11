import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { listResources } from "@/lib/content/data";
import { localisedField } from "@/lib/utils/i18nEntry";
import { BreadcrumbSection } from "@/components/layout/Breadcrumbs";
import { Container, Section } from "@/components/ui/LayoutPrimitives";
import { StatusChip } from "@/components/ui/Chip";
import { Icon } from "@/components/brand/Icon";
import { buildMetadata } from "@/lib/seo/metadata";
import { webPageSchema, breadcrumbSchema, JsonLd } from "@/lib/seo/schemaorg";
import { Prose } from "@/components/seo/Prose";
import { features } from "@/config/site";
import type { IconId } from "@/components/brand/Icon";
import type { Resource } from "@/lib/content/types";

/**
 * Resource detail pages follow §2.3 #11 (no thin pages): they are generated
 * ONLY when the resource is at least `in-progress` AND approved copy exists
 * (here: a localised `body` of at least ~150 words). Otherwise this route is
 * 404 and excluded from the sitemap — the item lives on the list only.
 */

const MIN_DETAIL_WORDS = 150;

function hasDetailCopy(r: Resource, locale: string): boolean {
  const body = localisedField(locale, r, "body");
  return body.split(/\s+/).length >= MIN_DETAIL_WORDS;
}

export async function generateStaticParams() {
  return (await listResources())
    .filter((r) => r.status !== "planned" && hasDetailCopy(r, "en"))
    .filter((r) => !r.needsClientApproval || features.protocolResource)
    .map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const resource = (await listResources()).find((r) => r.slug === slug);
  if (!resource) return {};
  const title = localisedField(locale, resource, "title");
  const summary = localisedField(locale, resource, "summary") || title;
  return buildMetadata({
    locale: locale as "en",
    route: `/results-and-tools/${slug}`,
    title,
    description: summary,
    type: "article",
    ...(resource.publishedAt ? { publishedAt: resource.publishedAt } : {}),
  });
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const resource = (await listResources()).find((r) => r.slug === slug);
  if (!resource) notFound();
  if (resource.needsClientApproval && !features.protocolResource) notFound();
  // Same thin-page guard as generateStaticParams — never render half a detail.
  if (resource.status === "planned" || !hasDetailCopy(resource, locale as string)) notFound();

  const tStatus = await getTranslations("statusLabels");
  const tResults = await getTranslations("results");
  const tMeta = await getTranslations("metadata.results-and-tools");
  const title = localisedField(locale, resource, "title");
  const body = localisedField(locale, resource, "body");

  return (
    <>
      <JsonLd
        data={webPageSchema({
          locale,
          route: `/results-and-tools/${slug}`,
          name: title,
          description: tMeta("description"),
        })}
      />
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: tMeta("title"), route: "/results-and-tools" },
            { name: title, route: `/results-and-tools/${slug}` },
          ],
          locale,
        )}
      />
      <BreadcrumbSection
        items={[
          { label: tMeta("title"), route: "/results-and-tools" },
          { label: title },
        ]}
      />
      <Container>
        <div className="flex items-start justify-between gap-6">
          <h1 id="resource-title" className="max-w-[20ch] text-h1 font-semibold tracking-tight">
            {title}
          </h1>
          <Icon name={resource.icon as IconId} size={56} className="shrink-0" aria-hidden="true" />
        </div>
        <p className="mt-6 flex items-center gap-3 text-[0.875rem] text-slate/70">
          <StatusChip status={resource.status}>{tStatus(resource.status)}</StatusChip>
          {resource.audience.length > 0 && (
            <span className="font-semibold">{resource.audience.map((a) => tResults(`audiences.${a}`)).join(" · ")}</span>
          )}
        </p>
        <div className="mt-8">
          <p className="max-w-[70ch] text-[1.125rem] leading-relaxed">{localisedField(locale, resource, "summary")}</p>
        </div>
      </Container>
      <Section tone="paper">
        <Container className="max-w-[76ch]">
          {body ? <Prose body={body} className="max-w-[76ch]" /> : null}
          {resource.status === "published" && resource.file ? (
            <a
              href={resource.file}
              download
              className="mt-10 inline-block font-bold text-petrol-deep underline-offset-4 hover:underline"
            >
              {tResults("downloadCta")}
            </a>
          ) : null}
        </Container>
      </Section>
    </>
  );
}
