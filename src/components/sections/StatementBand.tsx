import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/LayoutPrimitives";
import { ButtonLink } from "@/components/ui/Button";

/** StatementBand (§6.2 #2): slate band — why companies, pull line, CTA. */
export async function StatementBand({
  statement,
}: {
  statement: { title: string; body: string; pull: string | null; cta?: { route: string } };
}) {
  const t = await getTranslations("home");
  return (
    <div className="bg-slate text-white">
      <Container as="section" className="grid gap-10 py-16 md:grid-cols-[1fr_1.2fr] md:py-24">
        <h2 className="text-h2 font-bold leading-tight">{statement.title}</h2>
        <div>
          {statement.pull && (
            <p className="mb-8 max-w-[46ch] text-[1.1875rem] font-semibold">{statement.pull}</p>
          )}
          {statement.body.split("\n\n").map((p, i) => (
            <p key={i} className="mb-4 max-w-[65ch] leading-[1.65] last:mb-0 opacity-90">
              {p}
            </p>
          ))}
          {statement.cta?.route && (
            <ButtonLink href={statement.cta.route} variant="outlineLight" className="mt-8">
              {t("whyCta")}
            </ButtonLink>
          )}
        </div>
      </Container>
    </div>
  );
}
