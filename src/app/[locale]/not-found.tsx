import Link from "next/link";
import { getTranslations } from "next-intl/server";

/** Locale-scoped 404: rendered for unknown routes under a known locale. */
export default async function LocaleNotFound() {
  const t = await getTranslations("errors");

  return (
    <div className="mx-auto grid max-w-[60ch] content-center gap-6 px-6 py-28 text-center">
      <h1 className="text-h1 font-extrabold tracking-tight">{t("404title")}</h1>
      <p className="text-[1.0625rem]">{t("404text")}</p>
      <div className="flex justify-center gap-6 text-[0.9375rem] font-bold">
        <Link href="/" className="text-petrol-deep underline-offset-4 hover:underline">
          {t("backHome")}
        </Link>
        <Link href="/contact" className="text-petrol-deep underline-offset-4 hover:underline">
          {t("goToContact")}
        </Link>
      </div>
    </div>
  );
}
