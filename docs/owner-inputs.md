# Owner inputs — what the owner must supply or approve

Visible working checklist. Nothing below is invented; the site runs without them using defaults + documented gates.

## Blockers for launch

- [ ] **Production domain** and canonical URL (`NEXT_PUBLIC_SITE_URL`); hosting preference + EU region.
- [ ] **Official vector brand assets** (the supplied PDFs contain no vectors —
  *except* "Include 2 GRAFICA.pdf", whose logo page carries real paths):
  - [x] polychrome logo (SVG) — official owner file "Main_Logo.svg"
    ("Brand kit, graphics, …" folder), copied verbatim to
    `public/brand/include-logo.svg`; used by `Logo.tsx` everywhere
    (header + footer). 2026-11-11. Supersedes the earlier PDF-extracted
    intermediate `include-logo-multicolour.svg` (removed).
  - [x] negative logo with tagline (SVG) — official
    "Main_Logo_with_UnderText.svg", whitened (fills → #ffffff, geometry and
    text positions verbatim) and inlined as a server component
    (`LogoFooter.tsx`) for the footer. 2026-11-11. Inlined rather than `<img>`
    because the tagline is live `<text>` in Manrope and an `<img>` SVG cannot
    use the page web font. If the owner supplies an official outlined
    negative file, it can go back to a plain `<img>`.
  - [x] white wordmark-only variant — derived from the official
    "Main_Logo.svg" (fills set to `#ffffff`) as
    `public/brand/include-logo-white.svg`; available via
    `Logo variant="negative"`. 2026-11-11.
  - [x] "e" short mark (SVG) → favicon/app icon set — received with the
    designer vector package ("INCLUDE-SVGs_logos_and_icons/e", 2026-11-11).
    Geometry inlined verbatim via `src/components/brand/eMark.ts`
    (LogoMark, SuperE) and composed into the petrol-square favicon
    (`src/app/icon.svg`, white "e" + rust eye as the package files show).
  - [x] 24 official icons (exploration 03) — `icone/` in the same package;
    geometry verbatim in `src/components/brand/Icon.tsx`, structure colour
    recoloured via the `--icon-structure` custom property (no petrolio
    variant was supplied; cielo/ardesia/bianco variants mirrored in
    `assets/brand/icone/`). "home" remains our drawn wayfinding glyph —
    still to confirm with the owner.
  - [x] Ready for Inclusion label (variants) — 6 official badge files
    (targa, orizzontale, verticale, fascia web) served from
    `public/brand/` and rendered by `ReadyLabel.tsx` (text is outlined in
    the files, so no web-font dependency).
  - [x] Official Erasmus+/EU emblem file — owner-delivered transparent
    "Co-funded by the European Union" horizontal lockup
    (`Brand kit…/Partners and EU logos and images/co-funded-by-eu.png`,
    2026-11-13). Served from `public/brand/co-funded-by-eu.png`
    (transparent margins trimmed; geometry untouched), provenance copy in
    `assets/brand/eu-emblem/`. Integrated into the footer per D21.
  - [ ] Partner logos (6 partners) + verified partner website URLs
- [ ] **Coordinator public contact details**: official email for contact form recipient(s) (`CONTACT_TO_EMAIL` / optional `CONTACT_ROUTING`), postal address if wanted, security.txt contact.
- [ ] **Email delivery provider** decision + credentials (Brevo recommended / SMTP), DPA signed.
- [ ] **Newsletter**: platform, sender identity, frequency, consent wording, list ID, double-opt-in copy.
- [ ] **Legal approval**: data-controller identity confirmation (assumed Bene Futuro srl as coordinator), privacy/cookie/accessibility/legal-notice policy sign-off, DPO yes/no, processor list, retention schedule, content licence for downloads.
- [ ] **Analytics** decision: none (default) / cookieless EU provider / GA4+Consent Mode v2.
- [ ] monitoring/uptime + backup needs.

## Confirmations required (per §2.3 / §18.2)

- [ ] Desktop nav ordering incl. pill position in DOM (§2.3 #3 judgement).
- [ ] "European Protocol for Work Inclusion" as a published output (currently draft, hidden).
- [ ] Paper tone `#F3F3F1` (§2.3 #13).
- [ ] "Discover the INCLUDE network" CTA destination (currently `/ready-for-inclusion#ambassador-network`).
- [ ] AI-training crawler stance (`allowAiTraining`, default `true`).
- [ ] Glossary + easy-read pages going live.
- [ ] Mockup-sourced lines reused in EN/IT ("A pathway, not an internship"; "cycle of disappointment" headline; shift-of-perspective pairs).
- [ ] Italian translations approved (`humanReviewed: true` per page) → publishes `it`.
- [ ] Whether PT/ES/EL translations should be made + professionally verified.

## Content

- [ ] Photography/video with releases and consent documentation (§5.9: none on site until then).
- [ ] First news posts, event entries, pilot stories (consent verified, category `pilot-stories` gating).
- [ ] Resource publications: files, publication dates, languages, accessibility-checked PDFs + HTML summaries.
- [ ] Associated partners: names/logos if they should be published.
