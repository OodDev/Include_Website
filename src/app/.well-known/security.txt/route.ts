import { env } from "@/env";
import { siteConfig } from "@/config/site";

/**
 * /.well-known/security.txt (§11.6): responsible disclosure. Contact stays a
 * TODO until the owner supplies the official security mailbox (no invention).
 */
export function GET(): Response {
  const base = env.NEXT_PUBLIC_SITE_URL;
  const lines = [
    `Contact: mailto:${contactUri()}`,
    `Expires: ${siteConfig.security.expires}`,
    "Preferred-Languages: en, it",
    `Canonical: ${base}/.well-known/security.txt`,
    "Policy: personal data and security reports are handled confidentially; only keep what is needed to respond.",
  ];
  return new Response(lines.join("\n") + "\n", {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=86400" },
  });
}

function contactUri(): string {
  const configured = siteConfig.security.contact;
  return configured && configured !== "#" ? configured : "security@example.org.invalid";
}
