import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/LayoutPrimitives";
import { SuperE } from "@/components/brand/SuperE";
import { PhaseTrack } from "@/components/brand/PhaseTrack";
import { HomeFactsStrip } from "./FactsStrip";

/** Hero (§6.2 #1): eyebrow, H1, lead, intro, FactsStrip, CTAs, PhaseTrack over SuperE.
 *  The one signature moment lives in the PhaseTrack person-dot (§8). */
export async function Hero({
  hero,
}: {
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    intro: string;
  };
}) {
  const t = await getTranslations("home");
  const labels = {
    protected: t("phaseLabels.protected"),
    "pre-corporate": t("phaseLabels.preCorporate"),
    "open-market": t("phaseLabels.openMarket"),
  };

  return (
    <div className="relative overflow-hidden bg-white">
      <SuperE tone="white" className="right-[-14%] top-[-30%] h-[60rem] w-[60rem]" />
      <Container className="relative grid gap-10 pb-16 pt-12 md:pb-24 md:pt-20 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <p className="u-label text-rust">{hero.eyebrow}</p>
          <h1 className="mt-4 max-w-[16ch] text-h1 font-extrabold leading-[1.05] tracking-tight">
            {hero.title}
          </h1>
          <p className="mt-6 max-w-[62ch] text-[1.1875rem] font-semibold">{hero.lead}</p>
          <p className="mt-4 max-w-[65ch]">{hero.intro}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href="/the-project">{t("ctaPrimary")}</ButtonLink>
            <ButtonLink href="/ready-for-inclusion" variant="outline">
              {t("ctaCompany")}
            </ButtonLink>
          </div>
        </div>
        <div className="relative w-full max-w-xl py-10 lg:justify-self-end">
          <PhaseTrack labels={labels} />
          <p className="mt-4 text-center md:text-left" hidden aria-hidden="true"></p>
        </div>
      </Container>
      <Container className="relative pb-10">
        <HomeFactsStrip />
      </Container>
    </div>
  );
}
