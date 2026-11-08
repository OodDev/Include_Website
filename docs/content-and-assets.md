# content-and-assets.md

Editorial operating manual for the INCLUDE website.

## Content model

| Asset | Location | Validated by |
| --- | --- | --- |
| Static page copy | `content/pages/{locale}/<slug>.mdx` | `pageDocSchema` |
| Legal drafts | `content/legal/{locale}/<slug>.mdx` | `pageDocSchema` + launch gate |
| News posts | `content/news/{locale}/<slug>.mdx` | `newsFrontmatterSchema` |
| Partners | `content/data/partners.yaml` | `partnerSchema` |
| Resources | `content/data/resources.yaml` | `resourceSchema` |
| Glossary | `content/data/glossary.yaml` | `glossarySchema` |
| UI strings | `messages/<locale>.json` | `check:i18n` |

`pnpm check:content` validates every entry in CI; invalid frontmatter never
renders (loaders fail closed).

## Adding a news post

1. Create `content/news/en/<slug>.mdx` (lowercase, hyphenated, stable).
2. Frontmatter (all required): `title`, `slug`, `locale: en`, `date`,
   `category` (project-news | from-the-territories | voices-from-companies |
   pilot-stories | events | tools-resources | policy-advocacy), `excerpt`
   (≥ 20 chars), `status: published`, plus optional `cover{src,alt}`, `country`,
   `author`, `humanReviewed`, `consentVerified`.
3. **Ethical storytelling guard:** any participant story (`pilot-stories` or
   any post featuring participants) **must** set `consentVerified: true`. The
   build fails otherwise. Foreground agency, competences, learning,
   participation — never pity framing; no sensitive personal data.
4. Real photography needs documented consent/releases; until real images exist
   the related sections stay hidden (tinted placeholders are preview-only).
5. Add the story date as a plain date `2026-06-15`; do not invent quantities,
   quotes or partner names.
6. Human review: set `humanReviewed: true` after the editor-in-chief signs off.

## Adding a resource

`content/data/resources.yaml`, status-aware: entries with
`status: in-progress` (or planned) render list rows only; the detail page
`/results-and-tools/[slug]` publishes **only** when the copy reaches ≥ 150
words, status ≥ in-progress and the frontmatter demands it — designed to stay
`404`/not-indexed until the content is real.

## Adding a partner

`content/data/partners.yaml` with fields `name`, `country`,
`description` (per locale), `type` (full | associated), `url` (verified), and
`logo` **only** when the partner delivered the asset and approved publication
(`approvedLogo: true`). Never substitute dummy logos.

## Contact/newsletter publication flow

- Contact recipients come from env (`CONTACT_TO_EMAIL` or `CONTACT_ROUTING`
  JSON map by audience). Owners provide mailbox addresses; nothing is
  hard-coded.
- The form renders "operational" only when `ALTCHA_HMAC_KEY` and mail
  settings exist; otherwise it shows a notOperational notice (§6.9).
- The newsletter card appears only with a provider; it requires double
  opt-in and is never bundled with contact consent.

## Adding a translation

1. Currently EN pages are approved; IT/PT/ES/EL drafts live under
   `content/pages/it/…` (PT/ES/EL drafts await owner budget sign-off — see
   `docs/owner-inputs.md`).
2. Translate frontmatter + body; keep `status: draft`, `humanReviewed: false`
   until the project comms lead approves.
3. Add the missing `messages/<locale>.json` entries — `check:i18n` fails on
   key mismatches or wrong `{token}` placeholders.
4. Only when the whole locale is signed off: set `publishedLocales` in
   `src/config/locales.ts`; localised pathnames then activate automatically.

## Editorial checklist (each publication)

- [ ] Participant consent + image rights documented on file
- [ ] Factual accuracy: names/countries/quantities verified with owner
- [ ] Partner approval for partner-related claims
- [ ] EU funding visibility must not be removed from templates
- [ ] EUR or project-ID facts only from `src/config/site.ts`
- [ ] `pnpm check:content && pnpm check:i18n && pnpm check:placeholders` green
