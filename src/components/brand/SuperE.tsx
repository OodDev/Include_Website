import { E_LETTER_PATH, E_VIEWBOX } from "./eMark";

/**
 * SuperE — the huge tone-on-tone supergraphic (§5.5): cropped by the container
 * edge, one memorable gesture. Uses the OFFICIAL supergraphic "e" (owner
 * vector file e/e-nebbia-supergrafica.svg, received 2026-11-11 — see
 * eMark.ts): the BARE letterform, no person-dot (the owner's supergraphic
 * variant is dotless; the eye hole shows the ground through). Decorative
 * only: aria-hidden, pointer-events none, must never reduce text contrast.
 * The element aspect must match the official 196:264 letter box (callers
 * size with that ratio).
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
  const glyphOpacity =
    tone === "ghost" ? 0.55 : tone === "hero" ? 0.9 : tone === "paper" ? 0.08 : 1;

  return (
    <svg
      viewBox={E_VIEWBOX}
      aria-hidden="true"
      focusable="false"
      className={`super-e-parallax motion-safe pointer-events-none select-none ${className}`}
      style={{ position: "absolute", overflow: "visible", opacity: glyphOpacity }}
    >
      <path d={E_LETTER_PATH} fillRule="evenodd" fill={fill} />
    </svg>
  );
}
