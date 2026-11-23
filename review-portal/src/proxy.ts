import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  GATE_COOKIE,
  GATE_PATH,
  gateCookieValue,
  gateEnabled,
  gatePage,
} from "@/lib/gate";

/** Next 16 proxy (= middleware): password gate for every page and asset. */
export default async function proxy(request: NextRequest) {
  if (!gateEnabled()) return NextResponse.next();

  const url = new URL(request.url);
  const submitted = url.pathname === GATE_PATH;
  if (!submitted) {
    const cookie = request.cookies.get(GATE_COOKIE)?.value;
    if (!cookie || cookie !== (await gateCookieValue())) {
      return new NextResponse(
        gatePage({
          next: url.pathname + url.search,
          denied: url.searchParams.get("gate") === "denied",
        }),
        {
          status: 401,
          headers: {
            "content-type": "text/html; charset=utf-8",
            "cache-control": "no-store",
            "x-robots-tag": "noindex, nofollow",
          },
        },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  // Everything behind the gate, including captures. Build output, brand marks
  // and fonts stay public so the password page can render before login.
  matcher: ["/((?!_next/static|_next/image|brand/|fonts/).*)"],
};
