/**
 * check:content — validate all markdown/MDX frontmatter and YAML data files
 * against their Zod schemas (§17). Exits 1 on any invalid entry.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { pageDocSchema } from "@/lib/content/pages";
import { newsFrontmatterSchema } from "@/lib/content/schemas";
import { listResources, listPartners, listGlossary } from "@/lib/content/data";

const CONTENT = path.join(process.cwd(), "content");
const MDX_DIRS: Array<{ dir: string; kind: "page" | "news" }> = [
  { dir: "pages", kind: "page" },
  { dir: "legal", kind: "page" },
  { dir: "news", kind: "news" },
];

let failures = 0;

function fail(message: string) {
  failures++;
  console.error(`✗ ${message}`);
}

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? walk(path.join(dir, e.name)) : path.join(dir, e.name),
    );
}

const mdxFiles = MDX_DIRS.flatMap(({ dir, kind }) =>
  walk(path.join(CONTENT, dir))
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => ({ file: f, kind })),
);

for (const { file, kind } of mdxFiles) {
  const raw = fs.readFileSync(file, "utf8");
  let data: unknown;
  try {
    data = matter(raw).data;
  } catch (e) {
    fail(`${path.relative(CONTENT, file)}: unparseable frontmatter (${String(e)})`);
    continue;
  }
  const schema = kind === "page" ? pageDocSchema : newsFrontmatterSchema;
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    fail(
      `${path.relative(CONTENT, file)}: invalid frontmatter — ${parsed.error.issues
        .slice(0, 5)
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`,
    );
  }
}

// YAML data files (§17 typed schemas)
async function main() {
  for (const [name, load] of [
    ["resources.yaml", listResources],
    ["partners.yaml", listPartners],
    ["glossary.yaml", listGlossary],
  ] as const) {
    try {
      const items = await load();
      console.log(`✓ content/data/${name}: ${items.length} valid entries`);
    } catch (e) {
      fail(`content/data/${name}: ${String(e)}`);
    }
  }

  if (failures > 0) {
    console.error(`\ncheck:content FAILED — ${failures} problem(s)`);
    process.exit(1);
  }
  console.log("check:content passed");
}
void main();
