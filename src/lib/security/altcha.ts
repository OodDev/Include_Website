import crypto from "node:crypto";
import { z } from "zod";

/**
 * Server side of ALTCHA proof-of-work (§11: reCAPTCHA/hCaptcha prohibited).
 *
 * Flow:
 *  1. GET /api/altcha returns a signed, expiring challenge (this module).
 *  2. The widget solves it (SHA-256 proof of work, no tracking).
 *  3. The submitted base64 payload is verified here before any processing.
 *
 * No personal data is created, read or stored in this exchange.
 */

const SAL_LENGTH = 12; // bytes of random salt
const EXPIRY_MS = 20 * 60 * 1000; // challenges are valid for 20 minutes
const DEFAULT_COST = 25_000; // maxnumber — keep light enough for low-end devices

export type AltchaChallenge = {
  algorithm: "SHA-256";
  challenge: string;
  maxnumber: number;
  salt: string;
  signature: string;
};

export type AltchaPayload = {
  algorithm: string;
  challenge: string;
  number: number;
  salt: string;
  signature?: string;
  took?: number;
};

function hmacKey(): string | undefined {
  return process.env.ALTCHA_HMAC_KEY || undefined;
}

export function altchaConfigured(): boolean {
  return Boolean(hmacKey()) && hmacKey()!.length >= 16;
}

function sign(value: string, key: string): string {
  return crypto.createHmac("sha256", key).update(value).digest("hex");
}

/** Signed, expiring challenge — matching the altcha.org challengeurl JSON format. */
export async function createAltchaChallenge(): Promise<AltchaChallenge> {
  const key = hmacKey();
  // Availability gate: without a real key we never emit fake challenges.
  if (!altchaConfigured()) throw new Error("[altcha] ALTCHA_HMAC_KEY not configured");

  const expires = Date.now() + EXPIRY_MS;
  const rawSalt = crypto.randomBytes(SAL_LENGTH).toString("hex");
  const saltWithExpiry = `${rawSalt}?expires=${expires}`;
  const signature = `hmac-sha256:${sign(saltWithExpiry, key!)}`;

  const challenge = crypto.createHash("sha256").update(saltWithExpiry + DEFAULT_COST).digest("hex");

  return {
    algorithm: "SHA-256",
    challenge,
    maxnumber: DEFAULT_COST,
    salt: saltWithExpiry,
    signature,
  };
}

function verifySignature(salt: string, signature: AltchaPayload["signature"]): boolean {
  const key = hmacKey();
  if (!key) return false;
  if (!signature) return false;
  const expected = `hmac-sha256:${sign(salt, key)}`;
  // timing-safe comparison of the injected form value
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Verify a widget payload: signature, expiry and the SHA-256 proof of work.
 * Returns a discriminated result the action can map to a user-facing message.
 */
export function verifyAltchaPayload(encoded: string): { ok: true } | { ok: false; reason: string } {
  const parsed = AltchaPayloadSchema.safeParse(base64Json(encoded));
  if (!parsed.success) return { ok: false, reason: "malformed" };
  const payload = parsed.data;

  const [salt, params] = payload.salt.split("?");
  const queryParams = new URLSearchParams(params ?? "");
  const expires = Number(queryParams.get("expires") ?? 0);
  if (!expires || Date.now() > expires) return { ok: false, reason: "expired" };
  // Sign the FULL salt exactly as createAltchaChallenge signed it (including
  // the ?expires param) — otherwise every genuine widget payload would fail.
  if (!verifySignature(payload.salt, payload.signature)) return { ok: false, reason: "tampered" };

  const signedSalt = `${salt}?${params ?? ""}`;
  const hash = crypto.createHash("sha256").update(`${signedSalt}${String(payload.number)}`).digest("hex");
  if (hash !== payload.challenge) return { ok: false, reason: "invalid" };

  return { ok: true };
}

function base64Json(value: string): unknown {
  try {
    return JSON.parse(Buffer.from(value, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

const AltchaPayloadSchema = z.object({
  algorithm: z.string().min(3),
  challenge: z.string().min(16),
  number: z.number().int().min(0).max(1e9),
  salt: z.string().min(4),
  signature: z.string().optional(),
  took: z.number().optional(),
});
