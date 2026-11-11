# Official brand assets (SVG) — provenance

Verbatim copies of the vector files supplied by the INCLUDE graphic designer
on 2026-11-11 (original delivery: `Brand kit, graphics, layout, styles,
typography, logo, colur palette, mockup/INCLUDE-SVGs_logos_and_icons/` —
kept **out of the repo** together with the owner PDFs, per `.gitignore`).
These copies are tracked so a fresh clone builds with the real artwork.

- `icone/` — 24 exploration-03 icons, 48×48 grid, stroke 7 (not expanded).
  Three baked variants (cielo/ardesia/bianco structure + rust dot) plus the
  full board (`include-set-icone-tavola.svg`, names outlined). The site
  renders geometry from the `cielo-ruggine` (main) variant, recoloured
  via the `--icon-structure` custom property (petrolio art direction, D17):
  see `src/components/brand/Icon.tsx`.
- `e/` — the official "e" short mark in 7 colourways (letter path is one
  evenodd path; `-punto-ruggine` files add the rust person-dot as a second
  path). Inlined via `src/components/brand/eMark.ts` (LogoMark, SuperE,
  favicon `src/app/icon.svg`).
- `ready-for-inclusion/` — official RFI badges (targa, orizzontale,
  verticale, fascia web; text converted to outlines). Served verbatim from
  `public/brand/` and rendered by `src/components/brand/ReadyLabel.tsx`.
- `LEGGIMI.txt` — the designer's own delivery note (colors, fonts).

Not copied here (superseded / not needed for the build): `loghi/`
(wordmark variants — the site already uses the owner's `Main_Logo.svg`
files in `public/brand/include-logo*.svg`).
