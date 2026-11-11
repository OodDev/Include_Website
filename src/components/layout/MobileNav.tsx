"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n";
import { Icon } from "@/components/brand/Icon";
import { cn } from "@/lib/utils/cn";

export type NavItem = { route: string; label: string; ariaCurrent?: boolean };

/**
 * MobileNav — Radix Dialog; keyboard-operable, dismissible with Escape,
 * traps and returns focus (§6.1). Slide 250 ms (reduced-motion aware).
 */
export function MobileNav({ items, pill }: { items: NavItem[]; pill: NavItem }) {
  const t = useTranslations("header");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // Header hairline when scrolled (§8 feedback, shared with desktop)
  useEffect(() => {
    const onScroll = () => {
      document.documentElement.dataset.scrolled = window.scrollY > 8 ? "true" : "false";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        ref={triggerRef}
        aria-label={t("openMenu")}
        className="inline-flex min-h-11 items-center gap-2 rounded-pill border-2 border-slate px-4 font-bold md:hidden"
      >
        <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true">
          <path d="M1 1h16M1 7h16M1 13h16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
        {t("menu")}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-slate/40" />
        <Dialog.Content className="fixed inset-x-3 top-3 z-50 rounded-card-lg bg-white p-6 shadow-xl">
          <VisuallyHidden>
            <Dialog.Title>{t("menu")}</Dialog.Title>
          </VisuallyHidden>
          <nav aria-label={t("nav")}>
            <ul className="flex flex-col gap-1">
              <li>
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  aria-current={pathname === "/" ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-input px-4 py-3 text-[1.0625rem] font-bold hover:bg-paper motion-safe",
                    pathname === "/" && "text-rust",
                  )}
                >
                  <Icon name="home" size={22} />
                  {t("home")}
                </Link>
              </li>
              {items.map((it) => (
                <li key={it.route}>
                  <Link
                    href={`/${it.route}`}
                    onClick={() => setOpen(false)}
                    aria-current={pathname === it.route ? "page" : undefined}
                    className={cn(
                      "block rounded-input px-4 py-3 text-[1.0625rem] font-bold hover:bg-paper motion-safe",
                      pathname === it.route && "text-rust",
                    )}
                  >
                    {it.label}
                  </Link>
                </li>
              ))}
              <li className="mt-3">
                <Link
                  href={`/${pill.route}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-pill bg-petrol-deep px-5 py-3 text-center font-semibold text-white hover:bg-slate motion-safe"
                >
                  {pill.label}
                </Link>
              </li>
            </ul>
          </nav>
          <Dialog.Close asChild>
            <button
              aria-label={t("closeMenu")}
              className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full text-slate hover:bg-paper"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
