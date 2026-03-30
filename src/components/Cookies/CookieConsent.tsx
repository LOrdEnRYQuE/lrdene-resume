"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useMutation } from "convex/react";
import LocaleLink from "@/components/I18n/LocaleLink";
import { api } from "../../../convex/_generated/api";
import { useLocale } from "@/lib/i18n/useLocale";
import {
  COOKIE_CONSENT_EVENT,
  COOKIE_CONSENT_VERSION,
  type CookieConsent as CookieConsentModel,
  getOrCreateConsentFingerprint,
  readCookieConsent,
  writeCookieConsent,
} from "@/lib/cookies/consent";
import styles from "./CookieConsent.module.css";

function buildConsent(analytics: boolean, source: CookieConsentModel["source"]): CookieConsentModel {
  return {
    essential: true,
    analytics,
    marketing: false,
    updatedAt: new Date().toISOString(),
    source,
  };
}

function clearAnalyticsClientState() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("lrdene_session_id");
  window.localStorage.removeItem("lrdene_first_touch");
  window.localStorage.removeItem("lrdene_last_touch");
  window.localStorage.removeItem("lrdene_landing_page");
}

export default function CookieConsent() {
  const pathname = usePathname();
  const locale = useLocale();
  const recordCookieConsent = useMutation(api.analytics.recordCookieConsent);
  const [open, setOpen] = useState(false);
  const [consent, setConsent] = useState<CookieConsentModel | null>(null);
  const copy = useMemo(
    () =>
      locale === "de"
        ? {
            title: "Cookie-Einstellungen",
            body: "Wir verwenden notwendige Cookies. Analyse-Cookies helfen uns, die Website zu verbessern. Du kannst jederzeit in den Cookie-Einstellungen ändern.",
            reject: "Nur Notwendig",
            acceptAnalytics: "Analyse Erlauben",
            acceptAll: "Alle Akzeptieren",
            policy: "Cookie-Richtlinie",
            openSettings: "Cookie Einstellungen",
          }
        : {
            title: "Cookie Settings",
            body: "We use essential cookies. Analytics cookies help us improve the website. You can change your choice anytime in cookie settings.",
            reject: "Essential Only",
            acceptAnalytics: "Allow Analytics",
            acceptAll: "Accept All",
            policy: "Cookie Policy",
            openSettings: "Cookie Settings",
          },
    [locale],
  );

  useEffect(() => {
    const existing = readCookieConsent();
    setConsent(existing);
    setOpen(!existing);

    const onConsentChanged = () => {
      const next = readCookieConsent();
      setConsent(next);
      if (next) setOpen(false);
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, onConsentChanged as EventListener);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onConsentChanged as EventListener);
  }, []);

  const applyConsent = (next: CookieConsentModel) => {
    if (!next.analytics) {
      clearAnalyticsClientState();
    }
    writeCookieConsent(next);
    setConsent(next);
    setOpen(false);
    void recordCookieConsent({
      consentVersion: COOKIE_CONSENT_VERSION,
      essential: next.essential,
      analytics: next.analytics,
      marketing: next.marketing,
      source: next.source,
      locale,
      route: pathname || "/",
      anonymizedSession: getOrCreateConsentFingerprint(),
      device: /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent) ? "mobile" : "desktop",
    }).catch(() => {
      // Consent action should never fail the UI flow.
    });
  };

  const showSettingsTrigger = Boolean(consent) && !open;
  if (!open && !showSettingsTrigger) return null;

  return (
    <div className={styles.wrap}>
      {open ? (
        <div className={styles.card} role="dialog" aria-live="polite" aria-label={copy.title}>
          <p className={styles.title}>{copy.title}</p>
          <p className={styles.copy}>
            {copy.body}{" "}
            <LocaleLink href="/cookies" style={{ textDecoration: "underline" }}>
              {copy.policy}
            </LocaleLink>
          </p>
          <div className={styles.actions}>
            <button type="button" className={styles.btn} onClick={() => applyConsent(buildConsent(false, consent ? "settings" : "banner"))}>
              {copy.reject}
            </button>
            <button
              type="button"
              className={styles.btn}
              onClick={() =>
                applyConsent({
                  ...buildConsent(true, consent ? "settings" : "banner"),
                  marketing: false,
                })
              }
            >
              {copy.acceptAnalytics}
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() =>
                applyConsent({
                  ...buildConsent(true, consent ? "settings" : "banner"),
                  marketing: true,
                })
              }
            >
              {copy.acceptAll}
            </button>
          </div>
        </div>
      ) : null}

      {showSettingsTrigger ? (
        <button type="button" className={styles.settingsTrigger} onClick={() => setOpen(true)}>
          {copy.openSettings}
        </button>
      ) : null}
    </div>
  );
}
