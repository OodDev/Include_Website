import Link from "next/link";
import { getTranslations } from "next-intl/server";

/**
 * Official polychrome wordmark supplied by the owner as a vector file
 * ("Main_Logo.svg"), copied verbatim to /public/brand/include-logo.svg —
 * no tracing, no recreation. Replaces the intermediate PDF-extracted
 * placeholder (docs/owner-inputs.md).
 * The "negative" variant is the same original geometry with all fills set to
 * white (/public/brand/include-logo-white.svg) — the only change is fill
 * colour; no letterform was redrawn.
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
      {/* Decorative: the link already carries the accessible name. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- owner SVG asset in /public; next/image would need dangerouslyAllowSVG for zero benefit. */}
      <img
        src={
          variant === "negative"
            ? "/brand/include-logo-white.svg"
            : "/brand/include-logo.svg"
        }
        alt=""
        width={505}
        height={157}
        className="block h-auto w-40"
      />
    </Link>
  );
}
