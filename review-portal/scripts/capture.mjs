#!/usr/bin/env node
/**
 * Captures the live INCLUDE site into static previews + section hotspots.
 *
 *   pnpm capture                       # uses .env.local, production URL
 *   PORTAL_CAPTURE_BASE=http://localhost:3100 pnpm capture
 *
 * The preview gate password is read from PREVIEW_PASSWORD (never printed).
 * Output: public/captures/<slug>-<device>.jpg and src/data/captures.json
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));

function loadEnv() {
  const file = path.join(root, ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}

loadEnv();

const pagesData = readJson("src/data/pages.json");
const base = (
  process.env.PORTAL_CAPTURE_BASE ||
  process.env.NEXT_PUBLIC_LIVE_SITE_URL ||
  "https://include-website-six.vercel.app"
).replace(/\/$/, "");
const password = process.env.PREVIEW_PASSWORD || "";
const locale = pagesData.locale || "en";
const only = process.env.PAGES ? new Set(process.env.PAGES.split(",")) : null;

const DEVICES = [
  { key: "desktop", viewport: { width: 1440, height: 900 }, isMobile: false },
  { key: "mobile", viewport: { width: 390, height: 844 }, isMobile: true },
];

const capturesDir = path.join(root, "public", "captures");
fs.mkdirSync(capturesDir, { recursive: true });

const manifest = {
  generatedAt: new Date().toISOString(),
  base,
  locale,
  pages: {},
};

async function login(page) {
  const response = await page
    .goto(`${base}/${locale}`, { waitUntil: "load", timeout: 45_000 })
    .catch(() => null);
  if (response && response.status() < 400) return;
  if (/\/api\/gate$|\/api\/preview-gate$/.test(page.url())) {
    // already on a gate page
  }
  const field = page.locator('input[type="password"]').first();
  if ((await field.count()) === 0) {
    if (password) throw new Error("Gate page not found: check the capture base URL.");
    return;
  }
  if (!password) throw new Error("The site is password-protected: set PREVIEW_PASSWORD.");
  await field.fill(password);
  await Promise.all([
    page.waitForLoadState("networkidle").catch(() => {}),
    page.locator('form button[type="submit"]').first().click(),
  ]);
}

async function settle(page) {
  // Trigger lazy images, then return to the top.
  await page.evaluate(async () => {
    document.querySelectorAll('section[class*="fixed"][class*="bottom-0"]').forEach((el) => el.remove());
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    window.scrollTo(0, 0);
    await document.fonts.ready;
  });
  await page.waitForTimeout(350);
}

function collectHotspots() {
  return () => {
    const doc = document.documentElement;
    const totalHeight = Math.max(doc.scrollHeight, document.body.scrollHeight);
    const viewportWidth = window.innerWidth;
    const nodes = Array.from(
      document.querySelectorAll("main > *, main section, header, footer, [data-section]"),
    );

    const raw = [];
    for (const el of nodes) {
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const height = rect.height;
      const width = rect.width;
      if (height < 48 || width < viewportWidth * 0.3) continue;
      if (top < -4) continue;
      const style = window.getComputedStyle(el);
      if (style.position === "fixed" || style.visibility === "hidden") continue;

      let label = (el.getAttribute("aria-label") || "").trim();
      if (!label) {
        const heading = el.querySelector("h1, h2, h3");
        label = (heading?.textContent || "").trim();
      }
      if (!label) {
        // Cards / stat rows have no heading: their concatenated text reads badly,
        // so describe the block instead of dumping every child label.
        const blocks = Array.from(el.children).filter(
          (child) => child.getBoundingClientRect().height > 40,
        );
        const list = el.querySelector("dl, ul, ol");
        const listItems = list ? list.children.length : 0;
        if (blocks.length >= 3 || listItems >= 3) {
          label = "Riquadri in evidenza";
        } else {
          const leaf = Array.from(el.querySelectorAll("*")).find(
            (node) => node.children.length === 0 && (node.textContent || "").trim(),
          );
          label = (leaf?.textContent || el.textContent || "").trim();
        }
      }
      label = label.replace(/\s+/g, " ").slice(0, 90);

      if (el.tagName === "HEADER") label = "Menu e intestazione";
      if (el.tagName === "FOOTER") label = "Footer — dati del progetto";

      raw.push({
        label: label || "Sezione della pagina",
        x: rect.left / viewportWidth,
        y: top / totalHeight,
        w: width / viewportWidth,
        h: height / totalHeight,
        area: width * height,
      });
    }

    raw.sort((a, b) => a.y - b.y || b.area - a.area);
    const labelCounts = new Map();
    const kept = [];
    for (const item of raw) {
      const duplicate = kept.some(
        (other) =>
          (other.label === item.label && Math.abs(other.y - item.y) < 0.01) ||
          (Math.abs(other.y - item.y) < 0.004 &&
            Math.abs(other.h - item.h) < 0.004 &&
            Math.abs(other.x - item.x) < 0.01),
      );
      if (duplicate) continue;
      kept.push(item);
      if (kept.length >= 14) break;
    }

    return kept.map((item, index) => {
      const seen = labelCounts.get(item.label) ?? 0;
      labelCounts.set(item.label, seen + 1);
      const label = seen > 0 ? `${item.label} (${seen + 1})` : item.label;
      return {
        id: `${label
          .toLowerCase()
          .normalize("NFKD")
          .replace(/[^\p{L}\p{N}]+/gu, "-")
          .replace(/^-|-$/g, "")
          .slice(0, 40) || "sezione"}-${index}`,
        label,
        rect: {
          x: Math.max(0, Math.min(1, item.x)),
          y: Math.max(0, Math.min(1, item.y)),
          w: Math.min(1, item.w),
          h: Math.min(1, item.h),
        },
      };
    });
  };
}

async function main() {
  console.log(`Capturing ${base}/${locale} …`);
  const browser = await chromium.launch();
  const targets = pagesData.pages.filter((page) => !only || only.has(page.slug));

  for (const device of DEVICES) {
    const context = await browser.newContext({
      viewport: device.viewport,
      deviceScaleFactor: 1,
      isMobile: device.isMobile,
      hasTouch: device.isMobile,
      locale: "en-GB",
      timezoneId: "Europe/Rome",
      userAgent: device.isMobile
        ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
        : undefined,
    });
    const page = await context.newPage();
    page.setDefaultTimeout(30_000);

    await login(page);

    for (const target of targets) {
      const url = `${base}/${locale}${target.path === "/" ? "" : target.path}`;
      const file = `/captures/${target.slug}-${device.key}.jpg`;
      try {
        const response = await page.goto(url, { waitUntil: "load", timeout: 45_000 });
        if (response && response.status() >= 400) throw new Error(`HTTP ${response.status()}`);
        await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
        await settle(page);
        const buffer = await page.screenshot({ type: "jpeg", quality: 84, fullPage: true });
        fs.writeFileSync(path.join(capturesDir, `${target.slug}-${device.key}.jpg`), buffer);
        const thumb = await page.screenshot({
          type: "jpeg",
          quality: 72,
          clip: {
            x: 0,
            y: 0,
            width: device.viewport.width,
            height: Math.min(device.viewport.height, await page.evaluate(() => document.documentElement.scrollHeight)),
          },
        });
        fs.writeFileSync(
          path.join(capturesDir, `${target.slug}-${device.key}-thumb.jpg`),
          thumb,
        );
        const hotspots = await page.evaluate(collectHotspots());
        const height = await page.evaluate(() => document.documentElement.scrollHeight);
        manifest.pages[target.path] = manifest.pages[target.path] || {};
        manifest.pages[target.path][device.key] = {
          file,
          thumb: `/captures/${target.slug}-${device.key}-thumb.jpg`,
          width: device.viewport.width,
          height,
          hotspots,
        };
        console.log(`  ✓ ${device.key.padEnd(7)} ${target.path} (${hotspots.length} sezioni)`);
      } catch (error) {
        console.warn(`  ! ${device.key} ${target.path}: ${error.message}`);
      }
    }

    await context.close();
  }

  await browser.close();
  fs.writeFileSync(
    path.join(root, "src/data/captures.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  console.log(`\nWrote ${path.relative(root, path.join(root, "src/data/captures.json"))}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
