# INCLUDE — Erasmus+ Website

> **From protected paths to real jobs** — multilingual marketing website for the INCLUDE Erasmus+ Cooperation Partnership (KA220-VET), coordinated by Bene Futuro srl with 6 partners across 4 countries.

<div align="center">

[![CI](https://github.com/OodDev/Include_Website/actions/workflows/ci.yml/badge.svg)](https://github.com/OodDev/Include_Website/actions/workflows/ci.yml)

![Next.js 16](https://img.shields.io/badge/Next.js%2016-000000?style=flat&logo=nextdotjs&logoColor=white)
![React 19](https://img.shields.io/badge/React%2019-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript 5.9](https://img.shields.io/badge/TypeScript%205.9-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS%20v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3B82F6?style=flat&logo=zod&logoColor=white)
![Node.js 26](https://img.shields.io/badge/Node.js%2026-5FA04E?style=flat&logo=nodedotjs&logoColor=white)
![pnpm 12](https://img.shields.io/badge/pnpm%2012-F69220?style=flat&logo=pnpm&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat&logo=vitest&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white)

</div>

Static-first, GDPR-by-design Next.js site: no CMS, no database — all content lives as MDX/YAML in [`content/`](content/). Contact is handled by a Server Action with ALTCHA proof-of-work anti-spam; no analytics and no third-party requests before user consent.

## Features

- **Multilingual by architecture** — 5 locales (EN published; IT/PT/ES/EL draft) via `next-intl`, with a custom proxy serving draft locales on English path segments.
- **Static-first rendering** — `generateStaticParams` + `setRequestLocale` for full static output.
- **Fail-closed content** — every frontmatter file is validated with Zod; invalid content never renders.
- **GDPR-by-design** — consent manager, no cookies before consent, no third-party requests by default.
- **Accessible by default** — WCAG 2.2 AA as minimum bar, labelled controls, keyboard navigation, axe checks in E2E tests.
- **Quality gates in CI** — content, i18n, placeholder, JSON-LD schema, type, lint, unit/integration, E2E and secrets checks.

## Tech stack

| Layer           | Choice                                                           |
| --------------- | ---------------------------------------------------------------- |
| Framework       | [Next.js 16](https://nextjs.org) (App Router, standalone output) |
| Language        | TypeScript (strict, pinned 5.9.3)                                |
| Styling         | Tailwind CSS v4 (CSS-first `@theme` tokens)                      |
| Content         | MDX + YAML, validated with [Zod](https://zod.dev)                |
| i18n            | [next-intl](https://next-intl.dev)                               |
| Motion          | Motion (`motion/react`, respects `prefers-reduced-motion`)       |
| Tests           | Vitest (unit/integration) + Playwright (E2E, desktop + mobile)   |
| Package manager | pnpm 12 · Node 26                                                |

## Getting started

### Prerequisites

- Node.js ≥ 26 (see `.nvmrc`)
- [pnpm](https://pnpm.io) 12.18 (also pinned via `packageManager`)

### Install & run

```bash
pnpm install
cp .env.example .env.local   # names/descriptions only — fill in what you need
pnpm dev                     # http://localhost:3000
```

Without mail/ALTCHA/newsletter env vars the contact form renders its honest _notOperational_ notice instead of failing — the site is fully browsable with an empty `.env.local`.

### Environment variables

All variables are documented with names and descriptions in [`.env.example`](.env.example). Highlights:

| Variable                                        | Purpose                                                                               |
| ----------------------------------------------- | ------------------------------------------------------------------------------------- |
| `SITE_ENV`                                      | `development` \| `preview` \| `production` — drives noindex/robots/metadata behaviour |
| `NEXT_PUBLIC_SITE_URL`                          | Canonical origin; all canonical URLs, sitemap, hreflang and OG images derive from it  |
| `CONTACT_TO_EMAIL` / `CONTACT_ROUTING`          | Contact form recipients (availability gate)                                           |
| `MAIL_PROVIDER` + `SMTP_URL` or `BREVO_API_KEY` | Mail adapter                                                                          |
| `ALTCHA_HMAC_KEY`                               | Signs/verifies ALTCHA challenges (`openssl rand -hex 24`)                             |
| `PREVIEW_PASSWORD`                              | Password gate for client previews — **preview deployments only, never production**    |

Secrets live in env only (`src/env.ts` validates them with Zod). Never commit `.env.local`.

## Scripts

| Command                   | Description                                                              |
| ------------------------- | ------------------------------------------------------------------------ |
| `pnpm dev`                | Dev server on `:3000`                                                    |
| `pnpm build`              | Production build (standalone output)                                     |
| `pnpm typecheck`          | `tsc --noEmit`                                                           |
| `pnpm lint`               | ESLint                                                                   |
| `pnpm format`             | Prettier                                                                 |
| `pnpm test`               | Vitest unit + integration tests                                          |
| `pnpm test:e2e`           | Playwright E2E (needs `pnpm exec playwright install chromium`)           |
| `pnpm check:content`      | Validate `content/` MDX + YAML against Zod schemas                       |
| `pnpm check:i18n`         | Message key + `{token}` parity across all locales                        |
| `pnpm check:placeholders` | Fails on mockup stand-ins (`[Foto…]`, lorem, TODO) in renderable content |
| `pnpm check:schema`       | JSON-LD type allowlist check                                             |
| `pnpm check:launch`       | **Release gate** — fails while legal drafts are unapproved               |
| `pnpm analyze`            | Production build with bundle analysis                                    |

Run the full local verification before finishing a change:

```bash
pnpm typecheck && pnpm lint && pnpm test
```

## Content management

There is no CMS — editors work directly in the repository:

- `content/` — MDX pages and YAML data, schema-validated and fail-closed
- `messages/` — per-locale UI strings (`check:i18n` enforces parity)

Approved English architecture copy is verbatim; Italian drafts are marked `humanReviewed: false` and client-approval-flagged micro-copy carries `needsClientApproval: true`.

## Docker

A multi-stage, non-root production image is provided:

```bash
cp .env.example .env.local   # or provide real values
docker compose up --build    # http://localhost:3000
```

The image copies `content/` into the runtime (loaders read it at runtime), exposes `/api/health`, and runs as an unprivileged user with `no-new-privileges`.

## Deployment

- **Vercel** (preferred): preview deployments may set `PREVIEW_PASSWORD` to enable the preview gate; production never sets it.
- **Standalone Node**: after `pnpm build`, copy `public/` and `.next/static` into `.next/standalone/`, then `PORT=3000 node .next/standalone/server.js`. (Do not use `pnpm start` against a standalone build.)

## Project structure

```
src/
  app/[locale]/      # per-locale routes
  app/api/           # machine routes (contact, newsletter, health, OG, …)
  components/        # presentational components (incl. brand system)
  features/          # contact / newsletter / consent / legal (UI + action + schema)
  lib/               # pure logic, loaders, mail/security/seo adapters
  config/            # brand, locales, navigation, site config
  styles/            # Tailwind v4 @theme tokens
content/             # MDX pages + YAML data (source of truth for copy)
messages/            # per-locale UI strings
docs/                # decisions (D01–D20), owner inputs, runbooks, SEO, ROPA
```

Layer boundaries: `components` → `features` → `lib` → `config`; tests import through the `@/` alias.

## Documentation

- [`INSTRUCTIONS.md`](INSTRUCTIONS.md) — full project specification
- [`AGENTS.md`](AGENTS.md) — guidance for AI coding agents working on this repo
- [`docs/decisions.md`](docs/decisions.md) — recorded design/architecture decisions (D01–D20)
- [`docs/owner-inputs.md`](docs/owner-inputs.md) — checklist of gated owner-supplied data
- [`docs/`](docs/) — execution docs: architecture, SEO, privacy/ROPA, runbook, launch checklist

> **Note:** the owner-provided brand/architecture PDFs are held locally only and are deliberately never committed (`*.pdf` is gitignored and blocked in CI).

## Security & privacy

- No non-essential storage or third-party requests before consent; no analytics by default.
- All input validated with Zod; contact form has a honeypot and per-IP rate limiting; ALTCHA verification is timing-safe.
- Form bodies are never logged; recipients come from env, never hard-coded.
- CSP starts Report-Only (ADR 0002) — new external origins require an ADR first.
- Secret scanning via gitleaks in CI.

Report vulnerabilities responsibly — see [`/.well-known/security.txt`](src/app/.well-known/security.txt/route.ts).
