import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

/**
 * OG image generator (§9.1). Route: /og/... matching the canonical path of the
 * page, e.g. /og/the-project → 1200×630 PNG. Neutral brand treatment only:
 * typographic composition + the petro palette from tokens.css — no logo until
 * the owner ships real assets (§2.4.2, no-fabrication).
 */
export const runtime = "nodejs";

// Re-validate rarely; og images change only with copy updates.
export const revalidate = 3600;

export async function GET(_request: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) {
  const { path } = await ctx.params;

  // Human label derived from the path — no translating at image time since
  // messages would need a request context. The brand wordmark carries meaning.
  const label = path?.length ? decodeURIComponent(path[path.length - 1]!).replace(/-/g, " ") : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0F2F4B",
          color: "#FFFFFF",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 16, height: 44, backgroundColor: "#068A92", borderRadius: 8 }} />
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: 2 }}>INCLUDE</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 74, lineHeight: 1.1, fontWeight: 800, maxWidth: 900 }}>
            {label ? `INCLUDE · ${label}` : "INCLUDE – From protected paths to real jobs"}
          </div>
          <div style={{ fontSize: 34, color: "#9FBBC9" }}>From protected paths to real jobs · Erasmus+ KA220-VET</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
