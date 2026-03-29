"use client";

import React, { useState, useEffect } from "react";
import { api } from "../../../convex/_generated/api";
import styles from "./SettingsManager.module.css";
import { 
  Save, 
  Settings, 
  Globe, 
  Mail, 
  Palette, 
  Github, 
  Twitter, 
  Linkedin, 
  Search,
  Key,
  Database,
  ShieldCheck,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminMutation } from "@/hooks/useAdminMutation";
import { useAdminQuery } from "@/hooks/useAdminQuery";

export const SettingsManager = () => {
  const currentSettings = useAdminQuery(api.settings.getAdmin);
  const updateSettings = useAdminMutation(api.settings.update);
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (currentSettings !== undefined) {
      setFormData(currentSettings || {
        siteName: "Portfolio OS",
        siteDescription: "Premium Agentic Portfolio",
        heroTitle: "Architecting the Future",
        gaId: "",
        maintenanceMode: false,
        socialLinks: { github: "https://github.com/LOrdEnRYQuE", twitter: "", linkedin: "https://www.linkedin.com/in/LOrdEnRQuE" },
        emailConfig: { receiver: "", senderName: "Portfolio OS", senderEmail: "", webhookSecret: "" },
        appearance: { primaryColor: "#050505", accentColor: "#D4AF37", fontFamily: "Inter" }
      });
    }
  }, [currentSettings]);

  if (currentSettings === undefined || !formData) return <div className={styles.loading}>Initializing Control Center...</div>;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updateData = { ...formData };
      const normalizedGaId = String(updateData.gaId || "").trim().toUpperCase();
      if (normalizedGaId && !/^G-[A-Z0-9]{6,}$/.test(normalizedGaId)) {
        alert("Invalid GA4 Measurement ID. Use format: G-XXXXXXXXXX");
        return;
      }
      updateData.gaId = normalizedGaId;
      delete updateData._id;
      delete updateData._creationTime;
      await updateSettings(updateData);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
    } catch {
      alert("Error saving settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: <Settings size={18} /> },
    { id: "appearance", label: "Appearance", icon: <Palette size={18} /> },
    { id: "social", label: "Social Presence", icon: <Globe size={18} /> },
    { id: "system", label: "System & API", icon: <Key size={18} /> },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Global <span className="gold-text">Settings</span></h1>
          <p>Configure your digital presence and system integrations.</p>
        </div>
        <button 
          className={styles.saveBtn} 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : <><Save size={18} /> Update Configuration</>}
        </button>
      </header>

      <div className={styles.layout}>
        <nav className={styles.tabs}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>

        <main className={styles.mainContent}>
          <form onSubmit={handleSave} className={styles.form}>
            {activeTab === "general" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.section}>
                <h3>Identity & SEO</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Site Name</label>
                    <input 
                      value={formData.siteName}
                      onChange={e => setFormData({ ...formData, siteName: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Short Description</label>
                    <input 
                      value={formData.siteDescription}
                      onChange={e => setFormData({ ...formData, siteDescription: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Hero Title</label>
                    <input 
                      value={formData.heroTitle || ""}
                      onChange={e => setFormData({ ...formData, heroTitle: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Google Analytics ID</label>
                    <input 
                      value={formData.gaId}
                      onChange={e => setFormData({ ...formData, gaId: e.target.value })}
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>
                </div>

                <div className={styles.maintenanceRow}>
                   <ShieldCheck size={20} className={formData.maintenanceMode ? "gold-text" : ""} />
                   <div>
                     <label>Maintenance Mode</label>
                     <p>Hide public site while building.</p>
                   </div>
                   <input 
                     type="checkbox" 
                     className={styles.toggle}
                     checked={formData.maintenanceMode || false}
                     onChange={e => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                   />
                </div>
              </motion.div>
            )}

            {activeTab === "appearance" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.section}>
                <h3>Design System Tokens</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                     <label>Primary Color</label>
                     <div className={styles.colorPicker}>
                        <input 
                          type="color"
                          value={formData.appearance?.primaryColor || "#000000"}
                          onChange={e => setFormData({ 
                            ...formData, 
                            appearance: { ...formData.appearance, primaryColor: e.target.value } 
                          })}
                        />
                        <span>{formData.appearance?.primaryColor}</span>
                     </div>
                  </div>
                  <div className={styles.formGroup}>
                     <label>Accent Gold</label>
                     <div className={styles.colorPicker}>
                        <input 
                          type="color"
                          value={formData.appearance?.accentColor || "#D4AF37"}
                          onChange={e => setFormData({ 
                            ...formData, 
                            appearance: { ...formData.appearance, accentColor: e.target.value } 
                          })}
                        />
                        <span>{formData.appearance?.accentColor}</span>
                     </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "social" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.section}>
                <h3>Connected Profiles</h3>
                <div className={styles.formGrid}>
                   <div className={styles.formGroup}>
                     <label><Github size={14} /> GitHub</label>
                     <input 
                       value={formData.socialLinks.github}
                       onChange={e => setFormData({ 
                         ...formData, 
                         socialLinks: { ...formData.socialLinks, github: e.target.value } 
                       })}
                     />
                   </div>
                   <div className={styles.formGroup}>
                     <label><Twitter size={14} /> Twitter / X</label>
                     <input 
                       value={formData.socialLinks.twitter}
                       onChange={e => setFormData({ 
                         ...formData, 
                         socialLinks: { ...formData.socialLinks, twitter: e.target.value } 
                       })}
                     />
                   </div>
                   <div className={styles.formGroup}>
                     <label><Linkedin size={14} /> LinkedIn</label>
                     <input 
                       value={formData.socialLinks.linkedin}
                       onChange={e => setFormData({ 
                         ...formData, 
                         socialLinks: { ...formData.socialLinks, linkedin: e.target.value } 
                       })}
                     />
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === "system" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.section}>
                <h3>Communications & Webhooks</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label><Mail size={14} /> Notification Receiver</label>
                    <input
                      value={formData.emailConfig?.receiver || ""}
                      placeholder="admin@example.com"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emailConfig: { ...formData.emailConfig, receiver: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label><Mail size={14} /> Sender Name</label>
                    <input
                      value={formData.emailConfig?.senderName || ""}
                      placeholder="Portfolio OS"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emailConfig: { ...formData.emailConfig, senderName: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label><Mail size={14} /> Sender Email</label>
                    <input
                      value={formData.emailConfig?.senderEmail || ""}
                      placeholder="notifications@yourdomain.com"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emailConfig: { ...formData.emailConfig, senderEmail: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label><Key size={14} /> Webhook Secret</label>
                    <input
                      value={formData.emailConfig?.webhookSecret || ""}
                      placeholder="Shared secret for x-webhook-secret header"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emailConfig: { ...formData.emailConfig, webhookSecret: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label><Search size={14} /> Resend Webhook Endpoint</label>
                    <input value="/webhooks/resend" readOnly />
                  </div>
                  <div className={styles.formGroup}>
                    <label><Database size={14} /> Notes</label>
                    <input
                      value="Set RESEND_API_KEY in env; sender/webhook settings here are runtime fallbacks."
                      readOnly
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </form>
        </main>
      </div>

      <AnimatePresence>
        {showSavedToast && (
          <motion.div 
            className={styles.toast}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <Check size={18} /> Configuration Applied Successfully
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
