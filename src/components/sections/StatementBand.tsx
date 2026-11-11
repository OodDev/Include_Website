import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/LayoutPrimitives";
import { ButtonLink } from "@/components/ui/Button";
import { SuperE } from "@/components/brand/SuperE";

/** StatementBand (§6.2 #2): "Why companies" — first section after the hero.
 *  D18 (owner request): WHITE ground instead of the mockup's petrol-deep band,
 *  with the palette remapped sensibly — slate body, petrol-deep pull line and
 *  outline CTA, low-opacity petrol-deep watermark "e" (tone "paper"). */
export async function StatementBand({
  statement,
}: {
  statement: { title: string; body: string; pull: string | null; cta?: { route: string } };
}) {
  const t = await getTranslations("home");
  return (
    <div className="relative overflow-hidden bg-white text-slate">
      <SuperE tone="paper" className="left-[-18vw] bottom-[-20vw] h-[52vw] min-w-[480px]" />
      <Container as="section" className="relative grid gap-10 py-[90px] md:grid-cols-[1fr_1.2fr]">
        <h2 className="text-h2 font-semibold leading-[1.08] tracking-[-0.01em]">{statement.title}</h2>
        <div>
          {statement.pull && (
            <p className="mb-8 max-w-[46ch] text-[1.1875rem] font-semibold text-petrol-deep">{statement.pull}</p>
          )}
          {/* Content may store escaped newlines ("\n\n" as literal text); split
              on both real and escaped paragraph breaks — no copy change. */}
          {statement.body.split(/\\n\\n|\n\n/).map((p, i) => (
            <p key={i} className="mb-4 max-w-[52ch] leading-[1.75] text-slate last:mb-0">
              {p}
            </p>
          ))}
          {statement.cta?.route && (
            <ButtonLink href={statement.cta.route} variant="outline" className="mt-8">
              {t("whyCta")}
            </ButtonLink>
          )}
        </div>
      </Container>
    </div>
  );
}
