import { getTranslations } from "next-intl/server";
import { Container, Section } from "@/components/ui/LayoutPrimitives";
import { Card } from "@/components/ui/LayoutPrimitives";
import { Icon, type IconId } from "@/components/brand/Icon";
import { ButtonLink } from "@/components/ui/Button";

/** AmbitionCards (§6.2 #3): what we plan to achieve — plans labelled as plans. */
export async function AmbitionCards({
  ambitions,
}: {
  ambitions: { title?: string; titleKey?: string; body: string; icon: IconId }[];
}) {
  const t = await getTranslations(); // root namespace — frontmatter carries full-path keys
  return (
    <Section tone="paper">
      <Container>
        <h2 className="text-h2 font-bold">{t("home.ambitionsTitle")}</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {ambitions.map((a) => (
            <Card key={a.titleKey ?? a.title ?? a.icon} className="bg-white">
              <Icon name={a.icon} size={48} />
              <h3 className="mt-5 text-[1.25rem] font-bold">{a.title ?? (a.titleKey ? t(a.titleKey) : "")}</h3>
              <p className="mt-3 opacity-80">{a.body}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/** PhaseContinuum teaser (§6.2 #4) — links to The Pathway. Copy passed from content. */
export async function PhaseTeaser({
  cards,
}: {
  cards: { label: string; sub: string }[];
}) {
  const t2 = await getTranslations("home");
  const icons: IconId[] = ["protected-context", "pre-corporate", "labour-market"];
  return (
    <Section tone="paper">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-h2 font-bold">{t2("pathwayTeaserTitle")}</h2>
          <ButtonLink href="/the-pathway" variant="ghost">
            {t2("ctaPrimary")}
          </ButtonLink>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {cards.map((c, i) => (
            <Card key={c.label} className="bg-white">
              <Icon name={icons[i] ?? "pathway"} size={44} />
              <p className="mt-5 u-label">{c.label}</p>
              <p className="mt-3 text-[1.0625rem] leading-[1.5]">{c.sub}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
