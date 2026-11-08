import Link from "next/link";
import { getTranslations } from "next-intl/server";

/**
 * TODO(brand-asset): Replace with the official polychrome / mono / negative SVG
 * logo variants once the owner supplies vector files (docs/owner-inputs.md).
 * The supplied PDFs contain no extractable vector data (docs/decisions.md D01),
 * and redrawing or auto-tracing the letterforms is prohibited (§2.4).
 * This is the sanctioned neutral placeholder: plain Manrope text.
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
    <Link
      href={href}
      aria-label={t("toHome")}
      className={`font-sans text-[1.375rem] font-extrabold tracking-[0.02em]
        ${variant === "negative" ? "text-white" : "text-slate"}`}
    >
      INCLUDE
    </Link>
  );
}
