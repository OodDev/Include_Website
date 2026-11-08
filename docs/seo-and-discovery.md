# seo-and-discovery.md

Search + AI discovery strategy for the INCLUDE website.

## Metadata system

`src/lib/seo/metadata.ts → buildMetadata({ locale, route, title, description })`:

- titles ≤ 60 chars (`"Title · INCLUDE"`), descriptions 140–160 chars
- canonical URLs derived from `NEXT_PUBLIC_SITE_URL` (the single production
  origin) — never from request headers
- hreflang alternates for `publishedLocales` only + `x-default`
- Open Graph + Twitter cards using `/og/<locale>/<route>` generated images
  (no fabricated logo — neutral typographic mark until brand assets arrive)
- `noindex` automatically outside production (`SITE_ENV !== "production"`),
  so previews, CI and drafts can never be indexed.

## Sitemap / robots / feeds

| File | Generator | Content |
| --- | --- | --- |
| `/sitemap.xml` | `src/app/sitemap.ts` | every route × locale (drafts excluded outside dev) |
| `/robots.txt` | `src/app/robots.ts` | allow all, sitemap link, disallow `/api/`, `/og/`, dev |
| `/feed.xml` | route handler | RSS of humanReviewed published posts |
| `/llms.txt`, `/llms-full.txt` | route handlers | machine-readable page index + approved leads (AIO) |
| `/.well-known/security.txt` | route handler | security contact |

## Structured data (§9)

`src/lib/seo/schemaorg.tsx` emits JSON-LD:

- `Organization` + `WebSite` (locale-aware `@id`s) on every page
- `WebPage` per route + `BreadcrumbList`
- `Article` for news posts, `FAQPage` where FAQ sections exist
- Types are restricted by `pnpm check:schema`; explicitly forbidden:
  GovernmentService, Grant, EducationalOccupationalProgram, ratings/reviews,
  JobPosting, invented addresses/phones/dates.

Details pages carry `KeyFacts` (visible short answer blocks) so answer engines
have a legitimate, human-visible extraction target — never hidden text.

## Localisation & §11 rule

Draft locales are served under English paths with translated UI chrome and
carry draft banners — they are noindex by site-env and draft status until a
locale is published (`publishedLocales`). Canonical URLs stay per-locale and
never duplicate across locales.

## Redirect policy

- No trailing slash; canonical slug form only (`results-and-tools`).
- Slug changes should be handled with a permanent redirect map — add entries
  in the proxy (`src/proxy.ts`) or hosting config at deploy time (§9.7).
- News category archives are noindex (thin, filtered views) — the sitemap
  lists only canonical post URLs.

## Launch-phase SEO checklist

1. Owner confirms production origin → set `NEXT_PUBLIC_SITE_URL`.
2. `pnpm gen:llms` against production (or leave dynamic routes enabled).
3. Verify with Search Console / Bing Webmaster (env vars
   `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION` are already wired).
4. Lighthouse + page-experience review on production (runbook §Monitoring).
5. Re-crawl of published legal pages after `check:launch` turns them live.
