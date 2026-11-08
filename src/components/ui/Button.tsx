import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export const buttonVariants = cva(
  // Pills per §5.3; uniform transition ≈150–200ms colour/transform (§8)
  "inline-flex items-center justify-center gap-2 rounded-pill px-6 font-bold motion-safe " +
    "transition-colors duration-150 focus-visible:outline-offset-4 " +
    "disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-slate text-white hover:bg-burgundy",
        accent: "bg-rust text-white hover:bg-burgundy",
        outline: "border-2 border-slate text-slate bg-white hover:bg-paper",
        outlineLight: "border-2 border-white text-white bg-transparent hover:bg-white/10",
        ghost: "text-petrol-deep hover:text-burgundy underline-offset-4 hover:underline",
      },
      size: {
        sm: "min-h-9 px-4 text-[0.9375rem]",
        md: "min-h-12 text-body",
        lg: "min-h-12 px-7 text-[1.1875rem]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonOwnProps = VariantProps<typeof buttonVariants> & {
  children: ReactNode;
  className?: string;
};

/** Buttons for actions, links for navigation (§5.10). */
export function Button({ className, variant, size, children, ...rest }: ButtonOwnProps & ComponentProps<"button">) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  className,
  variant,
  size,
  children,
  ...rest
}: ButtonOwnProps & ComponentProps<typeof Link>) {
  return (
    <Link className={cn(buttonVariants({ variant, size }), className)} {...rest}>
      {children}
    </Link>
  );
}
