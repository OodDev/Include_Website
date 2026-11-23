# INCLUDE · Centro richieste di modifica

Password-gated companion site for the INCLUDE website. The client browses
snapshots of the live pages, clicks the exact block they mean, describes the
change and hands the team back a `.md` + attachment ZIP in the
`CHANGE_REQUESTS_ORIGINAL.md` format.

Nothing leaves the client's browser: requests and attachments live in
IndexedDB, and the export is generated locally. The only server-side piece is
the password gate — same SHA-256/httpOnly-cookie pattern as the main site
(`docs/decisions.md` D19).

## Run locally

```bash
pnpm install
cp .env.example .env.local   # PREVIEW_PASSWORD optional in development
pnpm dev                     # http://localhost:3200
```

Without `PREVIEW_PASSWORD` the gate is open (local only). With it set, the
password page appears before anything else.

## Refreshing the page previews

Captures are static snapshots, so they only change when the live site does.
After a content release:

```bash
pnpm capture           # uses .env.local → NEXT_PUBLIC_LIVE_SITE_URL / PREVIEW_PASSWORD
```

`scripts/capture.mjs` logs in through the main site's preview gate, snapshots
each route at 1440 px and 390 px, detects the page sections as clickable
hotspots and rewrites `src/data/captures.json`. Then rebuild/redeploy.

- `PAGES=home,the-pathway pnpm capture` limits the run.
- `PORTAL_CAPTURE_BASE=http://localhost:3100 pnpm capture` captures a local
  build instead of production.
- Output images: `public/captures/<slug>-<device>.jpg` (committed).

## How the client uses it

1. Pick a page from the grid.
2. Click the section on the snapshot, or drag a box around the exact area.
3. Choose the request type and fill only the fields that matter, set P1–P3 and
   draft/final, attach images or logos if needed.
4. Repeat for every change, on any page.
5. **Esporta** downloads `richieste-modifiche-YYYY-MM-DD.zip`:
   - `richieste-modifiche.md` — human-readable, numbered `Camb 001…`
   - `richieste-modifiche.json` — lossless state for re-import
   - `allegati/001-<original name>` — the real files
   - `selezioni/camb-001.png` — the exact area the client circled

Work autosaves continuously. To resume on another machine (or after clearing
the browser), use **Importa** with an earlier ZIP — merge or replace.

## For the team

- The `.md` is the working document; the JSON is only for round-tripping.
- `selezioni/` images make visual requests unambiguous — no need to ask which
  block was meant.
- Requests are still implemented by hand in the main repo; this portal does
  not touch `content/`.

## Deploy (separate Vercel project)

- **Root directory: `review-portal` — this MUST be set in the Vercel project
  settings** (Settings → General → Root Directory). The git repo root is the
  main INCLUDE site, so if the portal project's Root Directory is left blank,
  every git-triggered build compiles the *main site* instead of this app.
- Framework: Next.js
- Env: `PREVIEW_PASSWORD`, `NEXT_PUBLIC_LIVE_SITE_URL` (production + preview)
- The app is `noindex`, no analytics, no third-party requests; CSP is
  Report-Only like the main site.
- Share the **production** URL (`include-review-portal.vercel.app`) with the
  client. Preview URLs on the team domain sit behind Vercel SSO.

## Checks

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
pnpm smoke             # end-to-end: gate, request, attachment, export, re-import
```

`tests/markdown.test.ts` covers generation, the parser round-trip and request
validation; `scripts/smoke.mjs` drives a real browser against `pnpm start`
(desktop + mobile) and writes screenshots to the OS temp folder.

## Layout

```
src/app          shell, password gate route, global styles
src/components   composer (page picker, capture viewer, form), list, summary
src/lib          model, markdown, archive/export, IndexedDB storage, gate
src/data         pages.json (route labels) + captures.json (generated)
scripts          capture.mjs (Playwright snapshots + hotspots), smoke.mjs
public           brand SVGs, self-hosted Outfit, generated captures
```
