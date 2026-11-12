import { getTranslations } from "next-intl/server";
import { Icon } from "@/components/brand/Icon";

/** FactsStrip (§6.2): programme · duration · countries · partners — from approved facts.
 *  Petrolio direction (D17/D18): mockup .v3-stat spec — white cards, 18px
 *  radius, 26/28px padding, petrol-cast shadow, straddling the hero seam. */
export async function HomeFactsStrip() {
  const t = await getTranslations("home.facts");
  const facts = [
    { value: t("programme"), icon: "events" as const },
    { value: t("duration"), icon: "pathway" as const },
    { value: t("countries"), icon: "labour-market" as const },
    { value: t("partners"), icon: "participation" as const },
  ];
  return (
    <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
      {facts.map((f) => (
        <div
          key={f.value}
          className="flex flex-col items-center justify-center rounded-[18px] bg-white px-6 py-8 text-center shadow-[0_18px_40px_rgba(8,118,124,0.18)]"
        >
          <Icon name={f.icon} size={28} />
          <dt className="mt-2.5 text-[1.25rem] leading-[1.15] font-semibold tracking-[-0.01em] text-slate">
            {f.value}
          </dt>
        </div>
      ))}
    </dl>
  );
}
