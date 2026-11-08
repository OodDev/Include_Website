"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ConsentDialog } from "@/features/consent/ConsentDialog";
import {
  dismissWithoutConsent,
  readConsent,
  wasDismissedWithoutConsent,
  writeConsent,
} from "@/lib/security/consent";

/**
 * First-layer consent banner (§11.2). "Accept all", "Reject non-essential"
 * and "Customize" have equal size and prominence; nothing acts until an
 * explicit choice. Closing with X = continue without accepting: no record is
 * written; scrolling is never consent.
 */
export function ConsentBanner() {
  const t = useTranslations("consent");
  const [visible, setVisible] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- banner visibility is
     decided once after hydration: consent storage only exists on the client,
     and the server render must stay in sync (SSR = hidden) */
  useEffect(() => {
    if (!readConsent() && !wasDismissedWithoutConsent()) {
      setVisible(true);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!visible && !dialogOpen) return null;

  const decide = (all: boolean) => {
    writeConsent({ statistics: all, embedded: all });
    setVisible(false);
  };

  return (
    <>
      <section
        aria-label={t("bannerTitle")}
        className="fixed inset-x-0 bottom-0 z-30 border-t border-slate/15 bg-white p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] sm:p-6"
      >
        <div className="relative mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:pr-10">
          <div className="min-w-0 flex-1">
            <p className="font-bold text-slate">{t("bannerTitle")}</p>
            <p className="mt-1 text-[0.9375rem] text-slate/80">{t("bannerText")}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => decide(false)}
              className="min-h-11 rounded-pill border border-slate bg-white px-4 font-bold text-slate hover:bg-slate hover:text-white"
            >
              {t("rejectAll")}
            </button>
            <button
              type="button"
              onClick={() => decide(true)}
              className="min-h-11 rounded-pill border border-slate bg-white px-4 font-bold text-slate hover:bg-slate hover:text-white"
            >
              {t("acceptAll")}
            </button>
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              aria-haspopup="dialog"
              className="min-h-11 rounded-pill border border-slate bg-white px-4 font-bold text-slate hover:bg-slate hover:text-white"
            >
              {t("settingsTitle")}
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            dismissWithoutConsent();
            setVisible(false);
          }}
          aria-label={t("close")}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-slate hover:bg-slate/10"
        >
          <span aria-hidden="true" className="text-xl leading-none">
            ×
          </span>
        </button>
      </section>
      <ConsentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        labels={{
          title: t("settingsTitle"),
          intro: t("settingsIntro"),
          saveLabel: t("save"),
          necessaryLabel: t("necessary"),
          necessaryDesc: t("necessaryDesc"),
          statisticsLabel: t("statistics"),
          embeddedLabel: t("embedded"),
        }}
      />
    </>
  );
}
