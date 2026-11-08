import { getTranslations } from "next-intl/server";
import { Icon } from "@/components/brand/Icon";

/** FactsStrip (§6.2): programme · duration · countries · partners — from approved facts. */
export async function HomeFactsStrip() {
  const t = await getTranslations("home.facts");
  const facts = [
    { label: t("programme"), icon: "events" as const },
    { label: t("duration"), icon: "pathway" as const },
    { label: t("countries"), icon: "labour-market" as const },
    { label: t("partners"), icon: "participation" as const },
  ];
  return (
    <dl className="grid grid-cols-2 gap-4 rounded-card bg-paper p-4 md:grid-cols-4 md:gap-8 md:p-6">
      {facts.map((f) => (
        <div key={f.label} className="flex items-center gap-3">
          <Icon name={f.icon} size={36} />
          <dt className="text-[0.8125rem] font-bold leading-snug">{f.label}</dt>
        </div>
      ))}
    </dl>
  );
}
