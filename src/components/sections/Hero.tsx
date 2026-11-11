import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/LayoutPrimitives";
import { SuperE } from "@/components/brand/SuperE";
import { HomeFactsStrip } from "./FactsStrip";

/**
 * Hero (§6.2 #1): eyebrow, H1, lead, intro, CTAs, FactsStrip.
 * Petrolio immersive direction (mockup variation 3, D17/D18): full-bleed
 * petrol→petrol-deep gradient with metrics straight from the mockup
 * (100/110px padding, 54vw giant "e", 19ch H1), white type with light ledes,
 * white/inverse CTAs; fact cards straddle the hero seam.
 */
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

  return (
    <>
      <div
        className="relative overflow-hidden text-white motion-safe"
        style={{ background: "linear-gradient(135deg, var(--color-petrol) 0%, var(--color-petrol-deep) 100%)" }}
      >
        <SuperE tone="hero" className="right-[-12vw] top-[-16vw] h-[54vw] w-[54vw] min-w-[520px]" />
        <Container className="relative pb-[110px] pt-[100px]">
          <p className="u-kick flex items-center gap-3.5 text-white">
            <span aria-hidden="true" className="h-0.5 w-11 shrink-0 bg-white/70" />
            {hero.eyebrow}
          </p>
          <h1 className="mt-5 max-w-[19ch] text-h1 font-semibold leading-[1.04] tracking-[-0.01em]">
            {hero.title}
          </h1>
          <p className="mt-5 max-w-[48ch] text-[1.13rem] leading-[1.7] font-light">{hero.lead}</p>
          <p className="mt-4 max-w-[65ch] font-light leading-[1.7]">{hero.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3.5">
            <ButtonLink href="/the-project" variant="inverse">
              {t("ctaPrimary")}
            </ButtonLink>
            <ButtonLink href="/ready-for-inclusion" variant="outlineLight">
              {t("ctaCompany")}
            </ButtonLink>
          </div>
        </Container>
      </div>
      {/* Fact cards straddle the hero/section seam like the mockup's stats row
          (margin-top −64px, petrol-cast shadow). They must live OUTSIDE the
          hero's overflow-hidden wrapper to cross the edge. */}
      <Container className="relative z-10 -mt-16">
        <HomeFactsStrip />
      </Container>
    </>
  );
}
