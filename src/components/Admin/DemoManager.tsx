"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import styles from "./DemoManager.module.css";
import { 
  Plus, 
  Trash2, 
  Monitor, 
  Settings, 
  Zap,
  Globe,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminMutation } from "@/hooks/useAdminMutation";

const CATEGORIES = ["SaaS", "AI", "E-commerce", "Fintech", "Health", "Real Estate"];

export const DemoManager = () => {
  const demos = useQuery(api.demos.listAll) || [];
  const createDemo = useAdminMutation(api.demos.create);
  const updateDemo = useAdminMutation(api.demos.update);
  const deleteDemo = useAdminMutation(api.demos.remove);
  const seedDemos = useAdminMutation(api.demos.seedAllDemos);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [editingDemo, setEditingDemo] = useState<any>(null);

  const handleSync = async () => {
    if (confirm("Import all 20+ portfolio demos into the database for management?")) {
      setIsSyncing(true);
      try {
        await seedDemos({});
        alert("Portfolio synchronized successfully.");
      } catch (err) {
        console.error(err);
        alert("Sync failed.");
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    branch: "main",
    url: "",
    description: "",
    techStack: ["Next.js", "Tailwind"],
    features: [],
    status: "active",
    category: "SaaS",
    featured: false,
    imageUrl: ""
  });

  const handleOpenCreate = () => {
    setEditingDemo(null);
    setFormData({
      name: "",
      slug: "",
      branch: "main",
      url: "",
      description: "",
      techStack: ["Next.js", "Tailwind"],
      features: [],
      status: "active",
      category: "SaaS",
      featured: false,
      imageUrl: ""
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (demo: any) => {
    setEditingDemo(demo);
    setFormData({
      name: demo.name,
      slug: demo.slug,
      branch: demo.branch,
      url: demo.url,
      description: demo.description,
      techStack: demo.techStack || [],
      features: demo.features || [],
      status: demo.status,
      category: demo.category,
      featured: demo.featured,
      imageUrl: demo.imageUrl || ""
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDemo) {
        await updateDemo({
          id: editingDemo._id,
          ...formData
        });
      } else {
        await createDemo(formData as any);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save demo:", err);
      alert("Error saving demo.");
    }
  };

  const handleDelete = async (id: any) => {
    if (confirm("Permanently remove this demo showcase?")) {
      await deleteDemo({ id });
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Demo <span className="gold-text">Manager</span></h1>
          <p>Control viral MVP deployments and showcase visibility.</p>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={styles.syncBtn} 
            onClick={handleSync}
            disabled={isSyncing}
          >
            <Zap size={20} className={isSyncing ? "animate-spin" : ""} /> 
            {isSyncing ? "Syncing..." : "Sync Portfolio"}
          </button>
          <button className={styles.addBtn} onClick={handleOpenCreate}>
            <Plus size={20} /> Add Demo
          </button>
        </div>
      </header>

      <div className={styles.demoGrid}>
        {demos.map((demo) => (
          <motion.div 
            key={demo._id} 
            className={styles.demoCard}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={styles.cardInfo}>
              <div className={styles.cardHeader}>
                <div className={styles.mainTitle}>
                  <h3>{demo.name}</h3>
                  {demo.featured && <Star size={14} className="gold-text" fill="currentColor" />}
                </div>
                <span className={styles.statusBadge} data-status={demo.status}>
                  {demo.status}
                </span>
              </div>
              
              <div className={styles.meta}>
                <div className={styles.metaItem}>
                  <Globe size={14} />
                  <span>{demo.slug}</span>
                </div>
                <div className={styles.metaItem}>
                  <Zap size={14} />
                  <span>{demo.category}</span>
                </div>
              </div>

              <p className={styles.description}>{demo.description}</p>

              <div className={styles.techStackSmall}>
                {demo.techStack.slice(0, 3).map((t: string) => (
                  <span key={t}>{t}</span>
                ))}
                {demo.techStack.length > 3 && <span>+{demo.techStack.length - 3}</span>}
              </div>
            </div>

            <div className={styles.actions}>
              <div className={styles.links}>
                <a href={demo.url} target="_blank" rel="noopener noreferrer" title="Live Preview" className={styles.iconLink}>
                  <Monitor size={18} />
                </a>
              </div>
              <div className={styles.buttonGroup}>
                <button className={styles.editBtn} onClick={() => handleOpenEdit(demo)}>
                  <Settings size={18} />
                </button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(demo._id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        
        {demos.length === 0 && (
          <div className={styles.empty}>
            <Monitor size={48} opacity={0.2} />
            <p>No active demos launched. Initialize your first MVP showcase.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <motion.div 
              className={styles.modal}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <h2>{editingDemo ? "Refine Demo" : "Launch New Demo"}</h2>
              
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Demo Name</label>
                    <input 
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="e.g. EcoMarket AI"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>URL Slug</label>
                    <input 
                      value={formData.slug}
                      onChange={e => setFormData({ ...formData, slug: e.target.value })}
                      required
                      placeholder="e-com-mvp"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Service URL</label>
                  <input 
                    value={formData.url}
                    onChange={e => setFormData({ ...formData, url: e.target.value })}
                    required
                    placeholder="https://..."
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Core Value Proposition (Description)</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Explain what makes this MVP unique..."
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Category</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Branch</label>
                    <input 
                      value={formData.branch}
                      onChange={e => setFormData({ ...formData, branch: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Tech Stack (comma separated)</label>
                  <input 
                    value={formData.techStack.join(", ")}
                    onChange={e => setFormData({ ...formData, techStack: e.target.value.split(",").map(t => t.trim()) })}
                    placeholder="Next.js, Tailwind, Convex..."
                  />
                </div>

                <div className={styles.checkbox} onClick={() => setFormData({ ...formData, featured: !formData.featured })}>
                  <div style={{ 
                    width: 20, height: 20, 
                    border: "2px solid var(--accent-gold)", 
                    borderRadius: 4,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: formData.featured ? "var(--accent-gold)" : "transparent"
                  }}>
                    {formData.featured && <Star size={12} color="#000" fill="currentColor" />}
                  </div>
                  <span>High Visibility Showcase</span>
                </div>

                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.saveBtn}>
                    {editingDemo ? "Update Showcase" : "Initialize Demo"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
