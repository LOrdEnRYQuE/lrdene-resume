"use client";

import React from "react";
import styles from "./car-dealer.module.css";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  Car, 
  Search, 
  MapPin, 
  Phone, 
  ArrowRight, 
  Gauge, 
  Fuel, 
  Calendar,
  ChevronRight,
  ShieldCheck,
  Award
} from "lucide-react";

const INVENTORY = [
  {
    id: 1,
    name: "2024 Sapphire GT",
    price: "$124,900",
    specs: { miles: "120", fuel: "Electric", year: "2024" },
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2426"
  },
  {
    id: 2,
    name: "Vertex Horizon 4S",
    price: "$89,500",
    specs: { miles: "4.2k", fuel: "Hybrid", year: "2023" },
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=2426"
  },
  {
    id: 3,
    name: "Nightshade X-Tour",
    price: "$156,000",
    specs: { miles: "850", fuel: "Gasoline", year: "2024" },
    image: "https://images.unsplash.com/photo-1555353540-64580b51c258?auto=format&fit=crop&q=80&w=2426"
  }
];

export default function CarDealerMVP() {
  return (
    <div className={styles.app}>
      {/* ── Nav ──────────────────────────────────────────────── */}
      <nav className={styles.nav}>
        <div className={`${styles.navInner} ${styles.container}`}>
          <div className={styles.logo}>
            <Car size={32} />
            <span>AUTO<span>GALLERY</span></span>
          </div>
          <ul className={styles.navLinks}>
            <li><a href="#inventory" className={styles.navLink}>Inventory</a></li>
            <li><a href="#services" className={styles.navLink}>Services</a></li>
            <li><a href="#about" className={styles.navLink}>About</a></li>
          </ul>
          <button className={styles.cta}>Book Test Drive</button>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <Image 
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2426" 
            alt="Premium Car"
            fill
            style={{ objectFit: "cover" }}
            priority
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
            <h1 className={styles.heroTitle}>Drive the<br /><span>Impossible.</span></h1>
            <p className={styles.heroSubtitle}>
              Experience curated automotive excellence. Discover our collection of the world's most desired premium vehicles.
            </p>
            <div className={styles.heroButtons}>
              <button className={styles.cta}>Browse Collection</button>
              <button className={styles.navLink} style={{ border: '1px solid #fff', padding: '0.75rem 1.5rem', borderRadius: '50px' }}>
                Latest Offers
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Inventory ────────────────────────────────────────── */}
      <section id="inventory" className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Featured Inventory</h2>
          
          <div className={styles.grid}>
            {INVENTORY.map((car, idx) => (
              <motion.div 
                key={car.id} 
                className={styles.card}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className={styles.cardImage}>
                  <Image 
                    src={car.image} 
                    alt={car.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.itemTitle}>{car.name}</h3>
                  <div className={styles.carSpec}>
                    <span><Gauge size={14} /> {car.specs.miles} mi</span>
                    <span><Fuel size={14} /> {car.specs.fuel}</span>
                    <span><Calendar size={14} /> {car.specs.year}</span>
                  </div>
                  <div className={styles.carFooter}>
                    <span className={styles.price}>{car.price}</span>
                    <a href="#" className={styles.detailsBtn}>
                      Details <ChevronRight size={18} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Showroom Experience [NEW] ── */}
      <section className={styles.showroomSection}>
        <div className={styles.container}>
          <div className={styles.showroomGrid}>
            <motion.div 
              className={styles.showroomImage}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Image 
                src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200"
                alt="Modern Showroom"
                fill
                style={{ objectFit: 'cover' }}
              />
            </motion.div>
            <div className={styles.showroomContent}>
              <span className={styles.showroomBadge}>
                <Award size={16} /> Elite Dealership 2024
              </span>
              <h2 className={styles.showroomTitle}>The Art of the<br />Showroom.</h2>
              <p className={styles.showroomText}>
                Step into a world where automotive passion meets architectural elegance. Our private gallery in Mayfair offers an unparalleled atmosphere to explore your next masterpiece.
              </p>
              <div className={styles.featureGrid}>
                <div className={styles.featureItem}>
                  <h4>Private Viewings</h4>
                  <p>Individual appointments for a focused, undisrupted experience.</p>
                </div>
                <div className={styles.featureItem}>
                  <h4>Expert Curators</h4>
                  <p>Our specialists don't sell; they guide you through heritage.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Us ────────────────────────────────────────────── */}
      <section id="services" className={styles.section} style={{ background: '#1a1a1a' }}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.card} style={{ padding: '2rem', textAlign: 'center' }}>
              <ShieldCheck size={48} color="#e63946" style={{ margin: '0 auto 1.5rem' }} />
              <h3>Certified Quality</h3>
              <p style={{ color: '#a0a0a0' }}>Every vehicle undergoes a 200-point inspection by master technicians.</p>
            </div>
            <div className={styles.card} style={{ padding: '2rem', textAlign: 'center' }}>
              <Award size={48} color="#e63946" style={{ margin: '0 auto 1.5rem' }} />
              <h3>Concierge Service</h3>
              <p style={{ color: '#a0a0a0' }}>Luxury doorstep delivery and personalized financing solutions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.logo} style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Car size={24} />
            <span>AUTO<span>GALLERY</span></span>
          </div>
          <p style={{ color: '#666' }}>© 2025 Premium Auto Gallery. MVP Demo · Built by LOrdEnRYQuE</p>
        </div>
      </footer>
    </div>
  );
}
