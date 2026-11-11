/**
 * TODO(brand-asset): The official whole, filled "e" short mark (from the logo's
 * final letter, with the white eye and optional rust person-dot) must be
 * supplied by the owner as SVG (docs/owner-inputs.md). The supplied PDFs are
 * raster-only and the letterform must never be redrawn or auto-traced (§2.4),
 * so this is the sanctioned neutral placeholder: a plain Manrope "e" glyph
 * with the eye rendered as a circle — not an imitation of the letterform.
 */
type Tone = "slate" | "white" | "sky" | "petrol";

export function LogoMark({
  size = 48,
  dot = true,
  tone = "slate",
  className = "",
}: {
  /** Rendered pixel size (square). Favicons: 24 / 48. */
  size?: number;
  /** rust person-dot in the eye; `false` shows the plain (white) eye. */
  dot?: boolean;
  tone?: Tone;
  className?: string;
}) {
  const glyphFill =
    tone === "white"
      ? "var(--color-white)"
      : tone === "sky"
        ? "var(--color-sky)"
        : tone === "petrol"
          ? "var(--color-petrol)"
          : "var(--color-slate)";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <text
        x="24"
        y="36.5"
        textAnchor="middle"
        fontSize="46"
        fontWeight="800"
        fontFamily="var(--font-sans, Outfit), system-ui, sans-serif"
        fill={glyphFill}
      >
        e
      </text>
      <circle
        cx="24"
        cy="21"
        r="4.6"
        fill={dot ? "var(--color-rust)" : "var(--color-white)"}
      />
    </svg>
  );
}
