import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { loadPage } from "@/lib/content/pages";
import { BreadcrumbSection } from "@/components/layout/Breadcrumbs";
import { Container, Section, Card } from "@/components/ui/LayoutPrimitives";
import { Icon } from "@/components/brand/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { SuperE } from "@/components/brand/SuperE";
import { buildMetadata } from "@/lib/seo/metadata";
import { webPageSchema, breadcrumbSchema, JsonLd } from "@/lib/seo/schemaorg";
import type { IconId } from "@/components/brand/Icon";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("metadata.the-pathway");
  return buildMetadata({ locale: locale as "en", route: "/the-pathway", title: t("title"), description: t("description") });
}

type PhaseFM = {
  key: string;
  fullName: string;
  chip: string;
  label?: string;
  icon: string;
  lead: string;
  cards: { title: string; body?: string; icon?: string; story?: boolean }[];
};

export default async function PathwayPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = await loadPage(locale as "en", "the-pathway");
  if (!page) notFound();
  const fm = page.frontmatter as {
    hero: { title: string; lead: string; pull: string };
    phases: PhaseFM[];
    supports: { title: string; body: string; icon: string }[];
    perspectiveShift: { title: string; pairs: { from: string; to: string }[] };
    cta: { exploreTools: string; companyCard: { title: string; body: string; route: string } };
  };
  const tMeta = await getTranslations("metadata.the-pathway");

  return (
    <>
      <JsonLd
        data={webPageSchema({ locale, route: "/the-pathway", name: tMeta("title"), description: tMeta("description") })}
      />
      <JsonLd data={breadcrumbSchema([{ name: tMeta("title"), route: "/" }, { name: fm.hero.title, route: "/the-pathway" }], locale)} />
      <BreadcrumbSection items={[{ label: fm.hero.title }]} />

      {/* Hero with chips as in-page anchors; all 3 phases present in static HTML (§6.4) */}
      <Container className="grid gap-10 pb-14 md:grid-cols-[1fr_1fr]">
        <div>
          <h1 className="max-w-[16ch] text-h1 font-semibold tracking-tight">{fm.hero.title}</h1>
          {fm.hero.pull && (
            <p className="mt-6 max-w-[26ch] text-[1.5rem] font-semibold leading-tight">{fm.hero.pull}</p>
          )}
        </div>
        <p className="max-w-[58ch] pt-2">{fm.hero.lead}</p>
      </Container>
      <Container className="pb-12 md:pb-16">
        <div className="grid gap-3 sm:grid-cols-3">
          {fm.phases.map((p, i) => (
            <a
              key={p.key}
              href={`#${p.key}`}
              className="flex items-center gap-3 rounded-input border border-slate/10 bg-white px-4 py-4 font-bold hover:bg-paper motion-safe"
            >
              <Icon name={p.icon as IconId} size={28} />
              <span>
                {i + 1}. {p.chip.charAt(0).toUpperCase() + p.chip.slice(1).toLowerCase()}
              </span>
            </a>
          ))}
        </div>
      </Container>

      {/* PhaseContinuum: three phase blocks, icon left, up to 4 info cards right */}
      <Section tone="paper">
        <Container className="flex flex-col gap-16 md:gap-20">
          {fm.phases.map((p) => (
            <PhaseBlock key={p.key} phase={p} />
          ))}
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="text-h2 font-semibold">What supports the pathway?</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {fm.supports.map((s) => (
              <Card key={s.title}>
                <Icon name={s.icon as IconId} size={44} />
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-2 text-[0.9375rem]">{s.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <div className="relative overflow-hidden bg-petrol-deep text-white">
        <SuperE tone="ghost" className="right-[-14%] bottom-[-22%] h-[36rem] w-[36rem]" />
        <Container as="section" className="relative py-16 md:py-20">
          <h2 className="text-h2 font-semibold">{fm.perspectiveShift.title}</h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fm.perspectiveShift.pairs.map((pair, i) => (
              <li key={i} className="border-t border-white/20 pt-4 text-[1.0625rem]">
                {pair.from} <span aria-hidden="true" className="mx-1 text-rust">→</span>{" "}
                <strong>{pair.to}</strong>
              </li>
            ))}
          </ul>
        </Container>
      </div>

      <Section tone="paper">
        <Container className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <ButtonLink href={fm.cta.exploreTools}>Explore the project tools</ButtonLink>
          <Card className="bg-rust text-white md:max-w-md">
            <h2 className="text-[1.25rem] font-semibold">{fm.cta.companyCard.title}</h2>
            <p className="mt-2 max-w-[40ch] opacity-90">{fm.cta.companyCard.body}</p>
            <ButtonLink href={fm.cta.companyCard.route} variant="outlineLight" className="mt-4">
              Ready for Inclusion
            </ButtonLink>
          </Card>
        </Container>
      </Section>
    </>
  );
}

function PhaseBlock({ phase }: { phase: PhaseFM }) {
  const infoCards = phase.cards.filter((c) => !c.story && c.body);
  return (
    <article id={phase.key} className="scroll-mt-28 grid gap-8 lg:grid-cols-[0.9fr_1.4fr]">
      <div>
        {phase.label && <p className="u-label text-petrol-deep">{phase.label}</p>}
        {/* Full names from the architecture text: Protected Gym / Pre-corporate
            preparation / Work-based learning in SMEs — never truncated. */}
        <h2 className="mt-2 max-w-[18ch] text-h2 font-semibold">{phase.fullName}</h2>
        <p className="mt-3 max-w-[58ch] text-[1rem]">{phase.lead}</p>
        <Icon name={phase.icon as IconId} size={96} className="mt-8 hidden md:block" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {infoCards.map((c, i) => (
          <Card key={i} className="bg-white">
            {c.icon && <Icon name={c.icon as IconId} size={36} />}
            <h3 className="mt-3 font-semibold">{c.title}</h3>
            <p className="mt-2 text-[0.9375rem]">{c.body}</p>
          </Card>
        ))}
        {/* Story cards render only when a published, consent-verified story exists — typed gap otherwise (§0.4.5). feature-flagged at build. */}
        <StoryCard />
      </div>
    </article>
  );
}

/** Hidden while no story is published (features.showStories = false). */
function StoryCard() {
  return null;
}
