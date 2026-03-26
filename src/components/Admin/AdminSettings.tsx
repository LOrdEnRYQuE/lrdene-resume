"use client";

import React, { useState, useEffect } from "react";
import styles from "./AdminSettings.module.css";
import { api } from "../../../convex/_generated/api";
import { Save, Shield, Share2, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useAdminMutation } from "@/hooks/useAdminMutation";
import { useAdminQuery } from "@/hooks/useAdminQuery";

export const AdminSettings = () => {
  const settings = useAdminQuery(api.settings.getAdmin);
  const updateSettings = useAdminMutation(api.settings.update);
  const [formData, setFormData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings === null) {
      setFormData({
        siteName: "LOrdEnRYQuE Portfolio",
        siteDescription: "Engineering the future of AI & Digital Architecture.",
        heroTitle: "Engineering the future of AI & Digital Architecture",
        heroSubtitle: "Building the next generation of intelligent systems and aesthetic digital experiences.",
        gaId: "",
        maintenanceMode: false,
        socialLinks: {
          github: "https://github.com/LOrdEnRYQuE",
          twitter: "",
          linkedin: "https://www.linkedin.com/in/LOrdEnRQuE",
          instagram: "",
          youtube: "",
        },
        emailConfig: {
          receiver: ""
        },
        appearance: {
          primaryColor: "#000000",
          accentColor: "#ffd700",
          fontFamily: "Inter",
        }
      });
    } else if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSave = async () => {
    if (!formData) return;
    setIsSaving(true);
    try {
      const updateData = { ...formData };
      delete updateData._id;
      delete updateData._creationTime;
      await updateSettings(updateData);
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (settings === undefined || !formData) return (
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
      <p>Loading Neural Config...</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.container}
    >
      <header className={styles.header}>
        <div>
          <h1>Command Center Settings</h1>
          <p>Configure global site identity, tech integrations, and neural defaults.</p>
        </div>
        <button 
          onClick={handleSave} 
          className={styles.saveBtn}
          disabled={isSaving}
        >
          {isSaving ? (
            <>Saving...</>
          ) : (
            <>
              <Save size={18} />
              Save Changes
            </>
          )}
        </button>
      </header>

      <div className={styles.sections}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Shield size={20} style={{ color: '#ffd700' }} />
            <h2>General & Brand</h2>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Site Name</label>
              <input 
                value={formData.siteName || ""} 
                onChange={(e) => setFormData({...formData, siteName: e.target.value})}
                placeholder="e.g. LOrdEnRYQuE Portfolio"
              />
            </div>
            <div className={styles.field}>
              <label>Global Site Description</label>
              <textarea 
                value={formData.siteDescription || ""} 
                onChange={(e) => setFormData({...formData, siteDescription: e.target.value})}
                placeholder="Brief description for SEO and sharing"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox"
                  checked={formData.maintenanceMode || false}
                  onChange={(e) => setFormData({...formData, maintenanceMode: e.target.checked})}
                />
                Maintenance Mode
              </label>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div style={{ color: '#ffd700' }}>⚡</div>
            <h2>Hero Content</h2>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Hero Title</label>
              <input 
                value={formData.heroTitle || ""} 
                onChange={(e) => setFormData({...formData, heroTitle: e.target.value})}
                placeholder="Main headline"
              />
            </div>
            <div className={styles.field}>
              <label>Hero Subtitle</label>
              <textarea 
                value={formData.heroSubtitle || ""} 
                onChange={(e) => setFormData({...formData, heroSubtitle: e.target.value})}
                placeholder="Supporting text"
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Share2 size={20} style={{ color: '#ffd700' }} />
            <h2>Social & Integrations</h2>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Google Analytics ID (GA4)</label>
              <input 
                placeholder="G-XXXXXXXXXX"
                value={formData.gaId || ""} 
                onChange={(e) => setFormData({...formData, gaId: e.target.value})}
              />
            </div>
            <div className={styles.field}>
              <label>Github URL</label>
              <input 
                value={formData.socialLinks?.github || ""} 
                placeholder="https://github.com/username"
                onChange={(e) => setFormData({
                  ...formData, 
                  socialLinks: { ...formData.socialLinks, github: e.target.value }
                })}
              />
            </div>
            <div className={styles.field}>
              <label>Twitter URL</label>
              <input 
                value={formData.socialLinks?.twitter || ""} 
                placeholder="https://twitter.com/username"
                onChange={(e) => setFormData({
                  ...formData, 
                  socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                })}
              />
            </div>
            <div className={styles.field}>
              <label>LinkedIn URL</label>
              <input 
                value={formData.socialLinks?.linkedin || ""} 
                placeholder="https://linkedin.com/in/username"
                onChange={(e) => setFormData({
                  ...formData, 
                  socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                })}
              />
            </div>
            <div className={styles.field}>
              <label>Instagram URL</label>
              <input 
                value={formData.socialLinks?.instagram || ""} 
                placeholder="https://instagram.com/username"
                onChange={(e) => setFormData({
                  ...formData, 
                  socialLinks: { ...formData.socialLinks, instagram: e.target.value }
                })}
              />
            </div>
            <div className={styles.field}>
              <label>YouTube URL</label>
              <input 
                value={formData.socialLinks?.youtube || ""} 
                placeholder="https://youtube.com/@channel"
                onChange={(e) => setFormData({
                  ...formData, 
                  socialLinks: { ...formData.socialLinks, youtube: e.target.value }
                })}
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div style={{ color: '#ffd700' }}>🎨</div>
            <h2>Appearance</h2>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Primary Color</label>
              <input 
                type="color"
                value={formData.appearance?.primaryColor || "#000000"} 
                onChange={(e) => setFormData({
                  ...formData, 
                  appearance: { ...formData.appearance, primaryColor: e.target.value }
                })}
              />
            </div>
            <div className={styles.field}>
              <label>Accent Color</label>
              <input 
                type="color"
                value={formData.appearance?.accentColor || "#ffd700"} 
                onChange={(e) => setFormData({
                  ...formData, 
                  appearance: { ...formData.appearance, accentColor: e.target.value }
                })}
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Mail size={20} style={{ color: '#ffd700' }} />
            <h2>System Config</h2>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Notification Email</label>
              <input 
                value={formData.emailConfig?.receiver || ""} 
                placeholder="admin@example.com"
                onChange={(e) => setFormData({
                  ...formData, 
                  emailConfig: { ...formData.emailConfig, receiver: e.target.value }
                })}
              />
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};
