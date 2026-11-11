import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n";
import { LogoFooter } from "@/components/brand/LogoFooter";
import { Container } from "@/components/ui/LayoutPrimitives";
import { siteConfig } from "@/config/site";
import { CookieSettingsButton } from "@/features/consent/CookieSettingsButton";

/** Footer (§6.11): negative logo, menu in architecture order, legal links,
 * cookie settings, co-brand row, project facts table, verbatim EU disclaimer. */
export async function Footer() {
  const [tNav, tFooter] = await Promise.all([
    getTranslations("header"),
    getTranslations("footer"),
  ]);

  const menu = [
    { route: "the-project" },
    { route: "the-pathway" },
    { route: "results-and-tools" },
    { route: "ready-for-inclusion" },
    { route: "partners" },
    { route: "news" },
    { route: "contact" },
    { route: "glossary" },
  ].filter((m) => !(m.route === "glossary") && m.route) as { route: string }[];

  const legal = ["privacy-policy", "cookie-policy", "accessibility", "legal-notice"] as const;

  const facts: { label: string; value: string }[] = [
    { label: tFooter("facts.project"), value: siteConfig.fullName },
    { label: tFooter("facts.programme"), value: siteConfig.programmeLabel },
    { label: tFooter("facts.number"), value: siteConfig.projectNumber },
    { label: tFooter("facts.duration"), value: `${siteConfig.durationsMonths} months` },
    { label: tFooter("facts.period"), value: siteConfig.projectPeriod.label },
    { label: tFooter("facts.coordinator"), value: siteConfig.coordinator },
  ];

  return (
    <footer className="bg-slate text-white">
      <Container as="div" className="py-14 md:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="flex flex-col gap-6">
            <LogoFooter href="/" />
            {/* Co-brand row: INCLUDE | Erasmus+/EU emblem | partners — official
                files awaited (docs/owner-inputs.md); slot intentionally absent
                rather than imitated (§2.4). Order and rules per §5.8. */}
            <p className="text-[0.8125rem] leading-6 text-white/70 max-w-sm" id="eu-disclaimer">
              {tFooter("euDisclaimer")}
            </p>
          </div>

          <nav aria-label={tFooter("sectionNav")} className="grid grid-cols-2 gap-x-12 gap-y-2 sm:grid-cols-3 md:max-w-lg">
            <ul className="contents">
              {menu.map((m) => (
                <li key={m.route}>
                  <Link
                    href={`/${m.route}`}
                    className="text-[0.9375rem] text-white/85 underline-offset-4 hover:underline"
                  >
                    {m.route === "glossary"
                      ? tFooter("sectionNav")
                      : tNav(`navItems.${m.route}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 border-t border-white/15 pt-8">
          <dl className="grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {facts.map((f) => (
              <div key={f.label} className="flex flex-col sm:flex-row sm:gap-3">
                <dt className="u-label text-white/70 pb-1 sm:pb-0" style={{ fontSize: "0.6875rem" }}>
                  {f.label}
                </dt>
                <dd className="text-[0.875rem]">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/15 pt-6 text-[0.8125rem]">
          {legal.map((r) => (
            <Link key={r} href={`/${r}`} className="text-white/75 underline-offset-4 hover:underline">
              {tFooter(`legalLinks.${r}`)}
            </Link>
          ))}
          <CookieSettingsButton />
        </div>
      </Container>
    </footer>
  );
}
