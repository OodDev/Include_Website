#!/usr/bin/env node
/**
 * Local smoke test: logs in, creates a request, exports the ZIP and checks the
 * generated markdown. Requires the app running (pnpm start) and .env.local.
 *
 *   pnpm smoke            # screenshots in /tmp/include-portal-*.png
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { unzipSync, strFromU8 } from "fflate";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const base = process.env.PORTAL_SMOKE_BASE || "http://localhost:3200";
const password = process.env.PREVIEW_PASSWORD || "";

function loadEnv() {
  const file = path.join(root, ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}
loadEnv();

const failures = [];
const shots = [];

async function login(page) {
  await page.goto(base, { waitUntil: "load" });
  if (await page.locator('input[type="password"]').count()) {
    await page.locator('input[type="password"]').fill(process.env.PREVIEW_PASSWORD || password);
    await Promise.all([
      page.waitForLoadState("domcontentloaded"),
      page.locator('button[type="submit"]').click(),
    ]);
  }
  await page.getByRole("heading", { name: /Diteci cosa cambiare/i }).waitFor({ timeout: 20_000 });
}

async function shot(page, name) {
  const file = path.join(os.tmpdir(), `include-portal-${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  shots.push(file);
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    acceptDownloads: true,
    locale: "it-IT",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error" && !/401/.test(message.text())) errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await login(page);
  console.log("logged in");
  await shot(page, "1-start");

  // Step 1 → 2: Home
  console.log("choosing Home");
  await page.getByRole("button", { name: /^Home/ }).first().click();
  await page.waitForTimeout(400);
  await shot(page, "2-sections");

  // Step 2 → 3: first hotspot
  console.log("clicking hotspot");
  const hotspot = page.locator("button.hotspot").first();
  if ((await hotspot.count()) === 0) throw new Error("No hotspots rendered on Home");
  await hotspot.click();
  await page.waitForTimeout(300);

  // Fill a text request + real attachment
  await page.locator("#testoAttuale").fill("From protected paths to real jobs");
  await page.locator("#testoNuovo").fill("From protected pathways to real jobs");
  console.log("attaching png");
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==",
    "base64",
  );
  await page
    .locator('input[type="file"][accept*="image"]')
    .setInputFiles({ name: "logo.png", mimeType: "image/png", buffer: png });
  await page.waitForTimeout(300);
  await shot(page, "3-form");
  await page.getByRole("button", { name: /Aggiungi richiesta/ }).click();
  await page.waitForTimeout(500);
  await shot(page, "4-list");

  const listText = await page.locator("#richieste-title").locator("..").innerText();
  if (!/1 blocco/.test(listText)) failures.push("Request was not added to the list");
  await page.getByRole("button", { name: /Modifica Camb 001/ }).click();
  await page.waitForTimeout(300);
  if (!(await page.getByText("logo.png", { exact: true }).count())) {
    failures.push("Attachment was not listed");
  }
  await page.getByRole("button", { name: /Nuova invece/ }).click();
  await page.waitForTimeout(200);

  // Export
  console.log("exporting");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /^Esporta/ }).first().click();
  const download = await downloadPromise;
  const zipPath = path.join(os.tmpdir(), "include-portal-export.zip");
  await download.saveAs(zipPath);
  const entries = unzipSync(new Uint8Array(fs.readFileSync(zipPath)));
  const md = strFromU8(entries["richieste-modifiche.md"] || new Uint8Array());
  if (!md.includes("### Camb 001 —")) failures.push("Markdown lost the block heading");
  if (!md.includes("From protected pathways to real jobs")) {
    failures.push("Markdown lost the new text");
  }
  if (!entries["richieste-modifiche.json"]) failures.push("JSON state missing from ZIP");
  if (!Object.keys(entries).some((key) => key.startsWith("selezioni/"))) {
    failures.push("Selection crop missing from ZIP");
  }
  if (!Object.keys(entries).some((key) => key.startsWith("allegati/"))) {
    failures.push("Attachment missing from ZIP");
  }
  shots.push(zipPath);

  // Import round-trip in a clean browser profile
  console.log("importing");
  const importer = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: "it-IT" });
  const importPage = await importer.newPage();
  await login(importPage);
  await importPage
    .locator('input[type="file"][accept*="zip"]')
    .setInputFiles(zipPath);
  await importPage.getByRole("button", { name: /Aggiungi alla lista/ }).click();
  await importPage.waitForTimeout(600);
  const importedText = await importPage.locator("#richieste-title").locator("..").innerText();
  if (!/1 blocco/.test(importedText)) failures.push("Import did not restore the request");
  await importPage.getByRole("button", { name: /Modifica Camb 001/ }).click();
  await importPage.waitForTimeout(300);
  if (!(await importPage.getByText("logo.png", { exact: true }).count())) {
    failures.push("Import did not restore the attachment");
  }
  await shot(importPage, "6-import");
  await importer.close();

  // Mobile
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    locale: "it-IT",
  });
  const mobilePage = await mobile.newPage();
  await login(mobilePage);
  await shot(mobilePage, "5-mobile");

  if (errors.length) failures.push(`Console errors: ${errors.slice(0, 3).join(" | ")}`);

  await browser.close();

  console.log(`Screenshots: ${shots.join("\n  ")}`);
  if (failures.length) {
    console.error("\nFAILURES:");
    for (const failure of failures) console.error(` - ${failure}`);
    process.exitCode = 1;
  } else {
    console.log("\nSmoke test passed.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
