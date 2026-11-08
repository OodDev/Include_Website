# deployment-runbook.md

Operational runbook for deploying and running the INCLUDE website.

## Environment setup

1. Copy `.env.example` → `.env.local` (never commit it) and fill, owner-supplied:
   - `NEXT_PUBLIC_SITE_URL` — final production origin
   - `SITE_ENV=production`
   - `CONTACT_TO_EMAIL` and optional `CONTACT_ROUTING` (JSON map audience → mailbox)
   - `MAIL_PROVIDER=brevo` + `BREVO_API_KEY` (+ `BREVO_LIST_ID` for news), or
     `MAIL_PROVIDER=smtp` + `SMTP_URL` (EU provider)
   - `ALTCHA_HMAC_KEY` — generate: `openssl rand -hex 24`
   - Analytics: leave `ANALYTICS_PROVIDER` unset (owner decision pending.
     Any provider needs the full privacy review in privacy-and-security.md.)
   - Optional search-console meta: `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`
2. Contact form becomes operational only with ALTCHA key + mail config; keep
   both unset on preview environments so no mail is accidentally sent.

## Deployment — Docker (any host)

```bash
docker build --build-arg NEXT_PUBLIC_SITE_URL=https://<origin> -t include-web .
docker run -d --name include-web -p 3000:3000 \
  --env-file .env.local --restart unless-stopped include-web
```

- Multi-stage, non-root (`nextjs` user), `HEALTHCHECK` hits `/api/health`.
- Verify after boot: `curl -s https://<origin>/api/health` → `{"status":"ok"}`.

## Deployment — Vercel (EU region)

- `vercel.json` pins `regions: ["fra1"]` (Frankfurt). Import the repo,
  set the same env vars for Production, deploy.
- Preview deployments inherit `SITE_ENV=preview` → automatic noindex.

## DNS/TLS/redirects

- `www` ↔ apex redirect at DNS/host level; both names should not be separately
  ranked — pick one canonical eTLD consistent with `NEXT_PUBLIC_SITE_URL`.
- Enable HSTS at the edge (hosting config). Certificate auto-renewal
  (Let's Encrypt or managed) — confirm the monitoring alert covers expiry.
- No trailing slash canonical; slug changes require 301s (proxy or host map).

## Compression & caching

- Next standalone serves hashed static assets with immutable caching;
  ensure the edge enables gzip/brotli for HTML/JSON/MD (usually default).
- Dynamic routes (`/og`, `/llms*`, `/feed.xml`) set their own `Cache-Control`;
  do not override to `public, max-age` > 1 h without review.

## Monitoring & error reporting

- Uptime: probe `/api/health` (200 expected; 503 from ANY monitor means the
  container is sick) every 1–5 min from an EU monitor.
- Error reporting remains env-gated; if `NEXT_PUBLIC_*` error SDKs are ever
  added they must pass the consent review. Alternative: edge log drain.
- Watch build/deploy logs for the `[content]` validation warnings — invalid
  frontmatter is dropped silently by design (fail closed).

## Content publishing (site is live)

- Static pages/posts are baked at build time: after editing `content/**` run a
  redeploy (rebuild). No CMS writes at runtime.
- The contact delivery path works immediately after env; verify with a test
  message to the configured mailbox.

## Rollback

- Docker: `docker stop include-web && docker run` the previous image tag
  (keep last two builds).
- Vercel: instant rollback to a prior deployment from the dashboard.
- Content/MDX regressions: `git revert` the offending commit and rebuild.

## Backups

- Repo (git remote) is the source of truth for all content + code. Ensure
  the remote is mirrored regularly (no DB to back up; nothing else durable).

## Incident response

1. Diagnose via health endpoint + logs (never share secrets in logs).
2. If credentials suspected leaked: rotate BREVO/SMTP + ALTCHA keys.
3. Data incident: follow privacy-and-security.md §Incidents; log timeline.
4. Post-mortem within 5 working days; action items tracked in the repo.
