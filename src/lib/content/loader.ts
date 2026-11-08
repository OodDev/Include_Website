import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { newsFrontmatterSchema, type NewsFrontmatter } from "./schemas";
import type { AppLocale } from "@/config/locales";

const CONTENT_ROOT = path.join(process.cwd(), "content");

export async function readMdxFile(
  dir: "pages" | "news" | "legal",
  locale: AppLocale,
  slug: string,
): Promise<{ frontmatter: Record<string, unknown>; body: string } | null> {
  try {
    const raw = await fs.readFile(
      path.join(CONTENT_ROOT, dir, locale, `${slug}.mdx`),
      "utf8",
    );
    const { data, content } = matter(raw);
    return { frontmatter: data, body: content };
  } catch {
    return null;
  }
}

/** All published news posts for a locale, newest first, drafts excluded outside dev. */
export async function listNews(locale: AppLocale): Promise<NewsFrontmatter[]> {
  const dir = path.join(CONTENT_ROOT, "news", locale);
  let files: string[] = [];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }
  const posts: NewsFrontmatter[] = [];
  for (const f of files.filter((f) => f.endsWith(".mdx"))) {
    const raw = await fs.readFile(path.join(dir, f), "utf8");
    const { data } = matter(raw);
    const parsed = newsFrontmatterSchema.safeParse(data);
    if (!parsed.success) {
      if (process.env.NODE_ENV !== "production") {
        console.error(`[content] invalid news frontmatter in ${locale}/${f}`, parsed.error.message);
      }
      continue; // never render an unvalidated post
    }
    if (parsed.data.status === "published") posts.push(parsed.data);
  }
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getNewsPost(
  locale: AppLocale,
  slug: string,
): Promise<{ frontmatter: NewsFrontmatter; body: string } | null> {
  const rec = await readMdxFile("news", locale, slug);
  if (!rec) return null;
  const parsed = newsFrontmatterSchema.safeParse(rec.frontmatter);
  if (!parsed.success || parsed.data.status !== "published" || parsed.data.slug !== slug) return null;
  return { frontmatter: parsed.data, body: rec.body };
}
