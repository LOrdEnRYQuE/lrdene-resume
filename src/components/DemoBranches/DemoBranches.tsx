"use client";

import React from "react";
import styles from "./DemoBranches.module.css";
import { motion } from "framer-motion";
import { 
  Utensils, 
  Scissors, 
  Home, 
  Scale, 
  Wrench, 
  ShoppingBag,
  ArrowUpRight 
} from "lucide-react";

const demos = [
  {
    title: "Restaurant MVP",
    description: "Modern booking + menu + admin flow for hospitality.",
    icon: <Utensils size={24} />,
    slug: "restaurant",
  },
  {
    title: "Salon & Barber",
    description: "Appointment scheduling and service showcase.",
    icon: <Scissors size={24} />,
    slug: "salon",
  },
  {
    title: "Real Estate",
    description: "Premium property listings and agent dashboards.",
    icon: <Home size={24} />,
    slug: "real-estate",
  },
  {
    title: "Lawyer & Consultant",
    description: "Secure case management and client portals.",
    icon: <Scale size={24} />,
    slug: "legal",
  },
  {
    title: "Home Services",
    description: "Job tracking and invoice management for contractors.",
    icon: <Wrench size={24} />,
    slug: "home-services",
  },
  {
    title: "E-commerce",
    description: "High-conversion product stores and inventory tools.",
    icon: <ShoppingBag size={24} />,
    slug: "ecommerce",
  },
];

export const DemoBranches = () => {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>
            Interactive <span className="gold-text">Demo Branches</span>
          </h2>
          <p className={styles.subtitle}>
            Test-drive these specialized business systems. Each one is a functional MVP 
            built to solve real industry challenges.
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
              <div className={styles.iconWrapper}>
                {demo.icon}
              </div>
              <h3 className={styles.cardTitle}>{demo.title}</h3>
              <p className={styles.cardDescription}>{demo.description}</p>
              
              <div className={styles.footer}>
                <button className={styles.demoBtn}>
                  Open Demo <ArrowUpRight size={14} style={{ marginLeft: "4px" }} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
