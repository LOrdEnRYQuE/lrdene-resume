"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './architecture.module.css';
import LocaleLink from "@/components/I18n/LocaleLink";

const SERVICES = [
  {
    title: "Generative Floor Plans",
    desc: "AI-driven spatial optimization that generates thousands of layout possibilities based on site constraints and user preferences.",
    image: "https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&q=80&w=2426",
    features: ["Space Efficiency", "Traffic Flow Analysis", "Automated Zoning"]
  },
  {
    title: "Photorealistic AI Visualization",
    desc: "Transform simple sketches or BIM models into stunning, cinematic renderings using advanced generative diffusion models.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2426",
    features: ["Instant Iterations", "Dynamic Lighting", "Material Synthesis"]
  },
  {
    title: "Sustainable Simulation Bots",
    desc: "Autonomous agents that analyze solar exposure, wind patterns, and thermal performance to optimize energy efficiency.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2426",
    features: ["Thermal Optimization", "Daylight Analysis", "Carbon Footprint Tracking"]
  },
  {
    title: "Digital Twin Orchestration",
    desc: "Real-time synchronization between physical buildings and digital models for predictive maintenance and operational efficiency.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2426",
    features: ["Sensor Integration", "Predictive Analytics", "BIM 360 Sync"]
  }
];

export default function ArchitecturePage() {
  return (
    <div className={styles.app}>
      {/* ── Navigation ────────────────────────────────────────── */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <div className={styles.navHeader}>
            <LocaleLink href="/demos" className={styles.logo}>
              ARCH <span>NEURAL</span>
            </LocaleLink>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <LocaleLink href="/" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.2em', textDecoration: 'none', color: 'var(--arch-text)' }}>PORTFOLIO</LocaleLink>
              <button className={styles.mainCta} style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem', margin: 0 }}>START PROJECT</button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero section ───────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroImageContainer}>
          <Image 
            src="/assets/architecture-hero-v2.png"
            alt="Futuristic Biophilic Skyscraper"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <div className={styles.container}>
          <motion.div 
            className={styles.heroContent}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.heroBadge}>Generative Design Systems</span>
            <h1 className={styles.heroTitle}>
              Architecting <br /> with Intelligence
            </h1>
            <p className={styles.heroDesc}>
              Integrating deep-learning into architectural workflows 
              for spatial optimization and visual excellence.
            </p>
            <button className={styles.mainCta}>EXPLORE CASE STUDIES</button>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────── */}
      <section className={styles.stats}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            <div>
              <span className={styles.statNum}>40%</span>
              <span className={styles.statLabel}>Efficiency Gain</span>
            </div>
            <div>
              <span className={styles.statNum}>10k+</span>
              <span className={styles.statLabel}>Generated Layouts</span>
            </div>
            <div>
              <span className={styles.statNum}>CO2</span>
              <span className={styles.statLabel}>Negative Focus</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Service Grid ─────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {SERVICES.map((service, i) => (
              <motion.div 
                key={i}
                className={styles.card}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={styles.cardImage}>
                  <Image 
                    src={service.image}
                    alt={service.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h3 className={styles.cardTitle}>{service.title}</h3>
                <p className={styles.cardDesc}>{service.desc}</p>
                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {service.features.map((feat, fi) => (
                    <span key={fi} style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--arch-accent)' }}>
                      - {feat}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA section ─────────────────────────────────────────── */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.heroTitle} style={{ fontSize: '3rem' }}>Start your next project with AI.</h2>
            <p className={styles.heroDesc} style={{ margin: '0 auto 4rem' }}>
              From initial massing to final photorealistic renders, 
              we provide the tools to build faster and smarter.
            </p>
            <button className={styles.mainCta}>
              REQUEST CONSULTATION
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer style={{ padding: '6rem 0', borderTop: '1px solid var(--arch-border)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: 'var(--arch-muted)' }}>
          © 2026 ARCH NEURAL | GENERATIVE ARCHITECTURE STUDIO
        </p>
      </footer>
    </div>
  );
}
