import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/config/locales";
import { iconIds, Icon } from "@/components/brand/Icon";
import { ReadyLabel } from "@/components/brand/ReadyLabel";
import { LogoMark } from "@/components/brand/LogoMark";
import { SuperE } from "@/components/brand/SuperE";

/**
 * Private /dev/design-system route (no Storybook per §3): a token and
 * component reference for the team. noindex and hidden in production.
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Design system (dev)",
    robots: { index: false, follow: false },
  };
}

export default async function DesignSystemPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // Hidden in any production build (SITE_ENV can be misconfigured; NODE_ENV cannot).
  if (process.env.NODE_ENV === "production") notFound();
  setRequestLocale(locale as AppLocale);

  const colors = [
    ["slate", "bg-slate"],
    ["sky", "bg-sky"],
    ["rust", "bg-rust"],
    ["petrol", "bg-petrol"],
    ["petrol-deep", "bg-petrol-deep"],
    ["burgundy", "bg-burgundy"],
    ["red", "bg-red"],
    ["ochre", "bg-ochre"],
    ["mist", "bg-mist"],
    ["paper", "bg-paper"],
  ] as const;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 text-slate">
      <p className="text-caption tracking-label uppercase text-rust">dev only — noindex, hidden in production</p>
      <h1 className="mt-2 text-h2 font-semibold">INCLUDE design system</h1>

      <section aria-labelledby="ds-colors" className="mt-10">
        <h2 id="ds-colors" className="text-h3 font-semibold">Colors</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {colors.map(([name, cls]) => (
            <li key={name} className="rounded-card-lg border border-slate/15 p-2">
              <div className={`h-14 rounded ${cls}`} />
              <p className="mt-2 text-caption tracking-label">{name}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="ds-type" className="mt-10">
        <h2 id="ds-type" className="text-h3 font-semibold">Typography (Outfit)</h2>
        <div className="mt-4 flex flex-col gap-2">
          <p className="text-h1 font-semibold">Heading 1 (clamp)</p>
          <p className="text-h2 font-semibold">Heading 2 (clamp)</p>
          <p className="text-h3 font-semibold">Heading 3 (clamp)</p>
          <p className="text-body">Body 18px — Outfit</p>
          <p className="text-caption font-caption">Caption 14px / brand labels</p>
        </div>
      </section>

      <section aria-labelledby="ds-brand" className="mt-10">
        <h2 id="ds-brand" className="text-h3 font-semibold">Brand components</h2>
        <div className="mt-4 flex flex-wrap items-center gap-8 rounded-card-lg border border-slate/15 bg-paper p-6">
          <LogoMark />
          <SuperE />
          <ReadyLabel />
          <div className="flex items-center gap-4">
            {(["protected-context", "pre-corporate", "labour-market"] as const).map((name) => (
              <Icon key={name} name={name} size={24} />
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="ds-icons" className="mt-10">
        <h2 id="ds-icons" className="text-h3 font-semibold">Icons (24px grid)</h2>
        <ul className="mt-4 flex flex-wrap gap-4">
          {iconIds.map((name) => (
            <li key={name} className="flex flex-col items-center gap-1 rounded border border-slate/15 p-3">
              <Icon name={name} size={24} />
              <span className="text-caption tracking-label">{name}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="ds-actions" className="mt-10">
        <h2 id="ds-actions" className="text-h3 font-semibold">Buttons & inputs</h2>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button type="button" className="min-h-11 rounded-pill bg-petrol-deep px-5 font-semibold text-white hover:bg-slate">
            Primary
          </button>
          <button
            type="button"
            className="min-h-11 rounded-pill border-2 border-petrol-deep bg-white px-5 font-semibold text-petrol-deep hover:bg-paper"
          >
            Secondary
          </button>
          <label className="text-body">
            Field
            <input
              type="text"
              className="mt-1 block w-64 rounded border border-slate/30 px-3 py-2 hover:border-petrol-deep focus:border-petrol-deep focus:outline-none"
            />
          </label>
        </div>
      </section>
    </div>
  );
}
