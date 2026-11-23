import { z } from "zod";

export const TIPI = [
  "testo",
  "visuale",
  "nuovo-contenuto",
  "rimozione",
  "sostituzione",
] as const;
export type Tipo = (typeof TIPI)[number];

export const PRIORITA = ["P1", "P2", "P3"] as const;
export type Priorita = (typeof PRIORITA)[number];

export const STATI = ["bozza", "definitivo"] as const;
export type Stato = (typeof STATI)[number];

export const DEVICES = ["desktop", "mobile"] as const;
export type Device = (typeof DEVICES)[number];

export const TIPO_INFO: Record<Tipo, { label: string; hint: string }> = {
  testo: {
    label: "Testo",
    hint: "Correggere o riscrivere un testo che esiste già",
  },
  visuale: {
    label: "Visuale",
    hint: "Colori, dimensioni, spaziature, allineamenti",
  },
  "nuovo-contenuto": {
    label: "Nuovo contenuto",
    hint: "Qualcosa che oggi sul sito non c'è",
  },
  rimozione: {
    label: "Rimozione",
    hint: "Togliere un elemento o una parte di testo",
  },
  sostituzione: {
    label: "Sostituzione",
    hint: "Sostituire un'immagine, un logo o un file",
  },
};

export const PRIORITA_INFO: Record<Priorita, { label: string; hint: string }> = {
  P1: { label: "P1", hint: "Bloccante per il lancio" },
  P2: { label: "P2", hint: "Importante" },
  P3: { label: "P3", hint: "Se c'è tempo" },
};

export const STATO_INFO: Record<Stato, { label: string; hint: string }> = {
  bozza: { label: "Bozza", hint: "Va approvata prima della pubblicazione" },
  definitivo: { label: "Definitivo", hint: "Pronta da pubblicare così com'è" },
};

export const BoxSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  w: z.number().min(0).max(1),
  h: z.number().min(0).max(1),
});
export type Box = z.infer<typeof BoxSchema>;

export const AllegatoSchema = z.object({
  id: z.string().min(1),
  nome: z.string().min(1).max(180),
  tipo: z.string().max(120).default(""),
  dimensione: z.number().int().nonnegative().default(0),
  stato: z.enum(STATI).default("definitivo"),
  /** Only present in the exported JSON, so an import can find the bytes. */
  percorso: z.string().optional(),
});
export type Allegato = z.infer<typeof AllegatoSchema>;

export const RichiestaSchema = z.object({
  id: z.string().min(1),
  pagina: z.string().min(1),
  sezione: z.string().min(1),
  hotspotId: z.string().optional(),
  box: BoxSchema.optional(),
  device: z.enum(DEVICES).default("desktop"),
  tipo: z.enum(TIPI),
  testoAttuale: z.string().default(""),
  testoNuovo: z.string().default(""),
  richiesta: z.string().default(""),
  valori: z.string().default(""),
  posizione: z.string().default(""),
  priorita: z.enum(PRIORITA),
  stato: z.enum(STATI).default("bozza"),
  note: z.string().default(""),
  allegati: z.array(AllegatoSchema).default([]),
  creatoIl: z.string(),
  aggiornatoIl: z.string(),
});
export type Richiesta = z.infer<typeof RichiestaSchema>;

export const PortalStateSchema = z.object({
  version: z.literal(1),
  meta: z.object({
    compilatoDa: z.string().default(""),
  }),
  richieste: z.array(RichiestaSchema),
});
export type PortalState = z.infer<typeof PortalStateSchema>;

export function emptyState(): PortalState {
  return { version: 1, meta: { compilatoDa: "" }, richieste: [] };
}

export interface Draft {
  pagina: string;
  sezione: string;
  hotspotId: string;
  box: Box | null;
  device: Device;
  tipo: Tipo;
  testoAttuale: string;
  testoNuovo: string;
  richiesta: string;
  valori: string;
  posizione: string;
  priorita: Priorita;
  stato: Stato;
  note: string;
  allegati: Allegato[];
}

export function emptyDraft(pagina = ""): Draft {
  return {
    pagina,
    sezione: "",
    hotspotId: "",
    box: null,
    device: "desktop",
    tipo: "testo",
    testoAttuale: "",
    testoNuovo: "",
    richiesta: "",
    valori: "",
    posizione: "",
    priorita: "P2",
    stato: "bozza",
    note: "",
    allegati: [],
  };
}

export function draftFromRequest(r: Richiesta): Draft {
  return {
    pagina: r.pagina,
    sezione: r.sezione,
    hotspotId: r.hotspotId ?? "",
    box: r.box ?? null,
    device: r.device,
    tipo: r.tipo,
    testoAttuale: r.testoAttuale,
    testoNuovo: r.testoNuovo,
    richiesta: r.richiesta,
    valori: r.valori,
    posizione: r.posizione,
    priorita: r.priorita,
    stato: r.stato,
    note: r.note,
    allegati: r.allegati.map((a) => ({ ...a })),
  };
}

/** Fields the client must fill for each request type (Italian messages). */
export function validateDraft(draft: Draft): string[] {
  const problems: string[] = [];
  if (!draft.pagina) problems.push("Scegliete la pagina.");
  if (!draft.sezione.trim()) problems.push("Indicate la sezione della pagina.");
  if (draft.tipo === "testo") {
    if (!draft.testoAttuale.trim()) problems.push("Copiate il testo attuale dal sito.");
    if (!draft.testoNuovo.trim()) problems.push("Scrivete il testo nuovo completo.");
  } else if (!draft.richiesta.trim()) {
    problems.push("Descrivete la modifica richiesta.");
  }
  return problems;
}

export function buildRequest(draft: Draft, now = new Date()): Richiesta {
  const stamp = now.toISOString();
  return {
    id: crypto.randomUUID(),
    pagina: draft.pagina,
    sezione: draft.sezione.trim(),
    ...(draft.hotspotId ? { hotspotId: draft.hotspotId } : {}),
    ...(draft.box ? { box: draft.box } : {}),
    device: draft.device,
    tipo: draft.tipo,
    testoAttuale: draft.testoAttuale.trim(),
    testoNuovo: draft.testoNuovo.trim(),
    richiesta: draft.richiesta.trim(),
    valori: draft.valori.trim(),
    posizione: draft.posizione.trim(),
    priorita: draft.priorita,
    stato: draft.stato,
    note: draft.note.trim(),
    allegati: draft.allegati,
    creatoIl: stamp,
    aggiornatoIl: stamp,
  };
}

export function applyDraft(request: Richiesta, draft: Draft, now = new Date()): Richiesta {
  return {
    ...request,
    pagina: draft.pagina,
    sezione: draft.sezione.trim(),
    hotspotId: draft.hotspotId,
    box: draft.box ?? undefined,
    device: draft.device,
    tipo: draft.tipo,
    testoAttuale: draft.testoAttuale.trim(),
    testoNuovo: draft.testoNuovo.trim(),
    richiesta: draft.richiesta.trim(),
    valori: draft.valori.trim(),
    posizione: draft.posizione.trim(),
    priorita: draft.priorita,
    stato: draft.stato,
    note: draft.note.trim(),
    allegati: draft.allegati,
    aggiornatoIl: now.toISOString(),
  };
}

export function numeroRichiesta(index: number): string {
  return String(index + 1).padStart(3, "0");
}

export function stripRequestMeta(r: Richiesta): Omit<Richiesta, "creatoIl" | "aggiornatoIl"> {
  const { creatoIl: _c, aggiornatoIl: _a, ...rest } = r;
  return rest;
}
