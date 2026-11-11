"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState } from "react";
import { readConsent, writeConsent } from "@/lib/security/consent";

export type ConsentDialogLabels = {
  title: string;
  intro: string;
  saveLabel: string;
  necessaryLabel: string;
  necessaryDesc: string;
  statisticsLabel: string;
  embeddedLabel: string;
};

type ConsentChoice = { statistics: boolean; embedded: boolean };

/**
 * Granular consent preferences dialog (§11.2): equal-prominence controls,
 * nothing pre-ticked, choices hydrate from the stored record each open.
 */
export function ConsentDialog({
  open,
  onOpenChange,
  labels,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labels: ConsentDialogLabels;
}) {
  const [state, setState] = useState<ConsentChoice>({ statistics: false, embedded: false });

  const handleOpenChange = (next: boolean) => {
    // Hydrate from stored consent each time the dialog opens (§11.2).
    if (next) {
      const existing = readConsent();
      setState({
        statistics: existing?.statistics ?? false,
        embedded: existing?.embedded ?? false,
      });
    }
    onOpenChange(next);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-slate/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,32rem)] -translate-x-1/2 -translate-y-1/2 rounded-card-lg bg-white p-6 shadow-xl">
          <VisuallyHidden>
            <Dialog.Title>{labels.title}</Dialog.Title>
          </VisuallyHidden>
          <p className="text-[0.9375rem] text-slate/80">{labels.intro}</p>
          <div className="mt-5 flex flex-col gap-4 text-[0.9375rem]">
            <label className="flex items-start justify-between gap-4 font-bold">
              <span>
                {labels.necessaryLabel}
                <span className="block pb-1 font-normal text-slate/70">{labels.necessaryDesc}</span>
              </span>
              <input
                type="checkbox"
                checked
                disabled
                className="mt-1 h-5 w-5 accent-petrol-deep"
                aria-label={labels.necessaryLabel}
              />
            </label>
            <label className="flex items-start justify-between gap-4 font-bold">
              <span>{labels.statisticsLabel}</span>
              <input
                type="checkbox"
                checked={state.statistics}
                onChange={(e) => setState((s) => ({ ...s, statistics: e.target.checked }))}
                className="mt-1 h-5 w-5 accent-petrol-deep"
              />
            </label>
            <label className="flex items-start justify-between gap-4 font-bold">
              <span>{labels.embeddedLabel}</span>
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
              onOpenChange(false);
            }}
            className="mt-6 min-h-11 w-full rounded-pill bg-petrol-deep px-5 font-semibold text-white hover:bg-slate"
          >
            {labels.saveLabel}
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
