/**
 * SuperE — the huge tone-on-tone supergraphic (§5.5): cropped by the container
 * edge, one memorable gesture. TODO(brand-asset): uses the neutral "e"
 * placeholder glyph until the official mark arrives. Decorative only:
 * aria-hidden, pointer-events none, must never reduce text contrast.
 */
export function SuperE({
  tone = "white",
  className = "",
}: {
  /**
   * Ground tone the graphic sits on:
   * "white" → mist fill (light grounds),
   * "slate"/"petrol" → translucent white (dark grounds),
   * "hero" → petrol-deep tone-on-tone on the petrol hero gradient,
   * "ghost" → petrol at 55% on petrol-deep bands (variation 3, D17),
   * "paper" → petrol-deep watermark at 8% on white grounds (D18).
   */
  tone?: "white" | "slate" | "petrol" | "hero" | "ghost" | "paper";
  className?: string;
}) {
  const fill =
    tone === "slate"
      ? "rgba(255, 255, 255, 0.12)"
      : tone === "petrol"
        ? "rgba(255, 255, 255, 0.14)"
        : tone === "hero" || tone === "paper"
          ? "var(--color-petrol-deep)"
          : tone === "ghost"
            ? "var(--color-petrol)"
            : "var(--color-mist)";
  const dotFill =
    tone === "white" ? "var(--color-white)" : "var(--color-rust)";
  const glyphOpacity =
    tone === "ghost" ? 0.55 : tone === "hero" ? 0.9 : tone === "paper" ? 0.08 : 1;
  /* The band ghost is the bare letterform (no person-dot) per the mockup. */
  const showDot = tone !== "ghost" && tone !== "paper";

  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
      className={`super-e-parallax motion-safe pointer-events-none select-none ${className}`}
      style={{ position: "absolute", overflow: "visible", opacity: glyphOpacity }}
    >
      {/* Neutral placeholder for the cropped supergraphic e — TODO(brand-asset) */}
      <text
        x="96"
        y="78"
        textAnchor="middle"
        fontSize="100"
        fontWeight="600"
        fontFamily="var(--font-sans, Outfit), system-ui, sans-serif"
        fill={fill}
      >
        e
      </text>
      <circle cx="72" cy="42" r="9" fill={dotFill} style={{ visibility: showDot ? "visible" : "hidden" }} />
    </svg>
  );
}
