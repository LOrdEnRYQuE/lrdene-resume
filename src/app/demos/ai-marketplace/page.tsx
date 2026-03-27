"use client";

import React from "react";
import styles from "./ai-marketplace.module.css";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  Cpu, 
  BarChart3, 
  ShieldAlert, 
  Zap, 
  Search,
  ArrowUpRight,
  Users
} from "lucide-react";

const AGENTS = [
  {
    id: 1,
    name: "Support Sentinel",
    role: "L3 Customer Support",
    desc: "Autonomous resolution agent. Handles billing, tech support, and proactive account management with emotional intelligence.",
    stats: { success: "98.2%", avgTime: "45s" },
    price: "$299",
    icon: <Users size={32} />
  },
  {
    id: 2,
    name: "Growth Architect",
    role: "SEO & Growth Engine",
    desc: "Real-time content optimization and competitor pulse. Automatically updates on-page SEO and suggests content clusters.",
    stats: { traffic: "+450%", latency: "12ms" },
    price: "$450",
    icon: <Zap size={32} />
  },
  {
    id: 3,
    name: "Data Alchemist",
    role: "Predictive Analytics",
    desc: "Connects to your warehouse and flags market anomalies before they happen. Generates 2026 outlook reports weekly.",
    stats: { accuracy: "94.5%", sources: "120+" },
    price: "$800",
    icon: <BarChart3 size={32} />
  }
];

export default function AgentHireMVP() {
  return (
    <div className={styles.aiMarketplace}>
      {/* ── Nav ──────────────────────────────────────────────── */}
      <nav className={styles.nav}>
        <div className={`${styles.navInner} ${styles.container}`}>
          <div className={styles.logo}>
            <Cpu size={32} />
            <span>Agent<span>Hire</span></span>
          </div>
          <ul className={styles.navLinks}>
            <li><a href="#" className={styles.navLink}>Compute</a></li>
            <li><a href="#" className={styles.navLink}>Agent Store</a></li>
            <li><a href="#" className={styles.navLink}>Protocols</a></li>
          </ul>
          <button className={styles.btnConnect}>Launch Dashboard</button>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <motion.div 
              className={styles.heroBadge}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Zap size={14} style={{ marginRight: '8px' }} /> Hyper-Optimized 2026 Agents
            </motion.div>
            <h1 className={styles.heroTitle}>
              Hire your next <span>Workforce.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              The first decentralized marketplace for production-ready AI agents. Deploy specialized cognitive units into your existing stack in under 60 seconds.
            </p>
            <div className={styles.heroButtons}>
              <button className={styles.cta}>Browse Marketplace</button>
              <button 
                className={styles.navLink} 
                style={{ border: '1px solid rgba(255, 255, 255, 0.1)', padding: '1.1rem 2.8rem', borderRadius: '12px' }}
              >
                Become a Creator
              </button>
            </div>
          </div>

          <motion.div 
            className={styles.heroVisual}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
          >
            <Image 
              src="/assets/agent-marketplace-hero.png" 
              alt="AI Agent Marketplace Dashboard"
              fill
              priority
              style={{ objectFit: 'cover' }}
            />
          </motion.div>
        </div>
      </section>

      {/* ── Marketplace ──────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Featured Cognitive Units</h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.4)' }}>Ready for immediate deployment. Audited for logic and safety.</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#666' }} />
                <input 
                  type="text" 
                  placeholder="Filter by capability..." 
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)', 
                    padding: '0.75rem 1rem 0.75rem 2.5rem', 
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
              </div>
            </div>
          </div>

          <div className={styles.grid}>
            {AGENTS.map((agent, idx) => (
              <motion.div 
                key={agent.id}
                className={styles.agentCard}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className={styles.agentIcon}>
                  {agent.icon}
                </div>
                <span style={{ color: 'var(--am-primary)', fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                  {agent.role}
                </span>
                <h3 className={styles.agentTitle}>{agent.name}</h3>
                <p className={styles.agentDesc}>{agent.desc}</p>
                
                <div className={styles.statsGrid}>
                  {Object.entries(agent.stats).map(([k, v]) => (
                    <div key={k} className={styles.statItem}>
                      <span className={styles.statVal}>{v}</span>
                      <span className={styles.statLabel}>{k}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.pricing}>
                    {agent.price}<span>/node/mo</span>
                  </div>
                  <a href="#" className={styles.btnDeploy}>
                    Deploy Now <ArrowUpRight size={16} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security Trust ──────────────────────────────────── */}
      <section className={styles.section} style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
        <div className={styles.container}>
          <div className={styles.grid} style={{ alignItems: 'center' }}>
            <div>
              <ShieldAlert size={48} color="var(--am-primary)" style={{ marginBottom: '1.5rem' }} />
              <h3>Logic Audits & Safety Guards</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.5)', marginBottom: '2rem' }}>Every agent on our platform undergoes a multi-layer verification process evaluating logic consistency, adversarial robustness, and sandbox isolation.</p>
              <ul style={{ listStyle: 'none', color: 'rgba(255, 255, 255, 0.8)', display: 'grid', gap: '1rem' }}>
                <li style={{ display: 'flex', gap: '0.5rem' }}><Zap size={18} color="var(--am-primary)" /> Automatic Prompt Injection Shielding</li>
                <li style={{ display: 'flex', gap: '0.5rem' }}><Zap size={18} color="var(--am-primary)" /> Real-time Hallucination Monitoring</li>
                <li style={{ display: 'flex', gap: '0.5rem' }}><Zap size={18} color="var(--am-primary)" /> Restricted Execution Environments</li>
              </ul>
            </div>
            <div style={{ position: 'relative', height: '400px', background: 'var(--am-card-bg)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '2rem' }}>
               <pre style={{ fontSize: '0.8rem', color: 'var(--am-primary)', opacity: 0.8 }}>
{`// Initialize Agent Protocol
const agent = await AgentHire.deploy({
  target: 'DataAlchemist',
  region: 'EU-West-1',
  access: 'FullRead',
  guards: ['SQL-Injection', 'PiiMasking']
});

agent.on('anomaly', (evt) => {
  notify('Security Team', evt.report);
});`}
               </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ──────────────────────────────────────── */}
      <section className={styles.hero} style={{ padding: '100px 0' }}>
        <div className={styles.container}>
          <h2>Ready to Scale with Intelligence?</h2>
          <p style={{ marginBottom: '2rem', opacity: 0.6 }}>Join 800+ companies already using AgentHire to power their operations.</p>
          <button className={styles.cta}>Create Your Account</button>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{ padding: '4rem 0', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div className={styles.container} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className={styles.logo} style={{ fontSize: '1.25rem' }}>
            <Cpu size={24} />
            <span>Agent<span>Hire</span></span>
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '0.8rem' }}>
            © 2025 AgentHire Protocol · MVP Demo · Built by LOrdEnRYQuE
          </div>
        </div>
      </footer>
    </div>
  );
}
