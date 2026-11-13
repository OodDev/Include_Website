import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n";
import { LogoFooter } from "@/components/brand/LogoFooter";
import { Container } from "@/components/ui/LayoutPrimitives";
import { siteConfig } from "@/config/site";
import { CookieSettingsButton } from "@/features/consent/CookieSettingsButton";

/**
 * Footer (§6.11) — "Version 3" white-ground art direction (owner-approved
 * footer mockups, 2026-11-13; docs/decisions.md D21): white ground, slate
 * logo, petrol-filled pill navigation in a right-hand column, transparent
 * EU emblem (official owner asset, D21) on its own hairline row, untouched
 * project-facts grid and verbatim EU disclaimer.
 */
export async function Footer() {
  const [tNav, tFooter] = await Promise.all([
    getTranslations("header"),
    getTranslations("footer"),
  ]);

  const menu = [
    { route: "home" },
    { route: "the-project" },
    { route: "the-pathway" },
    { route: "results-and-tools" },
    { route: "ready-for-inclusion" },
    { route: "partners" },
    { route: "news" },
    { route: "contact" },
  ];

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
    <footer className="bg-white text-slate">
      <Container as="div" className="py-14 md:py-16">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div className="flex flex-col gap-6">
            <LogoFooter href="/" variant="slate" />
            <p className="text-[0.8125rem] leading-6 text-slate/80 max-w-md" id="eu-disclaimer">
              {tFooter("euDisclaimer")}
            </p>
            {/* EU emblem row: official owner-delivered transparent asset
                (public/brand/co-funded-by-eu.png, D21); provenance copy in
                assets/brand/eu-emblem/. ≥40px height, light ground per EU
                visibility rules; order and rules per §5.8. */}
            <div className="mt-1 flex flex-wrap items-center gap-x-9 gap-y-4 border-t border-mist pt-7">
              {/* eslint-disable-next-line @next/next/no-img-element -- owner raster asset in /public; static-first, no optimizer config needed. */}
              <img
                src="/brand/co-funded-by-eu.png"
                alt="Co-funded by the European Union"
                width={463}
                height={106}
                className="block h-[46px] w-auto"
              />
              <p className="text-[0.8125rem] leading-6 text-slate/80">
                {siteConfig.programmeLabel}
              </p>
            </div>
          </div>

          <nav aria-label={tFooter("sectionNav")} className="flex flex-col gap-3 lg:justify-self-end">
            <span className="u-label text-slate/55">{tFooter("sectionNav")}</span>
            <ul className="flex max-w-md flex-wrap gap-x-3 gap-y-2.5">
              {menu.map((m) => (
                <li key={m.route}>
                  <Link
                    href={m.route === "home" ? "/" : `/${m.route}`}
                    className="inline-block rounded-pill bg-petrol-deep px-5 py-2 text-[0.9375rem] font-medium leading-snug text-white underline-offset-4 hover:bg-petrol focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-petrol-deep"
                  >
                    {tNav(`navItems.${m.route}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 border-t border-mist pt-8">
          <dl className="grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {facts.map((f) => (
              <div key={f.label} className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
                <dt className="u-label pb-1 text-petrol-deep sm:pb-0" style={{ fontSize: "0.6875rem" }}>
                  {f.label}
                </dt>
                <dd className="text-[0.875rem] leading-6">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-mist pt-6 text-[0.8125rem]">
          {legal.map((r) => (
            <Link key={r} href={`/${r}`} className="text-slate/80 underline-offset-4 hover:underline">
              {tFooter(`legalLinks.${r}`)}
            </Link>
          ))}
          <CookieSettingsButton tone="onLight" />
        </div>
      </Container>
    </footer>
  );
}
