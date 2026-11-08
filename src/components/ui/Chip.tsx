import { Icon } from "@/components/brand/Icon";
import { cn } from "@/lib/utils/cn";

/**
 * StatusChip — planned | in-progress | published (§6.5):
 * text + icon, never colour alone (WCAG 1.4.1).
 */
const statusMeta = {
  planned: { icon: "events", dotClass: "bg-sky" },
  "in-progress": { icon: "reciprocity", dotClass: "bg-petrol" },
  published: { icon: "recognition", dotClass: "bg-rust" },
} as const;

export type ResourceStatus = keyof typeof statusMeta;

export function StatusChip({ status, children, className }: { status: ResourceStatus; children: string; className?: string }) {
  const meta = statusMeta[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-pill border border-slate/15 bg-paper px-3 py-1 text-[0.8125rem] font-bold",
        className,
      )}
    >
      <span aria-hidden="true" className={cn("h-2.5 w-2.5 shrink-0 rounded-full", meta.dotClass)} />
      {children}
    </span>
  );
}

export function PillDot({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("inline-block h-2.5 w-2.5 rounded-full bg-rust", className)} />;
}

export { Icon };
