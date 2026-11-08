# privacy-and-security.md

GDPR-by-design posture, data inventory and security operations for the
INCLUDE website.

## Privacy by design & default (§11)

- **Data minimisation.** The contact form collects: name, email, optional
  organisation/country, audience select, message, a *required* privacy
  acknowledgement (not a marketing consent), and an optional separate
  newsletter switch. No other person fields; no health/disability data
  through any form.
- **No non-essential storage before consent.** The site stores nothing
  non-essential on a visitor's device. The only persisted keys are the
  consent record (`include-consent`, localStorage) and the per-session
  `include-consent-dismissed` flag — both strictly necessary for the consent
  system itself (every EU framework's "strictly necessary" allowance).
- **No third-party requests on page load.** Fonts self-hosted via
  `next/font`; ALTCHA widget self-hosted under `public/vendor/altcha/`;
  analytics default `none`. External links carry
  `rel="noopener noreferrer"`.
- **No cookies** at all in v1 — no locale cookie (locale detection disabled),
  no analytics cookies.
- **No database.** Contact messages are transient: zlib validated, then
  delivered to the project mailbox. Server logs must never log form bodies.

## Contact vs newsletter (§6.9)

| Aspect | Contact request | Newsletter |
| --- | --- | --- |
| Consent basis | Step-legitimate interest (Art. 6(1)(b)/f) — acknowledge, not marketing | Separate optional consent, **double opt-in** |
| Recipients | Audience-routed via `CONTACT_ROUTING` env, else `CONTACT_TO_EMAIL` | Provider list (`BREVO_LIST_ID`) |
| Retention | In mailbox per project's editorial needs; deletion on request | Provider-stored until unsubscribe |
| Storage | None in the site | None in the site |

## Cookie/consent inventory (ROPA excerpt)

| Storage key | Type | Necessity | Lifetime | Purpose |
| --- | --- | --- | --- | --- |
| `include-consent` | localStorage | strictly necessary (consent record) | until withdrawn or 6 months expiry | categories + timestamp + policy version |
| `include-consent-dismissed` | sessionStorage | strictly necessary (banner state) | session | banner closed without decision |

Consent banner (§11.2): Accept all / Reject non-essential / Customize with
equal prominence; nothing pre-ticked; closing with X = continue *without*
consent; scrolling is never consent; withdrawal via footer "Cookie settings";
automatic re-prompt on policy change or after ≤ 6 months
(`CONSENT_POLICY_VERSION / max-age`). Statistics + embedded-media toggles are
prepared but inert until owner-approved services exist.

## Data-subject requests

Route requests to the controller identity listed in the privacy policy (to be
confirmed by the owner — see `docs/owner-inputs.md` #controller). Response
process: verify identity → execute access/erasure/rectification within 30
days → document in the request log kept by the project mailbox owner.

## Security practices

- Secrets env-only (`src/env.ts` zod-validated, server/client split, nothing
  sensitive in `NEXT_PUBLIC_*`); `.env.example` documents names only;
  gitleaks in CI and pre-commit.
- Headers: CSP Report-Only (ADR 0002), X-Frame-Options DENY, nosniff,
  Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy,
  COOP. Enable Strict-Transport-Security at the edge (hosting/DNS phase).
- ALTCHA proof-of-work + HMAC-signed expiring salts; timing-safe comparison;
  rate limiting with per-IP windows.
- Security class-of-bug checks in review: XSS/CSRF/SSRF/open redirects,
  injection, path traversal, mass assignment. Remote HTML is not rendered;
  MDX is repo-controlled.
- `/api/health` for orchestrators; `/api/altcha` 503s safely unconfigured;
  error boundaries never leak stack traces to users.

## Incidents & operations

- Security contact: published in `/security.txt` (owner email required).
- On incident: rotate affected credentials (Brevo/SMTP, ALTCHA HMAC),
  revoke sessions, analyse logs, notify processor if applicable, and record
  in the incident log contemplated by the runbook (`deployment-runbook.md`).

## Google services & processor rules

Any processor (Brevo SMTP, newsletter provider, hosting) requires a DPA,
EU/EEA data location or documented transfer safeguards, and retention terms
before integration. Google APIs are **not** used; GA4 exists only behind
explicit owner approval + Consent Mode v2 + all-storage-denied defaults.
