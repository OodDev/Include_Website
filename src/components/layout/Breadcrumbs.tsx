import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n";
import { Container } from "@/components/ui/LayoutPrimitives";

export type Crumb = { label: string; route?: string };

/** Breadcrumbs on every page except Home (§6.1); scroll-mt via globals. */
export async function Breadcrumbs({ items }: { items: Crumb[] }) {
  const t = await getTranslations("breadcrumbs");
  return (
    <nav aria-label={t("youAreHere")} className="py-6">
      <ol className="flex flex-wrap items-center gap-2 text-[0.8125rem] text-slate/70">
        <li>
          <Link href="/" className="underline-offset-4 hover:underline">
            {t("home")}
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2" aria-current={item.route ? undefined : "page"}>
            <span aria-hidden="true" className="text-slate/40">/</span>
            {item.route ? (
              <Link href={item.route} className="underline-offset-4 hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-slate">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function BreadcrumbSection({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <div className={className}>
      <Container>
        <Breadcrumbs items={items} />
      </Container>
    </div>
  );
}
