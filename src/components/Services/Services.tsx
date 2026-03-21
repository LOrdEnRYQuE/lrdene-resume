"use client";

import React from "react";
import styles from "./Services.module.css";
import { motion } from "framer-motion";
import { Code2, Palette, Cpu, Layout, Brush, Terminal } from "lucide-react";

const services = [
  {
    title: "Web Development",
    description: "High-performance websites and web applications built with modern frameworks and precision engineering.",
    icon: <Code2 size={32} />,
  },
  {
    title: "Graphic Design",
    description: "Cinematic visual identities and marketing assets that capture attention and build brand authority.",
    icon: <Palette size={32} />,
  },
  {
    title: "AI Solutions",
    description: "Custom AI workflows and LLM integrations designed to automate business processes and enhance products.",
    icon: <Cpu size={32} />,
  },
  {
    title: "UI/UX Design",
    description: "Premium user interfaces and experience systems focused on conversion and user satisfaction.",
    icon: <Layout size={32} />,
  },
  {
    title: "Branding Systems",
    description: "Complete branding strategies including logo design, typography, and visual language for businesses.",
    icon: <Brush size={32} />,
  },
  {
    title: "Dashboard & Tools",
    description: "Scalable internal tools and business dashboards for data visualization and operational management.",
    icon: <Terminal size={32} />,
  },
];

export const Services = () => {
  return (
    <section className={styles.services} id="services">
      <div className="container">
        <div className={styles.header}>
          <motion.h2 
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Premium <span className="gold-text">Services</span>
          </motion.h2>
          <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            I build digital products that combine technical excellence with state-of-the-art design.
          </motion.p>
        </div>

        <div className={styles.grid}>
          {services.map((service, index) => (
            <motion.div 
              key={service.title}
              className={styles.card}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={styles.iconWrapper}>
                {service.icon}
              </div>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardDesc}>{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
