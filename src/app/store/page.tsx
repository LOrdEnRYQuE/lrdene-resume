"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Layers3, ShoppingBag, ShieldCheck } from "lucide-react";
import styles from "./Store.module.css";
import { useLocale } from "@/lib/i18n/useLocale";

const SHOP_URL =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL?.trim().replace(/\/$/, "") ||
  "https://m11xd1-pq.myshopify.com";

const SHOP_LINKS = {
  all: `${SHOP_URL}/collections/content-kits-fur-lokale-unternehmen`,
  compare: `${SHOP_URL}/pages/content-kits-vergleichen`,
  guide: `${SHOP_URL}/blogs/ratgeber`,
};

export default function StorePage() {
  const locale = useLocale();
  const isDe = locale === "de";

  const copy = isDe
    ? {
        eyebrow: "LOrdEnRYQuE Digital",
        title: "Digitale Content Kits für lokale Unternehmen.",
        subtitle:
          "Unser Produktkatalog wird zentral über Shopify verwaltet. So bleiben Preise, Downloads, Produktinformationen und Checkout an einem einzigen Ort aktuell.",
        primary: "Zum Online-Shop",
        compare: "Content Kits vergleichen",
        guide: "Ratgeber öffnen",
        trust: [
          "Digitale Downloads über Shopify",
          "Kein physischer Versand",
          "Einmaliger Kauf pro Kit",
        ],
        cards: [
          {
            title: "Alle Content Kits",
            text: "Reinigung, Salon & Barbershop und Fahrzeugaufbereitung in einer gemeinsamen Übersicht.",
            href: SHOP_LINKS.all,
            label: "Katalog öffnen",
            icon: Layers3,
          },
          {
            title: "Kits vergleichen",
            text: "Vergleiche Inhalt, Einsatzbereich und Preis der verfügbaren Branchen-Kits direkt miteinander.",
            href: SHOP_LINKS.compare,
            label: "Vergleich öffnen",
            icon: ShieldCheck,
          },
          {
            title: "Ratgeber",
            text: "Praktische Artikel zu Social Media, Content-Planung, Google Unternehmensprofil und Content-Batching.",
            href: SHOP_LINKS.guide,
            label: "Ratgeber lesen",
            icon: BookOpen,
          },
        ],
      }
    : {
        eyebrow: "LOrdEnRYQuE Digital",
        title: "Digital content kits for local businesses.",
        subtitle:
          "Our product catalog is managed centrally in Shopify so prices, downloads, product information, and checkout stay consistent in one place.",
        primary: "Open online store",
        compare: "Compare content kits",
        guide: "Open guide",
        trust: [
          "Digital downloads via Shopify",
          "No physical shipping",
          "One-time purchase per kit",
        ],
        cards: [
          {
            title: "All Content Kits",
            text: "Cleaning, Salon & Barbershop, and Vehicle Detailing in one catalog.",
            href: SHOP_LINKS.all,
            label: "Open catalog",
            icon: Layers3,
          },
          {
            title: "Compare Kits",
            text: "Compare package contents, use cases, and pricing across the available industry kits.",
            href: SHOP_LINKS.compare,
            label: "Open comparison",
            icon: ShieldCheck,
          },
          {
            title: "Guides",
            text: "Practical articles about social media, content planning, Google Business Profile, and content batching.",
            href: SHOP_LINKS.guide,
            label: "Read guides",
            icon: BookOpen,
          },
        ],
      };

  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <motion.div
          className={styles.heroInner}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className={styles.iconWrap} aria-hidden="true">
            <ShoppingBag size={34} />
          </div>
          <span className={styles.eyebrow}>{copy.eyebrow}</span>
          <h1 className={styles.title}>{copy.title}</h1>
          <p className={styles.subtitle}>{copy.subtitle}</p>

          <div className={styles.actions}>
            <a
              href={SHOP_URL}
              className={styles.primary}
              data-track-event="external_shop_click"
              data-track-label="Store bridge -> Shopify"
            >
              {copy.primary} <ArrowRight size={18} />
            </a>
            <a
              href={SHOP_LINKS.compare}
              className={styles.secondary}
              data-track-event="external_shop_click"
              data-track-label="Store bridge -> Compare kits"
            >
              {copy.compare}
            </a>
          </div>

          <div className={styles.trust} aria-label={isDe ? "Shop-Vorteile" : "Store benefits"}>
            {copy.trust.map((item) => (
              <span key={item}>
                <ShieldCheck size={14} aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      <section className={styles.grid} aria-label={isDe ? "Shop-Navigation" : "Store navigation"}>
        {copy.cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.a
              key={card.title}
              href={card.href}
              className={styles.card}
              data-track-event="external_shop_click"
              data-track-label={`Store bridge -> ${card.title}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
            >
              <div className={styles.cardIcon} aria-hidden="true">
                <Icon size={22} />
              </div>
              <h2>{card.title}</h2>
              <p>{card.text}</p>
              <span>
                {card.label} <ArrowRight size={15} />
              </span>
            </motion.a>
          );
        })}
      </section>

      <p className={styles.note}>
        {isDe
          ? "Produkte, Preise und Downloads werden nicht auf dieser Website dupliziert. Shopify ist die Quelle der Wahrheit für den Verkauf."
          : "Products, prices, and downloads are not duplicated on this website. Shopify is the source of truth for commerce."}
      </p>
    </main>
  );
}
