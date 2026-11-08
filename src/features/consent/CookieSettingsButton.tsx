"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { readConsent, writeConsent } from "@/lib/security/consent";

export function ConsentSettings({
  children,
  title,
  intro,
  saveLabel,
  necessaryLabel,
  necessaryDesc,
  statisticsLabel,
  embeddedLabel,
}: {
  children: React.ReactNode;
  title: string;
  intro: string;
  saveLabel: string;
  necessaryLabel: string;
  necessaryDesc: string;
  statisticsLabel: string;
  embeddedLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<{ statistics: boolean; embedded: boolean }>({
    statistics: false,
    embedded: false,
  });


  return (
    <Dialog.Root
        open={open}
        onOpenChange={(next) => {
          // Hydrate from stored consent each time the dialog opens (§11.2)
          if (next) {
            const existing = readConsent();
            setState({
              statistics: existing?.statistics ?? false,
              embedded: existing?.embedded ?? false,
            });
          }
          setOpen(next);
        }}
      >
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-slate/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,32rem)] -translate-x-1/2 -translate-y-1/2 rounded-card-lg bg-white p-6 shadow-xl">
          <VisuallyHidden>
            <Dialog.Title>{title}</Dialog.Title>
          </VisuallyHidden>
          <p className="text-[0.9375rem] text-slate/80">{intro}</p>
          <div className="mt-5 flex flex-col gap-4 text-[0.9375rem]">
            <label className="flex items-start justify-between gap-4 font-bold">
              <span>
                {necessaryLabel}
                <span className="block pb-1 font-normal text-slate/70">{necessaryDesc}</span>
              </span>
              <input type="checkbox" checked disabled className="mt-1 h-5 w-5 accent-petrol-deep" aria-label={necessaryLabel} />
            </label>
            <label className="flex items-start justify-between gap-4 font-bold">
              <span>{statisticsLabel}</span>
              <input
                type="checkbox"
                checked={state.statistics}
                onChange={(e) => setState((s) => ({ ...s, statistics: e.target.checked }))}
                className="mt-1 h-5 w-5 accent-petrol-deep"
              />
            </label>
            <label className="flex items-start justify-between gap-4 font-bold">
              <span>{embeddedLabel}</span>
              <input
                type="checkbox"
                checked={state.embedded}
                onChange={(e) => setState((s) => ({ ...s, embedded: e.target.checked }))}
                className="mt-1 h-5 w-5 accent-petrol-deep"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={() => {
              writeConsent(state);
              setOpen(false);
            }}
            className="mt-6 min-h-11 w-full rounded-pill bg-slate px-5 font-bold text-white hover:bg-burgundy"
          >
            {saveLabel}
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** Footer "Cookie settings" control (§6.11/§11.2). */
export function CookieSettingsButton() {
  const t = useTranslations("consent");

  return (
    <ConsentSettings
      title={t("settingsTitle")}
      intro={t("settingsIntro")}
      saveLabel={t("save")}
      necessaryLabel={t("necessary")}
      necessaryDesc={t("necessaryDesc")}
      statisticsLabel={t("statistics")}
      embeddedLabel={t("embedded")}
    >
      <button
        type="button"
        className="text-white/75 underline underline-offset-4 hover:text-white"
        aria-haspopup="dialog"
      >
        {t("settingsTitle")}
      </button>
    </ConsentSettings>
  );
}
