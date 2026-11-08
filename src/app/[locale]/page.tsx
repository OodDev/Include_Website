import { setRequestLocale } from "next-intl/server";
import type { IconId } from "@/components/brand/Icon";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { StatementBand } from "@/components/sections/StatementBand";
import { AmbitionCards, PhaseTeaser } from "@/components/sections/AmbitionCards";
import { Manifesto, AudienceCards, FeaturedResources, NetworkBand } from "@/components/sections/HomeSections";
import { StayConnected } from "@/components/sections/StayConnected";
import { loadPage } from "@/lib/content/pages";
import { buildMetadata } from "@/lib/seo/metadata";
import { webPageSchema, JsonLd } from "@/lib/seo/schemaorg";
import { getTranslations } from "next-intl/server";
import { features } from "@/config/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("metadata.home");
  return buildMetadata({ locale: locale as "en", route: "/", title: t("title"), description: t("description") });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Home content is the approved architecture narrative; the page still guards
  // against a missing document with a typed 404 rather than placeholder copy.
  const page = await loadPage(locale as "en", "home");
  if (!page) notFound();
  const fm = page.frontmatter as {
    hero: { eyebrow: string; title: string; lead: string; intro: string };
    statement: { title: string; body: string; pull: string | null; cta?: { route: string } };
    ambitions: { title: string; body: string; icon: IconId }[];
    manifesto: string;
    pathwayTeaser: { label: string; sub: string }[];
    audiences: { title: string; body: string; route: string; icon: string }[];
  };

  const metaT = await getTranslations("metadata.home");
  return (
    <>
      <JsonLd
        data={webPageSchema({
          locale,
          route: "/",
          name: metaT("title"),
          description: metaT("description"),
        })}
      />
      <Hero hero={fm.hero} />
      <StatementBand statement={fm.statement} />
      <AmbitionCards ambitions={fm.ambitions} />
      <PhaseTeaser cards={fm.pathwayTeaser} />
      <Manifesto text={fm.manifesto} />
      <AudienceCards cards={fm.audiences} />
      <FeaturedResources locale={locale} />
      {features.showStories && null}
      <NetworkBand />
      <StayConnected />
    </>
  );
}
