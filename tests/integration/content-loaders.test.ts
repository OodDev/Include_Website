import { describe, expect, it } from "vitest";
import { loadPage, loadLegal } from "@/lib/content/pages";
import { listNews } from "@/lib/content/loader";
import { listPartners, listResources } from "@/lib/content/data";
import type { AppLocale } from "@/config/locales";

const en: AppLocale = "en";

describe("content loaders (integration, real repo content)", () => {
  it("loads the English home page", async () => {
    const page = await loadPage(en, "home");
    expect(page).not.toBeNull();
    expect(page!.frontmatter.updated instanceof Date).toBe(true);
  });

  it("returns null for missing pages instead of throwing", async () => {
    expect(await loadPage(en, "does-not-exist")).toBeNull();
  });

  it("loads draft IT pages (draft preview routing)", async () => {
    const page = await loadPage("it", "the-project");
    expect(page).not.toBeNull();
  });

  it("loads legal pages with humanReviewed flags", async () => {
    const legal = await loadLegal(en, "privacy-policy");
    expect(legal).not.toBeNull();
    expect(legal!.frontmatter.humanReviewed).toBe(false);
  });

  it("returns an empty news list (no content yet, no errors)", async () => {
    expect(await listNews(en)).toEqual([]);
  });

  it("lists partners and resources from YAML data", async () => {
    expect((await listPartners()).length).toBe(6);
    expect((await listResources()).length).toBe(10);
  });
});
