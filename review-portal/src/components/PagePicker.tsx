"use client";

import { PAGES, captureFor, type PageInfo } from "@/lib/pages";
import { IconArrowRight } from "./Icons";

interface PagePickerProps {
  current: string | null;
  onChoose: (page: PageInfo) => void;
}

const GROUPS: { key: PageInfo["group"]; title: string; hint: string }[] = [
  { key: "pagine", title: "Pagine del sito", hint: "Le pagine principali" },
  { key: "legali", title: "Pagine legali", hint: "Testi legali e accessibilità" },
];

function initials(label: string): string {
  const words = label.split(/\s+/).filter(Boolean);
  return (words[0]?.[0] ?? "?") + (words[1]?.[0] ?? "");
}

export function PagePicker({ current, onChoose }: PagePickerProps) {
  return (
    <div className="space-y-6">
      <p className="text-[0.95rem] leading-relaxed text-slate/80">
        Scegliete la pagina che contiene il punto da cambiare. Potete tornare qui per ogni nuova
        richiesta: non c&apos;è un limite al numero di modifiche.
      </p>

      {GROUPS.map((group) => {
        const pages = PAGES.filter((page) => page.group === group.key);
        if (pages.length === 0) return null;
        return (
          <section key={group.key} aria-labelledby={`group-${group.key}`}>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <h3 id={`group-${group.key}`} className="u-label text-petrol-deep">
                {group.title}
              </h3>
              <span className="text-[11px] text-slate/80">{group.hint}</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {pages.map((page) => {
                const capture = captureFor(page.path, "desktop");
                const active = current === page.path;
                return (
                  <button
                    key={page.slug}
                    type="button"
                    onClick={() => onChoose(page)}
                    aria-pressed={active}
                    aria-label={page.label}
                    className={`group flex flex-col overflow-hidden rounded-card border bg-white p-1.5 text-left transition hover:-translate-y-0.5 hover:shadow-lift ${
                      active ? "border-petrol-deep ring-2 ring-petrol-deep/30" : "border-mist"
                    }`}
                  >
                    <span className="relative block h-[74px] overflow-hidden rounded-[11px] bg-mist">
                      {capture ? (
                        // eslint-disable-next-line @next/next/no-img-element -- static capture
                        <img
                          src={capture.thumb ?? capture.file}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover object-top"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#e2e9ed,#f7f9fa)]">
                          <span className="text-sm font-semibold text-slate/35">
                            {initials(page.label)}
                          </span>
                        </span>
                      )}
                      <span className="absolute inset-x-1 bottom-1 truncate rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-semibold text-slate/80">
                        /en{page.path === "/" ? "" : page.path}
                      </span>
                    </span>
                    <span className="flex items-center justify-between gap-1 px-1 pb-0.5 pt-1.5">
                      <span className="truncate text-[0.8125rem] font-semibold">{page.label}</span>
                      <IconArrowRight className="h-3.5 w-3.5 shrink-0 text-slate/25 transition group-hover:translate-x-0.5 group-hover:text-rust" />
                    </span>
                    <span className="line-clamp-1 px-1 pb-1 text-[10.5px] leading-tight text-slate/80">
                      {page.note}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
