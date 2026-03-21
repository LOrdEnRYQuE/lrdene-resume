"use client";

import React, { useState } from "react";
import styles from "./Contact.module.css";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Linkedin, Send, CheckCircle2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "Full Product Build",
    budget: "$10k - $25k",
    timeline: "1-3 Months",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const createLead = useMutation(api.leads.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    try {
      await createLead(formData);
      setSubmitted(true);
      // Reset form (optional depending on UX preference)
      setFormData({ 
        name: "", 
        email: "", 
        company: "", 
        projectType: "Full Product Build", 
        budget: "$10k - $25k", 
        timeline: "1-3 Months", 
        message: "" 
      });
    } catch (error) {
      console.error("Failed to submit lead", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.contact} id="contact">
      <div className={`${styles.content} container`}>
        <div className={styles.intro}>
          <h2 className="premium-title">Let's Build <span className="gold-text">Something Trustworthy</span>.</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.2rem", lineHeight: "1.6" }}>
            Usually replies within 24–48 hours. Available for end-to-end product builds, AI integrations, and premium brand redesigns.
          </p>
          
          <div className={styles.contactInfo}>
            <div className={styles.infoItem}>
              <Mail size={20} className="gold-text" />
              <span><strong>Email:</strong> hello@lrdene.com</span>
            </div>
            <div className={styles.infoItem}>
              <MessageSquare size={20} className="gold-text" />
              <span><strong>WhatsApp:</strong> +[Your Number]</span>
            </div>
            <div className={styles.infoItem}>
              <Linkedin size={20} className="gold-text" />
              <span><strong>LinkedIn:</strong> Attila Lazar</span>
            </div>
          </div>
        </div>

        <motion.div 
          className={styles.formCard}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {submitted ? (
            <div className={styles.successMessage} style={{ textAlign: "center", padding: "3rem 1rem" }}>
              <CheckCircle2 size={48} className="gold-text" style={{ margin: "0 auto 1rem" }} />
              <h3>Inquiry Received!</h3>
              <p style={{ color: "var(--text-secondary)", marginTop: "1rem" }}>
                Thanks for reaching out. I'll review your project details and get back to you shortly.
              </p>
              <button onClick={() => setSubmitted(false)} className={styles.submitBtn} style={{ marginTop: "2rem" }}>
                Send Another
              </button>
            </div>
          ) : (
            <form className={styles.formGrid} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label className={styles.label}>Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Your name" 
                  className={styles.input} 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="email@example.com" 
                  className={styles.input} 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Company <span className={styles.optional}>(Optional)</span></label>
                <input 
                  type="text" 
                  placeholder="Your organization" 
                  className={styles.input} 
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Project Type</label>
                <select 
                  className={styles.input}
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                >
                  <option>Full Product Build</option>
                  <option>AI-Native App</option>
                  <option>Premium Branding</option>
                  <option>Advisory/Consulting</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Estimated Budget</label>
                <select 
                  className={styles.input}
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                >
                  <option>$10k - $25k</option>
                  <option>$25k - $50k</option>
                  <option>$50k+</option>
                  <option>Equity Based (Select Startups)</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Target Timeline</label>
                <select 
                  className={styles.input}
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                >
                  <option>Urgent (&lt; 1 Month)</option>
                  <option>1-3 Months</option>
                  <option>3-6 Months</option>
                  <option>Long-term Partnership</option>
                </select>
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Message</label>
                <textarea 
                  rows={4} 
                  required
                  placeholder="Tell me about your project..." 
                  className={styles.input}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>
              
              <div className={styles.fullWidth}>
                <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                  {isSubmitting ? "Sending..." : "Send Inquiry"} <Send size={18} style={{ marginLeft: "8px", display: "inline" }} />
                </button>
                <span className={styles.note}>Your data is secure and handled by Convex real-time DB.</span>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};
