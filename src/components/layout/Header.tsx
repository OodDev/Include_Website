import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/lib/i18n";
import { Logo } from "@/components/brand/Logo";
import { MobileNav, type NavItem } from "@/components/layout/MobileNav";
import { Container } from "@/components/ui/LayoutPrimitives";
import { publishedLocales } from "@/config/locales";

/**
 * Desktop header per mockups (§2.3 #3): logo · The Project · The Pathway ·
 * Results & Tools · Partners · News · Contact · "Ready for Inclusion" pill —
 * pill LAST in DOM → focus order = visual order = mockup reading order.
 * Sticky with hairline after 8px scroll. aria-current marks the current page.
 */
export async function Header() {
  const [t, locale] = await Promise.all([getTranslations("header"), getLocale()]);
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
      <Container className="flex items-center justify-between gap-4 py-4 flex-wrap">
        <Logo href="/" />
        <nav aria-label={t("nav")} className="hidden md:block">
          <ul className="flex items-center gap-5">
            {items.map((it) => (
              <li key={it.route}>
                <Link
                  href={`/${it.route}`}
                  className="text-[0.9375rem] font-bold decoration-2 underline-offset-4 hover:underline"
                  aria-current={undefined}
                >
                  {it.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/ready-for-inclusion"
                className="rounded-pill bg-rust px-4 py-2 text-white text-[0.9375rem] font-bold hover:bg-burgundy motion-safe"
              >
                {t("pill")}
              </Link>
            </li>
          </ul>
        </nav>
        {/* Language switcher renders only when >1 locale is published (§2.3 #2) */}
        {publishedLocales.length > 1 && (
          <span className="u-label text-slate/60">{current.toUpperCase()}</span>
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
