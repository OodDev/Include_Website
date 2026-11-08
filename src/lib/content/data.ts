import fs from "node:fs/promises";
import path from "node:path";
import z from "zod";
import { parse as parseYaml } from "yaml";
import { resourceSchema, partnerSchema, glossarySchema } from "./schemas";
import type { Resource, Partner, GlossaryEntry } from "./types";

const DATA_DIR = path.join(process.cwd(), "content", "data");

async function readYamlChecked<S extends z.ZodTypeAny>(
  file: string,
  schema: S,
): Promise<z.output<S>> {
  const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
  const parsed = schema.safeParse(parseYaml(raw));
  if (!parsed.success) {
    // Never ship corrupted content data (§0.4.4: fail loudly at build)
    throw new Error(`[content] ${file}: ${parsed.error.message}`);
  }
  return parsed.data;
}

export async function listResources(): Promise<Resource[]> {
  return readYamlChecked("resources.yaml", resourceSchema.array());
}

export async function listPartners(): Promise<Partner[]> {
  return readYamlChecked("partners.yaml", partnerSchema.array());
}

export async function listGlossary(): Promise<GlossaryEntry[]> {
  return readYamlChecked("glossary.yaml", glossarySchema.array());
}
