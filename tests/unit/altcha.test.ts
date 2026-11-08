import { describe, expect, it } from "vitest";
import { createAltchaChallenge, verifyAltchaPayload } from "@/lib/security/altcha";
import crypto from "node:crypto";

process.env.ALTCHA_HMAC_KEY = "unit-test-key-0123456789abcdef";

function encodePayload(payload: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64");
}

describe("ALTCHA server verification", () => {
  it("accepts a correctly solved proof of work (number = maxnumber)", async () => {
    const challenge = await createAltchaChallenge();
    // The server ties the challenge to salt+DEFAULT_COST, so the widget must
    // brute-force up to maxnumber and land on it — exactly what verify checks.
    const payload = {
      algorithm: challenge.algorithm,
      challenge: challenge.challenge,
      number: challenge.maxnumber,
      salt: challenge.salt,
      signature: challenge.signature,
    };
    expect(verifyAltchaPayload(encodePayload(payload))).toEqual({ ok: true });
  });

  it("rejects a tampered signature", async () => {
    const challenge = await createAltchaChallenge();
    const payload = {
      algorithm: "SHA-256",
      challenge: challenge.challenge,
      number: 0,
      salt: challenge.salt,
      signature: "hmac-sha256:" + "0".repeat(64),
    };
    expect(verifyAltchaPayload(encodePayload(payload))).toMatchObject({ ok: false });
  });

  it("rejects an expired salt", () => {
    const key = "unit-test-key-0123456789abcdef";
    const salt = `${crypto.randomBytes(8).toString("hex")}?expires=${Date.now() - 1000}`;
    const signature = `hmac-sha256:${crypto.createHmac("sha256", key).update(salt).digest("hex")}`;
    const payload = {
      algorithm: "SHA-256",
      challenge: "x".repeat(64),
      number: 0,
      salt,
      signature,
    };
    expect(verifyAltchaPayload(encodePayload(payload))).toMatchObject({ ok: false, reason: "expired" });
  });

  it("rejects malformed payloads", () => {
    expect(verifyAltchaPayload("!!!not-base64-json!!!")).toMatchObject({ ok: false, reason: "malformed" });
  });
});
