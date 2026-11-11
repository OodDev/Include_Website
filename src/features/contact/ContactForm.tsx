"use client";

import { useActionState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { sendContactMessage } from "@/app/actions/contact";
import type { ContactResult } from "@/lib/contact/submit";
import { Button } from "@/components/ui/Button";

/**
 * Progressive-enhancement contact form (§10.2): plain <form action>, works
 * without JS via the Server Action; non-JS clients can also POST /api/contact.
 * Honeypot + ALTCHA proof-of-work (no third-party captcha, §11).
 * `operational false` renders the availability-gate notice instead (§6.9).
 */
export function ContactForm({ operational, defaultAudience }: { operational: boolean; defaultAudience?: string }) {
  const tForm = useTranslations("contact.form") as unknown as (key: string) => string;
  const [state, formAction, pending] = useActionState<ContactResult | null, FormData>(sendContactMessage, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
    const el = document.getElementById("contact-status");
    if (el && state) el.focus({ preventScroll: false });
  }, [state]);

  if (!operational) {
    return (
      <p aria-live="polite" className="max-w-[60ch] rounded-card border border-slate/15 bg-paper p-6 text-[0.9375rem]">
        {tForm("notOperational")}
      </p>
    );
  }

  const status = state ? (!state.ok ? statusMessage(state.error, tForm) : tForm("success")) : "";

  return (
    <form ref={formRef} action={formAction} className="grid max-w-[52rem] gap-5" aria-describedby="contact-heading">
      {/* honeypot — hidden from real users and assistive tech */}
      <p aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
        <label htmlFor="company-website">Website (leave empty)</label>
        <input id="company-website" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </p>

      <div className="grid gap-2">
        <label htmlFor="cf-name" className="text-[0.875rem] font-bold">
          {tForm("name")} <span aria-hidden="true">*</span>
        </label>
        <input
          id="cf-name"
          name="name"
          required
          autoComplete="name"
          maxLength={120}
          aria-invalid={has(state, "name")}
          className={inputCls}
        />
        <FieldError state={state} field="name" fallback={tForm("errors.name")} />
      </div>

      <div className="grid gap-2 sm:grid-cols-2 sm:gap-5">
        <div className="grid gap-2">
          <label htmlFor="cf-email" className="text-[0.875rem] font-bold">
            {tForm("email")} <span aria-hidden="true">*</span>
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={254}
            aria-invalid={has(state, "email")}
            className={inputCls}
          />
          <FieldError state={state} field="email" fallback={tForm("errors.email")} />
        </div>
        <div className="grid gap-2">
          <label htmlFor="cf-org" className="text-[0.875rem] font-bold">
            {tForm("organisation")}
          </label>
          <input id="cf-org" name="organisation" maxLength={160} autoComplete="organization" className={inputCls} />
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 sm:gap-5">
        <div className="grid gap-2">
          <label htmlFor="cf-country" className="text-[0.875rem] font-bold">
            {tForm("country")}
          </label>
          <input id="cf-country" name="country" maxLength={80} autoComplete="country-name" className={inputCls} />
        </div>
        <div className="grid gap-2">
          <label htmlFor="cf-audience" className="text-[0.875rem] font-bold">
            {tForm("audience")}
          </label>
          <select id="cf-audience" name="audience" defaultValue={defaultAudience ?? ""} className={inputCls}>
            <option value="">—</option>
            <option value="company">{tForm("audienceOptions.company")}</option>
            <option value="vet">{tForm("audienceOptions.vet")}</option>
            <option value="researcher">{tForm("audienceOptions.researcher")}</option>
            <option value="policymaker">{tForm("audienceOptions.policymaker")}</option>
            <option value="community">{tForm("audienceOptions.community")}</option>
            <option value="other">{tForm("audienceOptions.other")}</option>
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="cf-message" className="text-[0.875rem] font-bold">
          {tForm("message")} <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={6}
          required
          maxLength={4000}
          aria-invalid={has(state, "message")}
          className={inputCls}
        />
        <p className="text-[0.8125rem] text-slate/60">{tForm("sensitive")}</p>
        <FieldError state={state} field="message" fallback={tForm("errors.message")} />
      </div>

      <label htmlFor="cf-privacy" className="flex gap-3 text-[0.9375rem]">
        <input id="cf-privacy" name="privacy" type="checkbox" required value="on" className={checkboxCls} />
        <span>{tForm("privacy")}</span>
      </label>
      <label htmlFor="cf-newsletter" className="flex gap-3 text-[0.9375rem]">
        <input id="cf-newsletter" name="newsletter" type="checkbox" value="on" className={checkboxCls} />
        <span>{tForm("newsletter")}</span>
      </label>

      {/* Self-contained proof-of-work widget; no external requests, no tracking. */}
      <altcha-widget
        challengeurl="/api/altcha"
        name="altcha"
        hidefooter
        strings={JSON.stringify({
          label: tForm("altcha.label"),
          verifying: tForm("altcha.verifying"),
          verified: tForm("altcha.verified"),
          error: tForm("altcha.error"),
        })}
      />

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={pending}>
          {pending ? tForm("submitting") : tForm("submit")}
        </Button>
        <p id="contact-status" role="status" aria-live="polite" tabIndex={-1} className="text-[0.9375rem] font-semibold">
          {status}
        </p>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-input border border-slate/20 bg-white px-4 py-3 text-[1rem] outline-none focus-visible:border-petrol-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-petrol-deep/40";
const checkboxCls = "mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0 accent-petrol-deep";

/** next-intl's TypedTranslations is internal; a loose callable keeps this readable. */
type T = (key: string) => string;function has(state: ContactResult | null, field: string) {
  return (state && !state.ok && (state.fieldErrors ?? []).includes(field)) === true ? true : undefined;
}

function FieldError({ state, field, fallback }: { state: ContactResult | null; field: string; fallback: string }) {
  if (!state || state.ok) return null;
  if (!(state.fieldErrors ?? []).includes(field)) return null;
  return (
    <p className="text-[0.8125rem] font-semibold text-rust">
      {fallback}
    </p>
  );
}

type ContactError = Extract<ContactResult, { ok: false }>["error"];
function statusMessage(error: ContactError, t: T) {
  return t(error === "rateLimit" ? "rateLimit" : "error");
}
