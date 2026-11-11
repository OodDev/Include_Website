import { E_ASPECT, E_EYE_PATH, E_LETTER_PATH, E_VIEWBOX } from "./eMark";

/**
 * Official "e" short mark — verbatim geometry from the owner-supplied
 * vector files (`e/*.svg`, received 2026-11-11, mirrored in
 * `assets/brand/e/`). Replaces the former neutral Manrope placeholder
 * (docs/owner-inputs.md). The letter is one evenodd path whose eye is a
 * hole; `dot` adds the rust person-dot inside it (owner file pair
 * `e-<tone>.svg` / `e-<tone>-punto-ruggine.svg`).
 */
type Tone = "slate" | "white" | "sky" | "petrol";

const toneFill: Record<Tone, string> = {
  slate: "var(--color-slate)",
  white: "var(--color-white)",
  sky: "var(--color-sky)",
  petrol: "var(--color-petrol)",
};

export function LogoMark({
  size = 48,
  dot = true,
  tone = "slate",
  className = "",
}: {
  /** Rendered width in px; height follows the official 196:264 aspect. */
  size?: number;
  /** rust person-dot in the eye; `false` leaves the eye transparent. */
  dot?: boolean;
  tone?: Tone;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={Math.round(size / E_ASPECT)}
      viewBox={E_VIEWBOX}
      role="img"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={E_LETTER_PATH} fillRule="evenodd" fill={toneFill[tone]} />
      {dot && <path d={E_EYE_PATH} fill="var(--color-rust)" />}
    </svg>
  );
}
