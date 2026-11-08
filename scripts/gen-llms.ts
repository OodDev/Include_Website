/**
 * gen:llms — snapshot the /llms.txt + /llms-full.txt route responses into
 * dist/ for deployments/mirrors that need static files. Requires the site
 * running at BASE_URL (default http://localhost:3000, e.g. pnpm dev).
 * The route handlers (src/app/llms.txt/route.ts) remain the canonical source.
 */
import fs from "node:fs";
import path from "node:path";

async function main() {
  const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
  const dist = path.join(process.cwd(), "dist");
  fs.mkdirSync(dist, { recursive: true });

  for (const name of ["llms.txt", "llms-full.txt"]) {
    const res = await fetch(`${BASE_URL}/${name}`);
    if (!res.ok) {
      console.error(
        `gen:llms FAILED — ${BASE_URL}/${name} responded ${res.status} (was the server running at BASE_URL?)`,
      );
      process.exit(1);
    }
    const body = await res.text();
    fs.writeFileSync(path.join(dist, name), body, "utf8");
    console.log(`✓ dist/${name} (${body.length} bytes from ${BASE_URL}/${name})`);
  }
}
void main();
