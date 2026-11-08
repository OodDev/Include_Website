# INCLUDE — Website Build Instructions (Coding Agent)

> **Mission:** Build the production-ready, accessible, fast, secure, multilingual-ready, SEO/AIO-optimised and GDPR-compliant website of **INCLUDE – From protected paths to real jobs**, an Erasmus+ KA220-VET Cooperation Partnership.
> **Read this file fully before writing code.** Then follow the phases in §16.

**How to read this document.** "MUST / NEVER" are hard requirements. "SHOULD" is the default unless you log a reason in `docs/decisions.md`. Section numbers are referenced throughout; keep them in mind.

---

## 0. Priorities and operating rules

### 0.1 Order of precedence (when instructions conflict)
1. **Legal, privacy, security and accessibility requirements**, and the **no-fabrication rule** (§0.4).
2. **INCLUDE brand identity (§5)** and the **approved source copy** (§2).
3. This document.
4. Default behaviour of the `frontend-design` and `ui-ux-pro-max` skills.
5. Your own preferences.

### 0.2 Work as one team with five lenses
You are one agent, but apply all five professional lenses and run a short review through each at the end of every phase (§16):

| Lens | Owns |
|---|---|
| **Frontend Architect** | Repo structure, rendering strategy, module boundaries, i18n, content model, performance budgets |
| **Senior Web Developer** | Clean TypeScript, components, forms, tests, tooling, maintainability |
| **UX/UI Designer** | Faithful brand application, layout, motion restraint, inclusive UX, microcopy |
| **SEO + AIO/AEO/GEO/LLMO Specialist** | Metadata, structured data, answer-ready content, crawler policy, `llms.txt` |
| **Security / DevOps / Google-API Engineer** | Headers, secrets, form hardening, CI/CD, Docker, privacy-safe integrations |

### 0.3 Skills (load first)
At the start of the session load, in this order:
1. `frontend-design`
2. `ui-ux-pro-max` — if not installed, install it following **its own README** (do not guess commands).

If either is unavailable, say so in `docs/decisions.md` and in the completion report, and apply their principles manually. **Never claim to have loaded a skill you could not load.** Use the skills for composition, hierarchy, motion restraint, accessibility and UX quality — **never to change palette, typeface, logo or graphic language** (the brand wins, including its uppercase 14 px labels and fixed palette).

### 0.4 Working method
1. **Inspect first.** If a repository exists, inspect its package manager, code, config and assets before changing anything; follow its conventions and never overwrite supplied assets. If none exists, scaffold per §3–§4 (pnpm).
2. **Read the sources properly.** The PDFs are visual: extract text **and** rasterise pages (`pdftoppm -r 110 -png`) and look at them. Copy all PDFs to `docs/source/` (read-only reference).
3. **Build the complete application**, not a mock-up: responsive states, content model, metadata, legal/consent interfaces, validation, tests, documentation and operational safeguards.
4. **Keep the app runnable after every phase.** Before declaring any phase done, run lint, typecheck, tests and a production build; **fix failures, don't just report them**.
5. **Do not block on questions.** Where something is open, adopt the stated default, log it in `docs/decisions.md` (decision · alternatives · reason · who must confirm) and continue.
6. **Small conventional commits** (`feat:`, `fix:`, `chore:`, `docs:`, `test:`); `main` stays buildable.
7. **Boring, maintained dependencies.** At install time verify each package's current stable version with `npm view <pkg> version`; pin through the lockfile; document major choices. Consult current official docs (Next.js, next-intl, Tailwind, Radix) rather than relying on memory.
8. Avoid unnecessary abstractions, premature microservices, and client-side fetching for content that can render on the server.

### 0.5 No fabrication (hard rule)
NEVER invent: project facts, numbers, partner details, deliverables, addresses, phone numbers, emails, legal identities, registration/VAT numbers, social profiles, URLs, dates, funding claims, statistics, citations, quotes or testimonials.
- Missing information → a typed gap in the content model (`status: "missing"`) or a **non-public** configuration placeholder; the UI hides the section or element instead.
- **Targets are targets; planned outputs are planned.** Never present a target as an achievement or a planned output as published.
- Bracketed mockup placeholders (`[00]`, `[Foto: …]`, `[Titolo evento]`, `[GG MMM]`, `[Nome Cognome]`) are design stand-ins and MUST NOT appear in production output (§15 `check:placeholders`).
- **Copy fidelity:** use the approved wording. Edits are allowed only for spelling, accessibility, SEO headings or readability, with meaning preserved.
- The architecture document mirrors the *narrative logic* of the BYBLIOS site; do **not** copy BYBLIOS text, layout or assets.

---

## 1. Project context

- **Project:** INCLUDE – From protected paths to real jobs
- **Programme:** Erasmus+ Cooperation Partnerships in Vocational Education and Training (KA220-VET)
- **Project number:** `2026-1-IT01-KA220-VET-000465826`
- **Duration:** 24 months · **Period:** 1 October 2026 – 30 September 2028
- **Coordinator:** Bene Futuro srl (Italy)
- **Partners (6 organisations, 4 countries):** Bene Futuro srl (IT, coordinator) · University "G. d'Annunzio" of Chieti–Pescara (IT) · DESINCOOP (PT) · Qualificalia Analytics (ES) · ISON Psychometrica (GR) · Confartigianato Imprese Chieti (IT). Associated partners exist but are **not named** in the sources.
- **What it does:** creates inclusive pathways from vocational training to real employment for young adults with (mild-to-moderate) cognitive disabilities, with a **corporate-led** model: a three-phase continuum (Protected Gym → Pre-corporate preparation → Work-based learning in SMEs), a Corporate Inclusion Readiness Index, ESCO-mapped vocational profiles, mentoring, Technical Passport and micro-credentials, a *Ready for Inclusion* framework/label and an Ambassador SME network.
- **Targets (label as targets):** up to 20 companies per partner country in the Ready for Inclusion initiative; at least 400 SMEs reached through the Corporate Inclusion Starter Toolkit and wider outreach.

**Audiences** (drive navigation and copy): (1) **Companies/SMEs** — primary conversion audience; (2) **People, families, practitioners, educators**; (3) **VET providers, researchers, institutions, policymakers, employer associations**.

**Brand concept:** *"Rappresentiamo il passaggio, non la condizione. Persone che si muovono, ambienti che si aprono, imprese che partecipano."* — represent the transition, not the condition. The **dot is the person**.

**Tone of voice:** clear, warm, concrete, plain language, active voice, sentence case. **Agency, competences, learning and participation — never deficit-based, pity-based or paternalistic language or imagery.** Brand "to avoid": puzzle pieces, helping/holding hands, protected people carried by others, disability symbols as decoration.

---

## 2. Sources, hierarchy and resolved decisions

### 2.1 Files provided
| File | Role |
|---|---|
| `WEBSITE_ARCHITECTURE_WIRFRAME_Website_Pages_Navbar_Texts.pdf` | **Information architecture, approved EN copy, page purposes, CTAs, footer facts.** Authority for structure, facts, wording. |
| `Brand_01 Fondamenti.pdf` | Logo variants, palette, accessibility rules, typography, graphic language. **Authority for visual identity.** |
| `Brand_02 Stampa ed eventi.pdf` | Print/event applications (letterhead, deliverable cover, roll-up, badge). Reference for supergraphic usage and future templates; bracketed fields are placeholders. |
| `Brand_03 Digitale e social.pdf` | Web header/hero pattern, social cards (quote, data, event, carousel), newsletter header, avatar. |
| `Brand_04 Ready for Inclusion e co-branding.pdf` | Label variants and co-branding rules. |
| `La e marchio breve e supergrafica.pdf` | The "e" as short mark, favicon/app icon, supergraphic rules. |
| `Set di icone esplorazione 03 stile logo.pdf` | **Canonical icon set** (24 icons, 4 families). |
| `Sito_02 Home.pdf`, `Sito_03 Pagina interna Il modello.pdf` | **Page layouts (IT copy)** for Home and the Pathway page; visual reference for all other pages. |
| `Include_2_GRAFICA.pdf` | Exploratory (colour tests, badge tests, "esplorazione 02" outline icons). **Superseded**; reference only. |

### 2.2 Hierarchy
1. **Facts, structure, wording (EN)** → Architecture PDF.
2. **Visual identity** → Brand PDFs.
3. **Layout and IT microcopy** → Sito_02 / Sito_03.
4. A text that exists only in a mockup (e.g. "A pathway, not an internship", the "shift of perspective" pairs) may be used, translated, and flagged `needsClientApproval: true`.

### 2.3 Resolved decisions (apply as written; log in `docs/decisions.md`)

