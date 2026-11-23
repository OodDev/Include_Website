import {
  TIPO_INFO,
  PRIORITA,
  type Allegato,
  type Priorita,
  type Richiesta,
  type Stato,
  type Tipo,
  type PortalState,
} from "./model";
import { PAGES, pageLabel } from "./pages";

const DASH = "—";

export function safeFileName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "file";
  const cleaned = base
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/[^\p{L}\p{N}._() -]+/gu, "-")
    .replace(/\s+/g, " ")
    .trim();
  return (cleaned || "file").slice(0, 120);
}

export function attachmentPath(requestIndex: number, allegato: Allegato): string {
  return `allegati/${String(requestIndex + 1).padStart(3, "0")}-${safeFileName(allegato.nome)}`;
}

export function selectionPath(requestIndex: number): string {
  return `selezioni/camb-${String(requestIndex + 1).padStart(3, "0")}.png`;
}

function stamp(date = new Date()): string {
  const day = new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Rome",
  }).format(date);
  const time = new Intl.DateTimeFormat("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome",
  }).format(date);
  return `${day} alle ${time}`;
}

function bytes(n: number): string {
  if (!n) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function quote(value: string): string {
  const text = value.trim();
  if (!text) return `> ${DASH}`;
  return text
    .split(/\r?\n/)
    .map((line) => (line.trim() ? `> ${line}` : ">"))
    .join("\n");
}

function orDash(value: string): string {
  return value.trim() || DASH;
}

function attachmentLine(allegati: Richiesta["allegati"]): string {
  if (allegati.length === 0) return DASH;
  return allegati
    .map((a) => {
      const size = bytes(a.dimensione);
      const stato = a.stato === "definitivo" ? "definitivo" : "bozza";
      return `${a.nome} (${stato}${size ? `, ${size}` : ""})`;
    })
    .join(" · ");
}

function typeFields(r: Richiesta): string[] {
  switch (r.tipo) {
    case "testo":
      return [
        "- **Testo attuale (copiato dal sito):**",
        quote(r.testoAttuale),
        "- **Testo nuovo (completo, come deve apparire):**",
        quote(r.testoNuovo),
      ];
    case "visuale":
      return [
        "- **Richiesta:**",
        quote(r.richiesta),
        ...(r.valori ? ["- **Valori:**", quote(r.valori)] : []),
      ];
    case "nuovo-contenuto":
      return [
        "- **Da inserire:**",
        quote(r.richiesta),
        ...(r.posizione ? ["- **Posizione:**", quote(r.posizione)] : []),
      ];
    case "rimozione":
      return ["- **Da rimuovere:**", quote(r.richiesta)];
    case "sostituzione":
      return [
        "- **Elemento attuale:**",
        quote(r.richiesta),
        `- **File nuovo:** ${r.allegati.length ? r.allegati.map((a) => a.nome).join(", ") : DASH}`,
      ];
  }
}

export function buildMarkdown(state: PortalState, date = new Date()): string {
  const { richieste } = state;
  const counts = PRIORITA.map((p) => [p, richieste.filter((r) => r.priorita === p).length] as const)
    .filter(([, n]) => n > 0)
    .map(([p, n]) => `${n} ${p}`)
    .join(", ");
  const allegati = richieste.reduce((sum, r) => sum + r.allegati.length, 0);
  const selezioni = richieste.filter((r) => r.box).length;

  const header = [
    "# INCLUDE — Sito web · Richieste di modifica",
    "",
    `> Esportato dal Centro richieste di modifica INCLUDE il ${stamp(date)}.`,
    ...(state.meta.compilatoDa.trim() ? [`> Compilato da: ${state.meta.compilatoDa.trim()}`] : []),
    `> ${richieste.length} ${richieste.length === 1 ? "richiesta" : "richieste"}${counts ? ` (${counts})` : ""}${allegati ? ` · ${allegati} ${allegati === 1 ? "allegato" : "allegati"}` : ""}${selezioni ? ` · ${selezioni} ${selezioni === 1 ? "area indicata" : "are indicate"}` : ""}.`,
    ">",
    `> I file allegati sono nel ZIP, nella cartella \`allegati/\`; le aree indicate sullo schermo in \`selezioni/\`.`,
    "",
    "---",
    "",
  ];

  const blocks = richieste.map((r, index) => {
    const numero = String(index + 1).padStart(3, "0");
    const heading = `### Camb ${numero} — ${pageLabel(r.pagina)} · ${r.sezione} (${r.priorita})`;
    const lines = [
      heading,
      `- **Pagina:** ${pageLabel(r.pagina)} — /en${r.pagina === "/" ? "" : r.pagina}`,
      `- **Sezione:** ${r.sezione}`,
      `- **Tipo:** ${TIPO_INFO[r.tipo].label.toLowerCase()}`,
      ...typeFields(r),
      `- **Priorità:** ${r.priorita} — ${prioritaHint(r.priorita)}`,
      `- **Stato:** ${r.stato}`,
      `- **Allegati:** ${attachmentLine(r.allegati)}`,
      ...(r.box
        ? [
            `- **Area indicata:** ${selectionPath(index)} (${percent(r.box.x)}, ${percent(r.box.y)} — ${percent(r.box.w)} × ${percent(r.box.h)} della pagina)`,
          ]
        : []),
      `- **Note:** ${orDash(r.note)}`,
      "",
    ];
    return lines.join("\n");
  });

  return [...header, ...blocks].join("\n");
}

function percent(v: number): string {
  return `${Math.round(v * 100)}%`;
}

function prioritaHint(p: Priorita): string {
  return p === "P1" ? "bloccante per il lancio" : p === "P2" ? "importante" : "se c'è tempo";
}

/** Human-facing markdown plus the machine-readable twin used for lossless import. */
export function buildExportJson(state: PortalState, date = new Date()): string {
  return JSON.stringify(
    {
      version: 1,
      esportatoIl: date.toISOString(),
      meta: state.meta,
      richieste: state.richieste.map((r, index) => ({
        ...r,
        numero: index + 1,
        allegati: r.allegati.map((a) => ({ ...a, percorso: attachmentPath(index, a) })),
        ...(r.box ? { selezione: selectionPath(index) } : {}),
      })),
    },
    null,
    2,
  );
}

export interface ParsedMarkdown {
  richieste: Richiesta[];
  warnings: string[];
}

const HEADING = /^###\s+Camb\s+(\d+)\s*[—–-]\s*(.*?)\s*\((P[123])\)\s*$/;
const FIELD = /^-\s+\*\*(.+?):?\*\*\s*(.*)$/;
const QUOTED = /^>\s?(.*)$/;

/**
 * Best-effort parser for a hand-edited export: the ZIP's JSON is authoritative,
 * this keeps a plain .md upload usable when attachments are not needed.
 */
export function parseMarkdown(markdown: string): ParsedMarkdown {
  const warnings: string[] = [];
  const lines = markdown.split(/\r?\n/);
  const blocks: string[][] = [];
  let current: string[] | null = null;

  for (const line of lines) {
    if (HEADING.test(line)) {
      if (current) blocks.push(current);
      current = [line];
    } else if (current) {
      current.push(line);
    }
  }
  if (current) blocks.push(current);

  if (blocks.length === 0) {
    return { richieste: [], warnings: ["Nessun blocco “Camb NNN” trovato nel file."] };
  }

  const richieste: Richiesta[] = [];
  const now = new Date().toISOString();

  for (const block of blocks) {
    const head = block[0];
    if (!head) continue;
    const match = HEADING.exec(head);
    if (!match) continue;
    const priority = (match[3] as Priorita) ?? "P2";
    const rest = match[2] ?? "";
    const [pageRaw = "", ...sectionParts] = rest.split(" · ");
    const section = sectionParts.join(" · ") || "Sezione";

    const fields: Record<string, string[]> = {};
    let key: string | null = null;
    for (const line of block.slice(1)) {
      const fieldMatch = FIELD.exec(line);
      if (fieldMatch) {
        key = normalizeField(fieldMatch[1] ?? "");
        fields[key] = [fieldMatch[2] ?? ""];
        continue;
      }
      const quoted = QUOTED.exec(line);
      if (quoted && key) {
        fields[key]?.push(quoted[1] ?? "");
        continue;
      }
      if (!line.trim()) key = null;
    }

    const read = (k: string): string =>
      (fields[k] ?? [])
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    const tipo = parseTipo(read("tipo"));
    const page = PAGES.find((p) => p.label.toLowerCase() === pageRaw.trim().toLowerCase());
    if (!page) {
      warnings.push(`Pagina non riconosciuta: “${pageRaw.trim()}”.`);
    }

    const allegatiRaw = read("allegati");
    const allegati: Allegato[] =
      allegatiRaw && allegatiRaw !== DASH
        ? allegatiRaw.split("·").map((chunk, i) => {
            const name = chunk.replace(/\([^)]*\)/g, "").trim();
            return {
              id: `import-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}`,
              nome: name || `allegato-${i + 1}`,
              tipo: "",
              dimensione: 0,
              stato: /bozza/i.test(chunk) ? ("bozza" as Stato) : ("definitivo" as Stato),
            };
          })
        : [];

    richieste.push({
      id: crypto.randomUUID(),
      pagina: page?.path ?? "/",
      sezione: section || "Sezione",
      device: "desktop",
      tipo,
      testoAttuale: read("testoAttuale"),
      testoNuovo: read("testoNuovo"),
      richiesta: read("richiesta"),
      valori: read("valori"),
      posizione: read("posizione"),
      priorita: priority,
      stato: /bozza/i.test(read("stato")) ? "bozza" : "definitivo",
      note: read("note") === DASH ? "" : read("note"),
      allegati,
      creatoIl: now,
      aggiornatoIl: now,
    });
  }

  return { richieste, warnings };
}

function normalizeField(raw: string): string {
  const k = raw.trim().toLowerCase();
  if (k.startsWith("testo attuale")) return "testoAttuale";
  if (k.startsWith("testo nuovo")) return "testoNuovo";
  if (k === "pagina") return "pagina";
  if (k === "sezione") return "sezione";
  if (k === "tipo") return "tipo";
  if (k === "richiesta") return "richiesta";
  if (k === "valori") return "valori";
  if (k === "da inserire") return "richiesta";
  if (k === "posizione") return "posizione";
  if (k === "da rimuovere") return "richiesta";
  if (k === "elemento attuale") return "richiesta";
  if (k === "file nuovo") return "fileNuovo";
  if (k === "priorità" || k === "priorita") return "priorita";
  if (k === "stato") return "stato";
  if (k === "note" || k === "nota") return "note";
  if (k === "allegati") return "allegati";
  if (k === "area indicata") return "area";
  return "ignored";
}

function parseTipo(value: string): Tipo {
  const v = value.toLowerCase();
  if (v.includes("visuale")) return "visuale";
  if (v.includes("nuovo")) return "nuovo-contenuto";
  if (v.includes("rimozione")) return "rimozione";
  if (v.includes("sostituzione")) return "sostituzione";
  return "testo";
}
