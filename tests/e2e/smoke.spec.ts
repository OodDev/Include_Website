import { expect, test } from "@playwright/test";

import { publishedLocales } from "@/config/locales";

/**
 * Core e2e smoke (§18): routes, navigation, language switch, consent banner,
 * 404 and the no-third-party guarantee (§11.1).
 */

const EN_ROUTES = [
  "/en",
  "/en/the-project",
  "/en/the-pathway",
  "/en/results-and-tools",
  "/en/ready-for-inclusion",
  "/en/partners",
  "/en/news",
  "/en/contact",
];

for (const route of EN_ROUTES) {
  test(`renders ${route} without third-party requests`, async ({ page, baseURL }) => {
    // Classify against the configured baseURL origin: during the initial
    // navigation page.url() is still "about:blank", so page.url() cannot be
    // used to decide "third-party" for the document request itself.
    const siteOrigin = new URL(baseURL ?? "http://localhost:3000").origin;
    const thirdParty: string[] = [];
    page.on("request", (req) => {
      if (new URL(req.url()).origin !== siteOrigin) thirdParty.push(req.url());
    });
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    expect(thirdParty).toEqual([]);
  });
}

test("HTML lang attribute matches the locale", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("language switch keeps the page and messages change", async ({ page }) => {
  // The switcher is hidden by design until >1 locale is fully humanReviewed (§2.3 #2).
  test.skip(publishedLocales.length < 2, "No second locale published yet — switcher intentionally hidden");
  await page.goto("/en/the-project");
  await page.getByRole("link", { name: /Italiano/ }).first().click();
  await expect(page).toHaveURL(/\/it\/the-project/);
  await expect(page.locator("html")).toHaveAttribute("lang", "it");
});

test("consent banner: accept records the choice, banner disappears", async ({ page }) => {
  await page.goto("/en");
  const banner = page.getByRole("region", { name: /Privacy choices|Privacy/i });
  await expect(banner).toBeVisible();
  await banner.getByRole("button", { name: /Accept all|Accetta tutto/i }).click();
  await expect(banner).toBeHidden();
  const stored = await page.evaluate(() => localStorage.getItem("include-consent"));
  expect(stored).toContain('"statistics":true');
});

test("consent banner: reject stores explicit refusal", async ({ page }) => {
  await page.goto("/en");
  const banner = page.getByRole("region", { name: /Privacy choices|Privacy/i });
  await banner.getByRole("button", { name: /Reject|non-essential|Rifiuta/i }).click();
  const stored = await page.evaluate(() => localStorage.getItem("include-consent"));
  expect(stored).toContain('"statistics":false');
});

test("consent banner: X closes without storing any consent", async ({ page }) => {
  await page.goto("/en");
  const banner = page.getByRole("region", { name: /Privacy choices|Privacy/i });
  await banner.getByRole("button", { name: /Close and continue/i }).click();
  await expect(banner).toBeHidden();
  const stored = await page.evaluate(() => localStorage.getItem("include-consent"));
  expect(stored).toBeNull();
});

test("cookie settings reopen from the footer and persist choices", async ({ page }) => {
  await page.goto("/en");
  // dismiss banner first
  await page.getByRole("region", { name: /Privacy choices|Privacy/i }).getByRole("button", { name: /Close and continue/i }).click();
  await page.getByRole("button", { name: /Cookie settings/i }).click();
  await page.getByRole("checkbox", { name: /Statistics/i }).check();
  await page.getByRole("button", { name: /Save choices/i }).click();
  const stored = await page.evaluate(() => localStorage.getItem("include-consent"));
  expect(stored).toContain('"statistics":true');
});

test("404 page renders for unknown routes", async ({ page }) => {
  const res = await page.goto("/en/does-not-exist");
  expect(res?.status()).toBe(404);
});

test("contact form shows the not-operational notice without env config", async ({ page }) => {
  await page.goto("/en/contact");
  await expect(page.locator("body")).toContainText(/not yet active|not operational|temporarily/i);
});
