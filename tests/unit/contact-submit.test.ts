import { describe, expect, it } from "vitest";
import { submitContact } from "@/lib/contact/submit";

process.env.ALTCHA_HMAC_KEY = "unit-test-key-0123456789abcdef";

const headers = new Headers({ "x-forwarded-for": "198.51.100.10" });

// A valid base payload; each test mutates one field.
const valid = {
  name: "Ada Tester",
  email: "ada@example.org",
  organisation: "Example VET",
  country: "Netherlands",
  audience: "vet",
  message: "We would like to know more about the INCLUDE pathway.",
  privacy: "on",
  newsletter: false,
  website: "",
  altcha: "a".repeat(24),
};

describe("submitContact (§5)", () => {
  it("rejects invalid payloads with field errors (no mail sent)", async () => {
    const res = await submitContact({ ...valid, email: "nope" }, headers);
    expect(res).toMatchObject({ ok: false, error: "invalid", fieldErrors: ["email"] });
  });

  it("rejects when the privacy acknowledgement is missing", async () => {
    const res = await submitContact({ ...valid, privacy: "" }, headers);
    expect(res).toMatchObject({ ok: false, error: "invalid" });
  });

  it("rejects wrong ALTCHA payloads", async () => {
    const res = await submitContact({ ...valid, altcha: "x".repeat(30) }, headers);
    expect(res).toMatchObject({ ok: false, error: "altcha" });
  });

  it("silently accepts honeypot hits with an identical ok:true response", async () => {
    const res = await submitContact({ ...valid, website: "spam.example.org" }, headers);
    expect(res).toEqual({ ok: true });
  });

  it("rejects empty messages below the minimum length", async () => {
    const res = await submitContact({ ...valid, message: "short" }, headers);
    expect(res).toMatchObject({ ok: false, error: "invalid" });
  });
});
