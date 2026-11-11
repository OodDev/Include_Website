/**
 * Ready for Inclusion label — OFFICIAL badge files from the owner's graphic
 * designer (`ready-for-inclusion/*.svg`, received 2026-11-11; mirrored in
 * `assets/brand/ready-for-inclusion/`, served from `/public/brand/`). The
 * badge text is converted to outlines in the files, so a plain <img> needs
 * no web font and shows the exact approved artwork. One badge file per
 * variant; only the rendered height changes.
 *
 * Former neutral composition (placeholder "e" + text stack) removed —
 * docs/owner-inputs.md.
 */
type ReadyVariant = "slate" | "sky-person" | "plaque-slate" | "plaque-petrol" | "horizontal" | "web-band";

type Badge = {
  src: string;
  /** Official viewBox dimensions. */
  w: number;
  h: number;
  /** Rendered heights: [sm, md]. */
  size: [number, number];
};

const BADGES: Record<ReadyVariant, Badge> = {
  "plaque-slate": {
    src: "/brand/rfi-targa-ardesia.svg",
    w: 176,
    h: 303.2,
    size: [136, 168],
  },
  "plaque-petrol": {
    src: "/brand/rfi-targa-petrolio.svg",
    w: 176,
    h: 303.2,
    size: [136, 168],
  },
  slate: {
    src: "/brand/rfi-verticale-ardesia.svg",
    w: 120,
    h: 247.2,
    size: [104, 128],
  },
  "sky-person": {
    src: "/brand/rfi-verticale-cielo-punto-ruggine.svg",
    w: 120,
    h: 247.2,
    size: [104, 128],
  },
  horizontal: {
    src: "/brand/rfi-orizzontale-ardesia.svg",
    w: 140.4,
    h: 88.9,
    size: [56, 72],
  },
  "web-band": {
    src: "/brand/rfi-orizzontale-fascia-petrolio.svg",
    w: 176.4,
    h: 124.9,
    size: [56, 72],
  },
};

export function ReadyLabel({
  variant = "slate",
  size = "md",
  className = "",
}: {
  variant?: ReadyVariant;
  size?: "sm" | "md";
  className?: string;
}) {
  const badge = BADGES[variant];
  const height = size === "sm" ? badge.size[0] : badge.size[1];
  const width = Math.round((height * badge.w) / badge.h);
  return (
    /* eslint-disable-next-line @next/next/no-img-element -- owner SVG asset in /public; next/image would need dangerouslyAllowSVG for zero benefit. */
    <img
      src={badge.src}
      alt="Ready for Inclusion"
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className={`inline-block h-auto ${className}`}
    />
  );
}
