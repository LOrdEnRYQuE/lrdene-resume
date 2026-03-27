"use client";

import React from "react";
import styles from "./broker.module.css";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  Building2, 
  Home, 
  ShieldCheck, 
  BadgeCheck,
  Check,
  Target,
  Compass
} from "lucide-react";

const SERVICES = [
  {
    title: "Mortgage Solutions",
    desc: "Personalized lending options for first-time buyers and property portfolios.",
    icon: <Home size={32} />,
    perks: ["Fix Rates", "Remortgaging", "Buy to Let"]
  },
  {
    title: "Insurance & Protection",
    desc: "Comprehensive coverage for what matters most: your family, health, and assets.",
    icon: <ShieldCheck size={32} />,
    perks: ["Life Cover", "Critical Illness", "Income Protection"]
  },
  {
    title: "Business Growth",
    desc: "Strategic financing and insurance tailored for corporate expansion.",
    icon: <Building2 size={32} />,
    perks: ["Commercial Loans", "Directors Insurance", "Liability"]
  }
];

export default function BrokerMVP() {
  return (
    <div className={styles.app}>
      <nav className={styles.nav}>
        <div className={`${styles.navInner} ${styles.container}`}>
          <div className={styles.logo}>
            HORIZON<span>FINANCE</span>
          </div>
          <ul className={styles.navLinks}>
            <li><a href="#" className={styles.navLink}>Solutions</a></li>
            <li><a href="#" className={styles.navLink}>Process</a></li>
            <li><a href="#" className={styles.navLink}>About</a></li>
          </ul>
          <button className={styles.cta} style={{ padding: '0.6rem 1.5rem', borderRadius: '4px' }}>
            Book Consultation
          </button>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <Image 
            src="/assets/broker-hero.png"
            alt="Modern Corporate Office"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={styles.container}>
          <motion.div 
            className={styles.heroContent}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <motion.h1 className={styles.heroTitle}>
              Navigating Your<br />Financial Horizon.
            </motion.h1>
            <p className={styles.heroSubtitle}>
              Expert brokerage for international clients and high-net-worth individuals. We unlock exclusive market rates through elite institutional relationships.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className={styles.cta}>Start Free Assessment</button>
              <button className={styles.navLink} style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '0.8rem 2rem', borderRadius: '8px' }}>
                View Solutions
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className={styles.section} style={{ background: '#fff' }}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>The Horizon Advantage</h2>
          <div className={styles.processGrid}>
            {[
              { title: "Audit", icon: <Compass />, desc: "Deep analysis of your current assets and exposure." },
              { title: "Strategy", icon: <Target />, desc: "Tailored structures to optimize tax and returns." },
              { title: "Execution", icon: <BadgeCheck />, desc: "Seamless implementation across global markets." }
            ].map((step, i) => (
              <div key={i} className={styles.processCard}>
                <span className={styles.stepNum}>0{i+1}</span>
                <div className={styles.icon} style={{ margin: '0 auto 1.5rem' }}>{step.icon}</div>
                <h3 className={styles.itemTitle}>{step.title}</h3>
                <p className={styles.itemDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} style={{ background: 'var(--br-bg)' }}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Expertise Across Markets</h2>
          <div className={styles.grid}>
            {SERVICES.map((s) => (
              <motion.div 
                key={s.title}
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className={styles.icon}>{s.icon}</div>
                <h3 className={styles.itemTitle}>{s.title}</h3>
                <p className={styles.itemDesc}>{s.desc}</p>
                <ul style={{ listStyle: 'none', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {s.perks.map(p => (
                    <li key={p} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>
                      <Check size={14} color="#0a4da2" /> {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className={styles.section} style={{ background: '#fff' }}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Senior Partners</h2>
          <div className={styles.teamGrid}>
            {[
              { name: "Alister Thorne", role: "MD Property Finance", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=1200" },
              { name: "Sarah Vance", role: "Head of Private Clients", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1200" },
              { name: "Marcus Reid", role: "Chief Risk Officer", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1200" }
            ].map(p => (
              <div key={p.name} className={styles.teamCard}>
                <div className={styles.teamImg}>
                  <Image src={p.img} alt={p.name} fill style={{ objectFit: 'cover' }} />
                </div>
                <div className={styles.teamInfo}>
                  <div className={styles.teamRole}>{p.role}</div>
                  <div className={styles.teamName}>{p.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.consultBg}>
        <div className={styles.container}>
          <div className={styles.consultBox}>
            <div style={{ maxWidth: '400px' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 900 }}>Unlocking<br />Potential.</h2>
              <p style={{ opacity: 0.9 }}>Get a complimentary 15-minute assessment with a lead advisor.</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>0800 123 4567</div>
              <button className={styles.cta} style={{ background: '#fff', color: 'var(--br-primary)' }}>
                Request Call Back
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>© 2025 Horizon Finance Broker. MVP Demo · Built by LOrdEnRYQuE</p>
        </div>
      </footer>
    </div>
  );
}
