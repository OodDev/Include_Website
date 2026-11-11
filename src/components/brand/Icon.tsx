/**
 * OFFICIAL icon set (exploration 03, 24 icons, 4 families — §5.6).
 *
 * Geometry is verbatim from the owner-supplied vector files
 * (Brand kit INCLUDE-SVGs_logos_and_icons/icone, received 2026-11-11;
 * mirrored in `assets/brand/icone/`). Designer rules, confirmed by the
 * files themselves: 48×48 grid, stroke 7 (not expanded, rounded terminals),
 * structure + accents in one tone, the person is always ONE RUST DOT.
 *
 * Colour fidelity: the files bake the structure colour per variant
 * (cielo/ardesia/bianco — no petrolio variant was supplied). To keep the
 * D17 petrolio art direction working, the geometry is rendered with the
 * structure colour as a custom property (`--icon-structure`, set by the
 * `tone` prop) and rust left as the Brand-01 token — no path was redrawn.
 * On slate grounds the structure stays per tone choice; legible at 24 px.
 *
 * "home" is the ONE exception: wayfinding glyph not in the owner sheet,
 * drawn in the set's own system (48 grid, stroke 7, rust dot).
 * TODO(brand-asset): confirm with the owner; replace with an official
 * glyph if one is supplied.
 */
export const iconIds = [
  "home", // wayfinding (navbar); not in the owner sheet — drawn in the set's own system, flagged below
  // Pathway
  "protected-context",
  "pre-corporate",
  "labour-market",
  "pathway",
  "threshold",
  "connection",
  // People & companies
  "person",
  "skills",
  "training",
  "autonomy",
  "company",
  "ready-for-inclusion",
  // Tools
  "european-protocol",
  "micro-credentials",
  "technical-passport",
  "white-paper",
  "toolkit",
  "policy-institutions",
  // Values & storytelling
  "recognition",
  "participation",
  "reciprocity",
  "stories",
  "data-impact",
  "events",
] as const;

export type IconId = (typeof iconIds)[number];

/** Icon structure colour is a custom property so the tone can be set per
 * instance without re-declaring the path data. Default: petrol — the
 * petrolio-direction structure colour (mockup variation 3, D17); "sky"
 * preserves the original exploration-03 look; "white" is for dark grounds;
 * "slate" matches the designer's ardesia variant. */
const STRUCTURE = "var(--icon-structure, var(--color-petrol))";
const RUST = "var(--color-rust)";

