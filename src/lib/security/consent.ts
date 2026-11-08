/**
 * Consent management (§11.2). v1 ships zero non-essential storage and zero
 * third-party scripts, so no banner appears; the preferences panel + footer
 * "Cookie settings" still exist. Non-essential categories become opt-in
 * toggle placeholders that only activate if such services are configured.
 */
export const CONSENT_POLICY_VERSION = "2026-11-08.1";
export const CONSENT_STORAGE_KEY = "include-consent";

export type ConsentCategory = "statistics" | "embedded";
export type ConsentCategories = "necessary" | ConsentCategory;
export type ConsentRecord = {
  necessary: true;
  statistics: boolean;
  embedded: boolean;
  timestamp: string;
  policyVersion: string;
};

export const emptyConsent: Omit<ConsentRecord, "timestamp" | "policyVersion"> = {
  necessary: true,
  statistics: false,
  embedded: false,
};

export function readConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentRecord>;
    if (
      parsed.policyVersion !== CONSENT_POLICY_VERSION ||
      typeof parsed.statistics !== "boolean" ||
      typeof parsed.embedded !== "boolean"
    ) {
      // policy changed → expired consent, must be re-prompted (§11.2)
      return null;
    }
    return parsed as ConsentRecord;
  } catch {
    return null;
  }
}

export function writeConsent(categories: Omit<ConsentRecord, "timestamp" | "policyVersion" | "necessary">): ConsentRecord {
  const record: ConsentRecord = {
    necessary: true,
    ...categories,
    timestamp: new Date().toISOString(),
    policyVersion: CONSENT_POLICY_VERSION,
  };
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  // Category event for the gated loader (no third-party scripts exist in v1)
  window.dispatchEvent(new CustomEvent("include:consent", { detail: record }));
  return record;
}
