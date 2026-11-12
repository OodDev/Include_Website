# AGENTS.md

Guidance for AI coding agents working on **INCLUDE — Erasmus+ website**
("From protected paths to real jobs", KA220-VET). Full project spec lives in
[`INSTRUCTIONS.md`](INSTRUCTIONS.md); day-to-day context lives in `docs/`.

## Project overview

A multilingual, static-first Next.js marketing website for a European
Erasmus+ Cooperation Partnership (coordinator: Bene Futuro srl, 6 partners,
4 countries). 9 core routes (plus dynamic `news` and `results-and-tools`
subpages) + 4 legal pages (incl. accessibility); 5 locales
(en published; it draft; pt/es/el message-ready). No CMS, no database —
content is MDX/YAML in `content/`. Contact via Server Action → mail adapter;
ALTCHA proof-of-work anti-spam; consent manager; GDPR-by-design.

## Setup commands

```bash
pnpm install                 # pnpm 12.18 (packageManager field), Node 26 (.nvmrc)
pnpm dev                     # dev server on :3000
pnpm build                   # production build (output: standalone)
pnpm typecheck               # tsc --noEmit
pnpm lint                    # eslint .
pnpm test                    # Vitest unit + integration (tests/unit, tests/integration)
pnpm test:e2e                # Playwright (needs: pnpm exec playwright install chromium)
pnpm check:content           # validate content/ MDX + YAML against Zod schemas
pnpm check:i18n              # message key + {token} parity across 5 locales
pnpm check:placeholders      # fails on mockup stand-ins ([Foto…], lorem, TODO) in renderable content
pnpm check:schema            # JSON-LD type allowlist/forbidden types
pnpm check:launch            # RELEASE GATE ONLY — fails while legal drafts unapproved
pnpm gen:llms                # snapshot llms.txt routes to dist/ (server must be running)
pnpm format                  # prettier --write .
pnpm analyze                 # production build with bundle analysis (ANALYZE=true)
```

After `pnpm build`, the standalone output needs a manual `cp -R public .next/standalone/`
and `cp -R .next/static .next/standalone/.next/`, then `PORT=3000 node .next/standalone/server.js`.
Never run `pnpm start` against a standalone build.

## Where everything comes from (source of truth)

All design, structure and graphic decisions trace back to the owner-provided
PDFs — held **locally only** (repo root + `docs/source/` copies), deliberately
**never committed or pushed** (see `.gitignore` `*.pdf` rule, `.githooks/pre-push`,
and the CI guard in `.github/workflows/ci.yml`). After a fresh clone, restore
them manually if needed and activate the hook with `git config core.hooksPath .githooks`.
They are the foundational authorities; never invent design, structure or copy
beyond them. Later owner instructions and delivered assets (variation-3 art
direction, official SVG package) are recorded as decisions D17–D20 and are
equally binding where they supersede the PDFs.

| Asset | PDF | Used for |
| --- | --- | --- |
| Website architecture, nav, page texts | `Website Architecture, Structure, Wireframe/WEBSITE_ARCHITECTURE_WIRFRAME_Website_Pages_Navbar_Texts.pdf` | authority for **sitemap, navigation, URL naming, page copy** (mockup nav naming loses on conflict — decisions.md D14) |
| Brand foundations: colour palette, typography, rules | `Brand kit…/Brand 01 – Fondamenti.pdf` | hex values in `src/styles/tokens.css` + `src/config/brand.ts` (Outfit typography since D17 — Manrope survives only in the footer logo SVG tagline, which is owner artwork; `docs/design-plan.md` still says Manrope-only and D17 supersedes it), accessibility text rules, pill/card radii |
| Print & events layout | `Brand kit…/Brand 02 – Stampa ed eventi.pdf` | print-language grounding (bands, labels) |
| Digital & social | `Brand kit…/Brand 03 – Digitale e social.pdf` | digital layout idioms, OG/social rules |
| Ready for Inclusion & co-branding | `Brand kit…/Brand 04 – Ready for Inclusion e co-branding.pdf` | `ReadyLabel`, EU-funding visibility, partner/EU emblem placement rules |
| Mockup: Home | `Brand kit…/Sito 02 – Home.pdf` | home layout, micro-copy (flagged `needsClientApproval` where reused) |
| Mockup: inner page "Il modello" | `Brand kit…/Sito 03 – Pagina interna Il modello.pdf` | pathway page layout |
| "e" supergraphic brief | `Brand kit…/La e – marchio breve e supergrafica.pdf` | `SuperE` background component |
| Icon set (exploration 03) | `Brand kit…/Set di icone – esplorazione 03, stile logo.pdf` | 24 icons in `src/components/brand/Icon.tsx` — now the **official designer SVGs inlined verbatim** (D20), structure tone via `--icon-structure` (default petrol); exception: the navbar `home` icon remains our drawn glyph (not in the owner sheet, `TODO(brand-asset)`) |

