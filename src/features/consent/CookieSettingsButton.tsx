"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ConsentDialog } from "@/features/consent/ConsentDialog";

/** Footer "Cookie settings" control (§6.11/§11.2). */
export function CookieSettingsButton({
  tone = "onDark",
}: {
  /** Ground it sits on: dark grounds get light text, light grounds slate. */
  tone?: "onDark" | "onLight";
}) {
  const t = useTranslations("consent");
  const [open, setOpen] = useState(false);

  // Openable from anywhere via the consent event bus (e.g. future gated embeds).
  useEffect(() => {
    const request = () => setOpen(true);
    window.addEventListener("include:consent-settings", request);
    return () => window.removeEventListener("include:consent-settings", request);
  }, []);

  return (
    <>
      <button
        type="button"
        className={
          tone === "onLight"
            ? "text-slate/80 underline underline-offset-4 hover:text-slate"
            : "text-white/75 underline underline-offset-4 hover:text-white"
        }
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        {t("settingsTitle")}
      </button>
      <ConsentDialog
        open={open}
        onOpenChange={setOpen}
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
