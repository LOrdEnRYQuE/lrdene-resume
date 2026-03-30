export const COOKIE_CONSENT_STORAGE_KEY = "lrdene_cookie_consent_v1";
export const COOKIE_CONSENT_EVENT = "lrdene:cookie-consent-changed";
export const COOKIE_CONSENT_FINGERPRINT_KEY = "lrdene_cookie_consent_fp_v1";
export const COOKIE_CONSENT_VERSION = "v1";

export type CookieConsent = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
  source: "banner" | "settings";
};

export function readCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CookieConsent;
    if (parsed && parsed.essential === true && typeof parsed.analytics === "boolean" && typeof parsed.marketing === "boolean") {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

export function writeCookieConsent(consent: CookieConsent) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(consent));
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: consent }));
}

export function hasAnalyticsConsent() {
  const consent = readCookieConsent();
  return Boolean(consent?.analytics);
}

export function hasMarketingConsent() {
  const consent = readCookieConsent();
  return Boolean(consent?.marketing);
}

export function getOrCreateConsentFingerprint() {
  if (typeof window === "undefined") return "";
  const existing = window.localStorage.getItem(COOKIE_CONSENT_FINGERPRINT_KEY);
  if (existing) return existing;
  const value = `cfp-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
  window.localStorage.setItem(COOKIE_CONSENT_FINGERPRINT_KEY, value);
  return value;
}
