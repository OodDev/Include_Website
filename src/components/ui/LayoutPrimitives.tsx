import { cn } from "@/lib/utils/cn";

export function Container({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "section" | "footer" | "header" | "nav" | "main";
}) {
  return (
    <Tag className={cn("mx-auto w-full max-w-[76rem] px-5 md:px-8", className)}>{children}</Tag>
  );
}

export function Section({
  className,
  children,
  id,
  tone = "white",
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
  /** Background rhythm (§5.3): white / paper / slate / petrol-deep */
  tone?: "white" | "paper" | "slate" | "petrol-deep";
}) {
  const toneClass =
    tone === "slate"
      ? "bg-slate text-white"
      : tone === "petrol-deep"
        ? "bg-petrol-deep text-white"
        : tone === "paper"
          ? "bg-paper text-slate"
          : "bg-white text-slate";
  return (
    <section id={id} className={cn("scroll-mt-24 py-16 md:py-24", toneClass, className)}>
      {children}
    </section>
  );
}

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-card border border-slate/15 bg-white p-6 md:p-7",
        className,
      )}
    >
      {children}
    </div>
  );
}
