"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/i18n/useLocale";
import { stripLocalePrefix } from "@/lib/i18n/path";
import styles from "./WhatsAppBubble.module.css";

const WHATSAPP_NUMBER = "491722620671";

export default function WhatsAppBubble() {
  const pathname = usePathname();
  const locale = useLocale();
  const normalizedPath = stripLocalePrefix(pathname || "/");

  if (normalizedPath.startsWith("/admin") || normalizedPath.startsWith("/portal")) {
    return null;
  }

  const isDe = locale === "de";
  const text = encodeURIComponent(
    isDe
      ? "Hallo Attila, ich habe deine Website gefunden und moechte ueber ein Projekt sprechen."
      : "Hi Attila, I found your website and want to talk about a project.",
  );
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  const label = isDe ? "Jetzt auf WhatsApp schreiben" : "Chat on WhatsApp now";
  const status = isDe ? "Antwort meist innerhalb weniger Stunden" : "Usually replies within a few hours";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.bubble}
      aria-label={label}
      data-track-event="click_cta"
      data-track-label="WhatsApp bubble contact"
    >
      <span className={styles.pulse} aria-hidden="true" />
      <span className={styles.statusBadge}>{isDe ? "Online" : "Available"}</span>
      <span className={styles.iconWrap} aria-hidden="true">
        <MessageCircle size={22} />
      </span>
      <span className={styles.copy}>
        <span className={styles.label}>{isDe ? "Direkt auf WhatsApp" : "Direct on WhatsApp"}</span>
        <span className={styles.title}>WhatsApp</span>
        <span className={styles.meta}>{status}</span>
      </span>
      <span className={styles.srOnly}>{label}</span>
    </a>
  );
}
