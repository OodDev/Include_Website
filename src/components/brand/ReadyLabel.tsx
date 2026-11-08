/**
 * Ready for Inclusion label (Brand 04): the "e" with the text stack
 * INCLUDE / READY / FOR / INCLUSION aligned to its tail.
 * TODO(brand-asset): official label SVG awaited; neutral composition now.
 */
type ReadyVariant = "slate" | "sky-person" | "plaque-slate" | "plaque-petrol" | "horizontal" | "web-band";

export function ReadyLabel({
  variant = "slate",
  size = "md",
  className = "",
}: {
  variant?: ReadyVariant;
  size?: "sm" | "md";
  className?: string;
}) {
  // Plaques (filled grounds)
  if (variant === "plaque-slate" || variant === "plaque-petrol") {
    const bg = variant === "plaque-slate" ? "bg-slate" : "bg-petrol-deep";
    return (
      <span
        className={`inline-flex flex-col items-center rounded-[20px] ${bg} px-6 py-5 ${className}`}
      >
        <ReadyLabelInner tone="white" personDot size={size === "sm" ? 44 : 56} />
      </span>
    );
  }
  if (variant === "horizontal") {
    return (
      <span className={`inline-flex items-center gap-3 ${className}`}>
        <ReadyLabelInner tone="slate" personDot size={size === "sm" ? 32 : 40} horizontal />
      </span>
    );
  }
  return (
    <span className={`inline-flex ${className}`}>
      <ReadyLabelInner
        tone={variant === "sky-person" ? "slate" : "slate"}
        personDot={variant === "sky-person"}
        size={size === "sm" ? 44 : 56}
      />
    </span>
  );
}

function ReadyLabelInner({
  tone,
  personDot,
  size,
  horizontal = false,
}: {
  tone: "slate" | "white";
  personDot: boolean;
  size: number;
  horizontal?: boolean;
}) {
  const color = tone === "white" ? "text-white" : "text-slate";
  return (
    <span className={horizontal ? "flex items-start gap-2" : "flex items-end gap-2"}>
      {/* TODO(brand-asset): official "e" from the label artwork */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        aria-hidden="true"
        focusable="false"
      >
        <text
          x="24"
          y="36.5"
          textAnchor="middle"
          fontSize="46"
          fontWeight="800"
          fontFamily="var(--font-manrope, Manrope), system-ui, sans-serif"
          fill={tone === "white" ? "var(--color-white)" : "var(--color-slate)"}
        >
          e
        </text>
        <circle
          cx="24"
          cy="21"
          r="4.6"
          fill={personDot ? "var(--color-rust)" : "var(--color-white)"}
        />
      </svg>
      <span className={`${color} u-label flex flex-col ${horizontal ? "mt-1" : "mb-2"} leading-[1.15]`} style={{ fontSize: "0.625rem" }}>
        <span>INCLUDE</span>
        <span aria-hidden={horizontal ? undefined : undefined}>READY</span>
        <span>FOR</span>
        <span>INCLUSION</span>
      </span>
    </span>
  );
}
