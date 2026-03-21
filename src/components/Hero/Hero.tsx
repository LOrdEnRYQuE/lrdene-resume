"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./Hero.module.css";
import { ArrowRight, Code, Zap } from "lucide-react";

import Image from "next/image";

export const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.glow} />
      <div className={styles.grid} />
      
      <div className={`${styles.content} container`}>
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.heroHeadline}>
            Premium Websites, <br />
            <span className="gold-text">AI Products</span>, and <br />
            Design Systems.
          </h1>
          <p className={styles.subheadline}>
            I’m Attila Lazar, founder of LOrdEnRYQuE — building websites, web apps, AI workflows, and interactive business MVPs that clients can actually test.
          </p>
          
          <div className={styles.ctaRow}>
            <button className={styles.primaryCta}>
              View Demos <ArrowRight size={18} style={{ marginLeft: "8px", display: "inline" }} />
            </button>
            <button className={styles.secondaryCta}>
              View Projects
            </button>
          </div>
        </motion.div>
        
        <motion.div 
          className={styles.portraitWrapper}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className={styles.portrait}>
            <Image 
              src="/assets/Profile.jpg"
              alt="Attila Lazar - LOrdEnRYQuE"
              fill
              className={styles.profileImage}
              priority
              sizes="(max-width: 768px) 100vw, 500px"
            />

            
            <motion.div 
              className={`${styles.statCard} ${styles.stat1}`}
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <Zap size={20} className="gold-text" />
              <div style={{ marginTop: "8px" }}>
                <strong>Available</strong>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>For new builds</p>
              </div>
            </motion.div>

            <motion.div 
              className={`${styles.statCard} ${styles.stat2}`}
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            >
              <Code size={20} className="gold-text" />
              <div style={{ marginTop: "8px" }}>
                <strong>10+ Years</strong>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>IT Experience</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
