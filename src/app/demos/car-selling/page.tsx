"use client";

import React from "react";
import styles from "./car-selling.module.css";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  BarChart4, 
  ShieldCheck, 
  Clock,
  ArrowRight,
} from "lucide-react";

export default function CarSellingMVP() {
  return (
    <div className={styles.carSelling}>
      {/* ── Nav ──────────────────────────────────────────────── */}
      <nav className={styles.nav}>
        <div className={`${styles.container}`}>
          <div className={styles.logo}>
            AUTOTRADER <span>AI</span>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <Image 
            src="/assets/car-selling-hero.png" 
            alt="Luxury SUV Valuation"
            fill
            priority
            style={{ objectFit: 'cover' }}
          />
          <div className={styles.heroOverlay} />
        </div>

        <div className={styles.container}>
          <motion.div 
            className={styles.heroContent}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={styles.heroTitle}>Sell Local.<br /><span>Think Global.</span></h1>
            <p className={styles.heroSubtitle}>
              Experience the future of automotive selling. Our AI analyzes 120+ data points to give you an instant, guaranteed offer in under 5 minutes.
            </p>

            <div className={styles.valuationBox}>
              <div className={styles.inputGroup}>
                <label>Plate Number</label>
                <input type="text" placeholder="AB12 CDE" className={styles.inputField} />
              </div>
              <div className={styles.inputGroup}>
                <label>Current Mileage</label>
                <input type="text" placeholder="e.g. 45,000" className={styles.inputField} />
              </div>
              <button className={styles.cta}>
                Get Instant Valuation <ArrowRight size={20} style={{ marginLeft: '8px' }} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Why AutoTrader AI ────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <motion.div 
              className={styles.featureCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className={styles.iconWrap}>
                <BarChart4 size={32} />
              </div>
              <h3 className={styles.featureTitle}>Deep Market Pulse</h3>
              <p className={styles.featureDesc}>We track thousands of live auction data points and private sales to ensure your offer is pixel-perfect for today's market.</p>
            </motion.div>
            <motion.div 
              className={styles.featureCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className={styles.iconWrap}>
                <Clock size={32} />
              </div>
              <h3 className={styles.featureTitle}>7-Day Guarantee</h3>
              <p className={styles.featureDesc}>Our offers are backed by a 7-day price lock. No haggling, no pressure. Take your time to decide.</p>
            </motion.div>
            <motion.div 
              className={styles.featureCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className={styles.iconWrap}>
                <ShieldCheck size={32} />
              </div>
              <h3 className={styles.featureTitle}>Secure Handover</h3>
              <p className={styles.featureDesc}>From paperwork to secure bank transfer, we handle the entire logistics process at your doorstep.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Mid Section Case Study [NEW] ── */}
      <section className={styles.section} style={{ background: '#1a1a1a' }}>
        <div className={styles.container}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Precision Appraisal.<br />Zero Friction.</h2>
              <p style={{ opacity: 0.6, marginBottom: '2rem' }}>Our proprietary machine learning model 'Valuation-X' outperforms traditional kBB benchmarks by resolving localized demand spikes.</p>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <div>
                  <h4 style={{ color: 'var(--cs-gold)' }}>+12.4%</h4>
                  <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>Avg. higher offer</p>
                </div>
                <div>
                  <h4 style={{ color: 'var(--cs-gold)' }}>4.8 hrs</h4>
                  <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>Avg. sale time</p>
                </div>
              </div>
            </div>
            <div style={{ padding: '2rem', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                 <span>Valuation Score</span>
                 <span style={{ color: 'var(--cs-gold)' }}>Elite</span>
               </div>
               <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px' }}>
                 <div style={{ width: '85%', height: '100%', background: 'var(--cs-gold)', borderRadius: '4px' }} />
               </div>
               <p style={{ fontSize: '0.8rem', marginTop: '1rem', opacity: 0.4 }}>Based on 45 dealer cross-checks in your postal code.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────── */}
      <section className={styles.stats}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statVal}>$450M</span>
              <span className={styles.statLabel}>Total Paid Out</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statVal}>12k+</span>
              <span className={styles.statLabel}>Cars Sold</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statVal}>4.9/5</span>
              <span className={styles.statLabel}>User Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p style={{ opacity: 0.3, fontSize: '0.8rem' }}>© 2025 AutoTrader AI platform · MVP Demo · Built by LOrdEnRYQuE</p>
      </footer>
    </div>
  );
}
