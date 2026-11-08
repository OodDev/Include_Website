import { describe, expect, it } from "vitest";
import { brand } from "@/config/brand";
import fs from "node:fs";
import path from "node:path";

describe("brand.ts ↔ tokens.css parity (§4)", () => {
  it("every brand constant exists as an exact hex in the design tokens", () => {
    const css = fs.readFileSync(
      path.resolve(__dirname, "../../src/styles/tokens.css"),
      "utf8",
    );
    for (const [name, hex] of Object.entries(brand)) {
      expect(css.includes(hex.toUpperCase() as string) || css.includes(hex.toLowerCase() as string),
        `brand ${name} (${hex}) missing from tokens.css`,
      ).toBe(true);
    }
  });
});
