import { NextResponse } from "next/server";
import {
  GATE_COOKIE,
  gateCookieValue,
  gateEnabled,
  safeNextPath,
  verifyGatePassword,
} from "@/lib/gate";

export async function POST(request: Request) {
  if (!gateEnabled()) return NextResponse.redirect(new URL("/", request.url), 303);

  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  const next = safeNextPath(new URL(request.url).searchParams.get("next"));
  const valid = await verifyGatePassword(password);

  if (!valid) {
    const url = new URL(next.startsWith("/") ? next : "/", request.url);
    url.searchParams.set("gate", "denied");
    return NextResponse.redirect(url, 303);
  }

  const response = NextResponse.redirect(new URL(next, request.url), 303);
  response.cookies.set({
    name: GATE_COOKIE,
    value: await gateCookieValue(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
