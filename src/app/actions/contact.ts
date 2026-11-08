"use server";

import { headers } from "next/headers";
import { submitContact } from "@/lib/contact/submit";
import type { ContactResult } from "@/lib/contact/submit";

/**
 * Server Action behind the contact form.
 * The core logic lives in lib/contact so the /api/contact fallback route
 * reuses exactly the same validation path.
 */
export async function sendContactMessage(_prev: ContactResult | null, formData: FormData): Promise<ContactResult> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    organisation: formData.get("organisation") ?? "",
    country: formData.get("country") ?? "",
    audience: formData.get("audience") ?? undefined,
    message: formData.get("message"),
    privacy: formData.get("privacy"),
    newsletter: formData.get("newsletter") === "on",
    website: formData.get("website") ?? "",
    altcha: formData.get("altcha"),
  };

  let h: Headers;
  try {
    h = await headers();
  } catch {
    h = new Headers();
  }
  return submitContact(raw, h);
}
