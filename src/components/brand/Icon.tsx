/**
 * Canonical icon set (exploration 03, 24 icons, 4 families — §5.6).
 *
 * TODO(brand-asset): faithful recreations on a 48-unit grid pending the
 * official SVG files from the owner (allowed by INSTRUCTIONS §2.4.2 and logged
 * as decisions.md D01). Rules: solid stroke matching the logo letter weight,
 * rounded terminals; structure in SKY; the person is always ONE RUST DOT.
 * On slate grounds the structure stays sky. Legible at 24 px.
 */
export const iconIds = [
  "home", // wayfinding (navbar); not in the owner sheet — drawn in the set's own system style, flagged below
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
 * petrolio-direction structure colour (mockup variation 3); "sky" preserves
 * the original exploration-03 look; "white" is for dark grounds. */
const STRUCTURE = "var(--icon-structure, var(--color-petrol))";
const SKY = STRUCTURE; // legacy name kept so path data stays untouched
const RUST = "var(--color-rust)";

/** Each icon draws in a 48×48 viewBox. `sky` = structure, `rust` = the person. */
const paths: Record<IconId, React.ReactNode> = {
  /* Wayfinding — done in set style (sky structure, rust dot, 48-unit grid) but
     NOT part of the owner's exploration sheet. TODO(brand-asset): confirm
     with the owner; replace with an official glyph if one is supplied. */
  home: (
    <>
      <path
        d="M10 21.5V35a4 4 0 0 0 4 4h20a4 4 0 0 0 4-4V21.5M6 25 24 9l18 16"
        fill="none"
        stroke={SKY}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="30" r="4.5" fill={RUST} />
    </>
  ),

  /* ── Pathway ─────────────────────────────────────────────────────────── */
  "protected-context": (
    <>
      <rect x="8" y="8" width="32" height="32" rx="11" fill="none" stroke={SKY} strokeWidth="6" />
      <circle cx="24" cy="24" r="4.5" fill={RUST} />
    </>
  ),
  "pre-corporate": (
    <>
      <path
        d="M40 15 a11 11 0 0 0 -9 -4 h-7 a11 11 0 0 0 -11 11 v4 a11 11 0 0 0 11 11 h7 a11 11 0 0 0 9 -4"
        fill="none"
        stroke={SKY}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="24" cy="24" r="3.6" fill={RUST} />
      <circle cx="33" cy="19" r="2.4" fill={RUST} />
    </>
  ),
  "labour-market": (
    <>
      <circle cx="24" cy="24" r="5.5" fill={SKY} />
      <circle cx="24" cy="10" r="3.4" fill={RUST} />
      <circle cx="37" cy="16" r="3.4" fill={RUST} />
      <circle cx="11" cy="18" r="3.4" fill={RUST} />
      <circle cx="35" cy="35" r="3.4" fill={RUST} />
      <circle cx="15" cy="34" r="2.4" fill={SKY} />
    </>
  ),
  pathway: (
    <>
      <path d="M8 24h18" fill="none" stroke={SKY} strokeWidth="6" strokeLinecap="round" />
      <circle cx="38" cy="24" r="5" fill={RUST} />
    </>
  ),
  threshold: (
    <>
      <path
        d="M12 40 V21 a12 12 0 0 1 24 0 V40"
        fill="none"
        stroke={SKY}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path d="M12 40 h24" fill="none" stroke={SKY} strokeWidth="6" strokeLinecap="round" />
      <circle cx="24" cy="26" r="4.2" fill={RUST} />
    </>
  ),
  connection: (
    <>
      <path d="M8 24 h12" fill="none" stroke={SKY} strokeWidth="6" strokeLinecap="round" />
      <circle cx="26" cy="24" r="4" fill={SKY} />
      <path d="M30 24 h6" fill="none" stroke={SKY} strokeWidth="6" strokeLinecap="round" />
      <circle cx="41" cy="24" r="5.4" fill={RUST} />
    </>
  ),
  /* ── People & companies ──────────────────────────────────────────────── */
  person: (
    <>
      <circle cx="24" cy="14" r="5.5" fill={RUST} />
      <path
        d="M13 40 a11 11 0 0 1 22 0"
        fill="none"
        stroke={SKY}
        strokeWidth="6"
        strokeLinecap="round"
      />
    </>
  ),
  skills: (
    <>
      <path
        d="M10 40 V36 M18 36 V28 M26 28 V20"
        fill="none"
        stroke={SKY}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path d="M34 20 V10" fill="none" stroke={SKY} strokeWidth="6" strokeLinecap="round" />
      <circle cx="34" cy="10" r="4.5" fill={RUST} />
    </>
  ),
  training: (
    <>
      <path
        d="M24 14 c-3 -3.4 -8.4 -5 -14 -5 V38 c5.6 0 11 1.6 14 5 c3 -3.4 8.4 -5 14 -5 V9 c-5.6 0 -11 1.6 -14 5 Z"
        fill="none"
        stroke={SKY}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="9" r="4.5" fill={RUST} />
    </>
  ),
  autonomy: (
    <>
      <path
        d="M24 42 V26 M24 26 L15 12 M24 26 L33 12"
        fill="none"
        stroke={SKY}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="36" cy="10" r="4.5" fill={RUST} />
    </>
  ),
  company: (
    <>
      <path
        d="M14 40 V12 h9 V40 M23 20 h11 V40"
        fill="none"
        stroke={SKY}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path d="M8 40 h32" fill="none" stroke={SKY} strokeWidth="6" strokeLinecap="round" />
      <circle cx="28.5" cy="30" r="4" fill={RUST} />
    </>
  ),
  "ready-for-inclusion": (
    <>
      {/* neutral placeholder glyph — TODO(brand-asset): official label mark */}
      <circle cx="24" cy="22" r="15" fill="none" stroke={SKY} strokeWidth="6" />
      <path
        d="M39 22 a15 15 0 0 1 -15 15 V50"
        fill="none"
        stroke={SKY}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="24" cy="22" r="5" fill={RUST} />
    </>
  ),
  /* ── Tools ───────────────────────────────────────────────────────────── */
  "european-protocol": (
    <>
      <rect x="11" y="7" width="26" height="34" rx="8" fill="none" stroke={SKY} strokeWidth="6" />
      <circle cx="24" cy="34" r="3.6" fill={RUST} />
    </>
  ),
  "micro-credentials": (
    <>
      <rect x="9" y="9" width="12" height="12" rx="3.5" fill={SKY} />
      <rect x="27" y="9" width="12" height="12" rx="3.5" fill={SKY} />
      <rect x="9" y="27" width="12" height="12" rx="3.5" fill={SKY} />
      <rect x="27" y="27" width="12" height="12" rx="3.5" fill={RUST} />
    </>
  ),
  "technical-passport": (
    <>
      <rect x="11" y="7" width="26" height="34" rx="8" fill="none" stroke={SKY} strokeWidth="6" />
      <circle cx="24" cy="19" r="4.5" fill={RUST} />
      <path d="M18 30 h12" fill="none" stroke={SKY} strokeWidth="5" strokeLinecap="round" />
      <path d="M18 36 h8" fill="none" stroke={SKY} strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  "white-paper": (
    <>
      <path
        d="M12 7 h17 l7 7 v27 H12 Z"
        fill="none"
        stroke={SKY}
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <path d="M20 25 h10" fill="none" stroke={SKY} strokeWidth="5" strokeLinecap="round" />
      <circle cx="20" cy="32" r="3" fill={RUST} />
      <path d="M27 32 h3" fill="none" stroke={SKY} strokeWidth="4.5" strokeLinecap="round" />
    </>
  ),
  toolkit: (
    <>
      <path
        d="M8 20 a5 5 0 0 1 5 -5 h22 a5 5 0 0 1 5 5 v14 a5 5 0 0 1 -5 5 H13 a5 5 0 0 1 -5 -5 Z"
        fill="none"
        stroke={SKY}
        strokeWidth="6"
      />
      <circle cx="24" cy="26" r="4.5" fill={RUST} />
    </>
  ),
  "policy-institutions": (
    <>
      <path d="M8 17 L24 7 L40 17" fill="none" stroke={SKY} strokeWidth="6" strokeLinejoin="round" />
      <path d="M13 21 V34 M24 21 V34 M35 21 V34" fill="none" stroke={SKY} strokeWidth="5.5" strokeLinecap="round" />
      <path d="M9 40 h30" fill="none" stroke={SKY} strokeWidth="6" strokeLinecap="round" />
      <circle cx="24" cy="27" r="3.6" fill={RUST} />
    </>
  ),
  /* ── Values & storytelling ───────────────────────────────────────────── */
  recognition: (
    <>
      <circle cx="24" cy="18" r="11" fill="none" stroke={SKY} strokeWidth="6" />
      <circle cx="24" cy="18" r="4.2" fill={RUST} />
      <path
        d="M18 27 L15 40 L24 36 L33 40 L30 27"
        fill="none"
        stroke={SKY}
        strokeWidth="5.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </>
  ),
  participation: (
    <>
      <circle cx="35" cy="26" r="7" fill={RUST} />
      <circle cx="17" cy="18" r="4" fill={SKY} />
      <circle cx="19" cy="33" r="4" fill={SKY} />
      <circle cx="28" cy="12" r="3.4" fill={SKY} />
      <circle cx="10" cy="27" r="2.6" fill={SKY} />
    </>
  ),
  reciprocity: (
    <>
      <path d="M8 17 h26" fill="none" stroke={SKY} strokeWidth="6" strokeLinecap="round" />
      <circle cx="40" cy="17" r="4.8" fill={RUST} />
      <path
        d="M40 31 a5 5 0 0 0 -5 -5 h-14"
        fill="none"
        stroke={SKY}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="26" r="4.8" fill={SKY} />
    </>
  ),
  stories: (
    <>
      <path
        d="M9 12 h30 a4 4 0 0 1 4 4 v14 a4 4 0 0 1 -4 4 H24 L15 42 v-8 h-6 a4 4 0 0 1 -4 -4 V16 a4 4 0 0 1 4 -4 Z"
        fill="none"
        stroke={SKY}
        strokeWidth="5.5"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="23" r="2.6" fill={SKY} />
      <circle cx="26" cy="23" r="2.6" fill={RUST} />
      <circle cx="34" cy="23" r="2.6" fill={SKY} />
    </>
  ),
  "data-impact": (
    <>
      <path d="M10 40 V31" fill="none" stroke={SKY} strokeWidth="6" strokeLinecap="round" />
      <path d="M21 40 V25" fill="none" stroke={SKY} strokeWidth="6" strokeLinecap="round" />
      <path d="M32 40 V18" fill="none" stroke={SKY} strokeWidth="6" strokeLinecap="round" />
      <circle cx="36" cy="10" r="4.8" fill={RUST} />
    </>
  ),
  events: (
    <>
      <rect x="8" y="11" width="32" height="29" rx="7" fill="none" stroke={SKY} strokeWidth="6" />
      <path d="M16 7 v7 M32 7 v7" fill="none" stroke={SKY} strokeWidth="5.5" strokeLinecap="round" />
      <circle cx="24" cy="27" r="4.4" fill={RUST} />
    </>
  ),
};

export type IconTone = "petrol" | "sky" | "white";

const structureVar: Record<IconTone, string> = {
  petrol: "var(--color-petrol)",
  sky: "var(--color-sky)",
  white: "var(--color-white)",
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
