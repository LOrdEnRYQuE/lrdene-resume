"use client";

import React from "react";
import styles from "./ProcessSection.module.css";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Discover",
    description: "Deep dive into your business goals, target audience, and challenges.",
  },
  {
    number: "02",
    title: "Design",
    description: "Crafting a premium visual direction and a seamless user experience.",
  },
  {
    number: "03",
    title: "Build",
    description: "Clean, performant code using Next.js and high-end backend microservices.",
  },
  {
    number: "04",
    title: "Launch",
    description: "SEO optimization, GEO metadata, and deployment to a secure global edge.",
  },
  {
    number: "05",
    title: "Improve",
    description: "Ongoing performance audits, conversion tracking, and iterations.",
  },
];

export const ProcessSection = () => {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>
            The <span className="gold-text">Process</span>
          </h2>
        </div>

        <div className={styles.timeline}>
          {steps.map((step, index) => (
            <motion.div 
              key={step.number}
              className={styles.step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={styles.numberRow}>
                <span className={styles.number}>{step.number}</span>
                <div className={styles.line} />
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
