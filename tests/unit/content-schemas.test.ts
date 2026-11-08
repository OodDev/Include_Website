import { describe, expect, it } from "vitest";
import { newsFrontmatterSchema } from "@/lib/content/schemas";
import { pageDocSchema } from "@/lib/content/pages";
import { emptyConsent } from "@/lib/security/consent";

describe("content schemas", () => {
  it("accepts ISO datetime AND plain dates for `updated` (gray-matter emits Date objects)", () => {
    const dateLike = new Date("2026-11-08T00:00:00.000Z");
    const parsed = pageDocSchema.safeParse({ status: "published", updated: dateLike });
    expect(parsed.success).toBe(true);
  });

  it("rejects pages without a valid `status`", () => {
    const parsed = pageDocSchema.safeParse({ updated: "2026-11-08" });
    expect(parsed.success).toBe(false);
  });

  it("news frontmatter requires consent for participant stories", () => {
    const base = {
      title: "A story",
      slug: "a-story",
      locale: "en",
      excerpt: "Excerpt text long enough for schema validation.",
      category: "pilot-stories",
      date: new Date("2026-05-01"),
      status: "published",
    };
    // Ethical guard (§6.6): pilot stories without verified consent must fail.
    const without = newsFrontmatterSchema.safeParse(base);
    expect(without.success).toBe(false);
    const ok = newsFrontmatterSchema.safeParse({ ...base, consentVerified: true });
    expect(ok.success).toBe(true);
  });

  it("consent defaults deny everything non-essential", () => {
    expect(emptyConsent).toEqual({ necessary: true, statistics: false, embedded: false });
  });
});
