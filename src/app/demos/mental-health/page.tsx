"use client";

import React from "react";
import styles from "./mental-health.module.css";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  Heart, 
  Wind, 
  Moon, 
  BrainCircuit, 
  Sparkles,
  MessageSquareHeart,
  CalendarCheck
} from "lucide-react";

export default function MindCareMVP() {
  return (
    <div className={styles.mentalHealth}>
      {/* ── Nav ──────────────────────────────────────────────── */}
      <nav className={styles.nav}>
        <div className={`${styles.navInner} ${styles.container}`}>
          <div className={styles.logo}>
            <Sparkles size={24} />
            <span>Mind<span>Care</span></span>
          </div>
          <ul className={styles.navLinks}>
            <li><a href="#" className={styles.navLink}>Daily Check-in</a></li>
            <li><a href="#" className={styles.navLink}>Library</a></li>
            <li><a href="#" className={styles.navLink}>Therapists</a></li>
          </ul>
          <button className={styles.btnStart}>Get Started</button>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <motion.div 
            className={styles.heroContent}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 className={styles.heroTitle}>Your Mind,<br />Accompanied.</h1>
            <p className={styles.heroSubtitle}>
              Experience the world's most compassionate AI companion. 2026 sentiment-aware logic meets 24/7 empathetic support for your mental journey.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className={styles.btnStart} style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}>
                Start Reflection
              </button>
            </div>
          </motion.div>
          <div className={styles.heroImage}>
            <Image 
              src="/assets/mental-health-hero.png" 
              alt="MindCare AI Dashboard"
              fill
              priority
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────── */}
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
                <BrainCircuit size={28} />
              </div>
              <h3 className={styles.featureTitle}>Deep Emotional Context</h3>
              <p className={styles.featureDesc}>Our AI doesn't just read words; it recognizes hesitation, patterns of fatigue, and shifts in sentiment over weeks of interaction.</p>
            </motion.div>
            <motion.div 
              className={styles.featureCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className={styles.iconWrap}>
                <Wind size={28} />
              </div>
              <h3 className={styles.featureTitle}>Adaptive Breathwork</h3>
              <p className={styles.featureDesc}>Real-time visual and auditory guidance that adjusts its rhythm based on your current anxiety biometric data.</p>
            </motion.div>
            <motion.div 
              className={styles.featureCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className={styles.iconWrap}>
                <Moon size={28} />
              </div>
              <h3 className={styles.featureTitle}>Circadian Alignment</h3>
              <p className={styles.featureDesc}>Autonomous mode-switching from energizing morning prompts to calming, blue-light filtered evening reflections.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Journaling Preview ──────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.journalSection}>
            <div>
              <span style={{ color: 'var(--mc-accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>AI Insight Engine</span>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', marginTop: '1rem' }}>Journaling with<br />Perspective.</h2>
              <p style={{ opacity: 0.6, marginBottom: '2rem' }}>Write freely. Our AI generates a "Daily Perspective" summary that helps you spot recurring thought patterns and emotional triggers.</p>
              <ul style={{ listStyle: 'none', display: 'grid', gap: '1.5rem' }}>
                <li style={{ display: 'flex', gap: '1rem' }}><MessageSquareHeart color="var(--mc-accent)" /> Compassionate Feedback</li>
                <li style={{ display: 'flex', gap: '1rem' }}><CalendarCheck color="var(--mc-accent)" /> Progress Visualization</li>
                <li style={{ display: 'flex', gap: '1rem' }}><Heart color="var(--mc-accent)" /> Crisis Safety Net</li>
              </ul>
            </div>
            <div className={styles.journalPreview}>
              <div className={styles.journalEntry}>
                <span className={styles.sentimentBadge}>Calm Reflection</span>
                <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#666' }}>"I felt quite overwhelmed this morning, but I took 5 minutes to breathe. The project deadline is scary but I'm making progress."</p>
              </div>
              <div style={{ padding: '1.5rem', background: 'var(--mc-lavender)', borderRadius: '16px', marginTop: '2rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--mc-accent)' }}>AI ANALYST:</span>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>"Anya, you've mentioned 'scary' thrice this week regarding deadlines. Would you like to try our **Fear Setting** workshop tonight?"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{ padding: '6rem 0', background: '#fafafa' }}>
        <div className={styles.container}>
          <div className={styles.stats} style={{ marginBottom: '4rem' }}>
            <div className={styles.statItem}>
              <span className={styles.statVal}>92%</span>
              <span className={styles.statLabel}>Success Rate</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statVal}>24/7</span>
              <span className={styles.statLabel}>Available</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statVal}>8k+</span>
              <span className={styles.statLabel}>Daily Users</span>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className={styles.logo} style={{ justifyContent: 'center', marginBottom: '1rem' }}>
              <Sparkles size={20} />
              <span>Mind<span>Care</span></span>
            </div>
            <p style={{ fontSize: '0.875rem', opacity: 0.4 }}>© 2025 MindCare Cognitive Health · MVP Demo · Built by LOrdEnRYQuE</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
