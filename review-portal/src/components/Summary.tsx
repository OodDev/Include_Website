"use client";

import { useState } from "react";
import type { PortalState } from "@/lib/model";
import { IconEye, IconInfo, IconTrash } from "./Icons";

interface SummaryProps {
  state: PortalState;
  onMeta: (value: string) => void;
  onPreview: () => void;
  onReset: () => void;
}

export function Summary({ state, onMeta, onPreview, onReset }: SummaryProps) {
  const [confirming, setConfirming] = useState(false);
  const { richieste } = state;
  const pages = new Set(richieste.map((r) => r.pagina)).size;
  const allegati = richieste.reduce((sum, r) => sum + r.allegati.length, 0);
  const aree = richieste.filter((r) => r.box).length;
  const counts = {
    P1: richieste.filter((r) => r.priorita === "P1").length,
    P2: richieste.filter((r) => r.priorita === "P2").length,
    P3: richieste.filter((r) => r.priorita === "P3").length,
  };

  return (
    <section aria-labelledby="riepilogo-title" className="card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 id="riepilogo-title" className="u-label text-petrol-deep">
          Riepilogo
        </h2>
        <span className="text-[11px] font-semibold text-slate/80">
          {richieste.length} {richieste.length === 1 ? "richiesta" : "richieste"}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1.5" aria-label="Priorità">
        {(["P1", "P2", "P3"] as const).map((priority) => (
          <div
            key={priority}
            className={`rounded-input px-2 py-2 text-center ${
              priority === "P1"
                ? "bg-rust/10 text-rust"
                : priority === "P2"
                  ? "bg-petrol/10 text-petrol-deep"
                  : "bg-mist text-slate/80"
            }`}
          >
            <p className="text-lg font-semibold leading-none">{counts[priority]}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-label">{priority}</p>
          </div>
        ))}
      </div>

      <dl className="mt-4 space-y-1.5 text-[0.8125rem]">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-slate/80">Pagine coinvolte</dt>
          <dd className="font-semibold">{pages}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-slate/80">Immagini e file</dt>
          <dd className="font-semibold">{allegati}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-slate/80">Aree indicate</dt>
          <dd className="font-semibold">{aree}</dd>
        </div>
      </dl>

      <div className="mt-4">
        <label className="field-label" htmlFor="compilatoDa">
          Chi compila
        </label>
        <input
          id="compilatoDa"
          className="field"
          value={state.meta.compilatoDa}
          onChange={(event) => onMeta(event.target.value)}
          placeholder="Nome e ente (facoltativo)"
          autoComplete="name"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-outline flex-1 gap-1.5 text-[0.8125rem]"
          onClick={onPreview}
          disabled={richieste.length === 0}
        >
          <IconEye className="h-4 w-4" />
          Anteprima .md
        </button>
        {confirming ? (
          <span className="flex items-center gap-1">
            <button
              type="button"
              className="btn btn-primary px-3 py-1.5 text-[0.75rem]"
              onClick={() => {
                onReset();
                setConfirming(false);
              }}
            >
              Confermo
            </button>
            <button
              type="button"
              className="btn btn-quiet px-2 py-1.5 text-[0.75rem]"
              onClick={() => setConfirming(false)}
            >
              No
            </button>
          </span>
        ) : (
          <button
            type="button"
            className="btn btn-quiet gap-1 text-[0.75rem] text-slate/80 hover:text-red"
            onClick={() => setConfirming(true)}
            disabled={richieste.length === 0}
          >
            <IconTrash className="h-3.5 w-3.5" />
            Azzera
          </button>
        )}
      </div>

      <p className="mt-3 flex gap-2 text-[11px] leading-snug text-slate/80">
        <IconInfo className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>
          Le richieste e i file restano su questo computer finché non esportate lo ZIP. Nessun dato
          viene inviato a un server.
        </span>
      </p>
    </section>
  );
}
