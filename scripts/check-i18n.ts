/**
 * check:i18n — message key parity across locales and `{token}` placeholder
 * parity per key (§17). Exits 1 on missing/extra keys or mismatched tokens.
 */
import fs from "node:fs";
import path from "node:path";

const MESSAGES = path.join(process.cwd(), "messages");

let failures = 0;
const fail = (m: string) => {
  failures++;
  console.error(`✗ ${m}`);
};

type Tree = { [k: string]: Tree | string };

function flatten(tree: Tree, prefix = ""): Map<string, string> {
  const out = new Map<string, string>();
  for (const [k, v] of Object.entries(tree)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") out.set(key, v);
    else for (const [sk, sv] of flatten(v, key)) out.set(sk, sv);
  }
  return out;
}

const base = JSON.parse(fs.readFileSync(path.join(MESSAGES, "en.json"), "utf8")) as Tree;
const baseFlat = flatten(base);
const TOKEN = /\{[^{}]+\}/g;

for (const locale of ["en", ...fs.readdirSync(MESSAGES).filter((f) => f !== "en.json").map((f) => f.replace(".json", ""))]) {
  if (locale === "en") continue;
  const file = path.join(MESSAGES, `${locale}.json`);
  if (!fs.existsSync(file)) {
    fail(`missing messages/${locale}.json`);
    continue;
  }
  const flat = flatten(JSON.parse(fs.readFileSync(file, "utf8")) as Tree);
  for (const key of baseFlat.keys()) {
    if (!flat.has(key)) fail(`[en-only] ${locale}: missing key ${key}`);
  }
  for (const key of flat.keys()) {
    if (!baseFlat.has(key)) fail(`[extra] ${locale}: unknown key ${key}`);
  }
  for (const [key, en] of baseFlat) {
    const loc = flat.get(key);
    if (!loc) continue;
    const enTokens = (en.match(TOKEN) ?? []).sort().join(",");
    const locTokens = (loc.match(TOKEN) ?? []).sort().join(",");
    if (enTokens !== locTokens) {
      fail(`[tokens] ${locale} ${key}: en{${enTokens}} vs ${locale}{${locTokens}}`);
    }
  }
  console.log(`✓ messages: ${keyCount(flat)} keys checked for ${locale}`);
}
function keyCount(m: Map<string, string>): number {
  return m.size;
}

if (failures > 0) {
  console.error(`\ncheck:i18n FAILED — ${failures} problem(s)`);
  process.exit(1);
}
console.log("check:i18n passed");
