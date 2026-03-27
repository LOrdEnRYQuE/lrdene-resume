"use client";

import React from "react";
import styles from "@/app/services/Services.module.css";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  Clock,
  ShieldCheck,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import LocaleLink from "@/components/I18n/LocaleLink";
import { useLocale } from "@/lib/i18n/useLocale";
import { useSearchParams } from "next/navigation";

type ServiceItem = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price?: string;
  deliveryTime?: string;
  features: string[];
};

export function ServicesPageClient({ services }: { services: ServiceItem[] }) {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const focusParam = searchParams.get("focus")?.trim().toLowerCase() ?? "";
  const focusAlias: Record<string, string> = {
    "web-dev": "web-development",
    "web-design": "web-development",
    "ai-tools": "ai-integration",
    "ai-tooling": "ai-integration",
    design: "ui-ux-design",
    "ui-design": "ui-ux-design",
    "ux-design": "ui-ux-design",
  };
  const normalizedFocusSlug = focusAlias[focusParam] ?? focusParam;
  const hasFocusedService = services.some((service) => service.slug === normalizedFocusSlug);
  const orderedServices = hasFocusedService
    ? [...services].sort((left, right) => {
        if (left.slug === normalizedFocusSlug) return -1;
        if (right.slug === normalizedFocusSlug) return 1;
        return 0;
      })
    : services;
  const copy =
    locale === "de"
      ? {
          badge: "Strategische Angebote",
          titlePrefix: "Premium",
          titleAccent: "Lösungspakete",
          subtitle:
            "Klar definierte Services mit hohem Impact, um deine digitale Entwicklung zu beschleunigen.",
          from: "Ab",
          custom: "Individuell",
          delivery: "Lieferung",
          flexible: "Flexibel",
          ipTransfer: "Volle IP-Übergabe",
          reserve: "Paket Reservieren",
          bespokeTitle: "Brauchst du etwas Individuelles?",
          bespokeDesc:
            "Für komplexe Plattformen und Enterprise-Lösungen planen wir eine maßgeschneiderte Roadmap.",
          quote: "Individuelles Angebot",
          focusedLabel: "Fokus",
        }
      : {
          badge: "Strategic Offerings",
          titlePrefix: "Premium",
          titleAccent: "Solution Packs",
          subtitle: "Fixed-scope, high-impact services designed to accelerate your digital evolution.",
          from: "Starting from",
          custom: "Custom",
          delivery: "Delivery",
          flexible: "Flexible",
          ipTransfer: "Full IP Transfer",
          reserve: "Reserve this Pack",
          bespokeTitle: "Need something bespoke?",
          bespokeDesc:
            "For complex enterprise solutions or custom platform engineering, let's discuss a tailored roadmap.",
          quote: "Request Custom Quote",
          focusedLabel: "Focused",
        };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <span className={styles.badge}>{copy.badge}</span>
          <h1 className={styles.title}>
            {copy.titlePrefix} <span>{copy.titleAccent}</span>
          </h1>
          <p className={styles.subtitle}>{copy.subtitle}</p>
        </motion.div>
      </header>

      <div className={styles.servicesGrid}>
        {orderedServices.map((service, idx) => (
          <motion.div
            key={service._id}
            className={`${styles.serviceCard} ${
              service.slug === normalizedFocusSlug ? styles.serviceCardFocused : ""
            }`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className={styles.cardHeader}>
              <div className={styles.serviceLogoBadge} aria-hidden="true">
                <span className={styles.serviceLogoRing} />
                <Image
                  src="/assets/LOGO.png"
                  alt="LOrdEnRYQuE"
                  width={30}
                  height={30}
                  className={styles.serviceLogoImage}
                />
              </div>
              <div className={styles.priceInfo}>
                <span className={styles.priceLabel}>{copy.from}</span>
                <span className={styles.price}>{service.price || copy.custom}</span>
              </div>
            </div>

            <h3 className={styles.serviceTitle}>
              {service.title}
              {service.slug === normalizedFocusSlug ? (
                <span className={styles.focusedBadge}>{copy.focusedLabel}</span>
              ) : null}
            </h3>
            <p className={styles.serviceDesc}>{service.description}</p>

            <div className={styles.features}>
              {service.features.map((feature, i) => (
                <div key={i} className={styles.featureItem}>
                  <CheckCircle2 size={16} className={styles.check} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className={styles.deliveryInfo}>
              <div className={styles.deliveryItem}>
                <Clock size={16} />
                <span>{service.deliveryTime || copy.flexible} {copy.delivery}</span>
              </div>
              <div className={styles.deliveryItem}>
                <ShieldCheck size={16} />
                <span>{copy.ipTransfer}</span>
              </div>
            </div>

            <LocaleLink href={`/contact?service=${service.slug}`} className={styles.bookBtn}>
              {copy.reserve} <ArrowRight size={18} />
            </LocaleLink>
          </motion.div>
        ))}
      </div>

      <section className={styles.customSection}>
        <div className={styles.customCard}>
          <div className={styles.customText}>
            <Sparkles size={32} />
            <h2>{copy.bespokeTitle}</h2>
            <p>{copy.bespokeDesc}</p>
          </div>
          <LocaleLink href="/contact" className={styles.customBtn}>
            {copy.quote} <ChevronRight size={18} />
          </LocaleLink>
        </div>
      </section>
    </main>
  );
}
