import { readMdxFile } from "./loader";
import { z } from "zod";
import type { AppLocale } from "@/config/locales";

/** gray-matter/js-yaml materialise ISO timestamps as Date objects (yaml v3). */
const isoDateOrDatetime = z
  .union([z.iso.datetime(), z.iso.date(), z.date()])
  .transform((v) => (v instanceof Date ? v.toISOString() : String(v)));

/**
 * Page document shape — flexible structured frontmatter + MDX body.
 * Validated with Zod; unknown blocks fail the build's check:content.
 */
export const pageDocSchema = z.object({
  status: z.enum(["draft", "published"]),
  humanReviewed: z.boolean().optional(),
  updated: isoDateOrDatetime.optional(),
  reviewMarker: z.string().optional(),
});
export type PageDoc = z.infer<typeof pageDocSchema>;

export type PageData = {
  frontmatter: Record<string, unknown>;
  meta: PageDoc;
  body: string;
};

export async function loadPage(locale: AppLocale, slug: string): Promise<PageData | null> {
  const doc = await readMdxFile("pages", locale, slug);
  if (!doc) return null;
  const parsed = pageDocSchema.safeParse(doc.frontmatter);
  if (!parsed.success) return null;
  return { frontmatter: doc.frontmatter, meta: parsed.data, body: doc.body };
}

export async function loadLegal(locale: AppLocale, slug: string): Promise<PageData | null> {
  const doc = await readMdxFile("legal", locale, slug);
  if (!doc) return null;
  const parsed = pageDocSchema.safeParse(doc.frontmatter);
  if (!parsed.success) return null;
  return { frontmatter: doc.frontmatter, meta: parsed.data, body: doc.body };
}
