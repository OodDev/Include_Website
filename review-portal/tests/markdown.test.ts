import { describe, expect, it } from "vitest";
import {
  buildMarkdown,
  parseMarkdown,
  safeFileName,
  selectionPath,
  attachmentPath,
} from "../src/lib/markdown";
import { validateDraft, emptyDraft, type PortalState } from "../src/lib/model";

function sampleState(): PortalState {
  return {
    version: 1,
    meta: { compilatoDa: "Mario Rossi — Bene Futuro" },
    richieste: [
      {
        id: "r1",
        pagina: "/",
        sezione: "Hero",
        box: { x: 0.1, y: 0.02, w: 0.8, h: 0.2 },
        device: "desktop",
        tipo: "testo",
        testoAttuale: "From protected paths to real jobs",
        testoNuovo: "From protected pathways to real jobs",
        richiesta: "",
        valori: "",
        posizione: "",
        priorita: "P1",
        stato: "definitivo",
        note: "",
        allegati: [],
        creatoIl: "2026-11-21T08:00:00.000Z",
        aggiornatoIl: "2026-11-21T08:00:00.000Z",
      },
      {
        id: "r2",
        pagina: "/contact",
        sezione: "Sotto il modulo",
        device: "desktop",
        tipo: "nuovo-contenuto",
        testoAttuale: "",
        testoNuovo: "",
        richiesta: "Inserire il logo del partner.",
        valori: "",
        posizione: "Centrato, sotto il bottone di invio.",
        priorita: "P2",
        stato: "bozza",
        note: "File definitivo.",
        allegati: [
          {
            id: "a1",
            nome: "logo partner.svg",
            tipo: "image/svg+xml",
            dimensione: 2048,
            stato: "definitivo",
          },
        ],
        creatoIl: "2026-11-21T08:05:00.000Z",
        aggiornatoIl: "2026-11-21T08:05:00.000Z",
      },
    ],
  };
}

describe("markdown export", () => {
  it("writes one numbered block per request with the agreed fields", () => {
    const md = buildMarkdown(sampleState(), new Date("2026-11-21T10:00:00.000Z"));
    expect(md).toContain("### Camb 001 — Home · Hero (P1)");
    expect(md).toContain("### Camb 002 — Contatti · Sotto il modulo (P2)");
    expect(md).toContain("**Testo attuale (copiato dal sito):**");
    expect(md).toContain("> From protected paths to real jobs");
    expect(md).toContain("**Posizione:**");
    expect(md).toContain("logo partner.svg (definitivo, 2 KB)");
    expect(md).toContain(selectionPath(0));
  });

  it("round-trips through the best-effort parser", () => {
    const md = buildMarkdown(sampleState());
    const parsed = parseMarkdown(md);
    expect(parsed.warnings).toHaveLength(0);
    expect(parsed.richieste).toHaveLength(2);

    const first = parsed.richieste[0];
    expect(first?.pagina).toBe("/");
    expect(first?.sezione).toBe("Hero");
    expect(first?.priorita).toBe("P1");
    expect(first?.tipo).toBe("testo");
    expect(first?.testoAttuale).toBe("From protected paths to real jobs");
    expect(first?.testoNuovo).toBe("From protected pathways to real jobs");
    expect(first?.stato).toBe("definitivo");

    const second = parsed.richieste[1];
    expect(second?.pagina).toBe("/contact");
    expect(second?.tipo).toBe("nuovo-contenuto");
    expect(second?.richiesta).toBe("Inserire il logo del partner.");
    expect(second?.posizione).toBe("Centrato, sotto il bottone di invio.");
    expect(second?.allegati[0]?.nome).toBe("logo partner.svg");
    expect(second?.allegati[0]?.stato).toBe("definitivo");
  });
});

describe("file naming", () => {
  it("strips directories and unsafe characters", () => {
    expect(safeFileName("../../etc/passwd")).toBe("passwd");
    expect(safeFileName("Logo: XYZ (finale).SVG")).toBe("Logo- XYZ (finale).SVG");
  });

  it("numbers attachments per request", () => {
    const path = attachmentPath(0, {
      id: "a",
      nome: "logo.svg",
      tipo: "",
      dimensione: 0,
      stato: "definitivo",
    });
    expect(path).toBe("allegati/001-logo.svg");
  });
});

describe("draft validation", () => {
  it("requires the exact current text for a text change", () => {
    const draft = { ...emptyDraft("/"), sezione: "Hero", tipo: "testo" as const };
    const problems = validateDraft(draft);
    expect(problems).toContain("Copiate il testo attuale dal sito.");
    expect(problems).toContain("Scrivete il testo nuovo completo.");
  });

  it("accepts a complete visual request", () => {
    const draft = {
      ...emptyDraft("/"),
      sezione: "Riquadri statistica",
      tipo: "visuale" as const,
      richiesta: "Aumentare lo spazio tra i riquadri.",
      valori: "32px → 40px",
    };
    expect(validateDraft(draft)).toHaveLength(0);
  });
});
