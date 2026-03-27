"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./PortalAccess.module.css";
import { motion } from "framer-motion";
import { KeyRound, ArrowRight, ShieldCheck } from "lucide-react";

export const PortalAccess = () => {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    
    setIsSubmitting(true);
    // Simple verification - mostly just routing to the slug
    // Backend validation happens on the destination page
    router.push(`/portal/${code.trim().toUpperCase()}`);
  };

  return (
    <div className={styles.wrapper}>
      <motion.div 
        className={styles.card}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className={styles.iconArea}>
          <ShieldCheck size={48} className="gold-text" />
        </div>
        
        <h1>Client <span className="gold-text">Portal</span></h1>
        <p>Enter your unique access code to view project progress and assets.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <KeyRound size={20} className={styles.inputIcon} />
            <input 
              type="text" 
              placeholder="CP-XXXX-XXXX"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className={styles.input}
              maxLength={12}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="magnetic-button"
            disabled={isSubmitting}
            style={{ 
              width: "100%", 
              background: "var(--accent-gold)", 
              color: "#000",
              height: "56px",
              borderRadius: "8px",
              fontWeight: "700",
              fontSize: "1.1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              marginTop: "1.5rem"
            }}
          >
            {isSubmitting ? "Verifying..." : "Access Portal"}
            {!isSubmitting && <ArrowRight size={20} />}
          </button>
        </form>

        <div className={styles.footer}>
          <p>Don't have a code? Contact your project manager.</p>
        </div>
      </motion.div>
    </div>
  );
};
