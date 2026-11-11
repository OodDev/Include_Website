import { NextResponse, type NextRequest } from "next/server";
import {
  PREVIEW_COOKIE,
  previewCookieValue,
  previewGateEnabled,
  safeNextPath,
  verifyPreviewPassword,
} from "@/lib/security/preview";

/**
 * POST /api/preview-gate — form target for the code-level preview gate (D17).
 * Validates the shared password, sets an httpOnly cookie, redirects back to
 * the originally requested page. Wrong password → back to the page with
 * ?preview=denied so the gate form can show an error. No bodies are logged.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const next = safeNextPath(request.nextUrl.searchParams.get("next"));

  if (!previewGateEnabled()) {
    // Gate not configured: nothing to authenticate against — back to site.
    return NextResponse.redirect(new URL(next, request.url), { status: 303 });
  }

  const form = await request.formData().catch(() => null);
  const submitted = typeof form?.get("password") === "string" ? String(form.get("password")) : "";

  if (submitted && (await verifyPreviewPassword(submitted))) {
    const res = NextResponse.redirect(new URL(next, request.url), { status: 303 });
    res.cookies.set(PREVIEW_COOKIE, await previewCookieValue(), {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days of password-free browsing
    });
    return res;
  }

  const denied = new URL(next, request.url);
  denied.searchParams.set("preview", "denied");
  return NextResponse.redirect(denied, { status: 303 });
}
