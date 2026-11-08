import { NextResponse } from "next/server";
import { submitContact } from "@/lib/contact/submit";

/**
 * POST /api/contact — non-JS/programmatic fallback executing the same
 * validation pipeline as the Server Action (§10.2 progressive enhancement).
 */
export async function POST(request: Request): Promise<NextResponse> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json") && !contentType.includes("form")) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 415 });
  }

  let raw: unknown;
  if (contentType.includes("application/json")) {
    raw = await request.json().catch(() => null);
  } else {
    const form = await request.formData();
    raw = Object.fromEntries(form.entries());
  }

  if (request.headers.get("x-action") === "1") {
    // Do not accept the internal action marker from outside.
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const result = await submitContact(raw, request.headers);
  if (result.ok) return NextResponse.json(result, { status: 200 });
  const status = result.error === "rateLimit"
      ? 429
      : result.error === "altcha"
        ? 403
        : 400;
  const res = NextResponse.json(result, { status });
  if (result.error === "rateLimit") res.headers.set("retry-after", "600");
  return res;
}
