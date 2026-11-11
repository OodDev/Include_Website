import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale, pathnames } from "@/config/locales";
import {
  PREVIEW_COOKIE,
  PREVIEW_GATE_PATH,
  previewCookieValue,
  previewGateEnabled,
} from "@/lib/security/preview";

/**
 * Next 16 proxy = middleware. Preview gate (D17) + locale negotiation +
 * header hardening. No locale cookie is set (routing has localeDetection:
 * false) — matches §11.1.
 */
const intlMiddleware = createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: "always",
  localeDetection: false,
} as unknown as Parameters<typeof createMiddleware>[0]);

/**
 * English route values (the physical App Router segments). Used to serve
 * DRAFT locale previews without next-intl's localised-pathname redirects:
 * in standalone/serverless builds the rewritten request re-enters the proxy
 * and next-intl would bounce /it/the-project → /it/il-progetto forever.
 * Localised pathnames switch on when a locale is published (§2.3 #2).
 */
const englishPaths = new Set<string>([""]);
for (const [key, map] of Object.entries(pathnames)) {
  englishPaths.add(key);
  const en = (map as Record<string, string>)["en"];
  if (en) englishPaths.add(en);
}

/**
 * Minimal gate page: one password field posting to /api/preview-gate.
 * Inline HTML, no external assets, noindex. `denied` renders the error hint.
 */
function gateResponse(pathname: string, denied: boolean): NextResponse {
  const action = `${PREVIEW_GATE_PATH}?next=${encodeURIComponent(pathname)}`;
  const error = denied
    ? '<p style="margin:16px 0 0;color:#C14723">Password errata / Wrong password</p>'
    : "";
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>INCLUDE — preview access</title><style>body{font-family:system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;background:#F4F1EC;color:#1F2937}form{background:#fff;padding:40px;border-radius:16px;box-shadow:0 8px 30px rgba(0,0,0,.08);text-align:center}h1{font-size:18px;margin:0 0 4px}p{font-size:13px;color:#6B7280;margin:0 0 20px}input{padding:10px 14px;border:1px solid #D1D5DB;border-radius:10px;font-size:15px;width:220px}button{display:block;width:100%;margin-top:12px;padding:10px;border:0;border-radius:10px;background:#C14723;color:#fff;font-size:15px;cursor:pointer}button:hover{background:#A93D1E}</style></head><body><form method="POST" action="${action}"><h1>INCLUDE — Client preview</h1><p>Enter the password you received by email</p><input type="password" name="password" required aria-label="Password" autofocus><button type="submit">Enter</button>${error}</form></body></html>`;
  return new NextResponse(html, {
    status: 401,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

export default async function proxy(request: NextRequest) {
  const url = new URL(request.url);

  // Preview gate first: everything below is for password-holders only.
  if (previewGateEnabled() && url.pathname !== PREVIEW_GATE_PATH) {
    const cookie = request.cookies.get(PREVIEW_COOKIE)?.value;
    if (!cookie || cookie !== (await previewCookieValue())) {
      return gateResponse(url.pathname + url.search, url.searchParams.get("preview") === "denied");
    }
  }

  const segments = url.pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (first && (locales as readonly string[]).includes(first) && first !== defaultLocale) {
    // Draft locale (not in publishedLocales): serve the physical English path
    // directly; messages resolve through setRequestLocale in layouts/pages.
    const rest = "/" + segments.slice(1).join("/");
    if (englishPaths.has(rest)) {
      return NextResponse.next();
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Everything except Next internals and machine routes: files with extensions
  // are excluded (robots.txt, sitemap.xml, llms.txt, feed.xml, icons…).
  // /og is the OG image segment; /api is handled directly.
  matcher: ["/((?!api|_next|_vercel|og|.*\\..*).*)"],
};
