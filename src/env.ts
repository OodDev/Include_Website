import { z } from "zod";

/**
 * Zod-validated environment (§3). Server and client split by NEXT_PUBLIC prefix.
 * Missing provider config → availability gates, never placeholder values in UI.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  SITE_ENV: z.enum(["development", "preview", "production"]).default("development"),

  NEXT_PUBLIC_SITE_URL: z
    .string()
    .default("http://localhost:3000")
    .transform((v) => v.replace(/\/+$/, "")),

  CONTACT_TO_EMAIL: z.email().optional(),
  CONTACT_ROUTING: z.string().optional(),

  MAIL_PROVIDER: z.enum(["smtp", "brevo"]).optional(),
  BREVO_API_KEY: z.string().optional(),
  BREVO_LIST_ID: z.string().optional(),
  SMTP_URL: z.string().optional(),
  NEWSLETTER_PROVIDER: z.string().optional(),

  ALTCHA_HMAC_KEY: z.string().optional(),

  /** Code-level preview gate password (D17): set on preview deployments only. */
  PREVIEW_PASSWORD: z.string().min(8).optional(),

  ANALYTICS_PROVIDER: z.enum(["none", "plausible", "matomo", "ga4"]).default("none"),
  PLAUSIBLE_DOMAIN: z.string().optional(),
  GA_MEASUREMENT_ID: z.string().optional(),

  GOOGLE_SITE_VERIFICATION: z.string().optional(),
  BING_SITE_VERIFICATION: z.string().optional(),
});

const parsed = envSchema.safeParse(
  process.env.NODE_ENV === "production" ? process.env : { ...process.env, NODE_ENV: process.env.NODE_ENV ?? "development" },
);

if (!parsed.success) {
  // Fail fast at startup; exact issues go to the server log only.
  console.error("[env] Environment validation failed:", parsed.error.flatten());
  throw new Error("Invalid environment variables — see server log");
}

const config = parsed.data; // narrow: safeParse failure throws above
export const env = {
  ...process.env,
  ...config,
};
export type Env = typeof config;

/** True when email delivery is configured (§6.9 availability gate). */
export function mailConfigured(): boolean {
  if (!config.MAIL_PROVIDER) return false;
  return config.MAIL_PROVIDER === "brevo"
    ? Boolean(config.BREVO_API_KEY)
    : Boolean(config.SMTP_URL);
}

export function isProductionSite(): boolean {
  return config.SITE_ENV === "production";
}
