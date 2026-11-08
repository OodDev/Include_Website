import { z } from "zod";
import { verifyAltchaPayload } from "@/lib/security/altcha";
import { clientIp, rateLimit } from "@/lib/security/rateLimit";
import { deliverContactMessage } from "@/lib/mail";

/**
 * Contact submission core (§5 form security): Zod validation, honeypot,
 * ALTCHA proof-of-work, rate limiting, then adapter delivery.
 * Shared by the Server Action and the /api/contact fallback endpoint.
 */

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().max(254), // format checked below (plain email check)
  organisation: z.string().trim().max(160).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  audience: z
    .enum(["company", "vet", "researcher", "policymaker", "community", "other"])
    .optional()
    .or(z.literal("")),
  // No free "phone/telegram" fields → minimal data (§5 data minimisation).
  message: z.string().trim().min(10).max(4000),
  privacy: z.literal("on"),
  newsletter: z.boolean().optional().default(false),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot — must stay empty
  altcha: z.string().min(20),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactResult =
  | { ok: true }
  | { ok: false; fieldErrors?: string[]; error: "invalid" | "altcha" | "rateLimit" | "delivery" };

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function submitContact(
  raw: unknown,
  headers: Headers,
): Promise<ContactResult> {
  const ip = clientIp(headers);
  const limit = rateLimit(ip, "contact");
  if (!limit.ok) return { ok: false, error: "rateLimit" };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "invalid",
      fieldErrors: parsed.error.issues.map((i) => String(i.path[0] ?? "form")),
    };
  }
  const data = parsed.data;

  if (!emailRe.test(data.email)) return { ok: false, error: "invalid", fieldErrors: ["email"] };

  // Honeypot: bots filling the hidden field get a silent identical response.
  if (data.website) return { ok: true };

  const altcha = verifyAltchaPayload(data.altcha);
  if (!altcha.ok) return { ok: false, error: "altcha" };

  const { delivered } = await deliverContactMessage({
    name: data.name,
    email: data.email,
    organisation: data.organisation || undefined,
    country: data.country || undefined,
    audience: data.audience || undefined,
    message: data.message,
    wantsNewsletter: data.newsletter === true,
  });

  if (!delivered) return { ok: false, error: "delivery" };
  return { ok: true };
}
