import type { ReactNode } from "react";
import { Outfit, Manrope } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/lib/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsentBanner } from "@/features/consent/ConsentBanner";
import { SkipLink } from "@/components/layout/SkipLink";
import { organizationSchema, websiteSchema, JsonLd } from "@/lib/seo/schemaorg";
import "@/styles/globals.css";

// Outfit — site typeface of the "petrolio immersive" direction (D17).
// Manrope stays loaded ONLY for the footer logo's tagline, which reproduces
// the owner SVG artwork set in Manrope-ExtraBold (LogoFooter).
// Both are self-hosted at build via next/font (no runtime Google request, §3).
const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-outfit",
});
const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-manrope",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${outfit.variable} ${manrope.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body>
        <SkipLink />
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema(locale)} />
        <NextIntlClientProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <ConsentBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