| # | Topic | Decision |
|---|---|---|
| 1 | **"Next.js + Vite"** | Next.js owns dev server, routing, rendering and production build (Turbopack/webpack). **Vite is not used as bundler or dev server.** Use **Vitest** (Vite-powered) for unit/component tests only, via `vitest.config.ts`. **No `vite.config.ts`, no Storybook** (a private `/dev/design-system` route is enough). Record in `docs/adr/0001-nextjs-owns-the-build.md` and `docs/architecture.md`. |
| 2 | **Locales** | i18n architecture is in from day one (`next-intl`, locale-prefixed URLs). `en` is source/default and `x-default`. `it` is implemented (mockups are Italian). **A locale is published (sitemap, hreflang, switcher) only when *all* its pages are `humanReviewed`.** No unreviewed machine translation goes live. With one published locale the language switcher is hidden. `pt`, `es`, `el` are disabled stubs. |
| 3 | **Navigation** | Eight pages, architecture order: Home · The Project · The Pathway · Results & Tools · Ready for Inclusion · Partners · News · Contact. `navigation.ts` stores this order and drives sitemap, footer and mobile menu. **Desktop header** follows the mockups: logo (= Home link) · The Project · The Pathway · Results & Tools · Partners · News · Contact · **"Ready for Inclusion" as the highlighted pill (last, in DOM order too, so focus order = visual order)**. Flag this reordering for owner confirmation. |
| 4 | **URLs** | `/{locale}/…`, `localePrefix: "always"`, English internal route names, localised pathnames per locale (§6.1). Results page slug is `results-and-tools`. Legal pages sit at locale root (`/en/privacy-policy`, not `/legal/…`). **No trailing slash**; 301 to canonical. |
| 5 | **Phase names** | Full names in headings/body: *Protected Gym*, *Pre-corporate preparation*, *Work-based learning in SMEs*. Short labels on icons/chips/track: **PROTECTED · PRE-CORPORATE · OPEN MARKET**. Define both in one glossary entry. |
| 6 | **Home** | Use the mockup layout, but honour the architecture's concision principle: sections without real content are **hidden by feature flag** until data exists (§6.2). |
| 7 | **Hero H1** | EN = "From protected paths to real jobs" (architecture). IT = "Dal contesto protetto al lavoro reale" (mockup). Same promise; alternates linked via hreflang. |
| 8 | **European Protocol for Work Inclusion** | Appears in mockups but **not** in the architecture's nine outputs. Add as resource entry with `needsClientApproval: true`, **unpublished** until confirmed. Public copy (e.g. the Institutions card) cites only confirmed outputs (White Paper, recommendations). |
| 9 | **Network figures** | Show **targets** labelled as targets. Live counters ("[00] companies in [00] countries") only when `features.networkCounters` is on **and** verified figures exist. |
| 10 | **"Discover the INCLUDE network" CTA** | → `/ready-for-inclusion#ambassador-network` (company-oriented network). Confirm with owner; partners remain one click away in nav. |
| 11 | **Technical Passport & resource pages** | No thin pages. Resource detail pages (including a dedicated Technical Passport page) are generated **only when approved content is sufficient** (status ≠ `planned` or ≥ ~150 words of approved copy). Otherwise the resource appears on the list, the Technical Passport is reachable via `/results-and-tools#technical-passport`, and detail routes are 404/excluded from sitemap. |
| 12 | **Icons** | Use exploration **03**. |
| 13 | **Paper tone** | Define `--color-paper: #F3F3F1` (derived from mockups; confirm). |
| 14 | **Colour values** | Only the Brand 01 hex values in §5.1. |
| 15 | **Accessibility baseline** | **WCAG 2.2 AA**. |
| 16 | **Motion** | The restrained spec in §8 (one signature moment + action feedback). |
| 17 | **Structured data** | Conservative set in §9.2; no speculative schema types. |
| 18 | **`llms.txt`** | Generated at build from `/content` (route handlers); never a hand-maintained static file. |
| 19 | **Google integrations & captcha** | None are built or enabled by default; opt-in playbook in §13. **reCAPTCHA is prohibited**; default anti-spam is ALTCHA + honeypot + rate limiting. |
| 20 | **Newsletter / contact availability** | Forms render as operational only when a provider is configured; otherwise they are hidden/disabled with an owner-facing setup note in `docs/owner-inputs.md` (§6.9). |
| 21 | **Styling** | Tailwind CSS v4, CSS-first tokens (no `tailwind.config.ts`), unless an existing repo already standardises otherwise. |

### 2.4 Brand asset handling
The PDFs contain no standalone vector files.
1. **Extract, don't redraw.** The PDFs are vector: attempt clean extraction of the logo variants, "e" mark, 24 icons, Ready for Inclusion label (e.g. `pdftocairo -svg -f N -l N`, `mutool draw -F svg`, or Inkscape CLI if available), crop to each asset, optimise (SVGO), **verify visually against the rasterised page**, store in `assets/brand/` and record provenance in `assets/brand/README.md`. Extracting existing vector paths is allowed; **auto-tracing rasters is not**.
2. **If clean extraction fails:** 
   - Logo, "e" mark, label, Erasmus+/EU emblem, partner logos → **never redrawn or approximated.** Use a clearly flagged neutral temporary placeholder (plain Manrope text "INCLUDE", no brand colours or letterform imitation) and log the blocker.
   - Icons → temporary faithful recreations on a 48-unit grid are allowed, each marked `// TODO(brand-asset): replace with official SVG`.
3. The **Erasmus+/EU emblem** must be the official Commission file, unaltered. Partner logos only as supplied and verified by the owner.

---

## 3. Technology decisions

