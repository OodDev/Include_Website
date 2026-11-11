import { afterAll, describe, expect, it } from "vitest";
import {
  PREVIEW_COOKIE,
  previewCookieValue,
  previewGateEnabled,
  safeNextPath,
  verifyPreviewPassword,
} from "@/lib/security/preview";

const saved = process.env.PREVIEW_PASSWORD;
afterAll(() => {
  if (saved === undefined) delete process.env.PREVIEW_PASSWORD;
  else process.env.PREVIEW_PASSWORD = saved;
});

describe("preview gate", () => {
  it("is disabled without PREVIEW_PASSWORD and accepts everything", async () => {
    delete process.env.PREVIEW_PASSWORD;
    expect(previewGateEnabled()).toBe(false);
    expect(await verifyPreviewPassword("anything")).toBe(true);
  });

  it("verifies the correct password and rejects wrong ones", async () => {
    process.env.PREVIEW_PASSWORD = "correct-horse-battery";
    expect(previewGateEnabled()).toBe(true);
    expect(await verifyPreviewPassword("correct-horse-battery")).toBe(true);
    expect(await verifyPreviewPassword("wrong")).toBe(false);
    expect(await verifyPreviewPassword("")).toBe(false);
  });

  it("derives a cookie digest that is not the password itself", async () => {
    process.env.PREVIEW_PASSWORD = "correct-horse-battery";
    const digest = await previewCookieValue();
    expect(digest).not.toContain("correct-horse-battery");
    expect(digest).toMatch(/^[0-9a-f]{64}$/);
    // Digest is stable for the same password (cookie survives restarts).
    expect(await previewCookieValue()).toBe(digest);
  });

  it("cookie name stays stable (proxy + route must agree)", () => {
    expect(PREVIEW_COOKIE).toBe("include_preview");
  });

  it("safeNextPath allows only same-site relative paths", () => {
    expect(safeNextPath("/en/the-project")).toBe("/en/the-project");
    expect(safeNextPath("/en")).toBe("/en");
    expect(safeNextPath("//evil.example")).toBe("/");
    expect(safeNextPath("https://evil.example")).toBe("/");
    expect(safeNextPath("/en?x=\nSet-Cookie")).toBe("/");
    expect(safeNextPath(null)).toBe("/");
    expect(safeNextPath(undefined)).toBe("/");
    expect(safeNextPath("")).toBe("/");
  });
});
