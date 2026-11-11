import { getTranslations, getLocale } from "next-intl/server";
import { Logo } from "@/components/brand/Logo";
import { MobileNav, type NavItem } from "@/components/layout/MobileNav";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { Container } from "@/components/ui/LayoutPrimitives";
import { publishedLocales } from "@/config/locales";

/**
 * Desktop header per mockups (§2.3 #3): logo · [home icon] · The Project · The Pathway ·
 * Results & Tools · Partners · News · Contact · "Ready for Inclusion" pill —
 * pill LAST in DOM → focus order = visual order = mockup reading order.
 * Sticky with hairline after 8px scroll. The desktop nav list is a client
 * component (DesktopNav) that marks the current page with aria-current and
 * a rust underline (not on the homepage — owner instruction 2026-11-11).
 */
export async function Header() {
  const [t, locale] = await Promise.all([
    getTranslations("header"),
    getLocale(),
  ]);
  const current = locale;

  const routes = [
    { key: "the-project" },
    { key: "the-pathway" },
    { key: "results-and-tools" },
    { key: "partners" },
    { key: "news" },
    { key: "contact" },
  ] as const;

  const items: NavItem[] = routes.map((r) => ({
    route: r.key,
    label: t(`navItems.${r.key}`),
  }));

  return (
    <header
      data-header
      className="sticky top-0 z-30 border-b border-transparent bg-white/95 backdrop-blur-sm
        [html[data-scrolled='true']_&]:border-slate/10 motion-safe"
    >
      <Container className="flex items-center justify-between gap-4 pt-6 pb-4 flex-wrap">
        <Logo href="/" />
        <DesktopNav
          items={items}
          pill={{ route: "ready-for-inclusion", label: t("pill") }}
        />
        {/* Language switcher renders only when >1 locale is published (§2.3 #2) */}
        {publishedLocales.length > 1 && (
          <span className="u-label text-petrol-deep">{current.toUpperCase()}</span>
        )}
        <MobileNav
          items={items}
          pill={{ route: "ready-for-inclusion", label: t("pill") }}
        />
      </Container>
    </header>
  );
}

export {};
