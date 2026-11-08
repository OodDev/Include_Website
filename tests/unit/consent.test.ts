import { describe, expect, it } from "vitest";
import {
  CONSENT_POLICY_VERSION,
  CONSENT_STORAGE_KEY,
  dismissWithoutConsent,
  readConsent,
  wasDismissedWithoutConsent,
  writeConsent,
} from "@/lib/security/consent";

describe("consent (§11.2)", () => {
  it("writes a full record with policy version + timestamp, nothing pre-ticked by default", () => {
    const record = writeConsent({ statistics: false, embedded: false });
    expect(record.necessary).toBe(true);
    expect(record.policyVersion).toBe(CONSENT_POLICY_VERSION);
    expect(!Number.isNaN(Date.parse(record.timestamp))).toBe(true);
    expect(readConsent()).toMatchObject({ statistics: false, embedded: false });
  });

  it("re-prompts when the policy version changed", () => {
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({
        necessary: true,
        statistics: true,
        embedded: true,
        timestamp: new Date().toISOString(),
        policyVersion: "0000-00-00.0",
      }),
    );
    expect(readConsent()).toBeNull();
  });

  it("re-prompts when the stored decision is older than 6 months", () => {
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({
        necessary: true,
        statistics: true,
        embedded: false,
        timestamp: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
        policyVersion: CONSENT_POLICY_VERSION,
      }),
    );
    expect(readConsent()).toBeNull();
  });

  it("closing with X stores no consent record and is not asked again this session", () => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    dismissWithoutConsent();
    expect(readConsent()).toBeNull(); // no silent consent
    expect(wasDismissedWithoutConsent()).toBe(true);
  });

  it("a later decision clears the dismissal flag", () => {
    dismissWithoutConsent();
    writeConsent({ statistics: true, embedded: false });
    expect(wasDismissedWithoutConsent()).toBe(false);
    expect(readConsent()?.statistics).toBe(true);
  });
});
