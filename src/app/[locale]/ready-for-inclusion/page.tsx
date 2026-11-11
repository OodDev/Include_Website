import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { loadPage } from "@/lib/content/pages";
import { BreadcrumbSection } from "@/components/layout/Breadcrumbs";
import { Container, Section } from "@/components/ui/LayoutPrimitives";
import { Card } from "@/components/ui/LayoutPrimitives";
import { Icon } from "@/components/brand/Icon";
import { ReadyLabel } from "@/components/brand/ReadyLabel";
import { ButtonLink } from "@/components/ui/Button";
import { KeyFacts } from "@/components/seo/KeyFacts";
import { buildMetadata } from "@/lib/seo/metadata";
import { webPageSchema, breadcrumbSchema, JsonLd } from "@/lib/seo/schemaorg";
import { AnswerBlock } from "@/components/seo/KeyFacts";
import { features } from "@/config/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("metadata.ready-for-inclusion");
  return buildMetadata({ locale: locale as "en", route: "/ready-for-inclusion", title: t("title"), description: t("description") });
}

export default async function ReadyForInclusionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = await loadPage(locale as "en", "ready-for-inclusion");
  if (!page) notFound();
  const fm = page.frontmatter as {
    hero: { title: string; lead: string };
    sub?: string;
    forCompanies: string[];
    ambassadorNetwork: { title: string; body: string; targets: string[] };
    cta: { label: string; route: string };
  };
  const tMeta = await getTranslations("metadata.ready-for-inclusion");

  return (
    <>
      <JsonLd data={webPageSchema({ locale, route: "/ready-for-inclusion", name: tMeta("title"), description: tMeta("description") })} />
      <JsonLd data={breadcrumbSchema([{ name: tMeta("title"), route: "/" }, { name: fm.hero.title, route: "/ready-for-inclusion" }], locale)} />
      <BreadcrumbSection items={[{ label: fm.hero.title }]} />

      {/* Hero with ReadyLabel (§6.6) */}
      <Container className="grid gap-10 pb-16 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div>
          <h1 className="max-w-[16ch] text-h1 font-semibold tracking-tight">{fm.hero.title}</h1>
          <div className="mt-8">
            <AnswerBlock question={tMeta("title")} answer={fm.hero.lead} />
          </div>
          {fm.sub && <p className="mt-6 max-w-[62ch]">{fm.sub}</p>}
        </div>
        <div className="justify-self-start lg:justify-self-end">
          <ReadyLabel variant="plaque-slate" />
        </div>
      </Container>

      <Section tone="paper">
        <Container>
          <h2 className="text-h2 font-semibold">For companies</h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fm.forCompanies.map((item, i) => (
              <li key={i} className="flex gap-4 rounded-card-lg border border-slate/10 bg-white p-6">
                <Icon name={("company") as const} size={32} className="shrink-0" />
                <p className="text-[0.9375rem]">{item}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section id="ambassador-network">
        <Container>
          <h2 className="text-h2 font-semibold">{fm.ambassadorNetwork.title}</h2>
          <p className="mt-6 max-w-[68ch]">{fm.ambassadorNetwork.body}</p>
          {/* Targets labelled as project aims (§2.3 #9) — never achievements;
              sentences verbatim from the approved architecture text */}
          <KeyFacts
            className="mt-8 max-w-3xl"
            facts={fm.ambassadorNetwork.targets.map((target) => ({
              term: "Target",
              value: target,
            }))}
          />
          {/* Network directory / label kit: hidden until data/approval (§6.6 ◇) */}
          {features.networkCounters ? null : null}
        </Container>
      </Section>

      <Section tone="paper">
        <Container>
          <Card className="bg-rust text-white md:max-w-3xl">
            <h2 className="text-[1.375rem] font-semibold">{fm.cta.label}</h2>
            <ButtonLink href="/contact?type=company" variant="outlineLight" className="mt-6">
              {fm.cta.label}
            </ButtonLink>
          </Card>
        </Container>
      </Section>
    </>
  );
}
