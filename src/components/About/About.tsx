"use client";

import React from "react";
import styles from "./About.module.css";
import { motion } from "framer-motion";
import { User, ShieldCheck, Palette, Cpu, Target } from "lucide-react";

export const About = () => {
  const evolution = [
    {
      year: "2014",
      title: "The Engineering Phase",
      desc: "Deep focus on Linux systems, server architecture, and low-level backend reliability.",
      icon: <Cpu size={20} />,
    },
    {
      year: "2018",
      title: "Visual Convergence",
      desc: "Integrating high-end graphic design and cinematic motion into technical products.",
      icon: <Palette size={20} />,
    },
    {
      year: "2022",
      title: "Product Operating Systems",
      desc: "Pioneering the 'Portfolio OS' concept—where apps feel like premium desktop environments.",
      icon: <ShieldCheck size={20} />,
    },
    {
      year: "2026",
      title: "The Agentic Future",
      desc: "Focusing on AI-native interfaces that proactively solve business problems.",
      icon: <Target size={20} />,
    },
  ];

  return (
    <section className={styles.about} id="about">
      <div className={`${styles.content} container`}>
        <motion.div 
          className={styles.portraitArea}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className={styles.portrait}>
            <User size={120} />
          </div>
        </motion.div>

        <div className={styles.infoArea}>
          <span className={styles.tagline}>About Attila Lazar</span>
          <h2 className={styles.title}>Taste Meets <span className="gold-text">Engineering</span>.</h2>
          <p className={styles.description}>
            I founded LOrdEnRYQuE to bridge the gap between expensive-looking design and production-ready code. My background in IT systems allows me to build products that aren't just beautiful, but scalable and secure.
          </p>

          <div className={styles.evolution}>
            {evolution.map((item, index) => (
              <motion.div 
                key={item.title}
                className={styles.evolutionItem}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <div className={styles.year}>{item.year}</div>
                <div className={styles.itemIcon}>{item.icon}</div>
                <div className={styles.itemText}>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
