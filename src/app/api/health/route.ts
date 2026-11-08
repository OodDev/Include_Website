import { NextResponse } from "next/server";

/** GET /api/health — deployment probe; no secrets, no personal data. */
export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    ok: true,
    service: "include-website",
    time: new Date().toISOString(),
  });
}
