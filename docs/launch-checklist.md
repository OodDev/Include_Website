# launch-checklist.md

Go-live gate for the INCLUDE website. Working state = ☐; ✅ = done with
evidence/owner sign-off. `pnpm check:launch` must pass before tagging a
release.

## Owner inputs (docs/owner-inputs.md)

- [ ] Identity of legal controller (assumed Bene Futuro srl — **confirm**)
- [ ] Contact mailbox addresses per audience (CONTACT_ROUTING map)
- [ ] Newsletter provider decision (or stay non-operational)
- [ ] Analytics decision: none / cookieless EU / GA4-consent (default none)
- [ ] Production origin (`NEXT_PUBLIC_SITE_URL`) + DNS control
- [ ] Approved consent/banner wording sign-off (legally reviewed)
- [ ] Associated partners: names/logos if they should be published

## Brand assets

- [ ] Official INCLUDE logo files replace the neutral TODO(brand-asset)
      placeholders (LogoMark, SuperE, favicon, OG image template)
- [ ] Real photography with consent/releases → replaces dev placeholder rules
      (currently hero/sections hide image slots in production by design)
- [ ] `ReadyLabel` official SVG (co-branding rules Brand 04)

## Content & legal

- [ ] All four legal pages published: appraise with counsel then set
      `status: published`, `humanReviewed: true` in `content/legal/<locale>/*.mdx`
      (EN required at launch; IT with the IT launch)
- [ ] Cookie policy matches the shipped consent implementation (§11.2)
- [ ] Accessibility statement contact route chosen (replaces TODO in MDX)
- [ ] At least one page per key route reaches QA review (no placeholder copy)
- [ ] Contact form tested end-to-end with real ALTCHA + real mailbox

## Technical

- [ ] `pnpm typecheck && pnpm lint && pnpm test` green
- [ ] `pnpm check:content / check:i18n / check:placeholders / check:schema` green
- [ ] `pnpm build` green; standalone boots with `cp -R public .next/standalone/`
- [ ] e2e suite passes (EN + IT where published; desktop + mobile)
- [ ] CSP Enforcement: triage Report-Only violations, then remove Report-Only
      (ADR 0002) — include consent-gated hosts only if integrations approved
- [ ] Production env var set; SITE_ENV=production (indexable pages)
- [ ] Docker or Vercel deployment live + `/api/health` monitored
- [ ] HSTS enabled at edge; www↔apex redirect verified
- [ ] `robots.txt` + `sitemap.xml` + `feed.xml` + `llms.txt` reachable and
      correct on production origin
- [ ] Search Console + Bing property verified
- [ ] Lighthouse ≥ 90 performance/a11y/best-practices/SEO on Home
- [ ] First-load JS Home ≤ 150 KB gzip verified on production build
- [ ] Cross-browser check: evergreen last 2 versions + iOS Safari 16+
- [ ] Visual QA at 360/768/1024/1280/1536 px against Brand PDFs
