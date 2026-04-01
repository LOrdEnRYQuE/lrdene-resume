"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X, BadgePercent, ArrowRight, Copy, Check } from "lucide-react";
import LocaleLink from "@/components/I18n/LocaleLink";
import type { Locale } from "@/lib/i18n/config";
import styles from "./StartupOfferPopup.module.css";

const DISMISS_KEY = "lrdene_startup_offer_popup_dismissed_until";
const DISMISS_MS = 24 * 60 * 60 * 1000;
const SHOW_DELAY_MS = 1800;
const STARTUP_COUPON = "START50LRD";

type StartupOfferPopupProps = {
  locale: Locale;
};

export default function StartupOfferPopup({ locale }: StartupOfferPopupProps) {
  const isDe = locale === "de";
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const dismiss = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_MS));
    }
    setOpen(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const dismissedUntil = Number(window.localStorage.getItem(DISMISS_KEY) || "0");
    if (dismissedUntil > Date.now()) return;

    const timer = window.setTimeout(() => {
      setOpen(true);
    }, SHOW_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dismiss, open]);

  const copyCoupon = async () => {
    try {
      await navigator.clipboard.writeText(STARTUP_COUPON);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  if (!open) return null;

  return (
    <aside
      className={styles.card}
      role="dialog"
      aria-modal="false"
      aria-labelledby="startup-offer-popup-title"
    >
        <button
          type="button"
          className={styles.closeButton}
          onClick={dismiss}
          aria-label={isDe ? "Popup schließen" : "Close popup"}
          data-track-event="click_cta"
          data-track-label="Startup popup dismissed"
        >
          <X size={18} />
        </button>

        <div className={styles.media}>
          <Image
            src="/assets/startup-promo-popup.png"
            alt={isDe ? "Startup Webdesign Angebot" : "Startup web design offer"}
            fill
            sizes="(max-width: 760px) 92vw, 420px"
            priority={false}
            className={styles.image}
          />
        </div>

        <div className={styles.content}>
          <span className={styles.eyebrow}>
            <BadgePercent size={14} />
            {isDe ? "Startup Promotion" : "Startup Promotion"}
          </span>
          <h2 id="startup-offer-popup-title" className={styles.title}>
            {isDe
              ? "Bis zu 50% OFF Web Design für Startups und kleine Unternehmen"
              : "Up to 50% OFF Web Design for Startups and Small Businesses"}
          </h2>
          <p className={styles.copy}>
            {isDe
              ? "Für limitierte Slots gibt es ein Premium-Launch-Angebot mit mobile-first Umsetzung, SEO-Basis und schnellem Start."
              : "Limited slots available for a premium launch offer with mobile-first delivery, SEO foundations, and a fast start."}
          </p>

          <div className={styles.couponRow}>
            <div className={styles.couponCard}>
              <span className={styles.couponLabel}>{isDe ? "Coupon" : "Coupon"}</span>
              <strong className={styles.couponValue}>{STARTUP_COUPON}</strong>
            </div>
            <button
              type="button"
              className={styles.copyButton}
              onClick={copyCoupon}
              data-track-event="click_cta"
              data-track-label="Startup popup copy coupon"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? (isDe ? "Kopiert" : "Copied") : (isDe ? "Code kopieren" : "Copy code")}
            </button>
          </div>

          <div className={styles.highlights}>
            <span>{isDe ? "Ideal für" : "Best for"}: <strong>{isDe ? "Launch, Relaunch, erste Conversion-Seite" : "launch, relaunch, first conversion page"}</strong></span>
          </div>

          <div className={styles.actions}>
            <LocaleLink
              href="/offers?offer=startup-launch"
              className={styles.primaryCta}
              data-track-event="click_cta"
              data-track-label="Startup popup claim offer"
            >
              {isDe ? "Angebot ansehen" : "View Offer"} <ArrowRight size={16} />
            </LocaleLink>
            <button
              type="button"
              className={styles.secondaryCta}
              onClick={dismiss}
              data-track-event="click_cta"
              data-track-label="Startup popup maybe later"
            >
              {isDe ? "Später" : "Maybe later"}
            </button>
          </div>

          <p className={styles.note}>
            {isDe
              ? "Nur für neue Kunden. Finaler Preis hängt vom echten Scope ab."
              : "New clients only. Final price still depends on actual scope."}
          </p>
        </div>
    </aside>
  );
}
