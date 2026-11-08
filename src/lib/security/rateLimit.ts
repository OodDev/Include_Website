/**
 * Minimal in-memory fixed-window rate limiter (§11.5).
 * Sufficient for single-instance deployments; when the site runs multi-region
 * replace the store below with a shared one — the interface must stay the same.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

type Entry = { count: number; resetAt: number };

const hits = new Map<string, Entry>();

// Periodic cleanup so the map cannot grow unbounded.
const sweeper = setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of hits) {
    if (entry.resetAt <= now) hits.delete(key);
  }
}, WINDOW_MS);
if (typeof sweeper.unref === "function") sweeper.unref();

export function rateLimit(ip: string, route: string): { ok: boolean; retryAfterSec: number } {
  const key = `${route}:${ip}`;
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, retryAfterSec: 0 };
  }
  if (entry.count >= MAX_ATTEMPTS) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) };
  }
  entry.count += 1;
  return { ok: true, retryAfterSec: 0 };
}

/** Best-effort client IP for rate limiting only; never stored with the message. */
export function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return fwd || headers.get("x-real-ip") || "unknown";
}
