"use client";

import React from "react";
import styles from "./ServiceDetail.module.css";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Zap, Shield, Target, Globe, Cpu, Layout } from "lucide-react";
import { useLocale } from "@/lib/i18n/useLocale";
import { localizeHref } from "@/lib/i18n/path";

interface ServiceProps {
  title: string;
  description: string;
  features: string[];
  process: { step: string; desc: string }[];
  iconName: string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Globe: <Globe size={40} />,
  Cpu: <Cpu size={40} />,
  Layout: <Layout size={40} />,
  Zap: <Zap size={40} />,
  Shield: <Shield size={40} />,
  Target: <Target size={40} />,
};

export const ServiceDetail = ({ title, description, features, process, iconName }: ServiceProps) => {
  const locale = useLocale();
  const icon = ICON_MAP[iconName] || <Zap size={40} />;
  const copy =
    locale === "de"
      ? {
          solutions: "Lösungen",
          capabilities: "Kernfähigkeiten",
          protocol: "Ablauf",
          ctaTitle: "Bereit, deine digitale Präsenz weiterzuentwickeln?",
          ctaSubtitle: "Lass uns eine Lösung mit messbarem Wachstumseffekt bauen.",
          cta: "Beratung Starten",
        }
      : {
          solutions: "Solutions",
          capabilities: "Key Capabilities",
          protocol: "The Protocol",
          ctaTitle: "Ready to evolve your digital presence?",
          ctaSubtitle: "Let's architect a solution that drives measurable growth.",
          cta: "Initiate Consultation",
        };
  return (
    <div className={styles.servicePage}>
      <header className={styles.hero}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={styles.iconWrapper}
        >
          {icon}
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {title} <span className="gold-text">{copy.solutions}</span>
        </motion.h1>
        <motion.p 
          className={styles.description}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {description}
        </motion.p>
      </header>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.features}>
              <h2 className="gold-text">{copy.capabilities}</h2>
              <ul>
                {features.map((feature, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle2 size={18} className="gold-text" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className={styles.process}>
              <h2 className="gold-text">{copy.protocol}</h2>
              <div className={styles.steps}>
                {process.map((step, i) => (
                  <div key={i} className={styles.step}>
                    <div className={styles.stepNumber}>{i + 1}</div>
                    <div>
                      <h3>{step.step}</h3>
                      <p>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.cta}>
        <h2>{copy.ctaTitle}</h2>
        <p>{copy.ctaSubtitle}</p>
        <motion.a 
          href={localizeHref("/contact", locale)}
          className={styles.ctaBtn}
          data-track-event="click_cta"
          data-track-label="Service Detail: Initiate Consultation"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {copy.cta} <ArrowRight size={18} />
        </motion.a>
      </footer>
    </div>
  );
};
