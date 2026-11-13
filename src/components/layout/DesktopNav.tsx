"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n";
import { Icon } from "@/components/brand/Icon";
import { cn } from "@/lib/utils/cn";
import type { NavItem } from "@/components/layout/MobileNav";

/**
 * Desktop nav list (client only for current-page state; MobileNav pattern).
 * The active page is marked with a rust underline — the same current-page
 * colour MobileNav uses — plus aria-current="page" (§6.1). Section routes
 * also match their child pages (/results-and-tools/[slug] keeps the section
 * marked). The home entry is the icon link: never underlined, and on the
 * homepage nothing is underlined (owner instruction, 2026-11-11). The
 * "Ready for Inclusion" pill is a CTA, not a nav item — left unmarked.
 */
export function DesktopNav({ items, pill }: { items: NavItem[]; pill: NavItem }) {
  const t = useTranslations("header");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  // Route keys arrive without a leading slash (Header passes "the-pathway");
  // usePathname() returns "/the-pathway" — normalise before comparing.
  const isCurrent = (route: string) =>
    pathname === `/${route}` || pathname.startsWith(`/${route}/`);

  return (
    <nav aria-label={t("nav")} className="hidden md:block">
      <ul className="flex items-center gap-5">
        {/* Home via icon link although the logo links home too: §2.3 keeps
            the logo as brand, users read the burger row better when a way
            home is explicit; icon drawn in set style (TODO(brand-asset)). */}
        <li>
          <Link
            href="/"
            aria-label={t("home")}
            title={tCommon("toHome")}
            aria-current={pathname === "/" ? "page" : undefined}
            className="inline-flex h-11 w-11 items-center justify-center rounded-input hover:bg-paper motion-safe"
          >
            <Icon name="home" size={22} />
          </Link>
        </li>
        {items.map((it) => (
          <li key={it.route}>
            <Link
              href={`/${it.route}`}
              aria-current={isCurrent(it.route) ? "page" : undefined}
              className={cn(
                "text-[0.9375rem] font-semibold hover:text-petrol-deep motion-safe",
                isCurrent(it.route) &&
                  "underline decoration-rust decoration-2 underline-offset-4",
              )}
            >
              {it.label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href={`/${pill.route}`}
            className="rounded-pill bg-rust px-4 py-2 text-white text-[0.9375rem] font-semibold hover:bg-petrol-deep motion-safe"
          >
            {pill.label}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
