"use client";

import React from "react";
import styles from "./car-detailing.module.css";
import { motion } from "framer-motion";
import { 
  Shield, 
  CheckCircle, 
  Star,
  Zap
} from "lucide-react";
import Image from "next/image";

const PACKAGES = [
  {
    name: "Essential Shine",
    price: "120",
    features: ["Exterior Hand Wash", "Wheel Brightening", "Interior Vacuum", "Dashboard Polish"],
    featured: false
  },
  {
    name: "Platinum Detail",
    price: "280",
    features: ["Paint Decontamination", "Clay Bar Treatment", "Machine Polish", "Full Interior Steam"],
    featured: true
  },
  {
    name: "Ceramic Pro",
    price: "850",
    features: ["5-Year Ceramic Coating", "Wheel Coating", "Glass Treatment", "Engine Bay Detail"],
    featured: false
  }
];

export default function CarDetailingMVP() {
  return (
    <div className={styles.app}>
      <nav className={styles.nav}>
        <div className={`${styles.navInner} ${styles.container}`}>
          <div className={styles.logo}>
            ELITE<span>SHINE</span>
          </div>
          <button className={styles.cta} style={{ width: 'auto', padding: '0.6rem 1.5rem' }}>
            Book Service
          </button>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <Image 
            src="/assets/detailing-hero.png"
            alt="Master Car Wash"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={styles.container}>
          <motion.span 
            className={styles.heroTag}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Precision Car Care
          </motion.span>
          <motion.h1 
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Refining <em>Perfection.</em>
          </motion.h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto 3rem' }}>
            Master-level detailing services for the world's most exceptional vehicles. We don't just wash; we restore the showroom soul.
          </p>
          <button className={styles.cta} style={{ width: 'auto', padding: '1rem 3rem' }}>
            View Full Process
          </button>
        </div>
      </section>

      {/* ── Results Gallery [NEW] ── */}
      <section className={styles.section} style={{ background: '#fff' }}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle} style={{ color: '#000' }}>Recent Restorations</h2>
          <div className={styles.galleryGrid}>
            {[
              "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200",
              "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1200",
              "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200"
            ].map((img, i) => (
              <div key={i} className={styles.galleryImg}>
                <Image src={img} alt="Restoration" fill style={{ objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {PACKAGES.map((pkg, idx) => (
              <motion.div 
                key={pkg.name}
                className={styles.card}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <h3 className={styles.packName}>{pkg.name}</h3>
                <span className={styles.price}>${pkg.price}</span>
                <ul className={styles.featureList}>
                  {pkg.features.map(f => (
                    <li key={f} className={styles.feature}>
                      <CheckCircle size={16} color="var(--det-accent)" /> {f}
                    </li>
                  ))}
                </ul>
                <button className={`${styles.cta} ${pkg.featured ? styles.featuredCta : ""}`}>
                  Choose Package
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} style={{ background: '#080808', borderTop: '1px solid #111' }}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div style={{ textAlign: 'center' }}>
              <Zap size={32} color="var(--det-accent)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ marginBottom: '0.5rem' }}>Express Service</h4>
              <p style={{ color: 'var(--det-muted)', fontSize: '0.85rem' }}>Same-day turnaround for maintenance washes.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Shield size={32} color="var(--det-accent)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ marginBottom: '0.5rem' }}>Certified Shop</h4>
              <p style={{ color: 'var(--det-muted)', fontSize: '0.85rem' }}>Authorized Ceramic Pro® installers.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Star size={32} color="var(--det-accent)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ marginBottom: '0.5rem' }}>Premium Only</h4>
              <p style={{ color: 'var(--det-muted)', fontSize: '0.85rem' }}>Top-tier chemicals and equipment used.</p>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ padding: '4rem 0', textAlign: 'center', color: '#444', fontSize: '0.8rem' }}>
        <p>© 2025 Elite Shine Detailing. MVP Demo · Built by LOrdEnRYQuE</p>
      </footer>
    </div>
  );
}
