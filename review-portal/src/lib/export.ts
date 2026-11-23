"use client";

import { strFromU8, strToU8, unzipSync, zipSync } from "fflate";
import { PortalStateSchema, type Box, type PortalState } from "./model";
import {
  attachmentPath,
  buildExportJson,
  buildMarkdown,
  parseMarkdown,
  selectionPath,
} from "./markdown";
import { captureFor } from "./pages";
import { getAttachmentFile } from "./storage";

export interface ExportResult {
  blob: Blob;
  warnings: string[];
}

export async function exportWorkspace(state: PortalState): Promise<ExportResult> {
  const warnings: string[] = [];
  const entries: Record<string, Uint8Array> = {
    "richieste-modifiche.md": strToU8(buildMarkdown(state)),
    "richieste-modifiche.json": strToU8(buildExportJson(state)),
  };

  for (let index = 0; index < state.richieste.length; index += 1) {
    const request = state.richieste[index];
    if (!request) continue;

    for (const allegato of request.allegati) {
      const blob = await getAttachmentFile(allegato.id);
      if (!blob) {
        warnings.push(`Immagine non più disponibile: ${allegato.nome}`);
        continue;
      }
      entries[attachmentPath(index, allegato)] = new Uint8Array(await blob.arrayBuffer());
    }

    if (request.box) {
      const capture = captureFor(request.pagina, request.device);
      if (!capture) {
        warnings.push("Un'area indicata non ha un'anteprima da ritagliare.");
      } else {
        const png = await cropSelection(capture.file, request.box);
        if (png) entries[selectionPath(index)] = new Uint8Array(await png.arrayBuffer());
        else warnings.push("Non è stato possibile ritagliare un'area indicata.");
      }
    }
  }

  const zipped = zipSync(entries, { level: 1 });
  return {
    blob: new Blob([zipped], { type: "application/zip" }),
    warnings,
  };
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.decoding = "async";
  image.src = src;
  await image.decode();
  return image;
}

async function cropSelection(file: string, box: Box): Promise<Blob | null> {
  try {
    const image = await loadImage(file);
    const sx = Math.round(box.x * image.naturalWidth);
    const sy = Math.round(box.y * image.naturalHeight);
    const sw = Math.max(24, Math.round(box.w * image.naturalWidth));
    const sh = Math.max(24, Math.round(box.h * image.naturalHeight));
    const maxWidth = 2000;
    const scale = sw > maxWidth ? maxWidth / sw : 1;
    const pad = 16;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(sw * scale) + pad * 2;
    canvas.height = Math.round(sh * scale) + pad * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, sx, sy, sw, sh, pad, pad, canvas.width - pad * 2, canvas.height - pad * 2);
    ctx.strokeStyle = "#c14723";
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);
    return await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((blob) => resolve(blob), "image/png"),
    );
  } catch {
    return null;
  }
}

export interface ImportResult {
  state: PortalState | null;
  files: Map<string, Blob>;
  warnings: string[];
}

export async function importArchive(file: File): Promise<ImportResult> {
  const warnings: string[] = [];
  const files = new Map<string, Blob>();

  if (file.name.toLowerCase().endsWith(".md") || file.type === "text/markdown") {
    const text = await file.text();
    const parsed = parseMarkdown(text);
    if (parsed.richieste.length === 0) {
      return { state: null, files, warnings: [...parsed.warnings, "Il file non contiene richieste."] };
    }
    return {
      state: {
        version: 1,
        meta: { compilatoDa: "" },
        richieste: parsed.richieste,
      },
      files,
      warnings: [...parsed.warnings, "Importato dal solo .md: gli allegati non sono inclusi."],
    };
  }

  let entries: Record<string, Uint8Array>;
  try {
    entries = unzipSync(new Uint8Array(await file.arrayBuffer()));
  } catch {
    return { state: null, files, warnings: ["Il file ZIP non è leggibile."] };
  }

  const jsonKey = Object.keys(entries).find((key) => key.endsWith("richieste-modifiche.json"));
  if (jsonKey) {
    const raw = JSON.parse(strFromU8(entries[jsonKey] ?? new Uint8Array())) as unknown;
    const parsed = PortalStateSchema.safeParse(raw);
    if (!parsed.success) {
      return { state: null, files, warnings: ["Il contenuto del file non è nel formato atteso."] };
    }
    for (const request of parsed.data.richieste) {
      for (const allegato of request.allegati) {
        const path = allegato.percorso;
        if (!path) continue;
        const bytes = entries[path];
        if (!bytes) {
          warnings.push(`Allegato mancante nel ZIP: ${allegato.nome}`);
          continue;
        }
        const copy = new Uint8Array(bytes.byteLength);
        copy.set(bytes);
        files.set(allegato.id, new Blob([copy], { type: allegato.tipo || "application/octet-stream" }));
      }
    }
    return { state: parsed.data, files, warnings };
  }

  const mdKey = Object.keys(entries).find((key) => key.endsWith(".md"));
  if (mdKey) {
    const parsed = parseMarkdown(strFromU8(entries[mdKey] ?? new Uint8Array()));
    return {
      state:
        parsed.richieste.length > 0
          ? { version: 1, meta: { compilatoDa: "" }, richieste: parsed.richieste }
          : null,
      files,
      warnings: [...parsed.warnings, "Importato dal solo .md: gli allegati non sono inclusi."],
    };
  }

  return { state: null, files, warnings: ["Nel ZIP non c'è un file di richieste riconoscibile."] };
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export function exportFileName(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `richieste-modifiche-${y}-${m}-${d}.zip`;
}
