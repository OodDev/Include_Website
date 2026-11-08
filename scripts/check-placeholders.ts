/**
 * check:placeholders — mockup stand-ins must never appear in rendering
 * surfaces (§15): bracketed placeholders ([00], [Foto: …], [Titolo evento],
 * [GG MMM], [Nome Cognome]), lorem text, TODO markers or fake counters in
 * content/, messages/ and public/ (vendor excluded). Exits 1 on any hit.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOTS = ["content", "messages", "public"];
const VENDOR = path.join("public", "vendor");

// [00] · [Foto: …] · [Titolo …] · [GG MMM] · [Nome Cognome] · [📷 placeholder …]
const PLACEHOLDER_BRACKETS =
  /\[\s*(?:\d{2}|Foto|Photo|Titolo|Title|GG|MM|YYYY|Nome|Cognome|Name|Dato|Data|Logo|Titel)\b[^\]]*\]/i;
const FAKE_COUNTERS = /\b(?:\+\s*)?\d{4,}\s*(?:events?|jobs?|hits|hacked)\b/i;
const LOREM = /lorem\s+ipsum/i;
const TODO = /\bTODO\b/;

let failures = 0;
const fail = (m: string) => {
  failures++;
  console.error(`✗ ${m}`);
};

function walk(dir: string): string[] {
  if (!fs.existsSync(dir) || fs.statSync(dir).isFile()) return dir.endsWith(path.sep) ? [] : [dir];
  const out: string[] = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (dir.startsWith(VENDOR) || path.join(dir, e.name) === VENDOR) continue;
      out.push(...walk(path.join(dir, e.name)));
    } else out.push(path.join(dir, e.name));
  }
  return out;
}

for (const root of ROOTS) {
  const abs = path.join(process.cwd(), root);
  for (const file of walk(abs)) {
    if (file.includes(VENDOR)) continue;
    if (!/\.(mdx|md|json|yaml|yml|txt)$/.test(file)) continue;
    const rel = path.relative(process.cwd(), file);
    // Draft / not-human-reviewed pages can carry owner-facing TODO prompts by
    // design (decisions.md D01): they can never ship, so this check does not
    // gate them — check:launch does. Renderable (published + reviewed) content
    // must pass cleanly.
    if (/\.(mdx|md)$/.test(file) && file.includes(path.join("content", "legal"))) {
      let fm: { status?: string; humanReviewed?: boolean } = {};
      try {
        fm = matter(fs.readFileSync(file, "utf8")).data as typeof fm;
      } catch {
        // unparseable → run the full scan
      }
      if (fm.status !== "published" || fm.humanReviewed !== true) continue;
    }
    const lines = fs.readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      if (PLACEHOLDER_BRACKETS.test(line)) fail(`${rel}:${i + 1}: mockup placeholder`);
      if (LOREM.test(line)) fail(`${rel}:${i + 1}: lorem ipsum`);
      if (TODO.test(line)) fail(`${rel}:${i + 1}: TODO marker ${line.trim().slice(0, 60)}`);
      if (FAKE_COUNTERS.test(line)) fail(`${rel}:${i + 1}: fake counter`);
    });
  }
}

if (failures > 0) {
  console.error(`\ncheck:placeholders FAILED — ${failures} problem(s)`);
  process.exit(1);
}
console.log("check:placeholders passed");
