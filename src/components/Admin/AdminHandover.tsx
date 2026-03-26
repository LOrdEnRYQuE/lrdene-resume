"use client";

import React from "react";
import styles from "./AdminDashboard.module.css";
import { BookOpen, ShieldCheck, Zap, Code2, Rocket } from "lucide-react";
import { motion } from "framer-motion";

export const AdminHandover = () => {
  const sections = [
    {
      title: "Operating Manual",
      icon: <BookOpen className="gold-text" />,
      content: "The Portfolio OS is a custom-built digital command center. Use the 'Pipeline' for lead tracking and 'Neural Analytics' for privacy-first insights."
    },
    {
      title: "Agentic Intelligence",
      icon: <Zap className="gold-text" />,
      content: "AI features are integrated directly. Headlines and images receive automated enhancements. To upgrade to real LLM power, add 'OPENAI_API_KEY' to your environment variables."
    },
    {
      title: "Security & Scale",
      icon: <ShieldCheck className="gold-text" />,
      content: "All data is stored in Convex. Access is restricted via Clerk Auth. Deployments are handled via Cloudflare Pages for edge-speed performance."
    },
    {
      title: "Tech Stack",
      icon: <Code2 className="gold-text" />,
      content: "Built with Next.js 15, TypeScript, Tailwind CSS 4, Convex (Backend), and Framer Motion for premium animations."
    }
  ];

  return (
    <div className={styles.handover}>
      <div className={styles.handoverHeader}>
        <Rocket className="gold-text" size={40} />
        <h1>Agentic Handover <span className="gold-text">Protocol</span></h1>
        <p>Your digital ecosystem is ready for deployment. Here is your operational briefing.</p>
      </div>

      <div className={styles.handoverGrid}>
        {sections.map((s, i) => (
          <motion.div 
            key={i} 
            className={styles.handoverCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className={styles.cardHeader}>
              {s.icon}
              <h3>{s.title}</h3>
            </div>
            <p>{s.content}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
