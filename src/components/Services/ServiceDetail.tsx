"use client";

import React from "react";
import styles from "./ServiceDetail.module.css";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Zap, Shield, Target } from "lucide-react";

interface ServiceProps {
  title: string;
  description: string;
  features: string[];
  process: { step: string; desc: string }[];
  icon: React.ReactNode;
}

export const ServiceDetail = ({ title, description, features, process, icon }: ServiceProps) => {
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
          {title} <span className="gold-text">Solutions</span>
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
              <h2 className="gold-text">Key Capabilities</h2>
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
              <h2 className="gold-text">The Protocol</h2>
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
        <h2>Ready to <span className="gold-text">evolve</span> your digital presence?</h2>
        <p>Let's architect a solution that drives measurable growth.</p>
        <motion.a 
          href="/contact" 
          className={styles.ctaBtn}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Initiate Consultation <ArrowRight size={18} />
        </motion.a>
      </footer>
    </div>
  );
};
