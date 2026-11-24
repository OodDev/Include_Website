# Reusable prompt — client review portal

A stack-agnostic prompt for a coding agent to build a password-gated "client
review portal" (static snapshots + numbered change requests + attachments +
ZIP export/import) for **any** website.

Fill in the `INPUT` block, then hand the whole file to the agent.

Sibling document: [`../README.md`](../README.md) describes the INCLUDE
implementation this prompt was distilled from.

---

~~~markdown
# ROLE
You are a senior web architect and front-end engineer. Build a "client review
portal": a password-gated, single-purpose web app that lets a non-technical
client browse static snapshots of a live website, mark exact page sections,
and file unlimited numbered change requests with attachments — then export
everything as a ZIP so the developer can implement the changes by hand.

# INPUT (fill before starting; ask the user for anything missing — never invent)
- LIVE_SITE_URL:            https://…            (the site to be reviewed)
- PAGES_TO_CAPTURE:         list of routes, or "discover from sitemap.xml"
- BRAND:                    primary/ink/accent hexes, heading+body font files,
                            logo file(s), optional existing design tokens
- UI_LANGUAGE:              e.g. Italian — ALL interface copy in this language only
- GATE_PASSWORD:            provided via env, NEVER hard-coded or committed
- APP_LOCATION:             subfolder inside the existing repo (e.g. review-portal/)
- REQUEST_FORMAT:           the exact markdown template the developer wants
                            (if none supplied, use the template in §7)
- TARGET_VIEWPORTS:         default desktop 1440×900 + mobile 390×844
- IMAGE_BUDGET:             total committed capture weight, default < 15 MB
- DEPLOY_TARGET:            Vercel (or state the equivalent)

# HARD CONSTRAINTS
1. Separate application in APP_LOCATION with its own package.json, build and
   deploy config. It must NOT modify, import from, or break the existing site.
2. Zero backend database. All client data lives in the browser (IndexedDB).
   No upload endpoint, no analytics, no third-party requests, no CDN fonts.
   Self-host fonts and brand assets.
3. `noindex, nofollow` everywhere; CSP in Report-Only to start.
4. The gate password exists only in environment variables. Never commit it,
   never log submitted values, never echo it in errors or tests.
5. WCAG 2.2 AA: labelled controls, visible focus rings, keyboard-operable
   hotspots and drag selection, contrast ≥ 4.5:1, respects
   prefers-reduced-motion. Mobile layout must be usable at 390 px.
6. Static-first rendering; the portal itself must work with JS enabled only
   (no SEO requirement). Target initial JS well under ~200 KB gzipped.

# 1. SNAPSHOT CAPTURE PIPELINE  (scripts/capture.mjs, run locally, output committed)
- Use Playwright (chromium) against LIVE_SITE_URL.
- For every page × every TARGET_VIEWPORT:
  * disable animations (inject `* { animation: none !important;
    transition: none !important; }`), wait for networkidle + fonts.ready,
    scroll through the page to trigger lazy loading, scroll back to top.
  * save a full-page screenshot + a small thumbnail (see §1b for format).
  * collect candidate sections by querying semantic containers
    (`section, header, footer, main > div, article, [data-section]`) and
    recording bounding boxes relative to the full-page image.
  * heuristics: merge rows of sibling cards into ONE hotspot ("stat row",
    "card grid"); drop boxes < 40 px tall or < 3% of page height; drop
    invisible/aria-hidden nodes; clamp to image bounds.
  * detect duplicate/overlapping boxes and nested boxes: keep the outer one,
    dedupe identical labels.
- Emit `src/data/captures.json`: { pages: { [route]: { label, desktop: {
  file, thumb, width, height, hotspots: [{id,label,x,y,w,h}] }, mobile: {…} } } }
- The JSON is hand-editable: document that a human curates/renames labels and
  removes bad hotspots after the first run. Never leave raw auto labels
  ("div.section-3") in the UI.
- Add an npm script `capture`. Re-running it must fully regenerate, not append.
- Note in the README that captures are a point-in-time snapshot and must be
  regenerated after each content release.

