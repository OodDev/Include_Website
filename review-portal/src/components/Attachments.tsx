"use client";

import { useEffect, useRef, useState } from "react";
import type { Allegato, Stato } from "@/lib/model";
import { getAttachmentFile } from "@/lib/storage";
import { IconImage, IconTrash, IconUpload } from "./Icons";

interface AttachmentsProps {
  allegati: Allegato[];
  onAdd: (files: File[]) => void;
  onRemove: (id: string) => void;
  onStato: (id: string, stato: Stato) => void;
}

function formatBytes(n: number): string {
  if (!n) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function Thumb({ id, nome }: { id: string; nome: string }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;
    getAttachmentFile(id).then((blob) => {
      if (!blob || cancelled) return;
      if (!blob.type.startsWith("image/") || blob.type === "image/svg+xml") return;
      objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
    });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id]);

  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-[9px] bg-paper text-slate/40">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element -- local blob preview
        <img src={url} alt={`Anteprima di ${nome}`} className="h-full w-full object-cover" />
      ) : (
        <IconImage className="h-5 w-5" />
      )}
    </span>
  );
}

export function Attachments({ allegati, onAdd, onRemove, onStato }: AttachmentsProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const files = Array.from(event.dataTransfer.files);
          if (files.length) onAdd(files);
        }}
        className={`rounded-card border border-dashed transition ${
          dragging ? "border-rust bg-rust/5" : "border-slate/25 bg-paper/50 hover:border-petrol-deep"
        }`}
      >
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center gap-3 rounded-card px-3 py-3 text-left"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-petrol-deep shadow-sm">
            <IconUpload className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-[0.8125rem] font-semibold">Aggiungete immagini o file</span>
            <span className="block text-[11px] leading-snug text-slate/80">
              Trascinate qui oppure cliccate · SVG, PNG, JPG o PDF · max 20 MB
            </span>
          </span>
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,.svg,application/pdf"
          aria-label="Aggiungi immagini o file"
          tabIndex={-1}
          className="sr-only"
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            if (files.length) onAdd(files);
            event.target.value = "";
          }}
        />
      </div>

      {allegati.length > 0 ? (
        <ul className="space-y-1.5">
          {allegati.map((allegato) => (
            <li
              key={allegato.id}
              className="flex items-center gap-2.5 rounded-card border border-mist bg-white p-1.5 pr-2"
            >
              <Thumb id={allegato.id} nome={allegato.nome} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.8125rem] font-semibold">{allegato.nome}</p>
                <p className="text-[10.5px] text-slate/80">
                  {formatBytes(allegato.dimensione) || "file"}
                  {allegato.tipo ? ` · ${allegato.tipo.replace("image/", "").toUpperCase()}` : ""}
                </p>
              </div>
              <div className="inline-flex shrink-0 rounded-pill bg-mist p-0.5" role="group" aria-label="Stato del file">
                {(["definitivo", "bozza"] as Stato[]).map((stato) => (
                  <button
                    key={stato}
                    type="button"
                    onClick={() => onStato(allegato.id, stato)}
                    aria-pressed={allegato.stato === stato}
                    className={`rounded-pill px-2 py-0.5 text-[10px] font-semibold capitalize transition ${
                      allegato.stato === stato ? "bg-white text-slate shadow-sm" : "text-slate/80"
                    }`}
                  >
                    {stato}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-quiet shrink-0 p-1.5 text-slate/80 hover:text-red"
                onClick={() => onRemove(allegato.id)}
                aria-label={`Rimuovi ${allegato.nome}`}
              >
                <IconTrash className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
