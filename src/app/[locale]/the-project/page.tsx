import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { loadPage } from "@/lib/content/pages";
import { BreadcrumbSection } from "@/components/layout/Breadcrumbs";
import { Container,Section } from "@/components/ui/LayoutPrimitives";
import { Icon } from "@/components/brand/Icon";
import { KeyFacts, AnswerBlock } from "@/components/seo/KeyFacts";
import { buildMetadata } from "@/lib/seo/metadata";
import { webPageSchema, breadcrumbSchema, JsonLd } from "@/lib/seo/schemaorg";
import { siteConfig } from "@/config/site";
import type { IconId } from "@/components/brand/Icon";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("metadata.the-project");
  return buildMetadata({ locale: locale as "en", route: "/the-project", title: t("title"), description: t("description") });
}

export default async function TheProjectPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = await loadPage(locale as "en", "the-project");
  if (!page) notFound();
  const fm = page.frontmatter as {
    hero: { title: string; lead: string };
    closing: { paragraphs: string[] };
    approach: { title: string; paragraphs: string[] };
    audiences: { title: string; items: { text: string; icon: string }[] };
    closingLine: string;
    keyFacts?: boolean;
    faq?: boolean;
  };

  const tFacts = await getTranslations("footer.facts");
  const tMeta = await getTranslations("metadata.the-project");

  return (
    <>
      <JsonLd
        data={webPageSchema({
          locale,
          route: "/the-project",
          kind: "AboutPage",
          name: tMeta("title"),
          description: tMeta("description"),
        })}
      />
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: tFacts("project"), route: "/" },
            { name: fm.hero.title, route: "/the-project" },
          ],
          locale,
        )}
      />
      <BreadcrumbSection items={[{ label: fm.hero.title }]} />
      <Container className="pb-12 md:pb-16">
        <h1 className="text-h1 font-extrabold tracking-tight max-w-[18ch]">{fm.hero.title}</h1>
        <div className="mt-8">
          <AnswerBlock question={tMeta("title")} answer={fm.hero.lead} />
        </div>
      </Container>
      <Section tone="paper">
        <Container className="grid gap-10 md:grid-cols-2">
          {fm.closing.paragraphs.map((p, i) => (
            <p key={i} className="max-w-[65ch] text-[1.0625rem]">{p}</p>
          ))}
        </Container>
      </Section>
      <Section>
        <Container className="max-w-[76ch]">
          <h2 className="text-h2 font-bold">{fm.approach.title}</h2>
          <div className="mt-6 flex flex-col gap-5">
            {fm.approach.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Container>
      </Section>
      <Section tone="paper">
        <Container>
          <h2 className="text-h2 font-bold">{fm.audiences.title}</h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fm.audiences.items.map((item, i) => (
              <li key={i} className="flex gap-4 rounded-card-lg border border-slate/10 bg-white p-6">
                <Icon name={item.icon as IconId} size={36} className="shrink-0" />
                <p className="text-[0.9375rem] leading-[1.6]">{item.text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-12 max-w-[40ch] text-[1.375rem] font-bold leading-snug">
            {fm.closingLine}
          </p>
        </Container>
      </Section>
      {fm.keyFacts && (
        <Section>
          <Container>
            <h2 className="text-h2 font-bold">{tFacts("project")}</h2>
            <KeyFacts
              className="mt-8"
              facts={[
                { term: tFacts("programme"), value: siteConfig.programmeLabel },
                { term: tFacts("duration"), value: `${siteConfig.durationsMonths} months` },
                { term: tFacts("period"), value: siteConfig.projectPeriod.label },
                { term: tFacts("number"), value: siteConfig.projectNumber },
              ]}
            />
          </Container>
        </Section>
      )}
    </>
  );
}
