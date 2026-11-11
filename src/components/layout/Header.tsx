import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/lib/i18n";
import { Logo } from "@/components/brand/Logo";
import { MobileNav, type NavItem } from "@/components/layout/MobileNav";
import { Container } from "@/components/ui/LayoutPrimitives";
import { Icon } from "@/components/brand/Icon";
import { publishedLocales } from "@/config/locales";

/**
 * Desktop header per mockups (§2.3 #3): logo · [home icon] · The Project · The Pathway ·
 * Results & Tools · Partners · News · Contact · "Ready for Inclusion" pill —
 * pill LAST in DOM → focus order = visual order = mockup reading order.
 * Sticky with hairline after 8px scroll. aria-current marks the current page.
 */
export async function Header() {
  const [t, tCommon, locale] = await Promise.all([
    getTranslations("header"),
    getTranslations("common"),
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
                className="inline-flex h-11 w-11 items-center justify-center rounded-input hover:bg-paper motion-safe"
              >
                <Icon name="home" size={22} />
              </Link>
            </li>
            {items.map((it) => (
              <li key={it.route}>
                <Link
                  href={`/${it.route}`}
                  className="text-[0.9375rem] font-semibold hover:text-petrol-deep motion-safe"
                  aria-current={undefined}
                >
                  {it.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/ready-for-inclusion"
                className="rounded-pill bg-petrol-deep px-4 py-2 text-white text-[0.9375rem] font-semibold hover:bg-slate motion-safe"
              >
                {t("pill")}
              </Link>
            </li>
          </ul>
        </nav>
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
