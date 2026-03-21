"use client";

import React, { useState } from "react";
import styles from "./AdminSEO.module.css";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Globe, Search, Save, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export const AdminSEO = () => {
  const metadata = useQuery(api.settings.listMetadata) || [];
  const updateMetadata = useMutation(api.settings.updateMetadata);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);

  const startEdit = (item: any) => {
    setEditingId(item._id);
    setFormData(item);
  };

  const handleSave = async () => {
    if (!formData) return;
    await updateMetadata({
      id: formData._id,
      route: formData.route,
      title: formData.title,
      description: formData.description,
      keywords: formData.keywords,
      ogImage: formData.ogImage,
    });
    setEditingId(null);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>SEO Command Center</h1>
          <p>Optimize how your pages appear in search results and on social media.</p>
        </div>
      </header>

      <div className={styles.grid}>
        {metadata.map((item) => (
          <motion.div 
            key={item._id} 
            className={`${styles.card} ${editingId === item._id ? styles.editing : ""}`}
            layout
          >
            <div className={styles.cardHeader}>
              <div className={styles.routeHeader}>
                <Globe size={18} className="gold-text" />
                <h3>{item.route}</h3>
              </div>
              <button 
                onClick={() => editingId === item._id ? handleSave() : startEdit(item)}
                className={styles.editBtn}
              >
                {editingId === item._id ? <Save size={18} /> : "Edit Snippet"}
              </button>
            </div>

            {editingId === item._id ? (
              <div className={styles.editor}>
                <label>Title Tag</label>
                <input 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
                <label>Meta Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
                <label>Keywords (comma separated)</label>
                <input 
                  value={formData.keywords || ""} 
                  onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                />
              </div>
            ) : (
              <div className={styles.preview}>
                <div className={styles.googlePreview}>
                  <p className={styles.googleUrl}>https://lrdene.com{item.route}</p>
                  <h4 className={styles.googleTitle}>{item.title}</h4>
                  <p className={styles.googleDesc}>{item.description}</p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
