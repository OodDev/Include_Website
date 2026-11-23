"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  applyDraft,
  buildRequest,
  draftFromRequest,
  emptyDraft,
  emptyState,
  numeroRichiesta,
  validateDraft,
  type Allegato,
  type Box,
  type Draft,
  type PortalState,
  type Richiesta,
  type Stato,
} from "@/lib/model";
import { CAPTURES, captureFor, findPage, liveUrl, type Hotspot } from "@/lib/pages";
import { buildMarkdown } from "@/lib/markdown";
import { downloadBlob, exportFileName, exportWorkspace, importArchive } from "@/lib/export";
import {
  deleteAttachmentFile,
  loadWorkspace,
  putAttachmentFile,
  saveWorkspace,
  storageAvailableAsync,
} from "@/lib/storage";
import { PagePicker } from "./PagePicker";
import { CaptureViewer } from "./CaptureViewer";
import { RequestForm } from "./RequestForm";
import { RequestList } from "./RequestList";
import { Summary } from "./Summary";
import { Modal } from "./Modal";
import {
  IconCheck,
  IconDownload,
  IconExternal,
  IconInfo,
  IconUpload,
  IconX,
} from "./Icons";

const MAX_FILE_BYTES = 20 * 1024 * 1024;
const MAX_TOTAL_BYTES = 80 * 1024 * 1024;

type Step = 1 | 2 | 3;
type Toast = { message: string; tone: "ok" | "warn" };

interface PendingImport {
  name: string;
  state: PortalState;
  files: Map<string, Blob>;
  warnings: string[];
}

const STEPS: { n: Step; label: string }[] = [
  { n: 1, label: "Pagina" },
  { n: 2, label: "Punto" },
  { n: 3, label: "Dettagli" },
];

