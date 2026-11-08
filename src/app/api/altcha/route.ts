import { NextResponse } from "next/server";
import { altchaConfigured, createAltchaChallenge } from "@/lib/security/altcha";
import type { AltchaChallenge } from "@/lib/security/altcha";

/**
 * GET /api/altcha — signed proof-of-work challenge for the contact form widget.
 * 503 without a configured key: the UI gate renders "not yet active" (§6.9).
 */
export async function GET(): Promise<NextResponse> {
  if (!altchaConfigured()) {
    return NextResponse.json({ ok: false, reason: "not-configured" }, { status: 503 });
  }
  try {
    const challenge: AltchaChallenge = await createAltchaChallenge();
    // No-store: every request must get a fresh, single-use challenge chain.
    const res = NextResponse.json(challenge, {
      headers: { "cache-control": "no-store" },
    });
    return res;
  } catch (error) {
    console.error("[altcha] challenge error:", error);
    return NextResponse.json({ ok: false, reason: "server" }, { status: 500 });
  }
}
