"use client";

import React from "react";
import styles from "./Demos.module.css";
import { motion } from "framer-motion";
import { ExternalLink, Layers } from "lucide-react";
import LocaleLink from "@/components/I18n/LocaleLink";
import { useLocale } from "@/lib/i18n/useLocale";

const demos = [
  {
    title: "Restaurant MVP",
    description: "Modern booking + menu + admin flow for hospitality businesses. Full-stack experience.",
    industry: "Hospitality",
    slug: "restaurant",
  },
  {
    title: "Salon / Barber MVP",
    description: "Appointment scheduling, stylist management, and automated client notifications.",
    industry: "Beauty",
    slug: "salon",
  },
  {
    title: "Real Estate MVP",
    description: "Property listings with advanced filters, virtual tours, and lead capture systems.",
    industry: "Real Estate",
    slug: "real-estate",
  },
  {
    title: "Lawyer MVP",
    description: "Secure document management, client portals, and billing integration for professionals.",
    industry: "Legal",
    slug: "lawyer",
  },
  {
    title: "Home Services MVP",
    description: "Booking system for plumbers, electricians, and contractors with technician tracking.",
    industry: "Services",
    slug: "home-services",
  },
  {
    title: "E-commerce MVP",
    description: "Premium shopping experience with cart, stripe checkout, and inventory management.",
    industry: "Retail",
    slug: "ecommerce",
  },
  {
    title: "AI Dashboard",
    description: "High-tech SaaS analytics with model monitoring and token metrics.",
    industry: "AI & Tech",
    slug: "ai-dashboard",
  },
  {
    title: "Course Platform",
    description: "Interactive learning portal with lesson tracking and AI study partner.",
    industry: "Education",
    slug: "course-platform",
  },
  {
    title: "Healthcare Portal",
    description: "Secure patient dashboard for telemedicine and medical records.",
    industry: "Health",
    slug: "healthcare",
  },
  {
    title: "Logistics System",
    description: "Fleet management and supply chain tracking utility for logistics.",
    industry: "Logistics",
    slug: "logistics",
  },
  {
    title: "SaaS Landing",
    description: "Modern product launch boilerplate with pricing and features.",
    industry: "Business",
    slug: "saas-landing",
  },
];

export const Demos = () => {
  const locale = useLocale();
  const copy =
    locale === "de"
      ? {
          tagline: "Interaktive Demos",
          titlePrefix: "Teste meine",
          titleAccent: "Produkt Branches",
          subtitle:
            "Ich zeige nicht nur Screenshots. Ich baue interaktive MVP-Branches, damit du das Produkt vor Projektstart erleben kannst.",
          preview: "Demo Interface Vorschau",
          open: "Demo Öffnen",
          request: "Feature Anfragen",
        }
      : {
          tagline: "Interactive Demos",
          titlePrefix: "Test Drive My",
          titleAccent: "Product Branches",
          subtitle:
            "I don't just show screenshots. I build interactive MVP branches so you can experience the product before we even start.",
          preview: "Demo Interface Preview",
          open: "Open Demo",
          request: "Request Feature",
        };
  return (
    <section className={styles.demos} id="demos">
      <div className="container">
        <div className={styles.header}>
          <span className={styles.tagline}>{copy.tagline}</span>
          <h2 className={styles.title}>
            {copy.titlePrefix} <span className="gold-text">{copy.titleAccent}</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
            {copy.subtitle}
          </p>
        </div>

        <div className={styles.grid}>
          {demos.map((demo, index) => (
            <motion.div 
              key={demo.title}
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={styles.imageArea}>
                <Layers size={40} color="#222" />
                <div className={styles.imagePlaceholder}>{copy.preview}</div>
              </div>
              
              <div className={styles.cardContent}>
                <div className={styles.cardTop}>
                  <h3 className={styles.cardTitle}>{demo.title}</h3>
                  <span className={styles.badge}>{demo.industry}</span>
                </div>
                <p className={styles.cardDesc}>{demo.description}</p>
                
                <div className={styles.actions}>
                  <LocaleLink href={`/demos/${demo.slug}`} className={styles.openBtn}>
                    {copy.open} <ExternalLink size={14} style={{ marginLeft: "4px", display: "inline" }} />
                  </LocaleLink>
                  <button className={styles.requestBtn}>
                    {copy.request}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