| Concern | Decision |
|---|---|
| Framework | **Next.js (latest stable, App Router)**, React 19, Server Components by default (Client Components only for real interactivity), **TypeScript strict** (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`; no `any` shortcuts) |
| Package manager / runtime | Existing repo's manager if any; else **pnpm** with `packageManager` field. Node active LTS in `.nvmrc` + `engines` |
| Styling | **Tailwind CSS v4** (CSS-first `@theme` tokens); `class-variance-authority`, `clsx`, `tailwind-merge` |
| Accessible primitives | **Radix UI** (Dialog, Accordion, DropdownMenu, VisuallyHidden) styled in-house; no heavy UI kit |
| Motion | **`motion`** (`motion/react`, successor of Framer Motion) with `LazyMotion` + `domAnimation`; prefer CSS / scroll-driven CSS where simpler |
| i18n | **`next-intl`**, `localePrefix: "always"`, localised pathnames, static rendering via `setRequestLocale`; disable the locale cookie unless documented as strictly necessary (verify the option in current docs) |
| Content | File-based: **MDX + YAML/JSON in `/content`**, parsed with `gray-matter` + `next-mdx-remote/rsc`, **validated with Zod at build**. CMS-agnostic data layer (`lib/content`) so Keystatic/Sanity/Decap can be added later. **No CMS dependency without owner approval.** |
| Forms | **Server Actions** + Zod (progressive enhancement); honeypot + time-trap + rate limit + **ALTCHA** (self-hosted proof-of-work; challenge served by `app/api/altcha`). Must stay usable without relying on a captcha as the only path. |
| Email / newsletter | Provider-agnostic interfaces (`lib/integrations/mail`, `…/newsletter`); default **Brevo** (EU-based, double opt-in) or SMTP. Provider chosen/approved by owner. |
| Analytics | Provider-agnostic wrapper; default **`none`**. Supported when approved: `plausible`/`matomo` (cookieless, EU-hosted) or `ga4` (consent-gated, Consent Mode v2). |
| Fonts | **Manrope** via `next/font/google` (downloaded and self-hosted at build; no runtime request to Google). If build-time download is impossible or the owner supplies font files, use `next/font/local`. Subsets: latin, latin-ext, greek (verify). |
| Testing | **Vitest** + Testing Library; **Playwright** + `@axe-core/playwright`; Lighthouse CI |
| Lint/format | ESLint flat config (`eslint-config-next`, `jsx-a11y`, `eslint-plugin-boundaries`), Prettier (+ Tailwind plugin), Husky + lint-staged |
| Rendering | **Static generation for all content pages**; ISR for News and any remote data; dynamic only for form endpoints. Do not sacrifice static rendering without an ADR. |
| Hosting | **Vendor-agnostic; no vendor assumed without owner approval.** Ship a `Dockerfile` (multi-stage, `output: "standalone"`, non-root, healthcheck) **and** Vercel-compatible config pinned to an **EU region**. Personal data stays in the EU by default. |
| Database | **None.** (No DB, no auth, no CMS in v1.) If one is ever introduced: parameterised queries, backups/restore guidance, ADR. |

---

## 4. Repository structure

Feature-oriented, thin routes, one-way dependencies. Adapt to an existing repo where justified, but keep these domain boundaries and avoid a flat `components/` dumping ground.

```
include-website/
├─ .github/workflows/        ci.yml · codeql.yml · lighthouse.yml
├─ assets/brand/             # extracted official SVGs + README.md (provenance, §2.4)
├─ docs/
│  ├─ source/                # client PDFs (read-only)
│  ├─ adr/                   # 0001-nextjs-owns-the-build.md …
│  ├─ legal/                 # ropa-template.md · dpa-checklist.md · cookie-inventory.md · policy drafts
│  ├─ architecture.md · decisions.md · content-and-assets.md · seo-and-discovery.md
│  ├─ privacy-and-security.md · deployment-runbook.md · launch-checklist.md
│  ├─ owner-inputs.md        # visible checklist of what the owner must supply/approve (§18)
│  └─ completion-report.md   # written at the end (§18)
├─ public/                   # brand/ (optimised SVGs, favicon set) · images/ · partners/ · downloads/
├─ content/
│  ├─ pages/{en,it}/         # MDX per page — copy lives here, not in components
│  ├─ news/{en,it}/          # MDX posts, Zod-validated frontmatter
│  ├─ legal/{en,it}/         # privacy, cookie, accessibility, legal-notice (MDX, drafts until approved)
│  └─ data/                  # partners.yaml · resources.yaml · faq.yaml · glossary.yaml
├─ messages/                 # UI strings: en.json · it.json (+ pt/es/el stubs)
├─ src/
│  ├─ app/
│  │  ├─ [locale]/
│  │  │  ├─ layout.tsx · page.tsx                         # Home
│  │  │  ├─ the-project/ · the-pathway/ · ready-for-inclusion/ · partners/ · contact/
│  │  │  ├─ results-and-tools/page.tsx · [slug]/page.tsx  # detail only when §2.3 #11 allows
│  │  │  ├─ news/page.tsx · [slug]/page.tsx · category/[category]/page.tsx
│  │  │  ├─ privacy-policy/ · cookie-policy/ · accessibility/ · legal-notice/
│  │  │  ├─ glossary/                                     # behind feature flag (§6.10)
│  │  │  ├─ feed.xml/route.ts                             # RSS, emitted only when ≥1 post
│  │  │  ├─ opengraph-image.tsx · not-found.tsx · error.tsx
│  │  ├─ api/health/route.ts · api/altcha/route.ts
│  │  ├─ .well-known/security.txt/route.ts
│  │  ├─ llms.txt/route.ts · llms-full.txt/route.ts
│  │  ├─ sitemap.ts · robots.ts · manifest.ts · icon.svg · global-error.tsx
│  ├─ components/
│  │  ├─ ui/        # primitives: Button, Chip, Card, Link, Accordion, Dialog, Field…
│  │  ├─ brand/     # Logo, LogoMark(e), SuperE, Icon(24), PhaseTrack, ReadyLabel
│  │  ├─ layout/    # Header, MobileNav, Footer, Breadcrumbs, Container, Section, SkipLink
│  │  ├─ sections/  # Hero, StatementBand, AmbitionCards, PhaseContinuum, AudienceCards, NetworkBand…
│  │  └─ seo/       # JsonLd, AnswerBlock, KeyFacts, Faq
│  ├─ features/     # contact/ · newsletter/ · news/ · resources/ · consent/  (UI + action + schema + tests)
│  ├─ lib/
│  │  ├─ i18n/ · content/ (loaders, Zod schemas, MDX map, placeholder guard) · seo/ · security/
│  │  ├─ motion/    # shared variants, reduced-motion helpers
│  │  ├─ integrations/  # mail/ · newsletter/ · analytics/ (· google/ only if approved, §13)
│  │  └─ utils/
│  ├─ config/       # site.ts (facts, feature flags) · navigation.ts · locales.ts · brand.ts
│  ├─ styles/       # tokens.css · globals.css · prose.css
│  ├─ types/        # small shared types only (prefer Zod-inferred types)
│  ├─ proxy.ts      # (middleware.ts on older Next) locale negotiation, headers if needed
│  └─ env.ts        # Zod-validated env, server/client split
├─ tests/           # unit/ · integration/ · e2e/ (incl. e2e/a11y)
├─ scripts/         # check-content · check-i18n · check-placeholders · check-schema · check-launch · gen-llms
├─ .env.example · Dockerfile · docker-compose.yml · next.config.ts · vitest.config.ts · playwright.config.ts
└─ README.md · CONTRIBUTING.md
```

**Dependency rule (enforce with `eslint-plugin-boundaries`):** `app → sections / features → components/ui + components/brand → lib → config`. No upward imports; no cross-imports between features. Routes stay thin: load content, compose sections, export metadata. `config/brand.ts` holds the hex values for code that cannot read CSS variables (OG images, contrast tests); a unit test asserts it matches `tokens.css`.

---

## 5. Brand and design system (non-negotiable)

### 5.1 Colour tokens
Tokens in English; Italian name in comments. **Reset Tailwind's default palette** so off-brand colours cannot be used by accident.

```css
/* src/styles/tokens.css */
@theme {
  --color-*: initial;                 /* remove Tailwind defaults */
  --color-slate:      #465056;        /* Ardesia  – text, logo, dark grounds */
  --color-sky:        #9FBBC9;        /* Cielo    – icon structure, fills */
  --color-rust:       #C14723;        /* Ruggine  – the person, accent, primary CTA */
  --color-petrol:     #068A92;        /* Petrolio – second colour, events */
  --color-petrol-deep:#08767C;        /* Petrolio scuro – bands carrying white text */
  --color-burgundy:   #671317;        /* Bordeaux – warm titles */
  --color-red:        #B2252F;        /* Rosso    – polychrome logo */
  --color-ochre:      #D3851D;        /* Ocra     – graphics only, NEVER text */
  --color-mist:       #E2E9ED;        /* Nebbia   – supergraphic on white */
  --color-paper:      #F3F3F1;        /* derived from mockups – confirm */
  --color-white:      #FFFFFF;
}
```
**Usage rules**
- Slate carries text, logo and dark sections; sky = structures/fills; rust = the person/accent/primary CTA; **ochre never carries text**. Let slate and white carry most content; use rust/petrol/sky as controlled accents.
- **White text only on slate, rust, burgundy, red.** On petrol only large text (≥ 24 px) or use `petrol-deep`. **Never white text on sky, ochre or mist — use slate.**
- Rust small text only on white; if checks fail on `paper`/`mist`, use burgundy or larger/bolder text.
- The brand guide's examples don't replace testing: a unit test computes WCAG contrast for every text/background token pair in use and fails below AA (4.5:1 normal, 3:1 large). Expected approx.: slate/white ≈ 8:1, white/rust ≈ 5:1, white/petrol ≈ 4.2:1 (large only), white/petrol-deep ≈ 5.4:1.

### 5.2 Typography
- **Manrope only**, weights ExtraLight–ExtraBold; 400/500 body, 700/800 headings.
- Fluid scale (`clamp`): H1 ≈ 2.5–4 rem / 800 / tight leading; H2 ≈ 1.75–2.5 rem / 700 (brand base 28 px bold); H3 ≈ 1.25–1.5 rem / 700; **body 18 px, line-height ≥ 1.65**; **labels/captions 14 px uppercase, tracking ≈ 0.08em, bold**. Uppercase only for short labels, never long content.
- Line length **65–75 ch**; short sentences and generous spacing (the audience includes people with cognitive disabilities).

### 5.3 Shape, spacing, elevation (from mockups)
- Container ≈ 1200 px max, generous gutters, 8-pt spacing scale, large vertical rhythm (96–128 px desktop).
- Cards: white, radius ≈ 20–24 px, hairline border or very soft shadow; pills for buttons/chips; inputs ≈ 12 px. **Do not apply one radius to everything.** Avoid gradients, glassmorphism and gratuitous shadows.
- Section backgrounds alternate white / paper / slate / petrol-deep. Slate bands carry white text.

### 5.4 Logo rules
- Use only approved variants: polychrome (primary), mono slate, slate+sky, burgundy+rust, rust+petrol, rust+sky, negative (white on slate); choose by background contrast. Header: polychrome on white. Footer: negative on slate.
- **Never** stretch, recolour arbitrarily, add effects, crop, rotate, outline, re-typeset or rebuild from text.
- **Clear space** ≥ height of the "i" dot on every side.
- **Below 30 mm / ~140 px *rendered logo width*, use the "e" alone** (short mark). This is driven by the logo's rendered width, not the viewport width.
- The logo links to Home with an accessible name.

### 5.5 The "e": short mark and supergraphic
- `LogoMark`: whole, filled "e", with or without the rust dot ("eye"). Uses: favicon (24/48 px), avatar, app icon (petrol rounded square, white "e", rust dot), Technical Passport icon, badge.
- **Do:** whole, filled, cropped by the container edge. **Don't:** open, line-reduced, rotated, deformed, outlined.
- `SuperE`: huge, cropped by the edge, **tone-on-tone** (on white = `mist` with white eye; on slate = lighter slate with rust dot; on petrol = darker petrol). Used in the hero and 1–2 other places only. It is the one memorable graphic gesture; keep everything else quiet. Decorative SVG: `aria-hidden`, `pointer-events: none`, never harming text contrast.

### 5.6 Icons (24, four families)
Solid stroke matching the logo letters, rounded terminals; **structure in `sky`; the person is always one `rust` dot** (the same sign as the dots of the "ü"). On slate, structure stays sky. Legible at 24 px.

| Family | Icon ids |
|---|---|
| Pathway | `protected-context`, `pre-corporate`, `labour-market`, `pathway`, `threshold`, `connection` |
| People & companies | `person`, `skills`, `training`, `autonomy`, `company`, `ready-for-inclusion` |
| Tools | `european-protocol`, `micro-credentials`, `technical-passport`, `white-paper`, `toolkit`, `policy-institutions` |
| Values & storytelling | `recognition`, `participation`, `reciprocity`, `stories`, `data-impact`, `events` |

`<Icon name size />` with a typed union of ids; inline SVG via SVGR; `aria-hidden` by default, accessible name only when the icon is the sole content. Phase track: `protected-context` → `pre-corporate` → `labour-market`. Asset sourcing per §2.4.

### 5.7 Component inventory (mapped to mockups)
`Header` (white, logo left, nav right, rust pill CTA, language switch if >1 locale; sticky with hairline after scroll) · `MobileNav` (Radix Dialog) · `Hero` (text left, `PhaseTrack` over `SuperE`) · `FactsStrip` · `PhaseTrack` · `StatementBand` (slate) · `AmbitionCards` · `PhaseContinuum` · `AudienceCards` · `ResourceCard` + `StatusChip` · `StoryCard` · `NetworkBand` (petrol-deep, `ReadyLabel`) · `NewsList` · `NewsletterCard` (sky) · `PerspectiveShift` (slate band, "from → **to**" pairs) · `DownloadCard` + `CompanyCtaCard` (rust) · `Breadcrumbs` · `Footer` · `ReadyLabel` (vertical "e" + INCLUDE / READY / FOR / INCLUSION aligned to the tail; variants: slate, sky-with-person, plaque slate, plaque petrol, horizontal, web band) · `KeyFacts` · `AnswerBlock` · `Faq` · `Prose`.

### 5.8 Co-branding and EU visibility
- **Fixed order:** INCLUDE → official Erasmus+/EU emblem → partners, separated by thin rules; with many logos INCLUDE switches to the **monochrome** version. Partner logos match the **optical height of the x of "include"**, never larger.
- Use the **official EU emblem + "Funded by the European Union"** exactly as supplied by the Commission; verify against current EC visual-identity guidance. Funding visibility appears in the footer of every page.
- Footer disclaimer, verbatim (translate only with an official EU translation; otherwise keep English):
  > Funded by the European Union. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or the competent granting authority. Neither the European Union nor the granting authority can be held responsible for them.

### 5.9 Imagery
Authentic, dignified, agency-centred images of people learning, working and collaborating, with documented consent/releases. No stock clichés, no pity framing. Until real images exist, calm tinted placeholder blocks are allowed **in dev/preview only**; in production hide the section.

### 5.10 UX quality bar
Clear hierarchy, strong hero, generous whitespace, consistent grid; contemporary, confident, European, human — not corporate-template, childish, clinical or charity-pity. Never hide essential information behind hover or animation. Use buttons for actions and links for navigation (no clickable non-semantic containers). Avoid carousels unless there is a strong content reason (then keyboard controls, pause, reduced motion). Provide intentional empty, loading (only where async exists), success, validation and error states.

---

## 6. Information architecture and page specs

### 6.1 Routes and localised slugs
Default locale `en`; `/` redirects to the default or negotiated *published* locale; `x-default` → `/en`.

| Page | EN | IT | Nav label EN / IT |
|---|---|---|---|
| Home | `/en` | `/it` | — |
| The Project | `/en/the-project` | `/it/il-progetto` | The Project / Il progetto |
| The Pathway | `/en/the-pathway` | `/it/il-modello` | The Pathway / Il modello |
| Results & Tools | `/en/results-and-tools` (`/[slug]`) | `/it/risorse` (`/[slug]`) | Results & Tools / Risorse |
| Ready for Inclusion | `/en/ready-for-inclusion` | `/it/ready-for-inclusion` | pill CTA |
| Partners | `/en/partners` | `/it/partner` | Partners / Partner |
| News | `/en/news` (`/[slug]`, `/category/[c]`) | `/it/news` | News / News e storie |
| Contact | `/en/contact` | `/it/contatti` | Contact / Contatti |
| Privacy · Cookies · Accessibility · Legal notice | `/en/privacy-policy` · `/cookie-policy` · `/accessibility` · `/legal-notice` | `/it/privacy` · `/cookie` · `/accessibilita` · `/note-legali` | footer |
| Glossary (flagged) | `/en/glossary` | `/it/glossario` | footer |

Every page ships: breadcrumbs (except Home), exactly one `<h1>`, canonical + hreflang (published locales), OG image, JSON-LD (§9.2). Header requirements: current page indicated; visible **skip-to-content link**; mobile menu is keyboard-operable, dismissible with Escape, traps and **returns focus**; sticky header must not obscure anchor targets or focus indicators (`scroll-padding-top`, WCAG 2.4.11).

### 6.2 Home
**Purpose:** explain INCLUDE in seconds and invite exploration. Sections in order (◇ = hidden until real content exists):
1. **Hero** — eyebrow "Erasmus+ European project"; H1; subheading "A European project to create inclusive pathways from vocational training to real employment for young adults with cognitive disabilities."; intro "INCLUDE is a 24-month Cooperation Partnership funded by the Erasmus+ KA220-VET programme…" (architecture text); **FactsStrip**: Erasmus+ KA220-VET · 24 months · 4 countries · 6 organisations (from `config/site.ts`); CTAs: primary **"Discover the project"** → The Project, secondary outline **"I am a company"** → Ready for Inclusion; right: `PhaseTrack` over `SuperE`.
2. **Why companies?** — slate `StatementBand` with the approved copy (companies are where vocational inclusion becomes real; the transition to employment stays difficult; SMEs lack practical tools, adapted workflows, structured support; INCLUDE supports both sides). A supporting headline from the mockup ("Tirocini che funzionano, ma non diventano lavoro" / "cycle of disappointment") may be used, flagged `needsClientApproval`. CTA "Discover the INCLUDE network" (§2.3 #10).
3. **What do we plan to achieve?** — three `AmbitionCards`: *A research* · *An inclusive pathway to employment* · *A network of companies ready for inclusion* (verbatim architecture texts).
4. **The pathway in three phases** — teaser (Sito_02) linking to The Pathway.
5. **Manifesto** — "Preparing people for work while preparing workplaces for inclusion." (large type, quiet background).
6. **Where do you want to start?** (IT mockup: "Da dove vuoi iniziare?") — three `AudienceCards`: *People, families and practitioners* → The Pathway; *Companies* → Ready for Inclusion; *Institutions and training* → Results & Tools (cite only confirmed outputs, §2.3 #8).
7. **What the project produces** — four featured resources (`featured: true`) with status chips → Results & Tools.
8. ◇ **Stories of passage** — needs ≥ 1 published, consent-verified story.
9. **Network band** — Ready for Inclusion label + target copy (§2.3 #9); CTA to Ready for Inclusion.
10. **Stay connected** — "Want to know more? Get in touch" → Contact; ◇ newsletter card (only when the provider is configured); ◇ news and events (≥ 1 item).

### 6.3 The Project
Heading **"From training to employment: closing the gap"**: competences developed in training/protected experiences are not always visible, transferable or tied to labour-market opportunities; SMEs may lack organisational tools, mentoring capacity, practical guidance; INCLUDE works on both sides. **"A corporate-led approach"**: companies as active co-designers, not just internship hosts; research, participatory dialogue, competence-based vocational design, mentoring, workplace adaptation, competence recognition. **"Who is INCLUDE for?"** — the six audience items (icons). Closing line "Competence grows when opportunity, preparation and support meet." `KeyFacts` (programme, duration, dates, countries, partners, project number). Optional FAQ (§9.4).

### 6.4 The Pathway (layout from Sito_03)
Breadcrumb · hero (H1 "A gradual pathway towards the workplace" + lead; the three phase chips as in-page anchors; the mockup line "A pathway, not an internship" as lead/pull-statement, flagged) · **`PhaseContinuum`**: three phase blocks, large phase icon on the left, up to four info cards on the right (*What happens / Who is involved or Role of the company or Ready for Inclusion companies / Skills (micro-credentials) / A story*); · **What supports the pathway?** (Vocational profiles · Mentoring · Company readiness · Competence recognition) · **A shift of perspective** band (assistance → competences; protected context → real work; person to adapt → environment that can change; company as host → company as co-designer; internship as experience → internship as part of a pathway) · CTA "Explore the project tools" → Results & Tools, plus "Are you a company?" card.
- All three phases are present in static HTML; "interactivity" (dot moving, highlighting) never hides content behind tabs or steppers.
- **Do not imply** a rigid, identical progression for every participant, or any eligibility rule or guaranteed employment.
- Phase text from the architecture (Protected Gym: libraries, museums, cultural institutions, community organisations; Pre-corporate: tasks linked to SME workflows, mentors prepare the transition; Work-based learning in SMEs: tutors/buddies and educational mentors, progress documented). Cards without source text stay hidden (typed gaps), never `[…]`.

### 6.5 Results & Tools
Heading "Tools for people, companies and inclusive VET systems"; intro says research and pilot experience will become practical tools and that the page progressively becomes the public repository. **Nine resources** (architecture names): Territorial and Labour Market Intelligence · Corporate Inclusion Readiness Index · ESCO-mapped vocational profiles · Three-phase vocational continuum · Corporate and educational mentoring framework · Technical Passport and micro-credentials · Corporate Inclusion Starter Toolkit · Ready for Inclusion framework and label · European White Paper (+ the unconfirmed Protocol, §2.3 #8).

```yaml
# content/data/resources.yaml
- slug: corporate-inclusion-readiness-index
  icon: company
  status: planned            # planned | in-progress | published
  featured: false
  audience: [companies, vet-providers]
  publishedAt: null          # ISO date; required when published
  language: [en]
  file: null                 # path under public/downloads or URL; required when published
  fileType: null             # e.g. PDF
  fileSizeBytes: null
  related: []                # news slugs
  needsClientApproval: false
  i18n: { en: { title, summary, body }, it: { … } }
```
UI labels: `planned` → "Coming soon", `in-progress` → "In progress", `published` → "Available" (text + icon, never colour alone). Icon hints: Territorial → `data-impact`; Readiness Index → `company`; vocational profiles → `skills`; continuum → `pathway`; mentoring → `reciprocity`; Technical Passport & micro-credentials → `technical-passport`; Toolkit → `toolkit`; Ready for Inclusion framework → `ready-for-inclusion`; White Paper → `white-paper`.
**Never fabricate downloads or dead buttons.** The "Download resources" CTA is active only for published resources with a real file (accessible PDF with document metadata; provide an HTML summary beside the PDF). Detail pages per §2.3 #11.

### 6.6 Ready for Inclusion
Heading **"Companies can learn inclusion too"**: SMEs need not become disability experts; they need practical guidance, support, and the chance to learn from experience and peers. Hero with `ReadyLabel`. **For companies** (five items: understand readiness; guidance for inclusive work-based learning/internships; prepare tutors/buddies/staff; learn from tested pilot experiences; join a European community of SMEs). **The Ready for Inclusion Ambassador Network** (`id="ambassador-network"`): peer exchange, visible good practice, tested experience; targets (up to 20 companies per partner country; ≥ 400 SMEs) labelled as **project aims**. ◇ network directory and ◇ label kit (hidden until data/approval). CTA **"I am a company — I want to know more"** → `/contact?type=company` (pre-selects the audience). No fabricated application portal.

### 6.7 Partners
Heading **"A European partnership connecting research, inclusion and companies"** + intro. Six partner cards with the **exact names and source descriptions** (Bene Futuro srl — Italy [project coordinator]; University "G. d'Annunzio" of Chieti–Pescara — Italy; DESINCOOP — Portugal; Qualificalia Analytics — Spain; ISON Psychometrica — Greece; Confartigianato Imprese Chieti — Italy). Country as text (no flags). Logos and external links only when supplied and verified (`rel="noopener noreferrer"`, clearly labelled). **Associated partners** section with the neutral architecture copy; list names only when `partners.yaml` contains `type: associated` entries.

### 6.8 News & Stories
Heading **"Stories from the INCLUDE journey"**. Categories: Project news · From the territories · Voices from companies · Pilot stories · Events · Tools & resources · Policy & advocacy — as **static category pages** (no indexable filter-parameter variants; canonicalise any query-string filtering). Article template: `NewsArticle` JSON-LD, date, author/source if provided, updated date, related resources/posts, social metadata. Intentional empty state; **no fictional news**. RSS only when ≥ 1 post.

```ts
// news frontmatter (Zod)
{ title, slug, date, updated?, locale, category, excerpt, cover?: { src, alt },
  country?, author?, status: 'draft'|'published', humanReviewed?: boolean,
  consentVerified?: boolean   // REQUIRED true for "pilot-stories" or any post featuring participants
}
```
**Ethical storytelling guard (build fails otherwise):** participant stories need documented informed consent and image rights, and must foreground agency, competences, learning and participation. Publish an **ethical-storytelling callout** on the News page. No sensitive personal data without a valid lawful basis.

### 6.9 Contact
Heading **"Want to know more? Get in touch"**; intro addressing companies, VET organisations, researchers, policymakers and community actors. CTAs "Contact the INCLUDE team" / "Subscribe to the newsletter".
- **Contact form:** name, email, organisation (optional), country (optional), **"I am…"** select (Company/SME · VET organisation · Researcher · Policymaker · Community/disability organisation · Other), message, and a **required, un-ticked privacy-notice acknowledgement** (not a marketing consent). Optional audience → recipient routing via `CONTACT_ROUTING` (JSON map), falling back to `CONTACT_TO_EMAIL`; recipients are never hard-coded or assumed.
- Visible note: **"Please do not include health or disability information about yourself or others."**
- **Newsletter:** a **separate**, optional, un-ticked consent with purpose/frequency info; double opt-in; never bundled with the contact request.
- Server-side validation, spam protection, rate limiting; accessible states (`aria-live`, inline errors, focus to first error, success state). No data stored beyond the mail provider.
- **Availability gate:** if the mail/newsletter provider isn't configured, hide or disable the form with a neutral message (no invented address) and document setup in `docs/owner-inputs.md`. Show an alternative contact route only if the owner supplies an official address.

### 6.10 Recommended additions (flag-gated; excluded from nav and sitemap and `noindex` until approved)
- **Glossary** (Cooperation Partnership, ESCO, micro-credential, Technical Passport, Protected Gym, Pre-corporate, Open market, Corporate Inclusion Readiness Index, Ready for Inclusion) — derived only from source definitions.
- **Easy-read summary page** for the primary beneficiaries (Phase 2 if content isn't available).

### 6.11 Footer (site-wide)
Logo (negative) · all 8 menu items in architecture order · legal links (Privacy, Cookies, Accessibility, Legal notice) · **"Cookie settings"** button · co-brand row (INCLUDE | EU emblem + Erasmus+ | partners) · project-facts table · verbatim EU disclaimer · social links only when official URLs exist.

| Field | Value |
|---|---|
| Project | INCLUDE – From protected paths to real jobs |
| Programme | Erasmus+ – Cooperation Partnerships in Vocational Education and Training (KA220-VET) |
| Project number | 2026-1-IT01-KA220-VET-000465826 |
| Duration | 24 months |
| Project period | 1 October 2026 – 30 September 2028 |
| Coordinator | Bene Futuro srl |

Never invent the address, phone, coordinator email or social handles. Custom branded **404** and error pages are required, with helpful links.

---

## 7. Content model, i18n and editorial governance

- All copy lives in `/content` and `/messages` (structural labels in `messages`), **never hard-coded in components**.
- Typed Zod schemas (`lib/content/schemas.ts`) for: site config and navigation; static pages and sections; partners (name, country, description per locale, approved logo, verified URL, `type: full|associated`); news; resources; FAQ; glossary. `pnpm check:content` runs in CI.
- **Common metadata:** `status: 'draft' | 'published'`; `needsClientApproval?: boolean`; `humanReviewed?: boolean` (**required `true` for any non-source locale to be published**); `updated?: ISODate`.
- Drafts and unpublished content never appear in navigation, sitemap, JSON-LD, RSS, `llms.txt` or any public API; they render in dev/preview with a visible banner.
- **Italian:** use the mockup copy verbatim for Home and The Pathway (`humanReviewed` once the owner confirms); translate the rest from the architecture as `draft`, `humanReviewed: false`. EN is the source for everything else. A locale ships only when complete and reviewed (§2.3 #2).
- `check:i18n` fails on missing/unused keys or mismatched ICU placeholders between locales. `check:placeholders` fails the production build on `[…]` placeholders, `lorem`, `TODO`, fake counters, or empty `alt` on informative images.
- Language switcher (only when > 1 locale published): keeps the current page via localised pathnames, correct `lang`/`hreflang`, accessible name; never mix languages within a page's metadata. Dates/numbers via `Intl`. pt/es/el stubs must not break the build.
- Editorial checks documented in `docs/content-and-assets.md`: participant consent, image rights, factual accuracy, partner approval, EU funding visibility; how to add a news post, resource, partner, translation.

---

## 8. Motion and interaction

Restraint is the standard: **one orchestrated signature moment plus feedback to user actions.** No fade-and-slide on every section, no hover-lift on every card, no staggered card reveals by default.

| Moment | Spec |
|---|---|
| **Signature: the person-dot** | On hero load the rust dot travels once PROTECTED → PRE-CORPORATE → OPEN MARKET along the dotted connectors (~1.8 s, ease-in-out) and rests. On hover/focus of a phase (and on the Pathway page when a phase enters the viewport) it moves to that phase. **No infinite loops.** Static final state under reduced motion. |
| Hero entrance | One staggered reveal H1 → lead → CTAs (≈ 40–60 ms stagger, 400–500 ms, ease-out, ≤ 16 px). Elsewhere, no entrance animation unless it explains something. |
| `SuperE` | Very slow parallax (≤ 24 px) via CSS scroll-driven animation where supported; static otherwise. |
| Feedback | Buttons/links 150–200 ms colour/transform; card icon dot nudges ~2 px on hover/focus; accordion height transition; mobile nav slide 250 ms; form submit states; header hairline after 8 px scroll. |
| Counters | Count-up (~1.2 s) **only** for verified real figures. |
| Page transitions | None, or a ≤ 150 ms View Transitions fade where supported. |

Rules: animate only `transform`/`opacity`; zero layout shift; content visible with **JS disabled** and in SSR HTML (hidden-initial states only inside `@media (scripting: enabled)` or after hydration); honour `prefers-reduced-motion` (remove movement, keep ≤ 100 ms opacity); auto-playing motion > 5 s must be pausable (WCAG 2.2.2); load motion lazily (`LazyMotion`) and keep client islands small.

---

## 9. SEO and AIO / AEO / GEO / LLMO

Goal: rank in classic search **and** be cited accurately by AI answer engines. No keyword stuffing, hidden text, AI filler or "AI bait"; **never promise rankings or AI citations.**

### 9.1 Technical SEO
- Render primary content in server-rendered HTML. `buildMetadata()` via the Metadata API: unique `<title>` (`Page · INCLUDE – From protected paths to real jobs`, ≤ 60 chars) and description (140–160 chars) per page and locale; self-referencing **canonical** from a single production origin (`NEXT_PUBLIC_SITE_URL`; **no staging URLs in canonicals**); `alternates.languages` incl. `x-default` (published locales only); Open Graph/Twitter metadata.
- `sitemap.ts` with per-locale alternates and **real `lastModified`** (content `updated`, not build time); `robots.ts`; non-production emits `noindex` (header + robots) via `SITE_ENV`. Exclude private, duplicate, preview, draft and filter-variant URLs.
- Clean lowercase hyphenated localised URLs; no trailing slash; 301s for changed slugs; `www`↔apex redirect; valid status codes; no broken internal links; no duplicate metadata or H1s; no thin indexable pages.
- Semantic landmarks, strict heading order, descriptive link text, internal links connecting project context, phases, resources, partners and news; `next/image` with explicit `sizes`, AVIF/WebP, descriptive filenames and `alt`.
- Dynamic **OG images** (`next/og`, 1200×630, Manrope, tokens from `config/brand.ts`): default, story/quote, data, event templates. Use the extracted "e" mark/logo only if available (§2.4); otherwise text-only on brand colours, no imitation.
- `manifest.ts`, favicon set from the "e" mark (24/48 px + SVG), Apple touch icon. Verification meta tags via env (`GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`); post-launch Search Console/Bing submission documented in `docs/launch-checklist.md`.

### 9.2 Structured data (JSON-LD, server-rendered, validated)
Only when it accurately mirrors visible, verified content. `<JsonLd />` escapes `<`. Use `NEXT_PUBLIC_SITE_URL` for every `@id`/URL — never hard-code a domain.
- **Sitewide:** `Organization` (project/coordinator; real `logo`; `sameAs` only verified URLs; `funder`/funding referencing the Erasmus+ programme; `member` partners), `WebSite` (with `inLanguage`).
- **Pages:** `WebPage`/`AboutPage`/`ContactPage`, `BreadcrumbList`. **News:** `NewsArticle`/`Article`. **Resources:** `CreativeWork`/`DigitalDocument` (only for real published items). **Events:** `Event` only for real events. **FAQ:** `FAQPage` only for a genuine, visible Q&A sourced from approved copy (no expected rich result).
- `Project`/`ResearchProject` may be added as a *supplementary* entity only if it validates and matches visible content.
- **Do not use:** `GovernmentService`, `Grant`, `EducationalOccupationalProgram`, ratings/reviews, `JobPosting`, invented addresses/phones/founding dates/awards. Validate with `schema-dts` types + `check:schema`.

### 9.3 AIO / AEO / GEO / LLMO content patterns
- **Answer-first:** each key page opens with a 40–60-word direct answer (`AnswerBlock`) to its core question ("What is INCLUDE?", "How does the pathway work?", "What is Ready for Inclusion?"), then detail. Question-led H2/H3 where natural; short, self-contained, quotable paragraphs.
- **`KeyFacts` `<dl>`** (programme, duration, dates, countries, partners, project number, targets) on Home/Project/Partners — extractable from plain HTML without JS. Use phrasing like "INCLUDE is a 24-month Erasmus+ KA220-VET Cooperation Partnership…" in lead paragraphs.
- Distinguish **project facts, planned work, interim activity, published results**; label targets as targets. Attribute any research finding/quote to a real source.
- **Entity consistency:** fixed canonical names (*INCLUDE – From protected paths to real jobs*, *Ready for Inclusion*, *Technical Passport*, *Corporate Inclusion Readiness Index*); define project terms (Protected Gym, pre-corporate preparation, work-based learning, micro-credentials, ESCO) once and link first mentions. Show "Last updated" on pages and posts; include project number and EU funding in visible context.
- **`/llms.txt`** and **`/llms-full.txt`**: generated at build from published `/content` (concise map per locale; clean Markdown of core pages). **Never include invented contacts.** Optional `.md` alternates of key pages. Log in `docs/decisions.md` that crawler support is not guaranteed and that it doesn't replace sitemap, robots or accessible HTML.
- **Crawler policy** in `robots.ts`, driven by `config/site.ts`: allow search/answer crawlers (Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot, …); training-crawler stance (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot, …) is **one boolean** `allowAiTraining` (default `true` for a publicly funded dissemination project; owner confirms). Verify current user-agent tokens in each vendor's docs.
- All content is static server-rendered HTML — nothing reachable only via client JS, hidden tabs without links, or infinite scroll.

### 9.4 FAQ and glossary
Optional, **never a launch blocker.** Write answers only from approved source facts (What is INCLUDE? Who funds it? Who are the partners? Who is it for? What is the Technical Passport? What is Ready for Inclusion? How can my company take part?). Unknown answers are omitted and logged as content gaps in `docs/decisions.md`. FAQs may appear on The Project, The Pathway or Ready for Inclusion.

---

## 10. Accessibility and inclusive UX

Baseline **WCAG 2.2 AA**; accessibility is a core project value, not a final polish pass. Document any known gaps.
- Semantic HTML first; skip link; logical focus order; no keyboard traps; **visible focus ring** (≥ 3:1, ≥ 2 px, offset); Radix-managed focus in dialogs; `aria-current` in nav; correct `lang` per page (and on inline foreign terms); one `<h1>`.
- Target size ≥ 24×24 px (aim 44 px on touch); no drag-only interactions; no time limits.
- Contrast per §5.1; colour never the only carrier of meaning (status chips have text + icon).
- Forms: programmatic labels, helper text, error identification and suggestions, `autocomplete`, no placeholder-as-label; announce status/dynamic changes (`aria-live`).
- Plain language, short sentences, consistent terminology, predictable structure, low clutter; expand acronyms on first use (ESCO, VET, SME); avoid idioms and stereotype/inspiration framing.
- 200% text resize and reflow at 320 CSS px; works under forced-colors/high contrast; no horizontal overflow.
- Decorative graphics `aria-hidden` with empty alt; informative images real alt; captions/transcripts for any published audio/video.
- Provide an **Accessibility statement** (conformance status, known limitations, feedback route, date; model on the EU template).
- Verify: axe on every route and locale (**zero serious/critical**), plus manual keyboard and screen-reader spot checks (`docs/launch-checklist.md`).

---

## 11. Privacy, cookies and legal (GDPR / ePrivacy)

> This is **engineering implementation and draft templates, not legal advice.** The data controller and qualified counsel/DPO must approve final legal text, lawful bases, retention, processors and transfer mechanisms before launch. Never invent registration numbers, VAT IDs, addresses or contact details.

### 11.1 Principles
Privacy by design and default; data minimisation; **no non-essential storage of any kind (cookies, localStorage, sessionStorage, IndexedDB) and no non-essential scripts before valid consent**; EU hosting by default; **no third-party requests on page load** (self-hosted fonts; no embedded maps/social widgets/remote scripts); processors with DPAs; **no collection of health/disability data** through any form. Don't assume Google Analytics/Tag Manager is lawful because it's common.

### 11.2 Consent management (`features/consent`)
- Categories: **Strictly necessary** (always on; documented; e.g. the consent record itself) · **Statistics** (only for non-cookieless providers) · **Embedded media** (e.g. YouTube).
- If only strictly necessary storage exists (cookieless analytics or none, no embeds): **no banner**, but still ship the preferences panel and the footer **"Cookie settings"** control; the banner appears automatically when a non-essential category is enabled in config.
- First-layer banner: **Accept all**, **Reject non-essential** and **Customize** with equal prominence and effort; granular toggles, **nothing pre-ticked**, no cookie wall or dark patterns; link to the Cookie Policy; **closing with "X" = continue without accepting** (Italian Garante guidance); scrolling/continued browsing is **not** consent; withdrawable any time; store a minimal first-party record (categories, timestamp, policy version); **re-prompt on policy change and after ≤ 6 months**.
- **Gated loader:** third-party scripts/embeds load only after the matching category is granted; YouTube via `youtube-nocookie.com` behind a click-to-load facade with explanatory text.
- GA4 (only if owner approves): **Consent Mode v2**, all storage denied by default, gtag loaded only after "Statistics" consent, IP anonymisation, transfer implications documented. Analytics events are aggregate only (e.g. resource download, contact submit) and **never** include form contents.
- Accessible (Radix Dialog), localised, focus trapped/restored, no layout shift. Auto-generate the **cookie inventory** (name, purpose, category, duration, provider) from config into the Cookie Policy.

### 11.3 Forms and personal data
Collect only what's necessary; state recipient, purpose, retention, rights route and privacy-notice link at the point of collection. Contact request ≠ marketing: separate acknowledgement vs optional newsletter consent (§6.9). Contact: transient processing, delivered to a project mailbox, **no database storage**. Newsletter: **double opt-in**, one-click unsubscribe, consent timestamp kept by the provider. Use a processor only after a DPA and transfer review; credentials server-side only. Document retention/deletion and a data-subject-request process. Server logs: no IPs retained beyond host necessity; never log form bodies.

### 11.4 Legal pages and launch gate
Pages: **Privacy Policy** (controller — *assumed Bene Futuro srl as coordinator; confirm*; DPO if any; purposes + legal bases; recipients/processors; transfers + safeguards; retention; rights incl. access, rectification, erasure, restriction, portability, objection, withdrawal; right to complain to a supervisory authority — the Italian *Garante* and the user's own; no automated decision-making), **Cookie Policy** (categories, inventory, how to change choices), **Accessibility statement**, **Legal notice / site credits** (project identity, coordinator, funding statement, content reuse licence only once decided, EU disclaimer).
- Draft templates live in `docs/legal/` and `content/legal/` with `status: draft` and a visible `LEGAL-REVIEW-REQUIRED` marker; drafts show a "Draft — not legally approved" banner in dev/preview. **A placeholder legal page must never be presented as compliant or final.**
- `pnpm check:launch` (run in the release workflow, **not** in ordinary CI) fails if any legal page is still `draft`, required owner inputs in `docs/owner-inputs.md` are missing, or fake data remains.
- Also deliver `docs/legal/ropa-template.md` (records of processing), `dpa-checklist.md`, `cookie-inventory.md`.

---

## 12. Security

Align with **OWASP ASVS** for a public informational site.
- **Headers** (`next.config.ts` `headers()` or proxy): `Strict-Transport-Security` (preload-ready), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (deny camera, microphone, geolocation, …), `Cross-Origin-Opener-Policy: same-origin`, frame protection (`frame-ancestors 'none'`, `X-Frame-Options: DENY`), **Content-Security-Policy**.
- **CSP strategy:** start in `Report-Only`, then enforce. Nonce-based CSP forces dynamic rendering in Next.js; because the site is static, evaluate hash/SRI-based options first and fall back to the narrowest feasible policy (`default-src 'self'`; explicit `img-src`, `font-src 'self'`, `connect-src 'self'` plus consent-gated hosts). Record the trade-off in an ADR; don't make content pages dynamic just for nonces without an ADR.
- **Forms:** server-side Zod validation (never trust the client); origin/CSRF check; honeypot + minimum-fill-time; ALTCHA; **rate limiting** per IP and per email (behind an interface; in-memory/Redis; no US SaaS by default); strict length limits; header-injection-safe email composition; HTML-escaped templates; generic errors (no enumeration). No arbitrary file uploads (if ever added: MIME/size limits, malware scanning, isolated storage).
- **Class-of-bug checks:** XSS, CSRF, SSRF, open redirects, injection, path traversal, mass assignment. Avoid rendering untrusted HTML/MDX (MDX is repo-controlled, trusted authors only); sanitise any remote data and externally supplied SVG; external links `rel="noopener noreferrer"`.
- **Secrets:** environment only; `src/env.ts` validates at startup and splits server/client; nothing sensitive in `NEXT_PUBLIC_*`; `.env.example` has names and descriptions only; gitleaks in CI and pre-commit; least-privilege credentials; rotation/revocation documented. Secure cookie flags (`Secure`, `HttpOnly`, `SameSite`) wherever cookies exist; never keep secrets in localStorage.
- **Supply chain:** lockfile committed; `pnpm audit` in CI; Renovate/Dependabot with grouped updates; CodeQL; minimal dependencies; pin GitHub Actions by SHA.
- **Operational:** `/.well-known/security.txt` (contact, expiry, policy — contact supplied by owner), `/api/health` (no internals), custom error pages that leak nothing, structured logs **without PII or message bodies**, optional error reporting with privacy-aware scrubbing.
- **Docker:** multi-stage, minimal runtime, non-root, read-only filesystem where possible, healthcheck, no dev dependencies.

---

## 13. Integrations (Google and others) — opt-in only

**Default: none of the Google integrations is built or enabled.** The sources require none. Do not add Google Maps, Analytics, Tag Manager, YouTube embeds, Calendar/Sheets APIs or Google sign-in without an actual requirement and **owner approval**. **reCAPTCHA is prohibited.** Search Console verification via a meta tag/DNS is allowed (no code dependency).

If the owner approves an integration, **first** document: exact service, data flow, scopes, controller/processor roles, retention, consent/legal requirements. Then implement behind an interface in `lib/integrations/*` with a mock adapter for tests; server-side only; env-flag-driven; documented quotas, timeouts, retries with exponential backoff, graceful degradation, and GDPR implications. Never scrape Google services or bypass API terms.

| Integration | Purpose | Rules |
|---|---|---|
| **Google Calendar API** (read-only, public calendar) | Events list, `Event` JSON-LD, `.ics` | API key restricted by API (Calendar only) and IP/referrer; ISR `revalidate` ≈ 3600; fallback to last good snapshot; Zod-validate; key never in client |
| **Google Sheets API** (read-only) | Optional "sheet-as-CMS" for **non-personal** data only (resource statuses, verified KPI counters) | Service account with read-only, single-sheet access; JSON key as secret (base64 env), never committed; Zod-validate; ISR + fallback to `content/data`; **never store personal data** |
| **YouTube** | Project video embeds | Consent-gated facade, `youtube-nocookie.com` |
| **GA4** | Analytics | Off by default; Consent Mode v2; post-consent only |
| **User-authorised Google data (OAuth)** | Only if a real need arises | OAuth 2.0 least-privilege scopes, validate state/nonce and redirect URIs, refresh tokens server-side only |
| **Brevo / SMTP** | Contact mail + newsletter | Abstracted adapters; EU endpoints; secrets via env; DPA noted in `docs/legal/` |

---

## 14. Performance budgets

- Core Web Vitals targets (75th percentile, mobile and desktop): **LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1** — targets, not guarantees; don't sacrifice accessibility or content quality for scores.
- Lighthouse (mobile, CI) on Home, The Project, The Pathway, Results & Tools, a News article, Contact: **Performance ≥ 90, Accessibility 100, Best Practices ≥ 95, SEO 100**. Zero hydration errors or console errors.
- First-load JS for Home **≤ 150 KB gzip** (aim 100–120). No client component without a reason; split motion/consent/form code per route; avoid large UI libraries and duplicate dependencies.
- LCP element is text or one optimised SVG; fonts `display: swap` with `next/font` metric-adjusted fallbacks; minimal weights and subsets per locale. Images: `next/image`, explicit dimensions/aspect ratios, lazy below the fold, **never lazy-load the LCP image**, `priority` only for it. Icons as inline SVG; optimise SVGs.
- Caching: immutable for hashed assets; sensible `s-maxage` + `stale-while-revalidate` for ISR/public content.
- Add a bundle-analyzer script and a CI size check.

---

## 15. Testing, CI/CD and DevOps

**Scripts:** `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:e2e`, `check:content`, `check:i18n`, `check:placeholders`, `check:schema`, `check:launch`, `analyze`, `lighthouse`, `gen:llms`.

**Tests**
- *Unit/component (Vitest):* content schemas, `buildMetadata`, JSON-LD builders, sitemap/robots/llms generators, contrast-pair test, `brand.ts` ↔ `tokens.css` parity, consent logic, form schemas and server actions (mock adapters), localised pathnames.
- *Integration:* content loading with draft/published/locale gating; resource status rules; feature-flag visibility.
- *E2E (Playwright; EN + IT where published; desktop + mobile):* all eight routes and navigation (desktop and mobile menu, skip link, Escape/focus return); language switch keeps the page; contact + newsletter flows (mock provider) incl. validation, spam controls, success/error; resources and news empty/published states; consent (reject loads nothing, accept loads gated scripts, withdrawal works, settings persist and reopen); 404/error pages; redirects; `noindex` on preview; **no third-party requests before consent** (assert in the network log).
- *A11y:* axe on every route/locale; keyboard-only smoke test; reduced-motion run.
- *SEO checks:* one h1, title/description length, canonical, hreflang reciprocity, valid JSON-LD matching visible content, sitemap URLs return 200, no accidental `noindex` on public pages, no broken internal links, no missing informative alt.

**CI (GitHub Actions)** on PR: frozen-lockfile install → typecheck → lint → unit/integration → `check:content|i18n|placeholders|schema` → build → e2e + axe → Lighthouse CI → size check → `pnpm audit` → CodeQL → gitleaks. Preview deployments are `noindex`, password-protected where possible, and send **no production analytics or emails**. On `main`: build and publish the Docker image / deploy. Release workflow runs `check:launch`.

**Environments:** development, preview/staging, production (`SITE_ENV`) with distinct secrets. `.env.example` lists at least: `SITE_ENV`, `NEXT_PUBLIC_SITE_URL`, `CONTACT_TO_EMAIL`, `CONTACT_ROUTING`, `MAIL_PROVIDER`, `BREVO_API_KEY`, `BREVO_LIST_ID`, `SMTP_URL`, `NEWSLETTER_PROVIDER`, `ALTCHA_HMAC_KEY`, `ANALYTICS_PROVIDER`, `PLAUSIBLE_DOMAIN`, `GA_MEASUREMENT_ID`, `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION` (+ Google API variables only if §13 is approved).

**Runbook content** (`docs/deployment-runbook.md`): environment setup, deployment, DNS/TLS/HSTS, redirects, compression/caching, monitoring/uptime, error reporting, rollback, content publishing, incident response, backup/restore (if a DB/CMS is introduced).

---

## 16. Delivery plan (phases with gates)

**Phase 0 — Discovery (no feature code).** Load skills; inspect repo; read and rasterise PDFs; attempt asset extraction (§2.4); create `docs/decisions.md` with §2.3 plus new findings; write a short design plan (tokens, type, layout concept) and **review it against the brand so the brand — not a generic template — drives it**; produce a content inventory (exists vs missing per page/locale) and `docs/owner-inputs.md`.
*Gate:* decisions, content inventory and owner-inputs committed.

**Phase 1 — Foundations.** Scaffold Next.js + strict TS + Tailwind v4 + tooling; folder skeleton (§4); tokens (+ `brand.ts` parity test); `next/font`; next-intl with localised pathnames; env validation; security headers (report-only CSP); CI skeleton; Docker; stub `check:*` scripts; ADR 0001.
*Gate:* `build`, `lint`, `typecheck`, `test` green in CI; EN/IT empty pages route correctly.

**Phase 2 — Brand system and layout.** `Logo`, `LogoMark`, `SuperE`, `Icon` (24), `PhaseTrack`, `ReadyLabel`, UI primitives, `Header`/`MobileNav`/`Footer`/`Breadcrumbs`/`Prose`; private `/dev/design-system` route (non-production); contrast tests.
*Gate:* design-system page matches Brand PDFs side by side; a11y checks pass.

**Phase 3 — Pages and content.** All pages in §6 with real copy from `/content`; resources and News pipelines; contact + newsletter with mock adapters and availability gates; feature flags and conditional sections; EN complete; IT drafted per §7.
*Gate:* every route renders without placeholders; e2e green.

**Phase 4 — SEO / AIO.** `buildMetadata`, sitemap, robots, JSON-LD, OG images, RSS, `llms.txt`/`llms-full.txt`, `KeyFacts`, `AnswerBlock`, optional FAQ/glossary; SEO test suite.
*Gate:* schema validates; hreflang reciprocal; Lighthouse SEO 100.

**Phase 5 — Privacy, security, integrations.** Consent manager; legal drafts + `check:launch`; hardened forms; real adapters (Brevo/SMTP, ALTCHA) behind env; enforce CSP after a report-only soak; `security.txt`; ROPA/cookie inventory docs. Google adapters **only if approved** (§13).
*Gate:* consent tests pass; no third-party requests before consent.

**Phase 6 — Polish, QA, launch readiness.** Motion pass (§8); performance tuning to §14; full a11y audit; visual QA against mockups at 360/768/1024/1280/1536 px; cross-browser (evergreen last 2 versions; iOS Safari 16+); docs; `launch-checklist.md`; `completion-report.md`.
*Gate:* all budgets and §17 met.

At the end of **every phase** run the five-lens review (Architect: boundaries/rendering · Developer: types/tests · UX/UI: brand fidelity/motion restraint · SEO/AIO: metadata/answerability · Security/DevOps: headers/secrets/CI) and record findings in the PR description.

---

## 17. Definition of done

**Functional**
- [ ] All eight pages + legal pages + custom 404/error in EN (complete) and IT (implemented; published only when `humanReviewed`), content from `/content`, **zero visible placeholders**.
- [ ] Header, footer, skip link, mobile menu, internal links and CTAs work on desktop and mobile; news and resources have useful empty states and correct draft/published behaviour.
- [ ] Contact form has client + server validation, accessible errors, spam protection and real delivery — or is clearly disabled with owner-facing setup instructions; the newsletter is not shown as operational until provider and consent are configured.
- [ ] Cookie settings persist, can be reopened, and block non-essential tags until consent.

**Brand and UX**
- [ ] Palette, Manrope, logo rules, "e" supergraphic, icon set, Ready for Inclusion label and co-branding conform to §5; motion conforms to §8; no off-brand imagery.

**Accessibility**
- [ ] WCAG 2.2 AA; axe clean (no serious/critical); keyboard-only walkthrough passes with focus never obscured; reduced motion, 200% zoom and 320 px reflow verified; contrast tests green.

**SEO / discoverability**
- [ ] Unique title, description, canonical and social metadata per route; hreflang reciprocal; valid sitemap/robots (environment-aware); JSON-LD validates and matches visible content; generated `llms.txt`/`llms-full.txt`; answer-first content and key facts; no accidental `noindex`; no preview/staging indexing; no broken links or duplicate H1s.

**Privacy and security**
- [ ] No third-party traffic or non-essential storage before consent; legal drafts flagged and `check:launch` documented; ROPA/cookie inventory delivered; no sensitive-data collection.
- [ ] Security headers with enforced CSP; hardened forms; no secrets committed or in client bundles; audit/CodeQL/gitleaks green; error states leak nothing; `security.txt` present.

**Engineering and performance**
- [ ] TS strict passes; lint, tests and production build pass; budgets in §14 met; zero hydration/console errors.
- [ ] CI/CD green; Docker image runs as non-root; `/api/health` works; previews `noindex`.

**Documentation**
- [ ] README, CONTRIBUTING, ADRs, `architecture.md`, `decisions.md`, `content-and-assets.md`, `seo-and-discovery.md`, `privacy-and-security.md`, `deployment-runbook.md`, `launch-checklist.md`, `owner-inputs.md`, `completion-report.md` complete.

---

## 18. Deliverables and owner inputs

### 18.1 Deliverables
1. Fully implemented Next.js + TypeScript website.
2. Documented design system and component architecture.
3. Content/data structures for all pages, news and resources.
4. Consent manager and privacy-conscious form flows with clearly marked legal/provider configuration gates.
5. SEO metadata, sitemap, robots, structured data, social metadata, generated `llms.txt`.
6. Automated tests and CI-ready scripts; `Dockerfile`; `.env.example` with safe placeholders.
7. The documentation set in §4.
8. **A completion report** (`docs/completion-report.md`, summarised in your final message): completed features, lint/typecheck/test/build results, Lighthouse and accessibility findings, assumptions made, deferred work, and every owner dependency — including which skills could and could not be loaded and the Next.js/Vite boundary decision.

### 18.2 Owner inputs — maintain `docs/owner-inputs.md` as a visible checklist; log, don't block
1. Production **domain**/canonical URL; hosting preference (EU region), DNS access, monitoring and backup needs.
2. **Vector assets:** logo variants, "e" mark, 24 icons, Ready for Inclusion label, favicon, partner logos, **official Erasmus+/EU emblem files**; partner website URLs.
3. **Associated partners:** names, logos, descriptions (only if they should be published).
4. **Photography/video** with usage rights and releases; first stories and news with consent documentation.
5. **Official coordinator** postal address, email and other public contact details; contact-form recipient(s) and routing; email delivery provider; `security.txt` contact.
6. **Newsletter** platform, sender identity, frequency and consent wording; social channels.
7. **Legal:** data-controller identity (confirm Bene Futuro srl), DPO if any, privacy policy, cookie policy, retention schedule, processor list, legal approval; content licence for downloads.
8. **Analytics** decision (none / cookieless / GA4) and consent configuration.
9. **Language:** Italian copy approval; verified translations if PT/ES/EL are wanted; official EU disclaimer translations.
10. **Confirmations:** "European Protocol for Work Inclusion" as an output; `#F3F3F1` paper tone; desktop nav pill order (§2.3 #3); "Discover the INCLUDE network" destination; AI-training crawler stance; whether glossary/easy-read go live.
11. **Published deliverables** with publication dates, language versions and file metadata; optional public Google Calendar/Sheet only if those integrations are approved.

Until supplied, use explicit non-public configuration placeholders and publish no fake details.

---

**Final instruction.** Build a coherent, production-quality product — not disconnected page mock-ups. Prioritise fidelity to the approved INCLUDE copy and brand, inclusive UX, accessibility, privacy, technical SEO and performance, while keeping the implementation simple enough for the consortium to maintain through the 24-month project. Explain architectural decisions (especially the Next.js/Vite boundary) and report every assumption and owner dependency transparently.
