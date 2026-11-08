import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";

/**
 * Next 16 proxy = middleware. Locale negotiation + header hardening.
 * No locale cookie is set (routing has localeDetection: false) — matches §11.1.
 */
const intlMiddleware = createMiddleware(routing);

export default function proxy(request: Request) {
  return intlMiddleware(request);
}

export const config = {
  // All published locales except files with extensions and Next internals
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
