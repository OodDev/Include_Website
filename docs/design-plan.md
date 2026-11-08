# Design plan — INCLUDE website (Phase 0)

Reviewed against Brand 01–04 + Sito_02/03 rasterised pages. The brief's own brand system wins on every token level (per INSTRUCTIONS §0.1); this plan only decides how those primitives compose. Where the two generic-default skills would propose off-brand moves (cream + serif, terracotta accent, all-caps eyebrows everywhere), the brand rules override them.

## Tokens (locked — Brand 01)

- Slate #465056 · Sky #9FBBC9 · Rust #C14723 · Petrol #068A92 · Petrol-deep #08767C · Burgundy #671317 · Red #B2252F · Ochre #D3851D (never text) · Mist #E2E9ED · Paper #F3F3F1 · White.
- Background rhythm: white → paper → slate (white text) → petrol-deep (white text, ≥24px only) as per mockups. Tailwind default palette reset; only these tokens exist.
- Type: Manrope only. Fluid clamp scale; labels 14px/800/uppercase/0.08em (brand signature), body 18/1.65, H2 clamp(1.75–2.5rem)/700, H1 clamp(2.5–4rem)/800. Slate text everywhere; burgundy for warm titles.

## Layout concept (from Sito_02/03)

1200px container, 8-pt scale, sections 96–128px rhythm, hairline separators. Asymmetric hero: copy left (~55%), PhaseTrack + SuperE right bleeding off-canvas, cropped by viewport edge (signature, must not push scroll width). Slate statement band with two-column pull text. 3-col card grids at ≥1024, 1-col below 768. Footer: slate, 3 link columns, co-branding row with hairline rules, facts table.

## Signature (one only)

The person-dot travelling PROTECTED → PRE-CORPORATE → OPEN MARKET on the hero track (one-shot 1.8s; hover/focus re-targets; scroll-in re-target on Pathway; static when reduced-motion). SuperE: slow ≤24px scroll parallax on white hero only (CSS scroll-driven, static fallback).

## Anti-slop guardrails applied

No default cream/terracotta palette (brand palette locked and distinct); no letter-gradient or glassmorphism; radius varies per element class (cards 20–24px, pills 999, inputs 12px); no hover-lift on every card — only icon-dot nudge (2px) + colour feedback; cards avoid shadows unless hairline insufficient; no ALL-CAPS outside the brand's own short labels; no `→`hanging on every link (only mockup CTA pattern "Entra →"); no counters or fake numbers anywhere.

## Composition rules unique to this brief

- Sky = structure, rust = the person only: anywhere a circle-dot appears, it is rust, never sky/ochre; and it tends to sit inside/adjacent to sky structure (the logo logic "the dot is the person").
- Plain-language typography: sentence case, generous spacing (cognitive-disability audience), acronyms expanded on first use (§10 supports this).
- Copy-first: every section renders real approved copy or hides itself (feature flags). No decorative filler text.
