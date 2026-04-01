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

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.bubble}
    >
      <span className={styles.pulse} aria-hidden="true" />
      <span className={styles.iconWrap} aria-hidden="true">
        <MessageCircle size={22} />
      </span>
      <span className={styles.copy}>
        <span className={styles.label}>{isDe ? "Direkt schreiben" : "Chat directly"}</span>
        <span className={styles.title}>WhatsApp</span>
      </span>
      <span className={styles.srOnly}>
        {isDe ? "Direkt per WhatsApp Kontakt aufnehmen" : "Contact directly via WhatsApp"}
      </span>
    </a>
  );
}
