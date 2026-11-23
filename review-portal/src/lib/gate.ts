/**
 * Code-level gate for the client portal (same pattern as the main site's
 * preview gate, decisions.md D19). Active only when PREVIEW_PASSWORD is set;
 * local development works without it.
 */

export const GATE_COOKIE = "include_portal";
export const GATE_PATH = "/api/gate";

function configuredPassword(): string | undefined {
  return process.env.PREVIEW_PASSWORD || undefined;
}

export function gateEnabled(): boolean {
  return typeof configuredPassword() === "string";
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function gateCookieValue(): Promise<string> {
  return sha256Hex(`include-portal:${configuredPassword() ?? ""}`);
}

export async function verifyGatePassword(submitted: string): Promise<boolean> {
  if (!gateEnabled()) return true;
  const expected = await gateCookieValue();
  const actual = await sha256Hex(`include-portal:${submitted}`);
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) diff |= expected.charCodeAt(i) ^ actual.charCodeAt(i);
  return diff === 0;
}

/** Same-site relative path only — open-redirect guard. */
export function safeNextPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\r\n\u0000]/.test(value)) {
    return "/";
  }
  return value;
}

export function gatePage(options: { next: string; denied: boolean }): string {
  const action = `${GATE_PATH}?next=${encodeURIComponent(options.next)}`;
  const error = options.denied
    ? '<p class="error" role="alert">Password errata. Riprovate o scriveteci.</p>'
    : "";
  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>INCLUDE — Area riservata</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  @font-face { font-family: "Outfit"; font-style: normal; font-weight: 300 700; font-display: swap;
               src: url("/fonts/outfit-latin.woff2") format("woff2"); }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px;
         background: #08767c; color: #f3f3f1;
         font-family: "Outfit", ui-sans-serif, system-ui, sans-serif; }
  main { width: 100%; max-width: 380px; }
  h1 { font-size: 30px; line-height: 1.05; letter-spacing: -.02em; margin: 10px 0 8px; font-weight: 600; }
  p { font-size: 15px; line-height: 1.5; margin: 0 0 22px; color: rgba(255,255,255,.82); }
  form { background: #fff; color: #465056; border-radius: 24px; padding: 24px; }
  label { display: block; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; font-weight: 600; margin-bottom: 8px; }
  input { width: 100%; border: 1px solid rgba(70,80,86,.25); border-radius: 12px; padding: 13px 14px;
          font: inherit; font-size: 16px; color: #465056; background: #fff; }
  input:focus { outline: 2px solid #08767c; outline-offset: 1px; border-color: #08767c; }
  button { width: 100%; margin-top: 14px; border: 0; border-radius: 999px; padding: 13px 16px;
           background: #c14723; color: #fff; font: inherit; font-size: 15px; font-weight: 600; cursor: pointer; }
  button:hover { background: #a93d1e; }
  .error { color: #b2252f; font-size: 14px; margin: 12px 0 0; }
  .foot { margin: 18px 0 0; font-size: 12px; color: rgba(255,255,255,.62); }
</style>
</head>
<body>
<main>
  <img src="/brand/include-logo-white.svg" alt="INCLUDE" style="height:26px;width:auto;margin-bottom:18px">
  <h1>Centro richieste<br>di modifica</h1>
  <p>Inserite la password che vi abbiamo inviato per aprire l’area di revisione.</p>
  <form method="POST" action="${action}">
    <label for="password">Password</label>
    <input id="password" type="password" name="password" autocomplete="current-password" required autofocus>
    <button type="submit">Entra</button>
    ${error}
  </form>
  <p class="foot">I vostri file restano nel browser: nessun dato viene inviato a un server.</p>
</main>
</body>
</html>`;
}
