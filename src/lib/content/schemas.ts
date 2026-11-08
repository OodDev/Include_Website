import { z } from "zod";

/** YAML timestamps arrive as Date instances; normalise to ISO strings. */
const isoDateOrDatetime = z
  .union([z.iso.datetime(), z.iso.date(), z.date()])
  .transform((v) => (v instanceof Date ? v.toISOString() : String(v)));

/** Kebab-case slug validator (zod v4 has no built-in slug type). */
const slugRE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const slug = () => z.string().regex(slugRE, "slug");

/** Common metadata spine (§7). Every content entity carries these flags. */
export const metaSchema = z.object({
  status: z.enum(["draft", "published"]).default("draft"),
  needsClientApproval: z.boolean().optional(),
  humanReviewed: z.boolean().optional(),
  updated: z.iso.date().optional(),
});
export type Meta = z.infer<typeof metaSchema>;

/** Icon ids that exist in components/brand/Icon.tsx (sync'd at build). */
export const iconIdSchema = z.enum([
  "protected-context", "pre-corporate", "labour-market", "pathway", "threshold", "connection",
  "person", "skills", "training", "autonomy", "company", "ready-for-inclusion",
  "european-protocol", "micro-credentials", "technical-passport", "white-paper", "toolkit",
  "policy-institutions", "recognition", "participation", "reciprocity", "stories",
  "data-impact", "events",
] as const);
export type IconId = z.infer<typeof iconIdSchema>;

const localisedText = z.object({
  title: z.string().min(1),
  summary: z.string().optional(),
  body: z.string().optional(),
});

/** Resources (§6.5). Detail pages only when approved copy suffices (§2.3 #11). */
export const resourceSchema = z
  .object({
    slug: slug(),
    icon: iconIdSchema,
    status: z.enum(["planned", "in-progress", "published"]),
    featured: z.boolean().default(false),
    audience: z.array(z.enum(["companies", "vet-providers", "researchers", "policymakers", "people"])).default([]),
    publishedAt: z.iso.date().nullable().default(null),
    language: z.array(z.string()).default(["en"]),
    file: z.string().nullable().default(null),
    fileType: z.string().nullable().default(null),
    fileSizeBytes: z.number().nullable().default(null),
    related: z.array(z.string()).default([]),
    needsClientApproval: z.boolean().optional(),
    i18n: z.record(z.string(), z.looseObject({})).and(z.record(z.string(), localisedText)),
  })
  .superRefine((res, ctx) => {
    if (res.status === "published" && (res.publishedAt === null || res.file === null)) {
      ctx.addIssue({
        code: "custom",
        message: `Resource ${res.slug}: status "published" requires publishedAt AND file`,
      });
    }
  });
export type Resource = z.infer<typeof resourceSchema>;

/** Partners (§6.7): exact names; associated partners render only if listed. */
export const partnerSchema = z.object({
  slug: slug(),
  type: z.enum(["full", "associated"]).default("full"),
  country: z.string().min(2),
  name: z.string().min(2),
  approvedLogo: z.string().nullable().optional(),
  verifiedUrl: z.string().url().nullable().optional(),
  i18n: z.record(z.string(), z.looseObject({})).and(z.record(z.string(), z.object({ description: z.string().min(10) }))),
  meta: metaSchema.optional(),
});
export type Partner = z.infer<typeof partnerSchema>;

/** News frontmatter (§6.8). consentVerified REQUIRED for pilot stories. */
export const newsFrontmatterSchema = z
  .object({
    title: z.string().min(3),
    slug: slug(),
    date: isoDateOrDatetime,
    updated: isoDateOrDatetime.optional(),
    locale: z.enum(["en", "it", "pt", "es", "el"]),
    category: z.enum([
      "project-news",
      "from-the-territories",
      "voices-from-companies",
      "pilot-stories",
      "events",
      "tools-resources",
      "policy-advocacy",
    ]),
    excerpt: z.string().min(20),
    cover: z.object({ src: z.string().min(1), alt: z.string().min(8) }).optional(),
    country: z.string().optional(),
    author: z.string().optional(),
    status: z.enum(["draft", "published"]),
    humanReviewed: z.boolean().optional(),
    consentVerified: z.boolean().optional(),
  })
  .superRefine((post, ctx) => {
    if (post.category === "pilot-stories" && post.consentVerified !== true) {
      ctx.addIssue({
        code: "custom",
        message: `Post ${post.slug}: pilot stories require consentVerified: true (ethical guard)`,
      });
    }
  });
export type NewsFrontmatter = z.infer<typeof newsFrontmatterSchema>;

/** FAQ + glossary (§6.10, §9.4). */
export const faqSchema = z.object({ question: z.string().min(5), answer: z.string().min(20) });
export const glossarySchema = z.object({
  term: z.string().min(2),
  definition: z.string().min(20),
  meta: metaSchema.optional(),
});