export function App() {
  const [state, setState] = useState<PortalState>(emptyState);
  const [draft, setDraft] = useState<Draft>(() => emptyDraft());
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [problems, setProblems] = useState<string[]>([]);
  const [toast, setToast] = useState<Toast | null>(null);
  const [save, setSave] = useState<{ status: "idle" | "saving" | "saved" | "error"; at: Date | null }>({
    status: "idle",
    at: null,
  });
  const [pendingImport, setPendingImport] = useState<PendingImport | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [noStorage, setNoStorage] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    loadWorkspace().then(async (workspace) => {
      if (cancelled) return;
      if (workspace) {
        setState(workspace.state);
        if (workspace.draft) {
          setDraft(workspace.draft);
          if (workspace.draft.pagina && workspace.draft.sezione) setStep(3);
          else if (workspace.draft.pagina) setStep(2);
        }
      }
      setHydrated(true);
      const available = await storageAvailableAsync();
      if (!cancelled && !available) setNoStorage(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const timer = window.setTimeout(() => {
      setSave({ status: "saving", at: null });
      saveWorkspace({ state, draft })
        .then(() => setSave({ status: "saved", at: new Date() }))
        .catch(() => setSave({ status: "error", at: null }));
    }, 450);
    return () => window.clearTimeout(timer);
  }, [state, draft, hydrated]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const page = useMemo(() => findPage(draft.pagina), [draft.pagina]);
  const capture = page ? captureFor(page.path, draft.device) : null;
  const preview = useMemo(() => buildMarkdown(state), [state]);
  const capturesDate = useMemo(() => {
    if (!CAPTURES.generatedAt) return null;
    return new Intl.DateTimeFormat("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Europe/Rome",
    }).format(new Date(CAPTURES.generatedAt));
  }, []);

  const resetDraft = useCallback(() => {
    setDraft(emptyDraft());
    setEditingId(null);
    setProblems([]);
    setStep(1);
  }, []);

  const choosePage = (path: string) => {
    setDraft((current) => ({
      ...current,
      pagina: path,
      sezione: "",
      hotspotId: "",
      box: null,
    }));
    setProblems([]);
    setStep(2);
  };

  const selectHotspot = (hotspot: Hotspot) => {
    setDraft((current) => ({
      ...current,
      sezione: hotspot.label,
      hotspotId: hotspot.id,
      box: hotspot.rect,
    }));
    setProblems([]);
    setStep(3);
  };

  const selectBox = (box: Box) => {
    setDraft((current) => ({
      ...current,
      box,
      hotspotId: "",
      sezione: current.sezione || "Area indicata",
    }));
  };

  const goTo = (target: Step) => {
    if (target === 2 && !draft.pagina) return;
    if (target === 3 && (!draft.pagina || !draft.sezione.trim())) return;
    setStep(target);
  };

  const addFiles = async (files: File[]) => {
    const currentTotal = draft.allegati.reduce((sum, a) => sum + a.dimensione, 0);
    let total = currentTotal;
    const accepted: File[] = [];

    for (const file of files) {
      const isImage = file.type.startsWith("image/");
      const isPdf = file.type === "application/pdf";
      const isSvg = file.name.toLowerCase().endsWith(".svg");
      if (!isImage && !isPdf && !isSvg) {
        setToast({ message: `Formato non supportato: ${file.name}`, tone: "warn" });
        continue;
      }
      if (file.size > MAX_FILE_BYTES) {
        setToast({ message: `File troppo grande (max 20 MB): ${file.name}`, tone: "warn" });
        continue;
      }
      if (total + file.size > MAX_TOTAL_BYTES) {
        setToast({ message: "Totale allegati oltre 80 MB: alleggerite i file.", tone: "warn" });
        break;
      }
      total += file.size;
      accepted.push(file);
    }

    const added: Allegato[] = [];
    for (const file of accepted) {
      const id = crypto.randomUUID();
      try {
        await putAttachmentFile(id, file);
        added.push({
          id,
          nome: file.name,
          tipo: file.type || (file.name.toLowerCase().endsWith(".svg") ? "image/svg+xml" : ""),
          dimensione: file.size,
          stato: "definitivo",
        });
      } catch {
        setToast({ message: "Non è stato possibile salvare il file nel browser.", tone: "warn" });
      }
    }
    if (added.length) setDraft((current) => ({ ...current, allegati: [...current.allegati, ...added] }));
  };

  const removeAttachment = async (id: string) => {
    const usedElsewhere = state.richieste.some((request) =>
      request.allegati.some((allegato) => allegato.id === id),
    );
    setDraft((current) => ({
      ...current,
      allegati: current.allegati.filter((allegato) => allegato.id !== id),
    }));
    if (!usedElsewhere) await deleteAttachmentFile(id);
  };

  const setAttachmentStato = (id: string, stato: Stato) => {
    setDraft((current) => ({
      ...current,
      allegati: current.allegati.map((allegato) =>
        allegato.id === id ? { ...allegato, stato } : allegato,
      ),
    }));
  };

  const submit = async () => {
    const issues = validateDraft(draft);    if (issues.length > 0) {
      setProblems(issues);
      return;
    }

    if (editingId) {
      const target = editingId;
      const previous = state.richieste.find((request) => request.id === target);
      setState((current) => ({
        ...current,
        richieste: current.richieste.map((request) =>
          request.id === target ? applyDraft(request, draft) : request,
        ),
      }));
      if (previous) {
        const kept = new Set(draft.allegati.map((allegato) => allegato.id));
        for (const allegato of previous.allegati) {
          if (!kept.has(allegato.id)) await deleteAttachmentFile(allegato.id);
        }
      }
      setToast({ message: "Richiesta aggiornata.", tone: "ok" });
    } else {
      const request = buildRequest(draft);
      setState((current) => ({ ...current, richieste: [...current.richieste, request] }));
      setToast({ message: "Richiesta aggiunta alla lista.", tone: "ok" });
    }

    resetDraft();
  };

  const editRequest = (request: Richiesta) => {
    setDraft(draftFromRequest(request));
    setEditingId(request.id);
    setProblems([]);
    setStep(3);
  };

  const deleteRequest = async (id: string) => {
    const request = state.richieste.find((item) => item.id === id);
    if (request) {
      for (const allegato of request.allegati) await deleteAttachmentFile(allegato.id);
    }
    setState((current) => ({
      ...current,
      richieste: current.richieste.filter((item) => item.id !== id),
    }));
    if (editingId === id) resetDraft();
    setToast({ message: "Richiesta eliminata.", tone: "ok" });
  };

  const handleExport = async () => {
    if (state.richieste.length === 0) return;
    setBusy(true);
    try {
      const { blob, warnings } = await exportWorkspace(state);
      downloadBlob(blob, exportFileName());
      setToast({
        message: warnings[0] ?? "ZIP creato: richieste, allegati e aree indicate.",
        tone: warnings.length ? "warn" : "ok",
      });
    } catch {
      setToast({ message: "Non è stato possibile creare lo ZIP.", tone: "warn" });
    } finally {
      setBusy(false);
    }
  };

  const handleImportFile = async (file: File) => {
    setBusy(true);
    try {
      const result = await importArchive(file);
      if (!result.state) {
        setToast({ message: result.warnings[0] ?? "File non riconosciuto.", tone: "warn" });
        return;
      }
      if (result.state.richieste.length === 0) {
        setToast({ message: "Il file non contiene richieste.", tone: "warn" });
        return;
      }
      setPendingImport({
        name: file.name,
        state: result.state,
        files: result.files,
        warnings: result.warnings,
      });
    } catch {
      setToast({ message: "Non è stato possibile leggere il file.", tone: "warn" });
    } finally {
      setBusy(false);
    }
  };

  const applyImport = async (mode: "merge" | "replace") => {
    if (!pendingImport) return;
    const incoming = pendingImport.state;
    const merges = mode === "merge";
    const idMap = new Map<string, string>();

    for (const [oldId, blob] of pendingImport.files) {
      const id = merges ? crypto.randomUUID() : oldId;
      try {
        await putAttachmentFile(id, blob);
        idMap.set(oldId, id);
      } catch {
        setToast({ message: "Alcuni allegati non sono stati salvati.", tone: "warn" });
      }
    }

    const prepared: PortalState = merges
      ? {
          ...incoming,
          richieste: incoming.richieste.map((request) => ({
            ...request,
            id: crypto.randomUUID(),
            allegati: request.allegati.map((allegato) => ({
              ...allegato,
              id: idMap.get(allegato.id) ?? allegato.id,
            })),
          })),
        }
      : incoming;

    setState((current) =>
      mode === "replace"
        ? {
            ...prepared,
            meta: { compilatoDa: prepared.meta.compilatoDa || current.meta.compilatoDa },
          }
        : { ...current, richieste: [...current.richieste, ...prepared.richieste] },
    );
    setPendingImport(null);
    setToast({
      message: mode === "replace" ? "Richieste importate." : "Richieste aggiunte alla lista.",
      tone: "ok",
    });
  };

  const handleReset = async () => {
    for (const request of state.richieste) {
      for (const allegato of request.allegati) await deleteAttachmentFile(allegato.id);
    }
    setState(emptyState());
    resetDraft();
    setToast({ message: "Tutto azzerato.", tone: "ok" });
  };

  const handleMeta = (value: string) => {
    setState((current) => ({ ...current, meta: { ...current.meta, compilatoDa: value } }));
  };

  return (
    <div className="min-h-screen">
      <header className="relative z-20 bg-petrol-deep text-white">
        <div className="mx-auto flex max-w-[1320px] items-center gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element -- static brand SVG */}
            <img src="/brand/include-logo-white.svg" alt="INCLUDE" className="h-6 w-auto sm:h-7" />
            <span aria-hidden className="hidden h-5 w-px bg-white/25 sm:block" />
            <span className="hidden truncate text-[10.5px] font-semibold uppercase tracking-label text-white sm:block">
              Centro richieste di modifica
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-1.5">
            <SaveBadge save={save} />
            <button
              type="button"
              onClick={() => importRef.current?.click()}
              aria-label="Importa un file di richieste"
              className="btn btn-quiet gap-1.5 px-2.5 py-2 text-[0.75rem] text-white hover:bg-white/10 hover:text-white"
            >
              <IconUpload className="h-4 w-4" />
              <span className="hidden sm:inline">Importa</span>
            </button>
            <input
              ref={importRef}
              type="file"
              accept=".zip,.md,application/zip,text/markdown"
              aria-label="File di richieste da importare"
              tabIndex={-1}
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void handleImportFile(file);
                event.target.value = "";
              }}
            />
            <button
              type="button"
              className="btn btn-primary gap-1.5 px-3.5 py-2 text-[0.8125rem]"
              onClick={handleExport}
              disabled={state.richieste.length === 0 || busy}
            >
              <IconDownload className="h-4 w-4" />
              Esporta
            </button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-petrol-deep pb-24 pt-4 text-white sm:pb-28">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full border border-white/10 sm:h-80 sm:w-80"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-6 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full border border-rust/50 sm:h-44 sm:w-44"
        />
        <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6">
          <p className="u-label text-white">Revisione del sito · Erasmus+</p>
          <h1 className="mt-2 max-w-3xl text-h1 font-semibold">
            Diteci cosa{" "}
            <span className="relative inline-block">
              <span className="relative z-10">cambiare</span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-[0.08em] z-0 h-[0.16em] rounded-full bg-rust"
              />
            </span>
            .
          </h1>
          <p className="mt-3 max-w-xl text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
            Scegliete la pagina, indicate il punto esatto e descrivete la modifica. Potete aggiungere
            quante richieste volete: le raccogliamo tutte in un unico file.
          </p>
          <ol className="mt-5 flex flex-wrap gap-2 text-[10.5px] font-semibold uppercase tracking-label text-white">
            {STEPS.map((item) => (
              <li key={item.n} className="inline-flex items-center gap-1.5 rounded-pill bg-white/10 px-2.5 py-1">
                <span className="grid h-4 w-4 place-items-center rounded-full bg-white/15 text-[9px]">
                  {item.n}
                </span>
                {item.label}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <main className="relative mx-auto -mt-16 max-w-[1320px] px-4 pb-14 sm:px-6">
        {noStorage ? (
          <div className="mb-3 flex gap-2 rounded-card border border-ochre/40 bg-white px-3 py-2 text-[12px] text-slate/80 shadow-card">
            <IconInfo className="mt-0.5 h-4 w-4 shrink-0 text-ochre" />
            <p>
              Questo browser non permette il salvataggio automatico. Esportate lo ZIP prima di
              chiudere la pagina, altrimenti le richieste vanno perse.
            </p>
          </div>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,1fr)]">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-mist px-4 py-3.5 sm:px-5">
              <div>
                <p className="u-label text-petrol-deep">
                  {editingId ? "Modifica richiesta" : "Nuova richiesta"}
                </p>
                <h2 className="mt-0.5 text-[1.05rem] font-semibold">
                  {step === 1
                    ? "Scegliete la pagina"
                    : step === 2
                      ? "Indicate il punto"
                      : "Descrivete la modifica"}
                </h2>
              </div>
              {editingId ? (
                <button type="button" className="btn btn-quiet text-[11px]" onClick={resetDraft}>
                  Nuova invece
                </button>
              ) : null}
            </div>

            <ol className="flex items-center gap-2 px-4 py-3 sm:px-5">
              {STEPS.map((item, index) => {
                const active = step === item.n;
                const done = step > item.n;
                const enabled =
                  item.n === 1 ||
                  (item.n === 2 && Boolean(draft.pagina)) ||
                  (item.n === 3 && Boolean(draft.pagina && draft.sezione.trim()));
                return (
                  <li key={item.n} className="flex min-w-0 flex-1 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => goTo(item.n)}
                      disabled={!enabled}
                      aria-current={active ? "step" : undefined}
                      className="flex min-w-0 items-center gap-2 disabled:cursor-not-allowed"
                    >
                      <span
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                          active
                            ? "bg-rust text-white"
                            : done
                              ? "bg-petrol-deep text-white"
                              : "bg-mist text-slate/80"
                        }`}
                      >
                        {done ? <IconCheck className="h-3.5 w-3.5" /> : item.n}
                      </span>
                      <span
                        className={`truncate text-[11px] font-semibold ${
                          active ? "text-slate" : "text-slate/80"
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                    {index < STEPS.length - 1 ? <span className="h-px flex-1 bg-mist" /> : null}
                  </li>
                );
              })}
            </ol>

            <div className="px-4 pb-5 sm:px-5">
              {step === 1 ? (
                <PagePicker current={draft.pagina || null} onChoose={(chosen) => choosePage(chosen.path)} />
              ) : null}

              {step === 2 && page ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="u-label text-petrol-deep">Pagina scelta</p>
                      <p className="text-[1.05rem] font-semibold">{page.label}</p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-quiet text-[11px] text-petrol-deep"
                      onClick={() => setStep(1)}
                    >
                      Cambia pagina
                    </button>
                  </div>

                  <CaptureViewer
                    page={page}
                    device={draft.device}
                    onDevice={(device) => setDraft((current) => ({ ...current, device }))}
                    capture={capture}
                    selectedHotspotId={draft.hotspotId}
                    box={draft.box}
                    onHotspot={selectHotspot}
                    onBox={selectBox}
                  />

                  {capture ? (
                    <div>
                      <label className="field-label" htmlFor="sezione-manuale-2">
                        Oppure scrivete voi il nome della sezione
                      </label>
                      <input
                        id="sezione-manuale-2"
                        className="field"
                        value={draft.hotspotId ? "" : draft.sezione}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            sezione: event.target.value,
                            hotspotId: "",
                          }))
                        }
                        placeholder="Es. Hero, fascia centrale, footer…"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="field-label" htmlFor="sezione-manuale">
                        Nome della sezione
                      </label>
                      <input
                        id="sezione-manuale"
                        className="field"
                        value={draft.sezione}
                        onChange={(event) =>
                          setDraft((current) => ({ ...current, sezione: event.target.value }))
                        }
                        placeholder="Es. Hero, fascia centrale, footer…"
                      />
                    </div>
                  )}

                  {draft.sezione && draft.box ? (
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-card bg-paper px-3 py-2">
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold">Sezione: {draft.sezione}</p>
                        <p className="text-[10.5px] text-slate/80">
                          Area indicata sull&apos;anteprima · {Math.round(draft.box.w * 100)}% ×{" "}
                          {Math.round(draft.box.h * 100)}% della pagina
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn btn-quiet inline-flex items-center gap-1 text-[11px]"
                        onClick={() =>
                          setDraft((current) => ({
                            ...current,
                            box: null,
                            hotspotId: "",
                            sezione: "",
                          }))
                        }
                      >
                        <IconX className="h-3.5 w-3.5" />
                        Rimuovi
                      </button>
                    </div>
                  ) : (
                    <p className="hint">
                      Cliccate la sezione che contiene il punto da cambiare, oppure usate
                      &ldquo;Seleziona un&rsquo;area&rdquo; per circondarlo.
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-2 border-t border-mist pt-4">
                    <button type="button" className="btn btn-quiet text-[0.8125rem]" onClick={() => setStep(1)}>
                      Indietro
                    </button>
                    <button
                      type="button"
                      className="btn btn-deep"
                      onClick={() => setStep(3)}
                      disabled={!draft.sezione.trim()}
                    >
                      Continua
                    </button>
                  </div>
                </div>
              ) : null}

              {step === 3 && page ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-card bg-paper px-3 py-2">
                    <div className="min-w-0">
                      <p className="u-label text-petrol-deep">Richiesta su</p>
                      <p className="truncate text-[0.8125rem] font-semibold">
                        {page.label} · {draft.sezione || "sezione da indicare"}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-quiet text-[11px] text-petrol-deep"
                      onClick={() => setStep(2)}
                    >
                      Cambia punto
                    </button>
                  </div>

                  <RequestForm
                    draft={draft}
                    problems={problems}
                    editing={Boolean(editingId)}
                    onChange={(patch) =>
                      setDraft((current) => ({ ...current, ...patch }))
                    }
                    onAttachmentAdd={(files) => void addFiles(files)}
                    onAttachmentRemove={(id) => void removeAttachment(id)}
                    onAttachmentStato={setAttachmentStato}
                    onSubmit={submit}
                    onBack={() => setStep(2)}
                    onCancelEdit={resetDraft}
                  />
                </div>
              ) : null}
            </div>
          </div>

          <aside className="space-y-5">
            <Summary state={state} onMeta={handleMeta} onPreview={() => setPreviewOpen(true)} onReset={() => void handleReset()} />

            {editingId ? (
              <div className="flex items-center gap-2 rounded-card border border-petrol/30 bg-petrol/5 px-3 py-2 text-[11.5px] text-petrol-deep">
                <IconInfo className="h-4 w-4 shrink-0" />
                Stai modificando{" "}
                {(() => {
                  const index = state.richieste.findIndex((request) => request.id === editingId);
                  return index >= 0 ? `Camb ${numeroRichiesta(index)}` : "una richiesta";
                })()}
                .
              </div>
            ) : null}

            <RequestList
              richieste={state.richieste}
              editingId={editingId}
              onEdit={editRequest}
              onDelete={(id) => void deleteRequest(id)}
            />
          </aside>
        </div>
      </main>

      <footer className="border-t border-slate/10 bg-white">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-2 px-4 py-5 text-[11.5px] text-slate/80 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>INCLUDE · Erasmus+ KA220-VET · Centro richieste di modifica</p>
          <p className="flex flex-wrap items-center gap-3">
            <span>{capturesDate ? `Anteprime del ${capturesDate}` : "Anteprime da aggiornare"}</span>
            <a
              href={liveUrl("/")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 underline decoration-slate/30 underline-offset-2 hover:text-petrol-deep"
            >
              Apri il sito INCLUDE
              <IconExternal className="h-3 w-3" />
            </a>
            <span>Nessun tracciamento</span>
          </p>
        </div>
      </footer>

      <Modal
        open={Boolean(pendingImport)}
        title="Importa le richieste"
        onClose={() => setPendingImport(null)}
        footer={
          <>
            <button type="button" className="btn btn-quiet" onClick={() => setPendingImport(null)}>
              Annulla
            </button>
            <button type="button" className="btn btn-outline" onClick={() => void applyImport("replace")}>
              Sostituisci tutto
            </button>
            <button type="button" className="btn btn-primary" onClick={() => void applyImport("merge")}>
              Aggiungi alla lista
            </button>
          </>
        }
      >
        {pendingImport ? (
          <div className="space-y-3 text-[0.875rem] leading-relaxed">
            <p>
              <span className="font-semibold">{pendingImport.name}</span> contiene{" "}
              <span className="font-semibold">{pendingImport.state.richieste.length}</span>{" "}
              {pendingImport.state.richieste.length === 1 ? "richiesta" : "richieste"}.
            </p>
            <p className="text-slate/80">
              &ldquo;Aggiungi alla lista&rdquo; tiene le richieste già presenti e unisce quelle del
              file; &ldquo;Sostituisci tutto&rdquo; riparte dal contenuto del file.
            </p>
            {pendingImport.warnings.length > 0 ? (
              <ul className="rounded-card bg-paper px-3 py-2 text-[12px] text-slate/80">
                {pendingImport.warnings.map((warning) => (
                  <li key={warning}>· {warning}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </Modal>

      <Modal
        open={previewOpen}
        title="Anteprima del file .md"
        width="lg"
        onClose={() => setPreviewOpen(false)}
        footer={
          <>
            <button type="button" className="btn btn-quiet" onClick={() => setPreviewOpen(false)}>
              Chiudi
            </button>
            <button type="button" className="btn btn-primary" onClick={handleExport} disabled={busy}>
              <IconDownload className="h-4 w-4" />
              Esporta ZIP
            </button>
          </>
        }
      >
        <pre className="whitespace-pre-wrap break-words rounded-card bg-paper p-3 font-mono text-[11.5px] leading-relaxed text-slate/80">
          {preview}
        </pre>
      </Modal>

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4">
        {toast ? (
          <div
            className={`animate-rise pointer-events-auto flex max-w-md items-start gap-2.5 rounded-pill px-4 py-2.5 text-[0.8125rem] font-medium shadow-lift ${
              toast.tone === "ok" ? "bg-slate text-white" : "bg-burgundy text-white"
            }`}
          >
            {toast.tone === "ok" ? (
              <IconCheck className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <IconInfo className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SaveBadge({ save }: { save: { status: "idle" | "saving" | "saved" | "error"; at: Date | null } }) {
  if (save.status === "idle") return null;
  const time =
    save.at &&
    new Intl.DateTimeFormat("it-IT", { hour: "2-digit", minute: "2-digit" }).format(save.at);
  const text =
    save.status === "saving"
      ? "Salvataggio…"
      : save.status === "saved"
        ? `Salvato${time ? ` alle ${time}` : ""}`
        : "Salvataggio non disponibile";
  return (
    <span
      className="hidden items-center gap-1.5 text-[10.5px] font-medium text-white md:flex"
      aria-live="polite"
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          save.status === "error" ? "bg-rust" : save.status === "saving" ? "bg-ochre" : "bg-white/50"
        }`}
      />
      {text}
    </span>
  );
}
