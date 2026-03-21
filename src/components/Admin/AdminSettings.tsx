"use client";

import React, { useState, useEffect } from "react";
import styles from "./AdminSettings.module.css";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Settings, Save, Shield, Share2, Mail } from "lucide-react";
import { motion } from "framer-motion";

export const AdminSettings = () => {
  const settings = useQuery(api.settings.get, {});
  const updateSettings = useMutation(api.settings.update);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSave = async () => {
    if (!formData) return;
    await updateSettings({
      ...formData,
      id: formData._id,
    });
    alert("Settings updated successfully!");
  };

  if (!formData) return <div>Loading settings...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Global Settings</h1>
          <p>Configure your site's identity, technical integrations, and contact defaults.</p>
        </div>
        <button onClick={handleSave} className={styles.saveBtn}>
          <Save size={18} />
          Save Changes
        </button>
      </header>

      <div className={styles.sections}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Shield size={20} className="gold-text" />
            <h2>General & Brand</h2>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Site Name</label>
              <input 
                value={formData.siteName} 
                onChange={(e) => setFormData({...formData, siteName: e.target.value})}
              />
            </div>
            <div className={styles.field}>
              <label>Global Site Description</label>
              <textarea 
                value={formData.siteDescription} 
                onChange={(e) => setFormData({...formData, siteDescription: e.target.value})}
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Share2 size={20} className="gold-text" />
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
                onChange={(e) => setFormData({
                  ...formData, 
                  socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                })}
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Mail size={20} className="gold-text" />
            <h2>Email Notifications</h2>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Lead Receiver Email</label>
              <input 
                value={formData.emailConfig?.receiver || ""} 
                onChange={(e) => setFormData({
                  ...formData, 
                  emailConfig: { ...formData.emailConfig, receiver: e.target.value }
                })}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
