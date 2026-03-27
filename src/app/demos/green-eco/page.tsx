"use client";

import React from "react";
import styles from "./green-eco.module.css";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  Leaf, 
  ShoppingBag, 
  ShieldCheck, 
  Wind, 
  Recycle, 
  Globe,
  ArrowRight
} from "lucide-react";

const PRODUCTS = [
  {
    id: 1,
    name: "Bamboo Utensil Set",
    price: "$24.00",
    category: "Home & Dining",
    impact: "-2.4kg CO2",
    image: "https://images.unsplash.com/photo-1591336397452-95f04df16301?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    name: "Recycled Glass Vase",
    price: "$45.00",
    category: "Decor",
    impact: "-1.8kg CO2",
    image: "https://images.unsplash.com/photo-1581783898377-1c85bf181446?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    name: "Organic Cotton Tote",
    price: "$18.00",
    category: "Accessories",
    impact: "-3.1kg CO2",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    name: "Solar Powered Lamp",
    price: "$68.00",
    category: "Lighting",
    impact: "-5.0kg CO2",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed657f9941?auto=format&fit=crop&q=80&w=800"
  }
];

export default function EcoMarketMVP() {
  return (
    <div className={styles.greenEco}>
      {/* ── Nav ──────────────────────────────────────────────── */}
      <nav className={styles.nav}>
        <div className={`${styles.navInner} ${styles.container}`}>
          <div className={styles.logo}>
            <Leaf size={28} fill="currentColor" />
            <span>Eco<span>Market</span></span>
          </div>
          <ul className={styles.navLinks}>
            <li><a href="#" className={styles.navLink}>Shop All</a></li>
            <li><a href="#" className={styles.navLink}>Materials</a></li>
            <li><a href="#" className={styles.navLink}>Impact</a></li>
          </ul>
          <div className={styles.cart}>
            <ShoppingBag size={24} />
            <span className={styles.cartBadge}>2</span>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <motion.div 
            className={styles.heroContent}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className={styles.heroBadge}>
              <ShieldCheck size={16} /> 100% Certified Sustainable
            </div>
            <h1 className={styles.heroTitle}>
              Beautifully Crafted.<br /><span>Sustainably Sourced.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Curating the world's finest ethical goods. Every purchase tracks your carbon reduction and supports regenerative farming.
            </p>
            <div className={styles.heroButtons}>
              <button className={styles.cta}>Explore Collection</button>
              <button className={styles.navLink} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Our Mission <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        </div>
        <div className={styles.heroImageWrap}>
          <Image 
            src="/assets/green-eco-hero.png" 
            alt="Eco-friendly Storefront"
            fill
            priority
          />
        </div>
      </section>

      {/* ── Products ────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Conscious Essentials</h2>
            <p style={{ color: '#666' }}>Small changes, significant impact. Minimalist design meets maximum ethics.</p>
          </div>
          
          <div className={styles.grid}>
            {PRODUCTS.map((product, idx) => (
              <motion.div 
                key={product.id}
                className={styles.productCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className={styles.productImage}>
                  <Image src={product.image} alt={product.name} fill style={{ objectFit: 'cover' }} />
                </div>
                <div className={styles.productContent}>
                  <span className={styles.productCategory}>{product.category}</span>
                  <h3 className={styles.productTitle}>{product.name}</h3>
                  <div className={styles.productFooter}>
                    <span className={styles.price}>{product.price}</span>
                    <span className={styles.impactBadge}>
                      <Wind size={14} /> {product.impact}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Impact Tracking [Micro-SaaS Feature] ── */}
      <section className={styles.impactSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle} style={{ color: '#fff' }}>Collective Impact</h2>
            <p style={{ color: '#aaa' }}>Live carbon reduction metric across our entire community.</p>
          </div>
          <div className={styles.impactGrid}>
            <div className={styles.impactItem}>
              <span className={styles.impactNum}>1.2M</span>
              <span className={styles.impactLabel}>Tons CO2 Saved</span>
            </div>
            <div className={styles.impactItem}>
              <span className={styles.impactNum}>850k</span>
              <span className={styles.impactLabel}>Trees Planted</span>
            </div>
            <div className={styles.impactItem}>
              <span className={styles.impactNum}>100%</span>
              <span className={styles.impactLabel}>Plastic Free</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Philosophy ──────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <Globe size={48} color="var(--ge-sage)" />
              <h3>Radical Transparency</h3>
              <p style={{ color: '#666' }}>Know exactly where your products come from, how they were made, and who made them. Full supply chain visibility integrated into every QR code.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <Recycle size={48} color="var(--ge-sage)" />
              <h3>Circular Economy</h3>
              <p style={{ color: '#666' }}>Every product in our catalog is designed for disassembly. Send back used items for store credit and professional recycling.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerInner}>
            <div className={styles.logo} style={{ fontSize: '1.125rem' }}>
              <Leaf size={20} fill="currentColor" />
              <span>Eco<span>Market</span></span>
            </div>
            <div className={styles.copyright}>
              © 2025 EcoMarket MVP · Built by LOrdEnRYQuE
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
