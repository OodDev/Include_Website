# INCLUDE Website — decisions log

Format of each entry: **Decision · Alternatives · Reason · Owner confirmation needed?**

## §2.3 Resolved decisions (applied as written)

1. **Next.js owns the build; Vite is not used.** Vitest (Vite-powered) for tests only via `vitest.config.ts`. No `vite.config.ts`, no Storybook; private `/dev/design-system` route instead. → ADR 0001. Full build required by owner.
2. **Locales:** `en` source default + x-default; `it` implemented (unpublished until owner-confirmed `humanReviewed`); `pt/es/el` disabled stubs. Language switcher hidden while only `en` is published.
3. **Navigation:** eight pages in architecture order; desktop header per mockup with pill CTA "Ready for Inclusion" first in DOM (focus order = visual order). ⚠ flagged for owner confirmation (§2.3 #3).
4. **URLs:** `/{locale}/…`, `localePrefix: "always"`, English internal route names, localised pathnames per §6.1 table; no trailing slashes.
5. **Phase names:** full names in prose; short labels PROTECTED / PRE-CORPORATE / OPEN MARKET on chips/track.
6. **Home:** mockup layout with feature-flagged sections hidden until real content.
7. **Hero H1:** EN "From protected paths to real jobs"; IT "Dal contesto protetto al lavoro reale".
8. **European Protocol for Work Inclusion:** unpublished resource entry with `needsClientApproval: true`.
9. **Network figures:** targets labelled as targets; live counters behind `features.networkCounters`.
10. **"Discover the INCLUDE network"** → `/ready-for-inclusion#ambassador-network`.
11. **Technical Passport page:** list-only until approved copy ≥ ~150 words; anchor `/results-and-tools#technical-passport`.
12. **Icons:** exploration 03 set (24 icons, 4 families).
13. **Paper tone** `#F3F3F1`. 14. **Colours:** Brand 01 hex values only (§5.1).
15. **WCAG 2.2 AA.** 16. **Restrained motion (§8).** 17. **Conservative JSON-LD set (§9.2).**
18. **`llms.txt` generated at build** from published `/content`. 19. **No Google integrations; reCAPTCHA prohibited; ALTCHA + honeypot + rate limit.**
20. **Form availability gate** until a mail provider is configured. 21. **Tailwind CSS v4, CSS-first tokens.**

## New decisions taken during Phase 0–6

| # | Decision | Alternatives | Reason | Owner confirm? |
|---|---|---|---|---|
| D01 | Brand PDFs are **raster exports** (one JPEG per page, no vector data — verified with poppler/mutool). Instead of redrawing (prohibited), **logo, "e" mark, Ready for Inclusion label and EU emblem placeholders are neutral text-based placeholders** and the 24 icons are **faithful recreations on a 48-unit grid, each flagged TODO(brand-asset)**. | Await official SVGs before any UI; interrupt the build. | §2.4.2 fallback is the doc's own rule; icons recreated per the sheet. The brand's geometry (filled strokes, rounded terminals, structure in sky `#9FBBC9`, person-dot rust `#C14723`) is systematic and reproducible; the logo's letterforms are not and are never imitated. | **Yes — official vector files for logo variants, e-mark, label, EU emblem and partner logos must be supplied before launch.** |
| D02 | **TypeScript 5.9.3 pinned** instead of latest 7.0.2 | typescript@7 | Boring, maintained deps (§0.4.7); the Go-native TS 7 line is too new for the full ESLint/Vitest toolchain. | No |
| D03 | pnpm 12 via npm global install (corepack is no longer bundled with Node 26) | corepack | corepack removed in Node ≥ 25. Documented for reproducibility + `packageManager` field. | No |
| D04 | Partner/EU logos render as **documented empty slots** (not rendered sections) until owner supplies verified files; co-branding row shows INCLUDE placeholder + EU emblem slot only when files exist. | Fake logos | No-fabrication rule. Owner inputs logged. | Yes (files) |
| D05 | Neutral placeholder strategy for logo: plain Manrope bold word "INCLUDE" in slate, no subtitle imitation, marked in code as TODO(brand-asset). Footer uses white variant. | Draw an approximation | §2.4.2 — never imitate letterforms. | Yes (files) |
| D06 | **Target-built First-frame icon recreation detail:** icons stroked on 48-unit grid, stroke width ≈ 6 units (logo-letter weight), rounded caps/joins, structure `sky`, person-dot `rust` circle; on slate grounds structure stays sky. | Skip icons entirely | Allowed by §2.4.2. | No (replaced when official files arrive) |
| D07 | Manrope self-hosting via `next/font/google` build-time download; falls back to `next/font/local` at build-time failure. Subsets: latin, latin-ext, greek available. | Local files now | §3. | No |
| D08 | CSP starts **Report-Only**; enforcement ADR to follow after a soak. Hash/SRI preferred over nonces (static site). | Nonces (forces dynamic rendering) | §12 note. ADR planned. | No |
| D09 | Contact form recipients only from `CONTACT_TO_EMAIL`/`CONTACT_ROUTING` env; form **hidden in "not operational" state** with neutral message + setup doc until owner configures email delivery. | Invent address | §6.9 availability gate. | Yes (mailbox + provider) |
| D10 | Newsletter card hidden until provider configured. | Stub provider | §6.9. | Yes (provider choice) |
| D11 | FAQ/glossary: glossary content derived from sources and shipped behind feature flag (noindex, excluded from nav/sitemap until approved). FAQ: only source-sourced questions; several answers require owner confirmation so FAQ ships minimal. | Omit entirely | §6.10/§9.4. | Yes (approve glossary live) |
| D12 | IT copy: Home + Pathway use **mockup Italian verbatim**; remaining pages translated from approved EN at build, `humanReviewed: false` → **IT not published v1** (only `en`). | Publish IT as draft | §2.3 #2 gate: all pages humanReviewed required. | Yes (IT review) |
| D13 | Mockup micro-copy reused with `needsClientApproval: true` flags in content: "A pathway, not an internship" (EN), shift-of-perspective pairs, "cycle of disappointment" headline. | Drop them | §2.2.4 allows with flag. | Yes |
| D14 | Analysis of mockup nav (Sito_02) shows **Technical Passport / Risorse / Storie** menu naming that differs from the architecture's approved nav; the architecture nav wins (authority hierarchy §2.2.1). | Mockup nav | Architecture is the authority for structure/wording. | No |
| D15 | ALTCHA challenge served from `app/api/altcha` route with HMAC env key; in-memory rate limit behind an interface (swap to Redis later). | No third-party captcha | §12. | No |
| D16 | Consent: since v1 ships **no non-essential storage and no third-party scripts**, the banner is not rendered; "Cookie settings" in footer opens a Radix preferences panel documenting strictly-necessary storage only. | Banner always | §11.2. | No |

## Content gaps / omissions (not fabricated)

- No postal address, email, phone or social links (owner must supply — see owner-inputs).
- Stories/resources/events/news: all empty → empty states + hidden sections per flag specs.
- Associated partners: copy exists (architecture), names/logo plainly absent.
- "European Protocol" resource: exists unpublished.
