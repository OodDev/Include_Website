import { getTranslations } from "next-intl/server";
import { Container, Section, Card } from "@/components/ui/LayoutPrimitives";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/brand/Icon";
import { ReadyLabel } from "@/components/brand/ReadyLabel";
import { StatusChip } from "@/components/ui/Chip";
import { features } from "@/config/site";
import { listResources } from "@/lib/content/data";
import { localisedField } from "@/lib/utils/i18nEntry";

/** Manifesto (§6.2 #5): large quiet statement. */
export async function Manifesto({ text }: { text: string }) {
  return (
    <Section>
      <Container as="nav" className="max-w-[76rem]">
        <p className="max-w-[24ch] text-[clamp(2rem,1.2rem+3.4vw,3.25rem)] font-semibold leading-[1.12] tracking-tight">
          {text}
        </p>
      </Container>
    </Section>
  );
}

/** AudienceCards (§6.2 #6): "Where do you want to start?" — V3 white cards
 *  with rust/petrol/petrol-deep bottom edges and petrol-deep "find out" links. */
const AUDIENCE_EDGES = ["border-b-rust", "border-b-petrol", "border-b-petrol-deep"] as const;

export async function AudienceCards({
  cards,
}: {
  cards: { title: string; body: string; route: string; icon: string }[];
}) {
  const t = await getTranslations("home");
  const tCard = t("cardCta");
  const icons = ["person", "company", "policy-institutions"] as const;
  return (
    <Section tone="paper">
      <Container>
        <h2 className="text-h2 font-semibold">{t("audienceTitle")}</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {cards.map((c, i) => (
            <a
              key={c.title}
              href={c.route}
              className={`group flex flex-col rounded-card-lg border border-slate/15 border-b-[5px] bg-white p-6
                transition-transform duration-200 hover:-translate-y-1 motion-safe ${AUDIENCE_EDGES[i % 3]}`}
            >
              <Icon name={icons[i] ?? "person"} size={48} />
              <h3 className="mt-5 text-[1.25rem] font-semibold">{c.title}</h3>
              <p className="mt-3 text-slate/80">{c.body}</p>
              <p
                aria-hidden="true"
                className="mt-auto pt-4 font-semibold text-petrol-deep group-hover:text-rust"
              >
                {tCard} →
              </p>
              <span className="sr-only">{tCard}</span>
            </a>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/** Featured resources (§6.2 #7) — resource cards with status chips; CTA to Results & Tools. */
export async function FeaturedResources({ locale }: { locale: string }) {
  const t = await getTranslations("statusLabels");
  const tHome = await getTranslations("home");
  const tResults = await getTranslations("results");
  const all = (await listResources()).filter((r) => !r.needsClientApproval || features.protocolResource);
  const featured = all.filter((r) => r.featured).slice(0, 4);
  if (featured.length === 0) return null;
  return (
    <Section>
      <Container>
        <h2 className="text-h2 font-semibold">{tHome("producesTitle")}</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((r) => (
            <Card key={r.slug} className="flex flex-col justify-between gap-6">
              <div>
                <h3 className="text-[1.0625rem] font-semibold leading-snug">
                  {localisedField(locale, r, "title")}
                </h3>
              </div>
              <div>
                <StatusChip status={r.status}>{t(r.status)}</StatusChip>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-8">
          {/* CTA per the architecture's Results & Tools note — the repository
              is the destination, so this is not the hero's "Discover the project". */}
          <ButtonLink href="/results-and-tools" variant="outline">
            {tResults("downloadCta")}
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}

/** NetworkBand (§6.2 #9): petrol-deep band with the Ready for Inclusion label and targets. */
export async function NetworkBand() {
  const tHome = await getTranslations("home");
  return (
    <Section tone="petrol-deep">
      <Container className="flex flex-col items-start gap-8 md:flex-row md:items-center">
        <ReadyLabel variant="plaque-petrol" className="shrink-0" />
        <div>
          <h2 className="text-h2 font-semibold">{tHome("networkTitle")}</h2>
          <p className="mt-4 max-w-[62ch] font-light">
            {tHome("networkTargetLabel", {
              companiesPerCountry: 20,
              smesReached: 400,
            })}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href="/ready-for-inclusion#ambassador-network" variant="outlineLight">
              {tHome("whyCta")}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
