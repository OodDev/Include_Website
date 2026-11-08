"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Icon, type IconId } from "@/components/brand/Icon";

/**
 * PhaseTrack — the three phase icons joined by dotted connectors, with the
 * signature moment: the rust person-dot travels PROTECTED → PRE-CORPORATE →
 * OPEN MARKET once (~1.8 s) on load, then rests (§8). Hover/focus of a phase
 * re-targets the dot. No infinite loops; static under reduced motion.
 * Content is fully server-rendered and static; the dot move is decorative.
 */
export type PhaseKey = "protected" | "pre-corporate" | "open-market";

type Phase = {
  key: PhaseKey;
  icon: IconId;
  labelKey: string;
};

export const phases: Phase[] = [
  { key: "protected", icon: "protected-context", labelKey: "phaseLabels.protected" },
  { key: "pre-corporate", icon: "pre-corporate", labelKey: "phaseLabels.preCorporate" },
  { key: "open-market", icon: "labour-market", labelKey: "phaseLabels.openMarket" },
];

/** x-centres of the three icons in track-relative px (with default sizing). */
const STOPS: [number, number, number] = [24, 288, 552];

export function PhaseTrack({
  labels,
  activePhase,
  onPhaseSelect,
  compact = false,
}: {
  labels: { protected: string; "pre-corporate": string; "open-market": string };
  /** Force the resting/active phase (used by Hero SSR to start at open-market). */
  activePhase?: PhaseKey;
  onPhaseSelect?: (phase: PhaseKey) => void;
  compact?: boolean;
}) {
  const reduce = useReducedMotion();
  const [dotX, setDotX] = useState<number | null>(null); // null = not yet run
  const groupRef = useRef<HTMLDivElement | null>(null);
  const [stops, setStops] = useState(STOPS);

  const measure = () => {
    const root = groupRef.current;
    if (!root) return;
    const icons = root.querySelectorAll<HTMLElement>("[data-phase-icon]");
    if (icons.length !== 3) return;
    const base = root.getBoundingClientRect().left;
    setStops(
      Array.from(icons).map((el) => {
        const r = el.getBoundingClientRect();
        return r.left + r.width / 2 - base;
      }) as [number, number, number],
    );
  };

  useEffect(() => {
    // Defer first measurement a frame: icons must be laid out first.
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Reduced motion / forced phase: the resting position is derived in render,
  // never through an extra state write (react-hooks/set-state-in-effect).
  const targetFor = (key: PhaseKey) => stops[phases.findIndex((p) => p.key === key) as 0 | 1 | 2];
  const restingX = activePhase ? targetFor(activePhase) : reduce ? stops[2] : null;

  useEffect(() => {
    if (reduce || activePhase) return;
    // One-shot signature: travel then rest at OPEN MARKET
    let mounted = true;
    const t1 = setTimeout(() => {
      if (!mounted) return;
      setDotX(stops[1]);
    }, 40);
    const t2 = setTimeout(() => {
      if (!mounted) return;
      setDotX(stops[2]);
    }, 920);
    return () => {
      mounted = false;
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [reduce, activePhase, stops]);

  const dotXRender = dotX ?? restingX ?? stops[0];



  return (
    <div
      ref={groupRef}
      className={`flex items-center justify-between ${compact ? "gap-3" : "gap-6 sm:gap-8"}`}
    >
      {phases.map((p, i) => (
        <div key={p.key} className="relative flex flex-1 flex-col items-center">
          <button
            type="button"
            data-phase-icon={p.key}
            onMouseEnter={() => setDotX(targetFor(p.key))}
            onFocus={() => setDotX(targetFor(p.key))}
            onClick={() => {
              setDotX(targetFor(p.key));
              onPhaseSelect?.(p.key);
            }}
            className="group rounded-full p-1"
            aria-label={labels[p.key]}
          >
            <Icon
              name={p.icon}
              size={compact ? 40 : 56}
              className="transition-transform duration-200 group-hover:scale-105"
            />
          </button>
          {i < 2 && (
            <svg
              aria-hidden="true"
              className="absolute top-1/2 h-2 w-full -translate-y-1/2"
              preserveAspectRatio="none"
              viewBox="0 0 120 8"
            >
              <line
                x1="62"
                y1="4"
                x2="120"
                y2="4"
                stroke="var(--color-rust)"
                strokeWidth="3.5"
                strokeDasharray="0.5 9"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
      ))}

      {/* The person travels along the track (decorative, aria-hidden) */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute h-4 w-4 rounded-full motion-safe"
        style={{
          left: 0,
          top: "50%",
          translateX: "-50%",
          marginTop: -8,
        }}
        animate={{ x: dotXRender }}
        transition={{ duration: reduce ? 0 : 0.9, ease: [0.45, 0, 0.25, 1] }}
      >
        <span
          className="block h-4 w-4 rounded-full"
          style={{ background: "var(--color-rust)" }}
        />
      </motion.span>
    </div>
  );
}
