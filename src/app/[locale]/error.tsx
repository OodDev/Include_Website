"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

/** Locale 500 boundary: server-only details stay in logs (§5 security-logs). */
export default function LocaleError({ reset }: { error: unknown; reset: () => void }) {
  const t = useTranslations("errors");

  return (
    <div className="mx-auto grid max-w-[60ch] content-center gap-6 px-6 py-28 text-center">
      <h1 className="text-h1 font-extrabold tracking-tight">{t("500title")}</h1>
      <p className="text-[1.0625rem]">{t("500text")}</p>
      <div className="flex justify-center gap-6 text-[0.9375rem] font-bold">
        <button
          type="button"
          onClick={reset}
          className="text-petrol-deep underline-offset-4 hover:underline"
        >
          {t("retry")}
        </button>
        <Link href="/" className="text-petrol-deep underline-offset-4 hover:underline">
          {t("backHome")}
        </Link>
      </div>
    </div>
  );
}
