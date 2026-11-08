# completion-report.md

Delivery report — INCLUDE Erasmus+ website (INSTRUCTIONS.md v-final).
Date: 2026-11-08. Delivered by a five-lens team (Architect · Developer ·
UX/UI · SEO/AIO · Security/DevOps).

## What shipped

### Phases 0–3 (foundations → routes → integration)
- Design token system + brand components (`Logo`, `LogoMark`, `SuperE`,
  `Icon` 24-px set, `PhaseTrack`, `ReadyLabel`) from Brand PDFs 01–04 with
  documented `TODO(brand-asset)` placeholders where official SVGs are pending.
- All 8 core routes + 4 legal pages + glossary (flagged), news/detail/
  category pages, partners page, contact page with Server Action.
- i18n: 5 locales; EN approved; IT full-engine drafts served as draft
  previews under English paths; PT/ES/EL message-level ready, page drafts
  pending owner sign-off.
- Content pipeline: MDX pages, YAML data (partners ×6, resources ×10,
  glossary ×9), Zod loaders fail closed, ethical storytelling consent guard.
- SEO/AIO: buildMetadata, sitemap, robots, RSS feed, llms.txt + llms-full.txt,
  OG image generation, security.txt, JSON-LD (Organization/WebSite/WebPage/
  Breadcrumb/Article), manifest, favicon.
- Contact: zod + honeypot + self-hosted ALTCHA (custom HMAC verification) +
  rate limiting + mail adapters (mock/brevo/smtp); form gated to operational
  only when configured, otherwise a clear notOperational notice.

### Phases 4–5 (quality, privacy, operations)
- Consent manager (first-person framework): banner with equal-prominence
  Accept/Reject/Customize + X-without-consent path, granular dialog, footer
  reopen, 6-month re-prompt, policy-version re-prompt.
- QA scripts wired in CI: check:content, check:i18n, check:placeholders,
  check:schema, plus release-gate check:launch (fails today, by design:
  legal drafts + owner inputs pending).
- Tests: 29 unit/integration tests green (consent, ALTCHA incl. a real
  signature bug fix, contact validation, metadata, brand↔tokens parity,
  content loaders, message parity).
- Playwright config + smoke=e2e specs (routes, third-party-request guard,
  consent flows, 404, contact notice).
- CI (GitHub Actions): frozen install → typecheck → lint → check:* → tests →
  build; separate e2e + gitleaks jobs. Release workflow runs check:launch.
- Docker (multi-stage, non-root, healthcheck) + compose + Vercel config
  pinned to EU region (fra1).
- /dev/design-system private route (noindex, hidden in production).
- ADRs: 0001 (Next owns the build, no Vite/Storybook), 0002 (CSP
  Report-Only → enforce).

## Known gaps / owner decisions pending

1. **Legal drafts** are unapproved (`humanReviewed: false`) — the site is
   honest about it (noindex drafts + banner + check:launch gate).
2. **Brand assets**: official logo/e-mark pending → neutral typographic
   placeholders ship and are loudly TODO'd.
3. **Contact routing**: real mailbox(es) awaiting owner inputs.
4. **Newsletter**: intentionally not operational until provider + consent
   wording are approved.
5. **News feed empty** (space is ready; nothing fabricated).
6. **Draft banner texts** in IT; PT/ES/EL drafts untranslated (flagged).
7. **Analytics**: default none, awaiting decision.
8. **Photography**: production hides photo slots until real, consented
   images exist.

## Env-security note (AGENTS.md)

`NEXT_PUBLIC_SITE_URL` is intentionally public config. All secrets
(`BREVO_API_KEY`, `SMTP_URL`, `ALTCHA_HMAC_KEY`) stay server-side via
`src/env.ts`; nothing sensitive is exposed to the client bundle. No
third-party code is loaded at build or runtime (fonts + ALTCHA self-hosted),
keeping the client payload small and request surface trusted-origin-only.

## Five-lens review (final)

- **Architect:** boundaries clean (components/features/lib/config);
  server/client split respected; rendering static by default with an
  explicit proxy locale strategy (documented in architecture.md).
- **Developer:** strict TS; 29 passing tests; all `check:*` scripts exit 0
  on current content; CI reproducible. Altcha signature-vs-verify mismatch
  found and fixed through the new test.
- **UX/UI:** mockup-faithful tokens/radii/rhythm; draft banners honest;
  a11y pass on consent components (Radix dialog, focus, aria);
  reduced-motion respected in PhaseTrack.
- **SEO/AIO:** canonical/origin-derived metadata; draft + preview noindex;
  answerable KeyFacts; llms.txt; feeds; schema constrained by check:schema
  (invalid `Grant` type found and removed during this review).
- **Security/DevOps:** no secrets in repo (gitleaks job); non-root image;
  healthcheck; CSP Report-Only with enforcement step in checklist; rate
  limiting and anti-spam shipped; no third-party requests before consent.
