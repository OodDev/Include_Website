import { describe, expect, it } from "vitest";
import { buildMetadata } from "@/lib/seo/metadata";

describe("buildMetadata (§9.1)", () => {
  const md = buildMetadata({
    locale: "it",
    route: "/the-project",
    title: "Il progetto",
    description: "Descrizione del progetto INCLUDE per origini sociali.",
  });

  it("builds a self-canonical URL on the single production origin", () => {
    const canonical = (md.alternates as { canonical?: string }).canonical;
    expect(canonical).toMatch(new RegExp(`^https?://[^/]+/it/the-project$`));
  });

  it("emits hreflang alternates for published locales only + x-default", () => {
    const languages = (md.alternates as { languages?: Record<string, string> }).languages ?? {};
    expect(languages["x-default"]).toBeTruthy();
    expect(Object.keys(languages)).toContain("en");
  });

  it("marks index:false outside production", () => {
    expect((md.robots as { index?: boolean }).index).toBe(false);
  });

  it("caps titles at 60 characters", () => {
    expect(String(md.title).length).toBeLessThanOrEqual(60);
  });
});
