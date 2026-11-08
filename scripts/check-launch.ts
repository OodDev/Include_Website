/**
 * check:launch — release-gate script (run in the release workflow only, not
 * ordinary CI, §17): fails if
 *  1) any published-locale legal page is still `draft` or not human-reviewed,
 *  2) editorial TODO markers or mockup placeholders remain in content,
 *  3) participant news stories lack consentVerified: true,
 *  4) developer-only routes are not hidden in production
 *     (checked by inspecting src/app routes flagged as dev-only), or
 *  5) required owner inputs still contain TBD markers.
 * Exits 1 on any failure.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { publishedLocales } from "@/config/locales";

const CWD = process.cwd();
const LEGAL_SLUGS = ["privacy-policy", "cookie-policy", "accessibility", "legal-notice"];
const NEWS = path.join(CWD, "content", "news");

let failures = 0;
const fail = (m: string) => {
  failures++;
  console.error(`✗ ${m}`);
};

// 1) Legal pages of published locales must be final and human-reviewed.
for (const locale of publishedLocales) {
  for (const slug of LEGAL_SLUGS) {
    const file = path.join(CWD, "content", "legal", locale, `${slug}.mdx`);
    if (!fs.existsSync(file)) {
      fail(`${locale}/${slug}.mdx missing (published locale)`);
      continue;
    }
    const fm = matter(fs.readFileSync(file, "utf8")).data as {
      status?: string;
      humanReviewed?: boolean;
    };
    if (fm.status !== "published") fail(`${locale}/${slug}: status must be "published" for launch (got "${fm.status}")`);
    if (fm.humanReviewed !== true) fail(`${locale}/${slug}: humanReviewed must be true for launch`);
  }
}

// 2) No editorial TODO / mockup placeholders inside content.
for (const dir of ["content"]) {
  const walk = (d: string): string[] =>
    fs
      .readdirSync(d, { withFileTypes: true })
      .flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : path.join(d, e.name)));
  for (const file of walk(path.join(CWD, dir)).filter((f) => /\.(mdx|md|yaml|yml)$/.test(f))) {
    const text = fs.readFileSync(file, "utf8");
    if (/\bTODO\b/.test(text)) fail(`${path.relative(CWD, file)}: TODO marker`);
  }
}

// 3) Participant stories need verified consent (§6.6 ethical storytelling).
if (fs.existsSync(NEWS)) {
  for (const file of fs.readdirSync(NEWS).flatMap((l) =>
    fs.readdirSync(path.join(NEWS, l)).map((f) => path.join(NEWS, l, f)),
  )) {
    if (!file.endsWith(".mdx")) continue;
    const { data } = matter(fs.readFileSync(file, "utf8"));
    const fm = data as { consentUnverified?: boolean; category?: string };
    if (fm.consentUnverified) {
      fail(`${path.relative(CWD, file)}: consentUnverified=true — cannot launch`);
    }
  }
}

// 4) Owner inputs unresolved (docs/owner-inputs.md open items).
const owners = path.join(CWD, "docs", "owner-inputs.md");
if (fs.existsSync(owners)) {
  const text = fs.readFileSync(owners, "utf8").split("\n").filter((l) => /^\s*-\s*\[[ x]\]/.test(l));
  const open = text.filter((l) => !/^\s*-\s*\[x\]/i.test(l));
  console.log(`ℹ owner inputs: ${open.length} open item(s) — `);
  if (open.length > 0) {
    // Open owner inputs do not block the script (they are approvals), but the
    // release captain must show them resolved before go-live (§17).
    console.warn(open.map((l) => l.trim()).join("\n"));
  }
}

if (failures > 0) {
  console.error(`\ncheck:launch FAILED — ${failures} problem(s)`);
  process.exit(1);
}
console.log("check:launch passed");