The PDFs are **raster exports only** (verified: no vector data). Consequences,
per the spec's own fallback rule (decisions.md D01), updated by D17/D20:

- Design fidelity is now anchored to home **variation 3 "petrolio
  immersive"** (owner instruction 2026-11-11, D17/D18): Outfit typeface,
  petrol-deep as leading colour, petrol structure icons, body copy on petrol
  grounds always full white (WCAG 2.2 AA gate). Colour set remains
  Brand-01-only. Visual reference: the owner-approved screenshots in
  `mockups/` (D17's original `mockups/home-variants.html` is no longer in
  the repo; do not recreate design from memory — check the screenshots).
- **Official vector brand assets are integrated** (designer package, D20):
  24 icons inlined verbatim in `Icon.tsx`, official "e" letterform in
  `src/components/brand/eMark.ts` driving `LogoMark` and the favicon, official
  wordmark, `ReadyLabel` badges from `public/brand/`. Tracked provenance
  copies in `assets/brand/`. Remaining placeholders: EU emblem and partner
  logos (slot intentionally absent until the owner delivers official files —
  `docs/owner-inputs.md`), and the navbar `home` icon (drawn glyph,
  `TODO(brand-asset)`); do **not** imitate letterforms or fake logos.

The derived interpretation of these sources — recorded decisions D01–D20,
owner-input checklist, content analysis — lives in
[`docs/decisions.md`](docs/decisions.md), [`docs/owner-inputs.md`](docs/owner-inputs.md)
and [`docs/design-plan.md`](docs/design-plan.md). Execution documentation
(architecture, SEO, privacy/ROPA, runbook, launch checklist, completion
report) is in `docs/`.

## Hard rules (violations have blocked or reverted work)

1. **No fabrication.** Never invent names, contacts, numbers, logos, dates,
   quotes, postal addresses or pages. Anything owner-supplied is gated on env
   or owner inputs; missing data ships as an honest hidden/notOperational
   state (`docs/owner-inputs.md` is the checklist).
2. **Copy fidelity.** Approved EN architecture text is copied verbatim; IT
   drafts carry `humanReviewed: false`; every Italian "marked" micro-copy from
   mockups carries `needsClientApproval: true` in content.
3. **Brand fidelity.** Only Brand 01 hexes may appear as colours; targets are
   labelled as targets ("up to 20 companies… These are project aims"); WCAG
   2.2 AA is the minimum bar.
4. **Lawful-by-design (INSTRUCTIONS.md §11–§12).** No non-essential storage or
   third-party requests before consent; no analytics by default; secrets in
   env only (`src/env.ts`); recipients from `CONTACT_TO_EMAIL`/`CONTACT_ROUTING`
   env, never hard-coded; never log form bodies.
5. **Content is Zod-validated and fails closed.** Invalid frontmatter must
   never render (see `src/lib/content/*`); `pnpm check:content` runs in CI.
