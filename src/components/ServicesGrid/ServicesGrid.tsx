"use client";

import React from "react";
import styles from "./ServicesGrid.module.css";
import { motion } from "framer-motion";
import { 
  Code2, 
  Palette, 
  BrainCircuit, 
  Layers, 
  Trophy, 
  LayoutDashboard 
} from "lucide-react";

const services = [
  {
    title: "Web Development",
    description: "High-performance, scalable web applications built with modern frameworks like Next.js and Convex.",
    icon: <Code2 size={32} />,
  },
  {
    title: "AI Integration",
    description: "Embedding intelligent workflows and LLM-powered features into your existing or new products.",
    icon: <BrainCircuit size={32} />,
  },
  {
    title: "Graphic Design",
    description: "Cinematic visual identities and premium branding systems that command attention.",
    icon: <Palette size={32} />,
  },
  {
    title: "UI/UX Architecture",
    description: "User-centric design systems focused on conversion, accessibility, and high-end aesthetics.",
    icon: <Layers size={32} />,
  },
  {
    title: "Branding Systems",
    description: "Complete identity design from logos to full brand guidelines for modern businesses.",
    icon: <Trophy size={32} />,
  },
  {
    title: "Dashboard & Admin",
    description: "Powerful custom control centers for managing your business data and operations.",
    icon: <LayoutDashboard size={32} />,
  },
];

export const ServicesGrid = () => {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>
            Premium <span className="gold-text">Services</span>
          </h2>
          <p className={styles.subtitle}>
            A unique blend of engineering precision and artistic vision, tailored for businesses 
            that demand the highest standards.
          </p>
        </div>

        <div className={styles.grid}>
          {services.map((service, index) => (
            <motion.div 
              key={service.title}
              className={styles.card}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={styles.iconBox}>
                {service.icon}
              </div>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardDescription}>{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
