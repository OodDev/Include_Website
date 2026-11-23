"use client";

import { useState } from "react";
import { TIPO_INFO, numeroRichiesta, type Richiesta } from "@/lib/model";
import { pageLabel } from "@/lib/pages";
import { IconCrop, IconImage, IconPencil, IconTrash } from "./Icons";

interface RequestListProps {
  richieste: Richiesta[];
  editingId: string | null;
  onEdit: (request: Richiesta) => void;
  onDelete: (id: string) => void;
}

const PRIORITY_STYLES: Record<Richiesta["priorita"], string> = {
  P1: "bg-rust text-white",
  P2: "bg-petrol-deep text-white",
  P3: "bg-mist text-slate",
};

export function RequestList({ richieste, editingId, onEdit, onDelete }: RequestListProps) {
  const [confirming, setConfirming] = useState<string | null>(null);

  return (
    <section aria-labelledby="richieste-title" className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="richieste-title" className="u-label text-petrol-deep">
          Le vostre richieste
        </h2>
        <span className="text-[11px] text-slate/80">
          {richieste.length === 0
            ? "Ancora nessuna"
            : `${richieste.length} ${richieste.length === 1 ? "blocco" : "blocchi"}`}
        </span>
      </div>

      {richieste.length === 0 ? (
        <div className="rounded-card-lg border border-dashed border-slate/20 bg-white/60 px-5 py-8 text-center">
          <p className="text-sm font-semibold text-slate/80">La lista è vuota</p>
          <p className="mx-auto mt-1 max-w-xs text-[0.8125rem] leading-relaxed text-slate/80">
            Scegliete una pagina e indicate il primo punto da cambiare: ogni modifica diventa un
            blocco numerato.
          </p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {richieste.map((request, index) => {
            const excerpt = request.tipo === "testo" ? request.testoNuovo : request.richiesta;
            const editing = editingId === request.id;
            return (
              <li
                key={request.id}
                className={`animate-rise rounded-card border bg-white p-3.5 shadow-card transition ${
                  editing ? "border-petrol-deep ring-2 ring-petrol-deep/25" : "border-transparent"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="u-label text-petrol-deep">Camb {numeroRichiesta(index)}</span>
                  <div className="flex items-center gap-1">
                    <span className={`chip ${PRIORITY_STYLES[request.priorita]}`}>
                      {request.priorita}
                    </span>
                    <span className="chip bg-mist text-slate/80">{TIPO_INFO[request.tipo].label}</span>
                    {request.stato === "bozza" ? (
                      <span className="chip border border-ochre/50 text-slate/80">bozza</span>
                    ) : null}
                  </div>
                </div>

                <p className="mt-2 text-[0.9375rem] font-semibold leading-snug">{request.sezione}</p>
                <p className="text-[11px] text-slate/80">
                  {pageLabel(request.pagina)} · /en{request.pagina === "/" ? "" : request.pagina}
                </p>

                {excerpt ? (
                  <p className="mt-1.5 line-clamp-2 text-[0.8125rem] leading-relaxed text-slate/80">
                    {excerpt}
                  </p>
                ) : null}

                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2 text-[10.5px] text-slate/80">
                    {request.allegati.length > 0 ? (
                      <span className="inline-flex items-center gap-1">
                        <IconImage className="h-3.5 w-3.5" />
                        {request.allegati.length}
                      </span>
                    ) : null}
                    {request.box ? (
                      <span className="inline-flex items-center gap-1">
                        <IconCrop className="h-3.5 w-3.5" />
                        area indicata
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      className="btn btn-quiet p-1.5"
                      onClick={() => onEdit(request)}
                      aria-label={`Modifica Camb ${numeroRichiesta(index)}`}
                    >
                      <IconPencil className="h-4 w-4" />
                    </button>
                    {confirming === request.id ? (
                      <span className="flex items-center gap-0.5">
                        <button
                          type="button"
                          className="rounded-pill bg-red px-2 py-1 text-[10.5px] font-semibold text-white"
                          onClick={() => {
                            onDelete(request.id);
                            setConfirming(null);
                          }}
                        >
                          Elimina
                        </button>
                        <button
                          type="button"
                          className="btn btn-quiet px-1.5 py-1 text-[10.5px]"
                          onClick={() => setConfirming(null)}
                        >
                          No
                        </button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-quiet p-1.5 text-slate/80 hover:text-red"
                        onClick={() => setConfirming(request.id)}
                        aria-label={`Elimina Camb ${numeroRichiesta(index)}`}
                      >
                        <IconTrash className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
