import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Link/usePathname derived from next-intl HOW IT RUNS: locale-prefixed, with
 * hrefs accepted as plain strings so dynamic routes (/news/[slug] etc.) can
 * render filled URLs. The strict pathnames-key typing is dropped at the
 * component boundary; the runtime routing object (with pathnames) still
 * powers localisation inside routing.ts and the proxy.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(
  // Loose hrefs: typed as `string` so dynamic routes render filled URLs; the
  // runtime routing object (incl. pathnames) powers locale prefixes.
  routing as Parameters<typeof createNavigation>[0],
);

export { routing } from "./routing";
