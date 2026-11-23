"use client";

import {
  PRIORITA,
  PRIORITA_INFO,
  STATI,
  STATO_INFO,
  TIPI,
  TIPO_INFO,
  type Draft,
  type Stato,
  type Tipo,
} from "@/lib/model";
import { Attachments } from "./Attachments";
import { IconArrowLeft, IconArrowRight, IconCheck } from "./Icons";

interface RequestFormProps {
  draft: Draft;
  problems: string[];
  editing: boolean;
  onChange: (patch: Partial<Draft>) => void;
  onAttachmentAdd: (files: File[]) => void;
  onAttachmentRemove: (id: string) => void;
  onAttachmentStato: (id: string, stato: Stato) => void;
  onSubmit: () => void;
  onBack: () => void;
  onCancelEdit: () => void;
}

export function RequestForm({
  draft,
  problems,
  editing,
  onChange,
  onAttachmentAdd,
  onAttachmentRemove,
  onAttachmentStato,
  onSubmit,
  onBack,
  onCancelEdit,
}: RequestFormProps) {
  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div>
        <label className="field-label" htmlFor="sezione">
          Sezione della pagina
        </label>
        <input
          id="sezione"
          className="field"
          value={draft.sezione}
          onChange={(event) => onChange({ sezione: event.target.value })}
          placeholder="Es. Hero, riquadri statistiche, footer…"
        />
        <p className="hint mt-1">
          Si compila da sola quando scegliete un punto sull&apos;anteprima. Se preferite, correggetela.
        </p>
      </div>

      <fieldset>
        <legend className="field-label">Tipo di modifica</legend>
        <div className="flex flex-wrap gap-1.5">
          {TIPI.map((tipo: Tipo) => (
            <button
              key={tipo}
              type="button"
              aria-pressed={draft.tipo === tipo}
              onClick={() => onChange({ tipo })}
              className={`rounded-pill border px-3 py-1.5 text-[0.8125rem] font-semibold transition ${
                draft.tipo === tipo
                  ? "border-petrol-deep bg-petrol-deep text-white"
                  : "border-slate/20 bg-white text-slate/80 hover:border-petrol-deep hover:text-petrol-deep"
              }`}
            >
              {TIPO_INFO[tipo].label}
            </button>
          ))}
        </div>
        <p className="hint mt-1.5">{TIPO_INFO[draft.tipo].hint}</p>
      </fieldset>

      {draft.tipo === "testo" ? (
        <>
          <div>
            <label className="field-label" htmlFor="testoAttuale">
              Testo attuale
            </label>
            <textarea
              id="testoAttuale"
              className="field min-h-[86px] resize-y"
              value={draft.testoAttuale}
              onChange={(event) => onChange({ testoAttuale: event.target.value })}
              placeholder="Copiate il testo esattamente come appare sul sito"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="testoNuovo">
              Testo nuovo
            </label>
            <textarea
              id="testoNuovo"
              className="field min-h-[110px] resize-y"
              value={draft.testoNuovo}
              onChange={(event) => onChange({ testoNuovo: event.target.value })}
              placeholder="Scrivete il testo completo come deve apparire, non solo la parte che cambia"
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="field-label" htmlFor="richiesta">
              {labelFor(draft.tipo)}
            </label>
            <textarea
              id="richiesta"
              className="field min-h-[110px] resize-y"
              value={draft.richiesta}
              onChange={(event) => onChange({ richiesta: event.target.value })}
              placeholder={placeholderFor(draft.tipo)}
            />
          </div>

          {draft.tipo === "visuale" ? (
            <div>
              <label className="field-label" htmlFor="valori">
                Valori (facoltativo, ma utile)
              </label>
              <input
                id="valori"
                className="field"
                value={draft.valori}
                onChange={(event) => onChange({ valori: event.target.value })}
                placeholder="Es. spazio tra i riquadri: da 32px a 40px"
              />
            </div>
          ) : null}

          {draft.tipo === "nuovo-contenuto" ? (
            <div>
              <label className="field-label" htmlFor="posizione">
                Dove va inserito
              </label>
              <input
                id="posizione"
                className="field"
                value={draft.posizione}
                onChange={(event) => onChange({ posizione: event.target.value })}
                placeholder="Es. sotto il modulo, centrato"
              />
            </div>
          ) : null}
        </>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <fieldset>
          <legend className="field-label">Priorità</legend>
          <div className="grid grid-cols-3 gap-1.5">
            {PRIORITA.map((priorita) => (
              <button
                key={priorita}
                type="button"
                aria-pressed={draft.priorita === priorita}
                onClick={() => onChange({ priorita })}
                className={`rounded-input border px-1 py-1.5 text-center transition ${
                  draft.priorita === priorita
                    ? "border-rust bg-rust text-white"
                    : "border-slate/20 bg-white text-slate/80 hover:border-rust hover:text-rust"
                }`}
              >
                <span className="block text-[0.8125rem] font-bold">{priorita}</span>
                <span className="block text-[9.5px] leading-tight opacity-80">
                  {PRIORITA_INFO[priorita].hint}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="field-label">Stato</legend>
          <div className="grid grid-cols-2 gap-1.5">
            {STATI.map((stato) => (
              <button
                key={stato}
                type="button"
                aria-pressed={draft.stato === stato}
                onClick={() => onChange({ stato })}
                className={`rounded-input border px-1 py-1.5 text-center transition ${
                  draft.stato === stato
                    ? "border-petrol-deep bg-petrol-deep text-white"
                    : "border-slate/20 bg-white text-slate/80 hover:border-petrol-deep hover:text-petrol-deep"
                }`}
              >
                <span className="block text-[0.8125rem] font-semibold">{STATO_INFO[stato].label}</span>
                <span className="block text-[9.5px] leading-tight opacity-80">
                  {STATO_INFO[stato].hint}
                </span>
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div>
        <label className="field-label" htmlFor="note">
          Note (facoltativo)
        </label>
        <textarea
          id="note"
          className="field min-h-[64px] resize-y"
          value={draft.note}
          onChange={(event) => onChange({ note: event.target.value })}
          placeholder="Riferimenti, dubbi, cose da sapere…"
        />
      </div>

      <Attachments
        allegati={draft.allegati}
        onAdd={onAttachmentAdd}
        onRemove={onAttachmentRemove}
        onStato={onAttachmentStato}
      />

      {problems.length > 0 ? (
        <div
          role="alert"
          className="rounded-card border border-red/25 bg-red/5 px-3 py-2.5 text-[0.8125rem] text-red"
        >
          <ul className="space-y-0.5">
            {problems.map((problem) => (
              <li key={problem}>· {problem}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-mist pt-4">
        <div className="flex gap-1">
          <button type="button" className="btn btn-quiet" onClick={onBack}>
            <IconArrowLeft className="h-4 w-4" />
            Indietro
          </button>
          {editing ? (
            <button type="button" className="btn btn-quiet" onClick={onCancelEdit}>
              Annulla modifica
            </button>
          ) : null}
        </div>
        <button type="submit" className="btn btn-primary">
          <IconCheck className="h-4 w-4" />
          {editing ? "Salva modifiche" : "Aggiungi richiesta"}
          <IconArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}

function labelFor(tipo: Tipo): string {
  switch (tipo) {
    case "visuale":
      return "Cosa va cambiato";
    case "nuovo-contenuto":
      return "Cosa inserire";
    case "rimozione":
      return "Cosa rimuovere";
    case "sostituzione":
      return "Elemento attuale da sostituire";
    default:
      return "Richiesta";
  }
}

function placeholderFor(tipo: Tipo): string {
  switch (tipo) {
    case "visuale":
      return "Es. aumentare lo spazio tra i riquadri di statistica";
    case "nuovo-contenuto":
      return "Es. il logo del partner, con il nome dell’ente";
    case "rimozione":
      return "Es. la riga con la descrizione breve nella scheda del partner";
    case "sostituzione":
      return "Es. la foto del gruppo in aula nella sezione “Il modello”";
    default:
      return "";
  }
}
