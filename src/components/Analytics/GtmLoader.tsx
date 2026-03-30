"use client";

import { useEffect, useState } from "react";
import {
  COOKIE_CONSENT_EVENT,
  hasAnalyticsConsent,
  hasMarketingConsent,
} from "@/lib/cookies/consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    __LRDENE_GTM_ID?: string;
  }
}

const GTM_SCRIPT_ID = "lrdene-gtm-loader";

export default function GtmLoader() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const syncConsent = () => {
      setEnabled(hasAnalyticsConsent() || hasMarketingConsent());
    };
    syncConsent();
    window.addEventListener(COOKIE_CONSENT_EVENT, syncConsent as EventListener);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, syncConsent as EventListener);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const gtmId = window.__LRDENE_GTM_ID?.trim() || "";
    if (!/^GTM-[A-Z0-9]+$/i.test(gtmId)) return;
    if (document.getElementById(GTM_SCRIPT_ID)) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });

    const script = document.createElement("script");
    script.id = GTM_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
    document.head.appendChild(script);
  }, [enabled]);

  return null;
}
