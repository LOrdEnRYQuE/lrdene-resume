"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import styles from "./AboutEditor.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, 
  Plus, 
  Trash2, 
  Sparkles,
  Layers,
  Cloud
} from "lucide-react";
import { useLocale } from "@/lib/i18n/useLocale";
import { useAdminMutation } from "@/hooks/useAdminMutation";

export default function AboutEditor() {
  const locale = useLocale();
  const content = useQuery(api.pages.getPageContent, { key: "about", locale });
  const updateContent = useAdminMutation(api.pages.updatePageContent);
  
  const [data, setData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const seedSiteContent = useAdminMutation(api.pages.seedSiteContent);

  useEffect(() => {
    if (content?.data) {
      setData(content.data);
    } else {
      // Default initial data
      setData({
        hero: {
          title: "Scaling Logic with Taste.",
          tagline: "Professional Evolution",
          description: "From early IT infrastructure to modern AI engineering...",
          stats: [
            { label: "Projects Built", value: "50+" },
            { label: "Years Active", value: "14+" },
            { label: "Delivered", value: "100%" }
          ]
        },
        evolution: [
          {
            period: "2010 — 2017",
            title: "IT Foundations & Web Development",
            desc: "Began building websites...",
            tech: ["PHP", "MySQL", "JavaScript"],
            activities: ["Building websites", "Server setup"],
            quote: "This phase built a strong understanding...",
            color: "rgba(180, 200, 229, 0.15)"
          }
        ],
        skills: [
          { title: "Web Development", skills: "PHP, JavaScript, TypeScript..." }
        ],
        values: [
          { title: "Conversion Focused", desc: "Every pixel..." }
        ]
      });
    }
  }, [content]);

  const handleSync = async () => {
    if (!confirm("This will synchronize default About content from the system. Continue?")) return;
    setIsSyncing(true);
    try {
      await seedSiteContent({});
    } catch (err) {
      console.error("Sync failed:", err);
      alert("Sync failed.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateContent({ key: "about", data, locale });
      alert("About content saved successfully.");
    } catch (error) {
      console.error("Failed to save about content", error);
      alert("Failed to save content.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!data) return <div className="p-8 text-center gold-text">Loading engine...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className="premium-title">About <span className="gold-text">Manager</span></h1>
          <p className="text-secondary">Refine your professional narrative and career chapters.</p>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={styles.syncBtn} 
            onClick={handleSync}
            disabled={isSyncing}
          >
            <Cloud size={18} className={isSyncing ? styles.syncingIcon : ""} />
            {isSyncing ? "Syncing..." : "Sync Default"}
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className={styles.saveBtn}
          >
            <Save size={18} />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </header>

      <div className={styles.editorGrid}>
        {/* Hero Section */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <Sparkles size={20} className="gold-text" />
            <h2>Hero Section</h2>
          </div>
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label>Tagline</label>
              <input 
                value={data.hero.tagline} 
                onChange={e => setData({...data, hero: {...data.hero, tagline: e.target.value}})}
              />
            </div>
            <div className={styles.field}>
              <label>Headline</label>
              <textarea 
                value={data.hero.title} 
                onChange={e => setData({...data, hero: {...data.hero, title: e.target.value}})}
              />
            </div>
            <div className={styles.field}>
              <label>Description</label>
              <textarea 
                rows={4}
                value={data.hero.description} 
                onChange={e => setData({...data, hero: {...data.hero, description: e.target.value}})}
              />
            </div>
          </div>
        </section>

        {/* Evolution Timeline */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <Layers size={20} className="gold-text" />
            <h2>Career Evolution</h2>
            <button 
              className={styles.addBtn}
              onClick={() => {
                const newEvolution = [...data.evolution, {
                  period: "New Period",
                  title: "New Chapter",
                  desc: "",
                  tech: [],
                  activities: [],
                  quote: "",
                  color: "rgba(255,255,255,0.05)"
                }];
                setData({...data, evolution: newEvolution});
              }}
            >
              <Plus size={16} /> Add Stage
            </button>
          </div>
          
          <div className={styles.itemList}>
            <AnimatePresence>
              {data.evolution.map((stage: any, idx: number) => (
                <motion.div 
                  key={idx} 
                  className={styles.item}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div className={styles.itemHeader}>
                    <span>{stage.period || "New Stage"}</span>
                    <button onClick={() => {
                      const newEvol = data.evolution.filter((_: any, i: number) => i !== idx);
                      setData({...data, evolution: newEvol});
                    }} className={styles.deleteBtn}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <input 
                    placeholder="Period (e.g. 2020-2024)"
                    value={stage.period} 
                    onChange={e => {
                      const newEvol = [...data.evolution];
                      newEvol[idx].period = e.target.value;
                      setData({...data, evolution: newEvol});
                    }}
                  />
                  <input 
                    placeholder="Focus Title"
                    value={stage.title} 
                    onChange={e => {
                      const newEvol = [...data.evolution];
                      newEvol[idx].title = e.target.value;
                      setData({...data, evolution: newEvol});
                    }}
                  />
                  <textarea 
                    placeholder="Short description..."
                    value={stage.desc} 
                    onChange={e => {
                      const newEvol = [...data.evolution];
                      newEvol[idx].desc = e.target.value;
                      setData({...data, evolution: newEvol});
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}
