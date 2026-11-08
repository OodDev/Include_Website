# ADR 0001 — Next.js owns the build; no Vite, no Storybook

- Status: accepted
- Date: 2026-11-08
- Deciders: INCLUDE website team (per INSTRUCTIONS.md §3 #1)

## Context

The stack decision table mandates: Next.js owns dev server, routing, rendering
and production build. Vite must not be used as bundler or dev server. Storybook
is explicitly excluded; a private `/dev/design-system` route is sufficient for
token/component documentation.

## Decision

- **Vitest** (Vite-powered, `vitest.config.ts` only) is used exclusively for
  unit/component tests (`tests/unit`, `tests/integration`). There is no
  `vite.config.ts`.
- **No Storybook.** Design tokens and brand components are documented on the
  private, noindex route `/{locale}/dev/design-system`, which is hidden in
  production builds (`SITE_ENV=production` → `notFound()`).
- E2E uses **Playwright**; the only shared tooling between test and site
  runtime is the React component tree itself, tested through it.

## Consequences

- One build pipeline (Turbopack/webpack via `next build`); no dual-config
  drift between a Vite layer and Next.
- Tests import site modules through the `@/` path alias; `tsx` scripts
  (`scripts/check-*.ts`) re-use the same content loaders so CI and runtime
  validate the exact same schemas.
- The design-system route must never link from public navigation. A CI check
  (`check:i18n`/review) would flag any such link; navigation is content-driven
  and does not reference `/dev/*`.
