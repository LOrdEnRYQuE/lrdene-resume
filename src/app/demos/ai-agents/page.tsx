"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Cpu, 
  MessageSquare, 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  Search, 
  Sparkles,
  ArrowRight,
  Globe,
  Terminal
} from 'lucide-react';
import styles from './ai-agents.module.css';

const AGENTS = [
  {
    title: "Support Sentinel",
    desc: "24/7 autonomous customer service agent with multi-turn reasoning and deep knowledge base integration.",
    icon: <MessageSquare size={32} />,
    features: ["Context-aware memory", "Sentiment analysis", "Instant issue resolution"]
  },
  {
    title: "Executive Pilot",
    desc: "Advanced productivity bot that automates scheduling, email management, and workflow coordination.",
    icon: <Zap size={32} />,
    features: ["API integrations", "Zero-friction execution", "Proactive task management"]
  },
  {
    title: "Insight Engine",
    desc: "Real-time data analysis agent that monitors markets, produces reports, and detects anomalies.",
    icon: <BarChart3 size={32} />,
    features: ["Predictive modeling", "Natural language queries", "Automated visualization"]
  },
  {
    title: "Research Voyager",
    desc: "Infinite-scale research agent that scrapes, synthesizes, and audits information across the web.",
    icon: <Search size={32} />,
    features: ["Source verification", "Deep synthesis", "Continuous monitoring"]
  },
  {
    title: "Neural Guard",
    desc: "Security-first bot designed to monitor networks, audit code, and enforce compliance automatically.",
    icon: <ShieldCheck size={32} />,
    features: ["Real-time auditing", "Threat detection", "Access management"]
  },
  {
    title: "Custom Architect",
    desc: "Bespoke AI solutions tailored to your unique business logic and proprietary data streams.",
    icon: <Terminal size={32} />,
    features: ["Private LLM deployment", "Custom tool kits", "End-to-end integration"]
  }
];

export default function AIAgentsPage() {
  return (
    <div className={styles.app}>
      {/* ── Navigation ────────────────────────────────────────── */}
      <nav className={styles.nav}>
        <div className={styles.container}>
          <div className={styles.navInner}>
            <Link href="/demos" className={styles.logo}>
              <Bot size={28} />
              <span>NEURAL AGENCIES</span>
            </Link>
            <div className={styles.navLinks}>
              <Link href="/" className={styles.navLink}>Portfolio</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero section ───────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <Image 
            src="/assets/ai-agents-hero.png"
            alt="AI Neural Network"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <div className={styles.heroOverlay} />
        <div className={styles.container}>
          <motion.div 
            className={styles.heroContent}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className={styles.heroBadge}>Future of Intelligence</span>
            <h1 className={styles.heroTitle}>
              Build <span>Autonomous</span> 
              <span>AI Agents</span>
            </h1>
            <p className={styles.heroDesc}>
              We develop state-of-the-art AI Agents and Bots that think, 
              reason, and execute complex workflows without human intervention.
            </p>
            <button className={styles.mainCta}>
              Start Building Now
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Tech Marquee ─────────────────────────────────────────── */}
      <div className={styles.marqueeContainer}>
        <div className={styles.container}>
          <div className={styles.marquee}>
            <span className={styles.techItem}>OPENAI GPT-4o</span>
            <span className={styles.techItem}>GOOGLE GEMINI 1.5</span>
            <span className={styles.techItem}>ANTHROPIC CLAUDE 3.5</span>
            <span className={styles.techItem}>LANGCHAIN</span>
            <span className={styles.techItem}>REPLICATE</span>
          </div>
        </div>
      </div>

      {/* ── Agents Grid ─────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Agent Directory</h2>
            <p style={{ color: 'var(--ai-muted)' }}>Explore our range of intelligent automation systems</p>
          </div>
          <div className={styles.grid}>
            {AGENTS.map((agent, i) => (
              <motion.div 
                key={i}
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={styles.cardIcon}>
                  {agent.icon}
                </div>
                <h3 className={styles.cardTitle}>{agent.title}</h3>
                <p className={styles.cardDesc}>{agent.desc}</p>
                <ul className={styles.features}>
                  {agent.features.map((feat, fi) => (
                    <li key={fi} className={styles.feature}>
                      <span /> {feat}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ────────────────────────────────────────── */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.sectionTitle} style={{ marginBottom: '1.5rem' }}>
              Ready to automate the impossible?
            </h2>
            <p className={styles.heroDesc} style={{ marginBottom: '3rem' }}>
              Let's collaborate to design and deploy AI Agents that will redefine your business efficiency.
            </p>
            <button className={styles.mainCta}>
              Book a Consultation
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer style={{ padding: '4rem 0', borderTop: '1px solid var(--ai-border)', textAlign: 'center' }}>
        <p style={{ color: 'var(--ai-muted)', fontSize: '0.9rem' }}>
          &copy; 2026 Neural Agencies. Intelligent Systems, Elevated.
        </p>
      </footer>
    </div>
  );
}
