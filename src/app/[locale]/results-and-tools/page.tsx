import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { loadPage } from "@/lib/content/pages";
import { BreadcrumbSection } from "@/components/layout/Breadcrumbs";
import { Container, Section } from "@/components/ui/LayoutPrimitives";
import { Card } from "@/components/ui/LayoutPrimitives";
import { Icon } from "@/components/brand/Icon";
import { StatusChip } from "@/components/ui/Chip";
import { ButtonLink } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo/metadata";
import { webPageSchema, breadcrumbSchema, JsonLd } from "@/lib/seo/schemaorg";
import { AnswerBlock } from "@/components/seo/KeyFacts";
import { listResources } from "@/lib/content/data";
import { localisedField } from "@/lib/utils/i18nEntry";
import { features } from "@/config/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("metadata.results-and-tools");
  return buildMetadata({ locale: locale as "en", route: "/results-and-tools", title: t("title"), description: t("description") });
}

export default async function ResultsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = await loadPage(locale as "en", "results-and-tools");
  if (!page) notFound();
  const fm = page.frontmatter as { hero: { title: string; lead: string } };

  const tStatus = await getTranslations("statusLabels");
  const tResults = await getTranslations("results");
  const tMeta = await getTranslations("metadata.results-and-tools");

  // The unconfirmed Protocol stays hidden until the owner approves (§2.3 #8)
  const resources = (await listResources()).filter((r) => !r.needsClientApproval || features.protocolResource);

  return (
    <>
      <JsonLd data={webPageSchema({ locale, route: "/results-and-tools", name: tMeta("title"), description: tMeta("description") })} />
      <JsonLd data={breadcrumbSchema([{ name: tMeta("title"), route: "/" }, { name: fm.hero.title, route: "/results-and-tools" }], locale)} />
      <BreadcrumbSection items={[{ label: fm.hero.title }]} />
      <Container className="pb-12 md:pb-16">
        <h1 className="max-w-[20ch] text-h1 font-extrabold tracking-tight">{fm.hero.title}</h1>
        <div className="mt-8">
          <AnswerBlock question={tMeta("title")} answer={fm.hero.lead} />
        </div>
      </Container>
      <Section tone="paper">
        <Container>
          <ul id="resources" className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {resources.map((r) => (
              <li key={r.slug}>
                <Card className="flex h-full flex-col justify-between gap-6">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <Icon name={r.icon} size={44} />
                      <StatusChip status={r.status}>{tStatus(r.status)}</StatusChip>
                    </div>
                    <h2 className="mt-4 text-[1.125rem] font-bold leading-snug">
                      {localisedField(locale, r, "title")}
                    </h2>
                    <p className="mt-3 text-[0.9375rem]">{localisedField(locale, r, "summary")}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[0.8125rem] text-slate/70">
                    {r.audience.length > 0 && (
                      <span className="font-semibold">
                        {r.audience.map((a) => tResults(`audiences.${a}`)).join(" · ")}
                      </span>
                    )}
                    {r.status === "published" && r.file && (
                      <a
                        href={r.file}
                        download
                        className="ml-auto font-bold text-petrol-deep underline-offset-4 hover:underline"
                      >
                        {tResults("downloadCta")}
                      </a>
                    )}
                  </div>
                </Card>
              </li>
            ))}
          </ul>
          <p id="technical-passport" className="mt-10 scroll-mt-28 text-[0.9375rem] text-slate/80">
            {tResults("downloadNote")}{" "}
            <ButtonLink href="#resources" variant="ghost" className="ml-2">
              {tResults("downloadCta")}
            </ButtonLink>
          </p>
        </Container>
      </Section>
    </>
  );
}