6. **Legal drafts & launch.** Legal pages ship as drafts with visible banners;
   `pnpm check:launch` is the release gate and must fail while they're
   unapproved.

## Architecture rules

- **Next.js owns the build.** No Vite bundler/dev server; no Storybook — only
  `vitest.config.ts` for tests and the private `/dev/design-system` route
  (noindex, hidden in production builds). → ADR 0001.
- **Rendering is static-first.** `generateStaticParams` + `setRequestLocale`;
  draft locales are served on English physical path segments via the custom
  proxy in `src/proxy.ts` (beware: next-intl's localised-pathname rewrites
  redirect-loop in standalone builds). Localised pathnames switch on only
  when a locale is published. The same proxy hosts the optional **preview
  gate** (D19): when `PREVIEW_PASSWORD` is set (preview deployments only),
  every page request requires it before any content is served.
- **Layer boundaries.** `src/components` (presentational) →
  `src/features` (contact/newsletter/consent/legal: UI + action + schema) →
  `src/lib` (pure logic, loaders, mail/security/seo adapters) →
  `src/config` (brand/locales/navigation/site). Tests import through `@/` alias.
- **Tailwind v4 CSS-first.** Tokens live in `src/styles/tokens.css` via
  `@theme` (default palette reset with `--color-*: initial`). Behaviour codes:
  `u-label` for brand labels; radii per element (`rounded-card-lg`, `rounded-pill`,
  `rounded-input`), never one radius everywhere. Note: `src/lib/utils/cn.ts`
  extends tailwind-merge to classify our custom `text-*` tokens as font sizes —
  keep that list in sync with tokens.css.
- **Activity locations.** Per-locale routes in `src/app/[locale]/`, machine
  routes under `src/app/api` + `OG`, SEO generators as route files
  (`sitemap.ts`, `robots.ts`, `feed.xml`, `llms*.txt`, `manifest.tsx`).

## Code style

- TypeScript strict (`exactOptionalPropertyTypes` on); TS pinned 5.9.3 (D02).
- Avoid client components unless there is real interactivity; split motion
  (`motion/react` only inside brand components that need it) and respect
  `prefers-reduced-motion` (§8: restrained motion, single loops).
- Accessible by default: labelled controls, focus-visible rings, keyboard nav,
  skip link; axe checks in e2e.
- Comments carry decisions, not narration; brand-placeholder code carries
  `TODO(brand-asset)` with a pointer to the missing owner asset.
- Commits: conventional-ish, one concern per commit; note spec deviations with
  a reference to `docs/decisions.md` (Dxx).

## Testing instructions

- Unit/integration (Vitest, jsdom): content schemas, loaders, consent logic,
  ALTCHA verification, metadata, preview gate, brand↔tokens parity
  (`tests/unit`), `tests/integration` for real repo content.
- E2E (Playwright): core routes × EN (IT where published), third-party-request
  guard, consent flows, 404, contact notOperational state; desktop + mobile
  projects configured in `playwright.config.ts`.
- Before finishing any change run: `pnpm typecheck && pnpm lint && pnpm test`
  and the relevant `check:*` scripts; fix everything until green.

## Security notes

- Validate all inputs with Zod (`src/env.ts`, `src/lib/contact/submit.ts`);
  honeypot returns the same generic response as success; rate limit per IP;
  ALTCHA server verification is timing-safe with HMAC-signed expiring salts.
- Preview gate (D19): `PREVIEW_PASSWORD` is set **only on preview
  deployments, never production**; the gate validates it via SHA-256 digest
  with constant-shape comparison, sets an httpOnly cookie, and never logs
  submitted values.
- CSP starts Report-Only (ADR 0002) — when enabling new external origins,
  write an ADR first. Security contact in `/.well-known/security.txt/route.ts`
  must stay owner-supplied.
- `.env.example` documents names/descriptions only; never commit real envs.

## Next.js agent file

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
