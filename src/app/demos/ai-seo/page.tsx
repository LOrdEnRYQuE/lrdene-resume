"use client";

import React from "react";
import styles from "./ai-seo.module.css";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  Zap, 
  ChevronRight, 
  Quote, 
  Database,
  ShieldCheck,
  Bot
} from "lucide-react";

export default function AiSeoMVP() {
  return (
    <div className={styles.aiSeo}>
      {/* ── Nav ──────────────────────────────────────────────── */}
      <nav className={styles.nav}>
        <div className={styles.container}>
          <div className={styles.logo}>
            OMNIRANK <span>AI</span>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className={styles.container}>
        <div className={styles.hero}>
          <motion.div 
            className={styles.heroContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className={styles.badge}>Next-Gen GEO Engine</div>
            <h1 className={styles.heroTitle}>Beyond Search.<br /><span>Citation Authority.</span></h1>
            <p className={styles.heroSubtitle}>
              Traditional SEO is dead. In the age of Gemini, Perplexity, and ChatGPT, visibility is about being the source of truth. OmniRank monitors your brand's citation rate across all major LLMs.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className={styles.cta}>
                Audit Your LLM Presence <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>

          <motion.div 
            className={styles.heroImageWrap}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <Image 
              src="/assets/ai-seo-hero.png" 
              alt="OmniRank AI Dashboard"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────── */}
      <section className={styles.container}>
        <div className={styles.statsGrid}>
          {[
            { label: "AI Citation Rate", value: "84.2%", trend: "+12.4%" },
            { label: "Share of Voice", value: "32.1%", trend: "+5.2%" },
            { label: "Verified Entities", value: "1,240", trend: "+18" },
            { label: "GEO Score", value: "92/100", trend: "Elite" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              className={styles.statCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={styles.statLabel}>{stat.label}</div>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statTrend}>
                <Zap size={12} fill="currentColor" /> {stat.trend}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Master the Generative Era.</h2>
            <p style={{ color: 'var(--as-text-dim)' }}>We don't just optimize for links. We transform your brand into a semantic entity that LLMs trust and cite.</p>
          </div>

          <div className={styles.featureGrid}>
            <motion.div className={styles.featureCard}>
              <div className={styles.iconBox}><Bot size={28} /></div>
              <h3 className={styles.featureTitle}>LLM Visibility Audit</h3>
              <p className={styles.featureText}>Real-time tracking of brand mentions and citations across ChatGPT, Perplexity, Gemini, and Claude.</p>
            </motion.div>

            <motion.div className={styles.featureCard}>
              <div className={styles.iconBox}><Database size={28} /></div>
              <h3 className={styles.featureTitle}>Semantic Schema Injection</h3>
              <p className={styles.featureText}>Automated deployment of FAQPage and Article schemas designed specifically for crawler consumption.</p>
            </motion.div>

            <motion.div className={styles.featureCard}>
              <div className={styles.iconBox}><ShieldCheck size={28} /></div>
              <h3 className={styles.featureTitle}>Entity Authority Building</h3>
              <p className={styles.featureText}>Consolidate metadata and industry mentions to ensure AI models recognize you as a primary expert.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Data Section ── */}
      <section className={styles.section} style={{ background: 'var(--as-card)', borderTop: '1px solid var(--as-border)' }}>
        <div className={styles.container}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: 800 }}>Engine Share of Voice.</h2>
              <p style={{ color: 'var(--as-text-dim)', marginBottom: '2.5rem' }}>See which specific platforms are driving the most cognitive citations to your expertise. AI-referred traffic converts 3x higher than standard search.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                  { name: 'Perplexity', val: 92 },
                  { name: 'ChatGPT', val: 78 },
                  { name: 'Gemini', val: 64 }
                ].map((p, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      <span>{p.name} Source Presence</span>
                      <span style={{ color: 'var(--as-primary)' }}>{p.val}%</span>
                    </div>
                    <div style={{ height: '2px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${p.val}%` }}
                        transition={{ duration: 1, delay: i * 0.2 }}
                        style={{ height: '100%', background: 'var(--as-primary)' }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <motion.div 
              style={{ padding: '3rem', border: '1px solid var(--as-border)', borderRadius: '32px', background: 'rgba(255,255,255,0.02)' }}
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Quote style={{ color: 'var(--as-primary)' }} />
                <span style={{ fontSize: '0.8rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Recent Citation</span>
              </div>
              <p style={{ fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '2rem', lineHeight: 1.6 }}>"According to **OmniRank statistics**, Generative Engine Optimization is predicted to be the primary growth lever for B2B SaaS in 2026..."</p>
              <div style={{ fontSize: '0.8rem', color: 'var(--as-primary)' }}>— Generated by Perplexity AI</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <p>© 2026 OmniRank AI · Generative Engine Optimization · Created by LOrdEnRYQuE</p>
      </footer>
    </div>
  );
}
