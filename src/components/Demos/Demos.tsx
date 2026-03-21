"use client";

import React from "react";
import styles from "./Demos.module.css";
import { motion } from "framer-motion";
import { ExternalLink, Layers } from "lucide-react";

const demos = [
  {
    title: "Restaurant MVP",
    description: "Modern booking + menu + admin flow for hospitality businesses. Full-stack experience.",
    industry: "Hospitality",
  },
  {
    title: "Salon / Barber MVP",
    description: "Appointment scheduling, stylist management, and automated client notifications.",
    industry: "Beauty",
  },
  {
    title: "Real Estate MVP",
    description: "Property listings with advanced filters, virtual tours, and lead capture systems.",
    industry: "Real Estate",
  },
  {
    title: "Lawyer MVP",
    description: "Secure document management, client portals, and billing integration for professionals.",
    industry: "Legal",
  },
  {
    title: "Home Services MVP",
    description: "Booking system for plumbers, electricians, and contractors with technician tracking.",
    industry: "Services",
  },
  {
    title: "E-commerce MVP",
    description: "Premium shopping experience with cart, stripe checkout, and inventory management.",
    industry: "Retail",
  },
];

export const Demos = () => {
  return (
    <section className={styles.demos} id="demos">
      <div className="container">
        <div className={styles.header}>
          <span className={styles.tagline}>Interactive Demos</span>
          <h2 className={styles.title}>
            Test Drive My <span className="gold-text">Product Branches</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
            I don't just show screenshots. I build interactive MVP branches so you can experience the product before we even start.
          </p>
        </div>

        <div className={styles.grid}>
          {demos.map((demo, index) => (
            <motion.div 
              key={demo.title}
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={styles.imageArea}>
                <Layers size={40} color="#222" />
                <div className={styles.imagePlaceholder}>Demo Interface Preview</div>
              </div>
              
              <div className={styles.cardContent}>
                <div className={styles.cardTop}>
                  <h3 className={styles.cardTitle}>{demo.title}</h3>
                  <span className={styles.badge}>{demo.industry}</span>
                </div>
                <p className={styles.cardDesc}>{demo.description}</p>
                
                <div className={styles.actions}>
                  <button className={styles.openBtn}>
                    Open Demo <ExternalLink size={14} style={{ marginLeft: "4px", display: "inline" }} />
                  </button>
                  <button className={styles.requestBtn}>
                    Request Feature
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
