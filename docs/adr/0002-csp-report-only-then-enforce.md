# ADR 0002 — CSP starts Report-Only; hash-based headers instead of nonces

- Status: accepted (enforcement pending soak period)
- Date: 2026-11-08

## Context

§12.1: nonce-based CSP forces fully dynamic rendering in Next.js; the INCLUDE
site is static by design (§11 static rendering). The spec directs us to
evaluate hash/SRI-based options first and record the trade-off.

## Decision

Ship a **`Content-Security-Policy-Report-Only`** header set in
`next.config.ts` (and mirrored in `vercel.json`):

```
default-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self';
style-src 'self' 'unsafe-inline'; script-src 'self'; base-uri 'self';
form-action 'self'; frame-ancestors 'none'; object-src 'none'
```

No third-party origins are present because the site loads zero third-party
requests (fonts self-hosted via `next/font`, ALTCHA widget self-hosted,
analytics default `none`).

## Trade-offs

- **`style-src 'unsafe-inline'`** is required by Tailwind's inlined critical
  CSS plus small inline `style` attributes on decorative brand components.
  Risk accepted because `script-src 'self'` (and no inline scripts) is the
  injection-critical directive.
- **No nonces** → pages stay static/cacheable at the CDN edge; we accept
  weaker per-response uniqueness in exchange for not making every content
  page dynamic.
- Consent-gated hosts (statistics/embedded media providers, only if the owner
  ever approves them) must be added to `connect-src`/`script-src` **edge
  case first**, with a new ADR, before the integrations ship.

## Enforcement

After a soak period with zero (or triaged) violation reports visible in the
project's error/log channel, flip the header from `Report-Only` to enforced
by removing the `-Report-Only` suffix and deleting this line's TODO in the
release checklist (`docs/launch-checklist.md`).