# 1b. SCREENSHOT FORMAT & WEIGHT (mandatory)
Use **WebP** for every capture, not JPEG/PNG. Playwright's `page.screenshot()`
only emits png/jpeg, so post-process with `sharp` in the same script:

    const png = await page.screenshot({ fullPage: true });
    await sharp(png).webp({ quality: 80, effort: 6 }).toFile(outWebp);
    await sharp(png).resize({ width: 480 }).webp({ quality: 60 })
      .toFile(outThumbWebp);

Rules:
- Full-page capture: WebP, quality 75–85, `effort` 5–6. Expect roughly 40–60 %
  smaller files than JPEG q80 at identical visual quality for UI screenshots.
- Thumbnail: WebP, width ~480 px, quality 55–65. Used only in the page picker
  and the request list — never ship the full-page image for that.
- Strip metadata: `sharp` does this by default; do not embed ICC profiles.
- Enforce IMAGE_BUDGET in the capture script: sum the emitted byte sizes and
  fail (non-zero exit) with a clear message listing the heaviest pages if the
  total exceeds it. Print the per-page table every run so drift is visible.
- If the budget is exceeded: first lower thumbnail resolution, then full-page
  quality (to 75), then split very long pages into ≤ 6000 px slices with an
  overlap and treat each slice as a selectable "part" of the page. Do not
  silently drop pages.
- Never commit the intermediate PNGs: write them to the OS temp dir, keep only
  the `.webp` outputs in `public/captures/`.
- Loading strategy in the app: lazy-load thumbnails (`loading="lazy"`,
  fixed aspect ratio to avoid layout shift), and load the full-page WebP only
  for the page the client selected. Use `decoding="async"`.
- Add `Cache-Control: public, max-age=31536000, immutable` for capture assets
  in the hosting config; the filenames are content-addressed enough by the
  capture date (or add a hash suffix to the manifest).

# 2. REVIEW UX  (three steps, one page, no routing complexity)
Step 1 — page picker: grid of page cards (thumbnail + label). Show the current
  device toggle (Desktop / Mobile) globally.
Step 2 — section selection: render the full capture image inside a relative
  container with the hotspot overlays scaled by percentage (so selection is
  resolution-independent). Hover/focus highlights a hotspot with its label.
  Clicking a hotspot → step 3. Also provide:
  * a "drag a box" mode: pointer-events selection drawing a rectangle over the
    image, snapping to min 20×20 px, cancellable with Esc.
  * an "open the live page" link (target=_blank, rel="noopener noreferrer")
    for context — never an iframe (hosting sites send X-Frame-Options: DENY).
  * a graceful fallback if a capture is missing: show the live-page link and
    allow requests without a selected area.
Step 3 — request form: what to change (title), details (textarea),
  priority, optional attachments, plus read-only context (page, device,
  section label, coordinates, generated crop). Buttons: "Add to list" and
  "Back". Validation inline, never a blocking alert().

# 3. REQUEST MODEL
- Unlimited requests. Sequential human-readable IDs (Camb 001, Camb 002 …)
  derived from the max existing ID + 1, never from array length.
- Each request: id, createdAt, updatedAt, page route + label, device,
  section label, selection {x,y,w,h} (normalised 0–1) + hotspot id if any,
  title, description, priority, attachment ids.
- List panel: newest first, shows ID, page, title, attachment count, crop
  thumbnail; actions edit / duplicate / delete (delete asks confirmation).
- Global metadata block (compiled by, date, site version/commit if known),
  editable once and reused on export.
- Exporting must renumber nothing and preserve manual ordering intent.

# 4. ATTACHMENTS
- Real file uploads via <input type="file"> accepting SVG/PNG/JPG/PDF
  (extend per project). Enforce max size per file and max count; validate MIME.
- Store bytes in IndexedDB as Blob, keyed by generated id; keep only metadata
  in the request object. Render image previews; for PDFs show name + size.
- Support removing an attachment before saving and from the edit view.

# 5. PERSISTENCE (IndexedDB, no server)
- One DB, e.g. `client-review-portal`, stores `kv` (state JSON) and `files`
  (Blobs). Wrap in a tiny typed helper module; no external ORM.
