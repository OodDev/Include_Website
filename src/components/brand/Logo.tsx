import Link from "next/link";
import { getTranslations } from "next-intl/server";

/**
 * Official polychrome wordmark extracted as vector paths from the
 * owner-supplied "Include 2 GRAFICA.pdf" (page 1, "PROVE COLORE" multicolour
 * variant) with `mutool draw -F svg` — original artwork, no tracing
 * (docs/owner-inputs.md). TODO(brand-asset): monochrome/negative variants are
 * still awaited; the negative context keeps the authorised text placeholder.
 */
type LogoVariant = "slate" | "negative";

export async function Logo({
  variant = "slate",
  href,
}: {
  variant?: LogoVariant;
  href: string;
}) {
  const t = await getTranslations("common");
  return (
    <Link href={href} aria-label={t("toHome")} className="inline-block">
      {variant === "negative" ? (
        <span className="font-sans text-[1.375rem] font-extrabold tracking-[0.02em] text-white">
          INCLUDE
        </span>
      ) : (
        // Decorative: the link already carries the accessible name.
        // eslint-disable-next-line @next/next/no-img-element -- owner SVG asset in /public; next/image would need dangerouslyAllowSVG for zero benefit.
        <img
          src="/brand/include-logo-multicolour.svg"
          alt=""
          width={196}
          height={67}
          className="block h-auto"
        />
      )}
    </Link>
  );
}