/** Each icon draws in a 48×48 viewBox (official files: stroke 7). */
const paths: Record<IconId, React.ReactNode> = {
  /* Wayfinding — done in set style (structure + rust dot, 48-unit grid, stroke 7)
     but NOT part of the owner's sheet. TODO(brand-asset): confirm. */
  home: (
    <>
      <path
        d="M10 21.5V35a4 4 0 0 0 4 4h20a4 4 0 0 0 4-4V21.5M6 25 24 9l18 16"
        fill="none"
        stroke={STRUCTURE}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="30" r="4.5" fill={RUST} />
    </>
  ),

  /* ── Pathway ─────────────────────────────────────────────────────────── */
  "protected-context": (
    <g fill="none" stroke={STRUCTURE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9.5" y="9.5" width="29" height="29" rx="9" />
      <circle fill={RUST} stroke="none" cx="24" cy="24" r="5" />
    </g>
  ),
  "pre-corporate": (
    <g fill="none" stroke={STRUCTURE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M37 9.5H19a9.5 9.5 0 0 0-9.5 9.5v10a9.5 9.5 0 0 0 9.5 9.5h18" />
      <circle fill={RUST} stroke="none" cx="21" cy="24" r="5" />
      <circle fill={RUST} stroke="none" cx="31" cy="24" r="2.3" />
      <circle fill={RUST} stroke="none" cx="38.5" cy="24" r="2.3" />
    </g>
  ),
  "labour-market": (
    <g fill="none" stroke={STRUCTURE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <circle fill={STRUCTURE} stroke="none" cx="25" cy="27" r="6" />
      <circle fill={RUST} stroke="none" cx="11" cy="11" r="3.6" />
      <circle fill={RUST} stroke="none" cx="31" cy="10" r="2.6" />
      <circle fill={RUST} stroke="none" cx="40" cy="31" r="3.2" />
      <circle fill={RUST} stroke="none" cx="13" cy="40" r="3.6" />
    </g>
  ),
  pathway: (
    <g fill="none" stroke={STRUCTURE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 24h20" />
      <circle fill={RUST} stroke="none" cx="38" cy="24" r="5.5" />
    </g>
  ),
  threshold: (
    <g fill="none" stroke={STRUCTURE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13.5 41V9.5h21V41" />
      <circle fill={RUST} stroke="none" cx="24" cy="29" r="5" />
    </g>
  ),
  connection: (
    <g fill="none" stroke={STRUCTURE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 24h18" />
      <circle fill={STRUCTURE} stroke="none" cx="11" cy="24" r="6.5" />
      <circle fill={RUST} stroke="none" cx="37" cy="24" r="6.5" />
    </g>
  ),
  /* ── People & companies ──────────────────────────────────────────────── */
  person: (
    <g fill="none" stroke={STRUCTURE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.5 39.5V38a11.5 11.5 0 0 1 23 0v1.5" />
      <circle fill={RUST} stroke="none" cx="24" cy="13" r="5.5" />
    </g>
  ),
  skills: (
    <g fill="none" stroke={STRUCTURE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 39.5h9.5v-8h9v-8h13.5" />
      <circle fill={RUST} stroke="none" cx="35" cy="12.5" r="5.5" />
    </g>
  ),
  training: (
    <g fill="none" stroke={STRUCTURE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 19c-4.5-3-9.5-3.5-14.5-2.5v21c5-1 10-.5 14.5 2.5 4.5-3 9.5-3.5 14.5-2.5v-21c-5-1-10-.5-14.5 2.5z" />
      <circle fill={RUST} stroke="none" cx="24" cy="8.5" r="4.5" />
    </g>
  ),
  autonomy: (
    <g fill="none" stroke={STRUCTURE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 41.5V29L13.5 17M24 29l6-7" />
      <circle fill={RUST} stroke="none" cx="36" cy="15" r="5.5" />
    </g>
  ),
  company: (
    <g fill="none" stroke={STRUCTURE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.5 41V9.5H30V41M6.5 41h35M30 22h7.5V41" />
      <circle fill={RUST} stroke="none" cx="20.75" cy="31" r="4.5" />
    </g>
  ),
  "ready-for-inclusion": (
    <g fill="none" stroke={STRUCTURE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      {/* Official "e" mark scaled into the icon cell (as in the owner file). */}
      <g transform="translate(10 4.5) scale(0.143)">
        <path fill={STRUCTURE} stroke="none" fillRule="evenodd" d="M132.7 189.3C129.2 188.1 129.1 183.2 132.5 181.9C166.8 169.1 192 137.7 194.2 99.7C197.1 48 156.2 3.4 103 0.4C49.7 -2.6 4 37 1.1 88.7C0.9 90.9 0.9 93.1 0.9 95.3C-0.1 139.8 13.1 177 40.2 205.8C81.5 249.6 143.3 259.3 170.2 262.1C180.3 263.1 183.6 255.4 183.6 251.7L183.5 210.4C183.5 203.9 178.6 198.4 172.1 197.8C162.5 196.7 148 194.4 132.7 189.3ZM99.3 64.5C117.2 65.5 131 79.7 130.1 96.1C129.1 112.4 113.8 124.9 95.9 123.9C79.2 122.9 66 110.5 65.2 95.5C65.2 94.3 65.2 93.1 65.3 91.8L65.2 91.8C66.4 75.7 81.6 63.5 99.3 64.5Z" />
        <path fill={RUST} stroke="none" d="M99.3 64.5C117.2 65.5 131 79.7 130.1 96.1C129.1 112.4 113.8 124.9 95.9 123.9C79.2 122.9 66 110.5 65.2 95.5C65.2 94.3 65.2 93.1 65.3 91.8L65.2 91.8C66.4 75.7 81.6 63.5 99.3 64.5Z" />
      </g>
    </g>
  ),
  /* ── Tools ───────────────────────────────────────────────────────────── */
  "european-protocol": (
    <g fill="none" stroke={STRUCTURE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="12.5" y="7.5" width="23" height="33" rx="2.5" />
      <circle fill={RUST} stroke="none" cx="27" cy="31" r="4.5" />
    </g>
  ),
  "micro-credentials": (
    <g fill="none" stroke={STRUCTURE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <rect fill={STRUCTURE} stroke="none" x="8" y="8" width="14.5" height="14.5" rx="4" />
      <rect fill={STRUCTURE} stroke="none" x="25.5" y="8" width="14.5" height="14.5" rx="4" />
      <rect fill={STRUCTURE} stroke="none" x="8" y="25.5" width="14.5" height="14.5" rx="4" />
      <rect fill={RUST} stroke="none" x="25.5" y="25.5" width="14.5" height="14.5" rx="4" />
    </g>
  ),
  "technical-passport": (
    <g fill="none" stroke={STRUCTURE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="11.5" y="7.5" width="25" height="33" rx="6" />
      <circle fill={RUST} stroke="none" cx="24" cy="19.5" r="5" />
      <path d="M20 30.5h8" />
    </g>
  ),
  "white-paper": (
    <g fill="none" stroke={STRUCTURE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.5 7.5h16l9 9v24h-25z" />
      <path stroke={RUST} d="M19 29h10" />
    </g>
  ),
  toolkit: (
    <g fill="none" stroke={STRUCTURE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7.5" y="17.5" width="33" height="22" rx="5" />
      <path d="M18 17.5V15a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2.5" />
      <circle fill={RUST} stroke="none" cx="24" cy="28.5" r="4.5" />
    </g>
  ),
  "policy-institutions": (
    <g fill="none" stroke={STRUCTURE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.5 18L24 9l16.5 9z" fill={STRUCTURE} />
      <path d="M12.5 25v9M35.5 25v9M7.5 41h33" />
      <path stroke={RUST} d="M24 25v9" />
    </g>
  ),
  /* ── Values & storytelling ───────────────────────────────────────────── */
  recognition: (
    <g fill="none" stroke={STRUCTURE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <path fill={STRUCTURE} stroke="none" d="M16.5 25h15v17l-7.5-4.5-7.5 4.5z" />
      <circle cx="24" cy="18" r="9.5" fill="none" />
      <circle fill={RUST} stroke="none" cx="24" cy="18" r="4" />
    </g>
  ),
  participation: (
    <g fill="none" stroke={STRUCTURE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <circle fill={STRUCTURE} stroke="none" cx="31.5" cy="11" r="3" />
      <circle fill={STRUCTURE} stroke="none" cx="16.5" cy="11" r="3" />
      <circle fill={STRUCTURE} stroke="none" cx="9" cy="24" r="3" />
      <circle fill={STRUCTURE} stroke="none" cx="16.5" cy="37" r="3" />
      <circle fill={STRUCTURE} stroke="none" cx="31.5" cy="37" r="3" />
      <circle fill={RUST} stroke="none" cx="39" cy="24" r="5" />
    </g>
  ),
  reciprocity: (
    <g fill="none" stroke={STRUCTURE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <path stroke={RUST} d="M14 16h26" />
      <circle fill={RUST} stroke="none" cx="13" cy="16" r="6.5" />
      <path d="M8 32h26" />
      <circle fill={STRUCTURE} stroke="none" cx="35" cy="32" r="6.5" />
    </g>
  ),
  stories: (
    <g fill="none" stroke={STRUCTURE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.5 9.5h23a5.5 5.5 0 0 1 5.5 5.5v13a5.5 5.5 0 0 1-5.5 5.5H22.5l-8 6.5v-6.5h-2A5.5 5.5 0 0 1 7 28V15a5.5 5.5 0 0 1 5.5-5.5z" />
      <circle fill={RUST} stroke="none" cx="17.5" cy="21.5" r="3.2" />
      <circle fill={RUST} stroke="none" cx="25" cy="21.5" r="2" />
      <circle fill={RUST} stroke="none" cx="31" cy="21.5" r="2" />
    </g>
  ),
  "data-impact": (
    <g fill="none" stroke={STRUCTURE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 40v-7M19.5 40V27M29.5 40V21" />
      <circle fill={RUST} stroke="none" cx="39" cy="12" r="5.5" />
    </g>
  ),
  events: (
    <g fill="none" stroke={STRUCTURE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8.5" y="12.5" width="31" height="27" rx="6" />
      <path d="M17 7.5v6M31 7.5v6" />
      <circle fill={RUST} stroke="none" cx="24" cy="27" r="5" />
    </g>
  ),
};

export type IconTone = "petrol" | "sky" | "white" | "slate";

const structureVar: Record<IconTone, string> = {
  petrol: "var(--color-petrol)",
  sky: "var(--color-sky)",
  white: "var(--color-white)",
  slate: "var(--color-slate)",
};

export function Icon({
  name,
  size = 48,
  label,
  tone = "petrol",
  className = "",
}: {
  name: IconId;
  size?: number;
  /** Accessible name — required ONLY when the icon is the sole content. */
  label?: string;
  /** Structure colour ground the icon sits on (person-dot is always rust). */
  tone?: IconTone;
  className?: string;
}) {
  const style = { "--icon-structure": structureVar[tone] } as React.CSSProperties;
  if (label === undefined) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        aria-hidden="true"
        focusable="false"
        style={style}
        className={className}
      >
        {paths[name]}
      </svg>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label={label}
      focusable="false"
      style={style}
      className={className}
    >
      <title>{label}</title>
      {paths[name]}
    </svg>
  );
}
