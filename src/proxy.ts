import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale, pathnames } from "@/config/locales";

/**
 * Next 16 proxy = middleware. Locale negotiation + header hardening.
 * No locale cookie is set (routing has localeDetection: false) — matches §11.1.
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

export default function proxy(request: NextRequest) {
  const url = new URL(request.url);
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
