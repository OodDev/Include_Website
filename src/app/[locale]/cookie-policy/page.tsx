import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/config/locales";
import type { Metadata } from "next";
import { LegalDoc, legalMetadata } from "@/features/legal/LegalDoc";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return legalMetadata(locale as AppLocale, "cookie-policy");
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return LegalDoc({ locale: locale as AppLocale, slug: "cookie-policy" });
}
