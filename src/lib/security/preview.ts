/**
 * Code-level preview gate (decisions.md D17): one shared password for
 * client review on the free Hobby plan — Vercel native Password Protection
 * requires Pro. Active only when PREVIEW_PASSWORD is set; production deploys
 * simply don't configure it.
 *
 * No passwords or digests are ever logged. The cookie stores a SHA-256 digest
 * of the password (timing-safe comparison on fixed-length digests), never the
 * password itself.
 */

export const PREVIEW_COOKIE = "include_preview";
export const PREVIEW_GATE_PATH = "/api/preview-gate";

/**
 * Read from process.env (not the parsed config): env.ts parses once at module
 * load, so runtime updates — and Vitest suites that set the variable — would
 * be invisible. Schema validation (min length, type) still happens in env.ts.
 */
function configuredPassword(): string | undefined {
  return process.env.PREVIEW_PASSWORD || undefined;
}

/** True when the gate should be enforced for this deployment. */
export function previewGateEnabled(): boolean {
  return typeof configuredPassword() === "string";
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Cookie value derived from the configured password (not the password). */
export async function previewCookieValue(): Promise<string> {
  return sha256Hex(`include-preview:${configuredPassword() ?? ""}`);
}

/** Constant-shape comparison: compare fixed-length hex digests byte by byte. */
export async function verifyPreviewPassword(submitted: string): Promise<boolean> {
  if (!previewGateEnabled()) return true;
  const expected = await previewCookieValue();
  const actual = await sha256Hex(`include-preview:${submitted}`);
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ actual.charCodeAt(i);
  return diff === 0;
}

/**
 * Validates a "return to" target: same-site relative path only (no protocol
 * relative "//host", no scheme, no control characters) — open-redirect guard.
 */
export function safeNextPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\r\n\u0000]/.test(value)) {
    return "/";
  }
  return value;
}
