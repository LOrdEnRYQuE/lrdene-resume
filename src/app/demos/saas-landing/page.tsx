"use client";

import React from "react";
import styles from "./saas-landing.module.css";
import { motion } from "framer-motion";
import { 
  Check, 
  Zap, 
  Layers, 
  Shield, 
  Star
} from "lucide-react";
import Link from "next/link";

export default function SaasLandingDemo() {
  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>SaaSPro</div>
        <div className={styles.navLinks}>
          <a href="#" className={styles.navLink}>Features</a>
          <a href="#" className={styles.navLink}>Pricing</a>
          <a href="#" className={styles.navLink}>Contact</a>
          <Link href="/demos" className={styles.navLink}>Exit Demo</Link>
        </div>
        <button style={{ 
          background: '#0f172a', 
          color: '#fff', 
          border: 'none', 
          padding: '10px 20px', 
          borderRadius: '8px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Get Started
        </button>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <motion.div 
          className={styles.badge}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Special Launch: 50% Off First Year
        </motion.div>
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          The most efficient way to <span style={{ color: '#2563eb' }}>launch your SaaS.</span>
        </motion.h1>
        <motion.p 
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Build, ship, and scale faster with our all-in-one boilerplate and platform. 
          Stop wasting weeks on setup and start winning customers today.
        </motion.p>
        <motion.div 
          className={styles.ctaGroup}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button className={styles.primaryBtn}>Launch Now</button>
          <button className={styles.secondaryBtn}>View Demo</button>
        </motion.div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Everything you need.</h2>
          <p style={{ color: '#64748b' }}>Powerful building blocks for your next big idea.</p>
        </div>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.iconBox}><Zap size={24} /></div>
            <h3>Fast Performance</h3>
            <p style={{ color: '#64748b' }}>Optimized for speed. Your users will love the instant feel of your application.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.iconBox} style={{ background: '#fef3c7', color: '#d97706' }}><Layers size={24} /></div>
            <h3>Modular Design</h3>
            <p style={{ color: '#64748b' }}>Components are easy to change and grow with your business needs.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.iconBox} style={{ background: '#ecfdf5', color: '#059669' }}><Shield size={24} /></div>
            <h3>Secure by Nature</h3>
            <p style={{ color: '#64748b' }}>Built-in security best practices to protect your user data from day one.</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className={styles.pricing}>
        <div className={styles.sectionHeader}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Simple Pricing.</h2>
          <p style={{ color: '#64748b' }}>No hidden fees. Choose the plan that fits your growth.</p>
        </div>
        <div className={styles.pricingGrid}>
          <div className={styles.priceCard}>
            <div style={{ fontWeight: '700' }}>Starter</div>
            <div className={styles.price}>$29<span>/mo</span></div>
            <div className={styles.benefitList}>
              <div className={styles.benefit}><Check size={16} color="#2563eb" /> Up to 3 Projects</div>
              <div className={styles.benefit}><Check size={16} color="#2563eb" /> Basic Analytics</div>
              <div className={styles.benefit}><Check size={16} color="#2563eb" /> Community Support</div>
            </div>
            <button className={styles.secondaryBtn} style={{ marginTop: 'auto' }}>Get Started</button>
          </div>

          <div className={`${styles.priceCard} ${styles.popular}`}>
            <div className={styles.tag}>Most Popular</div>
            <div style={{ fontWeight: '700' }}>Professional</div>
            <div className={styles.price}>$79<span>/mo</span></div>
            <div className={styles.benefitList}>
              <div className={styles.benefit}><Check size={16} color="#2563eb" /> Unlimited Projects</div>
              <div className={styles.benefit}><Check size={16} color="#2563eb" /> Advanced AI Analytics</div>
              <div className={styles.benefit}><Check size={16} color="#2563eb" /> Priority Support</div>
              <div className={styles.benefit}><Check size={16} color="#2563eb" /> Custom Domains</div>
            </div>
            <button className={styles.primaryBtn} style={{ marginTop: 'auto' }}>Get Started</button>
          </div>

          <div className={styles.priceCard}>
            <div style={{ fontWeight: '700' }}>Enterprise</div>
            <div className={styles.price}>$199<span>/mo</span></div>
            <div className={styles.benefitList}>
              <div className={styles.benefit}><Check size={16} color="#2563eb" /> Custom Everything</div>
              <div className={styles.benefit}><Check size={16} color="#2563eb" /> Team Training</div>
              <div className={styles.benefit}><Check size={16} color="#2563eb" /> Dedicated Manager</div>
            </div>
            <button className={styles.secondaryBtn} style={{ marginTop: 'auto' }}>Contact Sales</button>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <div style={{ background: '#0f172a', color: '#fff', padding: '80px 5%', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '20px' }}>
          {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="#f59e0b" color="#f59e0b" />)}
        </div>
        <p style={{ fontSize: '1.5rem', fontStyle: 'italic', maxWidth: '800px', margin: '0 auto 30px' }}>
          "This boilerplate saved us over 100 hours of development time. 
          We went from idea to paying customers in less than two weeks."
        </p>
        <div style={{ fontWeight: '700' }}>Alex Johnson</div>
        <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Founder, TechFlow</div>
      </div>
    </div>
  );
}
