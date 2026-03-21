"use client";

import React from "react";
import styles from "./FinalCTA.module.css";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const FinalCTA = () => {
  return (
    <section className={styles.section}>
      <div className={styles.glow} />
      <div className="container">
        <div className={styles.content}>
          <motion.h2 
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Let’s build something your clients can <span className="gold-text">trust</span> <br />
            and your competitors will <span className="gold-text">hate</span>.
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <button className={styles.ctaBtn}>
              Start a Project <ArrowRight size={20} style={{ marginLeft: "10px" }} />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