- Autosave the whole app state on every mutation with a short debounce
  (~400 ms). Restore on load. Show a discreet "saved" indicator.
- Must survive reload, tab close and IndexedDB eviction gracefully: if closed,
  show a banner inviting export before continuing.

# 6. EXPORT / IMPORT (ZIP)
Export produces `<slug>-review.zip` containing:
- `richieste-modifiche.md` — human-readable, numbered, one block per request,
  including page/device/section/coordinates and an image reference per crop.
- `requests.json` — lossless machine copy (schema-versioned) for re-import.
- `allegati/<id>-<original-name>` — original attachments.
- `selezioni/<request-id>.png` — crop of the selected region, rendered
  client-side from the capture (canvas), so the developer sees exactly what
  the client meant. PNG is correct here: lossless, tiny, and universally
  openable by the developer; do not re-compress to lossy WebP.
Import: accept the ZIP, validate `requests.json` against a schema, then offer
"merge" (append, renumber collisions) or "replace". Validate every referenced
attachment exists; report skipped items instead of failing silently.
Document that no .docx export exists (markdown + ZIP is deliberate).

# 7. MARKDOWN TEMPLATE (adapt to REQUEST_FORMAT if supplied)
```
# Richieste di modifica — <site> — <date>
Compilato da: <name>
## Camb 001 — <page> — <section> — <device>
Priorità: alta | media | bassa
Modifica: <title>
Dettagli: <description>
Selezione: x=…,y=…,w=…,h=… (immagine: selezioni/camb-001.png)
Allegati: allegati/… (or "nessuno")
```

# 8. PASSWORD GATE
- Server route `POST /api/gate` validating the submitted password against a
  SHA-256 digest held in env (PREVIEW_PASSWORD or PREVIEW_PASSWORD_SHA256),
  compared without early exit.
- On success set an httpOnly, SameSite=Lax, Secure cookie (own name, e.g.
  `client_portal`, ~7 days) and redirect to `next` (validated to be same-origin).
- A root-scoped middleware/proxy rejects every request without the cookie,
  returning 401 with the gate HTML (correct `lang`, brand styling, no JS
  required). Static brand/font assets must be exempt so the gate renders
  before login. Everything else — including snapshots — stays private.
- Rate-limit attempts per IP; never log the submitted value.

# 9. DEPLOYMENT
- Same repo, separate project. If the repo root is another app, the hosting
  project's Root Directory MUST point at APP_LOCATION — otherwise every git
  push builds the wrong app and silently overwrites the domain. Verify this
  after the first deploy by checking a distinctive marker of the portal.
- Set env vars for production AND preview.
- Share only the production URL. Preview URLs on team domains sit behind SSO.
- Add a smoke test (Playwright) that runs against a chosen base URL and proves:
  gate returns 401 + portal markers; login works; page pick advances;
  hotspots render (wait for hydration, no fixed sleeps only);
  a request with an attachment saves; export ZIP downloads; a fresh browser
  context re-imports it and recovers the request and attachment; mobile
  viewport renders. Fail loudly with screenshots on error.

# 10. DELIVERABLES / ACCEPTANCE
- App in APP_LOCATION, README covering: local run, capture refresh, image
  format/weight budget, deploy settings (Root Directory!), env vars, export
  format, known limits.
- No secrets in git; `.env*` ignored; checked captures committed intentionally.
- Repository checks green: typecheck, lint, unit tests (ID numbering, markdown
  generation + parse round-trip, ZIP import validation), production build.
- A final report listing: what was built, how it was verified, bundle and
  capture weight (with the per-page table), and anything a future maintainer
  must not change.

# WORKING RULES FOR THE AGENT
- Investigate the existing repo conventions first (package manager, lint,
  tokens, component style) and match them.
- Never invent brand assets, copy or legal text; ask.
- Commit in small conventional commits; do not touch the main site's source.
- After capturing, review the hotspots yourself: if a page shows 0 or clearly
  wrong boxes, fix the heuristics before declaring done.
~~~
