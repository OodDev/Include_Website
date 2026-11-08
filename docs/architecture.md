# architecture.md

INCLUDE — Erasmus+ website. Technical architecture for the delivered Next.js
application.

## Stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js 16 (App Router) + React 19 | `output: "standalone"` |
| Language | TypeScript (strict, `exactOptionalPropertyTypes`) | `tsc --noEmit` in CI |
| Styling | Tailwind CSS v4 (CSS-first `@theme` tokens) | `src/styles/tokens.css` |
| i18n | next-intl, `localePrefix: "always"`, English route segments | 5 locales: en/it/pt/es/el |
| Content | MDX + YAML in `content/` (no CMS) | Zod-schematised frontmatter |
| Fonts | Manrope via `next/font/google` — self-hosted at build | no runtime Google requests |
| Tests | Vitest (unit/integration), Playwright (e2e) | see §Testing |
| Anti-spam | Self-hosted ALTCHA widget + custom HMAC server verification | `src/lib/security/altcha.ts` |
| Mail | adapter pattern: `mock` / `brevo` / `smtp`, behind env gates | `src/lib/mail/index.ts` |

Build/test tooling owned by Next (ADR 0001): no Vite bundler/dev server, no
Storybook (private `/dev/design-system` route instead).

## Repository layout

```
src/
├─ app/
│  ├─ [locale]/            all user-facing routes (en always; it/pt/es/el drafts)
│  │  ├─ page.tsx          home
│  │  ├─ the-project/ the-pathway/ ready-for-inclusion/ partners/
│  │  ├─ results-and-tools/ (+ [slug] detail, gated)
│  │  ├─ news/ (+ [slug], category/[category] → noindex)
│  │  ├─ contact/  glossary/  privacy-policy/ cookie-policy/
│  │  ├─ accessibility/ legal-notice/  error.tsx not-found.tsx
│  │  └─ dev/design-system/  (noindex, hidden when SITE_ENV=production)
│  ├─ api/{health,altcha,contact}/route.ts   machine endpoints
│  ├─ og/[[...path]]/route.tsx               OG image (ImageResponse)
│  ├─ feed.xml/route.ts  llms.txt/ llms-full.txt/ sitemap.ts robots.ts
│  ├─ manifest.tsx icon.svg not-found.tsx
│  └─ .well-known/security.txt/route.ts
├─ components/  brand/ layout/ sections/ seo/
├─ features/    consent/ contact/ newsletter/ legal/
├─ lib/         content/ contact/ i18n/ mail/ security/ seo/ utils/
├─ config/      brand.ts locales.ts navigation.ts site.ts
├─ env.ts, proxy.ts
content/
├─ pages/{en,it}/*.mdx      page copy (approved EN; IT drafts)
├─ legal/{en,it}/*.mdx      legal drafts (humanReviewed flags)
├─ news/{en,it}/            posts (ethical consent guard)
└─ data/{partners,resources,glossary}.yaml
messages/{en,it,pt,es,el}.json
```

## Rendering model

- Pages are **static**: `generateStaticParams` for locales, `setRequestLocale`
  per layout/route, locale content resolved at build time.
- **Draft locales**: it/pt/es/el pages are served through their English
  physical route segments with translated *messages* (nav, banner, UI strings)
  while page copy stays English or absent. A visible draft banner explains the
  unreviewed state; `lang` attribute matches the UI language. Localised
  pathnames (`/it/il-progetto`) switch on only when a locale is published
  (§2.3 #2).
- `src/proxy.ts` (Next 16 proxy = middleware) does locale negotiation and
  serves draft locales on English paths — bypassing next-intl's localised
  pathname rewrites, which would redirect-loop in standalone mode.
- Runtime-dependent routes: `/api/*`, OG image, feedback files (`sitemap` is
  prerendered; `og`, `feed`, `llms*` dynamic).

## Data flow

1. **Contact** — form (client validation) → Server Action `sendContactMessage`
   → `submitContact()` (zod → honeypot → ALTCHA proof-of-work → rate limit →
   mail adapter). No database; transient processing only.
2. **Newsletter** — availability-flagged card only; no capture in v1 until a
   provider is owner-approved (double opt-in required).
3. **Content** — loaders in `src/lib/content/*` read MDX/YAML, validate with
   Zod, and fail closed (invalid frontmatter never renders).

## Security posture

- `src/env.ts`: zod-validated env at startup; server/client split.
- Headers: see ADR 0002 (CSP Report-Only → enforce) + nosniff, Referrer-Policy,
  Permissions-Policy, COOP, X-Frame-Options DENY.
- ALTCHA HMAC-signed expiring challenges; HMAC key server-only.
- Rate limiting per IP (`src/lib/security/rateLimit.ts`).
- `security.txt`, health endpoint for orchestrators.

## Performance intent (§14)

- First-load JS budget for Home ≤ 150 KB gzip; motion libs split per route
  (`PhaseTrack` imports `motion` only where used).
- Images: no decorative photo content until real assets exist (§6.1 rule);
  OG images generated server-side as SVG-like responses.

## Dependency notes

`outputFileTracingIncludes` copies `content/**` into the standalone output so
loaders work in the Docker/standalone runtime.
