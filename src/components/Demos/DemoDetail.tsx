"use client";

import React from "react";
import styles from "./DemoDetail.module.css";
import { motion } from "framer-motion";
import { Play, Code, Layers, Sparkles, ArrowRight } from "lucide-react";

interface DemoProps {
  title: string;
  tagline: string;
  niche: string;
  techStack: string[];
  features: string[];
  description: string;
  previewImage: string;
}

export const DemoDetail = ({ title, tagline, niche, techStack, features, description, previewImage }: DemoProps) => {
  return (
    <div className={styles.demoPage}>
      <header className={styles.hero}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.heroContent}
          >
            <span className={styles.badge}>{niche} Protocol</span>
            <h1>{title} <span className="gold-text">OS</span></h1>
            <p className={styles.tagline}>{tagline}</p>
          </motion.div>
        </div>
      </header>

      <section className={styles.content}>
        <div className="container">
          <div className={styles.mainGrid}>
            <motion.div 
              className={styles.previewCard}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img src={previewImage} alt={title} className={styles.previewImg} />
              <div className={styles.overlay}>
                <button className={styles.playBtn}>
                  <Play fill="currentColor" size={24} />
                  Live Preview
                </button>
              </div>
            </motion.div>

            <div className={styles.details}>
              <div className={styles.detailCard}>
                <div className={styles.cardHeader}>
                  <Layers className="gold-text" size={20} />
                  <h3>Architecture</h3>
                </div>
                <div className={styles.stackTags}>
                  {techStack.map(s => <span key={s} className={styles.stackTag}>{s}</span>)}
                </div>
              </div>

              <div className={styles.detailCard}>
                <div className={styles.cardHeader}>
                  <Sparkles className="gold-text" size={20} />
                  <h3>Core Logic</h3>
                </div>
                <ul className={styles.featureList}>
                  {features.map((f, i) => (
                    <li key={i}><div className={styles.dot} /> {f}</li>
                  ))}
                </ul>
              </div>

              <p className={styles.longDesc}>{description}</p>

              <motion.a 
                href="/contact" 
                className={styles.deployBtn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Request This Blueprint <ArrowRight size={18} />
              </motion.a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
