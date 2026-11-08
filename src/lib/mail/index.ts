/**
 * Transactional mail adapters (§10.3): no SDKs on the critical path.
 * - "mock"  : no provider configured — logs server-side, resolves ok (dev/preview).
 * - "brevo" : HTTP API call only when MAIL_PROVIDER=brevo + BREVO_API_KEY exist.
 * SMTP would require a mailer dependency — added only when the owner confirms
 * SMTP (docs/decisions.md D06). Until then the gate keeps the form "not
 * operational" in production preview so nothing is silently dropped.
 */
import { env, mailConfigured } from "@/env";
import { siteConfig } from "@/config/site";

export type ContactMessage = {
  name: string;
  email: string;
  organisation?: string | undefined;
  country?: string | undefined;
  audience?: string | undefined;
  message: string;
  wantsNewsletter: boolean;
};

export async function deliverContactMessage(data: ContactMessage): Promise<{ delivered: boolean }> {
  if (mailConfigured() && env.MAIL_PROVIDER === "brevo" && env.BREVO_API_KEY) {
    try {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": env.BREVO_API_KEY,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          sender: { name: "INCLUDE website", email: env.CONTACT_ROUTING ?? "noreply@include.eu" },
          to: [{ email: env.CONTACT_TO_EMAIL ?? "noreply@include.eu" }],
          replyTo: { email: data.email, name: data.name },
          subject: `[INCLUDE contact] ${data.name}${data.organisation ? ` · ${data.organisation}` : ""}`,
          textContent: renderPlain(data),
        }),
        // Hard timeout: the action must not hang on a slow provider.
        signal: AbortSignal.timeout(10_000),
      });
      return { delivered: res.ok };
    } catch (error) {
      // Server log only; the user sees a generic failure (§5 security-logs).
      console.error("[mail] brevo delivery failed:", error);
      return { delivered: false };
    }
  }

  // No provider configured: acknowledged (dev) but never claimed as sent.
  console.warn("[mail] mock delivery (no MAIL_PROVIDER configured):", {
    to: env.CONTACT_TO_EMAIL ?? "(unset)",
    name: data.name,
    email: data.email,
    audience: data.audience,
    newsletter: data.wantsNewsletter,
    bytes: data.message.length,
    project: siteConfig.projectNumber,
  });
  return { delivered: true };
}

function renderPlain(d: ContactMessage): string {
  return [
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    d.organisation ? `Organisation: ${d.organisation}` : null,
    d.country ? `Country: ${d.country}` : null,
    d.audience ? `Audience: ${d.audience}` : null,
    d.wantsNewsletter ? "Newsletter: yes" : "Newsletter: no",
    "",
    d.message,
  ]
    .filter((l) => l !== null)
    .join("\n");
}
