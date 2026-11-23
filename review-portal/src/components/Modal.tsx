"use client";

import { useEffect, useRef } from "react";
import { IconX } from "./Icons";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: "md" | "lg";
}

export function Modal({ open, title, onClose, children, footer, width = "md" }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate/55 p-3 backdrop-blur-[2px] sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`animate-rise w-full ${width === "lg" ? "max-w-3xl" : "max-w-lg"} max-h-[90vh] overflow-hidden rounded-card-lg bg-white shadow-lift outline-none`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-mist px-5 py-4">
          <h2 className="text-h3 font-semibold">{title}</h2>
          <button type="button" className="btn btn-quiet -mr-2 -mt-1 p-2" onClick={onClose} aria-label="Chiudi">
            <IconX className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[62vh] overflow-y-auto px-5 py-5">{children}</div>
        {footer ? <div className="flex flex-wrap justify-end gap-2 border-t border-mist px-5 py-4">{footer}</div> : null}
      </div>
    </div>
  );
}
