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
  /** Ground tone the graphic sits on ("white" → mist fill; "slate" → tone-on-tone). */
  tone?: "white" | "slate" | "petrol";
  className?: string;
}) {
  const fill =
    tone === "slate"
      ? "rgba(255, 255, 255, 0.12)"
      : tone === "petrol"
        ? "rgba(255, 255, 255, 0.14)"
        : "var(--color-mist)";
  const dotFill =
    tone === "white" ? "var(--color-white)" : "var(--color-rust)";

  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
      className={`super-e-parallax motion-safe pointer-events-none select-none ${className}`}
      style={{ position: "absolute", overflow: "visible" }}
    >
      {/* Neutral placeholder for the cropped supergraphic e — TODO(brand-asset) */}
      <text
        x="96"
        y="78"
        textAnchor="middle"
        fontSize="100"
        fontWeight="800"
        fontFamily="var(--font-manrope, Manrope), system-ui, sans-serif"
        fill={fill}
      >
        e
      </text>
      <circle cx="72" cy="42" r="9" fill={dotFill} />
    </svg>
  );
}
