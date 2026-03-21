"use client";

import React from "react";
import styles from "./Footer.module.css";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";

export const Footer = () => {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <h2 className={styles.logo}>LOrdEnRYQuE</h2>
            <p>Engineering the future of AI & Digital Architecture.</p>
          </div>
          
          <div className={styles.linksGrid}>
            <div className={styles.column}>
              <h4>Navigation</h4>
              <a href="/projects">Projects</a>
              <a href="/blog">Journal</a>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
            </div>
            <div className={styles.column}>
              <h4>Services</h4>
              <a href="/services/web-development">Web Dev</a>
              <a href="/services/ai-integration">AI Tools</a>
              <a href="/services/ui-ux-design">Design</a>
            </div>
            <div className={styles.column}>
              <h4>Social</h4>
              <a href="https://github.com" target="_blank">Github <ArrowUpRight size={14} /></a>
              <a href="https://twitter.com" target="_blank">Twitter <ArrowUpRight size={14} /></a>
              <a href="https://linkedin.com" target="_blank">LinkedIn <ArrowUpRight size={14} /></a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {currentYear} LOrdEnRYQuE. All rights reserved.</p>
          <div className={styles.legal}>
            <a href="/privacy">Privacy Policy</a>
            <div className={styles.divider} />
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
